using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Services;

namespace ToeicMaster.API.Controllers;

/// <summary>
/// Controller quản lý Admin Panel (Dashboard, Users, Tests, Questions)
/// </summary>
[ApiController]
[Route("api/v1/admin")]
[Authorize]
public class AdminManagementController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AiExplanationService _aiService;

    public AdminManagementController(AppDbContext context, AiExplanationService aiService)
    {
        _context = context;
        _aiService = aiService;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private async Task<bool> IsAdminAsync()
    {
        var userId = GetUserId();
        var user = await _context.Users.FindAsync(userId);
        return user?.Role == "Admin";
    }

    // ==========================================
    // DASHBOARD APIs
    // ==========================================

    /// <summary>
    /// Lấy thống kê tổng quan cho Admin Dashboard
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var today = DateTime.UtcNow.Date;
        var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);

        // Total users
        var totalUsers = await _context.Users.CountAsync();
        var activeUsers = await _context.Users.CountAsync(u => u.IsActive);
        var newUsersToday = await _context.Users.CountAsync(u =>
            u.CreatedAt != null && u.CreatedAt.Value.Date == today
        );

        // Total tests
        var totalTests = await _context.Tests.CountAsync();

        // Total questions
        var totalQuestions = await _context.Questions.CountAsync();

        // Total attempts
        var totalAttempts = await _context.TestAttempts.CountAsync();
        var attemptsThisWeek = await _context.TestAttempts.CountAsync(ta =>
            ta.CompletedAt >= sevenDaysAgo
        );

        // Recent activity
        var recentAttempts = await _context
            .TestAttempts.OrderByDescending(ta => ta.CompletedAt)
            .Take(5)
            .Include(ta => ta.User)
            .Include(ta => ta.Test)
            .Select(ta => new
            {
                ta.Id,
                UserName = ta.User.FullName ?? "Unknown",
                TestTitle = ta.Test.Title,
                ta.TotalScore,
                ta.CompletedAt,
            })
            .ToListAsync();

        return Ok(
            new
            {
                totalUsers,
                activeUsers,
                newUsersToday,
                totalTests,
                totalQuestions,
                totalAttempts,
                attemptsThisWeek,
                recentAttempts,
            }
        );
    }

    // ==========================================
    // USER MANAGEMENT APIs
    // ==========================================

    /// <summary>
    /// Lấy danh sách người dùng (có phân trang & tìm kiếm)
    /// </summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] string? search,
        [FromQuery] string? role,
        [FromQuery] bool? isActive,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20
    )
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(u =>
                (u.FullName != null && u.FullName.Contains(search)) || u.Email.Contains(search)
            );
        }

        if (!string.IsNullOrEmpty(role))
        {
            query = query.Where(u => u.Role == role);
        }

        if (isActive.HasValue)
        {
            query = query.Where(u => u.IsActive == isActive.Value);
        }

        var total = await query.CountAsync();

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.FullName,
                u.Role,
                u.IsActive,
                u.CreatedAt,
                u.LastLoginAt,
                u.IsPremium,
                TotalTests = u.TestAttempts.Count,
            })
            .ToListAsync();

        return Ok(
            new
            {
                items = users,
                total,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling(total / (double)pageSize),
            }
        );
    }

    /// <summary>
    /// Lấy chi tiết một user
    /// </summary>
    [HttpGet("users/{userId}")]
    public async Task<IActionResult> GetUserDetail(int userId)
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var user = await _context
            .Users.Where(u => u.Id == userId)
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.FullName,
                u.AvatarUrl,
                u.Role,
                u.IsActive,
                u.Balance,
                u.IsPremium,
                u.PremiumExpiredAt,
                u.CreatedAt,
                u.LastLoginAt,
                TotalTests = u.TestAttempts.Count,
                TotalPractice = u.PracticeSessions.Count,
                TotalBookmarks = u.Bookmarks.Count,
                TotalVocabulary = u.UserVocabularies.Count,
            })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound("Không tìm thấy người dùng");

        return Ok(user);
    }

    /// <summary>
    /// Toggle trạng thái active của user
    /// </summary>
    [HttpPost("users/{userId}/toggle-status")]
    public async Task<IActionResult> ToggleUserStatus(int userId)
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound("Không tìm thấy người dùng");

        // Không cho tự disable chính mình
        if (userId == GetUserId())
            return BadRequest("Không thể thay đổi trạng thái của chính mình");

        user.IsActive = !user.IsActive;
        await _context.SaveChangesAsync();

        return Ok(
            new
            {
                userId = user.Id,
                isActive = user.IsActive,
                message = user.IsActive ? "Đã kích hoạt tài khoản" : "Đã vô hiệu hóa tài khoản",
            }
        );
    }

    /// <summary>
    /// Thay đổi role của user
    /// </summary>
    [HttpPut("users/{userId}/role")]
    public async Task<IActionResult> UpdateUserRole(
        int userId,
        [FromBody] UpdateRoleRequest request
    )
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound("Không tìm thấy người dùng");

        if (userId == GetUserId())
            return BadRequest("Không thể thay đổi role của chính mình");

        var validRoles = new[] { "User", "Admin", "Moderator" };
        if (!validRoles.Contains(request.Role))
            return BadRequest("Role không hợp lệ");

        user.Role = request.Role;
        await _context.SaveChangesAsync();

        return Ok(
            new
            {
                userId = user.Id,
                role = user.Role,
                message = $"Đã cập nhật role thành {request.Role}",
            }
        );
    }

    // ==========================================
    // TEST MANAGEMENT APIs
    // ==========================================

    /// <summary>
    /// Lấy danh sách bài test (có phân trang & filter)
    /// </summary>
    [HttpGet("tests")]
    public async Task<IActionResult> GetTests(
        [FromQuery] string? search,
        [FromQuery] string? type,
        [FromQuery] bool? isActive,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20
    )
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var query = _context.Tests.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(t => t.Title.Contains(search));
        }

        if (!string.IsNullOrEmpty(type))
        {
            query = query.Where(t => t.Type == type);
        }

        if (isActive.HasValue)
        {
            query = query.Where(t => t.IsActive == isActive.Value);
        }

        var total = await query.CountAsync();

        var tests = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new
            {
                t.Id,
                t.Title,
                t.Type,
                t.Duration,
                t.TotalQuestions,
                t.TotalParticipants,
                t.IsActive,
                t.CreatedAt,
                PartsCount = t.Parts.Count,
            })
            .ToListAsync();

        return Ok(
            new
            {
                items = tests,
                total,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling(total / (double)pageSize),
            }
        );
    }

    /// <summary>
    /// Toggle trạng thái active của test
    /// </summary>
    [HttpPost("tests/{testId}/toggle-status")]
    public async Task<IActionResult> ToggleTestStatus(int testId)
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var test = await _context.Tests.FindAsync(testId);
        if (test == null)
            return NotFound("Không tìm thấy bài test");

        test.IsActive = !test.IsActive;
        await _context.SaveChangesAsync();

        return Ok(
            new
            {
                testId = test.Id,
                isActive = test.IsActive,
                message = test.IsActive ?? false ? "Đã kích hoạt bài test" : "Đã ẩn bài test",
            }
        );
    }

    /// <summary>
    /// Xóa bài test (soft delete - set isActive = false)
    /// </summary>
    [HttpDelete("tests/{testId}")]
    public async Task<IActionResult> DeleteTest(int testId)
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var test = await _context.Tests.FindAsync(testId);
        if (test == null)
            return NotFound("Không tìm thấy bài test");

        // Soft delete
        test.IsActive = false;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã xóa bài test thành công", testId = test.Id });
    }

    // ==========================================
    // QUESTION MANAGEMENT APIs
    // ==========================================

    /// <summary>
    /// Lấy danh sách câu hỏi của một test
    /// </summary>
    [HttpGet("tests/{testId}/questions")]
    public async Task<IActionResult> GetTestQuestions(
        int testId,
        [FromQuery] int? partNumber,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50
    )
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var test = await _context.Tests.FindAsync(testId);
        if (test == null)
            return NotFound("Không tìm thấy bài test");

        var query = _context
            .Questions.Include(q => q.Group)
                .ThenInclude(g => g.Part)
            .Where(q => q.Group.Part.TestId == testId);

        if (partNumber.HasValue)
        {
            query = query.Where(q => q.Group.Part.PartNumber == partNumber.Value);
        }

        var total = await query.CountAsync();

        var questions = await query
            .OrderBy(q => q.Group.Part.PartNumber)
            .ThenBy(q => q.QuestionNo)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(q => new
            {
                q.Id,
                TestId = testId,
                PartNumber = q.Group.Part.PartNumber,
                q.QuestionNo,
                Content = q.Content ?? "",
                q.CorrectOption,
                Explanation = q.ShortExplanation ?? q.FullExplanation,
                GroupId = q.GroupId,
                GroupContent = q.Group.TextContent ?? q.Group.AudioUrl,
            })
            .ToListAsync();

        return Ok(
            new
            {
                items = questions,
                total,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling(total / (double)pageSize),
                testTitle = test.Title,
            }
        );
    }

    /// <summary>
    /// Cập nhật một câu hỏi
    /// </summary>
    [HttpPut("questions/{questionId}")]
    public async Task<IActionResult> UpdateQuestion(
        int questionId,
        [FromBody] UpdateQuestionRequest request
    )
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var question = await _context.Questions.FindAsync(questionId);
        if (question == null)
            return NotFound("Không tìm thấy câu hỏi");

        if (!string.IsNullOrEmpty(request.Content))
            question.Content = request.Content;

        if (!string.IsNullOrEmpty(request.CorrectOption))
            question.CorrectOption = request.CorrectOption;

        if (!string.IsNullOrEmpty(request.Explanation))
            question.ShortExplanation = request.Explanation;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã cập nhật câu hỏi thành công", questionId = question.Id });
    }

    // ==========================================
    // STATISTICS APIs
    // ==========================================

    /// <summary>
    /// Thống kê tổng quan hệ thống
    /// </summary>
    [HttpGet("statistics")]
    public async Task<IActionResult> GetSystemStatistics()
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);

        // User growth (30 ngày)
        var userGrowth = await _context
            .Users.Where(u => u.CreatedAt >= thirtyDaysAgo)
            .GroupBy(u => u.CreatedAt!.Value.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync();

        // Test attempts (30 ngày)
        var attemptsTrend = await _context
            .TestAttempts.Where(ta => ta.CompletedAt >= thirtyDaysAgo)
            .GroupBy(ta => ta.CompletedAt.Date)
            .Select(g => new
            {
                Date = g.Key,
                Count = g.Count(),
                AvgScore = g.Average(ta => ta.TotalScore),
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        // Score distribution
        var scoreDistribution = await _context
            .TestAttempts.GroupBy(ta => (int)(ta.TotalScore / 100) * 100)
            .Select(g => new { ScoreRange = $"{g.Key}-{g.Key + 99}", Count = g.Count() })
            .OrderBy(x => x.ScoreRange)
            .ToListAsync();

        return Ok(
            new
            {
                userGrowth,
                attemptsTrend,
                scoreDistribution,
            }
        );
    }

    // ==========================================
    // AI EXPLANATION GENERATION APIs
    // ==========================================

    /// <summary>
    /// Generate AI explanations for all questions in a test that don't have them yet
    /// Only admin can trigger this (expensive operation)
    /// </summary>
    [HttpPost("tests/{testId}/generate-explanations")]
    public async Task<IActionResult> GenerateExplanationsForTest(int testId)
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var test = await _context.Tests.FindAsync(testId);
        if (test == null)
            return NotFound("Không tìm thấy bài test");

        // 1. Fetch all questions in this test that don't have explanations yet
        var questions = await _context
            .Questions.Include(q => q.Group)
                .ThenInclude(g => g.Part)
            .Include(q => q.Answers)
            .Where(q =>
                q.Group.Part.TestId == testId
                && (q.ShortExplanation == null || q.FullExplanation == null)
            )
            .ToListAsync();

        if (!questions.Any())
            return Ok(
                new
                {
                    message = "Tuyệt vời! Tất cả câu hỏi trong đề thi này đã có giải thích rồi.",
                    totalUpdated = 0,
                }
            );

        int successCount = 0;
        int errorCount = 0;

        // 2. Generate explanations for each question
        foreach (var question in questions)
        {
            try
            {
                var (shortExp, fullExp) = await _aiService.GenerateExplanationAsync(
                    question,
                    question.Answers.ToList()
                );

                question.ShortExplanation = shortExp;
                question.FullExplanation = fullExp;
                successCount++;

                await _context.SaveChangesAsync();

                // Clear change tracker to avoid conflicts in next iteration
                _context.ChangeTracker.Clear();

                // Rate limiting: wait 2 seconds between requests to avoid exceeding API limits
                await Task.Delay(2000);
            }
            catch (Exception ex)
            {
                errorCount++;
                // Clear change tracker on error as well
                _context.ChangeTracker.Clear();
                // Log error but continue with next question
                System.Console.WriteLine($"Error generating explanation for question {question.Id}: {ex.Message}");
            }
        }

        return Ok(
            new
            {
                message = $"Đã cập nhật giải thích cho {successCount} câu hỏi ({errorCount} lỗi)",
                testId = testId,
                totalUpdated = successCount,
                totalErrors = errorCount,
                totalQuestions = questions.Count,
            }
        );
    }

    /// <summary>
    /// Generate AI explanations for all questions in a specific part of a test
    /// Only admin can trigger this
    /// </summary>
    [HttpPost("tests/{testId}/parts/{partNumber}/generate-explanations")]
    public async Task<IActionResult> GenerateExplanationsForPart(int testId, int partNumber)
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var test = await _context.Tests.FindAsync(testId);
        if (test == null)
            return NotFound("Không tìm thấy bài test");

        // 1. Fetch all questions in this part that don't have explanations yet
        var questions = await _context
            .Questions.Include(q => q.Group)
                .ThenInclude(g => g.Part)
            .Include(q => q.Answers)
            .Where(q =>
                q.Group.Part.TestId == testId
                && q.Group.Part.PartNumber == partNumber
                && (q.ShortExplanation == null || q.FullExplanation == null)
            )
            .ToListAsync();

        if (!questions.Any())
            return Ok(
                new
                {
                    message = $"Tuyệt vời! Tất cả câu hỏi trong Part {partNumber} của đề thi này đã có giải thích rồi.",
                    testId = testId,
                    partNumber = partNumber,
                    totalUpdated = 0,
                }
            );

        int successCount = 0;
        int errorCount = 0;

        // 2. Generate explanations for each question
        foreach (var question in questions)
        {
            try
            {
                var (shortExp, fullExp) = await _aiService.GenerateExplanationAsync(
                    question,
                    question.Answers.ToList()
                );

                question.ShortExplanation = shortExp;
                question.FullExplanation = fullExp;
                successCount++;

                await _context.SaveChangesAsync();

                // Clear change tracker to avoid conflicts in next iteration
                _context.ChangeTracker.Clear();

                // Rate limiting: wait 2 seconds between requests to avoid exceeding API limits
                await Task.Delay(2000);
            }
            catch (Exception ex)
            {
                errorCount++;
                // Clear change tracker on error as well
                _context.ChangeTracker.Clear();
                // Log error but continue with next question
                System.Console.WriteLine(
                    $"Error generating explanation for question {question.Id}: {ex.Message}"
                );
            }
        }

        return Ok(
            new
            {
                message = $"Đã cập nhật giải thích cho {successCount} câu hỏi ({errorCount} lỗi) trong Part {partNumber}",
                testId = testId,
                partNumber = partNumber,
                totalUpdated = successCount,
                totalErrors = errorCount,
                totalQuestions = questions.Count,
            }
        );
    }

    // ==========================================
    // AI TRANSLATION GENERATION APIs
    // ==========================================

    /// <summary>
    /// Translate transcripts for Part 3/4 in an entire test
    /// Only admin can trigger this
    /// </summary>
    [HttpPost("tests/{testId}/translate-transcripts")]
    public async Task<IActionResult> TranslateTranscriptsForTest(int testId)
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var test = await _context.Tests.FindAsync(testId);
        if (test == null)
            return NotFound("Không tìm thấy bài test");

        // 1. Find all QuestionGroups for Part 3/4 that don't have transcripts translated yet
        var groups = await _context
            .QuestionGroups.Include(qg => qg.Part)
            .Where(qg =>
                qg.Part.TestId == testId
                && (qg.Part.PartNumber == 3 || qg.Part.PartNumber == 4)
                && qg.Transcript != null
                && string.IsNullOrEmpty(qg.TranscriptTranslation)
            )
            .ToListAsync();

        if (!groups.Any())
            return Ok(
                new
                {
                    message = "Tuyệt vời! Tất cả Transcript trong đề này đã được dịch rồi.",
                    testId = testId,
                    totalTranslated = 0,
                }
            );

        int successCount = 0;
        int errorCount = 0;

        // 2. Translate each transcript
        foreach (var group in groups)
        {
            try
            {
                var translation = await _aiService.TranslatePassageAsync(group.Transcript ?? "");

                // Only update if translation actually succeeded (not null/empty)
                if (!string.IsNullOrEmpty(translation))
                {
                    group.TranscriptTranslation = translation;
                    await _context.SaveChangesAsync();
                    successCount++;
                }
                else
                {
                    errorCount++;
                    System.Console.WriteLine($"Empty translation for group {group.Id}");
                }

                // Clear change tracker AFTER successful save
                _context.ChangeTracker.Clear();

                // Rate limiting: wait 2 seconds between requests
                await Task.Delay(2000);
            }
            catch (Exception ex)
            {
                errorCount++;
                // Clear change tracker on error as well
                _context.ChangeTracker.Clear();
                System.Console.WriteLine($"Error translating transcript for group {group.Id}: {ex.Message}");
            }
        }

        return Ok(
            new
            {
                message = $"Đã dịch {successCount} Transcript ({errorCount} lỗi)",
                testId = testId,
                totalTranslated = successCount,
                totalErrors = errorCount,
                totalGroups = groups.Count,
            }
        );
    }

    /// <summary>
    /// Translate passages for Part 6/7 in an entire test
    /// Only admin can trigger this
    /// </summary>
    [HttpPost("tests/{testId}/translate-passages")]
    public async Task<IActionResult> TranslatePassagesForTest(int testId)
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var test = await _context.Tests.FindAsync(testId);
        if (test == null)
            return NotFound("Không tìm thấy bài test");

        // 1. Find all QuestionGroups for Part 6/7 that don't have passages translated yet
        var groups = await _context
            .QuestionGroups.Include(qg => qg.Part)
            .Where(qg =>
                qg.Part.TestId == testId
                && (qg.Part.PartNumber == 6 || qg.Part.PartNumber == 7)
                && qg.TextContent != null
                && string.IsNullOrEmpty(qg.TextContentTranslation)
            )
            .ToListAsync();

        if (!groups.Any())
            return Ok(
                new
                {
                    message = "Tuyệt vời! Tất cả Passage trong đề này đã được dịch rồi.",
                    testId = testId,
                    totalTranslated = 0,
                }
            );

        int successCount = 0;
        int errorCount = 0;

        // 2. Translate each passage
        foreach (var group in groups)
        {
            try
            {
                var translation = await _aiService.TranslatePassageAsync(group.TextContent ?? "");

                // Only update if translation actually succeeded (not null/empty)
                if (!string.IsNullOrEmpty(translation))
                {
                    group.TextContentTranslation = translation;
                    await _context.SaveChangesAsync();
                    successCount++;
                }
                else
                {
                    errorCount++;
                    System.Console.WriteLine($"Empty translation for group {group.Id}");
                }

                // Clear change tracker AFTER successful save
                _context.ChangeTracker.Clear();

                // Rate limiting: wait 2 seconds between requests
                await Task.Delay(2000);
            }
            catch (Exception ex)
            {
                errorCount++;
                // Clear change tracker on error as well
                _context.ChangeTracker.Clear();
                System.Console.WriteLine($"Error translating passage for group {group.Id}: {ex.Message}");
            }
        }

        return Ok(
            new
            {
                message = $"Đã dịch {successCount} Passage ({errorCount} lỗi)",
                testId = testId,
                totalTranslated = successCount,
                totalErrors = errorCount,
                totalGroups = groups.Count,
            }
        );
    }

    /// <summary>
    /// Translate transcripts for a specific part (3 or 4)
    /// Only admin can trigger this
    /// </summary>
    [HttpPost("tests/{testId}/parts/{partNumber}/translate-transcripts")]
    public async Task<IActionResult> TranslateTranscriptsForPart(int testId, int partNumber)
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        if (partNumber != 3 && partNumber != 4)
            return BadRequest("Part Transcript chỉ có ở Part 3 hoặc Part 4");

        var test = await _context.Tests.FindAsync(testId);
        if (test == null)
            return NotFound("Không tìm thấy bài test");

        // 1. Find all QuestionGroups for this part that don't have transcripts translated yet
        var groups = await _context
            .QuestionGroups.Include(qg => qg.Part)
            .Where(qg =>
                qg.Part.TestId == testId
                && qg.Part.PartNumber == partNumber
                && qg.Transcript != null
                && string.IsNullOrEmpty(qg.TranscriptTranslation)
            )
            .ToListAsync();

        if (!groups.Any())
            return Ok(
                new
                {
                    message =
                        $"Tuyệt vời! Tất cả Transcript trong Part {partNumber} của đề này đã được dịch rồi.",
                    testId = testId,
                    partNumber = partNumber,
                    totalTranslated = 0,
                }
            );

        int successCount = 0;
        int errorCount = 0;

        // 2. Translate each transcript
        foreach (var group in groups)
        {
            try
            {
                var translation = await _aiService.TranslatePassageAsync(group.Transcript ?? "");

                // Only update if translation actually succeeded (not null/empty)
                if (!string.IsNullOrEmpty(translation))
                {
                    group.TranscriptTranslation = translation;
                    await _context.SaveChangesAsync();
                    successCount++;
                }
                else
                {
                    errorCount++;
                    System.Console.WriteLine($"Empty translation for group {group.Id}");
                }

                // Clear change tracker AFTER successful save
                _context.ChangeTracker.Clear();

                // Rate limiting: wait 2 seconds between requests
                await Task.Delay(2000);
            }
            catch (Exception ex)
            {
                errorCount++;
                // Clear change tracker on error as well
                _context.ChangeTracker.Clear();
                System.Console.WriteLine($"Error translating transcript for group {group.Id}: {ex.Message}");
            }
        }

        return Ok(
            new
            {
                message = $"Đã dịch {successCount} Transcript ({errorCount} lỗi) trong Part {partNumber}",
                testId = testId,
                partNumber = partNumber,
                totalTranslated = successCount,
                totalErrors = errorCount,
                totalGroups = groups.Count,
            }
        );
    }

    /// <summary>
    /// Translate passages for a specific part (6 or 7)
    /// Only admin can trigger this
    /// </summary>
    [HttpPost("tests/{testId}/parts/{partNumber}/translate-passages")]
    public async Task<IActionResult> TranslatePassagesForPart(int testId, int partNumber)
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        if (partNumber != 6 && partNumber != 7)
            return BadRequest("Part Passage chỉ có ở Part 6 hoặc Part 7");

        var test = await _context.Tests.FindAsync(testId);
        if (test == null)
            return NotFound("Không tìm thấy bài test");

        // 1. Find all QuestionGroups for this part that don't have passages translated yet
        var groups = await _context
            .QuestionGroups.Include(qg => qg.Part)
            .Where(qg =>
                qg.Part.TestId == testId
                && qg.Part.PartNumber == partNumber
                && qg.TextContent != null
                && string.IsNullOrEmpty(qg.TextContentTranslation)
            )
            .ToListAsync();

        if (!groups.Any())
            return Ok(
                new
                {
                    message =
                        $"Tuyệt vời! Tất cả Passage trong Part {partNumber} của đề này đã được dịch rồi.",
                    testId = testId,
                    partNumber = partNumber,
                    totalTranslated = 0,
                }
            );

        int successCount = 0;
        int errorCount = 0;

        // 2. Translate each passage
        foreach (var group in groups)
        {
            try
            {
                var translation = await _aiService.TranslatePassageAsync(group.TextContent ?? "");

                // Only update if translation actually succeeded (not null/empty)
                if (!string.IsNullOrEmpty(translation))
                {
                    group.TextContentTranslation = translation;
                    await _context.SaveChangesAsync();
                    successCount++;
                }
                else
                {
                    errorCount++;
                    System.Console.WriteLine($"Empty translation for group {group.Id}");
                }

                // Clear change tracker AFTER successful save
                _context.ChangeTracker.Clear();

                // Rate limiting: wait 2 seconds between requests
                await Task.Delay(2000);
            }
            catch (Exception ex)
            {
                errorCount++;
                // Clear change tracker on error as well
                _context.ChangeTracker.Clear();
                System.Console.WriteLine($"Error translating passage for group {group.Id}: {ex.Message}");
            }
        }

        return Ok(
            new
            {
                message = $"Đã dịch {successCount} Passage ({errorCount} lỗi) trong Part {partNumber}",
                testId = testId,
                partNumber = partNumber,
                totalTranslated = successCount,
                totalErrors = errorCount,
                totalGroups = groups.Count,
            }
        );
    }
}

// Request DTOs
public class UpdateRoleRequest
{
    public string Role { get; set; } = "User";
}

public class UpdateQuestionRequest
{
    public string? Content { get; set; }
    public string? CorrectOption { get; set; }
    public string? Explanation { get; set; }
}
