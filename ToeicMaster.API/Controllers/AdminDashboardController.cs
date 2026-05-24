using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;

namespace ToeicMaster.API.Controllers;

public class AdminDashboardController : AdminBaseController
{
    public AdminDashboardController(AppDbContext context) : base(context) { }

    [HttpGet("tasks/{taskId}")]
    public IActionResult GetTaskStatus(string taskId)
    {
        if (TaskStatusTracker.TryGetValue(taskId, out var status))
        {
            return Ok(new
            {
                taskId = status.TaskId,
                status = status.Status,
                totalItems = status.TotalItems,
                completedItems = status.CompletedItems,
                errorItems = status.ErrorItems,
                progress = status.TotalItems > 0 ? (status.CompletedItems * 100 / status.TotalItems) : 0,
                startedAt = status.StartedAt,
                completedAt = status.CompletedAt,
                isComplete = status.Status == "completed"
            });
        }

        return NotFound(new { message = "Không tìm thấy task hoặc đã hết hạn" });
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        if (!await IsAdminAsync())
            return Forbid();

        var today = DateTime.UtcNow.Date;
        var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);

        var totalUsers = await _context.Users.CountAsync();
        var activeUsers = await _context.Users.CountAsync(u => u.IsActive);
        var newUsersToday = await _context.Users.CountAsync(u =>
            u.CreatedAt != null && u.CreatedAt.Value.Date == today);

        var totalTests = await _context.Tests.CountAsync();
        var totalQuestions = await _context.Questions.CountAsync();
        var totalAttempts = await _context.TestAttempts.CountAsync();
        var attemptsThisWeek = await _context.TestAttempts.CountAsync(ta =>
            ta.CompletedAt >= sevenDaysAgo);

        var recentAttempts = await _context
            .TestAttempts.OrderByDescending(ta => ta.CompletedAt)
            .Take(5)
            .Include(ta => ta.User)
            .Include(ta => ta.Test)
            .Select(ta => new
            {
                ta.Id,
                UserName = ta.User.FullName ?? "Unknown",
                TestTitle = ta.Test.Title,
                ta.TotalScore,
                ta.CompletedAt,
            })
            .ToListAsync();

        return Ok(new
        {
            totalUsers, activeUsers, newUsersToday,
            totalTests, totalQuestions, totalAttempts, attemptsThisWeek,
            recentAttempts,
        });
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetSystemStatistics()
    {
        if (!await IsAdminAsync())
            return Forbid();

        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);

        var userGrowth = await _context
            .Users.Where(u => u.CreatedAt >= thirtyDaysAgo)
            .GroupBy(u => u.CreatedAt!.Value.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date).ToListAsync();

        var attemptsTrend = await _context
            .TestAttempts.Where(ta => ta.CompletedAt >= thirtyDaysAgo)
            .GroupBy(ta => ta.CompletedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count(), AvgScore = g.Average(ta => ta.TotalScore) })
            .OrderBy(x => x.Date).ToListAsync();

        var scoreDistribution = await _context
            .TestAttempts.GroupBy(ta => (int)(ta.TotalScore / 100) * 100)
            .Select(g => new { ScoreRange = $"{g.Key}-{g.Key + 99}", Count = g.Count() })
            .OrderBy(x => x.ScoreRange).ToListAsync();

        return Ok(new { userGrowth, attemptsTrend, scoreDistribution });
    }
}
