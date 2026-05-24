using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;

namespace ToeicMaster.API.Controllers;

public class AdminUserController : AdminBaseController
{
    public AdminUserController(AppDbContext context) : base(context) { }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] string? search,
        [FromQuery] string? role,
        [FromQuery] bool? isActive,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        if (!await IsAdminAsync()) return Forbid();

        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(u => (u.FullName != null && u.FullName.Contains(search)) || u.Email.Contains(search));
        if (!string.IsNullOrEmpty(role))
            query = query.Where(u => u.Role == role);
        if (isActive.HasValue)
            query = query.Where(u => u.IsActive == isActive.Value);

        var total = await query.CountAsync();

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(u => new
            {
                u.Id, u.Email, u.FullName, u.Role, u.IsActive,
                u.CreatedAt, u.LastLoginAt, u.IsPremium, u.PremiumExpiredAt,
                TotalTests = u.TestAttempts.Count,
            }).ToListAsync();

        return Ok(new { items = users, total, page, pageSize, totalPages = (int)Math.Ceiling(total / (double)pageSize) });
    }

    [HttpGet("users/{userId}")]
    public async Task<IActionResult> GetUserDetail(int userId)
    {
        if (!await IsAdminAsync()) return Forbid();

        var user = await _context.Users.Where(u => u.Id == userId)
            .Select(u => new
            {
                u.Id, u.Email, u.FullName, u.AvatarUrl, u.Role, u.IsActive,
                u.Balance, u.IsPremium, u.PremiumExpiredAt, u.CreatedAt, u.LastLoginAt,
                TotalTests = u.TestAttempts.Count,
                TotalPractice = u.PracticeSessions.Count,
                TotalBookmarks = u.Bookmarks.Count,
                TotalVocabulary = u.UserVocabs.Count,
            }).FirstOrDefaultAsync();

        if (user == null) return NotFound("Không tìm thấy người dùng");
        return Ok(user);
    }

    [HttpPost("users/{userId}/toggle-status")]
    public async Task<IActionResult> ToggleUserStatus(int userId)
    {
        if (!await IsAdminAsync()) return Forbid();

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("Không tìm thấy người dùng");
        if (userId == GetUserId()) return BadRequest("Không thể thay đổi trạng thái của chính mình");

        user.IsActive = !user.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new { userId = user.Id, isActive = user.IsActive, message = user.IsActive ? "Đã kích hoạt tài khoản" : "Đã vô hiệu hóa tài khoản" });
    }

    [HttpPut("users/{userId}/role")]
    public async Task<IActionResult> UpdateUserRole(int userId, [FromBody] UpdateRoleRequest request)
    {
        if (!await IsAdminAsync()) return Forbid();

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("Không tìm thấy người dùng");
        if (userId == GetUserId()) return BadRequest("Không thể thay đổi role của chính mình");

        var validRoles = new[] { "User", "Admin", "Moderator" };
        if (!validRoles.Contains(request.Role)) return BadRequest("Role không hợp lệ");

        user.Role = request.Role;
        await _context.SaveChangesAsync();

        return Ok(new { userId = user.Id, role = user.Role, message = $"Đã cập nhật role thành {request.Role}" });
    }
}

public class UpdateRoleRequest
{
    public string Role { get; set; } = "User";
}
