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
public class BookmarksController : ControllerBase
{
    private readonly AppDbContext _context;

    public BookmarksController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>
    /// Lấy danh sách bookmark của user
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetBookmarks([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetUserId();
        
        var query = _context.Bookmarks
            .Where(b => b.UserId == userId)
            .Include(b => b.Question)
                .ThenInclude(q => q.Answers)
            .Include(b => b.Question)
                .ThenInclude(q => q.Group)
                    .ThenInclude(g => g.Part)
            .OrderByDescending(b => b.CreatedAt);

        var total = await query.CountAsync();
        
        var bookmarks = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new
            {
                b.Id,
                b.QuestionId,
                b.Note,
                b.CreatedAt,
                Question = new
                {
                    b.Question.Id,
                    b.Question.QuestionNo,
                    b.Question.Content,
                    b.Question.CorrectOption,
                    PartNumber = b.Question.Group.Part.PartNumber,
                    PartName = b.Question.Group.Part.Name,
                    Answers = b.Question.Answers.Select(a => new { a.Label, a.Content })
                }
            })
            .ToListAsync();

        return Ok(new
        {
            items = bookmarks,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(total / (double)pageSize)
        });
    }

    /// <summary>
    /// Thêm bookmark
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> AddBookmark([FromBody] AddBookmarkRequest request)
    {
        var userId = GetUserId();

        // Check if already bookmarked
        var existing = await _context.Bookmarks
            .FirstOrDefaultAsync(b => b.UserId == userId && b.QuestionId == request.QuestionId);

        if (existing != null)
        {
            // Update note if exists
            existing.Note = request.Note;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã cập nhật ghi chú", bookmarkId = existing.Id });
        }

        // Check question exists
        var question = await _context.Questions.FindAsync(request.QuestionId);
        if (question == null)
            return NotFound(new { error = "Câu hỏi không tồn tại" });

        var bookmark = new Bookmark
        {
            UserId = userId,
            QuestionId = request.QuestionId,
            Note = request.Note
        };

        _context.Bookmarks.Add(bookmark);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã thêm bookmark", bookmarkId = bookmark.Id });
    }

    /// <summary>
    /// Xóa bookmark
    /// </summary>
    [HttpDelete("{questionId}")]
    public async Task<IActionResult> RemoveBookmark(int questionId)
    {
        var userId = GetUserId();
        
        var bookmark = await _context.Bookmarks
            .FirstOrDefaultAsync(b => b.UserId == userId && b.QuestionId == questionId);

        if (bookmark == null)
            return NotFound(new { error = "Bookmark không tồn tại" });

        _context.Bookmarks.Remove(bookmark);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã xóa bookmark" });
    }

    /// <summary>
    /// Kiểm tra câu hỏi đã được bookmark chưa
    /// </summary>
    [HttpGet("check/{questionId}")]
    public async Task<IActionResult> CheckBookmark(int questionId)
    {
        var userId = GetUserId();
        
        var exists = await _context.Bookmarks
            .AnyAsync(b => b.UserId == userId && b.QuestionId == questionId);

        return Ok(new { isBookmarked = exists });
    }

    /// <summary>
    /// Kiểm tra nhiều câu hỏi đã bookmark chưa (batch)
    /// </summary>
    [HttpPost("check-batch")]
    public async Task<IActionResult> CheckBookmarkBatch([FromBody] int[] questionIds)
    {
        var userId = GetUserId();
        
        var bookmarked = await _context.Bookmarks
            .Where(b => b.UserId == userId && questionIds.Contains(b.QuestionId))
            .Select(b => b.QuestionId)
            .ToListAsync();

        return Ok(new { bookmarkedIds = bookmarked });
    }
}

public class AddBookmarkRequest
{
    public int QuestionId { get; set; }
    public string? Note { get; set; }
}
