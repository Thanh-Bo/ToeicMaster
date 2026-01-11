using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models;

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


    /// </summary>
    [HttpPost("topics/{topicId}/part5")]
    public async Task<IActionResult> ImportPart5QuestionsForTopic(int topicId, [FromBody] Part5ImportTopicDto importData)
    {
        if (importData?.Questions == null || importData.Questions.Count == 0)
            return BadRequest("No questions provided");

        // Verify topic exists
        var topic = await _context.Topics.FindAsync(topicId);
        if (topic == null)
            return BadRequest("Topic not found");

        try
        {
            int importedCount = 0;

            // Tạo hoặc lấy QuestionGroup cho Topic Part 5
            var questionGroup = await _context.QuestionGroups
                .FirstOrDefaultAsync(qg => qg.TextContent == $"Topic_{topicId}_Part5");

            if (questionGroup == null)
            {
                // Sử dụng Part đầu tiên để satisfy FK constraint
                var firstPart = await _context.Parts.FirstOrDefaultAsync();
                if (firstPart == null)
                    return BadRequest("No Part found in database. Please create a test first.");

                questionGroup = new QuestionGroup
                {
                    PartId = firstPart.Id,
                    TextContent = $"Topic_{topicId}_Part5"
                };
                _context.QuestionGroups.Add(questionGroup);
                await _context.SaveChangesAsync();
            }

            // Import questions
            foreach (var q in importData.Questions)
            {
                // Check if question already exists
                var existingQuestion = await _context.Questions
                    .FirstOrDefaultAsync(qst => qst.TopicId == topicId && qst.QuestionNo == q.QuestionNo);

                if (existingQuestion != null)
                    continue; // Skip if exists

                var question = new Question
                {
                    GroupId = questionGroup.Id,
                    TopicId = topicId, // Link to Topic
                    QuestionNo = q.QuestionNo,
                    Content = q.Content,
                    QuestionType = "Part5",
                    CorrectOption = q.CorrectOption,
                    FullExplanation = q.Explanation
                };

                _context.Questions.Add(question);
                await _context.SaveChangesAsync();

                // Add answer options (A, B, C, D)
                var labels = new[] { "A", "B", "C", "D" };
                for (int i = 0; i < q.Options.Count && i < 4; i++)
                {
                    bool isCorrect = labels[i].Equals(q.CorrectOption, StringComparison.OrdinalIgnoreCase);
                    var answer = new Answer
                    {
                        QuestionId = question.Id,
                        Label = labels[i],
                        Content = q.Options[i],
                        IsCorrect = isCorrect
                    };
                    _context.Answers.Add(answer);
                }

                await _context.SaveChangesAsync();
                importedCount++;
            }

            return Ok(new
            {
                message = $"Imported {importedCount} Part 5 questions for Topic {topicId}",
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
    /// Get Part 5 Questions cho Topic
    /// </summary>
    [HttpGet("topics/{topicId}/part5")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPart5QuestionsForTopic(int topicId)
    {
        // Verify topic exists
        var topic = await _context.Topics.FindAsync(topicId);
        if (topic == null)
            return NotFound("Topic not found");

        var questions = await _context.Questions
            .Where(q => q.TopicId == topicId && q.QuestionType == "Part5")
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
                explanation = q.FullExplanation,

            })
            .OrderBy(q => q.questionNo)
            .ToListAsync();

        if (questions.Count == 0)
            return NotFound("No Part 5 questions found for this topic");

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
            // (Lấy cả Part5 hoặc bất kỳ loại nào gắn với TopicId này)
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
            // Logic dựa trên naming convention lúc Import: $"Topic_{topicId}_Part5"
            await _context.QuestionGroups
                .Where(g => g.TextContent == $"Topic_{topicId}_Part5")
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
/// DTO để import Part 5 Questions cho Topic
/// </summary>
public class Part5ImportTopicDto
{
    public List<Part5QuestionDto> Questions { get; set; } = new();
}

public class Part5QuestionDto
{
    public int QuestionNo { get; set; }
    public string Content { get; set; } = string.Empty;
    public string CorrectOption { get; set; } = string.Empty; // "A", "B", "C", "D"
    public List<string> Options { get; set; } = new(); // [A, B, C, D]
    public string? Explanation { get; set; }
}
