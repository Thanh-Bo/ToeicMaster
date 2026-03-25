using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models;
using OfficeOpenXml;
namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Roles = "Admin")]
public class ImportController : ControllerBase
{
    private readonly AppDbContext _context;

    public ImportController(AppDbContext context)
    {
        _context = context;
    }


    /// <summary>
        /// <summary>
        /// Import Vocabulary Questions from Excel file for a Topic
        /// Excel columns: QuestionNo, Content, OptionA, OptionB, OptionC, OptionD, CorrectOption, ShortExplanation, LongExplanation
        /// </summary>
[HttpPost("topics/{topicId}/import-vocab")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> ImportQuestionVocabFromExcel(int topicId, IFormFile file)
{
    if (file == null || file.Length == 0)
        return BadRequest("No file provided");

    // Verify topic exists
    var topic = await _context.Topics.FindAsync(topicId);
    if (topic == null)
        return BadRequest("Topic not found");

    try
    {
        int importedCount = 0;

        // Read Excel file
        using (var stream = new MemoryStream())
        {
            await file.CopyToAsync(stream);
            using (var package = new ExcelPackage(stream))
            {
                var worksheet = package.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension?.Rows ?? 0;

                if (rowCount < 2)
                    return BadRequest("Excel file is empty");

                // Start from row 2 (skip header)
                for (int row = 2; row <= rowCount; row++)
                {
                    var questionNo = worksheet.Cells[row, 1].Value?.ToString();
                    var content = worksheet.Cells[row, 2].Value?.ToString();
                    var optionA = worksheet.Cells[row, 3].Value?.ToString();
                    var optionB = worksheet.Cells[row, 4].Value?.ToString();
                    var optionC = worksheet.Cells[row, 5].Value?.ToString();
                    var optionD = worksheet.Cells[row, 6].Value?.ToString();
                    var correctOption = worksheet.Cells[row, 7].Value?.ToString();
                    var shortExplanation = worksheet.Cells[row, 8].Value?.ToString();
                    var longExplanation = worksheet.Cells[row, 9].Value?.ToString();

                    if (string.IsNullOrWhiteSpace(content))
                        continue;

                    // Check if question already exists
                    var qNo = int.TryParse(questionNo, out var parsed) ? parsed : row - 1;
                    var existingQuestion = await _context.Questions
                        .FirstOrDefaultAsync(qst => qst.TopicId == topicId && qst.QuestionNo == qNo);

                    if (existingQuestion != null)
                        continue;

                    // Create question
                    var question = new QuestionVocab
                    {
                        TopicId = topicId,
                        QuestionNo = qNo,
                        Content = content,
                        CorrectOption = correctOption?.ToUpper() ?? "A",
                        ShortExplanation = shortExplanation,
                        LongExplanation = longExplanation
                    };

                    _context.QuestionVocab.Add(question);
                    await _context.SaveChangesAsync();

                    // Add answer options
                    var options = new[] 
                    { 
                        ("A", optionA), 
                        ("B", optionB), 
                        ("C", optionC), 
                        ("D", optionD) 
                    };

                    foreach (var (label, content_answer) in options)
                    {
                        if (!string.IsNullOrWhiteSpace(content_answer))
                        {
                            var answer = new QuestionVocabAnswer
                            {
                                QuestionVocabId = question.Id,
                                Label = label,
                                Content = content_answer,
                                IsCorrect = label.Equals(correctOption, StringComparison.OrdinalIgnoreCase)
                            };
                            _context.QuestionVocabAnswer.Add(answer);
                        }
                    }

                    await _context.SaveChangesAsync();
                    importedCount++;
                }
            }
        }

        return Ok(new
        {
            message = $"Imported {importedCount} vocabulary questions for Topic {topicId}",
            totalImported = importedCount,
            topicId,
            topicName = topic.Title
        });
    }
    catch (Exception ex)
    {
        return BadRequest(new { error = ex.Message });
    }
}

    /// <summary>
    /// Get Questions cho Topic
    /// </summary>
    [HttpGet("topics/{topicId}/question-vocab")]
    [AllowAnonymous]
    public async Task<IActionResult> GetQuestionVocabForTopic(int topicId)
    {
        // Verify topic exists
        var topic = await _context.Topics.FindAsync(topicId);
        if (topic == null)
            return NotFound("Topic not found");

        var questions = await _context.QuestionVocab
            .Where(q => q.TopicId == topicId)
            .Include(q => q.Answers)
            .Select(q => new
            {
                id = q.Id,
                questionNo = q.QuestionNo,
                content = q.Content,
                options = q.Answers.OrderBy(a => a.Label).Select(a => new
                {
                    label = a.Label,
                    content = a.Content
                }).ToList(),
                correctOption = q.Answers.Where(a => a.IsCorrect == true).Select(a => a.Label).FirstOrDefault() ?? "A",
                shortExplanation = q.ShortExplanation,
                longExplanation = q.LongExplanation
            })
            .OrderBy(q => q.questionNo)
            .ToListAsync();

        if (questions.Count == 0)
            return NotFound("No vocabulary questions found for this topic");

        return Ok(new
        {
            topicId,
            topicName = topic.Title,
            totalQuestions = questions.Count,
            questions
        });
    }
    [HttpPost("topics/{topicId}/test-results")]
    [Authorize]
    public async Task<IActionResult> SubmitTestResults(
    int topicId,
    [FromBody] SubmitTestResultsRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var now = DateTime.UtcNow;

        try
        {
            // Lấy tất cả từ của topic này của user
            var userVocabularies = await _context.UserVocabularies
                .Where(uv => uv.UserId == userId &&
                       uv.Vocabulary.TopicId == topicId)
                .ToListAsync();

            // Nếu điểm >= 50% → Level up
            if (request.Score >= 50)
            {
                foreach (var uv in userVocabularies)
                {
                    if (uv.Level < 5) // Không vượt quá level 5
                    {
                        uv.Level += 1;
                        uv.NextReviewAt = CalculateNextReviewDate(uv.Level, true);
                        uv.LastReviewedAt = now;
                        uv.ReviewCount += 1;
                    }
                }
            }
           

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Test results saved",
                newLevel = userVocabularies.Max(uv => (int?)uv.Level) ?? 0,
                score = request.Score
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    private DateTime CalculateNextReviewDate(int level, bool isCorrect)
    {
        var now = DateTime.UtcNow;

        // Nếu trả lời sai -> reset
        if (!isCorrect)
            return now; // Ôn lại ngay

        // Nếu trả lời đúng -> tính theo level
        return level switch
        {
            1 => now.AddDays(1),      // 1 ngày
            2 => now.AddDays(3),      // 3 ngày
            3 => now.AddDays(7),      // 7 ngày
            4 => now.AddDays(14),     // 14 ngày
            5 => now.AddDays(30),     // 30 ngày
            _ => now.AddDays(1)       // Default: 1 ngày
        };
    }


    /// <summary>
    /// Xóa toàn bộ câu hỏi thuộc 1 Topic (Dùng để dọn dẹp trước khi Import lại)
    /// </summary>
    [HttpDelete("topics/{topicId}/questions")]
    [Authorize(Roles = "Admin")] // Nên giới hạn quyền Admin
    public async Task<IActionResult> DeleteQuestionsByTopic(int topicId)
    {
        try
        {
            // 1. Kiểm tra xem Topic có tồn tại không (Optional)
            var topicExists = await _context.Topics.AnyAsync(t => t.Id == topicId);
            if (!topicExists) return NotFound("Topic not found");

            // 2. Tìm danh sách ID câu hỏi thuộc Topic này
            // (Lấy cả QuestionVocab hoặc bất kỳ loại nào gắn với TopicId này)
            var questionIds = await _context.Questions
                .Where(q => q.TopicId == topicId)
                .Select(q => q.Id)
                .ToListAsync();

            if (!questionIds.Any())
            {
                return Ok(new { message = "Topic này chưa có câu hỏi nào để xóa." });
            }

            // 3. Xóa Bảng Con (Answers) trước - Dùng ExecuteDeleteAsync cho nhanh
            await _context.Answers
                .Where(a => questionIds.Contains(a.QuestionId))
                .ExecuteDeleteAsync();

            // 4. Xóa Bảng Cha (Questions)
            await _context.Questions
                .Where(q => q.TopicId == topicId)
                .ExecuteDeleteAsync();

            // 5. (Tùy chọn) Xóa luôn QuestionGroup rác nếu nó được tạo tự động cho Topic này
            // Logic dựa trên naming convention lúc Import: $"Topic_{topicId}_QuestionVocab"
            await _context.QuestionGroups
                .Where(g => g.TextContent == $"Topic_{topicId}_QuestionVocab")
                .ExecuteDeleteAsync();

            return Ok(new
            {
                message = $"Đã xóa sạch {questionIds.Count} câu hỏi và các đáp án liên quan của Topic {topicId}."
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

/// <summary>
/// DTO để import Vocabulary Questions cho Topic
/// </summary>
public class QuestionVocabImportDto
{
    public List<QuestionVocabDto> Questions { get; set; } = new();
}

public class QuestionVocabDto
{
    public int QuestionNo { get; set; }
    public string Content { get; set; } = string.Empty;
    public string CorrectOption { get; set; } = string.Empty; // "A", "B", "C", "D"
    public List<string> Options { get; set; } = new(); // [A, B, C, D]
    public string? ShortExplanation { get; set; }
    public string? LongExplanation { get; set; }
}
