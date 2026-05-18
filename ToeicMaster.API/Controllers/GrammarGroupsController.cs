using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToeicMaster.API.Models;
using ToeicMaster.API.Services;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/grammar/groups")]
[Authorize]
public class GrammarGroupsController : ControllerBase
{
    private readonly IGrammarService _grammarService;
    private readonly ILogger<GrammarGroupsController> _logger;

    public GrammarGroupsController(IGrammarService grammarService, ILogger<GrammarGroupsController> logger)
    {
        _grammarService = grammarService;
        _logger = logger;
    }

    /// <summary>
    /// Lấy tất cả Grammar Groups
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllGrammarGroups()
    {
        try
        {
            var groups = await _grammarService.GetAllGrammarGroupsAsync();
            return Ok(groups);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar groups: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy danh sách nhóm ngữ pháp" });
        }
    }

    /// <summary>
    /// Lấy chi tiết Grammar Group theo UUID
    /// </summary>
    [HttpGet("{groupGuid:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGrammarGroupByGuid(Guid groupGuid)
    {
        try
        {
            var group = await _grammarService.GetGrammarGroupByGuidAsync(groupGuid);
            if (group == null)
                return NotFound(new { error = "Nhóm ngữ pháp không tồn tại" });

            return Ok(group);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar group {groupGuid}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy chi tiết nhóm" });
        }
    }

#if DEBUG
    /// <summary>
    /// Lấy chi tiết Grammar Group theo ID (Internal - Development only)
    /// </summary>
    [HttpGet("internal/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetGrammarGroupById(int id)
    {
        try
        {
            var group = await _grammarService.GetGrammarGroupByIdAsync(id);
            if (group == null)
                return NotFound(new { error = "Nhóm ngữ pháp không tồn tại" });

            return Ok(group);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar group {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy chi tiết nhóm" });
        }
    }
#endif

    /// <summary>
    /// Tạo mới Grammar Group (Admin)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateGrammarGroup([FromBody] AddGrammarGroupRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Title))
                return BadRequest(new { error = "Tiêu đề không được để trống" });

            var group = await _grammarService.CreateGrammarGroupAsync(request);
            return CreatedAtAction(nameof(GetGrammarGroupByGuid), new { groupGuid = group.GroupGuid }, group);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammar group: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi tạo nhóm ngữ pháp" });
        }
    }

    /// <summary>
    /// Cập nhật Grammar Group (Admin)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateGrammarGroup(int id, [FromBody] UpdateGrammarGroupRequest request)
    {
        try
        {
            var group = await _grammarService.UpdateGrammarGroupAsync(id, request);
            if (group == null)
                return NotFound(new { error = "Nhóm ngữ pháp không tồn tại" });

            return Ok(group);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating grammar group {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi cập nhật nhóm" });
        }
    }

    /// <summary>
    /// Xóa Grammar Group (Admin)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGrammarGroup(int id)
    {
        try
        {
            var result = await _grammarService.DeleteGrammarGroupAsync(id);
            if (!result)
                return NotFound(new { error = "Nhóm ngữ pháp không tồn tại" });

            return Ok(new { message = "Xóa nhóm ngữ pháp thành công" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting grammar group {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi xóa nhóm" });
        }
    }
}
