using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models.Bookmark;

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
    /// Lấy danh sách bookmark của user (Có hỗ trợ Filter & Sort)
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetBookmarks([FromQuery] GetBookmarksRequest request)
    {
        var userId = GetUserId();

        var query = _context.Bookmarks
            .Where(b => b.UserId == userId)
            .Include(b => b.Question)
                .ThenInclude(q => q.Answers)
            .Include(b => b.Question)
                .ThenInclude(q => q.Group)
                    .ThenInclude(g => g.Part)
            .AsQueryable();

        // 1. Lọc theo Part (Nếu request.PartNumber có giá trị)
        if (request.PartNumber.HasValue)
        {
            query = query.Where(b => b.Question.Group.Part.PartNumber == request.PartNumber.Value);
        }

        // 2. Lọc theo thời gian (Từ ngày... Đến ngày...)
        if (request.FromDate.HasValue)
        {
            query = query.Where(b => b.CreatedAt >= request.FromDate.Value);
        }
        if (request.ToDate.HasValue)
        {
            query = query.Where(b => b.CreatedAt <= request.ToDate.Value);
        }

        // 3. Sắp xếp (Sort)
        switch (request.Sort?.ToLower())
        {
            case "oldest":
                query = query.OrderBy(b => b.CreatedAt); // Cũ nhất lên đầu
                break;
            // Bạn có thể thêm case "random" nếu muốn làm tính năng "Ôn tập ngẫu nhiên"
            default:
                query = query.OrderByDescending(b => b.CreatedAt); // Mặc định: Mới nhất lên đầu
                break;
        }

        // Đếm tổng số bản ghi (sau khi lọc) để phân trang
        var total = await query.CountAsync();

        var bookmarks = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(b => new
            {
                b.Id,
                b.QuestionId,
                b.Note,
                b.CreatedAt,
                // Trả về thêm tên đề thi gốc (Context Source) để hiển thị UI
                SourceTestName = b.Question.Group.Part.Test.Title,
                Question = new
                {
                    b.Question.Id,
                    b.Question.QuestionNo,
                    b.Question.Content,
                    b.Question.CorrectOption,
                    GroupId = b.Question.GroupId,
                    TextContent = b.Question.Group.TextContent,
                    ImageUrl = b.Question.Group.ImageUrl,
                    AudioUrl = b.Question.Group.AudioUrl,
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
            page = request.Page,
            pageSize = request.PageSize,
            totalPages = (int)Math.Ceiling(total / (double)request.PageSize)
        });
    }

    // Thêm vào trong BookmarksController

    /// <summary>
    /// Lấy thống kê số lượng bookmark theo Part
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetBookmarkStats()
    {
        var userId = GetUserId();

        // Group by PartNumber và đếm số lượng
        var stats = await _context.Bookmarks
            .Where(b => b.UserId == userId)
            .GroupBy(b => b.Question.Group.Part.PartNumber)
            .Select(g => new { PartNumber = g.Key, Count = g.Count() })
            .ToListAsync();

        var total = stats.Sum(s => s.Count);

        // Chuyển về dạng Dictionary cho Frontend dễ dùng: { "1": 10, "2": 5, "total": 15 }
        // SỬA DÒNG NÀY:
        var result = stats.ToDictionary(k => k.PartNumber?.ToString() ?? "Unknown", v => v.Count);

        return Ok(new { total, parts = result });
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
            existing.CreatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã cập nhật ghi chú", bookmarkId = existing.Id, createdAt = existing.CreatedAt });
        }

        // Check question exists
        var question = await _context.Questions.FindAsync(request.QuestionId);
        if (question == null)
            return NotFound(new { error = "Câu hỏi không tồn tại" });

        // Add timestamp for bookmark creation
        var bookmark = new Bookmark
        {
            UserId = userId,
            QuestionId = request.QuestionId,
            Note = request.Note,
            CreatedAt = DateTime.UtcNow // Add current timestamp
        };

        _context.Bookmarks.Add(bookmark);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Đã thêm bookmark",
            bookmarkId = bookmark.Id,
            createdAt = bookmark.CreatedAt // Include timestamp in response
        });
    }

    /// <summary>
    /// Xóa bookmark
    /// </summary>
    [HttpDelete("{questionId:int}")]
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
    /// Xóa toàn bộ danh sách bookmark của người dùng hiện tại
    /// </summary>
    [HttpDelete("all")]
    public async Task<IActionResult> RemoveAllBookmarks()
    {
        var userId = GetUserId();

        // Tìm tất cả bookmark của user này
        var userBookmarks = _context.Bookmarks.Where(b => b.UserId == userId);

        // Kiểm tra nếu không có bookmark nào để xóa
        var count = await userBookmarks.CountAsync();
        if (count == 0)
        {
            return Ok(new { message = "Danh sách bookmark của bạn vốn đã trống" });
        }

        // Xóa hàng loạt
        _context.Bookmarks.RemoveRange(userBookmarks);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Đã xóa thành công toàn bộ {count} bookmark của bạn" });
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
