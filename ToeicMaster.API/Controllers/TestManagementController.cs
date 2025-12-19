using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models.Admin;

namespace ToeicMaster.API.Controllers
{
    /// <summary>
    /// Controller quản lý Test và Part (CRUD operations)
    /// Tách riêng khỏi ImportController để dễ bảo trì
    /// </summary>
    [Route("api/v1/[controller]")]
    [ApiController]
    public class TestManagementController : ControllerBase
    {
        private readonly AppDbContext _efContext;
        private readonly IMemoryCache _cache;

        public TestManagementController(AppDbContext efContext, IMemoryCache cache)
        {
            _efContext = efContext;
            _cache = cache;
        }

        // Helper method để xóa cache khi có thay đổi dữ liệu
        private void InvalidateTestCache(int testId)
        {
            string cacheKey = $"test_full_{testId}";
            _cache.Remove(cacheKey);
        }

        // =============================================
        // CACHE MANAGEMENT
        // =============================================

        /// <summary>
        /// Xóa cache thủ công cho 1 Test
        /// </summary>
        [HttpDelete("clear-cache/{testId}")]
        public IActionResult ClearTestCache(int testId)
        {
            InvalidateTestCache(testId);
            return Ok(new { message = $"Đã xóa cache cho Test ID: {testId}" });
        }

        // =============================================
        // TEST CRUD
        // =============================================

