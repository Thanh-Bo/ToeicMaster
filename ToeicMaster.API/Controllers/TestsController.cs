using System.Security.Claims;
using System.Text.Json;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models;
using ToeicMaster.API.Models.Exam;
using ToeicMaster.API.Services;

namespace ToeicMaster.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class TestsController : ControllerBase
    {
        private readonly ToeicScoreService _scoreService;
        private readonly DapperContext _dapperContext;
        private readonly AppDbContext _efContext;
        private readonly IDistributedCache _cache;
        private readonly AiExplanationService _aiService;
        private readonly IPremiumService _premiumService;

        public TestsController(
            DapperContext dapperContext,
            AppDbContext efContext,
            IDistributedCache cache,
            AiExplanationService aiService,
            IPremiumService premiumService,
            ToeicScoreService scoreService
        )
        {
            _dapperContext = dapperContext;
            _efContext = efContext;
            _cache = cache;
            _aiService = aiService;
            _premiumService = premiumService;
            _scoreService = scoreService;
        }

        // 1. GET LIST
        [HttpGet]
        public async Task<IActionResult> GetTests(
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10,
            [FromQuery] string? search = null
        )
        {
            var skip = (page - 1) * limit;
            var userId = GetUserIdOrNull();
            var isPremium = await IsPremiumUserAsync(userId);
            var sql =
                @"
                SELECT Id, TestGuid, Title, Slug, Duration, TotalQuestions, IsExplanationPremiumRequired
                FROM Tests
                WHERE (@Search IS NULL OR Title LIKE '%' + @Search + '%')
                ORDER BY Id ASC
                OFFSET @Skip ROWS FETCH NEXT @Limit ROWS ONLY;
                SELECT COUNT(*) FROM Tests WHERE (@Search IS NULL OR Title LIKE '%' + @Search + '%');";

            using (var connection = _dapperContext.CreateConnection())
            {
                using (
                    var multi = await connection.QueryMultipleAsync(
                        sql,
                        new
                        {
                            Skip = skip,
                            Limit = limit,
                            Search = search,
                        }
                    )
                )
                {
                    var tests = await multi.ReadAsync<TestSummaryDto>();
                    var totalRecord = await multi.ReadFirstAsync<int>();
                    var testList = tests.Select(t =>
                    {
                        t.CanViewExplanation = !t.IsExplanationPremiumRequired || isPremium;
                        return t;
                    }).ToList();
                    return Ok(
                        new
                        {
                            data = testList,
                            pagination = new
                            {
                                page,
                                limit,
                                totalRecord,
                                totalPages = (int)Math.Ceiling((double)totalRecord / limit),
                            },
                        }
                    );
                }
            }
        }

        private int? GetUserIdOrNull()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdStr, out var userId) ? userId : null;
        }

        private async Task<bool> IsPremiumUserAsync(int? userId)
        {
            return await _premiumService.IsPremiumUserAsync(userId);
        }

        // Public endpoint - UUID only
        [HttpGet("{testGuid:guid}/full")]
        public async Task<IActionResult> GetTestFull(Guid testGuid, [FromQuery] string? parts = null)
        {
            var test = await _efContext.Tests.FirstOrDefaultAsync(t => t.TestGuid == testGuid);
            if (test == null)
                return NotFound(new { message = "Không tìm thấy đề thi." });

            return await BuildTestFullDataAsync(test.Id, parts);
        }

