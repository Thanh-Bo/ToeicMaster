using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToeicMaster.API.Models;
using ToeicMaster.API.Services;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class QuestionGrammarController : ControllerBase
{
    private readonly IGrammarService _grammarService;
    private readonly ILogger<QuestionGrammarController> _logger;

    public QuestionGrammarController(IGrammarService grammarService, ILogger<QuestionGrammarController> logger)
    {
        _grammarService = grammarService;
        _logger = logger;
    }

    // ==========================================
    // 1. GET GRAMMAR QUESTIONS
    // ==========================================

    /// <summary>
    /// Lấy danh sách câu hỏi ngữ pháp theo Topic
    /// </summary>
    [HttpGet("topic/{topicId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetQuestionsByTopic(
        int topicId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            if (topicId <= 0)
                return BadRequest(new { error = "Topic ID không hợp lệ" });

            var questions = await _grammarService.GetGrammarQuestionsByTopicAsync(topicId, page, pageSize);

            if (!questions.Any())
                return NotFound(new { error = "Không tìm thấy câu hỏi cho chủ đề này" });

            return Ok(new
            {
                items = questions,
                page,
                pageSize,
                total = questions.Count,
                totalPages = (int)Math.Ceiling(questions.Count / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar questions: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy câu hỏi ngữ pháp" });
        }
    }

    /// <summary>
    /// Lấy chi tiết một câu hỏi ngữ pháp
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetQuestionById(int id)
    {
        try
        {
            if (id <= 0)
                return BadRequest(new { error = "Question ID không hợp lệ" });

            var question = await _grammarService.GetGrammarQuestionByIdAsync(id);

            if (question == null)
                return NotFound(new { error = "Câu hỏi không tồn tại" });

            return Ok(question);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar question {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy câu hỏi" });
        }
    }

    /// <summary>
    /// Lấy danh sách đáp án của một câu hỏi
    /// </summary>
    [HttpGet("{questionId}/answers")]
    [AllowAnonymous]
    public async Task<IActionResult> GetQuestionAnswers(int questionId)
    {
        try
        {
            if (questionId <= 0)
                return BadRequest(new { error = "Question ID không hợp lệ" });

            var answers = await _grammarService.GetQuestionAnswersAsync(questionId);

            if (!answers.Any())
                return NotFound(new { error = "Không tìm thấy đáp án" });

            return Ok(answers);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting question answers: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy đáp án" });
        }
    }

    // ==========================================
    // 2. CREATE GRAMMAR QUESTIONS (Admin)
    // ==========================================

    /// <summary>
    /// Tạo câu hỏi ngữ pháp (Admin)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateQuestion([FromBody] CreateQuestionGrammarRequest request)
    {
        try
        {
            if (request == null || string.IsNullOrEmpty(request.Content))
                return BadRequest(new { error = "Nội dung câu hỏi không được để trống" });

            if (request.TopicId <= 0)
                return BadRequest(new { error = "Topic ID không hợp lệ" });

            if (request.Options == null || request.Options.Count != 4)
                return BadRequest(new { error = "Phải có đúng 4 lựa chọn (A, B, C, D)" });

            if (string.IsNullOrEmpty(request.CorrectOption) || !new[] { "A", "B", "C", "D" }.Contains(request.CorrectOption))
                return BadRequest(new { error = "Đáp án đúng phải là A, B, C hoặc D" });

            var importDto = new QuestionGrammarImportItemDto
            {
                QuestionNo = request.QuestionNo,
                Content = request.Content,
                Options = request.Options,
                CorrectOption = request.CorrectOption,
                ShortExplanation = request.ShortExplanation,
                LongExplanation = request.LongExplanation
            };

            var question = await _grammarService.CreateGrammarQuestionAsync(request.TopicId, importDto);

            return CreatedAtAction(nameof(GetQuestionById), new { id = question.Id }, question);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammar question: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi tạo câu hỏi" });
        }
    }

    /// <summary>
    /// Import hàng loạt câu hỏi ngữ pháp (Admin)
    /// </summary>
    [HttpPost("import")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ImportQuestions([FromBody] ImportGrammarQuestionsRequest request)
    {
        try
        {
            if (request == null || request.TopicId <= 0)
                return BadRequest(new { error = "Topic ID không hợp lệ" });

            if (request.Questions == null || !request.Questions.Any())
                return BadRequest(new { error = "Danh sách câu hỏi không được để trống" });

            int successCount = 0;
            int errorCount = 0;
            var errors = new List<string>();

            foreach (var question in request.Questions)
            {
                try
                {
                    if (string.IsNullOrEmpty(question.Content))
                    {
                        errorCount++;
                        errors.Add($"Câu {question.QuestionNo}: Nội dung không được để trống");
                        continue;
                    }

                    if (question.Options == null || question.Options.Count != 4)
                    {
                        errorCount++;
                        errors.Add($"Câu {question.QuestionNo}: Số lượng lựa chọn không đúng");
                        continue;
                    }

                    await _grammarService.CreateGrammarQuestionAsync(request.TopicId, question);
                    successCount++;
                }
                catch (Exception ex)
                {
                    errorCount++;
                    errors.Add($"Câu {question.QuestionNo}: {ex.Message}");
                }
            }

            return Ok(new
            {
                message = $"Import thành công {successCount} câu hỏi" + (errorCount > 0 ? $", lỗi {errorCount} câu" : ""),
                successCount,
                errorCount,
                errors = errorCount > 0 ? errors : null
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error importing grammar questions: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi import câu hỏi" });
        }
    }

    // ==========================================
    // 3. DELETE GRAMMAR QUESTIONS (Admin)
    // ==========================================

    /// <summary>
    /// Xóa câu hỏi ngữ pháp (Admin)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteQuestion(int id)
    {
        try
        {
            if (id <= 0)
                return BadRequest(new { error = "Question ID không hợp lệ" });

            var result = await _grammarService.DeleteGrammarQuestionAsync(id);

            if (!result)
                return NotFound(new { error = "Câu hỏi không tồn tại" });

            return Ok(new { message = "Xóa câu hỏi thành công" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting grammar question {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi xóa câu hỏi" });
        }
    }

    /// <summary>
    /// Xóa tất cả câu hỏi của một topic (Admin)
    /// </summary>
    [HttpDelete("topic/{topicId}/delete-all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAllQuestionsInTopic(int topicId)
    {
        try
        {
            if (topicId <= 0)
                return BadRequest(new { error = "Topic ID không hợp lệ" });

            var questions = await _grammarService.GetGrammarQuestionsByTopicAsync(topicId, 1, 1000);

            int deletedCount = 0;
            foreach (var question in questions)
            {
                if (await _grammarService.DeleteGrammarQuestionAsync(question.Id))
                    deletedCount++;
            }

            return Ok(new
            {
                message = $"Đã xóa {deletedCount} câu hỏi",
                deletedCount
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting all questions in topic {topicId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi xóa câu hỏi" });
        }
    }
}

// ==========================================
// HELPER CLASSES
// ==========================================

public class CreateQuestionGrammarRequest
{
    public int TopicId { get; set; }
    public int QuestionNo { get; set; }
    public string Content { get; set; } = string.Empty;
    public List<string> Options { get; set; } = new(); // [A, B, C, D]
    public string CorrectOption { get; set; } = string.Empty; // A, B, C, D
    public string? ShortExplanation { get; set; }
    public string? LongExplanation { get; set; }
}

public class ImportGrammarQuestionsRequest
{
    public int TopicId { get; set; }
    public List<QuestionGrammarImportItemDto> Questions { get; set; } = new();
}
