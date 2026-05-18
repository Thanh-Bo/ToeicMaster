using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ToeicMaster.API.Models;
using ToeicMaster.API.Services;
using System.Security.Claims;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/grammar/groups")]
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

    /// <summary>
    /// Lấy User ID từ JWT Token (returns null if not authenticated)
    /// </summary>
    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return null;
        return int.TryParse(userIdClaim.Value, out int userId) ? userId : null;
    }

    // ==========================================
    // LAYER 2: GRAMMAR TOPICS (under Groups)
    // ==========================================

    /// <summary>
    /// GET /api/v1/grammar/groups/{groupGuid}/topics
    /// Lấy tất cả Grammar Topics trong một Group (UUID)
    /// </summary>
    [HttpGet("{groupGuid:guid}/topics")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllGrammarTopics(Guid groupGuid)
    {
        try
        {
            var userId = GetUserId();
            var topics = await _grammarService.GetGrammarsByGroupGuidAsync(groupGuid, userId);
            return Ok(topics);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar topics for group {groupGuid}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy danh sách chủ đề ngữ pháp" });
        }
    }

#if DEBUG
    /// <summary>
    /// GET /api/v1/grammar/groups/{groupId}/topics (Internal - Development only)
    /// </summary>
    [HttpGet("internal/{groupId:int}/topics")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllGrammarTopicsById(int groupId)
    {
        try
        {
            var userId = GetUserId();
            var topics = await _grammarService.GetGrammarsByGroupIdAsync(groupId, userId);
            return Ok(topics);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar topics for group {groupId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy danh sách chủ đề ngữ pháp" });
        }
    }
#endif

    /// <summary>
    /// GET /api/v1/grammar/groups/{groupGuid}/topics/{topicGuid}
    /// Lấy chi tiết Grammar Topic theo UUID
    /// </summary>
    [HttpGet("{groupGuid:guid}/topics/{topicGuid:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGrammarTopicByGuid(Guid groupGuid, Guid topicGuid)
    {
        try
        {
            var userId = GetUserId();
            var topic = await _grammarService.GetGrammarTopicByGuidAsync(topicGuid, userId);
            if (topic == null)
                return NotFound(new { error = "Chủ đề ngữ pháp không tồn tại" });

            return Ok(topic);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar topic {topicGuid}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy chi tiết chủ đề" });
        }
    }

#if DEBUG
    /// <summary>
    /// GET /api/v1/grammar/groups/{groupId}/topics/{id} (Internal - Development only)
    /// </summary>
    [HttpGet("internal/{groupId:int}/topics/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetGrammarTopicById(int groupId, int id)
    {
        try
        {
            var userId = GetUserId();
            var topic = await _grammarService.GetGrammarTopicByIdAsync(id, userId);
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
#endif

    /// <summary>
    /// POST /api/v1/grammar/groups/{groupId}/topics
    /// Tạo mới Grammar Topic - Hỗ trợ cả single và bulk create (Admin only)
    /// </summary>
    [HttpPost("{groupId}/topics")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateGrammarTopic(int groupId, [FromBody] JsonElement request)
    {
        try
        {
            // Check if request is an array (bulk create) or single object
            if (request.ValueKind == JsonValueKind.Array)
            {
                // Bulk create
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var requests = request.Deserialize<List<AddGrammarTopicRequest>>(options);
                if (requests == null || requests.Count == 0)
                    return BadRequest(new { error = "Danh sách chủ đề không được để trống" });

                // Validate all requests
                for (int i = 0; i < requests.Count; i++)
                {
                    var req = requests[i];
                    if (string.IsNullOrEmpty(req.Title))
                        return BadRequest(new { error = $"Tiêu đề không được để trống tại item {i + 1}", received = req });
                }

                var topics = await _grammarService.CreateGrammarTopicsAsync(groupId, requests);
                return Ok(new { message = $"Tạo {topics.Count} chủ đề thành công", topics });
            }
            else if (request.ValueKind == JsonValueKind.Object)
            {
                // Single create
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var singleRequest = request.Deserialize<AddGrammarTopicRequest>(options);
                if (singleRequest == null || string.IsNullOrEmpty(singleRequest.Title))
                    return BadRequest(new { error = "Tiêu đề không được để trống", received = singleRequest });

                var topic = await _grammarService.CreateGrammarTopicAsync(groupId, singleRequest);
                return Ok(new { message = "Tạo chủ đề thành công", topic });
            }

            return BadRequest(new { error = "Dữ liệu không hợp lệ" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammar topic(s): {ex.Message}");
            return StatusCode(500, new { error = "Lỗi tạo chủ đề ngữ pháp" });
        }
    }

    /// <summary>
    /// PUT /api/v1/grammar/groups/{groupId}/topics/{topicId}
    /// Cập nhật Grammar Topic (Admin only)
    /// </summary>
    [HttpPut("{groupId}/topics/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateGrammarTopic(int groupId, int id, [FromBody] UpdateGrammarTopicRequest request)
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
    /// DELETE /api/v1/grammar/groups/{groupId}/topics/{topicId}
    /// Xóa Grammar Topic (Admin only)
    /// </summary>
    [HttpDelete("{groupId}/topics/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGrammarTopic(int groupId, int id)
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
    // 2. GRAMMARS APIs (Layer 3)
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
    [HttpGet("topics/{topicId}/grammars/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGrammarById(int topicId, int id)
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
    [HttpPost("topics/{topicId}/grammars")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateGrammar(int topicId, [FromBody] AddGrammarRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.RuleName))
                return BadRequest(new { error = "Tên quy tắc không được để trống" });

            var grammar = await _grammarService.CreateGrammarAsync(request);
            return CreatedAtAction(nameof(GetGrammarById), new { topicId = topicId, id = grammar.Id }, grammar);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammar: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi tạo quy tắc ngữ pháp" });
        }
    }

    /// <summary>
    /// Tạo nhiều quy tắc ngữ pháp cùng lúc (Admin)
    /// </summary>
    [HttpPost("topics/{topicId}/grammars/bulk")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateGrammarsBulk(int topicId, [FromBody] BulkAddGrammarRequest request)
    {
        try
        {
            if (topicId <= 0)
                return BadRequest(new { error = "Topic ID không hợp lệ" });

            if (request.Rules == null || !request.Rules.Any())
                return BadRequest(new { error = "Danh sách quy tắc không được để trống" });

            // Set TopicId from URL parameter
            request.TopicId = topicId;

            var response = await _grammarService.CreateGrammarsAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammars in bulk: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi tạo quy tắc ngữ pháp hàng loạt" });
        }
    }

    /// <summary>
    /// Cập nhật nhiều quy tắc ngữ pháp cùng lúc (Admin)
    /// </summary>
    [HttpPut("topics/{topicId}/grammars/bulk")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateGrammarsBulk(int topicId, [FromBody] BulkUpdateGrammarRequest request)
    {
        try
        {
            if (topicId <= 0)
                return BadRequest(new { error = "Topic ID không hợp lệ" });

            if (request.Rules == null || !request.Rules.Any())
                return BadRequest(new { error = "Danh sách quy tắc không được để trống" });

            if (request.TopicId != topicId)
                return BadRequest(new { error = "Topic ID trong body không khớp với URL" });

            var response = await _grammarService.UpdateGrammarsAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating grammars in bulk: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi cập nhật quy tắc ngữ pháp hàng loạt" });
        }
    }

    /// <summary>
    /// Cập nhật quy tắc ngữ pháp (Admin)
    /// </summary>
    [HttpPut("topics/{topicId}/grammars/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateGrammar(int topicId, int id, [FromBody] UpdateGrammarRequest request)
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
    [HttpDelete("topics/{topicId}/grammars/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGrammar(int topicId, int id)
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
    /// Xóa tất cả quy tắc ngữ pháp theo Topic (Admin)
    /// </summary>
    [HttpDelete("topics/{topicId}/grammars")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAllGrammarsByTopic(int topicId)
    {
        try
        {
            if (topicId <= 0)
                return BadRequest(new { error = "Topic ID không hợp lệ" });

            var result = await _grammarService.DeleteAllGrammarsByTopicAsync(topicId);
            return Ok(new { message = $"Xóa thành công {result} quy tắc ngữ pháp" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting all grammars for topic {topicId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi xóa quy tắc ngữ pháp" });
        }
    }

    // ==========================================
    // GRAMMAR PRACTICE QUESTIONS
    // ==========================================

    /// <summary>
    /// Lấy câu hỏi luyện tập theo mode (easy/medium/hard)
    /// </summary>
    [HttpGet("topics/{topicId}/practice/{mode}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetQuestionsByMode(int topicId, string mode, [FromQuery] int count = 20)
    {
        try
        {
            if (topicId <= 0)
                return BadRequest(new { error = "Topic ID không hợp lệ" });

            if (string.IsNullOrEmpty(mode) || !new[] { "easy", "medium", "hard" }.Contains(mode.ToLower()))
                return BadRequest(new { error = "Mode phải là: easy, medium, hoặc hard" });

            var questions = await _grammarService.GetGrammarQuestionsByModeAsync(topicId, mode.ToLower(), count);
            
            if (!questions.Any())
                return NotFound(new { error = $"Không tìm thấy câu hỏi {mode} cho topic này" });

            return Ok(new { mode = mode.ToLower(), count = questions.Count, questions = questions });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting practice questions by mode: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy câu hỏi luyện tập" });
        }
    }

    // ==========================================
    // MARK GRAMMAR AS LEARNED (Option A)
    // ==========================================

    /// <summary>
    /// POST /api/v1/grammar/groups/topics/{topicId}/grammars/{grammarId}/learn
    /// Mark grammar as learned when user views the lesson
    /// </summary>
    [HttpPost("topics/{topicId}/grammars/{grammarId}/learn")]
    [Authorize]
    public async Task<IActionResult> MarkGrammarAsLearned(int topicId, int grammarId)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
                return Unauthorized(new { error = "Vui lòng đăng nhập" });

            var progress = await _grammarService.MarkGrammarAsLearnedAsync(userId.Value, grammarId);
            return Ok(new
            {
                message = "Đã đánh dấu đã học",
                grammarId = grammarId,
                status = progress.Status,
                nextReviewAt = progress.NextReviewAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error marking grammar as learned: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi cập nhật tiến độ" });
        }
    }
}