#if DEBUG
        // Internal endpoint for testing - Development only
        [HttpGet("internal/tests/{id:int}/full")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTestFullById(int id, [FromQuery] string? parts = null)
        {
            var test = await _efContext.Tests.FirstOrDefaultAsync(t => t.Id == id);
            if (test == null)
                return NotFound(new { message = "Không tìm thấy đề thi." });

            return await BuildTestFullDataAsync(id, parts);
        }
#endif

        // Shared method to build test full data
        private async Task<IActionResult> BuildTestFullDataAsync(int testId, string? parts)
        {
            // 1. Phân tách chuỗi "1,2,5" thành danh sách số nguyên [1, 2, 5]
            List<int> partNumbers = new List<int>();
            if (!string.IsNullOrEmpty(parts))
            {
                try
                {
                    partNumbers = parts.Split(',').Select(int.Parse).ToList();
                }
                catch
                {
                    return BadRequest(
                        new
                        {
                            message = "Định dạng danh sách Part không hợp lệ (ví dụ đúng: 1,2,5)",
                        }
                    );
                }
            }

            // 2. Tạo Cache Key động dựa trên danh sách Part để tránh lấy nhầm dữ liệu
            string cacheKey =
                $"test_full_{testId}" + (partNumbers.Any() ? $"_p{string.Join(",", partNumbers)}" : "");

            var cachedBytes = await _cache.GetAsync(cacheKey);
            if (cachedBytes != null)
            {
                var cachedData = JsonSerializer.Deserialize<TestDetailDto>(cachedBytes);
                return Ok(new { success = true, data = cachedData });
            }

            // 3. Sửa câu lệnh SQL để thêm điều kiện lọc p.PartNumber
            var sql =
                @"
        SELECT t.Id AS TestId, t.Title, t.Duration,
               p.Id AS PartId, p.Name AS PartName, p.PartNumber,
               qg.Id AS GroupId, qg.TextContent, qg.ImageUrl, qg.AudioUrl, qg.AudioDuration,
               q.Id AS QuestionId, q.QuestionNo, q.Content AS QuestionContent,
               a.Label, a.Content AS AnswerContent
        FROM Tests t
        JOIN Parts p ON t.Id = p.TestId
        JOIN QuestionGroups qg ON p.Id = qg.PartId
        JOIN Questions q ON qg.Id = q.GroupId
        JOIN Answers a ON q.Id = a.QuestionId
        WHERE t.Id = @Id ";

            if (partNumbers.Any())
            {
                sql += " AND p.PartNumber IN @PartNumbers ";
            }

            sql += " ORDER BY p.PartNumber, q.QuestionNo, a.Label";

            using (var connection = _dapperContext.CreateConnection())
            {
                var flatData = await connection.QueryAsync<dynamic>(
                    sql,
                    new { Id = testId, PartNumbers = partNumbers }
                );

                if (!flatData.Any())
                    return NotFound(new { message = "Không tìm thấy nội dung phù hợp" });

                var firstRow = flatData.First();
                int resolvedTestId = (int)firstRow.TestId;
                var testGuidValue = await _efContext.Tests
                    .Where(t => t.Id == resolvedTestId)
                    .Select(t => t.TestGuid)
                    .FirstOrDefaultAsync();

                var testDetail = new TestDetailDto
                {
                    Id = firstRow.TestId,
                    TestGuid = testGuidValue,
                    Title = firstRow.Title,
                    Duration = firstRow.Duration,
                    Parts = flatData
                        .GroupBy(r => r.PartId)
                        .Select(gPart => new PartDto
                        {
                            Id = gPart.Key,
                            Name = gPart.First().PartName,
                            Groups = gPart
                                .GroupBy(r => r.GroupId)
                                .Select(gGroup => new GroupDto
                                {
                                    Id = gGroup.Key,
                                    TextContent = gGroup.First().TextContent,
                                    ImageUrl = gGroup.First().ImageUrl,
                                    AudioUrl = gGroup.First().AudioUrl,
                                    AudioDuration = gGroup.First().AudioDuration,
                                    Questions = gGroup
                                        .GroupBy(r => r.QuestionId)
                                        .Select(gQuestion => new QuestionDto
                                        {
                                            Id = gQuestion.Key,
                                            QuestionNo = gQuestion.First().QuestionNo,
                                            Content = gQuestion.First().QuestionContent,
                                            Answers = gQuestion
                                                .Select(a => new AnswerDto
                                                {
                                                    Label = a.Label,
                                                    Content = a.AnswerContent,
                                                })
                                                .ToList(),
                                        })
                                        .ToList(),
                                })
                                .ToList(),
                        })
                        .ToList(),
                };

                var serializedData = JsonSerializer.SerializeToUtf8Bytes(testDetail);
                await _cache.SetAsync(cacheKey, serializedData, new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30)
                });
                return Ok(new { success = true, data = testDetail });
            }
        }

        // 3. SUBMIT
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitTest([FromBody] SubmitTestRequest request)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null)
                return Unauthorized();
            var userId = int.Parse(userIdStr);

            // Lấy thông tin câu hỏi kèm theo Part để biết câu đó là Listening hay Reading
            var questionsInfo = await _efContext
                .Questions.Include(q => q.Group)
                    .ThenInclude(g => g.Part)
                .Where(q => q.Group.Part.TestId == request.TestId)
                .ToDictionaryAsync(
                    q => q.Id,
                    q => new { q.CorrectOption, q.Group.Part.PartNumber }
                );

            int listeningCorrect = 0;
            int readingCorrect = 0;
            var userAnswersEntities = new List<UserAnswer>();

            // Tạo attempt trước
            var attempt = new TestAttempt
            {
                UserId = userId,
                TestId = request.TestId,
                StartedAt = DateTime.UtcNow.AddMinutes(-120),
                CompletedAt = DateTime.UtcNow,
                TimeTaken = request.Duration,
                Status = "COMPLETED",
            };

            _efContext.TestAttempts.Add(attempt);
            await _efContext.SaveChangesAsync();

            foreach (var ans in request.Answers)
            {
                bool isCorrect = false;
                if (questionsInfo.TryGetValue(ans.QuestionId, out var qInfo))
                {
                    if (qInfo.CorrectOption == ans.SelectedOption)
                    {
                        isCorrect = true;
                        // Part 1-4 là Listening, Part 5-7 là Reading
                        if (qInfo.PartNumber <= 4)
                            listeningCorrect++;
                        else
                            readingCorrect++;
                    }
                }
                userAnswersEntities.Add(
                    new UserAnswer
                    {
                        AttemptId = attempt.Id,
                        QuestionId = ans.QuestionId,
                        SelectedOption = ans.SelectedOption,
                        IsCorrect = isCorrect,
                    }
                );
            }

            var toeicScore = await _scoreService.CalculateScoreAsync(
                listeningCorrect,
                readingCorrect
            );

            // Cập nhật điểm chuẩn vào database
            attempt.TotalScore = toeicScore.TotalScore;
            attempt.ListeningScore = toeicScore.ListeningScore;
            attempt.ReadingScore = toeicScore.ReadingScore;

            _efContext.UserAnswers.AddRange(userAnswersEntities);
            await _efContext.SaveChangesAsync();

            // Trả về TotalScore là điểm TOEIC (ví dụ 650), không phải số câu đúng
            return Ok(
                new TestResultResponse
                {
                    AttemptId = attempt.Id,
                    AttemptGuid = attempt.AttemptGuid,
                    TotalScore = toeicScore.TotalScore, // Giờ là điểm 990
                    TotalQuestions = questionsInfo.Count,
                    Message = "Nộp bài thành công!",
                }
            );
        }

        // 4. GET RESULT - Public endpoint (UUID only)
        [HttpGet("results/{attemptGuid:guid}")]
        [Authorize]
        public async Task<IActionResult> GetTestResult(Guid attemptGuid)
        {
            var attempt = await _efContext
                .TestAttempts.Include(t => t.Test)
                .FirstOrDefaultAsync(a => a.AttemptGuid == attemptGuid);
            
            if (attempt == null)
                return NotFound("Không tìm thấy bài làm.");

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || attempt.UserId != int.Parse(userIdStr))
                return NotFound("Không tìm thấy bài làm."); // Return 404 to prevent enumeration attacks

            var result = await BuildResultDataAsync(attempt);
            return Ok(result);
        }

