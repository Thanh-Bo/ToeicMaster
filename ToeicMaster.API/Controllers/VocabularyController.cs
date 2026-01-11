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

    // ==========================================
    // 1. NHÓM API: TOPIC & HỌC TẬP (CLIENT)
    // ==========================================

    /// <summary>
    /// Lấy danh sách Topic kèm tiến độ học
    /// </summary>
    [HttpGet("topics")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTopics()
    {
        // Lấy User Id an toàn (tránh lỗi nếu chưa đăng nhập)
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        int userId = userIdStr != null ? int.Parse(userIdStr) : 0;
        var now = DateTime.UtcNow;

        var topics = await _context.Topics
            .Select(t => new TopicDto
            {
                Id = t.Id,
                Title = t.Title,
                Level = t.Level,
                LevelRange = t.LevelRange,
                ImageUrl = t.ImageUrl,
                TotalWords = t.Vocabularies.Count,
                // Tính số từ user đã học (Status > 0)
                LearnedWords = userId == 0 ? 0 : t.Vocabularies
                    .Count(v => v.UserVocabularies.Any(uv => uv.UserId == userId && uv.Status > 0)),
                
                // SRS Progress: Current level = max level user achieved for this topic
                CurrentLevel = userId == 0 ? 0 : t.Vocabularies
                    .SelectMany(v => v.UserVocabularies.Where(uv => uv.UserId == userId))
                    .Max(uv => (int?)uv.Level) ?? 0,
                
                // NextReviewAt: minimum nextReviewAt among all words in this topic
                NextReviewAt = userId == 0 ? null : t.Vocabularies
                    .SelectMany(v => v.UserVocabularies.Where(uv => uv.UserId == userId))
                    .Min(uv => (DateTime?)uv.NextReviewAt),
                
                // Word counts by level
                WordCounts = userId == 0 ? new Dictionary<int, int>() : new Dictionary<int, int>
                {
                    { 0, t.Vocabularies.Count(v => !v.UserVocabularies.Any(uv => uv.UserId == userId)) },
                    { 1, t.Vocabularies.Count(v => v.UserVocabularies.Any(uv => uv.UserId == userId && uv.Level == 1)) },
                    { 2, t.Vocabularies.Count(v => v.UserVocabularies.Any(uv => uv.UserId == userId && uv.Level == 2)) },
                    { 3, t.Vocabularies.Count(v => v.UserVocabularies.Any(uv => uv.UserId == userId && uv.Level == 3)) },
                    { 4, t.Vocabularies.Count(v => v.UserVocabularies.Any(uv => uv.UserId == userId && uv.Level == 4)) },
                    { 5, t.Vocabularies.Count(v => v.UserVocabularies.Any(uv => uv.UserId == userId && uv.Level == 5)) }
                },
                
                // Can review now?
                CanReviewNow = userId == 0 ? false : t.Vocabularies
                    .Any(v => v.UserVocabularies.Any(uv => uv.UserId == userId && uv.NextReviewAt <= now && uv.Status < 3)),
                
                // Time until ready - tính bên ngoài query
                TimeUntilReady = ""
            })
            .ToListAsync();

        // Tính TimeUntilReady sau khi fetch dữ liệu từ DB
        foreach (var topic in topics)
        {
            if (topic.NextReviewAt.HasValue)
            {
                topic.TimeUntilReady = CalculateTimeRemaining(topic.NextReviewAt.Value);
            }
        }

        return Ok(topics);
    }

    /// <summary>
    /// Helper: Tính thời gian còn lại cho countdown timer
    /// </summary>
    private string CalculateTimeRemaining(DateTime nextReviewAt)
    {
        var now = DateTime.UtcNow;
        if (nextReviewAt <= now) return "";
        
        var timeSpan = nextReviewAt - now;
        if (timeSpan.TotalHours > 24)
            return $"{Math.Floor(timeSpan.TotalDays)}d {timeSpan.Hours}h";
        if (timeSpan.TotalHours > 1)
            return $"{Math.Floor(timeSpan.TotalHours)}h {timeSpan.Minutes}m";
        return $"{timeSpan.Minutes}m {timeSpan.Seconds}s";
    }

    /// <summary>
    /// Helper: Tính NextReviewAt dựa trên Level
    /// </summary>
    private DateTime CalculateNextReviewDate(int level, bool isCorrect)
    {
        var now = DateTime.UtcNow;
        
        if (!isCorrect)
            return now; // Ôn lại ngay nếu sai
        
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
    /// Submit test results và cập nhật vocabulary levels
    /// </summary>
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
    [HttpGet("topics/{topicId}/words")]
    public async Task<IActionResult> GetWordsByTopic(int topicId)
    {
        var userId = GetUserId();

        var words = await _context.Vocabularies
            .Where(v => v.TopicId == topicId)
            .Include(v => v.WordFamilies) // Quan trọng: Lấy WordFamily
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
                TopicId = v.TopicId,
                
                // Map danh sách WordFamily
                WordFamilies = v.WordFamilies.Select(wf => new WordFamilyDto 
                { 
                    Word = wf.Word, 
                    PartOfSpeech = wf.PartOfSpeech, 
                    Meaning = wf.Meaning 
                }).ToList(),

                // Lấy trạng thái học của user (0: New, 1: Learning...)
                Status = v.UserVocabularies
                    .Where(uv => uv.UserId == userId)
                    .Select(uv => uv.Status)
                    .FirstOrDefault(),
                
                // Lấy level & nextReviewAt từ UserVocabulary (SRS)
                Level = v.UserVocabularies
                    .Where(uv => uv.UserId == userId)
                    .Select(uv => uv.Level)
                    .FirstOrDefault(),
                NextReviewAt = v.UserVocabularies
                    .Where(uv => uv.UserId == userId)
                    .Select(uv => uv.NextReviewAt)
                    .FirstOrDefault()
            })
            .ToListAsync();

        return Ok(words);
    }

    /// <summary>
    /// Lấy Flashcards ôn tập (Spaced Repetition)
    /// </summary>
    [HttpGet("flashcards")]
    public async Task<IActionResult> GetFlashcards([FromQuery] int count = 20, [FromQuery] int? topicId = null)
    {
        var userId = GetUserId();
        var now = DateTime.UtcNow;

        // 1. Lấy từ đến hạn ôn tập (Due Review)
        var dueReviewIds = await _context.UserVocabularies
            .Where(uv => uv.UserId == userId && uv.NextReviewAt <= now && uv.Status < 3) // Chưa Mastered
            .OrderBy(uv => uv.NextReviewAt)
            .Take(count)
            .Select(uv => uv.VocabularyId)
            .ToListAsync();

        // 2. Lấy thêm từ mới (New) nếu chưa đủ số lượng
        var newWordIds = new List<int>();
        int needed = count - dueReviewIds.Count;

        if (needed > 0)
        {
            var learnedIds = await _context.UserVocabularies
                .Where(uv => uv.UserId == userId)
                .Select(uv => uv.VocabularyId)
                .ToListAsync();

            var query = _context.Vocabularies.AsQueryable();
            
            if (topicId.HasValue)
                query = query.Where(v => v.TopicId == topicId.Value);

            newWordIds = await query
                .Where(v => !learnedIds.Contains(v.Id)) // Chưa học
                .OrderBy(v => Guid.NewGuid()) // Random
                .Take(needed)
                .Select(v => v.Id)
                .ToListAsync();
        }

        var finalIds = dueReviewIds.Concat(newWordIds).Distinct().ToList();

        // Query lấy chi tiết
        var flashcards = await _context.Vocabularies
            .Where(v => finalIds.Contains(v.Id))
            .Include(v => v.WordFamilies)
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
                WordFamilies = v.WordFamilies.Select(wf => new WordFamilyDto 
                { 
                    Word = wf.Word, PartOfSpeech = wf.PartOfSpeech, Meaning = wf.Meaning 
                }).ToList(),
                
                // Set trạng thái giả lập cho UI: 2 (Review) hoặc 0 (New)
                Status = dueReviewIds.Contains(v.Id) ? 2 : 0 
            })
            .ToListAsync();

        // Shuffle kết quả trả về
        var shuffled = flashcards.OrderBy(x => Guid.NewGuid()).ToList();

        return Ok(new { cards = shuffled, reviewCount = dueReviewIds.Count, newCount = newWordIds.Count });
    }

   

    // ==========================================
    // 2. NHÓM API: QUẢN LÝ (ADMIN / SEARCH)
    // ==========================================

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetVocabularies(
        [FromQuery] int? topicId, // Đã sửa thành int?
        [FromQuery] int? difficulty,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.Vocabularies.Include(v => v.Topic).AsQueryable();

        if (topicId.HasValue)
            query = query.Where(v => v.TopicId == topicId.Value);

        if (difficulty.HasValue)
            query = query.Where(v => v.Difficulty == difficulty.Value);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(v => v.Word.Contains(search) || v.Meaning.Contains(search));

        var total = await query.CountAsync();

        var vocabularies = await query
            .OrderBy(v => v.Word)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(v => new VocabularyDto
            {
                Id = v.Id,
                Word = v.Word,
                Pronunciation = v.Pronunciation,
                PartOfSpeech = v.PartOfSpeech,
                Meaning = v.Meaning,
                Example = v.Example,
                ExampleTranslation = v.ExampleTranslation,
                AudioUrl = v.AudioUrl,
                ImageUrl = v.ImageUrl,
                TopicId = v.TopicId,
                Tocpic = v.Topic != null ? v.Topic.Title : null, // Hiển thị tên Topic
                Difficulty = v.Difficulty,
                Icon = v.Icon
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

    [HttpPost]
    public async Task<IActionResult> AddVocabulary([FromBody] AddVocabularyRequest request)
    {
        if (string.IsNullOrEmpty(request.Word) || string.IsNullOrEmpty(request.Meaning))
            return BadRequest(new { error = "Word và Meaning là bắt buộc" });

        var vocab = new Vocabulary
        {
            Word = request.Word.Trim(),
            Meaning = request.Meaning.Trim(),
            Pronunciation = request.Pronunciation,
            PartOfSpeech = request.PartOfSpeech,
            Example = request.Example,
            ExampleTranslation = request.ExampleTranslation,
            AudioUrl = request.AudioUrl,
            ImageUrl = request.ImageUrl,
            TopicId = request.TopicId,
            Difficulty = request.Difficulty ?? 1,
            Icon = request.Icon
        };

        // Thêm WordFamily nếu có
        if (request.WordFamilies != null)
        {
            foreach (var wf in request.WordFamilies)
            {
                vocab.WordFamilies.Add(new WordFamily 
                { 
                    Word = wf.Word, 
                    PartOfSpeech = wf.PartOfSpeech, 
                    Meaning = wf.Meaning 
                });
            }
        }

        _context.Vocabularies.Add(vocab);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã thêm từ vựng", vocabId = vocab.Id });
    }

    [HttpPost("import")]
    public async Task<IActionResult> ImportVocabulary([FromBody] List<AddVocabularyRequest> vocabularies)
    {
        if (vocabularies == null || !vocabularies.Any())
            return BadRequest(new { error = "Danh sách trống" });

        var existingWords = await _context.Vocabularies
            .Select(v => v.Word.ToLower())
            .ToListAsync();

        var newVocabs = new List<Vocabulary>();

        foreach (var v in vocabularies)
        {
            if (string.IsNullOrEmpty(v.Word) || string.IsNullOrEmpty(v.Meaning)) continue;
            if (existingWords.Contains(v.Word.ToLower().Trim())) continue;

            var vocab = new Vocabulary
            {
                Word = v.Word.Trim(),
                Meaning = v.Meaning.Trim(),
                Pronunciation = v.Pronunciation,
                PartOfSpeech = v.PartOfSpeech,
                Example = v.Example,
                ExampleTranslation = v.ExampleTranslation,
                TopicId = v.TopicId,
                Difficulty = v.Difficulty ?? 1
            };

            // Import Word Families
            if (v.WordFamilies != null)
            {
                foreach(var wf in v.WordFamilies)
                {
                    vocab.WordFamilies.Add(new WordFamily { Word = wf.Word, PartOfSpeech = wf.PartOfSpeech, Meaning = wf.Meaning });
                }
            }

            newVocabs.Add(vocab);
        }

        if (newVocabs.Any())
        {
            _context.Vocabularies.AddRange(newVocabs);
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = $"Đã import {newVocabs.Count} từ vựng" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVocabulary(int id, [FromBody] UpdateVocabularyRequest request)
    {
        var vocab = await _context.Vocabularies.FindAsync(id);
        if (vocab == null) return NotFound();

        vocab.Word = request.Word ?? vocab.Word;
        vocab.Meaning = request.Meaning ?? vocab.Meaning;
        vocab.Example = request.Example ?? vocab.Example;
        // ... (Map các trường khác nếu cần)

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật thành công" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVocabulary(int id)
    {
        var vocab = await _context.Vocabularies.FindAsync(id);
        if (vocab == null) return NotFound();

        // Xóa UserVocabularies liên quan trước (nếu không có Cascade DB)
        var relatedUserVocabs = _context.UserVocabularies.Where(uv => uv.VocabularyId == id);
        _context.UserVocabularies.RemoveRange(relatedUserVocabs);

        _context.Vocabularies.Remove(vocab);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa thành công" });
    }

    [HttpDelete("delete-all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAllVocabularies()
    {
        await _context.UserVocabularies.ExecuteDeleteAsync();
        await _context.WordFamilies.ExecuteDeleteAsync(); // Xóa bảng con trước
        await _context.Vocabularies.ExecuteDeleteAsync();
        return Ok(new { message = "Đã xóa sạch hệ thống từ vựng." });
    }

    // --- CÁC HELPER CLASSES (Để ở cuối file hoặc tách ra file riêng) ---
    public class UpdateStatusRequest { public int Status { get; set; } }
}