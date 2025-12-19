using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class PracticeController : ControllerBase
{
    private readonly AppDbContext _context;

    public PracticeController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>
    /// Lấy danh sách các Part có thể luyện tập
    /// </summary>
    [HttpGet("parts")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPracticeParts()
    {
        // Lấy số lượng câu hỏi theo từng part
        var partStats = await _context.Parts
            .GroupBy(p => p.PartNumber)
            .Select(g => new
            {
                PartNumber = g.Key,
                Name = g.First().Name,
                Description = g.First().Description,
                TotalQuestions = g.SelectMany(p => p.QuestionGroups)
                    .SelectMany(qg => qg.Questions)
                    .Count()
            })
            .OrderBy(p => p.PartNumber)
            .ToListAsync();

        var parts = new[]
        {
            new { PartNumber = 1, Name = "Part 1: Photographs", Description = "Mô tả hình ảnh", Type = "listening", Icon = "🖼️" },
            new { PartNumber = 2, Name = "Part 2: Question-Response", Description = "Hỏi - Đáp", Type = "listening", Icon = "💬" },
            new { PartNumber = 3, Name = "Part 3: Conversations", Description = "Đoạn hội thoại", Type = "listening", Icon = "👥" },
            new { PartNumber = 4, Name = "Part 4: Short Talks", Description = "Bài nói ngắn", Type = "listening", Icon = "🎙️" },
            new { PartNumber = 5, Name = "Part 5: Incomplete Sentences", Description = "Điền vào chỗ trống", Type = "reading", Icon = "📝" },
            new { PartNumber = 6, Name = "Part 6: Text Completion", Description = "Hoàn thành đoạn văn", Type = "reading", Icon = "📄" },
            new { PartNumber = 7, Name = "Part 7: Reading Comprehension", Description = "Đọc hiểu", Type = "reading", Icon = "📚" }
        };

        var result = parts.Select(p => new
        {
            p.PartNumber,
            p.Name,
            p.Description,
            p.Type,
            p.Icon,
            TotalQuestions = partStats.FirstOrDefault(s => s.PartNumber == p.PartNumber)?.TotalQuestions ?? 0
        });

        return Ok(result);
    }

    /// <summary>
    /// Bắt đầu phiên luyện tập
    /// </summary>
    [HttpPost("start")]
    public async Task<IActionResult> StartPractice([FromBody] StartPracticeRequest request)
    {
        var userId = GetUserId();
        
        if (request.PartNumber < 1 || request.PartNumber > 7)
            return BadRequest(new { error = "Part không hợp lệ (1-7)" });

        var questionCount = request.QuestionCount ?? 10;
        if (questionCount < 5 || questionCount > 50)
            questionCount = 10;

        // Lấy câu hỏi ngẫu nhiên từ Part đã chọn
        var questions = await _context.Questions
            .Include(q => q.Answers)
            .Include(q => q.Group)
                .ThenInclude(g => g.Part)
            .Where(q => q.Group.Part.PartNumber == request.PartNumber)
            .OrderBy(q => Guid.NewGuid()) // Random
            .Take(questionCount)
            .Select(q => new
            {
                q.Id,
                q.QuestionNo,
                q.Content,
                q.AudioUrl,
                GroupId = q.GroupId,
                GroupContent = q.Group.TextContent,
                GroupImageUrl = q.Group.ImageUrl,
                GroupAudioUrl = q.Group.AudioUrl,
                Answers = q.Answers.Select(a => new { a.Label, a.Content }).ToList()
            })
            .ToListAsync();

        if (!questions.Any())
            return NotFound(new { error = "Không có câu hỏi cho Part này" });

        // Tạo session mới
        var session = new PracticeSession
        {
            UserId = userId,
            PartNumber = request.PartNumber,
            TotalQuestions = questions.Count,
            CorrectAnswers = 0,
            TimeSpentSeconds = 0,
            Status = "in_progress"
        };

        _context.PracticeSessions.Add(session);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            sessionId = session.Id,
            partNumber = request.PartNumber,
            questions,
            totalQuestions = questions.Count
        });
    }

    /// <summary>
    /// Submit câu trả lời trong practice mode
    /// </summary>
    [HttpPost("{sessionId}/answer")]
    public async Task<IActionResult> SubmitAnswer(int sessionId, [FromBody] PracticeAnswerRequest request)
    {
        var userId = GetUserId();
        
        var session = await _context.PracticeSessions
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

        if (session == null)
            return NotFound(new { error = "Phiên luyện tập không tồn tại" });

        if (session.Status != "in_progress")
            return BadRequest(new { error = "Phiên luyện tập đã kết thúc" });

        // Lấy đáp án đúng
        var question = await _context.Questions
            .Include(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == request.QuestionId);

        if (question == null)
            return NotFound(new { error = "Câu hỏi không tồn tại" });

        var isCorrect = question.CorrectOption?.ToUpper() == request.SelectedOption?.ToUpper();

        // Kiểm tra đã trả lời chưa
        var existingAnswer = await _context.PracticeAnswers
            .FirstOrDefaultAsync(a => a.SessionId == sessionId && a.QuestionId == request.QuestionId);

        if (existingAnswer == null)
        {
            // Thêm answer mới
            var answer = new PracticeAnswer
            {
                SessionId = sessionId,
                QuestionId = request.QuestionId,
                SelectedOption = request.SelectedOption,
                IsCorrect = isCorrect
            };
            _context.PracticeAnswers.Add(answer);

            if (isCorrect)
                session.CorrectAnswers++;
        }
        else
        {
            // Cập nhật nếu đã trả lời (cho phép thay đổi trong practice mode)
            if (existingAnswer.IsCorrect && !isCorrect)
                session.CorrectAnswers--;
            else if (!existingAnswer.IsCorrect && isCorrect)
                session.CorrectAnswers++;

            existingAnswer.SelectedOption = request.SelectedOption;
            existingAnswer.IsCorrect = isCorrect;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            isCorrect,
            correctOption = question.CorrectOption,
            explanation = question.ShortExplanation ?? question.FullExplanation,
            answers = question.Answers.Select(a => new { a.Label, a.Content })
        });
    }

    /// <summary>
    /// Kết thúc phiên luyện tập
    /// </summary>
    [HttpPost("{sessionId}/complete")]
    public async Task<IActionResult> CompletePractice(int sessionId, [FromBody] CompletePracticeRequest? request)
    {
        var userId = GetUserId();
        
        var session = await _context.PracticeSessions
            .Include(s => s.PracticeAnswers)
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

        if (session == null)
            return NotFound(new { error = "Phiên luyện tập không tồn tại" });

        session.Status = "completed";
        session.CompletedAt = DateTime.UtcNow;
        session.TimeSpentSeconds = request?.TimeSpentSeconds ?? 
            (int)(DateTime.UtcNow - session.StartedAt).TotalSeconds;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            sessionId = session.Id,
            partNumber = session.PartNumber,
            totalQuestions = session.TotalQuestions,
            correctAnswers = session.CorrectAnswers,
            accuracy = session.TotalQuestions > 0 
                ? Math.Round((double)session.CorrectAnswers / session.TotalQuestions * 100, 1) 
                : 0,
            timeSpent = session.TimeSpentSeconds,
            completedAt = session.CompletedAt
        });
    }

    /// <summary>
    /// Lịch sử luyện tập
    /// </summary>
    [HttpGet("history")]
    public async Task<IActionResult> GetPracticeHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var userId = GetUserId();
        
        var query = _context.PracticeSessions
            .Where(s => s.UserId == userId && s.Status == "completed")
            .OrderByDescending(s => s.CompletedAt);

        var total = await query.CountAsync();

        var sessions = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new
            {
                s.Id,
                s.PartNumber,
                s.TotalQuestions,
                s.CorrectAnswers,
                Accuracy = s.TotalQuestions > 0 
                    ? Math.Round((double)s.CorrectAnswers / s.TotalQuestions * 100, 1) 
                    : 0,
                s.TimeSpentSeconds,
                s.StartedAt,
                s.CompletedAt
            })
            .ToListAsync();

        return Ok(new
        {
            items = sessions,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(total / (double)pageSize)
        });
    }
}

public class StartPracticeRequest
{
    public int PartNumber { get; set; }
    public int? QuestionCount { get; set; } = 10;
}

public class PracticeAnswerRequest
{
    public int QuestionId { get; set; }
    public string? SelectedOption { get; set; }
}

public class CompletePracticeRequest
{
    public int? TimeSpentSeconds { get; set; }
}
