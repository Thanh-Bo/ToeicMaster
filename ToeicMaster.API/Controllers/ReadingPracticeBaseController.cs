using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.RegularExpressions;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/reading-practice")]
[Authorize]
public abstract class ReadingPracticeBaseController : ControllerBase
{
    protected static readonly string[] ValidLabels = ["A", "B", "C", "D"];
    protected readonly AppDbContext _context;

    protected ReadingPracticeBaseController(AppDbContext context)
    {
        _context = context;
    }

    protected int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    protected async Task<User?> GetCurrentUserAsync()
    {
        var userId = GetUserId();
        return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
    }

    protected async Task<bool> IsAdminAsync()
    {
        var user = await GetCurrentUserAsync();
        return string.Equals(user?.Role, "Admin", StringComparison.OrdinalIgnoreCase);
    }

    protected async Task CancelOldInProgressSessionsAsync(int userId)
    {
        var oldSessions = await _context.ReadingSessions
            .Where(s => s.UserId == userId && s.Status == "in_progress")
            .ToListAsync();

        foreach (var oldSession in oldSessions)
            oldSession.Status = "cancelled";

        if (oldSessions.Count > 0)
            await _context.SaveChangesAsync();
    }

    protected async Task<ReadingSession?> LoadSessionAsync(int sessionId, int userId)
    {
        return await _context.ReadingSessions
            .Include(s => s.ReadingSessionPassages)
                .ThenInclude(sp => sp.Passage)
                    .ThenInclude(p => p.Questions)
                        .ThenInclude(q => q.Answers)
            .Include(s => s.ReadingSessionAnswers)
            .AsSplitQuery()
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);
    }

    protected async Task<(int PassageCount, int QuestionCount)> GetTopicCountsAsync(int topicId)
    {
        var passages = await _context.ReadingPassages
            .AsNoTracking()
            .Where(p => p.TopicId == topicId)
            .Select(p => new { QuestionCount = p.Questions.Count })
            .ToListAsync();

        return (passages.Count, passages.Sum(p => p.QuestionCount));
    }

    // --- Static helpers ---

    protected static bool CanViewDetailedExplanation(User user)
    {
        if (string.Equals(user.Role, "Admin", StringComparison.OrdinalIgnoreCase))
            return true;

        return user.IsPremium == true &&
            (!user.PremiumExpiredAt.HasValue || user.PremiumExpiredAt.Value > DateTime.UtcNow);
    }

    protected static int? ParsePartFilter(string? partType)
    {
        var normalized = partType?.Trim().ToLowerInvariant();
        return normalized switch
        {
            "6" or "part6" => 6,
            "7" or "part7" => 7,
            _ => null
        };
    }

    protected static bool IsMixed(string? partType)
    {
        return string.IsNullOrWhiteSpace(partType) ||
            string.Equals(partType, "mixed", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(partType, "all", StringComparison.OrdinalIgnoreCase);
    }

    protected static bool IsAllFilter(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ||
            string.Equals(value, "all", StringComparison.OrdinalIgnoreCase);
    }

    protected static string? ParseDifficultyFilter(string? difficulty)
    {
        var normalized = difficulty?.Trim().ToLowerInvariant();
        return normalized switch
        {
            "easy" => "easy",
            "medium" => "medium",
            "hard" => "hard",
            _ => null
        };
    }

    protected static string? BuildShortDescription(string? html)
    {
        if (string.IsNullOrWhiteSpace(html))
            return null;

        var text = Regex.Replace(html, "<.*?>", " ");
        text = Regex.Replace(text, "\\s+", " ").Trim();
        return text.Length <= 160 ? text : text[..160] + "...";
    }

    protected static bool IsValidPracticePassage(ReadingPassage passage)
    {
        if (passage.PartType is not (6 or 7))
            return false;

        if (!passage.Questions.Any())
            return false;

        return passage.Questions.All(q =>
        {
            var labels = q.Answers
                .Where(a => !string.IsNullOrWhiteSpace(a.Label) && !string.IsNullOrWhiteSpace(a.Content))
                .Select(a => a.Label!.Trim().ToUpperInvariant())
                .ToHashSet();

            var correctOption = q.CorrectOption?.Trim().ToUpperInvariant();
            return ValidLabels.All(labels.Contains) && correctOption != null && ValidLabels.Contains(correctOption) && labels.Contains(correctOption);
        });
    }

    protected static object BuildTopicResponse(ReadingTopic topic, int passageCount, int questionCount)
    {
        return new
        {
            topic.Id,
            topic.PublicId,
            topic.Title,
            topic.Description,
            topic.PartType,
            topic.Difficulty,
            topic.DisplayOrder,
            topic.IsActive,
            topic.IsPremiumRequired,
            topic.CreatedAt,
            PassageCount = passageCount,
            QuestionCount = questionCount
        };
    }

    protected static object BuildSessionResponse(ReadingSession session, bool includeReview, bool canViewExplanation)
    {
        var selectedAnswers = session.ReadingSessionAnswers
            .ToDictionary(a => a.ReadingQuestionId, a => a.SelectedOption);

        var passages = session.ReadingSessionPassages
            .OrderBy(sp => sp.DisplayOrder)
            .Select(sp => new
            {
                sp.Passage.Id,
                sp.Passage.Title,
                sp.Passage.TextContent,
                sp.Passage.ImageUrl,
                sp.Passage.TextContentTranslation,
                sp.Passage.PassageType,
                sp.Passage.PartType,
                sp.Passage.Difficulty,
                sp.DisplayOrder,
                Questions = sp.Passage.Questions
                    .OrderBy(q => q.QuestionNo)
                    .Select(q => new
                    {
                        q.Id,
                        q.QuestionNo,
                        q.Content,
                        q.QuestionType,
                        CorrectOption = includeReview ? q.CorrectOption : null,
                        IsCorrect = includeReview && selectedAnswers.TryGetValue(q.Id, out var selectedForCorrect)
                            ? string.Equals(selectedForCorrect, q.CorrectOption, StringComparison.OrdinalIgnoreCase)
                            : (bool?)null,
                        ShortExplanation = includeReview && canViewExplanation ? q.ShortExplanation : null,
                        FullExplanation = includeReview && canViewExplanation ? q.FullExplanation : null,
                        ExplanationLocked = includeReview && !canViewExplanation,
                        SelectedOption = selectedAnswers.TryGetValue(q.Id, out var selected) ? selected : null,
                        Answers = q.Answers
                            .OrderBy(a => a.Label)
                            .Select(a => new
                            {
                                a.Id,
                                a.Label,
                                a.Content
                            })
                    })
            });

        return new
        {
            SessionId = session.Id,
            PublicId = session.PublicId,
            session.Status,
            session.TotalPassages,
            session.TotalQuestions,
            session.CorrectAnswers,
            Accuracy = session.TotalQuestions > 0
                ? Math.Round((double)session.CorrectAnswers / session.TotalQuestions * 100, 1)
                : 0,
            session.TimeSpentSeconds,
            session.StartedAt,
            session.CompletedAt,
            CanViewExplanation = canViewExplanation,
            Passages = passages
        };
    }

    protected static object BuildAdminPassageResponse(ReadingPassage passage)
    {
        return new
        {
            passage.Id,
            passage.TopicId,
            passage.Title,
            passage.TextContent,
            passage.ImageUrl,
            passage.TextContentTranslation,
            passage.PassageType,
            passage.PartType,
            passage.Difficulty,
            passage.DisplayOrder,
            passage.IsActive,
            passage.CreatedAt,
            Questions = passage.Questions.OrderBy(q => q.QuestionNo).Select(q => new
            {
                q.Id,
                q.QuestionNo,
                q.Content,
                q.QuestionType,
                q.CorrectOption,
                q.ShortExplanation,
                q.FullExplanation,
                Answers = q.Answers.OrderBy(a => a.Label).Select(a => new
                {
                    a.Id,
                    a.Label,
                    a.Content
                })
            })
        };
    }
}
