using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using Microsoft.AspNetCore.Authorization;
namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/reading-practice")]
[Authorize]
public class ReadingSessionController : ReadingPracticeBaseController
{
    public ReadingSessionController(AppDbContext context) : base(context) { }

    [HttpPost("start")]
    public async Task<IActionResult> Start([FromBody] StartReadingPracticeRequest request)
    {
        var userId = GetUserId();
        var allowedCounts = new[] { 3, 5, 10 };

        if (request.PassageId.HasValue)
        {
            await CancelOldInProgressSessionsAsync(userId);

            var selectedPassage = await _context.ReadingPassages
                .Include(p => p.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(p => p.Id == request.PassageId.Value && p.IsActive);

            if (selectedPassage == null)
                return NotFound(new { error = "Không tìm thấy bài Reading." });

            if (!IsValidPracticePassage(selectedPassage))
                return BadRequest(new { error = "Bài Reading này chưa đủ câu hỏi hoặc đáp án hợp lệ." });

            var lessonStartedAt = DateTime.UtcNow;
            var lessonSession = new ReadingSession
            {
                UserId = userId,
                TotalPassages = 1,
                TotalQuestions = selectedPassage.Questions.Count,
                CorrectAnswers = 0,
                TimeSpentSeconds = 0,
                StartedAt = lessonStartedAt,
                Status = "in_progress"
            };

            lessonSession.ReadingSessionPassages.Add(new ReadingSessionPassage
            {
                PassageId = selectedPassage.Id,
                Passage = selectedPassage,
                DisplayOrder = 1
            });

            _context.ReadingSessions.Add(lessonSession);
            await _context.SaveChangesAsync();

            return Ok(BuildSessionResponse(lessonSession, includeReview: false, canViewExplanation: false));
        }

        if (!allowedCounts.Contains(request.PassageCount))
            return BadRequest(new { error = "Số passage phải là 3, 5 hoặc 10." });

        var partFilter = ParsePartFilter(request.PartType);
        if (partFilter == null && !IsMixed(request.PartType))
            return BadRequest(new { error = "partType chỉ nhận 6, 7 hoặc mixed." });

        await CancelOldInProgressSessionsAsync(userId);

        var candidates = await _context.ReadingPassages
            .Include(p => p.Questions)
                .ThenInclude(q => q.Answers)
            .Where(p => p.IsActive && (partFilter == null || p.PartType == partFilter))
            .ToListAsync();

        var validPassages = candidates.Where(IsValidPracticePassage).ToList();
        if (validPassages.Count < request.PassageCount)
        {
            return BadRequest(new
            {
                error = $"Hiện chỉ có {validPassages.Count} passage hợp lệ, không đủ để tạo phiên {request.PassageCount} passage.",
                availablePassages = validPassages.Count,
                requestedPassages = request.PassageCount
            });
        }

        var passages = validPassages
            .OrderBy(_ => Guid.NewGuid())
            .Take(request.PassageCount)
            .ToList();

        await using var transaction = await _context.Database.BeginTransactionAsync();

        var now = DateTime.UtcNow;
        var session = new ReadingSession
        {
            UserId = userId,
            TotalPassages = passages.Count,
            TotalQuestions = passages.Sum(p => p.Questions.Count),
            CorrectAnswers = 0,
            TimeSpentSeconds = 0,
            StartedAt = now,
            Status = "in_progress"
        };

        var displayOrder = 1;
        foreach (var passage in passages)
        {
            session.ReadingSessionPassages.Add(new ReadingSessionPassage
            {
                PassageId = passage.Id,
                Passage = passage,
                DisplayOrder = displayOrder++
            });
        }

        _context.ReadingSessions.Add(session);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(BuildSessionResponse(session, includeReview: false, canViewExplanation: false));
    }

    [HttpGet("{sessionId:int}")]
    public async Task<IActionResult> GetSession(int sessionId)
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return Unauthorized();

        var session = await LoadSessionAsync(sessionId, user.Id);
        if (session == null)
            return NotFound(new { error = "Không tìm thấy phiên Reading." });

        var includeReview = session.Status == "completed";
        return Ok(BuildSessionResponse(session, includeReview, CanViewDetailedExplanation(user)));
    }

    [HttpGet("{sessionId:int}/result")]
    public async Task<IActionResult> GetResult(int sessionId)
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return Unauthorized();

        var session = await LoadSessionAsync(sessionId, user.Id);
        if (session == null)
            return NotFound(new { error = "Không tìm thấy phiên Reading." });

        if (session.Status != "completed")
            return BadRequest(new { error = "Phiên Reading chưa hoàn thành." });

