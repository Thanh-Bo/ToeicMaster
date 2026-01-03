using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;
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
        private readonly IMemoryCache _cache;
        private readonly AiExplanationService _aiService;

        public TestsController(DapperContext dapperContext, AppDbContext efContext, IMemoryCache cache, AiExplanationService aiService, ToeicScoreService scoreService)
        {
            _dapperContext = dapperContext;
            _efContext = efContext;
            _cache = cache;
            _aiService = aiService;
            _scoreService = scoreService;
        }

        // 1. GET LIST
        [HttpGet]
        public async Task<IActionResult> GetTests([FromQuery] int page = 1, [FromQuery] int limit = 10, [FromQuery] string? search = null)
        {
            var skip = (page - 1) * limit;
            var sql = @"
                SELECT Id, Title, Slug, Duration, TotalQuestions 
                FROM Tests
                WHERE (@Search IS NULL OR Title LIKE '%' + @Search + '%')
                ORDER BY Id DESC
                OFFSET @Skip ROWS FETCH NEXT @Limit ROWS ONLY;
                SELECT COUNT(*) FROM Tests WHERE (@Search IS NULL OR Title LIKE '%' + @Search + '%');";

            using (var connection = _dapperContext.CreateConnection())
            {
                using (var multi = await connection.QueryMultipleAsync(sql, new { Skip = skip, Limit = limit, Search = search }))
                {
                    var tests = await multi.ReadAsync<TestSummaryDto>();
                    var totalRecord = await multi.ReadFirstAsync<int>();
                    return Ok(new { data = tests, pagination = new { page, limit, totalRecord, totalPages = (int)Math.Ceiling((double)totalRecord / limit) } });
                }
            }
        }

        [HttpGet("{id}/full")]
        public async Task<IActionResult> GetTestFull(int id, [FromQuery] string? parts = null)
        {
            // 1. Phân tách chuỗi "1,2,5" thành danh sách số nguyên [1, 2, 5]
            List<int> partNumbers = new List<int>();
            if (!string.IsNullOrEmpty(parts))
            {
                try
                {
                    partNumbers = parts.Split(',').Select(int.Parse).ToList();
                }
                catch { return BadRequest(new { message = "Định dạng danh sách Part không hợp lệ (ví dụ đúng: 1,2,5)" }); }
            }

            // 2. Tạo Cache Key động dựa trên danh sách Part để tránh lấy nhầm dữ liệu
            // Nếu không truyền parts, cache key là test_full_10
            // Nếu truyền parts=1,2, cache key là test_full_10_p1,2
            string cacheKey = $"test_full_{id}" + (partNumbers.Any() ? $"_p{string.Join(",", partNumbers)}" : "");

            if (_cache.TryGetValue(cacheKey, out TestDetailDto? cachedData))
                return Ok(new { success = true, data = cachedData });

            // 3. Sửa câu lệnh SQL để thêm điều kiện lọc p.PartNumber
            var sql = @"
        SELECT t.Id AS TestId, t.Title, t.Duration,
               p.Id AS PartId, p.Name AS PartName, p.PartNumber,
               qg.Id AS GroupId, qg.TextContent, qg.ImageUrl, qg.AudioUrl,
               q.Id AS QuestionId, q.QuestionNo, q.Content AS QuestionContent,
               a.Label, a.Content AS AnswerContent
        FROM Tests t
        JOIN Parts p ON t.Id = p.TestId
        JOIN QuestionGroups qg ON p.Id = qg.PartId
        JOIN Questions q ON qg.Id = q.GroupId
        JOIN Answers a ON q.Id = a.QuestionId
        WHERE t.Id = @Id ";

            // Thêm điều kiện lọc PartNumber vào SQL nếu có yêu cầu
            if (partNumbers.Any())
            {
                sql += " AND p.PartNumber IN @PartNumbers ";
            }

            sql += " ORDER BY p.PartNumber, q.QuestionNo, a.Label";

            using (var connection = _dapperContext.CreateConnection())
            {
                // Truyền tham số PartNumbers vào Dapper
                var flatData = await connection.QueryAsync<dynamic>(sql, new { Id = id, PartNumbers = partNumbers });

                if (!flatData.Any()) return NotFound(new { message = "Không tìm thấy nội dung phù hợp" });

                var firstRow = flatData.First();
                var testDetail = new TestDetailDto
                {
                    Id = firstRow.TestId,
                    Title = firstRow.Title,
                    Duration = firstRow.Duration,
                    Parts = flatData.GroupBy(r => r.PartId).Select(gPart => new PartDto
                    {
                        Id = gPart.Key,
                        Name = gPart.First().PartName,
                        // Chú ý mapping thêm PartNumber nếu DTO của bạn có trường này
                        Groups = gPart.GroupBy(r => r.GroupId).Select(gGroup => new GroupDto
                        {
                            Id = gGroup.Key,
                            TextContent = gGroup.First().TextContent,
                            ImageUrl = gGroup.First().ImageUrl,
                            AudioUrl = gGroup.First().AudioUrl,
                            Questions = gGroup.GroupBy(r => r.QuestionId).Select(gQuestion => new QuestionDto
                            {
                                Id = gQuestion.Key,
                                QuestionNo = gQuestion.First().QuestionNo,
                                Content = gQuestion.First().QuestionContent,
                                Answers = gQuestion.Select(a => new AnswerDto { Label = a.Label, Content = a.AnswerContent }).ToList()
                            }).ToList()
                        }).ToList()
                    }).ToList()
                };

                _cache.Set(cacheKey, testDetail, TimeSpan.FromMinutes(30));
                return Ok(new { success = true, data = testDetail });
            }
        }
        // 3. SUBMIT
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitTest([FromBody] SubmitTestRequest request)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null) return Unauthorized();
            var userId = int.Parse(userIdStr);

            // Lấy thông tin câu hỏi kèm theo Part để biết câu đó là Listening hay Reading
            var questionsInfo = await _efContext.Questions
                .Include(q => q.Group).ThenInclude(g => g.Part)
                .Where(q => q.Group.Part.TestId == request.TestId)
                .ToDictionaryAsync(q => q.Id, q => new { q.CorrectOption, q.Group.Part.PartNumber });

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
                Status = "COMPLETED"
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
                        if (qInfo.PartNumber <= 4) listeningCorrect++;
                        else readingCorrect++;
                    }
                }
                userAnswersEntities.Add(new UserAnswer
                {
                    AttemptId = attempt.Id,
                    QuestionId = ans.QuestionId,
                    SelectedOption = ans.SelectedOption,
                    IsCorrect = isCorrect
                });
            }

            var toeicScore = await _scoreService.CalculateScoreAsync(listeningCorrect, readingCorrect);

            // Cập nhật điểm chuẩn vào database
            attempt.TotalScore = toeicScore.TotalScore;
            attempt.ListeningScore = toeicScore.ListeningScore;
            attempt.ReadingScore = toeicScore.ReadingScore;

            _efContext.UserAnswers.AddRange(userAnswersEntities);
            await _efContext.SaveChangesAsync();

            // Trả về TotalScore là điểm TOEIC (ví dụ 650), không phải số câu đúng
            return Ok(new TestResultResponse
            {
                AttemptId = attempt.Id,
                TotalScore = toeicScore.TotalScore, // Giờ là điểm 990
                TotalQuestions = questionsInfo.Count,
                Message = "Nộp bài thành công!"
            });
        }

        // 4. GET RESULT
        [HttpGet("results/{attemptId}")]
        [Authorize]
        public async Task<IActionResult> GetTestResult(int attemptId)
        {
            var attempt = await _efContext.TestAttempts.Include(t => t.Test).FirstOrDefaultAsync(a => a.Id == attemptId);
            if (attempt == null) return NotFound("Không tìm thấy bài làm.");

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || attempt.UserId != int.Parse(userIdStr)) return Forbid();

            // Lấy tất cả câu hỏi của bài thi
            var allQuestions = await _efContext.Questions
                .Include(q => q.Answers)
                .Include(q => q.Group).ThenInclude(g => g.Part)
                .Where(q => q.Group.Part.TestId == attempt.TestId)
                .OrderBy(q => q.Group.Part.PartNumber)
                .ThenBy(q => q.QuestionNo)
                .ToListAsync();

            // Lấy các câu trả lời của user
            var userAnswers = await _efContext.UserAnswers
                .Where(ua => ua.AttemptId == attemptId)
                .ToDictionaryAsync(ua => ua.QuestionId, ua => ua);

            var result = new TestResultDetailDto
            {
                AttemptId = attempt.Id,
                TimeTaken = attempt.TimeTaken,
                TestId = attempt.TestId,
                TestTitle = attempt.Test.Title,
                TotalScore = attempt.TotalScore,
                TotalQuestions = allQuestions.Count,
                CompletedAt = attempt.CompletedAt,
                Questions = allQuestions.Select(q =>
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

                        ShortExplanation = q.ShortExplanation,
                        FullExplanation = q.FullExplanation,

                        GroupId = q.GroupId,
                        GroupContent = q.Group?.TextContent,

                        // Thông tin Part và media
                        PartNumber = q.Group?.Part?.PartNumber ?? 5,
                        PartName = q.Group?.Part?.Name ?? "Part 5",
                        ImageUrl = q.Group?.ImageUrl,
                        AudioUrl = q.Group?.AudioUrl,

                        Answers = q.Answers?.Select(a => new ResultAnswerDto { Label = a.Label ?? "", Content = a.Content ?? "" }).ToList() ?? new List<ResultAnswerDto>()
                    };
                }).ToList()
            };
            return Ok(result);
        }

        [HttpPost("{testId}/generate-explanations")]
        public async Task<IActionResult> GenerateExplanations(int testId)
        {
            // 1. Lấy các câu hỏi thuộc đề thi này mà CHƯA có giải thích
            var questions = await _efContext.Questions
                .Include(q => q.Group).ThenInclude(g => g.Part)
                .Include(q => q.Answers)
                .Where(q => q.Group.Part.TestId == testId && (q.ShortExplanation == null || q.FullExplanation == null))
                .ToListAsync();

            if (!questions.Any()) return Ok("Tuyệt vời! Tất cả câu hỏi trong đề này đã có giải thích rồi.");

            int count = 0;
            foreach (var q in questions)
            {
                // 2. Gọi AI
                var (shortExp, fullExp) = await _aiService.GenerateExplanationAsync(q, q.Answers.ToList());

                // 3. Lưu vào Database
                q.ShortExplanation = shortExp;
                q.FullExplanation = fullExp;
                count++;
                await _efContext.SaveChangesAsync();

                await Task.Delay(2000); // Nghỉ 2 giây giữa mỗi câu
            }


            return Ok(new { Message = $"Đã cập nhật giải thích thành công cho {count} câu hỏi!", TotalUpdated = count });
        }

        // Tra loi tung cau hoi
        [HttpPost("explain-question/{questionId}")]
        public async Task<IActionResult> ExplainOneQuestion(int questionId)
        {
            // 1. Lấy câu hỏi và đáp án từ DB
            var question = await _efContext.Questions
                .Include(q => q.Answers)
                .Include(q => q.Group) // Lấy Group để phòng trường hợp cần Transcript
                .FirstOrDefaultAsync(q => q.Id == questionId);

            if (question == null) return NotFound("Không tìm thấy câu hỏi");

            // 2. Kiểm tra xem đã có giải thích chưa? (Nếu có rồi thì trả về luôn, đỡ tốn tiền AI)
            if (!string.IsNullOrEmpty(question.FullExplanation))
            {
                return Ok(new
                {
                    shortExplanation = question.ShortExplanation,
                    fullExplanation = question.FullExplanation
                });
            }

            // 3. Nếu chưa có, gọi AI tạo mới
            try
            {
                var (shortExp, fullExp) = await _aiService.GenerateExplanationAsync(question, question.Answers.ToList());

                // 4. Lưu vào Database (Để người sau vào xem không phải chờ nữa)
                question.ShortExplanation = shortExp;
                question.FullExplanation = fullExp;
                await _efContext.SaveChangesAsync();

                return Ok(new
                {
                    shortExplanation = shortExp,
                    fullExplanation = fullExp
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi khi gọi AI: " + ex.Message);
            }
        }

        // 5. GET HISTORY - Lịch sử làm bài của user
        [HttpGet("history")]
        [Authorize]
        public async Task<IActionResult> GetUserHistory()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null) return Unauthorized();
            var userId = int.Parse(userIdStr);

            var attempts = await _efContext.TestAttempts
                .Include(a => a.Test)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CompletedAt)
                .Select(a => new HistoryItemDto
                {
                    AttemptId = a.Id,
                    TestId = a.TestId,
                    TestTitle = a.Test.Title,
                    TotalScore = a.TotalScore,
                    TotalQuestions = a.Test.TotalQuestions ?? 200,
                    ListeningScore = a.ListeningScore,
                    ReadingScore = a.ReadingScore,
                    StartedAt = a.StartedAt,
                    CompletedAt = a.CompletedAt,
                    Status = a.Status ?? "COMPLETED"
                })
                .ToListAsync();

            return Ok(new { success = true, data = attempts });
        }

        /// </summary>
    [HttpGet("topics")]
    public async Task<IActionResult> GetTopics()
    {
         var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null) return Unauthorized();
            var userId = int.Parse(userIdStr);

        var topics = await _efContext.Topics
            .Select(t => new TopicDto
            {
                Id = t.Id,
                Title = t.Title,
                Level = t.Level,
                LevelRange = t.LevelRange,
                ImageUrl = t.ImageUrl,
                TotalWords = t.Vocabularies.Count,
                // Đếm số từ user đã học (có record trong UserVocabulary và status > 0)
                LearnedWords = t.Vocabularies.Count(v => v.UserVocabularies.Any(uv => uv.UserId == userId && uv.Status > 0))
            })
            .ToListAsync();

        return Ok(topics);
    }
    /// <summary>
    /// Lấy danh sách từ vựng thuộc 1 Topic (kèm WordFamily)
    /// </summary>
    [HttpGet("topics/{topicId}/words")]
    public async Task<IActionResult> GetWordsByTopic(int topicId)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null) return Unauthorized();
            var userId = int.Parse(userIdStr);


        var words = await _efContext.Vocabularies
            .Where(v => v.TopicId == topicId)
            .Include(v => v.WordFamilies) // Quan trọng: Include bảng con
            .Select(v => new VocabularyDto
            {
                Id = v.Id,
                Word = v.Word,
                Meaning = v.Meaning,
                Pronunciation = v.Pronunciation,
                PartOfSpeech = v.PartOfSpeech,
                Example = v.Example,
                ExampleTranslation = v.ExampleTranslation,
                AudioUrl = v.AudioUrl,
                ImageUrl = v.ImageUrl,
                
                // Map WordFamilies
                WordFamilies = v.WordFamilies.Select(wf => new WordFamilyDto 
                { 
                    Word = wf.Word, 
                    PartOfSpeech = wf.PartOfSpeech,
                    Meaning = wf.Meaning 
                }).ToList(),

                // Lấy status hiện tại của user
                Status = v.UserVocabularies
                    .Where(uv => uv.UserId == userId)
                    .Select(uv => uv.Status)
                    .FirstOrDefault() // Mặc định là 0 (New) nếu null
            })
            .ToListAsync();

        return Ok(words);
    }
    public class UpdateStatusRequest { public int Status { get; set; } }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateWordStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null) return Unauthorized();
            var userId = int.Parse(userIdStr);

        var userVocab = await _efContext.UserVocabularies
            .FirstOrDefaultAsync(uv => uv.UserId == userId && uv.VocabularyId == id);

        if (userVocab == null)
        {
            userVocab = new UserVocabulary 
            { 
                UserId = userId, 
                VocabularyId = id, 
                CreatedAt = DateTime.UtcNow 
            };
            _efContext.UserVocabularies.Add(userVocab);
        }

        userVocab.Status = request.Status; // 1: Learning, 3: Mastered
        userVocab.LastReviewedAt = DateTime.UtcNow;
        
        // Nếu set là Mastered, có thể đẩy ngày review ra xa
        if (request.Status == 3) 
            userVocab.NextReviewAt = DateTime.UtcNow.AddDays(30);
        else 
            userVocab.NextReviewAt = DateTime.UtcNow.AddDays(1);

        await _efContext.SaveChangesAsync();
        return Ok(new { message = "Status updated" });
    }

    }
}

// DTO for History
public class HistoryItemDto
{
    public int AttemptId { get; set; }
    public int TestId { get; set; }
    public string TestTitle { get; set; } = "";
    public int TotalScore { get; set; }
    public int TotalQuestions { get; set; }
    public int? ListeningScore { get; set; }
    public int? ReadingScore { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime CompletedAt { get; set; }
    public string Status { get; set; } = "COMPLETED";
}