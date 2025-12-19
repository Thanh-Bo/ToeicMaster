using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToeicMaster.API.Data;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class LeaderboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public LeaderboardController(AppDbContext context)
    {
        _context = context;
    }

    private int? GetUserIdOptional()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return string.IsNullOrEmpty(userIdClaim) ? null : int.Parse(userIdClaim);
    }

    /// <summary>
    /// Lấy bảng xếp hạng người dùng
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetLeaderboard(
        [FromQuery] string timeRange = "all",
        [FromQuery] int limit = 50)
    {
        var currentUserId = GetUserIdOptional();

        // Xác định khoảng thời gian
        DateTime? startDate = timeRange switch
        {
            "week" => DateTime.UtcNow.AddDays(-7),
            "month" => DateTime.UtcNow.AddMonths(-1),
            _ => null
        };

        // Query attempts
        var attemptsQuery = _context.TestAttempts
            .Include(ta => ta.User)
            .Where(ta => ta.User.IsActive);

        if (startDate.HasValue)
        {
            attemptsQuery = attemptsQuery.Where(ta => ta.CompletedAt >= startDate.Value);
        }

        // Group by user và tính toán stats
        var leaderboardData = await attemptsQuery
            .GroupBy(ta => new 
            { 
                ta.UserId, 
                ta.User.FullName, 
                ta.User.AvatarUrl 
            })
            .Select(g => new
            {
                UserId = g.Key.UserId,
                FullName = g.Key.FullName ?? "Anonymous",
                AvatarUrl = g.Key.AvatarUrl,
                TotalScore = g.Sum(ta => ta.TotalScore),
                TotalTests = g.Count(),
                AverageScore = g.Average(ta => ta.TotalScore),
                HighestScore = g.Max(ta => ta.TotalScore),
                ListeningAvg = g.Average(ta => ta.ListeningScore ?? 0),
                ReadingAvg = g.Average(ta => ta.ReadingScore ?? 0)
            })
            .OrderByDescending(x => x.TotalScore)
            .Take(limit)
            .ToListAsync();

        // Thêm rank
        var rankedLeaderboard = leaderboardData
            .Select((item, index) => new
            {
                Rank = index + 1,
                item.UserId,
                item.FullName,
                item.AvatarUrl,
                item.TotalScore,
                item.TotalTests,
                AverageScore = Math.Round(item.AverageScore),
                item.HighestScore,
                ListeningAvg = Math.Round(item.ListeningAvg),
                ReadingAvg = Math.Round(item.ReadingAvg)
            })
            .ToList();

        // Tìm rank của current user
        int? currentUserRank = null;
        if (currentUserId.HasValue)
        {
            var userEntry = rankedLeaderboard.FirstOrDefault(x => x.UserId == currentUserId.Value);
            if (userEntry != null)
            {
                currentUserRank = userEntry.Rank;
            }
            else
            {
                // User không trong top, tính rank riêng
                var userTotalScore = await _context.TestAttempts
                    .Where(ta => ta.UserId == currentUserId.Value)
                    .Where(ta => !startDate.HasValue || ta.CompletedAt >= startDate.Value)
                    .SumAsync(ta => ta.TotalScore);

                if (userTotalScore > 0)
                {
                    // Đếm số người có điểm cao hơn
                    var query = _context.TestAttempts
                        .Where(ta => ta.User.IsActive);

                    if (startDate.HasValue)
                    {
                        query = query.Where(ta => ta.CompletedAt >= startDate.Value);
                    }

                    var usersWithHigherScore = await query
                        .GroupBy(ta => ta.UserId)
                        .Where(g => g.Sum(ta => ta.TotalScore) > userTotalScore)
                        .CountAsync();

                    currentUserRank = usersWithHigherScore + 1;
                }
            }
        }

        return Ok(new
        {
            items = rankedLeaderboard,
            totalCount = rankedLeaderboard.Count,
            currentUserRank,
            timeRange
        });
    }

    /// <summary>
    /// Lấy thống kê của một user cụ thể
    /// </summary>
    [HttpGet("user/{userId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetUserStats(int userId)
    {
        var user = await _context.Users
            .Where(u => u.Id == userId && u.IsActive)
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound("Không tìm thấy người dùng");

        var stats = await _context.TestAttempts
            .Where(ta => ta.UserId == userId)
            .GroupBy(ta => 1)
            .Select(g => new
            {
                TotalTests = g.Count(),
                TotalScore = g.Sum(ta => ta.TotalScore),
                AverageScore = g.Average(ta => ta.TotalScore),
                HighestScore = g.Max(ta => ta.TotalScore),
                ListeningAvg = g.Average(ta => ta.ListeningScore ?? 0),
                ReadingAvg = g.Average(ta => ta.ReadingScore ?? 0)
            })
            .FirstOrDefaultAsync();

        // Tính rank
        var userTotalScore = stats?.TotalScore ?? 0;
        var usersWithHigherScore = await _context.TestAttempts
            .Where(ta => ta.User.IsActive)
            .GroupBy(ta => ta.UserId)
            .Where(g => g.Sum(ta => ta.TotalScore) > userTotalScore)
            .CountAsync();

        return Ok(new
        {
            userId = user.Id,
            fullName = user.FullName,
            avatarUrl = user.AvatarUrl,
            rank = usersWithHigherScore + 1,
            totalTests = stats?.TotalTests ?? 0,
            totalScore = stats?.TotalScore ?? 0,
            averageScore = Math.Round(stats?.AverageScore ?? 0),
            highestScore = stats?.HighestScore ?? 0,
            listeningAvg = Math.Round(stats?.ListeningAvg ?? 0),
            readingAvg = Math.Round(stats?.ReadingAvg ?? 0)
        });
    }
}
