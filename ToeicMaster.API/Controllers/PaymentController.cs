using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
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
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public PaymentController(IPaymentService paymentService, AppDbContext dbContext, IConfiguration configuration)
        {
            _paymentService = paymentService;
            _dbContext = dbContext;
            _configuration = configuration;
        }

        /// <summary>
        /// Initiate a payment - creates transaction and generates QR code
        /// </summary>
        [HttpPost("initiate")]
        public async Task<IActionResult> InitiatePayment([FromBody] InitiatePaymentRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                if (userId == 0)
                    return Unauthorized("Invalid token");

                // Validate request
                if (request.Amount <= 0)
                    return BadRequest(new { error = "Amount must be greater than 0" });

                if (string.IsNullOrWhiteSpace(request.Description))
                    return BadRequest(new { error = "Description is required" });

                // CHECK: Verify user exists in database
                var userExists = await _dbContext.Users.AnyAsync(u => u.Id == userId);
                if (!userExists)
                    return NotFound(new { error = $"User with ID {userId} not found in database" });

                // Create transaction record
                var transaction = new Transaction
                {
                    UserId = userId,
                    Amount = request.Amount,
                    Content = request.Description,
                    Status = "PENDING",
                    PaymentGateway = "SacomBank",
                    SubscriptionDurationMonths = request.Duration,
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.Transactions.Add(transaction);
                await _dbContext.SaveChangesAsync();

                // Generate VietQR URL (cross-platform, no System.Drawing)
                var (vietQrUrl, transferData) = _paymentService.GenerateVietQR(
                    userId,
                    request.Amount,
                    request.Description,
                    transaction.Id
                );

                var bankInfo = _paymentService.GetBankAccountInfo();

                return Ok(new
                {
                    transactionId = transaction.Id,
                    amount = request.Amount,
                    description = request.Description,
                    status = "PENDING",
                    qrUrl = vietQrUrl,  // direct VietQR image URL — use in <img src>
                    bankInfo = new
                    {
                        bankName = bankInfo.BankName,
                        accountNumber = bankInfo.AccountNumber,
                        accountHolder = bankInfo.AccountHolder,
                        bankCode = bankInfo.BankCode
                    },
                    transferData = transferData,
                    message = "Payment initiated. Please scan QR code or transfer manually."
                });
            }
            catch (Exception ex)
            {
                // Log the full exception including inner exceptions
                var errorMessage = ex.Message;
                if (ex.InnerException != null)
                    errorMessage += " | Inner: " + ex.InnerException.Message;
                
                Console.WriteLine($"Payment Error: {errorMessage}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                
                return StatusCode(500, new { error = errorMessage, innerError = ex.InnerException?.Message });
            }
        }

        /// <summary>
        /// Get payment status
        /// </summary>
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

        /// <summary>
        /// Bank webhook endpoint - receives payment confirmation from bank
        /// </summary>
        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> HandleBankWebhook([FromBody] BankWebhookRequest webhookData)
        {
            // Verify webhook secret to prevent fake payment confirmations
            var expectedSecret = _configuration["WebhookSecret"];
            if (!string.IsNullOrEmpty(expectedSecret))
            {
                Request.Headers.TryGetValue("X-Webhook-Secret", out var receivedSecret);
                if (receivedSecret != expectedSecret)
                {
                    Console.WriteLine("[WEBHOOK] Invalid secret — rejected");
                    return Unauthorized(new { error = "Invalid webhook secret" });
                }
            }

            try
            {
                // Log webhook received
                Console.WriteLine($"[WEBHOOK] Received payment webhook: TransactionRef={webhookData.TransactionReference}, Amount={webhookData.Amount}, Status={webhookData.Status}");

                // Find transaction by reference
                var transaction = await _dbContext.Transactions
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.Id == webhookData.TransactionId);

                if (transaction == null)
                {
                    Console.WriteLine($"[WEBHOOK] Transaction not found: {webhookData.TransactionId}");
                    return NotFound(new { error = "Transaction not found" });
                }

                // Verify amount matches
                if (Math.Abs(transaction.Amount - webhookData.Amount) > 0.01m)
                {
                    Console.WriteLine($"[WEBHOOK] Amount mismatch: Expected {transaction.Amount}, Got {webhookData.Amount}");
                    return BadRequest(new { error = "Amount mismatch", expected = transaction.Amount, received = webhookData.Amount });
                }

                // Check if already processed
                if (transaction.Status == "COMPLETED" || transaction.Status == "SUCCESS")
                {
                    Console.WriteLine($"[WEBHOOK] Transaction already completed: {webhookData.TransactionId}");
                    return Ok(new { message = "Transaction already processed", transactionId = transaction.Id });
                }

                // Update transaction status
                transaction.Status = "COMPLETED";
                transaction.PaymentGateway = webhookData.PaymentGateway ?? "SacomBank";
                _dbContext.Transactions.Update(transaction);

                // Update user subscription/premium status
                if (transaction.User != null && transaction.SubscriptionDurationMonths.HasValue)
                {
                    var durationMonths = transaction.SubscriptionDurationMonths.Value;
                    
                    transaction.User.IsPremium = true;
                    
                    // Calculate premium expiry date
                    if (transaction.User.PremiumExpiredAt.HasValue && transaction.User.PremiumExpiredAt > DateTime.UtcNow)
                    {
                        // Extend existing subscription
                        transaction.User.PremiumExpiredAt = transaction.User.PremiumExpiredAt.Value.AddMonths(durationMonths);
                    }
                    else
                    {
                        // New subscription
                        transaction.User.PremiumExpiredAt = DateTime.UtcNow.AddMonths(durationMonths);
                    }

                    _dbContext.Users.Update(transaction.User);
                    Console.WriteLine($"[WEBHOOK] Updated user {transaction.UserId} premium status. Expires: {transaction.User.PremiumExpiredAt}");
                }

                await _dbContext.SaveChangesAsync();

                Console.WriteLine($"[WEBHOOK] Payment confirmed successfully. TransactionId={transaction.Id}, UserId={transaction.UserId}");

                return Ok(new
                {
                    message = "Payment confirmed successfully",
                    transactionId = transaction.Id,
                    status = transaction.Status,
                    userPremiumStatus = transaction.User?.IsPremium,
                    premiumExpiredAt = transaction.User?.PremiumExpiredAt
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[WEBHOOK] Error processing webhook: {ex.Message}");
                Console.WriteLine($"[WEBHOOK] Stack Trace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Webhook processing failed", details = ex.Message });
            }
        }

        /// <summary>
        /// Manual payment confirmation (fallback for admin)
        /// </summary>
        [Authorize(Roles = "Admin")]  // Only admins can manually confirm payments
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
                    .FirstOrDefaultAsync(t => t.Id == transactionId && t.UserId == userId);

                if (transaction == null)
                    return NotFound(new { error = "Transaction not found" });

                // Verify amount matches
                if (request.Amount != transaction.Amount)
                    return BadRequest(new { error = "Amount mismatch" });

                // Update transaction status
                transaction.Status = "COMPLETED";
                _dbContext.Transactions.Update(transaction);

                // Update user subscription
                if (transaction.User != null && transaction.SubscriptionDurationMonths.HasValue)
                {
                    transaction.User.IsPremium = true;
                    transaction.User.PremiumExpiredAt = DateTime.UtcNow.AddMonths(transaction.SubscriptionDurationMonths.Value);
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

        /// <summary>
        /// Get bank account info for display
        /// </summary>
        [HttpGet("bank-info")]
        [AllowAnonymous]
        public IActionResult GetBankInfo()
        {
            var bankInfo = _paymentService.GetBankAccountInfo();
            return Ok(new
            {
                bankName = bankInfo.BankName,
                accountNumber = bankInfo.AccountNumber,
                accountHolder = bankInfo.AccountHolder,
                bankCode = bankInfo.BankCode
            });
        }
    }

    // Request/Response DTOs
    public class InitiatePaymentRequest
    {
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; } // Duration in months (1, 3, 6, 12)
    }

    public class ConfirmPaymentRequest
    {
        public decimal Amount { get; set; }
        public string TransactionReference { get; set; }
    }

    /// <summary>
    /// Bank webhook payload structure
    /// </summary>
    public class BankWebhookRequest
    {
        public int TransactionId { get; set; }
        public string TransactionReference { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } // SUCCESS, FAILED, PENDING, etc.
        public string PaymentGateway { get; set; }
        public DateTime TransactionDate { get; set; }
        public string SenderAccountNumber { get; set; }
        public string SenderName { get; set; }
        public string Description { get; set; }
    }
}
