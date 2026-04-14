using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToeicMaster.API.Models;
using ToeicMaster.API.Services;
using System.Security.Claims;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class UserGrammarController : ControllerBase
{
    private readonly IGrammarService _grammarService;
    private readonly ILogger<UserGrammarController> _logger;

    public UserGrammarController(IGrammarService grammarService, ILogger<UserGrammarController> logger)
    {
        _grammarService = grammarService;
        _logger = logger;
    }

    /// <summary>
    /// Lấy User ID từ JWT Token
    /// </summary>
    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return int.Parse(userIdClaim?.Value ?? "0");
    }

    // ==========================================
    // 1. USER GRAMMAR PROGRESS
    // ==========================================

    /// <summary>
    /// Lấy tiến độ học ngữ pháp của user
    /// </summary>
    [HttpGet("progress")]
    public async Task<IActionResult> GetUserGrammarProgress()
    {
        try
        {
            int userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new { error = "Không xác định được người dùng" });

            var progresses = await _grammarService.GetUserGrammarsProgressAsync(userId);
            return Ok(progresses);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting user grammar progress: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy tiến độ học" });
        }
    }

    /// <summary>
    /// Lấy tiến độ học một quy tắc ngữ pháp cụ thể
    /// </summary>
    [HttpGet("progress/{grammarId}")]
    public async Task<IActionResult> GetGrammarProgress(int grammarId)
    {
        try
        {
            int userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new { error = "Không xác định được người dùng" });

            var progress = await _grammarService.GetUserGrammarProgressAsync(userId, grammarId);
            if (progress == null)
                return NotFound(new { error = "Không tìm thấy tiến độ học" });

            return Ok(progress);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar progress: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy tiến độ" });
        }
    }

    /// <summary>
    /// Cập nhật tiến độ học quy tắc ngữ pháp (sau khi làm bài)
    /// </summary>
    [HttpPut("progress/{grammarId}")]
    public async Task<IActionResult> UpdateGrammarProgress(
        int grammarId,
        [FromBody] UpdateGrammarProgressRequest request)
    {
        try
        {
            int userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new { error = "Không xác định được người dùng" });

            var progress = await _grammarService.UpdateUserGrammarProgressAsync(userId, grammarId, request);
            return Ok(new
            {
                message = "Cập nhật tiến độ thành công",
                progress = progress
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating grammar progress: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi cập nhật tiến độ" });
        }
    }

    // ==========================================
    // 2. SPACED REPETITION (Ôn tập)
    // ==========================================

    /// <summary>
    /// Lấy danh sách quy tắc ngữ pháp cần ôn tập (Spaced Repetition)
    /// </summary>
    [HttpGet("review")]
    public async Task<IActionResult> GetGrammarsForReview([FromQuery] int count = 20)
    {
        try
        {
            int userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new { error = "Không xác định được người dùng" });

            var grammars = await _grammarService.GetGrammarsForReviewAsync(userId, count);
            return Ok(new
            {
                items = grammars,
                total = grammars.Count,
                message = grammars.Count > 0 
                    ? "Bạn có quy tắc ngữ pháp cần ôn tập"
                    : "Hiện không có quy tắc nào cần ôn tập"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammars for review: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy danh sách ôn tập" });
        }
    }

    /// <summary>
    /// Lấy Flashcards ôn tập ngữ pháp
    /// </summary>
    [HttpGet("flashcards")]
    public async Task<IActionResult> GetFlashcards([FromQuery] int count = 20, [FromQuery] int? topicId = null)
    {
        try
        {
            int userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new { error = "Không xác định được người dùng" });

            var grammars = await _grammarService.GetGrammarsForReviewAsync(userId, count);

            var flashcards = grammars.Select(g => new
            {
                id = g.Id,
                front = g.RuleName, // Mặt trước: Tên quy tắc
                back = new
                {
                    structure = g.Structure,
                    meaning = g.Meaning,
                    example = g.Example,
                    exampleTranslation = g.ExampleTranslation,
                    commonMistakes = g.CommonMistakes,
                    examples = g.GrammarExamples
                },
                difficulty = g.Difficulty
            }).ToList();

            return Ok(new
            {
                items = flashcards,
                total = flashcards.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting flashcards: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy flashcards" });
        }
    }

    // ==========================================
    // 3. STATISTICS & PROGRESS TRACKING
    // ==========================================

    /// <summary>
    /// Lấy số lượng quy tắc ngữ pháp đã thành thạo
    /// </summary>
    [HttpGet("mastered-count")]
    public async Task<IActionResult> GetMasteredCount()
    {
        try
        {
            int userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new { error = "Không xác định được người dùng" });

            int count = await _grammarService.GetUserMasteredGrammarsCountAsync(userId);
            return Ok(new { count });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting mastered count: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy số lượng quy tắc thành thạo" });
        }
    }

    // ==========================================
    // 4. GRAMMAR TEST/PRACTICE
    // ==========================================

    /// <summary>
    /// Nộp bài kiểm tra ngữ pháp
    /// </summary>
    [HttpPost("submit-test")]
    public async Task<IActionResult> SubmitGrammarTest([FromBody] SubmitGrammarTestRequest request)
    {
        try
        {
            int userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new { error = "Không xác định được người dùng" });

            if (request?.Answers == null || !request.Answers.Any())
                return BadRequest(new { error = "Không có câu trả lời" });

            // Cập nhật tiến độ cho mỗi quy tắc ngữ pháp
            foreach (var answer in request.Answers)
            {
                var updateRequest = new UpdateGrammarProgressRequest
                {
                    IsCorrect = answer.IsCorrect,
                    Level = answer.IsCorrect ? 1 : 0,
                    NextReviewAt = CalculateNextReviewDate(answer.IsCorrect)
                };

                await _grammarService.UpdateUserGrammarProgressAsync(userId, answer.GrammarId, updateRequest);
            }

            // Tính toán điểm
            int correctCount = request.Answers.Count(a => a.IsCorrect);
            int totalCount = request.Answers.Count;
            int score = (int)Math.Round((correctCount / (double)totalCount) * 100);

            return Ok(new
            {
                score = score,
                correctCount = correctCount,
                totalCount = totalCount,
                message = $"Bạn trả lời đúng {correctCount}/{totalCount} câu"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error submitting grammar test: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi nộp bài kiểm tra" });
        }
    }

    /// <summary>
    /// Tính ngày ôn tập tiếp theo (Spaced Repetition Algorithm)
    /// </summary>
    private DateTime CalculateNextReviewDate(bool isCorrect)
    {
        // Nếu sai, ôn tập lại sau 1 ngày
        if (!isCorrect)
            return DateTime.UtcNow.AddDays(1);

        // Nếu đúng, ôn tập lại sau 3 ngày
        return DateTime.UtcNow.AddDays(3);
    }
}

// ==========================================
// HELPER CLASSES
// ==========================================

public class SubmitGrammarTestRequest
{
    public List<GrammarTestAnswerRequest>? Answers { get; set; }
}

public class GrammarTestAnswerRequest
{
    public int GrammarId { get; set; }
    public bool IsCorrect { get; set; }
}
