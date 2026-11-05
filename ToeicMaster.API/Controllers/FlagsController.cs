using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models.Flag;

namespace ToeicMaster.API.Controllers;

/// <summary>
/// Đánh dấu câu hỏi để xem lại sau ("Lưu lại để xem sau").
/// Lưu bền trong bảng dbo.QuestionFlags theo từng user, thay cho localStorage.
///
///   GET    api/v1/flags              -> tất cả câu đã đánh dấu của user
///   POST   api/v1/flags              -> { questionId } thêm đánh dấu (idempotent)
///   POST   api/v1/flags/toggle       -> { questionId } đảo trạng thái, trả về trạng thái mới
///   POST   api/v1/flags/check-batch  -> [1,2,3] trả về các id đã đánh dấu
///   DELETE api/v1/flags/{questionId} -> bỏ đánh dấu (idempotent)
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class FlagsController : ControllerBase
{
    // Giới hạn kích thước mệnh đề IN (...) khi kiểm tra hàng loạt
    private const int MaxBatchSize = 500;

    private readonly AppDbContext _context;
    private readonly ILogger<FlagsController> _logger;

    public FlagsController(AppDbContext context, ILogger<FlagsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>
    /// Lấy toàn bộ câu hỏi user đã đánh dấu (mới nhất trước).
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetFlags()
    {
        var userId = GetUserId();

        var flaggedIds = await _context.QuestionFlags
            .AsNoTracking()
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => f.QuestionId)
            .ToListAsync();

        return Ok(new { flaggedIds, total = flaggedIds.Count });
    }

    /// <summary>
    /// Kiểm tra nhiều câu hỏi đã được đánh dấu chưa (batch).
    /// </summary>
    [HttpPost("check-batch")]
    public async Task<IActionResult> CheckBatch([FromBody] int[]? questionIds)
    {
        var userId = GetUserId();

        if (questionIds == null || questionIds.Length == 0)
            return Ok(new { flaggedIds = Array.Empty<int>() });

        var ids = questionIds
            .Where(id => id > 0)
            .Distinct()
            .Take(MaxBatchSize)
            .ToList();

        if (ids.Count == 0)
            return Ok(new { flaggedIds = Array.Empty<int>() });

        var flagged = await _context.QuestionFlags
            .AsNoTracking()
            .Where(f => f.UserId == userId && ids.Contains(f.QuestionId))
            .Select(f => f.QuestionId)
            .ToListAsync();

        return Ok(new { flaggedIds = flagged });
    }

    /// <summary>
    /// Thêm đánh dấu cho một câu hỏi. Gọi lại nhiều lần vẫn cho cùng kết quả.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> AddFlag([FromBody] FlagRequest request)
    {
        var userId = GetUserId();
        return await AddFlagCoreAsync(userId, request.QuestionId);
    }

    /// <summary>
    /// Đảo trạng thái đánh dấu của một câu hỏi và trả về trạng thái mới.
    /// </summary>
    [HttpPost("toggle")]
    public async Task<IActionResult> ToggleFlag([FromBody] FlagRequest request)
    {
        var userId = GetUserId();

        if (request.QuestionId <= 0)
            return BadRequest(new { error = "questionId không hợp lệ" });

        var existing = await _context.QuestionFlags
            .FirstOrDefaultAsync(f => f.UserId == userId && f.QuestionId == request.QuestionId);

        if (existing != null)
        {
            _context.QuestionFlags.Remove(existing);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Bỏ đánh dấu thất bại (user {UserId}, question {QuestionId})", userId, request.QuestionId);
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    error = "Không bỏ được đánh dấu",
                    detail = ex.InnerException?.Message ?? ex.Message
                });
            }

            return Ok(new { flagged = false, questionId = request.QuestionId });
        }

        var added = await AddFlagCoreAsync(userId, request.QuestionId);
        if (added is not OkObjectResult)
            return added;

        return Ok(new { flagged = true, questionId = request.QuestionId });
    }

    /// <summary>
    /// Bỏ đánh dấu một câu hỏi. Không tồn tại thì coi như đã bỏ (idempotent).
    /// </summary>
    [HttpDelete("{questionId:int}")]
    public async Task<IActionResult> RemoveFlag(int questionId)
    {
        var userId = GetUserId();

        var flag = await _context.QuestionFlags
            .FirstOrDefaultAsync(f => f.UserId == userId && f.QuestionId == questionId);

        if (flag == null)
            return Ok(new { flagged = false, questionId, message = "Câu hỏi chưa được đánh dấu" });

        _context.QuestionFlags.Remove(flag);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Bỏ đánh dấu thất bại (user {UserId}, question {QuestionId})", userId, questionId);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                error = "Không bỏ được đánh dấu",
                detail = ex.InnerException?.Message ?? ex.Message
            });
        }

        return Ok(new { flagged = false, questionId });
    }

    /// <summary>
    /// Logic thêm đánh dấu dùng chung cho POST /flags và POST /flags/toggle.
    /// </summary>
    private async Task<IActionResult> AddFlagCoreAsync(int userId, int questionId)
    {
        if (questionId <= 0)
            return BadRequest(new { error = "questionId không hợp lệ" });

        var alreadyFlagged = await _context.QuestionFlags
            .AnyAsync(f => f.UserId == userId && f.QuestionId == questionId);

        if (alreadyFlagged)
            return Ok(new { flagged = true, questionId, message = "Câu hỏi đã được đánh dấu" });

        var questionExists = await _context.Questions
            .AsNoTracking()
            .AnyAsync(q => q.Id == questionId);

        if (!questionExists)
            return NotFound(new { error = "Câu hỏi không tồn tại" });

        var flag = new QuestionFlag
        {
            UserId = userId,
            QuestionId = questionId,
            CreatedAt = DateTime.UtcNow
        };

        _context.QuestionFlags.Add(flag);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Lưu đánh dấu thất bại (user {UserId}, question {QuestionId})", userId, questionId);
            _context.Entry(flag).State = EntityState.Detached;

            // Hai request đồng thời: unique index (UserId, QuestionId) đã chặn -> coi như thành công
            var nowExists = await _context.QuestionFlags
                .AsNoTracking()
                .AnyAsync(f => f.UserId == userId && f.QuestionId == questionId);

            if (nowExists)
                return Ok(new { flagged = true, questionId });

            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                error = "Không lưu được đánh dấu",
                detail = ex.InnerException?.Message ?? ex.Message
            });
        }

        return Ok(new { flagged = true, questionId, message = "Đã đánh dấu câu hỏi" });
    }
}