#if DEBUG
        // Internal endpoint for testing (Development only)
        [HttpGet("internal/results/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTestResultById(int id)
        {
            var attempt = await _efContext
                .TestAttempts.Include(t => t.Test)
                .FirstOrDefaultAsync(a => a.Id == id);
            
            if (attempt == null)
                return NotFound("Không tìm thấy bài làm.");

            var result = await BuildResultDataAsync(attempt);
            return Ok(result);
        }
#endif

        // Shared method to build result data
        private async Task<TestResultDetailDto> BuildResultDataAsync(TestAttempt attempt)
        {
            var canViewExplanation = !attempt.Test.IsExplanationPremiumRequired ||
                                     await IsPremiumUserAsync(attempt.UserId);

            // Lấy tất cả câu hỏi của bài thi
            var allQuestions = await _efContext
                .Questions.Include(q => q.Answers)
                .Include(q => q.Group)
                    .ThenInclude(g => g.Part)
                .Where(q => q.Group.Part.TestId == attempt.TestId)
                .OrderBy(q => q.Group.Part.PartNumber)
                .ThenBy(q => q.QuestionNo)
                .ToListAsync();

            // Lấy các câu trả lời của user
            var userAnswers = await _efContext
                .UserAnswers.Where(ua => ua.AttemptId == attempt.Id)
                .ToDictionaryAsync(ua => ua.QuestionId, ua => ua);

            return new TestResultDetailDto
            {
                AttemptId = attempt.Id,
                TimeTaken = attempt.TimeTaken,
                TestId = attempt.TestId,
                TestTitle = attempt.Test.Title,
                IsExplanationPremiumRequired = attempt.Test.IsExplanationPremiumRequired,
                CanViewExplanation = canViewExplanation,
                TotalScore = attempt.TotalScore,
                ListeningScore = attempt.ListeningScore ?? 0,
                ReadingScore = attempt.ReadingScore ?? 0,
                TotalQuestions = allQuestions.Count,
                CompletedAt = attempt.CompletedAt,
                Questions = allQuestions
                    .Select(q =>
                    {
                        var userAnswer = userAnswers.ContainsKey(q.Id) ? userAnswers[q.Id] : null;
                        return new ResultQuestionDto
                        {
                            QuestionId = q.Id,
                            QuestionNo = q.QuestionNo,
                            Content = q.Content ?? "",
                            UserSelected = userAnswer?.SelectedOption ?? "",
                            CorrectOption = q.CorrectOption ?? "",
                            IsCorrect = userAnswer?.IsCorrect ?? false,

                            ShortExplanation = canViewExplanation ? q.ShortExplanation : null,
                            FullExplanation = canViewExplanation ? q.FullExplanation : null,
                            ExplanationLocked = !canViewExplanation,

                            GroupId = q.GroupId,
                            GroupContent = q.Group?.TextContent,

                            // Thông tin Part và media
                            PartNumber = q.Group?.Part?.PartNumber ?? 5,
                            PartName = q.Group?.Part?.Name ?? "Part 5",
                            ImageUrl = q.Group?.ImageUrl,
                            AudioUrl = q.Group?.AudioUrl,
                            Transcript = q.Group?.Transcript,
                            GroupContentTranslation = q.Group?.TextContentTranslation,
                            TranscriptTranslation = q.Group?.TranscriptTranslation,

                            Answers =
                                q.Answers?.Select(a => new ResultAnswerDto
                                    {
                                        Label = a.Label ?? "",
                                        Content = a.Content ?? "",
                                    })
                                    .ToList()
                                ?? new List<ResultAnswerDto>(),
                        };
                    })
                    .ToList(),
            };
        }

        [HttpPost("{testId}/generate-explanations")]
        public async Task<IActionResult> GenerateExplanations(int testId)
        {
            // 1. Lấy các câu hỏi thuộc đề thi này mà CHƯA có giải thích
            var questions = await _efContext
                .Questions.Include(q => q.Group)
                    .ThenInclude(g => g.Part)
                .Include(q => q.Answers)
                .Where(q =>
                    q.Group.Part.TestId == testId
                    && (q.ShortExplanation == null || q.FullExplanation == null)
                )
                .ToListAsync();

            if (!questions.Any())
                return Ok("Tuyệt vời! Tất cả câu hỏi trong đề này đã có giải thích rồi.");

            int count = 0;
            foreach (var q in questions)
            {
                // 2. Gọi AI
                var (shortExp, fullExp) = await _aiService.GenerateExplanationAsync(
                    q,
                    q.Answers.ToList()
                );

                // 3. Lưu vào Database
                q.ShortExplanation = shortExp;
                q.FullExplanation = fullExp;
                count++;
                await _efContext.SaveChangesAsync();

                await Task.Delay(2000); // Nghỉ 2 giây giữa mỗi câu
            }

            return Ok(
                new
                {
                    Message = $"Đã cập nhật giải thích thành công cho {count} câu hỏi!",
                    TotalUpdated = count,
                }
            );
        }

        // Tra loi tung cau hoi
        [HttpPost("explain-question/{questionId}")]
        public async Task<IActionResult> ExplainOneQuestion(int questionId)
        {
            // 1. Lấy câu hỏi và đáp án từ DB
            var question = await _efContext
                .Questions.Include(q => q.Answers)
                .Include(q => q.Group) // Lấy Group để phòng trường hợp cần Transcript
                    .ThenInclude(g => g.Part) // ✅ Cần để lấy PartNumber cho AI
                .FirstOrDefaultAsync(q => q.Id == questionId);

            if (question == null)
                return NotFound("Không tìm thấy câu hỏi");

            // 2. Kiểm tra xem đã có giải thích chưa? (Nếu có rồi thì trả về luôn, đỡ tốn tiền AI)
            var isExplanationPremiumRequired = await _efContext.Tests
                .Where(t => t.Id == question.Group.Part.TestId)
                .Select(t => t.IsExplanationPremiumRequired)
                .FirstOrDefaultAsync();
            var canViewExplanation = !isExplanationPremiumRequired ||
                                     await IsPremiumUserAsync(GetUserIdOrNull());

            if (!canViewExplanation)
            {
                return StatusCode(403, new
                {
                    error = "Premium required",
                    explanationLocked = true,
                    message = "Giải thích này chỉ dành cho tài khoản Premium"
                });
            }

            if (!string.IsNullOrEmpty(question.FullExplanation))
            {
                return Ok(
                    new
                    {
                        shortExplanation = question.ShortExplanation,
                        fullExplanation = question.FullExplanation,
                    }
                );
            }

            // 3. Nếu chưa có, gọi AI tạo mới
            try
            {
                var (shortExp, fullExp) = await _aiService.GenerateExplanationAsync(
                    question,
                    question.Answers.ToList()
                );

                // 4. Lưu vào Database (Để người sau vào xem không phải chờ nữa)
                question.ShortExplanation = shortExp;
                question.FullExplanation = fullExp;
                await _efContext.SaveChangesAsync();

                return Ok(new { shortExplanation = shortExp, fullExplanation = fullExp });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi khi gọi AI: " + ex.Message);
            }
        }

        // Dịch đoạn văn (Part 6 / Part 7) hoặc Transcript (Part 3/4) và lưu vào DB
        [HttpPost("translate-passage")]
        public async Task<IActionResult> TranslatePassage([FromBody] TranslatePassageRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Passage))
                return BadRequest(new { message = "Passage không được để trống." });

            try
            {
                var translation = await _aiService.TranslatePassageAsync(request.Passage, request.PartNumber ?? 7);

                // Nếu client gửi groupId và type thì lưu ngay vào DB
                if (request.GroupId.HasValue && !string.IsNullOrEmpty(request.Type))
                {
                    var group = await _efContext.QuestionGroups.FindAsync(request.GroupId.Value);
                    if (group != null)
                    {
                        if (request.Type == "content")
                            group.TextContentTranslation = translation;
                        else if (request.Type == "transcript")
                            group.TranscriptTranslation = translation;

                        await _efContext.SaveChangesAsync();
                    }
                }

                return Ok(new { translation });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi dịch đoạn văn: " + ex.Message);
            }
        }

        // 5. GET HISTORY - Lịch sử làm bài của user
        [HttpGet("history")]
        [Authorize]
        public async Task<IActionResult> GetUserHistory()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null)
                return Unauthorized();
            var userId = int.Parse(userIdStr);

            var attempts = (await _efContext
                .TestAttempts
                .Include(a => a.Test)
                .Include(a => a.UserAnswers)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CompletedAt)
                .ToListAsync())
                .Select(a => new HistoryItemDto
                {
                    AttemptId = a.Id,
                    AttemptGuid = a.AttemptGuid,
                    TestId = a.TestId,
                    TestTitle = a.Test.Title,
                    TotalScore = a.TotalScore,
                    TotalQuestions = a.Test.TotalQuestions ?? 200,
                    CorrectAnswers = a.UserAnswers.Count(ua => ua.IsCorrect),
                    ListeningScore = a.ListeningScore,
                    ReadingScore = a.ReadingScore,
                    StartedAt = a.StartedAt,
                    CompletedAt = a.CompletedAt,
                    Status = a.Status ?? "COMPLETED",
                })
                .ToList();

            return Ok(new { success = true, data = attempts });
        }

        [HttpGet("questions/groups")]
        // [Authorize(Roles = "Admin")] // Nên bật bảo mật nếu cần
        public async Task<IActionResult> GetQuestionGroups(
            [FromQuery] int testId,
            [FromQuery] int partNumber
        )
        {
            var groups = await _efContext
                .QuestionGroups // Sửa _context thành _efContext cho khớp biến của bạn
                .Include(g => g.Questions)
                .Where(g => g.Part.TestId == testId && g.Part.PartNumber == partNumber)
                .Select(g => new
                {
                    g.Id,
                    g.Transcript,
                    g.AudioUrl,
                    // Đếm số câu hỏi con để hiển thị frontend cho đẹp
                    Questions = g
                        .Questions.Select(q => new { q.Id, q.QuestionNo })
                        .OrderBy(q => q.QuestionNo)
                        .ToList(),
                })
                .OrderBy(g => g.Id)
                .ToListAsync();

            return Ok(groups);
        }

    }
}

// DTO for History
public class HistoryItemDto
{
    public int AttemptId { get; set; }
    public Guid AttemptGuid { get; set; }
    public int TestId { get; set; }
    public string TestTitle { get; set; } = "";
    public int TotalScore { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public int? ListeningScore { get; set; }
    public int? ReadingScore { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime CompletedAt { get; set; }
    public string Status { get; set; } = "COMPLETED";
}

public class TranslatePassageRequest
{
    public string Passage { get; set; } = "";
    public int? GroupId { get; set; }   // ID of the QuestionGroup to save the translation to
    public string? Type { get; set; }   // "content" (Part 6/7) or "transcript" (Part 3/4)
    public int? PartNumber { get; set; } // Part number to select correct AI prompt (6 or 7)
}
