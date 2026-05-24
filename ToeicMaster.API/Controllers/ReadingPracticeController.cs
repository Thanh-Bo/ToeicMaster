using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System.Security.Claims;
using System.Text.RegularExpressions;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/reading-practice")]
[Authorize]
public class ReadingPracticeController : ControllerBase
{
    private static readonly string[] ValidLabels = ["A", "B", "C", "D"];
    private readonly AppDbContext _context;

    public ReadingPracticeController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private async Task<User?> GetCurrentUserAsync()
    {
        var userId = GetUserId();
        return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
    }

    private async Task<bool> IsAdminAsync()
    {
        var user = await GetCurrentUserAsync();
        return string.Equals(user?.Role, "Admin", StringComparison.OrdinalIgnoreCase);
    }

    [HttpPost("import")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> ImportReadingPractice(
        [FromForm] IFormFile excelFile,
        [FromQuery] int partType = 7,
        [FromQuery] string? difficulty = null,
        [FromQuery] int? topicId = null,
        [FromQuery] string? passageType = null)
    {
        if (!await IsAdminAsync())
            return Forbid();

        if (partType is not (6 or 7))
            return BadRequest(new { error = "Part type phải là 6 hoặc 7." });

        var difficultyValue = ParseDifficultyFilter(difficulty);
        if (!IsAllFilter(difficulty) && difficultyValue == null)
            return BadRequest(new { error = "Difficulty chỉ nhận easy, medium hoặc hard." });

        ReadingTopic? topic = null;
        if (topicId.HasValue)
        {
            topic = await _context.ReadingTopics.FirstOrDefaultAsync(t => t.Id == topicId.Value && t.IsActive);
            if (topic == null)
                return BadRequest(new { error = "Topic Reading không tồn tại hoặc đã bị vô hiệu hóa." });
            if (topic.PartType != partType)
                return BadRequest(new { error = "Topic không khớp với partType đang import." });
            if (!string.IsNullOrWhiteSpace(difficultyValue) &&
                !string.Equals(topic.Difficulty, difficultyValue, StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { error = "Topic không khớp với difficulty đang import." });
        }

        if (excelFile == null || excelFile.Length == 0)
            return BadRequest(new { error = "Vui lòng upload file Excel." });

        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using var stream = new MemoryStream();
            await excelFile.CopyToAsync(stream);
            using var package = new ExcelPackage(stream);
            var worksheet = package.Workbook.Worksheets[0];

            if (worksheet.Dimension == null)
                return BadRequest(new { error = "File Excel không có dữ liệu." });

            var rowCount = worksheet.Dimension.Rows;
            ReadingPassage? currentPassage = null;
            var importedQuestions = 0;
            var importedPassages = 0;

            for (var row = 2; row <= rowCount; row++)
            {
                var qNoText = worksheet.Cells[row, 2].Text?.Trim();
                if (string.IsNullOrWhiteSpace(qNoText))
                    continue;

                if (!int.TryParse(qNoText, out var questionNo))
                    return BadRequest(new { error = $"Dòng {row}: QuestionNo không hợp lệ." });

                var passageRaw = worksheet.Cells[row, 1].Text?.Trim();
                var titleFromExcel = worksheet.Cells[row, 12].Text?.Trim();
                var textContentTranslation = worksheet.Cells[row, 13].Text?.Trim();
                var passageTypeFromExcel = worksheet.Cells[row, 14].Text?.Trim();
                var questionType = worksheet.Cells[row, 3].Text?.Trim();
                var content = worksheet.Cells[row, 4].Text?.Trim();
                var answerA = worksheet.Cells[row, 5].Text?.Trim();
                var answerB = worksheet.Cells[row, 6].Text?.Trim();
                var answerC = worksheet.Cells[row, 7].Text?.Trim();
                var answerD = worksheet.Cells[row, 8].Text?.Trim();
                var correctOpt = worksheet.Cells[row, 9].Text?.Trim().ToUpperInvariant();
                var shortExplanation = worksheet.Cells[row, 10].Text?.Trim();
                var fullExplanation = worksheet.Cells[row, 11].Text?.Trim();

                if (!ValidLabels.Contains(correctOpt))
                    return BadRequest(new { error = $"Dòng {row}: đáp án đúng phải là A, B, C hoặc D." });

                if (new[] { answerA, answerB, answerC, answerD }.Any(string.IsNullOrWhiteSpace))
                    return BadRequest(new { error = $"Dòng {row}: phải có đủ 4 đáp án A, B, C, D." });

                var isNewPassage = !string.IsNullOrWhiteSpace(passageRaw) || currentPassage == null;
                if (isNewPassage)
                {
                    var title = !string.IsNullOrWhiteSpace(titleFromExcel)
                        ? titleFromExcel
                        : $"Part {partType} — Passage {importedPassages + 1}";
                    currentPassage = new ReadingPassage
                    {
                        TopicId = topic?.Id,
                        Title = title,
                        TextContent = passageRaw,
                        TextContentTranslation = textContentTranslation,
                        PassageType = !string.IsNullOrWhiteSpace(passageTypeFromExcel) ? passageTypeFromExcel : passageType,
                        ImageUrl = null,
                        PartType = partType,
                        Difficulty = difficultyValue,
                        DisplayOrder = importedPassages + 1,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.ReadingPassages.Add(currentPassage);
                    await _context.SaveChangesAsync();
                    importedPassages++;
                }

                if (currentPassage == null)
                    return BadRequest(new { error = $"Dòng {row}: không xác định được passage." });

                var question = new ReadingQuestion
                {
                    PassageId = currentPassage.Id,
                    QuestionNo = questionNo,
                    Content = string.IsNullOrWhiteSpace(content) ? $"Question {questionNo}" : content,
                    CorrectOption = correctOpt,
                    ShortExplanation = shortExplanation,
                    FullExplanation = fullExplanation,
                    QuestionType = questionType,
                    CreatedAt = DateTime.UtcNow
                };

                _context.ReadingQuestions.Add(question);
                await _context.SaveChangesAsync();

                _context.ReadingAnswers.AddRange(
                    new ReadingAnswer { ReadingQuestionId = question.Id, Label = "A", Content = answerA },
                    new ReadingAnswer { ReadingQuestionId = question.Id, Label = "B", Content = answerB },
                    new ReadingAnswer { ReadingQuestionId = question.Id, Label = "C", Content = answerC },
                    new ReadingAnswer { ReadingQuestionId = question.Id, Label = "D", Content = answerD }
                );

                importedQuestions++;
            }

            if (importedQuestions == 0)
                return BadRequest(new { error = "Không tìm thấy câu hỏi hợp lệ trong file Excel." });

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new
            {
                message = $"Import Reading Part {partType} thành công. Đã nhập {importedPassages} passages và {importedQuestions} câu hỏi.",
                importedPassages,
                importedQuestions
            });
        }
        catch (InvalidOperationException ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("passages")]
    public async Task<IActionResult> GetPassages(
        [FromQuery] int? partType,
        [FromQuery] bool activeOnly = true,
        [FromQuery] bool detail = false)
    {
        if (!await IsAdminAsync())
            return Forbid();

        var query = _context.ReadingPassages.AsNoTracking();

        if (partType is 6 or 7)
            query = query.Where(p => p.PartType == partType);

        if (activeOnly)
            query = query.Where(p => p.IsActive);

        query = query
            .OrderBy(p => p.PartType)
            .ThenBy(p => p.DisplayOrder)
            .ThenBy(p => p.Id);

        if (!detail)
        {
            var summary = await query.Select(p => new
            {
                p.Id,
                p.TopicId,
                p.Title,
                p.PartType,
                p.DisplayOrder,
                p.IsActive,
                p.CreatedAt,
                QuestionCount = p.Questions.Count
            }).ToListAsync();

            return Ok(summary);
        }

        var passages = await query
            .Include(p => p.Questions)
                .ThenInclude(q => q.Answers)
            .ToListAsync();

        return Ok(passages.Select(BuildAdminPassageResponse));
    }

    [HttpGet("passages/{id:int}")]
    public async Task<IActionResult> GetPassage(int id)
    {
        if (!await IsAdminAsync())
            return Forbid();

        var passage = await _context.ReadingPassages
            .AsNoTracking()
            .Include(p => p.Questions)
                .ThenInclude(q => q.Answers)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (passage == null)
            return NotFound(new { error = "Không tìm thấy passage." });

        return Ok(BuildAdminPassageResponse(passage));
    }

    [HttpGet("lessons")]
    public async Task<IActionResult> GetLessons(
        [FromQuery] string partType = "all",
        [FromQuery] string difficulty = "all")
    {
        var partFilter = ParsePartFilter(partType);
        if (partFilter == null && !IsAllFilter(partType))
            return BadRequest(new { error = "Part filter chỉ nhận all, 6 hoặc 7." });

        var difficultyFilter = ParseDifficultyFilter(difficulty);
        if (difficultyFilter == null && !IsAllFilter(difficulty))
            return BadRequest(new { error = "Difficulty chỉ nhận all, easy, medium hoặc hard." });

        var query = _context.ReadingPassages
            .AsNoTracking()
            .Include(p => p.Questions)
            .Where(p => p.IsActive && (p.PartType == 6 || p.PartType == 7));

        if (partFilter.HasValue)
            query = query.Where(p => p.PartType == partFilter.Value);

        if (!string.IsNullOrWhiteSpace(difficultyFilter))
            query = query.Where(p => p.Difficulty != null && p.Difficulty.ToLower() == difficultyFilter);

        var lessonPassages = await query
            .OrderBy(p => p.PartType)
            .ThenBy(p => p.Difficulty)
            .ThenBy(p => p.DisplayOrder)
            .ThenBy(p => p.Id)
            .ToListAsync();

        var lessons = lessonPassages.Select(p => new
            {
                p.Id,
                p.Title,
                p.PartType,
                p.Difficulty,
                QuestionCount = p.Questions.Count,
                ShortDescription = BuildShortDescription(p.TextContent)
            });

        return Ok(lessons);
    }

    [HttpGet("topics")]
    public async Task<IActionResult> GetTopics(
        [FromQuery] string partType = "all",
        [FromQuery] string difficulty = "all")
    {
        var partFilter = ParsePartFilter(partType);
        if (partFilter == null && !IsAllFilter(partType))
            return BadRequest(new { error = "Part filter chỉ nhận all, 6 hoặc 7." });

        var difficultyFilter = ParseDifficultyFilter(difficulty);
        if (difficultyFilter == null && !IsAllFilter(difficulty))
            return BadRequest(new { error = "Difficulty chỉ nhận all, easy, medium hoặc hard." });

        var query = _context.ReadingTopics
            .AsNoTracking()
            .Include(t => t.Passages.Where(p => p.IsActive))
                .ThenInclude(p => p.Questions)
            .Where(t => t.IsActive && (t.PartType == 6 || t.PartType == 7));

        if (partFilter.HasValue)
            query = query.Where(t => t.PartType == partFilter.Value);

        if (!string.IsNullOrWhiteSpace(difficultyFilter))
            query = query.Where(t => t.Difficulty != null && t.Difficulty.ToLower() == difficultyFilter);

        var topics = await query
            .OrderBy(t => t.PartType)
            .ThenBy(t => t.Difficulty)
            .ThenBy(t => t.DisplayOrder)
            .ThenBy(t => t.Id)
            .ToListAsync();

        return Ok(topics.Select(t => new
        {
            t.Id,
            t.Title,
            t.Description,
            t.PartType,
            t.Difficulty,
            t.DisplayOrder,
            PassageCount = t.Passages.Count,
            QuestionCount = t.Passages.Sum(p => p.Questions.Count)
        }));
    }

    [HttpGet("topics/{topicId:int}")]
    public async Task<IActionResult> GetTopic(int topicId)
    {
        var topic = await _context.ReadingTopics
            .AsNoTracking()
            .Include(t => t.Passages.Where(p => p.IsActive))
                .ThenInclude(p => p.Questions)
            .FirstOrDefaultAsync(t => t.Id == topicId && t.IsActive);

        if (topic == null)
            return NotFound(new { error = "Không tìm thấy topic Reading." });

        var passages = topic.Passages
            .OrderBy(p => p.DisplayOrder)
            .ThenBy(p => p.Id)
            .Select(p => new
            {
                p.Id,
                p.Title,
                p.PartType,
                p.Difficulty,
                p.DisplayOrder,
                QuestionCount = p.Questions.Count,
                ShortDescription = BuildShortDescription(p.TextContent)
            });

        return Ok(new
        {
            topic.Id,
            topic.Title,
            topic.Description,
            topic.PartType,
            topic.Difficulty,
            topic.DisplayOrder,
            PassageCount = topic.Passages.Count,
            QuestionCount = topic.Passages.Sum(p => p.Questions.Count),
            Passages = passages
        });
    }

    [HttpPost("topics")]
    public async Task<IActionResult> CreateTopic([FromBody] UpsertReadingTopicRequest request)
    {
        if (!await IsAdminAsync())
            return Forbid();

        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { error = "Title không được để trống." });

        if (request.PartType is not (6 or 7))
            return BadRequest(new { error = "PartType phải là 6 hoặc 7." });

        var difficulty = ParseDifficultyFilter(request.Difficulty);
        if (!IsAllFilter(request.Difficulty) && difficulty == null)
            return BadRequest(new { error = "Difficulty chỉ nhận easy, medium hoặc hard." });

        var topic = new ReadingTopic
        {
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            PartType = request.PartType,
            Difficulty = difficulty,
            DisplayOrder = request.DisplayOrder ?? 0,
            IsActive = request.IsActive ?? true,
            CreatedAt = DateTime.UtcNow
        };

        _context.ReadingTopics.Add(topic);
        await _context.SaveChangesAsync();

        return Ok(BuildTopicResponse(topic, passageCount: 0, questionCount: 0));
    }

    [HttpPost("topics/bulk")]
    public async Task<IActionResult> CreateTopicsBulk([FromBody] List<UpsertReadingTopicRequest> requests)
    {
        if (!await IsAdminAsync())
            return Forbid();

        if (requests == null || requests.Count == 0)
            return BadRequest(new { error = "Danh sách topic không được để trống." });

        if (requests.Count > 100)
            return BadRequest(new { error = "Chỉ được tạo tối đa 100 topic mỗi lần." });

        var topics = new List<ReadingTopic>();

        for (var index = 0; index < requests.Count; index++)
        {
            var request = requests[index];
            var row = index + 1;

            if (string.IsNullOrWhiteSpace(request.Title))
                return BadRequest(new { error = $"Topic #{row}: Title không được để trống." });

            if (request.PartType is not (6 or 7))
                return BadRequest(new { error = $"Topic #{row}: PartType phải là 6 hoặc 7." });

            var difficulty = ParseDifficultyFilter(request.Difficulty);
            if (!IsAllFilter(request.Difficulty) && difficulty == null)
                return BadRequest(new { error = $"Topic #{row}: Difficulty chỉ nhận easy, medium hoặc hard." });

            topics.Add(new ReadingTopic
            {
                Title = request.Title.Trim(),
                Description = request.Description?.Trim(),
                PartType = request.PartType,
                Difficulty = difficulty,
                DisplayOrder = request.DisplayOrder ?? index + 1,
                IsActive = request.IsActive ?? true,
                CreatedAt = DateTime.UtcNow
            });
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();

        _context.ReadingTopics.AddRange(topics);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            message = $"Đã tạo {topics.Count} topic Reading.",
            count = topics.Count,
            items = topics.Select(t => BuildTopicResponse(t, passageCount: 0, questionCount: 0))
        });
    }

