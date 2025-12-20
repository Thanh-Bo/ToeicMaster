using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;

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
                v.Difficulty
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

        var newVocabs = vocabularies
            .Where(v => !string.IsNullOrEmpty(v.Word) && !string.IsNullOrEmpty(v.Meaning))
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
                Difficulty = v.Difficulty ?? 1
            })
            .ToList();

        _context.Vocabularies.AddRange(newVocabs);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Đã import {newVocabs.Count} từ vựng" });
    }

    /// <summary>
    /// User lưu từ vựng từ câu hỏi (khi làm bài thi)
    /// </summary>
    [HttpPost("save-from-question")]
    public async Task<IActionResult> SaveVocabularyFromQuestion([FromBody] SaveVocabFromQuestionRequest request)
    {
        var userId = GetUserId();

        if (string.IsNullOrEmpty(request.Word) || string.IsNullOrEmpty(request.Meaning))
            return BadRequest(new { error = "Word và Meaning là bắt buộc" });

        // Kiểm tra từ đã tồn tại chưa
        var existingVocab = await _context.Vocabularies
            .FirstOrDefaultAsync(v => v.Word.ToLower() == request.Word.ToLower().Trim());

        int vocabId;

        if (existingVocab != null)
        {
            // Từ đã có trong hệ thống, chỉ cần link với user
            vocabId = existingVocab.Id;
        }
        else
        {
            // Tạo từ mới
            var newVocab = new Vocabulary
            {
                Word = request.Word.Trim(),
                Pronunciation = request.Pronunciation,
                PartOfSpeech = request.PartOfSpeech,
                Meaning = request.Meaning.Trim(),
                Example = request.Example,
                ExampleTranslation = request.ExampleTranslation,
                Category = request.Category ?? "user-saved",
                Difficulty = request.Difficulty ?? 2,
                QuestionId = request.QuestionId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Vocabularies.Add(newVocab);
            await _context.SaveChangesAsync();
            vocabId = newVocab.Id;
        }

        // Kiểm tra user đã lưu từ này chưa
        var existingUserVocab = await _context.UserVocabularies
            .FirstOrDefaultAsync(uv => uv.UserId == userId && uv.VocabularyId == vocabId);

        if (existingUserVocab != null)
        {
            return Ok(new { message = "Từ vựng đã được lưu trước đó", vocabId, alreadySaved = true });
        }

        // Thêm vào danh sách học của user
        var userVocab = new UserVocabulary
        {
            UserId = userId,
            VocabularyId = vocabId,
            Status = 0, // Chưa học
            CorrectStreak = 0,
            ReviewCount = 0,
            NextReviewAt = DateTime.UtcNow // Sẵn sàng học ngay
        };

        _context.UserVocabularies.Add(userVocab);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã lưu từ vựng vào danh sách học", vocabId, alreadySaved = false });
    }

    /// <summary>
    /// Lấy danh sách từ vựng user đã lưu
    /// </summary>
    [HttpGet("my-vocabulary")]
    public async Task<IActionResult> GetMyVocabulary([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetUserId();

        var query = _context.UserVocabularies
            .Where(uv => uv.UserId == userId)
            .Include(uv => uv.Vocabulary)
            .OrderByDescending(uv => uv.Id);

        var total = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(uv => new
            {
                uv.Vocabulary.Id,
                uv.Vocabulary.Word,
                uv.Vocabulary.Pronunciation,
                uv.Vocabulary.PartOfSpeech,
                uv.Vocabulary.Meaning,
                uv.Vocabulary.Example,
                uv.Vocabulary.ExampleTranslation,
                uv.Vocabulary.Category,
                uv.Vocabulary.Difficulty,
                uv.Status,
                uv.CorrectStreak,
                uv.LastReviewedAt,
                uv.NextReviewAt
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

    /// <summary>
    /// Xóa từ vựng khỏi danh sách học của user
    /// </summary>
    [HttpDelete("my-vocabulary/{vocabId}")]
    public async Task<IActionResult> RemoveFromMyVocabulary(int vocabId)
    {
        var userId = GetUserId();

        var userVocab = await _context.UserVocabularies
            .FirstOrDefaultAsync(uv => uv.UserId == userId && uv.VocabularyId == vocabId);

        if (userVocab == null)
            return NotFound(new { error = "Không tìm thấy từ vựng trong danh sách của bạn" });

        _context.UserVocabularies.Remove(userVocab);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã xóa từ vựng khỏi danh sách học" });
    }
}

public class SaveVocabFromQuestionRequest
{
    public string? Word { get; set; }
    public string? Pronunciation { get; set; }
    public string? PartOfSpeech { get; set; }
    public string? Meaning { get; set; }
    public string? Example { get; set; }
    public string? ExampleTranslation { get; set; }
    public string? Category { get; set; }
    public int? Difficulty { get; set; }
    public int? QuestionId { get; set; }
}

public class ReviewFlashcardRequest
{
    public bool Remembered { get; set; }
}

public class AddVocabularyRequest
{
    public string? Word { get; set; }
    public string? Pronunciation { get; set; }
    public string? PartOfSpeech { get; set; }
    public string? Meaning { get; set; }
    public string? Example { get; set; }
    public string? ExampleTranslation { get; set; }
    public string? AudioUrl { get; set; }
    public string? ImageUrl { get; set; }
    public string? Category { get; set; }
    public int? Difficulty { get; set; }
    public int? QuestionId { get; set; }
}
