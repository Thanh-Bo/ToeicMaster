using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/users/{userId}/vocabulary")]
[Authorize]
public class VocabularyStatsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<VocabularyStatsController> _logger;

    public VocabularyStatsController(AppDbContext context, ILogger<VocabularyStatsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/v1/users/{userId}/vocabulary/stats
    /// Get all vocabulary stats for user
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats(int userId)
    {
        try
        {
            // Verify user is requesting their own data
            var currentUserId = GetCurrentUserId();
            if (currentUserId != userId)
                return Forbid();

            // Total topics learned (distinct topics with status > 0)
            var totalTopicsLearned = await _context.UserVocabularies
                .Where(uv => uv.UserId == userId && uv.Status > 0)
                .Select(uv => uv.Vocabulary.TopicId)
                .Distinct()
                .CountAsync();

            // Total vocab learned (status > 0)
            var totalVocabLearned = await _context.UserVocabularies
                .Where(uv => uv.UserId == userId && uv.Status > 0)
                .CountAsync();

            // Review due (NextReviewAt <= now)
            var now = DateTime.UtcNow;
            var reviewDue = await _context.UserVocabularies
                .Where(uv => uv.UserId == userId && uv.NextReviewAt <= now)
                .CountAsync();

            // Total study time in minutes
            var totalTimeSeconds = await _context.UserActivityVocabSessions
                .Where(s => s.UserId == userId && s.DurationSeconds.HasValue)
                .SumAsync(s => (int?)s.DurationSeconds) ?? 0;
            var totalTimeMinutes = totalTimeSeconds / 60;

            // Get streak
            var streak = await GetOrCreateStreak(userId);

            return Ok(new
            {
                totalTopicsLearned,
                totalVocabLearned,
                reviewDue,
                totalTimeMinutes,
                streak = new
                {
                    current = streak.CurrentStreak,
                    longest = streak.LongestStreak
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting vocab stats for user {userId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy thống kê từ vựng" });
        }
    }

    /// <summary>
    /// POST /api/v1/users/{userId}/vocabulary/sessions/start
    /// Start a new study session
    /// </summary>
    [HttpPost("sessions/start")]
    public async Task<IActionResult> StartSession(int userId)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId != userId)
                return Forbid();

            // Update streak when starting session
            await UpdateStreak(userId);

            var session = new UserActivityVocabSession
            {
                UserId = userId,
                StartTime = DateTime.UtcNow,
                Date = DateTime.UtcNow.Date
            };

            _context.UserActivityVocabSessions.Add(session);
            await _context.SaveChangesAsync();

            return Ok(new { sessionId = session.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error starting vocab session for user {userId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi bắt đầu phiên học" });
        }
    }

    /// <summary>
    /// POST /api/v1/users/{userId}/vocabulary/sessions/{sessionId}/end
    /// End a study session
    /// </summary>
    [HttpPost("sessions/{sessionId}/end")]
    public async Task<IActionResult> EndSession(int userId, int sessionId)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId != userId)
                return Forbid();

            var session = await _context.UserActivityVocabSessions
                .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

            if (session == null)
                return NotFound(new { error = "Phiên học không tồn tại" });

            if (session.EndTime.HasValue)
                return BadRequest(new { error = "Phiên học đã kết thúc" });

            session.EndTime = DateTime.UtcNow;
            session.DurationSeconds = (int)(session.EndTime.Value - session.StartTime).TotalSeconds;

            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                sessionId = session.Id,
                durationSeconds = session.DurationSeconds 
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error ending vocab session {sessionId} for user {userId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi kết thúc phiên học" });
        }
    }

    /// <summary>
    /// GET /api/v1/users/{userId}/vocabulary/streak
    /// Get streak info
    /// </summary>
    [HttpGet("streak")]
    public async Task<IActionResult> GetStreak(int userId)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId != userId)
                return Forbid();

            var streak = await GetOrCreateStreak(userId);

            return Ok(new
            {
                current = streak.CurrentStreak,
                longest = streak.LongestStreak,
                lastActivityDate = streak.LastActivityDate
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting vocab streak for user {userId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy streak" });
        }
    }

    // Helper: Get current user ID from JWT
    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            throw new UnauthorizedAccessException("User not authenticated");
        return int.Parse(userIdClaim.Value);
    }

    // Helper: Get or create streak record
    private async Task<UserVocabStreak> GetOrCreateStreak(int userId)
    {
        var streak = await _context.UserVocabStreaks
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (streak == null)
        {
            streak = new UserVocabStreak
            {
                UserId = userId,
                CurrentStreak = 0,
                LongestStreak = 0
            };
            _context.UserVocabStreaks.Add(streak);
            await _context.SaveChangesAsync();
        }

        return streak;
    }

    // Helper: Update streak logic
    private async Task UpdateStreak(int userId)
    {
        var today = DateTime.UtcNow.Date;
        var streak = await GetOrCreateStreak(userId);

        if (streak.LastActivityDate == today)
        {
            // Already studied today, do nothing
            return;
        }
        else if (streak.LastActivityDate == today.AddDays(-1))
        {
            // Studied yesterday, increment streak
            streak.CurrentStreak++;
            if (streak.CurrentStreak > streak.LongestStreak)
                streak.LongestStreak = streak.CurrentStreak;
        }
        else
        {
            // Missed a day or first time, reset to 1
            streak.CurrentStreak = 1;
            if (streak.LongestStreak == 0)
                streak.LongestStreak = 1;
        }

        streak.LastActivityDate = today;
        await _context.SaveChangesAsync();
    }
}
