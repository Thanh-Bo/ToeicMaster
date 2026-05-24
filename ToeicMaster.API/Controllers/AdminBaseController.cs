using System.Collections.Concurrent;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/admin")]
[Authorize]
public abstract class AdminBaseController : ControllerBase
{
    protected readonly AppDbContext _context;

    // Static dictionary to track background task status across requests
    protected static readonly ConcurrentDictionary<string, TaskStatusInfo> TaskStatusTracker = new();

    protected AdminBaseController(AppDbContext context)
    {
        _context = context;
    }

    protected int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    protected async Task<bool> IsAdminAsync()
    {
        var userId = GetUserId();
        var user = await _context.Users.FindAsync(userId);
        return user?.Role == "Admin";
    }

    // Task status tracking DTO
    protected class TaskStatusInfo
    {
        public string TaskId { get; set; } = "";
        public string Status { get; set; } = "processing";
        public int TotalItems { get; set; }
        public int CompletedItems { get; set; }
        public int ErrorItems { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
