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

        // Lấy tất cả topic progress của user
        var userTopicProgress = await _context.UserVocabs
            .Where(uv => uv.UserId == userId)
            .ToListAsync();

        // Chuyển sang Dictionary để tra cứu nhanh
        var userTopicDict = userTopicProgress.ToDictionary(uv => uv.TopicId, uv => uv);

        var topics = await _context.Topics
            .Select(t => new TopicDto
            {
                Id = t.Id,
                Title = t.Title,
                Level = t.Level,
                LevelRange = t.LevelRange,
                ImageUrl = t.ImageUrl,
                TotalWords = t.Vocabularies.Count,
                
                // Nếu user đã học topic này (có record trong UserVocabs)
                LearnedWords = userId == 0 ? 0 : 
                    userTopicDict.ContainsKey(t.Id) ? t.Vocabularies.Count : 0,
                
                // SRS Progress: Level từ UserVocabs (theo topic)
                CurrentLevel = userId == 0 ? 0 : 
                    userTopicDict.ContainsKey(t.Id) ? userTopicDict[t.Id].Level : 0,
                
                // NextReviewAt từ UserVocabs (theo topic)
                NextReviewAt = userId == 0 ? null : 
                    userTopicDict.ContainsKey(t.Id) ? userTopicDict[t.Id].NextReviewAt : null,
                
                // Word counts by level - tất cả từ trong topic cùng level
                WordCounts = userId == 0 ? new Dictionary<int, int>() : 
                    userTopicDict.ContainsKey(t.Id) 
                        ? new Dictionary<int, int>
                        {
                            { 0, 0 },
                            { 1, userTopicDict[t.Id].Level == 1 ? t.Vocabularies.Count : 0 },
                            { 2, userTopicDict[t.Id].Level == 2 ? t.Vocabularies.Count : 0 },
                            { 3, userTopicDict[t.Id].Level == 3 ? t.Vocabularies.Count : 0 },
                            { 4, userTopicDict[t.Id].Level == 4 ? t.Vocabularies.Count : 0 },
                            { 5, userTopicDict[t.Id].Level == 5 ? t.Vocabularies.Count : 0 }
                        }
                        : new Dictionary<int, int> { { 0, t.Vocabularies.Count } },
                
                // Can review now?
                CanReviewNow = userId == 0 ? false : 
                    userTopicDict.ContainsKey(t.Id) 
                        ? userTopicDict[t.Id].NextReviewAt <= now && userTopicDict[t.Id].Status < 3 
                        : false,
                
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
    /// Tạo topic mới - có thể tạo 1 hoặc nhiều topic (Admin only)
    /// </summary>
    [HttpPost("topics")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateTopics([FromBody] CreateTopicsRequest request)
    {
        try
        {
            // Hỗ trợ cả single topic và multiple topics
            var topicsToCreate = request.Topics ?? new List<CreateTopicItem>();
            
            // Nếu chỉ gửi 1 topic (backward compatibility)
            if (request.Title != null)
            {
                topicsToCreate.Add(new CreateTopicItem
                {
                    Title = request.Title,
                    Level = request.Level,
                    LevelRange = request.LevelRange,
                    ImageUrl = request.ImageUrl
                });
            }

            if (!topicsToCreate.Any())
                return BadRequest(new { error = "Vui lòng cung cấp ít nhất 1 topic" });

            // Validate tất cả topics
            var errors = new List<string>();
            var existingTitles = await _context.Topics
                .Select(t => t.Title.ToLower())
                .ToListAsync();

            for (int i = 0; i < topicsToCreate.Count; i++)
            {
                var topic = topicsToCreate[i];
                if (string.IsNullOrWhiteSpace(topic.Title))
                {
                    errors.Add($"Topic #{i + 1}: Tiêu đề không được để trống");
                    continue;
                }

                if (existingTitles.Contains(topic.Title.ToLower()))
                {
                    errors.Add($"Topic #{i + 1}: '{topic.Title}' đã tồn tại");
                }
            }

            if (errors.Any())
                return BadRequest(new { error = "Validation failed", errors });

            // Tạo topics
            var createdTopics = new List<Topic>();
            foreach (var item in topicsToCreate)
            {
                var topic = new Topic
                {
                    Title = item.Title,
                    Level = item.Level ?? "Beginner",
                    LevelRange = item.LevelRange ?? "0-300",
                    ImageUrl = item.ImageUrl
                };

                _context.Topics.Add(topic);
                createdTopics.Add(topic);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Tạo thành công {createdTopics.Count} topic(s)",
                count = createdTopics.Count,
                topics = createdTopics.Select(t => new
                {
                    id = t.Id,
                    title = t.Title,
                    level = t.Level,
                    levelRange = t.LevelRange,
                    imageUrl = t.ImageUrl
                })
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
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
    /// Level up vocabulary khi hoàn thành topic (Test hoặc Matching Game)
    /// </summary>
    [HttpPost("topics/{topicId}/level-up")]
    [Authorize]
    public async Task<IActionResult> LevelUp(int topicId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var now = DateTime.UtcNow;

        try
        {
            // Tìm hoặc tạo record cho topic này
            var userVocab = await _context.UserVocabs
                .FirstOrDefaultAsync(uv => uv.UserId == userId && uv.TopicId == topicId);

            if (userVocab == null)
            {
                // Tạo mới nếu chưa có
                userVocab = new UserVocab
                {
                    UserId = userId,
                    TopicId = topicId,
                    Status = 1, // Learning
                    Level = 1,
                    NextReviewAt = CalculateNextReviewDate(1, true),
                    LastReviewedAt = now,
                    ReviewCount = 0,
                    TotalQuestionsAnswered = 0,
                    TotalCorrectAnswers = 0,
                    CreatedAt = now
                };
                _context.UserVocabs.Add(userVocab);
            }

            // Level up nếu chưa đạt max
            if (userVocab.Level < 5)
            {
                userVocab.Level += 1;
                userVocab.NextReviewAt = CalculateNextReviewDate(userVocab.Level, true);
                userVocab.LastReviewedAt = now;
                userVocab.ReviewCount += 1;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Level up successfully",
                newLevel = userVocab.Level,
                topicId = topicId
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Cập nhật số câu hỏi đã làm và câu đúng sau khi làm test
    /// </summary>
    [HttpPost("topics/{topicId}/update-stats")]
    [Authorize]
    public async Task<IActionResult> UpdateVocabStats(
        int topicId,
        [FromBody] UpdateVocabStatsRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var now = DateTime.UtcNow;

        try
        {
            // Tìm record của user cho topic này
            var userVocab = await _context.UserVocabs
                .FirstOrDefaultAsync(uv => uv.UserId == userId && uv.TopicId == topicId);

            if (userVocab == null)
            {
                return NotFound(new { error = "Topic chưa được học" });
            }

            // Cộng dồn số câu hỏi và câu đúng
            userVocab.TotalQuestionsAnswered += request.TotalQuestions;
            userVocab.TotalCorrectAnswers += request.CorrectAnswers;
            userVocab.LastReviewedAt = now;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Stats updated successfully",
                totalQuestionsAnswered = userVocab.TotalQuestionsAnswered,
                totalCorrectAnswers = userVocab.TotalCorrectAnswers,
                accuracy = userVocab.TotalQuestionsAnswered > 0 
                    ? Math.Round((double)userVocab.TotalCorrectAnswers / userVocab.TotalQuestionsAnswered * 100, 1)
                    : 0
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

        // Lấy thông tin học tập của user cho topic này (per-topic tracking)
        var userVocab = await _context.UserVocabs
            .FirstOrDefaultAsync(uv => uv.UserId == userId && uv.TopicId == topicId);

        // Lấy words từ DB trước
        var vocabularies = await _context.Vocabularies
            .Where(v => v.TopicId == topicId)
            .Include(v => v.WordFamilies)
            .ToListAsync();

        // Map sang DTO trong memory (không dùng expression tree)
        var words = vocabularies.Select(v => new VocabularyDto
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
            WordFamilies = v.WordFamilies?.Select(wf => new WordFamilyDto 
            { 
                Word = wf.Word, 
                PartOfSpeech = wf.PartOfSpeech, 
                Meaning = wf.Meaning 
            }).ToList() ?? new List<WordFamilyDto>(),

                // Thêm Collocations, Synonyms, Antonyms
                Collocations = v.Collocations,
                Synonyms = v.Synonyms,
                Antonyms = v.Antonyms,

                // Lấy trạng thái học từ userVocab (per-topic tracking)
                Status = userVocab?.Status ?? 0,
                Level = userVocab?.Level ?? 0,
                NextReviewAt = userVocab?.NextReviewAt
            }).ToList();

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

        // 1. Lấy các topic đến hạn ôn tập (Due Review)
        var dueReviewTopicIds = await _context.UserVocabs
            .Where(uv => uv.UserId == userId && uv.NextReviewAt <= now && uv.Status < 3)
            .OrderBy(uv => uv.NextReviewAt)
            .Select(uv => uv.TopicId)
            .Take(count)
            .ToListAsync();

        // 2. Lấy từ từ các topic đến hạn
        var dueWordIds = await _context.Vocabularies
            .Where(v => v.TopicId.HasValue && dueReviewTopicIds.Contains(v.TopicId.Value))
            .Select(v => v.Id)
            .ToListAsync();

        // 3. Lấy thêm từ mới (New) nếu chưa đủ số lượng
        var newWordIds = new List<int>();
        int needed = count - dueWordIds.Count;

        if (needed > 0)
        {
            // Lấy các topic đã học
            var learnedTopicIds = await _context.UserVocabs
                .Where(uv => uv.UserId == userId)
                .Select(uv => uv.TopicId)
                .ToListAsync();

            var query = _context.Vocabularies.AsQueryable();
            
            if (topicId.HasValue)
                query = query.Where(v => v.TopicId == topicId.Value);
            else
                // Lọc từ các topic chưa học
                query = query.Where(v => v.TopicId.HasValue && !learnedTopicIds.Contains(v.TopicId.Value));

            newWordIds = await query
                .OrderBy(v => Guid.NewGuid())
                .Take(needed)
                .Select(v => v.Id)
                .ToListAsync();
        }

        var finalIds = dueWordIds.Concat(newWordIds).Distinct().ToList();

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
                
                // Thêm Collocations, Synonyms, Antonyms
                Collocations = v.Collocations,
                Synonyms = v.Synonyms,
                Antonyms = v.Antonyms,
                
                // Set trạng thái giả lập cho UI: 2 (Review) hoặc 0 (New)
                Status = dueWordIds.Contains(v.Id) ? 2 : 0 
            })
            .ToListAsync();

        // Shuffle kết quả trả về
        var shuffled = flashcards.OrderBy(x => Guid.NewGuid()).ToList();

        return Ok(new { cards = shuffled, reviewCount = dueWordIds.Count, newCount = newWordIds.Count });
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
                Icon = v.Icon,
                // Thêm Collocations, Synonyms, Antonyms
                Collocations = v.Collocations,
                Synonyms = v.Synonyms,
                Antonyms = v.Antonyms
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
    /// Lấy chi tiết từ vựng theo ID
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetVocabularyById(int id)
    {
        var vocabulary = await _context.Vocabularies
            .Include(v => v.WordFamilies)
            .Include(v => v.Topic)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (vocabulary == null)
            return NotFound(new { error = "Từ vựng không tồn tại" });

        var dto = new VocabularyDto
        {
            Id = vocabulary.Id,
            Word = vocabulary.Word,
            Pronunciation = vocabulary.Pronunciation,
            PartOfSpeech = vocabulary.PartOfSpeech,
            Meaning = vocabulary.Meaning,
            Example = vocabulary.Example,
            ExampleTranslation = vocabulary.ExampleTranslation,
            AudioUrl = vocabulary.AudioUrl,
            ImageUrl = vocabulary.ImageUrl,
            TopicId = vocabulary.TopicId,
            Tocpic = vocabulary.Topic?.Title,
            Difficulty = vocabulary.Difficulty,
            Icon = vocabulary.Icon,
            // Thêm Collocations, Synonyms, Antonyms
            Collocations = vocabulary.Collocations,
            Synonyms = vocabulary.Synonyms,
            Antonyms = vocabulary.Antonyms,
            WordFamilies = vocabulary.WordFamilies.Select(wf => new WordFamilyDto
            {
                Word = wf.Word,
                PartOfSpeech = wf.PartOfSpeech,
                Meaning = wf.Meaning
            }).ToList()
        };

        return Ok(dto);
    }

   
 

    [HttpPost("topic/{topicId}/import")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ImportVocabulary(
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

            var vocabularies = new List<Vocabulary>();
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

                    // Expected columns: Word, Meaning, Pronunciation, PartOfSpeech, Example, ExampleTranslation, AudioUrl, ImageUrl, Difficulty, Icon, Collocations, Synonyms, Antonyms
                    for (int row = 2; row <= rowCount; row++)
                    {
                        try
                        {
                            var word = worksheet.Cells[row, 1].Text?.Trim();
                            var meaning = worksheet.Cells[row, 2].Text?.Trim();
                            var pronunciation = worksheet.Cells[row, 3].Text?.Trim();
                            var partOfSpeech = worksheet.Cells[row, 4].Text?.Trim();
                            var example = worksheet.Cells[row, 5].Text?.Trim();
                            var exampleTranslation = worksheet.Cells[row, 6].Text?.Trim();
                            var audioUrl = worksheet.Cells[row, 7].Text?.Trim();
                            var imageUrl = worksheet.Cells[row, 8].Text?.Trim();
                            var difficultyText = worksheet.Cells[row, 9].Text?.Trim();
                            var icon = worksheet.Cells[row, 10].Text?.Trim();
                            var collocations = worksheet.Cells[row, 11].Text?.Trim();
                            var synonyms = worksheet.Cells[row, 12].Text?.Trim();
                            var antonyms = worksheet.Cells[row, 13].Text?.Trim();

                            if (string.IsNullOrEmpty(word))
                            {
                                errors.Add($"Dòng {row}: Từ vựng (Word) trống");
                                continue;
                            }

                            if (string.IsNullOrEmpty(meaning))
                            {
                                errors.Add($"Dòng {row}: Nghĩa (Meaning) trống");
                                continue;
                            }

                            // Parse difficulty
                            int difficulty = 1;
                            if (!string.IsNullOrEmpty(difficultyText) && !int.TryParse(difficultyText, out difficulty))
                            {
                                difficulty = 1;
                            }

                            // Check if word already exists in this topic
                            var existingWord = await _context.Vocabularies
                                .AnyAsync(v => v.Word.ToLower() == word.ToLower() && v.TopicId == topicId);
                            
                            if (existingWord)
                            {
                                errors.Add($"Dòng {row}: Từ '{word}' đã tồn tại trong topic này");
                                continue;
                            }

                            var vocab = new Vocabulary
                            {
                                Word = word,
                                Meaning = meaning,
                                Pronunciation = string.IsNullOrEmpty(pronunciation) ? null : pronunciation,
                                PartOfSpeech = string.IsNullOrEmpty(partOfSpeech) ? null : partOfSpeech,
                                Example = string.IsNullOrEmpty(example) ? null : example,
                                ExampleTranslation = string.IsNullOrEmpty(exampleTranslation) ? null : exampleTranslation,
                                AudioUrl = string.IsNullOrEmpty(audioUrl) ? null : audioUrl,
                                ImageUrl = string.IsNullOrEmpty(imageUrl) ? null : imageUrl,
                                TopicId = topicId,
                                Difficulty = difficulty,
                                Icon = string.IsNullOrEmpty(icon) ? null : icon,
                                Collocations = string.IsNullOrEmpty(collocations) ? null : collocations,
                                Synonyms = string.IsNullOrEmpty(synonyms) ? null : synonyms,
                                Antonyms = string.IsNullOrEmpty(antonyms) ? null : antonyms,
                                CreatedAt = DateTime.UtcNow
                            };

                            vocabularies.Add(vocab);
                        }
                        catch (Exception ex)
                        {
                            errors.Add($"Dòng {row}: {ex.Message}");
                        }
                    }
                }
            }

            if (!vocabularies.Any())
                return BadRequest(new { error = "Không có từ vựng hợp lệ trong file Excel", errors });

            // Save to database
            _context.Vocabularies.AddRange(vocabularies);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Import thành công {vocabularies.Count} từ vựng" + (errors.Any() ? $", lỗi {errors.Count} dòng" : ""),
                topicId,
                successCount = vocabularies.Count,
                errorCount = errors.Count,
                errors = errors.Any() ? errors : null
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Lỗi import từ vựng", details = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVocabulary(int id, [FromBody] UpdateVocabularyRequest request)
    {
        var vocab = await _context.Vocabularies.FindAsync(id);
        if (vocab == null) return NotFound();

        vocab.Word = request.Word ?? vocab.Word;
        vocab.Meaning = request.Meaning ?? vocab.Meaning;
        vocab.Example = request.Example ?? vocab.Example;
        vocab.Pronunciation = request.Pronunciation ?? vocab.Pronunciation;
        vocab.PartOfSpeech = request.PartOfSpeech ?? vocab.PartOfSpeech;
        vocab.ExampleTranslation = request.ExampleTranslation ?? vocab.ExampleTranslation;
        vocab.AudioUrl = request.AudioUrl ?? vocab.AudioUrl;
        vocab.ImageUrl = request.ImageUrl ?? vocab.ImageUrl;
        vocab.TopicId = request.TopicId ?? vocab.TopicId;
        vocab.Difficulty = request.Difficulty ?? vocab.Difficulty;
        vocab.Icon = request.Icon ?? vocab.Icon;
        // Thêm Collocations, Synonyms, Antonyms
        vocab.Collocations = request.Collocations ?? vocab.Collocations;
        vocab.Synonyms = request.Synonyms ?? vocab.Synonyms;
        vocab.Antonyms = request.Antonyms ?? vocab.Antonyms;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật thành công" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVocabulary(int id)
    {
        var vocab = await _context.Vocabularies.FindAsync(id);
        if (vocab == null) return NotFound();

        _context.Vocabularies.Remove(vocab);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa thành công" });
    }

    [HttpDelete("topic/{topicId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteVocabulariesByTopic(int topicId)
    {
        // Kiểm tra topic tồn tại
        var topicExists = await _context.Topics.AnyAsync(t => t.Id == topicId);
        if (!topicExists)
            return NotFound(new { error = "Topic không tồn tại" });

        // Xóa các vocabularies thuộc topic này
        var vocabularies = await _context.Vocabularies
            .Where(v => v.TopicId == topicId)
            .ToListAsync();

        if (!vocabularies.Any())
            return NotFound(new { error = "Không có từ vựng nào trong topic này" });

        _context.Vocabularies.RemoveRange(vocabularies);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = $"Đã xóa {vocabularies.Count} từ vựng thuộc topic {topicId}"
        });
    }

    [HttpDelete("delete-all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAllVocabularies()
    {
        await _context.UserVocabs.ExecuteDeleteAsync();
        await _context.WordFamilies.ExecuteDeleteAsync(); // Xóa bảng con trước
        await _context.Vocabularies.ExecuteDeleteAsync();
        return Ok(new { message = "Đã xóa sạch hệ thống từ vựng." });
    }

    // --- CÁC HELPER CLASSES (Để ở cuối file hoặc tách ra file riêng) ---
    public class UpdateStatusRequest { public int Status { get; set; } }

    public class UpdateVocabStatsRequest 
    { 
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
    }

    public class CreateTopicItem
    {
        public string Title { get; set; } = string.Empty;
        public string? Level { get; set; }
        public string? LevelRange { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class CreateTopicsRequest
    {
        // Hỗ trợ cả single topic (backward compatibility)
        public string? Title { get; set; }
        public string? Level { get; set; }
        public string? LevelRange { get; set; }
        public string? ImageUrl { get; set; }
        
        // Hoặc multiple topics
        public List<CreateTopicItem>? Topics { get; set; }
    }
}