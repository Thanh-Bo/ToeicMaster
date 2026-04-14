using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToeicMaster.API.Models;
using ToeicMaster.API.Services;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class GrammarController : ControllerBase
{
    private readonly IGrammarService _grammarService;
    private readonly ILogger<GrammarController> _logger;

    public GrammarController(IGrammarService grammarService, ILogger<GrammarController> logger)
    {
        _grammarService = grammarService;
        _logger = logger;
    }

    // ==========================================
    // 1. GRAMMAR TOPICS APIs
    // ==========================================

    /// <summary>
    /// Lấy tất cả Grammar Topics
    /// </summary>
    [HttpGet("topics")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllGrammarTopics()
    {
        try
        {
            var topics = await _grammarService.GetAllGrammarTopicsAsync();
            return Ok(topics);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar topics: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy danh sách chủ đề ngữ pháp" });
        }
    }

    /// <summary>
    /// Lấy chi tiết Grammar Topic theo ID
    /// </summary>
    [HttpGet("topics/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGrammarTopicById(int id)
    {
        try
        {
            var topic = await _grammarService.GetGrammarTopicByIdAsync(id);
            if (topic == null)
                return NotFound(new { error = "Chủ đề ngữ pháp không tồn tại" });

            return Ok(topic);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar topic {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy chi tiết chủ đề" });
        }
    }

    /// <summary>
    /// Tạo mới Grammar Topic (Admin)
    /// </summary>
    [HttpPost("topics")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateGrammarTopic([FromBody] AddGrammarTopicRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Title))
                return BadRequest(new { error = "Tiêu đề không được để trống" });

            var topic = await _grammarService.CreateGrammarTopicAsync(request);
            return CreatedAtAction(nameof(GetGrammarTopicById), new { id = topic.Id }, topic);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammar topic: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi tạo chủ đề ngữ pháp" });
        }
    }

    /// <summary>
    /// Cập nhật Grammar Topic (Admin)
    /// </summary>
    [HttpPut("topics/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateGrammarTopic(int id, [FromBody] UpdateGrammarTopicRequest request)
    {
        try
        {
            var topic = await _grammarService.UpdateGrammarTopicAsync(id, request);
            if (topic == null)
                return NotFound(new { error = "Chủ đề ngữ pháp không tồn tại" });

            return Ok(topic);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating grammar topic {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi cập nhật chủ đề" });
        }
    }

    /// <summary>
    /// Xóa Grammar Topic (Admin)
    /// </summary>
    [HttpDelete("topics/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGrammarTopic(int id)
    {
        try
        {
            var result = await _grammarService.DeleteGrammarTopicAsync(id);
            if (!result)
                return NotFound(new { error = "Chủ đề ngữ pháp không tồn tại" });

            return Ok(new { message = "Xóa chủ đề ngữ pháp thành công" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting grammar topic {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi xóa chủ đề" });
        }
    }

    // ==========================================
    // 2. GRAMMARS APIs
    // ==========================================

    /// <summary>
    /// Lấy tất cả quy tắc ngữ pháp theo Topic
    /// </summary>
    [HttpGet("topics/{topicId}/grammars")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGrammarsByTopic(int topicId)
    {
        try
        {
            var grammars = await _grammarService.GetGrammarsByTopicIdAsync(topicId);
            return Ok(grammars);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammars for topic {topicId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy quy tắc ngữ pháp" });
        }
    }

    /// <summary>
    /// Lấy chi tiết quy tắc ngữ pháp theo ID
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGrammarById(int id)
    {
        try
        {
            var grammar = await _grammarService.GetGrammarByIdAsync(id);
            if (grammar == null)
                return NotFound(new { error = "Quy tắc ngữ pháp không tồn tại" });

            return Ok(grammar);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy chi tiết quy tắc" });
        }
    }

    /// <summary>
    /// Tạo mới quy tắc ngữ pháp (Admin)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateGrammar([FromBody] AddGrammarRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.RuleName))
                return BadRequest(new { error = "Tên quy tắc không được để trống" });

            var grammar = await _grammarService.CreateGrammarAsync(request);
            return CreatedAtAction(nameof(GetGrammarById), new { id = grammar.Id }, grammar);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammar: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi tạo quy tắc ngữ pháp" });
        }
    }

    /// <summary>
    /// Cập nhật quy tắc ngữ pháp (Admin)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateGrammar(int id, [FromBody] UpdateGrammarRequest request)
    {
        try
        {
            var grammar = await _grammarService.UpdateGrammarAsync(id, request);
            if (grammar == null)
                return NotFound(new { error = "Quy tắc ngữ pháp không tồn tại" });

            return Ok(grammar);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating grammar {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi cập nhật quy tắc" });
        }
    }

    /// <summary>
    /// Xóa quy tắc ngữ pháp (Admin)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGrammar(int id)
    {
        try
        {
            var result = await _grammarService.DeleteGrammarAsync(id);
            if (!result)
                return NotFound(new { error = "Quy tắc ngữ pháp không tồn tại" });

            return Ok(new { message = "Xóa quy tắc ngữ pháp thành công" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting grammar {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi xóa quy tắc" });
        }
    }

    /// <summary>
    /// Tìm kiếm quy tắc ngữ pháp
    /// </summary>
    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchGrammars([FromQuery] string keyword)
    {
        try
        {
            if (string.IsNullOrEmpty(keyword))
                return BadRequest(new { error = "Từ khóa không được để trống" });

            var grammars = await _grammarService.SearchGrammarsAsync(keyword);
            return Ok(grammars);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error searching grammars: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi tìm kiếm" });
        }
    }

    // ==========================================
    // 3. GRAMMAR EXAMPLES APIs
    // ==========================================

    /// <summary>
    /// Lấy các ví dụ của một quy tắc
    /// </summary>
    [HttpGet("{grammarId}/examples")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGrammarExamples(int grammarId)
    {
        try
        {
            var examples = await _grammarService.GetGrammarExamplesAsync(grammarId);
            return Ok(examples);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar examples: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy ví dụ" });
        }
    }

    /// <summary>
    /// Thêm ví dụ cho quy tắc ngữ pháp (Admin)
    /// </summary>
    [HttpPost("{grammarId}/examples")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddGrammarExample(int grammarId, [FromBody] GrammarExampleDto request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Sentence))
                return BadRequest(new { error = "Câu ví dụ không được để trống" });

            var example = await _grammarService.AddGrammarExampleAsync(grammarId, request);
            return CreatedAtAction(nameof(GetGrammarExamples), new { grammarId = grammarId }, example);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error adding grammar example: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi thêm ví dụ" });
        }
    }

    /// <summary>
    /// Xóa ví dụ (Admin)
    /// </summary>
    [HttpDelete("examples/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGrammarExample(int id)
    {
        try
        {
            var result = await _grammarService.DeleteGrammarExampleAsync(id);
            if (!result)
                return NotFound(new { error = "Ví dụ không tồn tại" });

            return Ok(new { message = "Xóa ví dụ thành công" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting grammar example {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi xóa ví dụ" });
        }
    }

    // ==========================================
    // 4. GRAMMAR QUESTIONS APIs
    // ==========================================

    /// <summary>
    /// Lấy danh sách câu hỏi ngữ pháp theo Topic
    /// </summary>
    [HttpGet("topics/{topicId}/questions")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGrammarQuestionsByTopic(
        int topicId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var questions = await _grammarService.GetGrammarQuestionsByTopicAsync(topicId, page, pageSize);
            return Ok(new
            {
                items = questions,
                page,
                pageSize,
                total = questions.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar questions: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy câu hỏi" });
        }
    }

    /// <summary>
    /// Lấy chi tiết câu hỏi ngữ pháp
    /// </summary>
    [HttpGet("questions/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGrammarQuestionById(int id)
    {
        try
        {
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
    /// Tạo câu hỏi ngữ pháp (Admin)
    /// </summary>
    [HttpPost("topics/{topicId}/questions")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateGrammarQuestion(
        int topicId,
        [FromBody] QuestionGrammarImportItemDto request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Content))
                return BadRequest(new { error = "Nội dung câu hỏi không được để trống" });

            var question = await _grammarService.CreateGrammarQuestionAsync(topicId, request);
            return CreatedAtAction(nameof(GetGrammarQuestionById), new { id = question.Id }, question);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammar question: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi tạo câu hỏi" });
        }
    }

    /// <summary>
    /// Xóa câu hỏi ngữ pháp (Admin)
    /// </summary>
    [HttpDelete("questions/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGrammarQuestion(int id)
    {
        try
        {
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
    /// Import hàng loạt câu hỏi ngữ pháp (Admin)
    /// </summary>
    [HttpPost("topics/{topicId}/import-questions")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ImportGrammarQuestions(
        int topicId,
        [FromBody] QuestionGrammarImportDto request)
    {
        try
        {
            if (request?.Questions == null || !request.Questions.Any())
                return BadRequest(new { error = "Danh sách câu hỏi không được để trống" });

            int count = 0;
            foreach (var question in request.Questions)
            {
                await _grammarService.CreateGrammarQuestionAsync(topicId, question);
                count++;
            }

            return Ok(new { message = $"Đã import {count} câu hỏi thành công" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error importing grammar questions: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi import câu hỏi" });
        }
    }
}
