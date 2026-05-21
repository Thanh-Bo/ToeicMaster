using System.Security.Claims;
using System.Collections.Concurrent;
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
    private readonly IServiceScopeFactory _serviceScopeFactory;
    
    // Static dictionary to track background task status across requests
    private static readonly ConcurrentDictionary<string, TaskStatus> TaskStatusTracker = new();

    public AdminManagementController(AppDbContext context, AiExplanationService aiService, IServiceScopeFactory serviceScopeFactory)
    {
        _context = context;
        _aiService = aiService;
        _serviceScopeFactory = serviceScopeFactory;
    }
    
    // Task status tracking DTO
    private class TaskStatus
    {
        public string TaskId { get; set; }
        public string Status { get; set; } // "processing" or "completed"
        public int TotalItems { get; set; }
        public int CompletedItems { get; set; }
        public int ErrorItems { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private async Task<bool> IsAdminAsync()
    {
        var userId = GetUserId();
        var user = await _context.Users.FindAsync(userId);
        return user?.Role == "Admin";
    }

    // ==========================================
    // TASK STATUS TRACKING APIs
    // ==========================================

    /// <summary>
    /// Poll background task status
    /// </summary>
    [HttpGet("tasks/{taskId}")]
    public IActionResult GetTaskStatus(string taskId)
    {
        if (TaskStatusTracker.TryGetValue(taskId, out var status))
        {
            return Ok(new
            {
                taskId = status.TaskId,
                status = status.Status,
                totalItems = status.TotalItems,
                completedItems = status.CompletedItems,
                errorItems = status.ErrorItems,
                progress = status.TotalItems > 0 ? (status.CompletedItems * 100 / status.TotalItems) : 0,
                startedAt = status.StartedAt,
                completedAt = status.CompletedAt,
                isComplete = status.Status == "completed"
            });
        }

        // Task not found or expired (cleanup after 5 minutes)
        return NotFound(new { message = "Không tìm thấy task hoặc đã hết hạn" });
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
                u.PremiumExpiredAt,
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
                TotalVocabulary = u.UserVocabs.Count,
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
                t.IsExplanationPremiumRequired,
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
    /// Update whether explanations for a test require Premium.
    /// </summary>
    [HttpPut("tests/{testId}/explanation-access")]
    public async Task<IActionResult> UpdateTestExplanationAccess(
        int testId,
        [FromBody] UpdateExplanationAccessRequest request
    )
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var test = await _context.Tests.FindAsync(testId);
        if (test == null)
            return NotFound("Không tìm thấy bài test");

        test.IsExplanationPremiumRequired = request.IsExplanationPremiumRequired;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            testId = test.Id,
            isExplanationPremiumRequired = test.IsExplanationPremiumRequired,
            message = test.IsExplanationPremiumRequired
                ? "Giải thích của bài test này chỉ dành cho Premium"
                : "Giải thích của bài test này miễn phí cho mọi người"
        });
    }

    /// <summary>
    /// Update whether explanations for a vocabulary topic require Premium.
    /// </summary>
    [HttpPut("vocabulary/topics/{topicId}/explanation-access")]
    public async Task<IActionResult> UpdateVocabularyExplanationAccess(
        int topicId,
        [FromBody] UpdateExplanationAccessRequest request
    )
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var topic = await _context.Topics.FindAsync(topicId);
        if (topic == null)
            return NotFound("Không tìm thấy vocabulary topic");

        topic.IsExplanationPremiumRequired = request.IsExplanationPremiumRequired;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            topicId = topic.Id,
            isExplanationPremiumRequired = topic.IsExplanationPremiumRequired
        });
    }

    /// <summary>
    /// Update whether explanations for a grammar topic require Premium.
    /// </summary>
    [HttpPut("grammar/topics/{topicId}/explanation-access")]
    public async Task<IActionResult> UpdateGrammarExplanationAccess(
        int topicId,
        [FromBody] UpdateExplanationAccessRequest request
    )
    {
        if (!await IsAdminAsync())
            return Forbid("Chỉ Admin mới được truy cập");

        var topic = await _context.GrammarTopics.FindAsync(topicId);
        if (topic == null)
            return NotFound("Không tìm thấy grammar topic");

        topic.IsExplanationPremiumRequired = request.IsExplanationPremiumRequired;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            topicId = topic.Id,
            isExplanationPremiumRequired = topic.IsExplanationPremiumRequired
        });
    }

    /// <summary>
    /// Xóa bài test (soft delete - set isActive = false)
    /// </summary>
    /// <summary>
    /// Update whether practice questions for a grammar rule require Premium.
    /// The lesson/rule content remains free; only questions are gated.
    /// </summary>
    [HttpPut("grammar/rules/{grammarId}/questions-access")]
    public async Task<IActionResult> UpdateGrammarRuleQuestionsAccess(
        int grammarId,
        [FromBody] UpdateGrammarQuestionsAccessRequest request
    )
    {
        if (!await IsAdminAsync())
            return Forbid("Chá»‰ Admin má»›i Ä‘Æ°á»£c truy cáº­p");

        var grammar = await _context.Grammars.FindAsync(grammarId);
        if (grammar == null)
            return NotFound("KhÃ´ng tÃ¬m tháº¥y grammar rule");

        grammar.IsQuestionsPremiumRequired = request.IsQuestionsPremiumRequired;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            grammarId = grammar.Id,
            isQuestionsPremiumRequired = grammar.IsQuestionsPremiumRequired,
            message = grammar.IsQuestionsPremiumRequired
                ? "CÃ¢u há»i cá»§a quy táº¯c nÃ y chá»‰ dÃ nh cho Premium"
                : "CÃ¢u há»i cá»§a quy táº¯c nÃ y miá»…n phÃ­ cho má»i ngÆ°á»i"
        });
    }

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
    /// Processes questions in parallel batches with rate limiting
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
                    taskId = "",
                    totalUpdated = 0,
                }
            );

        // Generate unique task ID
        var taskId = $"explain_test_{testId}_{DateTime.UtcNow.Ticks}";
        var totalQuestions = questions.Count;
        
        // Initialize task status tracking
        TaskStatusTracker.TryAdd(taskId, new TaskStatus
        {
            TaskId = taskId,
            Status = "processing",
            TotalItems = totalQuestions,
            CompletedItems = 0,
            ErrorItems = 0,
            StartedAt = DateTime.UtcNow
        });
        
        // Fire-and-forget background processing
        _ = ProcessExplanationsInParallel(questions, testId, taskId);

        return Accepted(
            new
            {
                message = $"Bắt đầu xử lý {totalQuestions} câu hỏi...",
                taskId = taskId,
                testId = testId,
                totalQuestions = totalQuestions,
                status = "processing"
            }
        );
    }

    private async Task ProcessExplanationsInParallel(List<Question> questions, int testId, string taskId)
    {
        int successCount = 0;
        int errorCount = 0;
        const int batchSize = 5; // Process 5 questions in parallel
        const int delayBetweenBatches = 1000; // 1 second between batches

        try
        {
            // Process in batches
            for (int i = 0; i < questions.Count; i += batchSize)
            {
                var batch = questions.Skip(i).Take(batchSize).ToList();
                
                // Create tasks for all questions in this batch
                var tasks = batch.Select(async question =>
                {
                    // Create a separate scope and context for this task
                    using (var scope = _serviceScopeFactory.CreateScope())
                    {
                        var contextForTask = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        try
                        {
                            var (shortExp, fullExp) = await _aiService.GenerateExplanationAsync(
                                question,
                                question.Answers.ToList()
                            );

                            // ✅ FIX: Re-attach entity to new context before updating
                            var trackedQuestion = await contextForTask.Questions.FindAsync(question.Id);
                            if (trackedQuestion != null)
                            {
                                trackedQuestion.ShortExplanation = shortExp;
                                trackedQuestion.FullExplanation = fullExp;
                                
                                // Save with task-specific context
                                await contextForTask.SaveChangesAsync();
                                contextForTask.ChangeTracker.Clear();
                                
                                // Update task status
                                if (TaskStatusTracker.TryGetValue(taskId, out var status))
                                {
                                    status.CompletedItems++;
                                }
                                
                                return true;
                            }
                            return false;
                        }
                        catch (Exception ex)
                        {
                            System.Console.WriteLine($"Error generating explanation for question {question.Id}: {ex.Message}");
                            contextForTask.ChangeTracker.Clear();
                            
                            // Update error count
                            if (TaskStatusTracker.TryGetValue(taskId, out var status))
                            {
                                status.ErrorItems++;
                            }
                            return false;
                        }
                    }
                }).ToList();

                // Wait for all tasks in this batch to complete
                var results = await Task.WhenAll(tasks);
                successCount += results.Count(r => r);
                errorCount += results.Count(r => !r);

                // Delay between batches to respect API rate limits
                if (i + batchSize < questions.Count)
                {
                    await Task.Delay(delayBetweenBatches);
                }
            }
        }
        catch (Exception ex)
        {
            System.Console.WriteLine($"Error in parallel processing: {ex.Message}");
        }

        // Mark task as completed
        if (TaskStatusTracker.TryGetValue(taskId, out var taskStatus))
        {
            taskStatus.Status = "completed";
            taskStatus.CompletedAt = DateTime.UtcNow;
        }

        System.Console.WriteLine($"Background task completed for test {testId}: {successCount} success, {errorCount} errors");
    }

    private async Task ProcessExplanationsInParallel(List<Question> questions, int testId, int partNumber, string taskId)
    {
        int successCount = 0;
        int errorCount = 0;
        const int batchSize = 5; // Process 5 questions in parallel
        const int delayBetweenBatches = 1000; // 1 second between batches

        try
        {
            // Process in batches
            for (int i = 0; i < questions.Count; i += batchSize)
            {
                var batch = questions.Skip(i).Take(batchSize).ToList();
                
                // Create tasks for all questions in this batch
                var tasks = batch.Select(async question =>
                {
                    // Create a separate scope and context for this task
                    using (var scope = _serviceScopeFactory.CreateScope())
                    {
                        var contextForTask = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        try
                        {
                            var (shortExp, fullExp) = await _aiService.GenerateExplanationAsync(
                                question,
                                question.Answers.ToList()
                            );

                            // ✅ FIX: Re-attach entity to new context before updating
                            var trackedQuestion = await contextForTask.Questions.FindAsync(question.Id);
                            if (trackedQuestion != null)
                            {
                                trackedQuestion.ShortExplanation = shortExp;
                                trackedQuestion.FullExplanation = fullExp;
                                
                                // Save with task-specific context
                                await contextForTask.SaveChangesAsync();
                                contextForTask.ChangeTracker.Clear();
                                
                                // Update task status
                                if (TaskStatusTracker.TryGetValue(taskId, out var status))
                                {
                                    status.CompletedItems++;
                                }
                                
                                return true;
                            }
                            return false;
                        }
                        catch (Exception ex)
                        {
                            System.Console.WriteLine($"Error generating explanation for question {question.Id}: {ex.Message}");
                            contextForTask.ChangeTracker.Clear();
                            
                            // Update error count
                            if (TaskStatusTracker.TryGetValue(taskId, out var status))
                            {
                                status.ErrorItems++;
                            }
                            return false;
                        }
                    }
                }).ToList();

                // Wait for all tasks in this batch to complete
                var results = await Task.WhenAll(tasks);
                successCount += results.Count(r => r);
                errorCount += results.Count(r => !r);

                // Delay between batches to respect API rate limits
                if (i + batchSize < questions.Count)
                {
                    await Task.Delay(delayBetweenBatches);
                }
            }
        }
        catch (Exception ex)
        {
            System.Console.WriteLine($"Error in parallel processing: {ex.Message}");
        }

        // Mark task as completed
        if (TaskStatusTracker.TryGetValue(taskId, out var taskStatus))
        {
            taskStatus.Status = "completed";
            taskStatus.CompletedAt = DateTime.UtcNow;
        }

        System.Console.WriteLine($"Background task completed for test {testId}, part {partNumber}: {successCount} success, {errorCount} errors");
    }

    /// <summary>
    /// Generate AI explanations for all questions in a specific part of a test
    /// Only admin can trigger this
    /// Processes questions in parallel batches
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
                    taskId = "",
                    testId = testId,
                    partNumber = partNumber,
                    totalUpdated = 0,
                }
            );

        // Generate unique task ID
        var taskId = $"explain_test_{testId}_part_{partNumber}_{DateTime.UtcNow.Ticks}";
        var totalQuestions = questions.Count;
        
        // Initialize task status tracking
        TaskStatusTracker.TryAdd(taskId, new TaskStatus
        {
            TaskId = taskId,
            Status = "processing",
            TotalItems = totalQuestions,
            CompletedItems = 0,
            ErrorItems = 0,
            StartedAt = DateTime.UtcNow
        });
        
        // Return immediately to frontend - start background processing
        _ = ProcessExplanationsInParallel(questions, testId, partNumber, taskId);

        return Accepted(
            new
            {
                message = $"Bắt đầu xử lý {totalQuestions} câu hỏi trong Part {partNumber}...",
                taskId = taskId,
                testId = testId,
                partNumber = partNumber,
                totalQuestions = totalQuestions,
                status = "processing"
            }
        );
    }

    // ==========================================
    // AI TRANSLATION GENERATION APIs
    // ==========================================

    /// <summary>
    /// Translate transcripts for Part 3/4 in an entire test
    /// Only admin can trigger this
    /// Processes groups in parallel batches
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
                    taskId = "",
                    testId = testId,
                    totalTranslated = 0,
                }
            );

        // Generate unique task ID
        var taskId = $"translate_transcript_test_{testId}_{DateTime.UtcNow.Ticks}";
        var totalGroups = groups.Count;
        
        // Initialize task status tracking
        TaskStatusTracker.TryAdd(taskId, new TaskStatus
        {
            TaskId = taskId,
            Status = "processing",
            TotalItems = totalGroups,
            CompletedItems = 0,
            ErrorItems = 0,
            StartedAt = DateTime.UtcNow
        });
        
        // Return immediately to frontend - start background processing
        _ = ProcessTranscriptTranslationsInParallel(groups, testId, taskId);

        return Accepted(
            new
            {
                message = $"Bắt đầu dịch {totalGroups} Transcript...",
                taskId = taskId,
                testId = testId,
                totalGroups = totalGroups,
                status = "processing"
            }
        );
    }

    private async Task ProcessTranscriptTranslationsInParallel(List<QuestionGroup> groups, int testId, string taskId)
    {
        int successCount = 0;
        int errorCount = 0;
        const int batchSize = 3; // Process 3 groups in parallel (translations may be slower)
        const int delayBetweenBatches = 1000; // 1 second between batches

        try
        {
            // Process in batches
            for (int i = 0; i < groups.Count; i += batchSize)
            {
                var batch = groups.Skip(i).Take(batchSize).ToList();
                
                // Create tasks for all groups in this batch
                var tasks = batch.Select(async group =>
                {
                    // Create a separate scope and context for this task
                    using (var scope = _serviceScopeFactory.CreateScope())
                    {
                        var contextForTask = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        try
                        {
                            var translation = await _aiService.TranslatePassageAsync(group.Transcript ?? "");

                            if (!string.IsNullOrEmpty(translation))
                            {
                                // ✅ FIX: Re-attach entity to new context before updating
                                var trackedGroup = await contextForTask.QuestionGroups.FindAsync(group.Id);
                                if (trackedGroup != null)
                                {
                                    trackedGroup.TranscriptTranslation = translation;
                                    await contextForTask.SaveChangesAsync();
                                    contextForTask.ChangeTracker.Clear();
                                    
                                    // Update task status
                                    if (TaskStatusTracker.TryGetValue(taskId, out var status))
                                    {
                                        status.CompletedItems++;
                                    }
                                    return true;
                                }
                                return false;
                            }
                            else
                            {
                                System.Console.WriteLine($"Empty translation for group {group.Id}");
                                if (TaskStatusTracker.TryGetValue(taskId, out var status))
                                {
                                    status.ErrorItems++;
                                }
                                return false;
                            }
                        }
                        catch (Exception ex)
                        {
                            System.Console.WriteLine($"Error translating transcript for group {group.Id}: {ex.Message}");
                            contextForTask.ChangeTracker.Clear();
                            
                            if (TaskStatusTracker.TryGetValue(taskId, out var status))
                            {
                                status.ErrorItems++;
                            }
                            return false;
                        }
                    }
                }).ToList();

                // Wait for all tasks in this batch to complete
                var results = await Task.WhenAll(tasks);
                successCount += results.Count(r => r);
                errorCount += results.Count(r => !r);

                // Delay between batches to respect API rate limits
                if (i + batchSize < groups.Count)
                {
                    await Task.Delay(delayBetweenBatches);
                }
            }
        }
        catch (Exception ex)
        {
            System.Console.WriteLine($"Error in parallel transcript processing: {ex.Message}");
        }

        // Mark task as completed
        if (TaskStatusTracker.TryGetValue(taskId, out var taskStatus))
        {
            taskStatus.Status = "completed";
            taskStatus.CompletedAt = DateTime.UtcNow;
        }

        System.Console.WriteLine($"Background task completed for test {testId}: {successCount} transcripts translated, {errorCount} errors");
    }

    private async Task ProcessTranscriptTranslationsInParallel(List<QuestionGroup> groups, int testId, int partNumber, string taskId)
    {
        int successCount = 0;
        int errorCount = 0;
        const int batchSize = 3; // Process 3 groups in parallel
        const int delayBetweenBatches = 1000; // 1 second between batches

        try
        {
            // Process in batches
            for (int i = 0; i < groups.Count; i += batchSize)
            {
                var batch = groups.Skip(i).Take(batchSize).ToList();
                
                // Create tasks for all groups in this batch
                var tasks = batch.Select(async group =>
                {
                    // Create a separate scope and context for this task
                    using (var scope = _serviceScopeFactory.CreateScope())
                    {
                        var contextForTask = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        try
                        {
                            var translation = await _aiService.TranslatePassageAsync(group.Transcript ?? "");

                            if (!string.IsNullOrEmpty(translation))
                            {
                                // ✅ FIX: Re-attach entity to new context before updating
                                var trackedGroup = await contextForTask.QuestionGroups.FindAsync(group.Id);
                                if (trackedGroup != null)
                                {
                                    trackedGroup.TranscriptTranslation = translation;
                                    await contextForTask.SaveChangesAsync();
                                    contextForTask.ChangeTracker.Clear();
                                    
                                    // Update task status
                                    if (TaskStatusTracker.TryGetValue(taskId, out var status))
                                    {
                                        status.CompletedItems++;
                                    }
                                    return true;
                                }
                                return false;
                            }
                            else
                            {
                                System.Console.WriteLine($"Empty translation for group {group.Id}");
                                if (TaskStatusTracker.TryGetValue(taskId, out var status))
                                {
                                    status.ErrorItems++;
                                }
                                return false;
                            }
                        }
                        catch (Exception ex)
                        {
                            System.Console.WriteLine($"Error translating transcript for group {group.Id}: {ex.Message}");
                            contextForTask.ChangeTracker.Clear();
                            
                            if (TaskStatusTracker.TryGetValue(taskId, out var status))
                            {
                                status.ErrorItems++;
                            }
                            return false;
                        }
                    }
                }).ToList();

                // Wait for all tasks in this batch to complete
                var results = await Task.WhenAll(tasks);
                successCount += results.Count(r => r);
                errorCount += results.Count(r => !r);

                // Delay between batches to respect API rate limits
                if (i + batchSize < groups.Count)
                {
                    await Task.Delay(delayBetweenBatches);
                }
            }
        }
        catch (Exception ex)
        {
            System.Console.WriteLine($"Error in parallel transcript processing: {ex.Message}");
        }

        // Mark task as completed
        if (TaskStatusTracker.TryGetValue(taskId, out var taskStatus))
        {
            taskStatus.Status = "completed";
            taskStatus.CompletedAt = DateTime.UtcNow;
        }

        System.Console.WriteLine($"Background task completed for test {testId}, part {partNumber}: {successCount} transcripts translated, {errorCount} errors");
    }

    /// <summary>
    /// Translate passages for Part 6/7 in an entire test
    /// Only admin can trigger this
    /// Processes groups in parallel batches
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
                    taskId = "",
                    testId = testId,
                    totalTranslated = 0,
                }
            );

        // Generate unique task ID
        var taskId = $"translate_passage_test_{testId}_{DateTime.UtcNow.Ticks}";
        var totalGroups = groups.Count;
        
        // Initialize task status tracking
        TaskStatusTracker.TryAdd(taskId, new TaskStatus
        {
            TaskId = taskId,
            Status = "processing",
            TotalItems = totalGroups,
            CompletedItems = 0,
            ErrorItems = 0,
            StartedAt = DateTime.UtcNow
        });
        
        // Return immediately to frontend - start background processing
        _ = ProcessPassageTranslationsInParallel(groups, testId, taskId);

        return Accepted(
            new
            {
                message = $"Bắt đầu dịch {totalGroups} Passage...",
                taskId = taskId,
                testId = testId,
                totalGroups = totalGroups,
                status = "processing"
            }
        );
    }

    private async Task ProcessPassageTranslationsInParallel(List<QuestionGroup> groups, int testId, string taskId)
    {
        int successCount = 0;
        int errorCount = 0;
        const int batchSize = 3; // Process 3 groups in parallel
        const int delayBetweenBatches = 1000; // 1 second between batches

        try
        {
            // Process in batches
            for (int i = 0; i < groups.Count; i += batchSize)
            {
                var batch = groups.Skip(i).Take(batchSize).ToList();
                
                // Create tasks for all groups in this batch
                var tasks = batch.Select(async group =>
                {
                    // Create a separate scope and context for this task
                    using (var scope = _serviceScopeFactory.CreateScope())
                    {
                        var contextForTask = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        try
                        {
                            var translation = await _aiService.TranslatePassageAsync(group.TextContent ?? "");

                            if (!string.IsNullOrEmpty(translation))
                            {
                                // ✅ FIX: Re-attach entity to new context before updating
                                var trackedGroup = await contextForTask.QuestionGroups.FindAsync(group.Id);
                                if (trackedGroup != null)
                                {
                                    trackedGroup.TextContentTranslation = translation;
                                    await contextForTask.SaveChangesAsync();
                                    contextForTask.ChangeTracker.Clear();
                                    
                                    // Update task status
                                    if (TaskStatusTracker.TryGetValue(taskId, out var status))
                                    {
                                        status.CompletedItems++;
                                    }
                                    return true;
                                }
                                return false;
                            }
                            else
                            {
                                System.Console.WriteLine($"Empty translation for group {group.Id}");
                                if (TaskStatusTracker.TryGetValue(taskId, out var status))
                                {
                                    status.ErrorItems++;
                                }
                                return false;
                            }
                        }
                        catch (Exception ex)
                        {
                            System.Console.WriteLine($"Error translating passage for group {group.Id}: {ex.Message}");
                            contextForTask.ChangeTracker.Clear();
                            
                            if (TaskStatusTracker.TryGetValue(taskId, out var status))
                            {
                                status.ErrorItems++;
                            }
                            return false;
                        }
                    }
                }).ToList();

                // Wait for all tasks in this batch to complete
                var results = await Task.WhenAll(tasks);
                successCount += results.Count(r => r);
                errorCount += results.Count(r => !r);

                // Delay between batches to respect API rate limits
                if (i + batchSize < groups.Count)
                {
                    await Task.Delay(delayBetweenBatches);
                }
            }
        }
        catch (Exception ex)
        {
            System.Console.WriteLine($"Error in parallel passage processing: {ex.Message}");
        }

        // Mark task as completed
        if (TaskStatusTracker.TryGetValue(taskId, out var taskStatus))
        {
            taskStatus.Status = "completed";
            taskStatus.CompletedAt = DateTime.UtcNow;
        }

        System.Console.WriteLine($"Background task completed for test {testId}: {successCount} passages translated, {errorCount} errors");
    }


    /// <summary>
    /// Translate transcripts for a specific part (3 or 4)
    /// Only admin can trigger this
    /// Processes groups in parallel batches
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
                    taskId = "",
                    testId = testId,
                    partNumber = partNumber,
                    totalTranslated = 0,
                }
            );

        // Generate unique task ID
        var taskId = $"translate_transcript_test_{testId}_part_{partNumber}_{DateTime.UtcNow.Ticks}";
        var totalGroups = groups.Count;
        
        // Initialize task status tracking
        TaskStatusTracker.TryAdd(taskId, new TaskStatus
        {
            TaskId = taskId,
            Status = "processing",
            TotalItems = totalGroups,
            CompletedItems = 0,
            ErrorItems = 0,
            StartedAt = DateTime.UtcNow
        });
        
        // Return immediately to frontend - start background processing
        _ = ProcessTranscriptTranslationsInParallel(groups, testId, partNumber, taskId);

        return Accepted(
            new
            {
                message = $"Bắt đầu dịch {totalGroups} Transcript trong Part {partNumber}...",
                taskId = taskId,
                testId = testId,
                partNumber = partNumber,
                totalGroups = totalGroups,
                status = "processing"
            }
        );
    }

    /// <summary>
    /// Translate passages for a specific part (6 or 7)
    /// Only admin can trigger this
    /// Processes groups in parallel batches
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
                    taskId = "",
                    testId = testId,
                    partNumber = partNumber,
                    totalTranslated = 0,
                }
            );

        // Generate unique task ID
        var taskId = $"translate_passage_test_{testId}_part_{partNumber}_{DateTime.UtcNow.Ticks}";
        var totalGroups = groups.Count;
        
        // Initialize task status tracking
        TaskStatusTracker.TryAdd(taskId, new TaskStatus
        {
            TaskId = taskId,
            Status = "processing",
            TotalItems = totalGroups,
            CompletedItems = 0,
            ErrorItems = 0,
            StartedAt = DateTime.UtcNow
        });
        
        // Return immediately to frontend - start background processing
        _ = ProcessPassageTranslationsInParallel(groups, testId, partNumber, taskId);

        return Accepted(
            new
            {
                message = $"Bắt đầu dịch {totalGroups} Passage trong Part {partNumber}...",
                taskId = taskId,
                testId = testId,
                partNumber = partNumber,
                totalGroups = totalGroups,
                status = "processing"
            }
        );
    }

    private async Task ProcessPassageTranslationsInParallel(List<QuestionGroup> groups, int testId, int partNumber, string taskId)
    {
        int successCount = 0;
        int errorCount = 0;
        const int batchSize = 3; // Process 3 groups in parallel
        const int delayBetweenBatches = 1000; // 1 second between batches

        try
        {
            // Process in batches
            for (int i = 0; i < groups.Count; i += batchSize)
            {
                var batch = groups.Skip(i).Take(batchSize).ToList();
                
                // Create tasks for all groups in this batch
                var tasks = batch.Select(async group =>
                {
                    // Create a separate scope and context for this task
                    using (var scope = _serviceScopeFactory.CreateScope())
                    {
                        var contextForTask = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        try
                        {
                            var translation = await _aiService.TranslatePassageAsync(group.TextContent ?? "");

                            if (!string.IsNullOrEmpty(translation))
                            {
                                // ✅ FIX: Re-attach entity to new context before updating
                                var trackedGroup = await contextForTask.QuestionGroups.FindAsync(group.Id);
                                if (trackedGroup != null)
                                {
                                    trackedGroup.TextContentTranslation = translation;
                                    await contextForTask.SaveChangesAsync();
                                    contextForTask.ChangeTracker.Clear();
                                    
                                    // Update task status
                                    if (TaskStatusTracker.TryGetValue(taskId, out var status))
                                    {
                                        status.CompletedItems++;
                                    }
                                    return true;
                                }
                                return false;
                            }
                            else
                            {
                                System.Console.WriteLine($"Empty translation for group {group.Id}");
                                if (TaskStatusTracker.TryGetValue(taskId, out var status))
                                {
                                    status.ErrorItems++;
                                }
                                return false;
                            }
                        }
                        catch (Exception ex)
                        {
                            System.Console.WriteLine($"Error translating passage for group {group.Id}: {ex.Message}");
                            contextForTask.ChangeTracker.Clear();
                            
                            if (TaskStatusTracker.TryGetValue(taskId, out var status))
                            {
                                status.ErrorItems++;
                            }
                            return false;
                        }
                    }
                }).ToList();

                // Wait for all tasks in this batch to complete
                var results = await Task.WhenAll(tasks);
                successCount += results.Count(r => r);
                errorCount += results.Count(r => !r);

                // Delay between batches to respect API rate limits
                if (i + batchSize < groups.Count)
                {
                    await Task.Delay(delayBetweenBatches);
                }
            }
        }
        catch (Exception ex)
        {
            System.Console.WriteLine($"Error in parallel passage processing: {ex.Message}");
        }

        // Mark task as completed
        if (TaskStatusTracker.TryGetValue(taskId, out var taskStatus))
        {
            taskStatus.Status = "completed";
            taskStatus.CompletedAt = DateTime.UtcNow;
        }

        System.Console.WriteLine($"Background task completed for test {testId}, part {partNumber}: {successCount} passages translated, {errorCount} errors");
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

public class UpdateExplanationAccessRequest
{
    public bool IsExplanationPremiumRequired { get; set; }
}

public class UpdateGrammarQuestionsAccessRequest
{
    public bool IsQuestionsPremiumRequired { get; set; }
}
