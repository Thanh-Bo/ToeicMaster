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
    /// Get all vocabulary stats for user with period filter
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats(int userId, [FromQuery] string period = "all")
    {
        try
        {
            // Verify user is requesting their own data
            var currentUserId = GetCurrentUserId();
            if (currentUserId != userId)
                return Forbid();

            // Tính ngày bắt đầu dựa trên period
            var now = DateTime.UtcNow;
            DateTime? startDate = period.ToLower() switch
            {
                "week" or "7" => now.AddDays(-7),
                "month" or "30" => now.AddDays(-30),
                "quarter" or "90" => now.AddDays(-90),
                "year" or "365" => now.AddDays(-365),
                "all" or _ => (DateTime?)null
            };

            // Lấy topic progress của user (có thể lọc theo thời gian)
            var userTopicQuery = _context.UserVocabs
                .Where(uv => uv.UserId == userId && uv.Status > 0);
            
            if (startDate.HasValue)
                userTopicQuery = userTopicQuery.Where(uv => uv.LastReviewedAt >= startDate.Value);

            var userTopicProgress = await userTopicQuery.ToListAsync();

            // Total topics learned
            var totalTopicsLearned = userTopicProgress.Count;

            // Total vocab learned = tổng số từ trong các topic đã học
            var topicIds = userTopicProgress.Select(uv => uv.TopicId).ToList();
            var totalVocabLearned = await _context.Vocabularies
                .Where(v => v.TopicId.HasValue && topicIds.Contains(v.TopicId.Value))
                .CountAsync();

            // Review due (NextReviewAt <= now)
            var reviewDue = userTopicProgress.Count(uv => uv.NextReviewAt <= now);

            // Total study time in minutes (có thể lọc theo thời gian)
            var sessionQuery = _context.UserActivityVocabSessions
                .Where(s => s.UserId == userId && s.DurationSeconds.HasValue);
            
            if (startDate.HasValue)
                sessionQuery = sessionQuery.Where(s => s.StartTime >= startDate.Value);

            var totalTimeSeconds = await sessionQuery
                .SumAsync(s => (int?)s.DurationSeconds) ?? 0;
            var totalTimeMinutes = totalTimeSeconds / 60;

            // Total questions answered and accuracy from UserVocabularies
            var totalQuestionsAnswered = userTopicProgress.Sum(uv => uv.TotalQuestionsAnswered);
            var totalCorrectAnswers = userTopicProgress.Sum(uv => uv.TotalCorrectAnswers);
            var accuracy = totalQuestionsAnswered > 0 
                ? Math.Round((double)totalCorrectAnswers / totalQuestionsAnswered * 100, 1) 
                : 0;

            // Get streak
            var streak = await GetOrCreateStreak(userId);

            return Ok(new
            {
                totalTopicsLearned,
                totalVocabLearned,
                reviewDue,
                totalTimeMinutes,
                totalQuestionsAnswered,
                totalCorrectAnswers,
                accuracy,
                period,
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

    /// <summary>
    /// GET /api/v1/users/{userId}/vocabulary/analysis-by-level
    /// Get vocabulary analysis grouped by level (Basic, Intermediate, Advanced) with period filter
    /// </summary>
    [HttpGet("analysis-by-level")]
    public async Task<IActionResult> GetAnalysisByLevel(int userId, [FromQuery] string period = "all")
    {
        try
        {
            // Verify user is requesting their own data
            var currentUserId = GetCurrentUserId();
            if (currentUserId != userId)
                return Forbid();

            // Calculate start date based on period
            var now = DateTime.UtcNow;
            DateTime? startDate = period.ToLower() switch
            {
                "week" or "7" => now.AddDays(-7),
                "month" or "30" => now.AddDays(-30),
                "quarter" or "90" => now.AddDays(-90),
                "year" or "365" => now.AddDays(-365),
                "all" or _ => (DateTime?)null
            };

            // Get all topics with their vocabularies
            var topicsQuery = _context.Topics
                .Include(t => t.Vocabularies)
                .AsQueryable();

            var allTopics = await topicsQuery.ToListAsync();

            // Get user progress for vocab topics
            var userVocabQuery = _context.UserVocabs
                .Where(uv => uv.UserId == userId);

            if (startDate.HasValue)
                userVocabQuery = userVocabQuery.Where(uv => uv.LastReviewedAt >= startDate.Value);

            var userVocabProgress = await userVocabQuery.ToListAsync();

            // Group by level
            var levels = new[] { "Basic", "Intermediate", "Advanced" };
            var levelNames = new Dictionary<string, string>
            {
                { "Basic", "Từ vựng Cơ bản" },
                { "Intermediate", "Từ vựng Trung cấp" },
                { "Advanced", "Từ vựng Nâng cao" }
            };

            var result = new List<object>();

            foreach (var level in levels)
            {
                var levelTopics = allTopics.Where(t => t.Level == level).ToList();
                var topicAnalyses = new List<object>();

                foreach (var topic in levelTopics)
                {
                    var totalVocab = topic.Vocabularies.Count;
                    var userProgress = userVocabProgress.FirstOrDefault(uv => uv.TopicId == topic.Id);
                    
                    // Learned vocab = all vocab in topic if user has progress (Status > 0)
                    var learnedVocab = userProgress?.Status > 0 ? totalVocab : 0;
                    var currentLevel = userProgress?.Level ?? 0;

                    topicAnalyses.Add(new
                    {
                        topicId = topic.Id,
                        topicGuid = topic.TopicGuid.ToString(),
                        topicName = topic.Title,
                        totalVocab = totalVocab,
                        learnedVocab = learnedVocab,
                        currentLevel = currentLevel,
                        maxLevel = 5
                    });
                }

                var totalVocabInLevel = levelTopics.Sum(t => t.Vocabularies.Count);
                var learnedVocabInLevel = topicAnalyses.Sum(t => (int)t.GetType().GetProperty("learnedVocab").GetValue(t));
                var progressPercent = totalVocabInLevel > 0 
                    ? Math.Round((double)learnedVocabInLevel / totalVocabInLevel * 100, 1) 
                    : 0;

                result.Add(new
                {
                    level = level,
                    levelName = levelNames[level],
                    totalTopics = levelTopics.Count,
                    totalVocab = totalVocabInLevel,
                    learnedVocab = learnedVocabInLevel,
                    progressPercent = progressPercent,
                    topics = topicAnalyses
                });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting vocab analysis by level for user {userId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy phân tích từ vựng theo level" });
        }
    }
}
