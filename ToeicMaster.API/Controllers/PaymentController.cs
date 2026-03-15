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

        public PaymentController(IPaymentService paymentService, AppDbContext dbContext)
        {
            _paymentService = paymentService;
            _dbContext = dbContext;
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

                // Generate QR code
                var (qrCodeBase64, transferData) = _paymentService.GenerateQRCode(
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
                    qrCode = qrCodeBase64,
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
        /// Confirm payment (admin webhook or manual confirmation)
        /// In real implementation, this would be called by bank webhook
        /// </summary>
        [HttpPost("confirm/{transactionId}")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmPayment(int transactionId, [FromBody] ConfirmPaymentRequest request)
        {
            try
            {
                var transaction = await _dbContext.Transactions
                    .FirstOrDefaultAsync(t => t.Id == transactionId);

                if (transaction == null)
                    return NotFound(new { error = "Transaction not found" });

                // Verify amount matches
                if (request.Amount != transaction.Amount)
                    return BadRequest(new { error = "Amount mismatch" });

                // Update transaction status
                transaction.Status = "COMPLETED";
                _dbContext.Transactions.Update(transaction);
                await _dbContext.SaveChangesAsync();

                // TODO: Update user subscription/premium status here
                // Handle the premium upgrade based on amount

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
}
