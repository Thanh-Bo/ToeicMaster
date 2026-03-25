using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class QuestionVocabController : ControllerBase
{
    private readonly AppDbContext _context;

    public QuestionVocabController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Generate AI explanation for a QuestionVocab
    /// </summary>
    [HttpPost("{questionVocabId}/generate-explanation")]
    public async Task<IActionResult> GenerateExplanation(
        int questionVocabId,
        [FromServices] AiExplanationService aiService)
    {
        // Fetch the QuestionVocab with its answers
        var questionVocab = await _context.QuestionVocab
            .Include(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == questionVocabId);

        if (questionVocab == null)
            return NotFound(new { error = "Câu hỏi vocabulary không tồn tại" });

        try
        {
            // Build options list from the answers
            var options = questionVocab.Answers
                .OrderBy(a => a.Label)
                .Select(a => a.Content ?? "")
                .ToList();

            // Generate explanation using AI service
            var (shortExplanation, fullExplanation) = await aiService
                .GenerateVocabularyExplanationAsync(
                    questionVocab.Content ?? "",
                    options,
                    questionVocab.CorrectOption ?? ""
                );

            // Update the database with the explanations
            questionVocab.ShortExplanation = shortExplanation;
            questionVocab.LongExplanation = fullExplanation;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                questionVocabId = questionVocab.Id,
                content = questionVocab.Content,
                correctOption = questionVocab.CorrectOption,
                shortExplanation,
                fullExplanation
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Lỗi khi tạo giải thích", details = ex.Message });
        }
    }

    /// <summary>
    /// Get a QuestionVocab with all its data
    /// </summary>
    [HttpGet("{questionVocabId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetQuestionVocab(int questionVocabId)
    {
        var questionVocab = await _context.QuestionVocab
            .Include(q => q.Answers)
            .Include(q => q.Topic)
            .FirstOrDefaultAsync(q => q.Id == questionVocabId);

        if (questionVocab == null)
            return NotFound(new { error = "Câu hỏi vocabulary không tồn tại" });

        var answers = questionVocab.Answers
            .OrderBy(a => a.Label)
            .Select(a => new
            {
                label = a.Label,
                content = a.Content,
                isCorrect = a.IsCorrect
            })
            .ToList();

        return Ok(new
        {
            id = questionVocab.Id,
            topicId = questionVocab.TopicId,
            topicTitle = questionVocab.Topic?.Title,
            questionNo = questionVocab.QuestionNo,
            content = questionVocab.Content,
            correctOption = questionVocab.CorrectOption,
            shortExplanation = questionVocab.ShortExplanation,
            longExplanation = questionVocab.LongExplanation,
            answers = answers
        });
    }

    /// <summary>
    /// Get QuestionVocab list by Topic
    /// </summary>
    [HttpGet("topic/{topicId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetQuestionVocabByTopic(
        int topicId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.QuestionVocab
            .Where(q => q.TopicId == topicId);

        var total = await query.CountAsync();

        var questions = await query
            .Include(q => q.Answers)
            .OrderBy(q => q.QuestionNo)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(q => new
            {
                id = q.Id,
                questionNo = q.QuestionNo,
                content = q.Content,
                correctOption = q.CorrectOption,
                shortExplanation = q.ShortExplanation,
                longExplanation = q.LongExplanation,
                hasExplanation = !string.IsNullOrEmpty(q.ShortExplanation),
                answers = q.Answers.OrderBy(a => a.Label).Select(a => new
                {
                    label = a.Label,
                    content = a.Content
                }).ToList()
            })
            .ToListAsync();

        return Ok(new
        {
            items = questions,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(total / (double)pageSize)
        });
    }
}