    [HttpPut("topics/{topicId:int}")]
    public async Task<IActionResult> UpdateTopic(int topicId, [FromBody] UpsertReadingTopicRequest request)
    {
        if (!await IsAdminAsync())
            return Forbid();

        var topic = await _context.ReadingTopics.FindAsync(topicId);
        if (topic == null)
            return NotFound(new { error = "Không tìm thấy topic Reading." });

        if (!string.IsNullOrWhiteSpace(request.Title))
            topic.Title = request.Title.Trim();

        if (request.Description != null)
            topic.Description = request.Description.Trim();

        if (request.PartType is 6 or 7)
            topic.PartType = request.PartType;

        var difficulty = ParseDifficultyFilter(request.Difficulty);
        if (difficulty != null)
            topic.Difficulty = difficulty;
        else if (request.Difficulty != null && IsAllFilter(request.Difficulty))
            topic.Difficulty = null;
        else if (!string.IsNullOrWhiteSpace(request.Difficulty))
            return BadRequest(new { error = "Difficulty chỉ nhận easy, medium hoặc hard." });

        if (request.DisplayOrder.HasValue)
            topic.DisplayOrder = request.DisplayOrder.Value;

        if (request.IsActive.HasValue)
            topic.IsActive = request.IsActive.Value;

        await _context.SaveChangesAsync();

        var counts = await GetTopicCountsAsync(topic.Id);
        return Ok(BuildTopicResponse(topic, counts.PassageCount, counts.QuestionCount));
    }

