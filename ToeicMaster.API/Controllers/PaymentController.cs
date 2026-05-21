using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Services;

namespace ToeicMaster.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IPremiumService _premiumService;
        private readonly ISubscriptionPlanService _planService;
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public PaymentController(
            IPaymentService paymentService,
            IPremiumService premiumService,
            ISubscriptionPlanService planService,
            AppDbContext dbContext,
            IConfiguration configuration)
        {
            _paymentService = paymentService;
            _premiumService = premiumService;
            _planService = planService;
            _dbContext = dbContext;
            _configuration = configuration;
        }

        [HttpPost("initiate")]
        public async Task<IActionResult> InitiatePayment([FromBody] InitiatePaymentRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                if (userId == 0)
                    return Unauthorized("Invalid token");

                var plan = _planService.GetPlan(request.PlanId);
                if (plan == null)
                    return BadRequest(new { error = "Invalid subscription plan" });

                var userExists = await _dbContext.Users.AnyAsync(u => u.Id == userId);
                if (!userExists)
                    return NotFound(new { error = $"User with ID {userId} not found in database" });

                var transaction = new Transaction
                {
                    UserId = userId,
                    Amount = plan.Amount,
                    Content = plan.Name,
                    Status = "PENDING",
                    PaymentGateway = "PayOS",
                    SubscriptionDurationMonths = plan.DurationMonths,
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.Transactions.Add(transaction);
                await _dbContext.SaveChangesAsync();

                var paymentDescription = $"TOEIC TX{transaction.Id}";
                var frontendUrl = GetFrontendUrl();
                var payOsData = await _paymentService.CreatePaymentLinkAsync(
                    transaction.Id,
                    Convert.ToInt32(plan.Amount),
                    paymentDescription,
                    $"{frontendUrl}/subscription?payment=success&transactionId={transaction.Id}",
                    $"{frontendUrl}/subscription?payment=cancelled&transactionId={transaction.Id}",
                    plan.Name,
                    HttpContext.RequestAborted);

                transaction.Content = paymentDescription;
                await _dbContext.SaveChangesAsync();

                return Ok(new
                {
                    transactionId = transaction.Id,
                    amount = plan.Amount,
                    planId = plan.Id,
                    duration = plan.DurationMonths,
                    description = paymentDescription,
                    status = "PENDING",
                    provider = "PayOS",
                    checkoutUrl = payOsData.CheckoutUrl,
                    qrCode = payOsData.QrCode,
                    qrUrl = BuildQrImageUrl(payOsData.QrCode),
                    bankInfo = new
                    {
                        bankName = payOsData.Bin,
                        accountNumber = payOsData.AccountNumber,
                        accountHolder = payOsData.AccountName,
                        bankCode = payOsData.Bin
                    },
                    paymentLinkId = payOsData.PaymentLinkId,
                    transferData = payOsData.QrCode,
                    message = "PayOS payment link created."
                });
            }
            catch (Exception ex)
            {
                var errorMessage = ex.Message;
                if (ex.InnerException != null)
                    errorMessage += " | Inner: " + ex.InnerException.Message;

                Console.WriteLine($"Payment Error: {errorMessage}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                return StatusCode(500, new { error = errorMessage, innerError = ex.InnerException?.Message });
            }
        }

        [HttpGet("status/{transactionId}")]
        public async Task<IActionResult> GetPaymentStatus(int transactionId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                if (userId == 0)
                    return Unauthorized("Invalid token");

                var transaction = await _dbContext.Transactions
                    .FirstOrDefaultAsync(t => t.Id == transactionId && t.UserId == userId);

                if (transaction == null)
                    return NotFound(new { error = "Transaction not found" });

                return Ok(new
                {
                    transactionId = transaction.Id,
                    amount = transaction.Amount,
                    status = transaction.Status,
                    createdAt = transaction.CreatedAt,
                    isPaid = transaction.Status == "COMPLETED" || transaction.Status == "SUCCESS"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> HandleBankWebhook([FromBody] PayOsWebhookRequest webhookData)
        {
            if (!_paymentService.IsValidWebhook(webhookData))
            {
                Console.WriteLine("[PAYOS WEBHOOK] Invalid signature - rejected");
                return Unauthorized(new { error = "Invalid payOS signature" });
            }

            try
            {
                var data = webhookData.Data!;
                var orderCode = GetLong(data, "orderCode");
                var amount = GetDecimal(data, "amount");
                var payOsCode = GetString(data, "code");
                var payOsDescription = GetString(data, "description");
                var paymentLinkId = GetString(data, "paymentLinkId");

                if (IsPayOsSetupWebhook(orderCode, amount, payOsDescription, paymentLinkId))
                {
                    Console.WriteLine($"[PAYOS WEBHOOK] Setup webhook acknowledged. OrderCode={orderCode}");
                    return Ok(new { message = "PayOS webhook setup acknowledged" });
                }

                if (orderCode <= 0)
                {
                    Console.WriteLine("[PAYOS WEBHOOK] Missing orderCode");
                    return Ok(new { message = "Webhook ignored: missing orderCode" });
                }

                var transaction = await _dbContext.Transactions
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.Id == orderCode);

                if (transaction == null)
                {
                    Console.WriteLine($"[PAYOS WEBHOOK] Transaction not found: {orderCode}. Acknowledged for payOS webhook setup/testing.");
                    return Ok(new { message = "Webhook acknowledged: transaction not found", orderCode });
                }

                if (!string.Equals(transaction.PaymentGateway, "PayOS", StringComparison.OrdinalIgnoreCase))
                {
                    Console.WriteLine($"[PAYOS WEBHOOK] Ignored non-PayOS transaction id collision. OrderCode={orderCode}");
                    return Ok(new { message = "Webhook acknowledged: transaction is not PayOS", orderCode });
                }

                if (!webhookData.Success ||
                    !string.Equals(webhookData.Code, "00", StringComparison.OrdinalIgnoreCase) ||
                    !string.Equals(payOsCode, "00", StringComparison.OrdinalIgnoreCase))
                {
                    Console.WriteLine($"[PAYOS WEBHOOK] Ignored non-success payment. OrderCode={orderCode}, Code={webhookData.Code}, DataCode={payOsCode}");
                    return Ok(new { message = "Webhook ignored: payment is not successful", orderCode });
                }

                if (Math.Abs(transaction.Amount - amount) > 0.01m)
                {
                    Console.WriteLine($"[PAYOS WEBHOOK] Amount mismatch: Expected {transaction.Amount}, Got {amount}");
                    return BadRequest(new { error = "Amount mismatch", expected = transaction.Amount, received = amount });
                }

                if (transaction.Status == "COMPLETED" || transaction.Status == "SUCCESS")
                {
                    Console.WriteLine($"[PAYOS WEBHOOK] Transaction already completed: {orderCode}");
                    return Ok(new { message = "Transaction already processed", transactionId = transaction.Id });
                }

                transaction.Status = "COMPLETED";
                transaction.PaymentGateway = "PayOS";
                transaction.Content = payOsDescription ?? transaction.Content;
                _dbContext.Transactions.Update(transaction);

                if (transaction.User != null && transaction.SubscriptionDurationMonths.HasValue)
                {
                    _premiumService.ExtendPremium(transaction.User, transaction.SubscriptionDurationMonths.Value);
                    _dbContext.Users.Update(transaction.User);
                    Console.WriteLine($"[PAYOS WEBHOOK] Updated user {transaction.UserId} premium status. Expires: {transaction.User.PremiumExpiredAt}");
                }

                await _dbContext.SaveChangesAsync();

                Console.WriteLine($"[PAYOS WEBHOOK] Payment confirmed successfully. TransactionId={transaction.Id}, UserId={transaction.UserId}");

                return Ok(new
                {
                    message = "Payment confirmed successfully",
                    transactionId = transaction.Id,
                    orderCode,
                    paymentLinkId,
                    status = transaction.Status,
                    userPremiumStatus = transaction.User?.IsPremium,
                    premiumExpiredAt = transaction.User?.PremiumExpiredAt
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PAYOS WEBHOOK] Error processing webhook: {ex.Message}");
                Console.WriteLine($"[PAYOS WEBHOOK] Stack Trace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Webhook processing failed", details = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("confirm/{transactionId}")]
        public async Task<IActionResult> ConfirmPayment(int transactionId, [FromBody] ConfirmPaymentRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                if (userId == 0)
                    return Unauthorized("Invalid token");

                var transaction = await _dbContext.Transactions
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.Id == transactionId);

                if (transaction == null)
                    return NotFound(new { error = "Transaction not found" });

                if (request.Amount != transaction.Amount)
                    return BadRequest(new { error = "Amount mismatch" });

                transaction.Status = "COMPLETED";
                _dbContext.Transactions.Update(transaction);

                if (transaction.User != null && transaction.SubscriptionDurationMonths.HasValue)
                {
                    _premiumService.ExtendPremium(transaction.User, transaction.SubscriptionDurationMonths.Value);
                    _dbContext.Users.Update(transaction.User);
                }

                await _dbContext.SaveChangesAsync();

                return Ok(new
                {
                    message = "Payment confirmed successfully",
                    transactionId = transaction.Id,
                    status = transaction.Status
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("bank-info")]
        [AllowAnonymous]
        public IActionResult GetBankInfo()
        {
            return Ok(new
            {
                provider = "PayOS"
            });
        }

        [HttpGet("plans")]
        [AllowAnonymous]
        public IActionResult GetPlans()
        {
            return Ok(_planService.GetPlans().Select(plan => new
            {
                planId = plan.Id,
                name = plan.Name,
                amount = plan.Amount,
                duration = plan.DurationMonths
            }));
        }

        private string GetFrontendUrl()
        {
            var configuredUrl = _configuration["FrontendUrl"] ?? _configuration["FRONTEND_URL"];
            if (!string.IsNullOrWhiteSpace(configuredUrl))
                return configuredUrl.TrimEnd('/');

            if (Request.Headers.TryGetValue("Origin", out var origin) && !string.IsNullOrWhiteSpace(origin))
                return origin.ToString().TrimEnd('/');

            return "http://localhost:3000";
        }

        private static string? BuildQrImageUrl(string? qrCode)
        {
            return string.IsNullOrWhiteSpace(qrCode)
                ? null
                : $"https://api.qrserver.com/v1/create-qr-code/?size=240x240&data={Uri.EscapeDataString(qrCode)}";
        }

        private static string? GetString(IReadOnlyDictionary<string, JsonElement> data, string key)
        {
            return data.TryGetValue(key, out var value) && value.ValueKind == JsonValueKind.String
                ? value.GetString()
                : value.ValueKind is JsonValueKind.Number or JsonValueKind.True or JsonValueKind.False
                    ? value.GetRawText()
                    : null;
        }

        private static long GetLong(IReadOnlyDictionary<string, JsonElement> data, string key)
        {
            return data.TryGetValue(key, out var value) && value.TryGetInt64(out var result) ? result : 0;
        }

        private static decimal GetDecimal(IReadOnlyDictionary<string, JsonElement> data, string key)
        {
            return data.TryGetValue(key, out var value) && value.TryGetDecimal(out var result) ? result : 0m;
        }

        private static bool IsPayOsSetupWebhook(
            long orderCode,
            decimal amount,
            string? description,
            string? paymentLinkId)
        {
            return orderCode == 123 &&
                   amount == 3000m &&
                   string.Equals(description, "VQRIO123", StringComparison.OrdinalIgnoreCase) &&
                   string.Equals(paymentLinkId, "124c33293c43417ab7879e14c8d9eb18", StringComparison.OrdinalIgnoreCase);
        }
    }

    public class InitiatePaymentRequest
    {
        public string? PlanId { get; set; }
    }

    public class ConfirmPaymentRequest
    {
        public decimal Amount { get; set; }
        public string? TransactionReference { get; set; }
    }

}
