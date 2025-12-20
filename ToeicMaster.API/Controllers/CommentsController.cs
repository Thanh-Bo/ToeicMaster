using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models.Comment;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/tests/{testId}/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CommentsController(AppDbContext context)
    {
        _context = context;
    }

    private int? GetUserIdOrNull()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? int.Parse(userIdClaim) : null;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>
    /// Lấy danh sách comments của một bài test
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetComments(
        int testId, 
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20,
        [FromQuery] string sortBy = "newest")
    {
        // Check test exists
        var testExists = await _context.Tests.AnyAsync(t => t.Id == testId);
        if (!testExists)
            return NotFound(new { error = "Bài test không tồn tại" });

        var currentUserId = GetUserIdOrNull();

        // Get root comments (no parent)
        var query = _context.Comments
            .Where(c => c.TestId == testId && c.ParentCommentId == null && !c.IsDeleted)
            .Include(c => c.User)
            .Include(c => c.CommentLikes)
            .Include(c => c.Replies.Where(r => !r.IsDeleted))
                .ThenInclude(r => r.User)
            .Include(c => c.Replies.Where(r => !r.IsDeleted))
                .ThenInclude(r => r.CommentLikes);

        // Sort
        IOrderedQueryable<Comment> orderedQuery = sortBy switch
        {
            "oldest" => query.OrderBy(c => c.CreatedAt),
            "mostLiked" => query.OrderByDescending(c => c.CommentLikes.Count).ThenByDescending(c => c.CreatedAt),
            _ => query.OrderByDescending(c => c.CreatedAt) // newest
        };

        var total = await _context.Comments
            .CountAsync(c => c.TestId == testId && c.ParentCommentId == null && !c.IsDeleted);

        var comments = await orderedQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var response = new CommentListResponse
        {
            Items = comments.Select(c => MapToCommentResponse(c, currentUserId)).ToList(),
            Total = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };

        return Ok(response);
    }

    /// <summary>
    /// Tạo comment mới
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateComment(int testId, [FromBody] CreateCommentRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Content))
            return BadRequest(new { error = "Nội dung không được để trống" });

        if (request.Content.Length > 2000)
            return BadRequest(new { error = "Nội dung không được vượt quá 2000 ký tự" });

        // Check test exists
        var test = await _context.Tests.FindAsync(testId);
        if (test == null)
            return NotFound(new { error = "Bài test không tồn tại" });

        var userId = GetUserId();

        // Check parent comment if replying
        if (request.ParentCommentId.HasValue)
        {
            var parentComment = await _context.Comments
                .FirstOrDefaultAsync(c => c.Id == request.ParentCommentId && c.TestId == testId && !c.IsDeleted);
            
            if (parentComment == null)
                return NotFound(new { error = "Comment gốc không tồn tại" });

            // Prevent deep nesting - only allow 1 level of replies
            if (parentComment.ParentCommentId.HasValue)
                return BadRequest(new { error = "Không thể trả lời comment cấp 2" });
        }

        var comment = new Comment
        {
            TestId = testId,
            UserId = userId,
            ParentCommentId = request.ParentCommentId,
            Content = request.Content.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        // Load user info for response
        await _context.Entry(comment).Reference(c => c.User).LoadAsync();

        var response = MapToCommentResponse(comment, userId);
        return CreatedAtAction(nameof(GetComments), new { testId }, response);
    }

    /// <summary>
    /// Cập nhật comment
    /// </summary>
    [HttpPut("{commentId}")]
    [Authorize]
    public async Task<IActionResult> UpdateComment(int testId, int commentId, [FromBody] UpdateCommentRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Content))
            return BadRequest(new { error = "Nội dung không được để trống" });

        if (request.Content.Length > 2000)
            return BadRequest(new { error = "Nội dung không được vượt quá 2000 ký tự" });

        var userId = GetUserId();
        var comment = await _context.Comments
            .FirstOrDefaultAsync(c => c.Id == commentId && c.TestId == testId && !c.IsDeleted);

        if (comment == null)
            return NotFound(new { error = "Comment không tồn tại" });

        if (comment.UserId != userId)
            return Forbid();

        comment.Content = request.Content.Trim();
        comment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã cập nhật comment" });
    }

    /// <summary>
    /// Xóa comment (soft delete)
    /// </summary>
    [HttpDelete("{commentId}")]
    [Authorize]
    public async Task<IActionResult> DeleteComment(int testId, int commentId)
    {
        var userId = GetUserId();
        var user = await _context.Users.FindAsync(userId);
        
        var comment = await _context.Comments
            .Include(c => c.Replies)
            .FirstOrDefaultAsync(c => c.Id == commentId && c.TestId == testId && !c.IsDeleted);

        if (comment == null)
            return NotFound(new { error = "Comment không tồn tại" });

        // Only owner or admin can delete
        if (comment.UserId != userId && user?.Role != "admin")
            return Forbid();

        // Soft delete comment and its replies
        comment.IsDeleted = true;
        foreach (var reply in comment.Replies)
        {
            reply.IsDeleted = true;
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã xóa comment" });
    }

    /// <summary>
    /// Like comment
    /// </summary>
    [HttpPost("{commentId}/like")]
    [Authorize]
    public async Task<IActionResult> LikeComment(int testId, int commentId)
    {
        var userId = GetUserId();
        var comment = await _context.Comments
            .FirstOrDefaultAsync(c => c.Id == commentId && c.TestId == testId && !c.IsDeleted);

        if (comment == null)
            return NotFound(new { error = "Comment không tồn tại" });

        var existingLike = await _context.CommentLikes
            .FirstOrDefaultAsync(l => l.CommentId == commentId && l.UserId == userId);

        if (existingLike != null)
            return BadRequest(new { error = "Bạn đã like comment này rồi" });

        var like = new CommentLike
        {
            CommentId = commentId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.CommentLikes.Add(like);
        await _context.SaveChangesAsync();

        var likeCount = await _context.CommentLikes.CountAsync(l => l.CommentId == commentId);
        return Ok(new { message = "Đã like comment", likeCount });
    }

    /// <summary>
    /// Unlike comment
    /// </summary>
    [HttpDelete("{commentId}/like")]
    [Authorize]
    public async Task<IActionResult> UnlikeComment(int testId, int commentId)
    {
        var userId = GetUserId();
        var like = await _context.CommentLikes
            .FirstOrDefaultAsync(l => l.CommentId == commentId && l.UserId == userId);

        if (like == null)
            return NotFound(new { error = "Bạn chưa like comment này" });

        _context.CommentLikes.Remove(like);
        await _context.SaveChangesAsync();

        var likeCount = await _context.CommentLikes.CountAsync(l => l.CommentId == commentId);
        return Ok(new { message = "Đã bỏ like comment", likeCount });
    }

    /// <summary>
    /// Đếm số comment của một bài test
    /// </summary>
    [HttpGet("count")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCommentCount(int testId)
    {
        var count = await _context.Comments
            .CountAsync(c => c.TestId == testId && !c.IsDeleted);

        return Ok(new { count });
    }

    private CommentResponse MapToCommentResponse(Comment comment, int? currentUserId)
    {
        return new CommentResponse
        {
            Id = comment.Id,
            TestId = comment.TestId,
            UserId = comment.UserId,
            UserName = comment.User?.FullName ?? "Anonymous",
            UserAvatar = comment.User?.AvatarUrl,
            ParentCommentId = comment.ParentCommentId,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            UpdatedAt = comment.UpdatedAt,
            LikeCount = comment.CommentLikes?.Count ?? 0,
            IsLikedByCurrentUser = currentUserId.HasValue && 
                (comment.CommentLikes?.Any(l => l.UserId == currentUserId) ?? false),
            Replies = comment.Replies?
                .Where(r => !r.IsDeleted)
                .OrderBy(r => r.CreatedAt)
                .Select(r => MapToCommentResponse(r, currentUserId))
                .ToList() ?? new List<CommentResponse>()
        };
    }
}
