using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToeicMaster.API.Models;
using ToeicMaster.API.Services;
using System.Security.Claims;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/users/{userId}/grammar")]
[Authorize]
public class UserGrammarController : ControllerBase
{
    private readonly IGrammarService _grammarService;
    private readonly ILogger<UserGrammarController> _logger;

    public UserGrammarController(IGrammarService grammarService, ILogger<UserGrammarController> logger)
    {
        _grammarService = grammarService;
        _logger = logger;
    }

    /// <summary>
    /// Lấy User ID từ JWT Token
    /// </summary>
    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return int.Parse(userIdClaim?.Value ?? "0");
    }

    /// <summary>
    /// Xác thực userId trong URL khớp với JWT Token
    /// </summary>
    private bool ValidateUserId(int urlUserId)
    {
        int tokenUserId = GetUserId();
        return urlUserId == tokenUserId;
    }

    // ==========================================
    // 1. USER GRAMMAR PROGRESS
    // ==========================================

    /// <summary>
    /// Lấy tiến độ học ngữ pháp của user
    /// GET: /api/v1/users/{userId}/grammar/progress
    /// </summary>
    [HttpGet("progress")]
    public async Task<IActionResult> GetUserGrammarProgress(int userId)
    {
        try
        {
            if (!ValidateUserId(userId))
                return Forbid();

            var progresses = await _grammarService.GetUserGrammarsProgressAsync(userId);
            return Ok(progresses);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting user grammar progress: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy tiến độ học" });
        }
    }

    /// <summary>
    /// Lấy tiến độ học một quy tắc ngữ pháp cụ thể
    /// GET: /api/v1/users/{userId}/grammar/progress/{grammarId}
    /// </summary>
    [HttpGet("progress/{grammarId}")]
    public async Task<IActionResult> GetGrammarProgress(int userId, int grammarId)
    {
        try
        {
            if (!ValidateUserId(userId))
                return Forbid();

            var progress = await _grammarService.GetUserGrammarProgressAsync(userId, grammarId);
            if (progress == null)
                return NotFound(new { error = "Không tìm thấy tiến độ học" });

            return Ok(progress);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar progress: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy tiến độ" });
        }
    }

    /// <summary>
    /// Cập nhật tiến độ học quy tắc ngữ pháp (sau khi làm bài)
    /// PUT: /api/v1/users/{userId}/grammar/progress/{grammarId}
    /// </summary>
    [HttpPut("progress/{grammarId}")]
    public async Task<IActionResult> UpdateGrammarProgress(
        int userId,
        int grammarId,
        [FromBody] UpdateGrammarProgressRequest request)
    {
        try
        {
            if (!ValidateUserId(userId))
                return Forbid();

            var progress = await _grammarService.UpdateUserGrammarProgressAsync(userId, grammarId, request);
            return Ok(new
            {
                message = "Cập nhật tiến độ thành công",
                progress = progress
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating grammar progress: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi cập nhật tiến độ" });
        }
    }


}
