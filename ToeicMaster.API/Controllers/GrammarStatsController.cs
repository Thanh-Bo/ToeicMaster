using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToeicMaster.API.Models.Grammar;
using ToeicMaster.API.Services;
using System.Security.Claims;

namespace ToeicMaster.API.Controllers
{
    [ApiController]
    [Route("api/v1/users/{userId}/grammar/stats")]
    [Authorize]
    public class GrammarStatsController : ControllerBase
    {
        private readonly IGrammarService _grammarService;
        private readonly ILogger<GrammarStatsController> _logger;

        public GrammarStatsController(IGrammarService grammarService, ILogger<GrammarStatsController> logger)
        {
            _grammarService = grammarService;
            _logger = logger;
        }

        private int? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return null;
            return int.TryParse(userIdClaim.Value, out int userId) ? userId : null;
        }

        private bool ValidateUserId(int urlUserId)
        {
            int tokenUserId = GetUserId() ?? 0;
            return urlUserId == tokenUserId;
        }

        /// <summary>
        /// For free users, force period to "all" if they request a time-filtered period.
        /// Only PRO users can access 7d/30d/90d/1y filters.
        /// </summary>
        private string EnforcePeriodAccess(int userId, string period)
        {
            if (period == "all") return period;

            var isPremium = _grammarService.IsPremiumUser(userId);
            if (!isPremium)
            {
                _logger.LogInformation($"Free user {userId} attempted to access period={period}, forcing to 'all'");
                return "all";
            }

            return period;
        }

        /// <summary>
        /// GET /api/v1/users/{userId}/grammar/stats
        /// Get overall grammar statistics with time period filter
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetStats(int userId, [FromQuery] string period = "all")
        {
            try
            {
                if (!ValidateUserId(userId))
                    return Forbid();

                // Free users can only access "all" period
                period = EnforcePeriodAccess(userId, period);

                var stats = await _grammarService.GetGrammarStatsAsync(userId, period);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting grammar stats for user {userId}: {ex.Message}");
                return StatusCode(500, new { error = "Lỗi lấy thống kê" });
            }
        }

        /// <summary>
        /// GET /api/v1/users/{userId}/grammar/stats/streak
        /// Get streak information
        /// </summary>
        [HttpGet("streak")]
        public async Task<IActionResult> GetStreak(int userId)
        {
            try
            {
                if (!ValidateUserId(userId))
                    return Forbid();

                var streak = await _grammarService.GetStreakAsync(userId);
                return Ok(streak);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting streak for user {userId}: {ex.Message}");
                return StatusCode(500, new { error = "Lỗi lấy streak" });
            }
        }

        /// <summary>
        /// GET /api/v1/users/{userId}/grammar/stats/heatmap
        /// Get activity heatmap data
        /// </summary>
        [HttpGet("heatmap")]
        public async Task<IActionResult> GetHeatmap(int userId, [FromQuery] int weeks = 52)
        {
            try
            {
                if (!ValidateUserId(userId))
                    return Forbid();

                var heatmap = await _grammarService.GetHeatmapDataAsync(userId, weeks);
                return Ok(heatmap);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting heatmap for user {userId}: {ex.Message}");
                return StatusCode(500, new { error = "Lỗi lấy heatmap" });
            }
        }

        /// <summary>
        /// GET /api/v1/users/{userId}/grammar/stats/time-distribution
        /// Get study time distribution by time of day
        /// </summary>
        [HttpGet("time-distribution")]
        public async Task<IActionResult> GetTimeDistribution(int userId, [FromQuery] string period = "all")
        {
            try
            {
                if (!ValidateUserId(userId))
                    return Forbid();

                var distribution = await _grammarService.GetTimeDistributionAsync(userId, period);
                return Ok(distribution);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting time distribution for user {userId}: {ex.Message}");
                return StatusCode(500, new { error = "Lỗi lấy phân bố thời gian" });
            }
        }

        /// <summary>
        /// GET /api/v1/users/{userId}/grammar/stats/groups
        /// Get progress for all groups with topics breakdown
        /// </summary>
        [HttpGet("groups")]
        public async Task<IActionResult> GetGroupProgress(int userId, [FromQuery] string period = "all")
        {
            try
            {
                if (!ValidateUserId(userId))
                    return Forbid();

                // Free users can only access "all" period
                period = EnforcePeriodAccess(userId, period);

                var groups = await _grammarService.GetGroupProgressAsync(userId, period);
                return Ok(groups);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting group progress for user {userId}: {ex.Message}");
                return StatusCode(500, new { error = "Lỗi lấy tiến độ nhóm" });
            }
        }

        /// <summary>
        /// GET /api/v1/users/{userId}/grammar/stats/topics/{topicId}
        /// Get detailed progress for a specific topic
        /// </summary>
        [HttpGet("topics/{topicId}")]
        public async Task<IActionResult> GetTopicProgress(int userId, int topicId)
        {
            try
            {
                if (!ValidateUserId(userId))
                    return Forbid();

                var topic = await _grammarService.GetTopicProgressAsync(userId, topicId);
                if (topic == null)
                    return NotFound(new { error = "Không tìm thấy chủ đề" });

                return Ok(topic);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting topic progress for user {userId}, topic {topicId}: {ex.Message}");
                return StatusCode(500, new { error = "Lỗi lấy tiến độ chủ đề" });
            }
        }

        /// <summary>
        /// POST /api/v1/users/{userId}/grammar/stats/record-session
        /// Record a study session
        /// </summary>
        [HttpPost("record-session")]
        public async Task<IActionResult> RecordSession(int userId, [FromBody] RecordStudySessionRequest request)
        {
            try
            {
                if (!ValidateUserId(userId))
                    return Forbid();

                await _grammarService.RecordStudySessionAsync(userId, request);
                return Ok(new { message = "Đã ghi nhận phiên học" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error recording session for user {userId}: {ex.Message}");
                return StatusCode(500, new { error = "Lỗi ghi nhận phiên học" });
            }
        }
    }
}
