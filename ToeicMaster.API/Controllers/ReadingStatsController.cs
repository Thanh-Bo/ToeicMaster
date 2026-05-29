using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/reading-practice")]
[Authorize]
public class ReadingStatsController : ReadingPracticeBaseController
{
    public ReadingStatsController(AppDbContext context)
        : base(context) { }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? partType = null,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null,
        [FromQuery] string sort = "newest",
        [FromQuery] int? topicId = null
    )
    {
        var userId = GetUserId();
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var query = _context
            .ReadingSessions.AsNoTracking()
            .Where(s => s.UserId == userId && s.Status == "completed");

        if (from.HasValue)
            query = query.Where(s => s.CompletedAt >= from.Value);
        if (to.HasValue)
            query = query.Where(s => s.CompletedAt <= to.Value);
        if (partType is 6 or 7)
            query = query.Where(s =>
                s.ReadingSessionPassages.Any(sp => sp.Passage.PartType == partType)
            );
        if (topicId.HasValue)
            query = query.Where(s =>
                s.ReadingSessionPassages.Any(sp => sp.Passage.TopicId == topicId.Value)
            );

        query = sort.ToLowerInvariant() switch
        {
            "accuracy" => query.OrderByDescending(s =>
                s.TotalQuestions > 0 ? (double)s.CorrectAnswers / s.TotalQuestions : 0
            ),
            "oldest" => query.OrderBy(s => s.CompletedAt),
            _ => query.OrderByDescending(s => s.CompletedAt),
        };

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new
            {
                s.Id,
                s.TotalPassages,
                s.TotalQuestions,
                s.CorrectAnswers,
                Accuracy = s.TotalQuestions > 0
                    ? Math.Round((double)s.CorrectAnswers / s.TotalQuestions * 100, 1)
                    : 0,
                s.TimeSpentSeconds,
                s.StartedAt,
                s.CompletedAt,
                PartTypes = s
                    .ReadingSessionPassages.Select(sp => sp.Passage.PartType)
                    .Distinct()
                    .OrderBy(p => p)
                    .ToList(),
                TopicIds = s
                    .ReadingSessionPassages.Where(sp => sp.Passage.TopicId != null)
                    .Select(sp => sp.Passage.TopicId!.Value)
                    .Distinct()
                    .OrderBy(id => id)
                    .ToList(),
            })
            .ToListAsync();

        return Ok(
            new
            {
                items,
                total,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling(total / (double)pageSize),
            }
        );
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats([FromQuery] string period = "all")
    {
        var userId = GetUserId();
        var user = await GetCurrentUserAsync();

        bool isPremium =
            user?.Role == "Admin"
            || (
                user?.IsPremium == true
                && (
                    !user.PremiumExpiredAt.HasValue || user.PremiumExpiredAt.Value > DateTime.UtcNow
                )
            );

        if (period != "all" && !isPremium)
        {
            period = "all";
        }

        var now = DateTime.UtcNow;
        DateTime? startDate = period.ToLower() switch
        {
            "week" or "7" or "7d" or "7days" => now.AddDays(-7),
            "month" or "30" or "30d" or "30days" => now.AddDays(-30),
            "quarter" or "90" or "90d" or "90days" => now.AddDays(-90),
            "year" or "365" or "1y" or "1year" => now.AddDays(-365),
            _ => (DateTime?)null,
        };

        var completed = _context
            .ReadingSessions.AsNoTracking()
            .Where(s => s.UserId == userId && s.Status == "completed");

        if (startDate.HasValue)
        {
            completed = completed.Where(s => s.CompletedAt >= startDate.Value);
        }

        var totalSessions = await completed.CountAsync();
        var totalQuestions = await completed.SumAsync(s => s.TotalQuestions);
        var totalCorrect = await completed.SumAsync(s => s.CorrectAnswers);
        var totalTimeSeconds = await completed.SumAsync(s => s.TimeSpentSeconds);

        var partStatsQuery = _context
            .ReadingSessionPassages.AsNoTracking()
            .Where(sp => sp.Session.UserId == userId && sp.Session.Status == "completed");

        if (startDate.HasValue)
        {
            partStatsQuery = partStatsQuery.Where(sp => sp.Session.CompletedAt >= startDate.Value);
        }

        var dbPartStats = await partStatsQuery
            .SelectMany(sp =>
                sp.Passage.Questions.Select(q => new
                {
                    sp.Passage.PartType,
                    IsCorrect = sp.Session.ReadingSessionAnswers.Any(a =>
                        a.ReadingQuestionId == q.Id && a.IsCorrect
                    ),
                })
            )
            .GroupBy(x => x.PartType)
            .Select(g => new
            {
                PartType = g.Key,
                TotalQuestions = g.Count(),
                CorrectAnswers = g.Count(x => x.IsCorrect),
                Accuracy = g.Count() > 0
                    ? Math.Round((double)g.Count(x => x.IsCorrect) / g.Count() * 100, 1)
                    : 0,
            })
            .ToListAsync();

        var partStats = new List<object>
        {
            new
            {
                PartType = 6,
                TotalQuestions = 0,
                CorrectAnswers = 0,
                Accuracy = 0.0,
            },
            new
            {
                PartType = 7,
                TotalQuestions = 0,
                CorrectAnswers = 0,
                Accuracy = 0.0,
            },
        };

        foreach (var dbStat in dbPartStats)
        {
            if (dbStat.PartType == 6)
            {
                partStats[0] = new
                {
                    PartType = 6,
                    dbStat.TotalQuestions,
                    dbStat.CorrectAnswers,
                    dbStat.Accuracy,
                };
            }
            else if (dbStat.PartType == 7)
            {
                partStats[1] = new
                {
                    PartType = 7,
                    dbStat.TotalQuestions,
                    dbStat.CorrectAnswers,
                    dbStat.Accuracy,
                };
            }
        }

        return Ok(
            new
            {
                totalSessions,
                totalQuestions,
                totalCorrect,
                accuracy = totalQuestions > 0
                    ? Math.Round((double)totalCorrect / totalQuestions * 100, 1)
                    : 0,
                totalTimeSeconds,
                activePassages = await _context.ReadingPassages.CountAsync(p => p.IsActive),
                partStats,
            }
        );
    }
}