        return Ok(BuildSessionResponse(session, includeReview: true, CanViewDetailedExplanation(user)));
    }

    [HttpPost("{sessionId:int}/answer")]
    public async Task<IActionResult> SubmitAnswer(int sessionId, [FromBody] ReadingAnswerRequest request)
    {
        var userId = GetUserId();
        if (request.ReadingQuestionId <= 0)
            return BadRequest(new { error = "ReadingQuestionId không hợp lệ." });

        var session = await _context.ReadingSessions
            .Include(s => s.ReadingSessionPassages)
                .ThenInclude(sp => sp.Passage)
                    .ThenInclude(p => p.Questions)
            .Include(s => s.ReadingSessionAnswers)
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

        if (session == null)
            return NotFound(new { error = "Không tìm thấy phiên Reading." });

        if (session.Status != "in_progress")
            return BadRequest(new { error = "Phiên Reading đã kết thúc, không thể sửa đáp án." });

        var selectedOption = request.SelectedOption?.Trim().ToUpperInvariant();
        if (string.IsNullOrWhiteSpace(selectedOption) || !ValidLabels.Contains(selectedOption))
            return BadRequest(new { error = "Đáp án phải là A, B, C hoặc D." });

        var sessionQuestionIds = session.ReadingSessionPassages
            .SelectMany(sp => sp.Passage.Questions)
            .Select(q => q.Id)
            .ToHashSet();

        if (!sessionQuestionIds.Contains(request.ReadingQuestionId))
            return BadRequest(new { error = "Câu hỏi không thuộc phiên Reading này." });

        var question = await _context.ReadingQuestions
            .Include(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == request.ReadingQuestionId);

        if (question == null)
            return NotFound(new { error = "Không tìm thấy câu hỏi Reading." });

        if (!question.Answers.Any(a => a.Label == selectedOption))
            return BadRequest(new { error = $"Câu hỏi này không có đáp án {selectedOption}." });

        var isCorrect = string.Equals(question.CorrectOption, selectedOption, StringComparison.OrdinalIgnoreCase);
        var existingAnswer = await _context.ReadingSessionAnswers
            .FirstOrDefaultAsync(a => a.SessionId == sessionId && a.ReadingQuestionId == request.ReadingQuestionId);

        if (existingAnswer == null)
        {
            _context.ReadingSessionAnswers.Add(new ReadingSessionAnswer
            {
                SessionId = sessionId,
                ReadingQuestionId = request.ReadingQuestionId,
                SelectedOption = selectedOption,
                IsCorrect = isCorrect,
                AnsweredAt = DateTime.UtcNow
            });
        }
        else
        {
            existingAnswer.SelectedOption = selectedOption;
            existingAnswer.IsCorrect = isCorrect;
            existingAnswer.AnsweredAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        session.CorrectAnswers = await _context.ReadingSessionAnswers.CountAsync(a => a.SessionId == sessionId && a.IsCorrect);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            saved = true,
            readingQuestionId = request.ReadingQuestionId,
            selectedOption,
            answeredAt = DateTime.UtcNow
        });
    }

    [HttpPost("{sessionId:int}/complete")]
    public async Task<IActionResult> Complete(int sessionId, [FromBody] CompleteReadingPracticeRequest? request)
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return Unauthorized();

        var session = await LoadSessionAsync(sessionId, user.Id);
        if (session == null)
            return NotFound(new { error = "Không tìm thấy phiên Reading." });

        if (session.Status == "completed")
            return BadRequest(new { error = "Phiên Reading này đã được nộp trước đó." });

        if (session.Status != "in_progress")
            return BadRequest(new { error = "Phiên Reading không còn ở trạng thái đang làm." });

        var questionIds = session.ReadingSessionPassages
            .SelectMany(sp => sp.Passage.Questions)
            .Select(q => q.Id)
            .ToHashSet();

        var answeredQuestionIds = session.ReadingSessionAnswers.Select(a => a.ReadingQuestionId).ToHashSet();
        var missingCount = questionIds.Count(id => !answeredQuestionIds.Contains(id));
        if (missingCount > 0)
            return BadRequest(new { error = $"Bạn còn {missingCount} câu chưa trả lời. Vui lòng hoàn thành trước khi nộp bài." });

        session.TotalQuestions = questionIds.Count;
        session.TotalPassages = session.ReadingSessionPassages.Count;
        session.CorrectAnswers = session.ReadingSessionAnswers.Count(a => a.IsCorrect);
        session.Status = "completed";
        session.CompletedAt = DateTime.UtcNow;
        session.TimeSpentSeconds = request?.TimeSpentSeconds ??
            Math.Max(0, (int)(DateTime.UtcNow - session.StartedAt).TotalSeconds);

        await _context.SaveChangesAsync();

        return Ok(BuildSessionResponse(session, includeReview: true, CanViewDetailedExplanation(user)));
    }

    [HttpPost("{sessionId:int}/cancel")]
    public async Task<IActionResult> Cancel(int sessionId)
    {
        var userId = GetUserId();
        var session = await _context.ReadingSessions.FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);
        if (session == null)
            return NotFound(new { error = "Không tìm thấy phiên Reading." });

        if (session.Status == "completed")
            return BadRequest(new { error = "Không thể hủy phiên đã nộp." });

        session.Status = "cancelled";
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã hủy phiên Reading.", sessionId });
    }

    [HttpDelete("cleanup")]
    public async Task<IActionResult> Cleanup([FromQuery] int olderThanHours = 24)
    {
        if (!await IsAdminAsync())
            return Forbid();

        olderThanHours = Math.Clamp(olderThanHours, 1, 720);
        var cutoff = DateTime.UtcNow.AddHours(-olderThanHours);
        var sessions = await _context.ReadingSessions
            .Where(s => s.Status == "in_progress" && s.StartedAt < cutoff)
            .ToListAsync();

        foreach (var session in sessions)
            session.Status = "cancelled";

        await _context.SaveChangesAsync();
        return Ok(new { message = $"Đã cleanup {sessions.Count} phiên Reading cũ.", count = sessions.Count });
    }
}

public class StartReadingPracticeRequest
{
    public int PassageCount { get; set; } = 3;
    public string? PartType { get; set; } = "mixed";
    public int? PassageId { get; set; }
}

public class ReadingAnswerRequest
{
    public int ReadingQuestionId { get; set; }
    public string? SelectedOption { get; set; }
}

public class CompleteReadingPracticeRequest
{
    public int? TimeSpentSeconds { get; set; }
}