    [HttpPatch("topics/{topicId:int}/toggle-active")]
    public async Task<IActionResult> ToggleTopicActive(int topicId)
    {
        if (!await IsAdminAsync())
            return Forbid();

        var topic = await _context.ReadingTopics.FindAsync(topicId);
        if (topic == null)
            return NotFound(new { error = "Không tìm thấy topic Reading." });

        topic.IsActive = !topic.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = topic.IsActive ? "Đã kích hoạt topic." : "Đã vô hiệu hóa topic.",
            topicId,
            isActive = topic.IsActive
        });
    }

    [HttpDelete("topics/{topicId:int}")]
    public async Task<IActionResult> DeleteTopic(int topicId)
    {
        if (!await IsAdminAsync())
            return Forbid();

        var topic = await _context.ReadingTopics.FirstOrDefaultAsync(t => t.Id == topicId);
        if (topic == null)
            return NotFound(new { error = "Không tìm thấy topic Reading." });

        await using var transaction = await _context.Database.BeginTransactionAsync();

        var passageIds = await _context.ReadingPassages
            .Where(p => p.TopicId == topicId)
            .Select(p => p.Id)
            .ToListAsync();

        var affectedSessionIds = await _context.ReadingSessionPassages
            .Where(sp => passageIds.Contains(sp.PassageId))
            .Select(sp => sp.SessionId)
            .Distinct()
            .ToListAsync();

        var readingQuestionIds = await _context.ReadingQuestions
            .Where(q => passageIds.Contains(q.PassageId))
            .Select(q => q.Id)
            .ToListAsync();

        if (affectedSessionIds.Count > 0)
        {
            var sessionAnswers = await _context.ReadingSessionAnswers
                .Where(a => affectedSessionIds.Contains(a.SessionId))
                .ToListAsync();
            _context.ReadingSessionAnswers.RemoveRange(sessionAnswers);

            var sessionPassages = await _context.ReadingSessionPassages
                .Where(sp => affectedSessionIds.Contains(sp.SessionId))
                .ToListAsync();
            _context.ReadingSessionPassages.RemoveRange(sessionPassages);

            var sessions = await _context.ReadingSessions
                .Where(s => affectedSessionIds.Contains(s.Id))
                .ToListAsync();
            _context.ReadingSessions.RemoveRange(sessions);
        }

        if (readingQuestionIds.Count > 0)
        {
            var readingAnswers = await _context.ReadingAnswers
                .Where(a => readingQuestionIds.Contains(a.ReadingQuestionId))
                .ToListAsync();
            _context.ReadingAnswers.RemoveRange(readingAnswers);

            var readingQuestions = await _context.ReadingQuestions
                .Where(q => passageIds.Contains(q.PassageId))
                .ToListAsync();
            _context.ReadingQuestions.RemoveRange(readingQuestions);
        }

        if (passageIds.Count > 0)
        {
            var passages = await _context.ReadingPassages
                .Where(p => passageIds.Contains(p.Id))
                .ToListAsync();
            _context.ReadingPassages.RemoveRange(passages);
        }

        _context.ReadingTopics.Remove(topic);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            message = "Đã xóa topic, passages, câu hỏi, đáp án và toàn bộ lịch sử session liên quan.",
            topicId,
            deletedPassages = passageIds.Count,
            deletedQuestions = readingQuestionIds.Count,
            deletedSessions = affectedSessionIds.Count
        });
    }

    [HttpDelete("topics/{topicId:int}/clear")]
    public async Task<IActionResult> ClearTopic(int topicId)
    {
        if (!await IsAdminAsync())
            return Forbid();

        var topic = await _context.ReadingTopics.FirstOrDefaultAsync(t => t.Id == topicId);
        if (topic == null)
            return NotFound(new { error = "Không tìm thấy topic Reading." });

        await using var transaction = await _context.Database.BeginTransactionAsync();

        var passageIds = await _context.ReadingPassages
            .Where(p => p.TopicId == topicId)
            .Select(p => p.Id)
            .ToListAsync();

        if (passageIds.Count == 0)
        {
            await transaction.CommitAsync();
            return Ok(new
            {
                message = "Topic không có passage nào để xóa.",
                topicId,
                deletedPassages = 0,
                deletedQuestions = 0,
                deletedSessions = 0
            });
        }

        var affectedSessionIds = await _context.ReadingSessionPassages
            .Where(sp => passageIds.Contains(sp.PassageId))
            .Select(sp => sp.SessionId)
            .Distinct()
            .ToListAsync();

        var readingQuestionIds = await _context.ReadingQuestions
            .Where(q => passageIds.Contains(q.PassageId))
            .Select(q => q.Id)
            .ToListAsync();

        if (affectedSessionIds.Count > 0)
        {
            var sessionAnswers = await _context.ReadingSessionAnswers
                .Where(a => affectedSessionIds.Contains(a.SessionId))
                .ToListAsync();
            _context.ReadingSessionAnswers.RemoveRange(sessionAnswers);

            var sessionPassages = await _context.ReadingSessionPassages
                .Where(sp => affectedSessionIds.Contains(sp.SessionId))
                .ToListAsync();
            _context.ReadingSessionPassages.RemoveRange(sessionPassages);

            var sessions = await _context.ReadingSessions
                .Where(s => affectedSessionIds.Contains(s.Id))
                .ToListAsync();
            _context.ReadingSessions.RemoveRange(sessions);
        }

        if (readingQuestionIds.Count > 0)
        {
            var readingAnswers = await _context.ReadingAnswers
                .Where(a => readingQuestionIds.Contains(a.ReadingQuestionId))
                .ToListAsync();
            _context.ReadingAnswers.RemoveRange(readingAnswers);

            var readingQuestions = await _context.ReadingQuestions
                .Where(q => passageIds.Contains(q.PassageId))
                .ToListAsync();
            _context.ReadingQuestions.RemoveRange(readingQuestions);
        }

        var passages = await _context.ReadingPassages
            .Where(p => passageIds.Contains(p.Id))
            .ToListAsync();
        _context.ReadingPassages.RemoveRange(passages);

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            message = "Đã xóa toàn bộ passage, câu hỏi, đáp án và lịch sử session trong topic (giữ nguyên topic).",
            topicId,
            deletedPassages = passageIds.Count,
            deletedQuestions = readingQuestionIds.Count,
            deletedSessions = affectedSessionIds.Count
        });
    }

    [HttpPut("passages/{id:int}")]
    public async Task<IActionResult> UpdatePassage(int id, [FromBody] UpdateReadingPassageRequest request)
    {
        if (!await IsAdminAsync())
            return Forbid();

        var passage = await _context.ReadingPassages.FindAsync(id);
        if (passage == null)
            return NotFound(new { error = "Không tìm thấy passage." });

        if (!string.IsNullOrWhiteSpace(request.Title))
            passage.Title = request.Title;
        if (!string.IsNullOrWhiteSpace(request.TextContent))
            passage.TextContent = request.TextContent;
        if (!string.IsNullOrWhiteSpace(request.TextContentTranslation))
            passage.TextContentTranslation = request.TextContentTranslation;
        if (!string.IsNullOrWhiteSpace(request.PassageType))
            passage.PassageType = request.PassageType;
        if (request.PartType is 6 or 7)
            passage.PartType = request.PartType.Value;
        if (request.TopicId.HasValue)
        {
            var topicExists = await _context.ReadingTopics.AnyAsync(t => t.Id == request.TopicId.Value && t.IsActive);
            if (!topicExists)
                return BadRequest(new { error = "Topic Reading không tồn tại hoặc đã bị vô hiệu hóa." });
            passage.TopicId = request.TopicId.Value;
        }
        if (request.DisplayOrder.HasValue)
            passage.DisplayOrder = request.DisplayOrder.Value;
        var difficulty = ParseDifficultyFilter(request.Difficulty);
        if (difficulty != null)
            passage.Difficulty = difficulty;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã cập nhật passage.", passageId = id });
    }

    [HttpDelete("passages/{id:int}")]
    public async Task<IActionResult> DeletePassage(int id)
    {
        if (!await IsAdminAsync())
            return Forbid();

        var passage = await _context.ReadingPassages.FirstOrDefaultAsync(p => p.Id == id);

        if (passage == null)
            return NotFound(new { error = "Không tìm thấy passage." });

        await using var transaction = await _context.Database.BeginTransactionAsync();

        var affectedSessionIds = await _context.ReadingSessionPassages
            .Where(sp => sp.PassageId == id)
            .Select(sp => sp.SessionId)
            .Distinct()
            .ToListAsync();

        var readingQuestionIds = await _context.ReadingQuestions
            .Where(q => q.PassageId == id)
            .Select(q => q.Id)
            .ToListAsync();

        if (affectedSessionIds.Count > 0)
        {
            var sessionAnswers = await _context.ReadingSessionAnswers
                .Where(a => affectedSessionIds.Contains(a.SessionId))
                .ToListAsync();
            _context.ReadingSessionAnswers.RemoveRange(sessionAnswers);

            var sessionPassages = await _context.ReadingSessionPassages
                .Where(sp => affectedSessionIds.Contains(sp.SessionId))
                .ToListAsync();
            _context.ReadingSessionPassages.RemoveRange(sessionPassages);

            var sessions = await _context.ReadingSessions
                .Where(s => affectedSessionIds.Contains(s.Id))
                .ToListAsync();
            _context.ReadingSessions.RemoveRange(sessions);
        }

        if (readingQuestionIds.Count > 0)
        {
            var readingAnswers = await _context.ReadingAnswers
                .Where(a => readingQuestionIds.Contains(a.ReadingQuestionId))
                .ToListAsync();
            _context.ReadingAnswers.RemoveRange(readingAnswers);

            var readingQuestions = await _context.ReadingQuestions
                .Where(q => q.PassageId == id)
                .ToListAsync();
            _context.ReadingQuestions.RemoveRange(readingQuestions);
        }

        _context.ReadingPassages.Remove(passage);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            message = "Đã xóa passage, câu hỏi, đáp án và toàn bộ lịch sử session liên quan.",
            passageId = id,
            deletedSessions = affectedSessionIds.Count,
            deletedQuestions = readingQuestionIds.Count
        });
    }

    [HttpPatch("passages/{id:int}/toggle-active")]
    public async Task<IActionResult> TogglePassageActive(int id)
    {
        if (!await IsAdminAsync())
            return Forbid();

        var passage = await _context.ReadingPassages.FindAsync(id);
        if (passage == null)
            return NotFound(new { error = "Không tìm thấy passage." });

        passage.IsActive = !passage.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new { message = passage.IsActive ? "Đã kích hoạt passage." : "Đã vô hiệu hóa passage.", passageId = id, isActive = passage.IsActive });
    }

    [HttpPost("start")]
    public async Task<IActionResult> Start([FromBody] StartReadingPracticeRequest request)
    {
        var userId = GetUserId();
        var allowedCounts = new[] { 3, 5, 10 };

        if (request.PassageId.HasValue)
        {
            await CancelOldInProgressSessionsAsync(userId);

            var selectedPassage = await _context.ReadingPassages
                .Include(p => p.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(p => p.Id == request.PassageId.Value && p.IsActive);

            if (selectedPassage == null)
                return NotFound(new { error = "Không tìm thấy bài Reading." });

            if (!IsValidPracticePassage(selectedPassage))
                return BadRequest(new { error = "Bài Reading này chưa đủ câu hỏi hoặc đáp án hợp lệ." });

            var lessonStartedAt = DateTime.UtcNow;
            var lessonSession = new ReadingSession
            {
                UserId = userId,
                TotalPassages = 1,
                TotalQuestions = selectedPassage.Questions.Count,
                CorrectAnswers = 0,
                TimeSpentSeconds = 0,
                StartedAt = lessonStartedAt,
                Status = "in_progress"
            };

            lessonSession.ReadingSessionPassages.Add(new ReadingSessionPassage
            {
                PassageId = selectedPassage.Id,
                Passage = selectedPassage,
                DisplayOrder = 1
            });

            _context.ReadingSessions.Add(lessonSession);
            await _context.SaveChangesAsync();

            return Ok(BuildSessionResponse(lessonSession, includeReview: false, canViewExplanation: false));
        }

        if (!allowedCounts.Contains(request.PassageCount))
            return BadRequest(new { error = "Số passage phải là 3, 5 hoặc 10." });

        var partFilter = ParsePartFilter(request.PartType);
        if (partFilter == null && !IsMixed(request.PartType))
            return BadRequest(new { error = "partType chỉ nhận 6, 7 hoặc mixed." });

        await CancelOldInProgressSessionsAsync(userId);

        var candidates = await _context.ReadingPassages
            .Include(p => p.Questions)
                .ThenInclude(q => q.Answers)
            .Where(p => p.IsActive && (partFilter == null || p.PartType == partFilter))
            .ToListAsync();

        var validPassages = candidates.Where(IsValidPracticePassage).ToList();
        if (validPassages.Count < request.PassageCount)
        {
            return BadRequest(new
            {
                error = $"Hiện chỉ có {validPassages.Count} passage hợp lệ, không đủ để tạo phiên {request.PassageCount} passage.",
                availablePassages = validPassages.Count,
                requestedPassages = request.PassageCount
            });
        }

        var passages = validPassages
            .OrderBy(_ => Guid.NewGuid())
            .Take(request.PassageCount)
            .ToList();

        await using var transaction = await _context.Database.BeginTransactionAsync();

        var now = DateTime.UtcNow;
        var session = new ReadingSession
        {
            UserId = userId,
            TotalPassages = passages.Count,
            TotalQuestions = passages.Sum(p => p.Questions.Count),
            CorrectAnswers = 0,
            TimeSpentSeconds = 0,
            StartedAt = now,
            Status = "in_progress"
        };

        var displayOrder = 1;
        foreach (var passage in passages)
        {
            session.ReadingSessionPassages.Add(new ReadingSessionPassage
            {
                PassageId = passage.Id,
                Passage = passage,
                DisplayOrder = displayOrder++
            });
        }

        _context.ReadingSessions.Add(session);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(BuildSessionResponse(session, includeReview: false, canViewExplanation: false));
    }

    [HttpGet("{sessionId:int}")]
    public async Task<IActionResult> GetSession(int sessionId)
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return Unauthorized();

        var session = await LoadSessionAsync(sessionId, user.Id);
        if (session == null)
            return NotFound(new { error = "Không tìm thấy phiên Reading." });

        var includeReview = session.Status == "completed";
        return Ok(BuildSessionResponse(session, includeReview, CanViewDetailedExplanation(user)));
    }

    [HttpGet("{sessionId:int}/result")]
    public async Task<IActionResult> GetResult(int sessionId)
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return Unauthorized();

        var session = await LoadSessionAsync(sessionId, user.Id);
        if (session == null)
            return NotFound(new { error = "Không tìm thấy phiên Reading." });

        if (session.Status != "completed")
            return BadRequest(new { error = "Phiên Reading chưa hoàn thành." });

        return Ok(BuildSessionResponse(session, includeReview: true, CanViewDetailedExplanation(user)));
    }

    [HttpPost("{sessionId:int}/answer")]
    public async Task<IActionResult> SubmitAnswer(int sessionId, [FromBody] ReadingAnswerRequest request)
    {
        var userId = GetUserId();
        if (request.ReadingQuestionId <= 0)
            return BadRequest(new { error = "ReadingQuestionId không hợp lệ." });

        var session = await _context.ReadingSessions
            .Include(s => s.ReadingSessionPassages)
                .ThenInclude(sp => sp.Passage)
                    .ThenInclude(p => p.Questions)
            .Include(s => s.ReadingSessionAnswers)
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

        if (session == null)
            return NotFound(new { error = "Không tìm thấy phiên Reading." });

        if (session.Status != "in_progress")
            return BadRequest(new { error = "Phiên Reading đã kết thúc, không thể sửa đáp án." });

        var selectedOption = request.SelectedOption?.Trim().ToUpperInvariant();
        if (string.IsNullOrWhiteSpace(selectedOption) || !ValidLabels.Contains(selectedOption))
            return BadRequest(new { error = "Đáp án phải là A, B, C hoặc D." });

        var sessionQuestionIds = session.ReadingSessionPassages
            .SelectMany(sp => sp.Passage.Questions)
            .Select(q => q.Id)
            .ToHashSet();

        if (!sessionQuestionIds.Contains(request.ReadingQuestionId))
            return BadRequest(new { error = "Câu hỏi không thuộc phiên Reading này." });

        var question = await _context.ReadingQuestions
            .Include(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == request.ReadingQuestionId);

        if (question == null)
            return NotFound(new { error = "Không tìm thấy câu hỏi Reading." });

        if (!question.Answers.Any(a => a.Label == selectedOption))
            return BadRequest(new { error = $"Câu hỏi này không có đáp án {selectedOption}." });

        var isCorrect = string.Equals(question.CorrectOption, selectedOption, StringComparison.OrdinalIgnoreCase);
        var existingAnswer = await _context.ReadingSessionAnswers
            .FirstOrDefaultAsync(a => a.SessionId == sessionId && a.ReadingQuestionId == request.ReadingQuestionId);

        if (existingAnswer == null)
        {
            _context.ReadingSessionAnswers.Add(new ReadingSessionAnswer
            {
                SessionId = sessionId,
                ReadingQuestionId = request.ReadingQuestionId,
                SelectedOption = selectedOption,
                IsCorrect = isCorrect,
                AnsweredAt = DateTime.UtcNow
            });
        }
        else
        {
            existingAnswer.SelectedOption = selectedOption;
            existingAnswer.IsCorrect = isCorrect;
            existingAnswer.AnsweredAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        session.CorrectAnswers = await _context.ReadingSessionAnswers.CountAsync(a => a.SessionId == sessionId && a.IsCorrect);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            saved = true,
            readingQuestionId = request.ReadingQuestionId,
            selectedOption,
            answeredAt = DateTime.UtcNow
        });
    }

    [HttpPost("{sessionId:int}/complete")]
    public async Task<IActionResult> Complete(int sessionId, [FromBody] CompleteReadingPracticeRequest? request)
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return Unauthorized();

        var session = await LoadSessionAsync(sessionId, user.Id);
        if (session == null)
            return NotFound(new { error = "Không tìm thấy phiên Reading." });

        if (session.Status == "completed")
            return BadRequest(new { error = "Phiên Reading này đã được nộp trước đó." });

        if (session.Status != "in_progress")
            return BadRequest(new { error = "Phiên Reading không còn ở trạng thái đang làm." });

        var questionIds = session.ReadingSessionPassages
            .SelectMany(sp => sp.Passage.Questions)
            .Select(q => q.Id)
            .ToHashSet();

        var answeredQuestionIds = session.ReadingSessionAnswers.Select(a => a.ReadingQuestionId).ToHashSet();
        var missingCount = questionIds.Count(id => !answeredQuestionIds.Contains(id));
        if (missingCount > 0)
            return BadRequest(new { error = $"Bạn còn {missingCount} câu chưa trả lời. Vui lòng hoàn thành trước khi nộp bài." });

        session.TotalQuestions = questionIds.Count;
        session.TotalPassages = session.ReadingSessionPassages.Count;
        session.CorrectAnswers = session.ReadingSessionAnswers.Count(a => a.IsCorrect);
        session.Status = "completed";
        session.CompletedAt = DateTime.UtcNow;
        session.TimeSpentSeconds = request?.TimeSpentSeconds ??
            Math.Max(0, (int)(DateTime.UtcNow - session.StartedAt).TotalSeconds);

        await _context.SaveChangesAsync();

        return Ok(BuildSessionResponse(session, includeReview: true, CanViewDetailedExplanation(user)));
    }

    [HttpPost("{sessionId:int}/cancel")]
    public async Task<IActionResult> Cancel(int sessionId)
    {
        var userId = GetUserId();
        var session = await _context.ReadingSessions.FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);
        if (session == null)
            return NotFound(new { error = "Không tìm thấy phiên Reading." });

        if (session.Status == "completed")
            return BadRequest(new { error = "Không thể hủy phiên đã nộp." });

        session.Status = "cancelled";
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã hủy phiên Reading.", sessionId });
    }

    [HttpDelete("cleanup")]
    public async Task<IActionResult> Cleanup([FromQuery] int olderThanHours = 24)
    {
        if (!await IsAdminAsync())
            return Forbid();

        olderThanHours = Math.Clamp(olderThanHours, 1, 720);
        var cutoff = DateTime.UtcNow.AddHours(-olderThanHours);
        var sessions = await _context.ReadingSessions
            .Where(s => s.Status == "in_progress" && s.StartedAt < cutoff)
            .ToListAsync();

        foreach (var session in sessions)
        {
            session.Status = "cancelled";
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = $"Đã cleanup {sessions.Count} phiên Reading cũ.", count = sessions.Count });
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? partType = null,
        [FromQuery] int? topicId = null,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null,
        [FromQuery] string sort = "newest")
    {
        var userId = GetUserId();
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var query = _context.ReadingSessions
            .AsNoTracking()
            .Where(s => s.UserId == userId && s.Status == "completed");

        if (from.HasValue)
            query = query.Where(s => s.CompletedAt >= from.Value);
        if (to.HasValue)
            query = query.Where(s => s.CompletedAt <= to.Value);
        if (partType is 6 or 7)
            query = query.Where(s => s.ReadingSessionPassages.Any(sp => sp.Passage.PartType == partType));
        if (topicId.HasValue)
            query = query.Where(s => s.ReadingSessionPassages.Any(sp => sp.Passage.TopicId == topicId.Value));

        query = sort.ToLowerInvariant() switch
        {
            "accuracy" => query.OrderByDescending(s => s.TotalQuestions > 0 ? (double)s.CorrectAnswers / s.TotalQuestions : 0),
            "oldest" => query.OrderBy(s => s.CompletedAt),
            _ => query.OrderByDescending(s => s.CompletedAt)
        };

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new
            {
                s.Id,
                s.TotalPassages,
                s.TotalQuestions,
                s.CorrectAnswers,
                Accuracy = s.TotalQuestions > 0
                    ? Math.Round((double)s.CorrectAnswers / s.TotalQuestions * 100, 1)
                    : 0,
                s.TimeSpentSeconds,
                s.StartedAt,
                s.CompletedAt,
                PartTypes = s.ReadingSessionPassages.Select(sp => sp.Passage.PartType).Distinct().OrderBy(p => p),
                TopicIds = s.ReadingSessionPassages
                    .Where(sp => sp.Passage.TopicId != null)
                    .Select(sp => sp.Passage.TopicId!.Value)
                    .Distinct()
                    .OrderBy(id => id)
            })
            .ToListAsync();

        return Ok(new
        {
            items,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(total / (double)pageSize)
        });
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var userId = GetUserId();
        var completed = _context.ReadingSessions
            .AsNoTracking()
            .Where(s => s.UserId == userId && s.Status == "completed");

        var totalSessions = await completed.CountAsync();
        var totalQuestions = await completed.SumAsync(s => s.TotalQuestions);
        var totalCorrect = await completed.SumAsync(s => s.CorrectAnswers);
        var totalTimeSeconds = await completed.SumAsync(s => s.TimeSpentSeconds);

        var partStats = await _context.ReadingSessionPassages
            .AsNoTracking()
            .Where(sp => sp.Session.UserId == userId && sp.Session.Status == "completed")
            .SelectMany(sp => sp.Passage.Questions.Select(q => new
            {
                sp.Passage.PartType,
                IsCorrect = sp.Session.ReadingSessionAnswers.Any(a => a.ReadingQuestionId == q.Id && a.IsCorrect)
            }))
            .GroupBy(x => x.PartType)
            .Select(g => new
            {
                PartType = g.Key,
                TotalQuestions = g.Count(),
                CorrectAnswers = g.Count(x => x.IsCorrect),
                Accuracy = g.Count() > 0 ? Math.Round((double)g.Count(x => x.IsCorrect) / g.Count() * 100, 1) : 0
            })
            .OrderBy(x => x.PartType)
            .ToListAsync();

        return Ok(new
        {
            totalSessions,
            totalQuestions,
            totalCorrect,
            accuracy = totalQuestions > 0
                ? Math.Round((double)totalCorrect / totalQuestions * 100, 1)
                : 0,
            totalTimeSeconds,
            activePassages = await _context.ReadingPassages.CountAsync(p => p.IsActive),
            partStats
        });
    }

    private async Task CancelOldInProgressSessionsAsync(int userId)
    {
        var oldSessions = await _context.ReadingSessions
            .Where(s => s.UserId == userId && s.Status == "in_progress")
            .ToListAsync();

        foreach (var oldSession in oldSessions)
        {
            oldSession.Status = "cancelled";
        }

        if (oldSessions.Count > 0)
            await _context.SaveChangesAsync();
    }

    private async Task<ReadingSession?> LoadSessionAsync(int sessionId, int userId)
    {
        return await _context.ReadingSessions
            .Include(s => s.ReadingSessionPassages)
                .ThenInclude(sp => sp.Passage)
                    .ThenInclude(p => p.Questions)
                        .ThenInclude(q => q.Answers)
            .Include(s => s.ReadingSessionAnswers)
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);
    }

    private static int? ParsePartFilter(string? partType)
    {
        var normalized = partType?.Trim().ToLowerInvariant();
        return normalized switch
        {
            "6" or "part6" => 6,
            "7" or "part7" => 7,
            _ => null
        };
    }

    private static bool IsMixed(string? partType)
    {
        return string.IsNullOrWhiteSpace(partType) ||
            string.Equals(partType, "mixed", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(partType, "all", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsAllFilter(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ||
            string.Equals(value, "all", StringComparison.OrdinalIgnoreCase);
    }

    private static string? ParseDifficultyFilter(string? difficulty)
    {
        var normalized = difficulty?.Trim().ToLowerInvariant();
        return normalized switch
        {
            "easy" => "easy",
            "medium" => "medium",
            "hard" => "hard",
            _ => null
        };
    }

    private static string? BuildShortDescription(string? html)
    {
        if (string.IsNullOrWhiteSpace(html))
            return null;

        var text = Regex.Replace(html, "<.*?>", " ");
        text = Regex.Replace(text, "\\s+", " ").Trim();
        return text.Length <= 160 ? text : text[..160] + "...";
    }

    private async Task<(int PassageCount, int QuestionCount)> GetTopicCountsAsync(int topicId)
    {
        var passages = await _context.ReadingPassages
            .AsNoTracking()
            .Where(p => p.TopicId == topicId)
            .Select(p => new { QuestionCount = p.Questions.Count })
            .ToListAsync();

        return (passages.Count, passages.Sum(p => p.QuestionCount));
    }

    private static object BuildTopicResponse(ReadingTopic topic, int passageCount, int questionCount)
    {
        return new
        {
            topic.Id,
            topic.Title,
            topic.Description,
            topic.PartType,
            topic.Difficulty,
            topic.DisplayOrder,
            topic.IsActive,
            topic.CreatedAt,
            PassageCount = passageCount,
            QuestionCount = questionCount
        };
    }

    private static bool IsValidPracticePassage(ReadingPassage passage)
    {
        if (passage.PartType is not (6 or 7))
            return false;

        if (!passage.Questions.Any())
            return false;

        return passage.Questions.All(q =>
        {
            var labels = q.Answers
                .Where(a => !string.IsNullOrWhiteSpace(a.Label) && !string.IsNullOrWhiteSpace(a.Content))
                .Select(a => a.Label!.Trim().ToUpperInvariant())
                .ToHashSet();

            var correctOption = q.CorrectOption?.Trim().ToUpperInvariant();
            return ValidLabels.All(labels.Contains) && correctOption != null && ValidLabels.Contains(correctOption) && labels.Contains(correctOption);
        });
    }

    private static bool CanViewDetailedExplanation(User user)
    {
        if (string.Equals(user.Role, "Admin", StringComparison.OrdinalIgnoreCase))
            return true;

        return user.IsPremium == true &&
            (!user.PremiumExpiredAt.HasValue || user.PremiumExpiredAt.Value > DateTime.UtcNow);
    }

    private static object BuildAdminPassageResponse(ReadingPassage passage)
    {
        return new
        {
            passage.Id,
            passage.TopicId,
            passage.Title,
            passage.TextContent,
            passage.ImageUrl,
            passage.TextContentTranslation,
            passage.PassageType,
            passage.PartType,
            passage.Difficulty,
            passage.DisplayOrder,
            passage.IsActive,
            passage.CreatedAt,
            Questions = passage.Questions.OrderBy(q => q.QuestionNo).Select(q => new
            {
                q.Id,
                q.QuestionNo,
                q.Content,
                q.QuestionType,
                q.CorrectOption,
                q.ShortExplanation,
                q.FullExplanation,
                Answers = q.Answers.OrderBy(a => a.Label).Select(a => new
                {
                    a.Id,
                    a.Label,
                    a.Content
                })
            })
        };
    }

    private static object BuildSessionResponse(ReadingSession session, bool includeReview, bool canViewExplanation)
    {
        var selectedAnswers = session.ReadingSessionAnswers
            .ToDictionary(a => a.ReadingQuestionId, a => a.SelectedOption);

        var passages = session.ReadingSessionPassages
            .OrderBy(sp => sp.DisplayOrder)
            .Select(sp => new
            {
                sp.Passage.Id,
                sp.Passage.Title,
                sp.Passage.TextContent,
                sp.Passage.ImageUrl,
                sp.Passage.TextContentTranslation,
                sp.Passage.PassageType,
                sp.Passage.PartType,
                sp.Passage.Difficulty,
                sp.DisplayOrder,
                Questions = sp.Passage.Questions
                    .OrderBy(q => q.QuestionNo)
                    .Select(q => new
                    {
                        q.Id,
                        q.QuestionNo,
                        q.Content,
                        q.QuestionType,
                        CorrectOption = includeReview ? q.CorrectOption : null,
                        IsCorrect = includeReview && selectedAnswers.TryGetValue(q.Id, out var selectedForCorrect)
                            ? string.Equals(selectedForCorrect, q.CorrectOption, StringComparison.OrdinalIgnoreCase)
                            : (bool?)null,
                        ShortExplanation = includeReview && canViewExplanation ? q.ShortExplanation : null,
                        FullExplanation = includeReview && canViewExplanation ? q.FullExplanation : null,
                        ExplanationLocked = includeReview && !canViewExplanation,
                        SelectedOption = selectedAnswers.TryGetValue(q.Id, out var selected) ? selected : null,
                        Answers = q.Answers
                            .OrderBy(a => a.Label)
                            .Select(a => new
                            {
                                a.Id,
                                a.Label,
                                a.Content
                            })
                    })
            });

        return new
        {
            SessionId = session.Id,
            session.Status,
            session.TotalPassages,
            session.TotalQuestions,
            session.CorrectAnswers,
            Accuracy = session.TotalQuestions > 0
                ? Math.Round((double)session.CorrectAnswers / session.TotalQuestions * 100, 1)
                : 0,
            session.TimeSpentSeconds,
            session.StartedAt,
            session.CompletedAt,
            CanViewExplanation = canViewExplanation,
            Passages = passages
        };
    }
}

public class StartReadingPracticeRequest
{
    public int PassageCount { get; set; } = 3;

    public string? PartType { get; set; } = "mixed";

    public int? PassageId { get; set; }
}

public class UpsertReadingTopicRequest
{
    public string? Title { get; set; }

    public string? Description { get; set; }

    public int PartType { get; set; }

    public string? Difficulty { get; set; }

    public int? DisplayOrder { get; set; }

    public bool? IsActive { get; set; }
}

public class ReadingAnswerRequest
{
    public int ReadingQuestionId { get; set; }

    public string? SelectedOption { get; set; }
}

public class UpdateReadingPassageRequest
{
    public int? TopicId { get; set; }
    public string? Title { get; set; }
    public string? TextContent { get; set; }
    public string? TextContentTranslation { get; set; }
    public string? PassageType { get; set; }
    public int? PartType { get; set; }
    public string? Difficulty { get; set; }
    public int? DisplayOrder { get; set; }
}

public class CompleteReadingPracticeRequest
{
    public int? TimeSpentSeconds { get; set; }
}
