using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Services;

namespace ToeicMaster.API.Controllers;

[Route("api/v1/grammar/questions")]
[ApiController]
[Authorize(Roles = "Admin")]
public class GrammarQuestionGenerationController : ControllerBase
{
    private readonly GrammarAiExplanationService _aiService;
    private readonly AppDbContext _context;
    private readonly ILogger<GrammarQuestionGenerationController> _logger;

    public GrammarQuestionGenerationController(
        GrammarAiExplanationService aiService,
        AppDbContext context,
        ILogger<GrammarQuestionGenerationController> logger)
    {
        _aiService = aiService;
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Tạo giải thích AI cho 1 câu hỏi cụ thể
    /// </summary>
    [HttpPost("{questionId}/explain")]
    public async Task<IActionResult> GenerateExplanation(int questionId)
    {
        try
        {
            var question = await _context.QuestionGrammars
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == questionId);

            if (question == null)
                return NotFound(new { error = "Câu hỏi không tồn tại" });

            var options = question.Answers
                .OrderBy(a => a.Label)
                .Select(a => a.Content!)
                .ToList();

            var topic = await _context.GrammarTopics.FindAsync(question.TopicId);
            var grammarTopic = topic?.Title ?? "Ngữ pháp";

            // Generate explanation
            var (shortExp, fullExp) = await _aiService.GenerateExplanationAsync(
                question.Content!,
                options,
                question.CorrectOption!,
                grammarTopic,
                question.Mode
            );

            // Update database
            if (!string.IsNullOrEmpty(shortExp))
                question.ShortExplanation = shortExp;
            
            if (!string.IsNullOrEmpty(fullExp))
                question.LongExplanation = fullExp;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                questionId = question.Id,
                shortExplanation = shortExp,
                fullExplanation = fullExp
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Lỗi tạo giải thích cho câu hỏi {questionId}");
            return StatusCode(500, new { error = $"Lỗi server: {ex.Message}" });
        }
    }

    /// <summary>
    /// Tạo lại giải thích AI cho nhiều câu hỏi trong 1 topic
    /// </summary>
    [HttpPost("topics/{topicId}/regenerate-explanations")]
    public async Task<IActionResult> RegenerateExplanations(int topicId)
    {
        try
        {
            var questions = await _context.QuestionGrammars
                .Include(q => q.Answers)
                .Where(q => q.TopicId == topicId)
                .ToListAsync();

            if (questions.Count == 0)
                return NotFound(new { error = "Không tìm thấy câu hỏi nào cho topic này" });

            var topic = await _context.GrammarTopics.FindAsync(topicId);
            var grammarTopic = topic?.Title ?? "Ngữ pháp";

            var updatedCount = 0;
            var errors = new List<string>();

            foreach (var q in questions)
            {
                try
                {
                    var options = q.Answers
                        .OrderBy(a => a.Label)
                        .Select(a => a.Content!)
                        .ToList();

                    var (shortExp, fullExp) = await _aiService.GenerateExplanationAsync(
                        q.Content!,
                        options,
                        q.CorrectOption!,
                        grammarTopic,
                        q.Mode
                    );

                    if (!string.IsNullOrEmpty(shortExp))
                    {
                        q.ShortExplanation = shortExp;
                        q.LongExplanation = fullExp ?? q.LongExplanation;
                        await _context.SaveChangesAsync();
                        updatedCount++;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, $"Không thể tạo giải thích cho câu {q.QuestionNo}");
                    errors.Add($"Câu {q.QuestionNo}: {ex.Message}");
                }
            }

            return Ok(new
            {
                message = $"Cập nhật {updatedCount}/{questions.Count} câu hỏi",
                totalQuestions = questions.Count,
                updatedCount = updatedCount,
                errors = errors
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Lỗi tạo lại giải thích cho topic {topicId}");
            return StatusCode(500, new { error = $"Lỗi server: {ex.Message}" });
        }
    }
}
