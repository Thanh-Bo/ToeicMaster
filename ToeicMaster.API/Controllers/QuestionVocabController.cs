using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models;
using ToeicMaster.API.Services;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class QuestionVocabController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPremiumService _premiumService;

    public QuestionVocabController(AppDbContext context, IPremiumService premiumService)
    {
        _context = context;
        _premiumService = premiumService;
    }

    private int? GetUserIdOrNull()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdStr, out var userId) ? userId : null;
    }

    private async Task<bool> IsPremiumUserAsync(int? userId)
    {
        return await _premiumService.IsPremiumUserAsync(userId);
    }

    /// <summary>
    /// Generate AI explanation for a QuestionVocab
    /// </summary>
    [HttpPost("{questionVocabId}/generate-explanation")]
    public async Task<IActionResult> GenerateExplanation(
        int questionVocabId,
        [FromServices] AiExplanationService aiService)
    {
        // Fetch the QuestionVocab with its answers
        var questionVocab = await _context.QuestionVocab
            .Include(q => q.Answers)
            .Include(q => q.Topic)
            .FirstOrDefaultAsync(q => q.Id == questionVocabId);

        if (questionVocab == null)
            return NotFound(new { error = "Câu hỏi vocabulary không tồn tại" });

        var canViewExplanation = !questionVocab.Topic.IsExplanationPremiumRequired ||
                                 await IsPremiumUserAsync(GetUserIdOrNull());

        if (!canViewExplanation)
            return StatusCode(403, new { error = "Premium required", explanationLocked = true });

        try
        {
            // Build options list from the answers
            var options = questionVocab.Answers
                .OrderBy(a => a.Label)
                .Select(a => a.Content ?? "")
                .ToList();

            // Generate explanation using AI service
            var (shortExplanation, fullExplanation) = await aiService
                .GenerateVocabularyExplanationAsync(
                    questionVocab.Content ?? "",
                    options,
                    questionVocab.CorrectOption ?? ""
                );

            // Update the database with the explanations
            questionVocab.ShortExplanation = shortExplanation;
            questionVocab.LongExplanation = fullExplanation;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                questionVocabId = questionVocab.Id,
                content = questionVocab.Content,
                correctOption = questionVocab.CorrectOption,
                shortExplanation,
                fullExplanation
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Lỗi khi tạo giải thích", details = ex.Message });
        }
    }

    /// <summary>
    /// Get a QuestionVocab with all its data
    /// </summary>
    [HttpGet("{questionVocabId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetQuestionVocab(int questionVocabId)
    {
        var questionVocab = await _context.QuestionVocab
            .Include(q => q.Answers)
            .Include(q => q.Topic)
            .FirstOrDefaultAsync(q => q.Id == questionVocabId);

        if (questionVocab == null)
            return NotFound(new { error = "Câu hỏi vocabulary không tồn tại" });

        var canViewExplanation = !questionVocab.Topic.IsExplanationPremiumRequired ||
                                 await IsPremiumUserAsync(GetUserIdOrNull());

        var answers = questionVocab.Answers
            .OrderBy(a => a.Label)
            .Select(a => new
            {
                label = a.Label,
                content = a.Content,
                isCorrect = a.IsCorrect
            })
            .ToList();

        return Ok(new
        {
            id = questionVocab.Id,
            topicId = questionVocab.TopicId,
            topicTitle = questionVocab.Topic?.Title,
            questionNo = questionVocab.QuestionNo,
            content = questionVocab.Content,
            correctOption = questionVocab.CorrectOption,
            shortExplanation = canViewExplanation ? questionVocab.ShortExplanation : null,
            longExplanation = canViewExplanation ? questionVocab.LongExplanation : null,
            explanationLocked = !canViewExplanation,
            answers = answers
        });
    }

    /// <summary>
    /// Get QuestionVocab list by Topic
    /// </summary>
    [HttpGet("topic/{topicId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetQuestionVocabByTopic(
        int topicId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var topic = await _context.Topics
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == topicId);

        if (topic == null)
            return NotFound(new { error = "Topic không tồn tại" });

        var canViewExplanation = !topic.IsExplanationPremiumRequired ||
                                 await IsPremiumUserAsync(GetUserIdOrNull());

        var query = _context.QuestionVocab
            .Where(q => q.TopicId == topicId);

        var total = await query.CountAsync();

        var questions = await query
            .Include(q => q.Answers)
            .OrderBy(q => q.QuestionNo)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(q => new
            {
                id = q.Id,
                questionNo = q.QuestionNo,
                content = q.Content,
                correctOption = q.CorrectOption,
                shortExplanation = canViewExplanation ? q.ShortExplanation : null,
                longExplanation = canViewExplanation ? q.LongExplanation : null,
                explanationLocked = !canViewExplanation,
                hasExplanation = !string.IsNullOrEmpty(q.ShortExplanation),
                answers = q.Answers.OrderBy(a => a.Label).Select(a => new
                {
                    label = a.Label,
                    content = a.Content
                }).ToList()
            })
            .ToListAsync();

        return Ok(new
        {
            items = questions,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(total / (double)pageSize)
        });
    }

    /// <summary>
    /// Import QuestionVocab from Excel file for a Topic
    /// </summary>
    [HttpPost("topic/{topicId}/import")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ImportQuestions(
        int topicId,
        IFormFile file)
    {
        try
        {
            // Validate file
            if (file == null || file.Length == 0)
                return BadRequest(new { error = "Vui lòng upload file Excel" });

            if (!file.FileName.EndsWith(".xlsx", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { error = "File phải có định dạng .xlsx" });

            // Check if topic exists
            var topicExists = await _context.Topics.AnyAsync(t => t.Id == topicId);
            if (!topicExists)
                return NotFound(new { error = "Topic không tồn tại" });

            var questions = new List<ImportQuestionVocabRequest>();
            var errors = new List<string>();

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                using (var package = new OfficeOpenXml.ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets[0];
                    if (worksheet == null)
                        return BadRequest(new { error = "File Excel không có worksheet" });

                    var rowCount = worksheet.Dimension?.Rows ?? 0;
                    if (rowCount < 2)
                        return BadRequest(new { error = "File Excel không có dữ liệu" });

                    // Expected columns: Content, OptionA, OptionB, OptionC, OptionD, CorrectOption, ShortExplanation, LongExplanation
                    for (int row = 2; row <= rowCount; row++)
                    {
                        try
                        {
                            var content = worksheet.Cells[row, 1].Text?.Trim();
                            var optionA = worksheet.Cells[row, 2].Text?.Trim();
                            var optionB = worksheet.Cells[row, 3].Text?.Trim();
                            var optionC = worksheet.Cells[row, 4].Text?.Trim();
                            var optionD = worksheet.Cells[row, 5].Text?.Trim();
                            var correctOption = worksheet.Cells[row, 6].Text?.Trim().ToUpper();
                            var shortExp = worksheet.Cells[row, 7].Text?.Trim();
                            var longExp = worksheet.Cells[row, 8].Text?.Trim();

                            if (string.IsNullOrEmpty(content))
                            {
                                errors.Add($"Dòng {row}: Nội dung câu hỏi trống");
                                continue;
                            }

                            if (string.IsNullOrEmpty(optionA) || string.IsNullOrEmpty(optionB) || 
                                string.IsNullOrEmpty(optionC) || string.IsNullOrEmpty(optionD))
                            {
                                errors.Add($"Dòng {row}: Thiếu đáp án A/B/C/D");
                                continue;
                            }

                            if (string.IsNullOrEmpty(correctOption) || !new[] { "A", "B", "C", "D" }.Contains(correctOption))
                            {
                                errors.Add($"Dòng {row}: Đáp án đúng phải là A, B, C hoặc D");
                                continue;
                            }

                            questions.Add(new ImportQuestionVocabRequest
                            {
                                Content = content,
                                CorrectOption = correctOption,
                                ShortExplanation = shortExp,
                                LongExplanation = longExp,
                                Answers = new List<ImportQuestionVocabAnswerRequest>
                                {
                                    new() { Label = "A", Content = optionA },
                                    new() { Label = "B", Content = optionB },
                                    new() { Label = "C", Content = optionC },
                                    new() { Label = "D", Content = optionD }
                                }
                            });
                        }
                        catch (Exception ex)
                        {
                            errors.Add($"Dòng {row}: {ex.Message}");
                        }
                    }
                }
            }

            if (!questions.Any())
                return BadRequest(new { error = "Không có câu hỏi hợp lệ trong file Excel", errors });

            // Get current max question number for this topic
            var maxQuestionNo = await _context.QuestionVocab
                .Where(q => q.TopicId == topicId)
                .MaxAsync(q => (int?)q.QuestionNo) ?? 0;

            int successCount = 0;
            var importErrors = new List<string>();

            foreach (var q in questions)
            {
                try
                {
                    maxQuestionNo++;

                    var questionVocab = new QuestionVocab
                    {
                        TopicId = topicId,
                        QuestionNo = maxQuestionNo,
                        Content = q.Content,
                        CorrectOption = q.CorrectOption,
                        ShortExplanation = q.ShortExplanation,
                        LongExplanation = q.LongExplanation
                    };

                    // Add answers
                    foreach (var ans in q.Answers)
                    {
                        questionVocab.Answers.Add(new QuestionVocabAnswer
                        {
                            Label = ans.Label,
                            Content = ans.Content,
                            IsCorrect = ans.Label == q.CorrectOption
                        });
                    }

                    _context.QuestionVocab.Add(questionVocab);
                    successCount++;
                }
                catch (Exception ex)
                {
                    importErrors.Add($"Lỗi import câu hỏi: {ex.Message}");
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Import thành công {successCount} câu hỏi" + (importErrors.Any() ? $", lỗi {importErrors.Count} câu" : ""),
                topicId,
                successCount,
                errorCount = importErrors.Count,
                errors = importErrors.Any() ? importErrors : null,
                parseErrors = errors.Any() ? errors : null
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Lỗi import câu hỏi", details = ex.Message });
        }
    }

    /// <summary>
    /// Delete a single QuestionVocab by ID
    /// </summary>
    [HttpDelete("{questionVocabId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteQuestionVocab(int questionVocabId)
    {
        var questionVocab = await _context.QuestionVocab
            .FirstOrDefaultAsync(q => q.Id == questionVocabId);

        if (questionVocab == null)
            return NotFound(new { error = "Câu hỏi vocabulary không tồn tại" });

        // Remove the question (Answers will be cascade deleted by DB)
        _context.QuestionVocab.Remove(questionVocab);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã xóa câu hỏi thành công", questionVocabId });
    }

    /// <summary>
    /// Delete all QuestionVocab in a Topic
    /// </summary>
    [HttpDelete("topic/{topicId}/delete-all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAllQuestionsByTopic(int topicId)
    {
        // Check if topic exists
        var topicExists = await _context.Topics.AnyAsync(t => t.Id == topicId);
        if (!topicExists)
            return NotFound(new { error = "Topic không tồn tại" });

        // Get count before deletion
        var countToDelete = await _context.QuestionVocab
            .Where(q => q.TopicId == topicId)
            .CountAsync();

        if (countToDelete == 0)
            return Ok(new { message = "Không có câu hỏi nào để xóa", deletedCount = 0 });

        // Delete all questions in the topic (Answers will be cascade deleted)
        await _context.QuestionVocab
            .Where(q => q.TopicId == topicId)
            .ExecuteDeleteAsync();

        return Ok(new 
        { 
            message = $"Đã xóa {countToDelete} câu hỏi thành công", 
            deletedCount = countToDelete,
            topicId 
        });
    }
}