        /// <summary>
        /// Lấy danh sách tất cả Test (cho Admin UI)
        /// </summary>
        [HttpGet("tests")]
        public async Task<IActionResult> GetAllTests()
        {
            var tests = await _efContext.Tests
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Slug,
                    t.Type,
                    t.Duration,
                    t.TotalQuestions,
                    t.TotalParticipants,
                    t.IsActive,
                    t.CreatedAt,
                    PartsCount = t.Parts.Count,
                    Parts = t.Parts.Select(p => new { p.Id, p.Name, p.PartNumber }).OrderBy(p => p.PartNumber)
                })
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(tests);
        }

        /// <summary>
        /// Lấy chi tiết 1 Test
        /// </summary>
        [HttpGet("tests/{testId}")]
        public async Task<IActionResult> GetTestById(int testId)
        {
            var test = await _efContext.Tests
                .Include(t => t.Parts)
                .Where(t => t.Id == testId)
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Slug,
                    t.Type,
                    t.Duration,
                    t.TotalQuestions,
                    t.TotalParticipants,
                    t.IsActive,
                    t.CreatedAt,
                    Parts = t.Parts.Select(p => new 
                    { 
                        p.Id, 
                        p.Name, 
                        p.PartNumber,
                        QuestionsCount = p.QuestionGroups.SelectMany(g => g.Questions).Count()
                    }).OrderBy(p => p.PartNumber)
                })
                .FirstOrDefaultAsync();

            if (test == null)
                return NotFound(new { error = $"Không tìm thấy Test ID {testId}" });

            return Ok(test);
        }

        /// <summary>
        /// Tạo Test mới
        /// </summary>
        [HttpPost("tests")]
        public async Task<IActionResult> CreateTest([FromBody] CreateTestRequest request)
        {
            if (string.IsNullOrEmpty(request.Title))
                return BadRequest(new { error = "Tiêu đề đề thi không được để trống" });

            var test = new Test
            {
                Title = request.Title,
                Slug = request.Slug ?? request.Title.ToLower().Replace(" ", "-"),
                Type = request.Type ?? "FULL_TEST",
                Duration = request.Duration ?? 120,
                TotalQuestions = request.TotalQuestions ?? 200,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _efContext.Tests.Add(test);
            await _efContext.SaveChangesAsync();

            return Ok(new { message = "Tạo đề thi thành công!", testId = test.Id, data = test });
        }

        /// <summary>
        /// Cập nhật thông tin Test
        /// </summary>
        [HttpPut("tests/{testId}")]
        public async Task<IActionResult> UpdateTest(int testId, [FromBody] UpdateTestRequest request)
        {
            var test = await _efContext.Tests.FindAsync(testId);
            if (test == null)
                return NotFound(new { error = $"Không tìm thấy Test ID {testId}" });

            if (!string.IsNullOrEmpty(request.Title))
                test.Title = request.Title;
            if (!string.IsNullOrEmpty(request.Slug))
                test.Slug = request.Slug;
            if (!string.IsNullOrEmpty(request.Type))
                test.Type = request.Type;
            if (request.Duration.HasValue)
                test.Duration = request.Duration.Value;
            if (request.TotalQuestions.HasValue)
                test.TotalQuestions = request.TotalQuestions.Value;
            if (request.IsActive.HasValue)
                test.IsActive = request.IsActive.Value;

            await _efContext.SaveChangesAsync();
            InvalidateTestCache(testId);

            return Ok(new { message = "Cập nhật đề thi thành công!", data = test });
        }

        /// <summary>
        /// Xóa Test và toàn bộ dữ liệu liên quan
        /// </summary>
        [HttpDelete("tests/{testId}")]
        public async Task<IActionResult> DeleteTest(int testId)
        {
            try
            {
                var test = await _efContext.Tests.FindAsync(testId);
                if (test == null)
                    return NotFound(new { error = $"Không tìm thấy Test ID {testId}" });

                // Lấy danh sách Part của Test
                var partIds = await _efContext.Parts
                    .Where(p => p.TestId == testId)
                    .Select(p => p.Id)
                    .ToListAsync();

                // Lấy danh sách QuestionGroup
                var groupIds = await _efContext.QuestionGroups
                    .Where(qg => partIds.Contains(qg.PartId))
                    .Select(qg => qg.Id)
                    .ToListAsync();

                // Lấy danh sách Question
                var questionIds = await _efContext.Questions
                    .Where(q => groupIds.Contains(q.GroupId))
                    .Select(q => q.Id)
                    .ToListAsync();

                // Xóa theo thứ tự từ con đến cha

                // Xóa TestAttempts và dữ liệu liên quan
                var attemptIds = await _efContext.TestAttempts
                    .Where(ta => ta.TestId == testId)
                    .Select(ta => ta.Id)
                    .ToListAsync();

                // Xóa ReviewFeedbacks
                var userAnswerIds = await _efContext.UserAnswers
                    .Where(ua => attemptIds.Contains(ua.AttemptId))
                    .Select(ua => ua.Id)
                    .ToListAsync();

                var reviewFeedbacks = await _efContext.ReviewFeedbacks
                    .Where(rf => userAnswerIds.Contains(rf.UserAnswerId))
                    .ToListAsync();
                _efContext.ReviewFeedbacks.RemoveRange(reviewFeedbacks);

                // Xóa UserAnswers
                var userAnswers = await _efContext.UserAnswers
                    .Where(ua => attemptIds.Contains(ua.AttemptId))
                    .ToListAsync();
                _efContext.UserAnswers.RemoveRange(userAnswers);

                // Xóa TestAttempts
                var testAttempts = await _efContext.TestAttempts
                    .Where(ta => ta.TestId == testId)
                    .ToListAsync();
                _efContext.TestAttempts.RemoveRange(testAttempts);

                // Xóa Answers
                var answers = await _efContext.Answers
                    .Where(a => questionIds.Contains(a.QuestionId))
                    .ToListAsync();
                _efContext.Answers.RemoveRange(answers);

                // Xóa Questions
                var questions = await _efContext.Questions
                    .Where(q => groupIds.Contains(q.GroupId))
                    .ToListAsync();
                _efContext.Questions.RemoveRange(questions);

                // Xóa QuestionGroups
                var groups = await _efContext.QuestionGroups
                    .Where(qg => partIds.Contains(qg.PartId))
                    .ToListAsync();
                _efContext.QuestionGroups.RemoveRange(groups);

                // Xóa Parts
                var parts = await _efContext.Parts
                    .Where(p => p.TestId == testId)
                    .ToListAsync();
                _efContext.Parts.RemoveRange(parts);

                // Xóa Test
                _efContext.Tests.Remove(test);

                await _efContext.SaveChangesAsync();
                InvalidateTestCache(testId);

                return Ok(new { message = $"Đã xóa thành công Test ID {testId} và toàn bộ dữ liệu liên quan" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, detail = ex.InnerException?.Message });
            }
        }

        // =============================================
        // PART CRUD
        // =============================================

        /// <summary>
        /// Lấy danh sách Parts của 1 Test
        /// </summary>
        [HttpGet("tests/{testId}/parts")]
        public async Task<IActionResult> GetPartsByTest(int testId)
        {
            var test = await _efContext.Tests.FindAsync(testId);
            if (test == null)
                return NotFound(new { error = $"Không tìm thấy Test ID {testId}" });

            var parts = await _efContext.Parts
                .Where(p => p.TestId == testId)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.PartNumber,
                    GroupsCount = p.QuestionGroups.Count,
                    QuestionsCount = p.QuestionGroups.SelectMany(g => g.Questions).Count()
                })
                .OrderBy(p => p.PartNumber)
                .ToListAsync();

            return Ok(parts);
        }

        /// <summary>
        /// Xóa 1 Part cụ thể của 1 Test
        /// </summary>
        [HttpDelete("tests/{testId}/parts/{partNumber}")]
        public async Task<IActionResult> DeletePart(int testId, int partNumber)
        {
            try
            {
                var part = await _efContext.Parts
                    .FirstOrDefaultAsync(p => p.TestId == testId && p.PartNumber == partNumber);

                if (part == null)
                    return NotFound(new { error = $"Không tìm thấy Part {partNumber} của Test ID {testId}" });

                // Lấy danh sách QuestionGroup của Part này
                var groupIds = await _efContext.QuestionGroups
                    .Where(qg => qg.PartId == part.Id)
                    .Select(qg => qg.Id)
                    .ToListAsync();

                // Lấy danh sách Question của các Group
                var questionIds = await _efContext.Questions
                    .Where(q => groupIds.Contains(q.GroupId))
                    .Select(q => q.Id)
                    .ToListAsync();

                // Xóa theo thứ tự từ con đến cha

                // Xóa ReviewFeedbacks (nếu có)
                var userAnswerIds = await _efContext.UserAnswers
                    .Where(ua => questionIds.Contains(ua.QuestionId))
                    .Select(ua => ua.Id)
                    .ToListAsync();

                var reviewFeedbacks = await _efContext.ReviewFeedbacks
                    .Where(rf => userAnswerIds.Contains(rf.UserAnswerId))
                    .ToListAsync();
                _efContext.ReviewFeedbacks.RemoveRange(reviewFeedbacks);

                // Xóa UserAnswers
                var userAnswers = await _efContext.UserAnswers
                    .Where(ua => questionIds.Contains(ua.QuestionId))
                    .ToListAsync();
                _efContext.UserAnswers.RemoveRange(userAnswers);

                // Xóa Answers
                var answers = await _efContext.Answers
                    .Where(a => questionIds.Contains(a.QuestionId))
                    .ToListAsync();
                _efContext.Answers.RemoveRange(answers);

                // Xóa Questions
                var questions = await _efContext.Questions
                    .Where(q => groupIds.Contains(q.GroupId))
                    .ToListAsync();
                _efContext.Questions.RemoveRange(questions);

                // Xóa QuestionGroups
                var groups = await _efContext.QuestionGroups
                    .Where(qg => qg.PartId == part.Id)
                    .ToListAsync();
                _efContext.QuestionGroups.RemoveRange(groups);

                // Xóa Part
                _efContext.Parts.Remove(part);

                await _efContext.SaveChangesAsync();
                InvalidateTestCache(testId);

                return Ok(new { message = $"Đã xóa thành công Part {partNumber} của Test ID {testId}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, detail = ex.InnerException?.Message });
            }
        }

        /// <summary>
        /// Cập nhật thông tin Part
        /// </summary>
        [HttpPut("tests/{testId}/parts/{partNumber}")]
        public async Task<IActionResult> UpdatePart(int testId, int partNumber, [FromBody] UpdatePartRequest request)
        {
            var part = await _efContext.Parts
                .FirstOrDefaultAsync(p => p.TestId == testId && p.PartNumber == partNumber);

            if (part == null)
                return NotFound(new { error = $"Không tìm thấy Part {partNumber} của Test ID {testId}" });

            if (!string.IsNullOrEmpty(request.Name))
                part.Name = request.Name;

            await _efContext.SaveChangesAsync();
            InvalidateTestCache(testId);

            return Ok(new { message = "Cập nhật Part thành công!", data = part });
        }
    }

    // DTO cho UpdateTest
    public class UpdateTestRequest
    {
        public string? Title { get; set; }
        public string? Slug { get; set; }
        public string? Type { get; set; }
        public int? Duration { get; set; }
        public int? TotalQuestions { get; set; }
        public bool? IsActive { get; set; }
    }

    // DTO cho UpdatePart
    public class UpdatePartRequest
    {
        public string? Name { get; set; }
    }
}
