using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Services;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/premium")]
[Authorize]
public class PremiumController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPremiumService _premiumService;

    public PremiumController(AppDbContext context, IPremiumService premiumService)
    {
        _context = context;
        _premiumService = premiumService;
    }

    [HttpPost("users/{userId:int}/grant")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GrantPremium(int userId, [FromBody] GrantPremiumRequest request)
    {
        if (request.DurationMonths < 1 || request.DurationMonths > 60)
        {
            return BadRequest(new
            {
                error = "DurationMonths must be between 1 and 60."
            });
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            return NotFound(new { error = "User not found" });
        }

        var previousExpiredAt = user.PremiumExpiredAt;
        var premiumExpiredAt = _premiumService.ExtendPremium(user, request.DurationMonths);

        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var note = string.IsNullOrWhiteSpace(request.Note)
            ? "Manual premium grant"
            : request.Note.Trim();

        _context.Transactions.Add(new Transaction
        {
            UserId = user.Id,
            Amount = 0,
            Content = $"Admin grant premium {request.DurationMonths} month(s). Note: {note}. AdminId: {adminId}",
            Status = "COMPLETED",
            PaymentGateway = "ManualAdmin",
            SubscriptionDurationMonths = request.DurationMonths,
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Premium granted successfully",
            userId = user.Id,
            user.Email,
            user.FullName,
            isPremium = user.IsPremium,
            previousExpiredAt,
            premiumExpiredAt,
            durationMonths = request.DurationMonths
        });
    }

    [HttpGet("users/{userId:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUserPremiumStatus(int userId)
    {
        var user = await _context.Users
            .AsNoTracking()
            .Where(u => u.Id == userId)
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.FullName,
                u.Role,
                u.IsPremium,
                u.PremiumExpiredAt
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(new { error = "User not found" });
        }

        return Ok(new
        {
            user.Id,
            user.Email,
            user.FullName,
            user.Role,
            isPremium = user.Role == "Admin" ||
                        (user.IsPremium == true &&
                         user.PremiumExpiredAt.HasValue &&
                         user.PremiumExpiredAt.Value > DateTime.UtcNow),
            premiumExpiredAt = user.PremiumExpiredAt
        });
    }

    [HttpDelete("users/{userId:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RevokePremium(int userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            return NotFound(new { error = "User not found" });
        }

        var previousExpiredAt = user.PremiumExpiredAt;
        user.IsPremium = false;
        user.PremiumExpiredAt = null;

        _context.Transactions.Add(new Transaction
        {
            UserId = user.Id,
            Amount = 0,
            Content = $"Admin revoked premium. AdminId: {User.FindFirstValue(ClaimTypes.NameIdentifier)}",
            Status = "COMPLETED",
            PaymentGateway = "ManualAdmin",
            SubscriptionDurationMonths = 0,
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Premium revoked successfully",
            userId = user.Id,
            user.Email,
            user.FullName,
            isPremium = user.IsPremium,
            previousExpiredAt,
            premiumExpiredAt = user.PremiumExpiredAt
        });
    }
}

public class GrantPremiumRequest
{
    public int DurationMonths { get; set; }
    public string? Note { get; set; }
}
