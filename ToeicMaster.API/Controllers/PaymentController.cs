using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models;
using ToeicMaster.API.Services;

namespace ToeicMaster.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        
        private readonly MoMoService _momoService;
        private readonly AppDbContext _context;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController( MoMoService momoService, AppDbContext context, ILogger<PaymentController> logger)
        {
          
            _momoService = momoService;
            _context = context;
            _logger = logger;
        }

        // Bảng giá packages
        private readonly Dictionary<string, (long Price, int Months)> PriceList = new()
        {
            { "Starter", (49000, 1) },
            { "Standard", (99000, 3) },
            { "Pro", (149000, 6) },
            { "Master", (349000, 12) }
        };

        /// <summary>
        /// Tạo payment link (MoMo)
        /// POST /api/v1/payment/create
        /// </summary>
        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
        {
            try
            {
                // Validate package
                if (!PriceList.ContainsKey(request.PackageType))
                    return BadRequest(new { error = "Gói không hợp lệ" });

                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(userIdStr, out var userId))
                    return Unauthorized();

                var (price, months) = PriceList[request.PackageType];

                // Tạo payment record
                var payment = new Payment
                {
                    UserId = userId,
                    Amount = (int)price,
                    PackageType = request.PackageType,
                    DurationMonths = months,
                    OrderInfo = $"Premium {request.PackageType} - {months} tháng",
                    PaymentStatus = "PENDING",
                    TransactionNo = $"TOEIC_{DateTime.Now.Ticks}",
                    PaymentMethod = "MoMo"
                };

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                // Lấy config URLs
                var config = this.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
                var returnUrl = config["MoMo:ReturnUrl"];
                var notifyUrl = config["MoMo:NotifyUrl"];

                // Tạo MoMo payment request
                var momoResponse = await _momoService.CreatePaymentAsync(
                    payment.Id,
                    price,
                    payment.OrderInfo,
                    returnUrl,
                    notifyUrl
                );

                if (momoResponse == null || momoResponse.resultCode != 0)
                {
                    _logger.LogError($"MoMo API error: {momoResponse?.resultMessage}");
                    return BadRequest(new { error = momoResponse?.resultMessage ?? "Lỗi tạo link thanh toán" });
                }

                _logger.LogInformation($"Payment created: OrderId={payment.Id}, Amount={price}, Package={request.PackageType}, PayUrl={momoResponse.payUrl}");

                return Ok(new CreatePaymentResponse
                {
                    Success = true,
                    Message = "Tạo link thanh toán thành công",
                    PaymentUrl = momoResponse.payUrl,
                    QrCode = momoResponse.qrCodeUrl,
                    Deeplink = momoResponse.deeplink,
                    OrderId = payment.Id
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating payment: {ex.Message}");
                return StatusCode(500, new { error = "Lỗi tạo link thanh toán" });
            }
        }

        /// <summary>
        /// Callback từ MoMo (IPN - Instant Payment Notification)
        /// POST /api/v1/payment/momo-callback
        /// </summary>
        [HttpPost("momo-callback")]
        [AllowAnonymous]
        public async Task<IActionResult> MoMoCallback([FromBody] MoMoIpnRequest request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new { resultCode = 1, resultMessage = "Invalid request" });

                _logger.LogInformation($"MoMo IPN received: OrderId={request.orderId}, ResultCode={request.resultCode}");

                // Xác thực signature
                var responseData = new Dictionary<string, object>
                {
                    { "accessKey", request.accessKey },
                    { "amount", request.amount },
                    { "extraData", request.extraData },
                    { "message", request.message },
                    { "orderId", request.orderId },
                    { "orderInfo", request.orderInfo },
                    { "orderType", request.orderType },
                    { "partnerCode", request.partnerCode },
                    { "payType", request.payType },
                    { "requestId", request.requestId },
                    { "responseTime", request.responseTime },
                    { "resultCode", request.resultCode },
                    { "transId", request.transId }
                };

                if (!_momoService.VerifyIpnSignature(responseData, request.signature))
                {
                    _logger.LogWarning($"Invalid MoMo signature for OrderId={request.orderId}");
                    return Ok(new { resultCode = 1, resultMessage = "Invalid signature" });
                }

                // Tìm payment record
                var payment = await _context.Payments.FirstOrDefaultAsync(p => p.Id == int.Parse(request.orderId.ToString()));
                if (payment == null)
                {
                    _logger.LogWarning($"Payment not found: OrderId={request.orderId}");
                    return Ok(new { resultCode = 1, resultMessage = "Payment not found" });
                }

                // Cập nhật payment status
                payment.ResponseCode = request.resultCode.ToString();
                payment.ResponseMessage = request.message;

                if (request.resultCode == 0) // Success
                {
                    payment.PaymentStatus = "SUCCESS";
                    payment.PaidAt = DateTime.UtcNow;
                    payment.IsSubscriptionActive = true;

                    // Set subscription dates
                    payment.SubscriptionStartDate = DateTime.UtcNow;
                    payment.SubscriptionEndDate = DateTime.UtcNow.AddMonths(payment.DurationMonths);

                    // Update user premium status - TỰ ĐỘNG KÍCH HOẠT
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == payment.UserId);
                    if (user != null)
                    {
                        user.IsPremium = true;
                        user.PremiumExpiredAt = payment.SubscriptionEndDate;
                        _logger.LogInformation($"User {user.Id} premium activated until {payment.SubscriptionEndDate}");
                    }

                    _logger.LogInformation($"Payment SUCCESS: OrderId={payment.Id}, TransId={request.transId}, Amount={payment.Amount}");
                }
                else
                {
                    payment.PaymentStatus = "FAILED";
                    _logger.LogWarning($"Payment FAILED: OrderId={payment.Id}, ResultCode={request.resultCode}, Message={request.message}");
                }

                await _context.SaveChangesAsync();

                // Trả về success để MoMo biết đã nhận callback
                return Ok(new { resultCode = 0, resultMessage = "Success" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error processing MoMo callback: {ex.Message}");
                return Ok(new { resultCode = 99, resultMessage = ex.Message });
            }
        }

        
        /// <summary>
        /// Lấy status của payment
        /// GET /api/v1/payment/{paymentId}/status
        /// </summary>
        [HttpGet("{paymentId}/status")]
        [Authorize]
        public async Task<IActionResult> GetPaymentStatus(int paymentId)
        {
            try
            {
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(userIdStr, out var userId))
                    return Unauthorized();

                var payment = await _context.Payments
                    .FirstOrDefaultAsync(p => p.Id == paymentId && p.UserId == userId);

                if (payment == null)
                    return NotFound(new { error = "Không tìm thấy giao dịch" });

                return Ok(new PaymentStatusResponse
                {
                    PaymentId = payment.Id,
                    TransactionNo = payment.TransactionNo,
                    Status = payment.PaymentStatus,
                    Message = payment.ResponseMessage,
                    CreatedAt = payment.CreatedAt,
                    PaidAt = payment.PaidAt,
                    Amount = payment.Amount,
                    PackageType = payment.PackageType
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting payment status: {ex.Message}");
                return StatusCode(500, new { error = "Lỗi lấy thông tin giao dịch" });
            }
        }

        /// <summary>
        /// Lấy danh sách gói premium
        /// GET /api/v1/payment/packages
        /// </summary>
        [HttpGet("packages")]
        [AllowAnonymous]
        public IActionResult GetPackages()
        {
            var packages = PriceList.Select(p => new
            {
                name = p.Key,
                price = p.Value.Price,
                duration = p.Value.Months,
                pricePerMonth = Math.Round((decimal)p.Value.Price / p.Value.Months, 0)
            }).ToList();

            return Ok(packages);
        }
    }
}
