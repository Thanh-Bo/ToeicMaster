using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class VocabularyController : ControllerBase
{
    private readonly AppDbContext _context;

    public VocabularyController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>
    /// Lấy danh sách từ vựng (có phân trang & filter)
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetVocabularies(
        [FromQuery] string? category,
        [FromQuery] int? difficulty,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.Vocabularies.AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(v => v.Category == category);

        if (difficulty.HasValue)
            query = query.Where(v => v.Difficulty == difficulty.Value);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(v => v.Word.Contains(search) || v.Meaning.Contains(search));

        var total = await query.CountAsync();

        var vocabularies = await query
            .OrderBy(v => v.Word)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(v => new
            {
                v.Id,
                v.Word,
                v.Pronunciation,
                v.PartOfSpeech,
                v.Meaning,
                v.Example,
                v.ExampleTranslation,
                v.AudioUrl,
                v.ImageUrl,
                v.Category,
                v.Difficulty,
                v.Icon
            })
            .ToListAsync();

        return Ok(new
        {
            items = vocabularies,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(total / (double)pageSize)
        });
    }

    /// <summary>
    /// Lấy các category từ vựng
    /// </summary>
    [HttpGet("categories")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Vocabularies
            .Where(v => v.Category != null)
            .GroupBy(v => v.Category)
            .Select(g => new
            {
                Category = g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        return Ok(categories);
    }

    /// <summary>
    /// Lấy flashcards để học (Spaced Repetition)
    /// </summary>
    [HttpGet("flashcards")]
    public async Task<IActionResult> GetFlashcards([FromQuery] int count = 20, [FromQuery] string? category = null)
    {
        var userId = GetUserId();

        // Ưu tiên: 1. Từ chưa học, 2. Từ đến hạn review, 3. Random
        var now = DateTime.UtcNow;

        // Từ đã học của user
        var learnedVocabIds = await _context.UserVocabularies
            .Where(uv => uv.UserId == userId)
            .Select(uv => uv.VocabularyId)
            .ToListAsync();

        // Từ đến hạn review
        var dueForReview = await _context.UserVocabularies
            .Where(uv => uv.UserId == userId && uv.NextReviewAt <= now && uv.Status < 3)
            .OrderBy(uv => uv.NextReviewAt)
            .Take(count / 2)
            .Select(uv => uv.VocabularyId)
            .ToListAsync();

        // Từ mới chưa học
        var query = _context.Vocabularies.AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(v => v.Category == category);

        var newWords = await query
            .Where(v => !learnedVocabIds.Contains(v.Id))
            .OrderBy(v => Guid.NewGuid())
            .Take(count - dueForReview.Count)
            .Select(v => v.Id)
            .ToListAsync();

        var vocabIds = dueForReview.Concat(newWords).Distinct().ToList();

        var flashcards = await _context.Vocabularies
            .Where(v => vocabIds.Contains(v.Id))
            .Select(v => new
            {
                v.Id,
                v.Word,
                v.Pronunciation,
                v.PartOfSpeech,
                v.Meaning,
                v.Example,
                v.ExampleTranslation,
                v.AudioUrl,
                v.ImageUrl,
                v.Category,
                v.Difficulty,
                IsNew = !learnedVocabIds.Contains(v.Id),
                IsDueReview = dueForReview.Contains(v.Id)
            })
            .ToListAsync();

        // Shuffle
        var shuffled = flashcards.OrderBy(x => Guid.NewGuid()).ToList();

        return Ok(new
        {
            cards = shuffled,
            newCount = newWords.Count,
            reviewCount = dueForReview.Count
        });
    }

    /// <summary>
    /// Cập nhật tiến độ học từ vựng
    /// </summary>
    [HttpPost("flashcards/{vocabId}/review")]
    public async Task<IActionResult> ReviewFlashcard(int vocabId, [FromBody] ReviewFlashcardRequest request)
    {
        var userId = GetUserId();

        var vocab = await _context.Vocabularies.FindAsync(vocabId);
        if (vocab == null)
            return NotFound(new { error = "Từ vựng không tồn tại" });

        var userVocab = await _context.UserVocabularies
            .FirstOrDefaultAsync(uv => uv.UserId == userId && uv.VocabularyId == vocabId);

        if (userVocab == null)
        {
            userVocab = new UserVocabulary
            {
                UserId = userId,
                VocabularyId = vocabId,
                Status = 0,
                CorrectStreak = 0,
                ReviewCount = 0
            };
            _context.UserVocabularies.Add(userVocab);
        }

        userVocab.ReviewCount++;
        userVocab.LastReviewedAt = DateTime.UtcNow;

        // Spaced Repetition Algorithm (simplified)
        if (request.Remembered)
        {
            userVocab.CorrectStreak++;

            // Tính interval dựa trên streak
            var intervals = new[] { 1, 3, 7, 14, 30, 60 }; // days
            var intervalIndex = Math.Min(userVocab.CorrectStreak - 1, intervals.Length - 1);
            var daysToAdd = intervals[Math.Max(0, intervalIndex)];

            userVocab.NextReviewAt = DateTime.UtcNow.AddDays(daysToAdd);

            // Update status
            if (userVocab.CorrectStreak >= 5)
                userVocab.Status = 3; // Mastered
            else if (userVocab.CorrectStreak >= 3)
                userVocab.Status = 2; // Review
            else
                userVocab.Status = 1; // Learning
        }
        else
        {
            userVocab.CorrectStreak = 0;
            userVocab.Status = 1; // Back to Learning
            userVocab.NextReviewAt = DateTime.UtcNow.AddMinutes(10); // Review soon
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            status = userVocab.Status,
            correctStreak = userVocab.CorrectStreak,
            nextReview = userVocab.NextReviewAt
        });
    }

    /// <summary>
    /// Thống kê học từ vựng
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetVocabularyStats()
    {
        var userId = GetUserId();

        var totalVocab = await _context.Vocabularies.CountAsync();

        var userStats = await _context.UserVocabularies
            .Where(uv => uv.UserId == userId)
            .GroupBy(uv => uv.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        var learning = userStats.FirstOrDefault(s => s.Status == 1)?.Count ?? 0;
        var review = userStats.FirstOrDefault(s => s.Status == 2)?.Count ?? 0;
        var mastered = userStats.FirstOrDefault(s => s.Status == 3)?.Count ?? 0;
        var totalLearned = learning + review + mastered;

        var dueForReview = await _context.UserVocabularies
            .CountAsync(uv => uv.UserId == userId && uv.NextReviewAt <= DateTime.UtcNow && uv.Status < 3);

        return Ok(new
        {
            totalVocabulary = totalVocab,
            learned = totalLearned,
            learning,
            review,
            mastered,
            dueForReview,
            progress = totalVocab > 0 ? Math.Round((double)mastered / totalVocab * 100, 1) : 0
        });
    }

    /// <summary>
    /// Thêm từ vựng mới (Admin)
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> AddVocabulary([FromBody] AddVocabularyRequest request)
    {
        if (string.IsNullOrEmpty(request.Word) || string.IsNullOrEmpty(request.Meaning))
            return BadRequest(new { error = "Word và Meaning là bắt buộc" });

        var vocab = new Vocabulary
        {
            Word = request.Word.Trim(),
            Pronunciation = request.Pronunciation,
            PartOfSpeech = request.PartOfSpeech,
            Meaning = request.Meaning.Trim(),
            Example = request.Example,
            ExampleTranslation = request.ExampleTranslation,
            AudioUrl = request.AudioUrl,
            ImageUrl = request.ImageUrl,
            Category = request.Category,
            Difficulty = request.Difficulty ?? 1,
            QuestionId = request.QuestionId
        };

        _context.Vocabularies.Add(vocab);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã thêm từ vựng", vocabId = vocab.Id });
    }

    /// <summary>
    /// Import từ vựng hàng loạt
    /// </summary>
    [HttpPost("import")]
    public async Task<IActionResult> ImportVocabulary([FromBody] List<AddVocabularyRequest> vocabularies)
    {
        if (vocabularies == null || !vocabularies.Any())
            return BadRequest(new { error = "Danh sách từ vựng trống" });

        // 1. Lấy danh sách từ đã có trong DB để so sánh (Lấy Word chuỗi thường)
        var existingWords = await _context.Vocabularies
            .Select(v => v.Word.ToLower())
            .ToListAsync();

        var newVocabs = vocabularies
            .Where(v => !string.IsNullOrEmpty(v.Word) && !string.IsNullOrEmpty(v.Meaning))
            .Where(v => !existingWords.Contains(v.Word!.ToLower().Trim()))
            .Select(v => new Vocabulary
            {
                Word = v.Word!.Trim(),
                Pronunciation = v.Pronunciation,
                PartOfSpeech = v.PartOfSpeech,
                Meaning = v.Meaning!.Trim(),
                Example = v.Example,
                ExampleTranslation = v.ExampleTranslation,
                AudioUrl = v.AudioUrl,
                Category = v.Category,
                Difficulty = v.Difficulty ?? 1,
                Icon = v.Icon,
            })
            .ToList();

        if (newVocabs.Any())
        {
            _context.Vocabularies.AddRange(newVocabs);
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = $"Đã import {newVocabs.Count} từ vựng" });
    }


    // Cập nhật từ vựng
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")] // Giả sử có role
    public async Task<IActionResult> UpdateVocabulary(int id, [FromBody] UpdateVocabularyRequest request)
    {
        var vocab = await _context.Vocabularies.FindAsync(id);
        if (vocab == null) return NotFound();

        vocab.Word = request.Word;
        vocab.Meaning = request.Meaning;
        // ... update các trường khác
        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật thành công" });
    }

    // Xóa từ vựng
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteVocabulary(int id)
    {
        var vocab = await _context.Vocabularies.FindAsync(id);
        if (vocab == null) return NotFound();

        // Lưu ý: Cần xóa ràng buộc UserVocabularies trước nếu không có Cascade Delete
        _context.Vocabularies.Remove(vocab);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa thành công" });
    }
    /// <summary>
    /// Xóa TOÀN BỘ từ vựng và tiến độ học (Chỉ Admin)
    /// </summary>
    [HttpDelete("delete-all")]
    [Authorize(Roles = "Admin")] // Quan trọng: Chỉ Admin mới được xóa
    public async Task<IActionResult> DeleteAllVocabularies()
    {
        try
        {
            // Bước 1: Xóa bảng con trước (UserVocabularies - Tiến độ học của user)
            // Nếu không xóa bảng này trước, SQL sẽ báo lỗi khóa ngoại (Foreign Key)
            await _context.UserVocabularies.ExecuteDeleteAsync();

            // Bước 2: Xóa bảng cha (Vocabularies - Từ vựng)
            await _context.Vocabularies.ExecuteDeleteAsync();

            // Bước 3 (Tùy chọn): Reset ID về 1 (Dành cho SQL Server)
            // Nếu bạn muốn ID bắt đầu lại từ 1, hãy chạy lệnh này. Nếu không thì bỏ qua.
            try
            {
                await _context.Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('Vocabularies', RESEED, 0)");
                await _context.Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('UserVocabularies', RESEED, 0)");
            }
            catch
            {
                // Bỏ qua lỗi này nếu database không phải SQL Server hoặc không đủ quyền
            }

            return Ok(new { message = "Đã xóa sạch toàn bộ từ vựng và reset hệ thống." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }


    [HttpPost("reset-progress")]
    public async Task<IActionResult> ResetProgress([FromBody] List<int> vocabIds)
    {
        var userId = GetUserId();
        var items = await _context.UserVocabularies
            .Where(uv => uv.UserId == userId && vocabIds.Contains(uv.VocabularyId))
            .ToListAsync();

        if (!items.Any()) return NotFound("Không tìm thấy dữ liệu để reset");

        _context.UserVocabularies.RemoveRange(items); // Xóa hẳn để học lại như mới
                                                      // Hoặc update về status 0 tùy logic của bạn

        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã reset tiến độ học" });
    }


}
