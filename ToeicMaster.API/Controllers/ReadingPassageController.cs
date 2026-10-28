using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using Microsoft.AspNetCore.Authorization;
namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/reading-practice")]
[Authorize]
public class ReadingPassageController : ReadingPracticeBaseController
{
    public ReadingPassageController(AppDbContext context) : base(context) { }

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
            .AsSplitQuery()
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
            .AsSplitQuery()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (passage == null)
            return NotFound(new { error = "Không tìm thấy passage." });

        return Ok(BuildAdminPassageResponse(passage));
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
