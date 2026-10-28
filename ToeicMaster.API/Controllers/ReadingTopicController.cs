using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using Microsoft.AspNetCore.Authorization;
namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/reading-practice/topics")]
[Authorize]
public class ReadingTopicController : ReadingPracticeBaseController
{
    public ReadingTopicController(AppDbContext context) : base(context) { }

    [HttpGet]
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

        // Counts are projected in SQL - no need to load passages/questions here.
        var query = _context.ReadingTopics
            .AsNoTracking()
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
            .Select(t => new
            {
                t.Id,
                t.PublicId,
                t.Title,
                t.Description,
                t.PartType,
                t.Difficulty,
                t.DisplayOrder,
                t.IsPremiumRequired,
                PassageCount = t.Passages.Count(p => p.IsActive),
                QuestionCount = t.Passages
                    .Where(p => p.IsActive)
                    .SelectMany(p => p.Questions)
                    .Count()
            })
            .ToListAsync();

        return Ok(topics);
    }

    /// <summary>
    /// GET /api/v1/reading-practice/topics/{topicGuid:guid}
    /// Public route — dùng UUID cho frontend
    /// </summary>
    [HttpGet("{topicGuid:guid}")]
    public async Task<IActionResult> GetTopicByGuid(Guid topicGuid)
    {
        var topic = await _context.ReadingTopics
            .AsNoTracking()
            .Include(t => t.Passages.Where(p => p.IsActive))
                .ThenInclude(p => p.Questions)
            .AsSplitQuery()
            .FirstOrDefaultAsync(t => t.PublicId == topicGuid && t.IsActive);

        if (topic == null)
            return NotFound(new { error = "Không tìm thấy topic Reading." });

        return Ok(BuildTopicDetailResponse(topic));
    }

#if DEBUG
    /// <summary>
    /// GET /api/v1/reading-practice/topics/internal/{topicId:int}
    /// Internal route — dùng int cho Postman test
    /// </summary>
    [HttpGet("internal/{topicId:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetTopicById(int topicId)
    {
        var topic = await _context.ReadingTopics
            .AsNoTracking()
            .Include(t => t.Passages.Where(p => p.IsActive))
                .ThenInclude(p => p.Questions)
            .AsSplitQuery()
            .FirstOrDefaultAsync(t => t.Id == topicId && t.IsActive);

        if (topic == null)
            return NotFound(new { error = "Không tìm thấy topic Reading." });

        return Ok(BuildTopicDetailResponse(topic));
    }
#endif

    [Obsolete("Use GetTopicByGuid instead. Kept for backward compat.")]
    [HttpGet("{topicId:int}")]
    public async Task<IActionResult> GetTopic(int topicId)
    {
        var topic = await _context.ReadingTopics
            .AsNoTracking()
            .Include(t => t.Passages.Where(p => p.IsActive))
                .ThenInclude(p => p.Questions)
            .AsSplitQuery()
            .FirstOrDefaultAsync(t => t.Id == topicId && t.IsActive);

        if (topic == null)
            return NotFound(new { error = "Không tìm thấy topic Reading." });

        return Ok(BuildTopicDetailResponse(topic));
    }

    private object BuildTopicDetailResponse(ReadingTopic topic)
    {
        var passages = topic.Passages
            .OrderBy(p => p.DisplayOrder)
            .ThenBy(p => p.Id)
            .Select(p => new
            {
                p.Id,
                p.PublicId,
                p.Title,
                p.PartType,
                p.Difficulty,
                p.DisplayOrder,
                QuestionCount = p.Questions.Count,
                ShortDescription = BuildShortDescription(p.TextContent)
            });

        return new
        {
            topic.Id,
            topic.PublicId,
            topic.Title,
            topic.Description,
            topic.PartType,
            topic.Difficulty,
            topic.DisplayOrder,
            topic.IsPremiumRequired,
            PassageCount = topic.Passages.Count,
            QuestionCount = topic.Passages.Sum(p => p.Questions.Count),
            Passages = passages
        };
    }

    [HttpPost]
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

    [HttpPost("bulk")]
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

    [HttpPut("{topicId:int}")]
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

    [HttpPatch("{topicId:int}/toggle-active")]
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

    [HttpPatch("{topicId:int}/toggle-premium")]
    public async Task<IActionResult> ToggleTopicPremium(int topicId)
    {
        if (!await IsAdminAsync())
            return Forbid();

        var topic = await _context.ReadingTopics.FindAsync(topicId);
        if (topic == null)
            return NotFound(new { error = "Không tìm thấy topic Reading." });

        topic.IsPremiumRequired = !topic.IsPremiumRequired;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = topic.IsPremiumRequired ? "Đã đặt topic thành Premium." : "Đã đặt topic thành Free.",
            topicId,
            isPremiumRequired = topic.IsPremiumRequired
        });
    }

    [HttpDelete("{topicId:int}")]
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

    [HttpPut("bulk")]
    public async Task<IActionResult> UpdateTopicsBulk([FromBody] List<BulkUpdateReadingTopicItem> items)
    {
        if (!await IsAdminAsync())
            return Forbid();

        if (items == null || items.Count == 0)
            return BadRequest(new { error = "Danh sách topic không được để trống." });

        if (items.Count > 100)
            return BadRequest(new { error = "Chỉ được cập nhật tối đa 100 topic mỗi lần." });

        var ids = items.Select(i => i.Id).ToHashSet();
        var topics = await _context.ReadingTopics
            .Where(t => ids.Contains(t.Id))
            .ToDictionaryAsync(t => t.Id);

        var notFound = ids.Where(id => !topics.ContainsKey(id)).ToList();
        if (notFound.Count > 0)
            return NotFound(new
            {
                error = $"Không tìm thấy topic: {string.Join(", ", notFound)}",
                notFound
            });

        await using var transaction = await _context.Database.BeginTransactionAsync();

        foreach (var item in items)
        {
            var topic = topics[item.Id];

            if (!string.IsNullOrWhiteSpace(item.Title))
                topic.Title = item.Title.Trim();

            if (item.Description != null)
                topic.Description = string.IsNullOrWhiteSpace(item.Description) ? null : item.Description.Trim();

            if (item.Difficulty != null)
            {
                var diff = ParseDifficultyFilter(item.Difficulty);
                if (diff != null)
                    topic.Difficulty = diff;
                else if (IsAllFilter(item.Difficulty))
                    topic.Difficulty = null;
            }

            if (item.DisplayOrder.HasValue)
                topic.DisplayOrder = item.DisplayOrder.Value;
        }

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            message = $"Đã cập nhật {items.Count} topic.",
            count = items.Count,
            items = items.Select(i => new
            {
                i.Id,
                topics[i.Id].Title,
                topics[i.Id].Description,
                topics[i.Id].Difficulty,
                topics[i.Id].DisplayOrder
            })
        });
    }

    [HttpDelete("{topicId:int}/clear")]
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
}

// Request classes
public class UpsertReadingTopicRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public int PartType { get; set; }
    public string? Difficulty { get; set; }
    public int? DisplayOrder { get; set; }
    public bool? IsActive { get; set; }
}

public class BulkUpdateReadingTopicItem
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Difficulty { get; set; }
    public int? DisplayOrder { get; set; }
}
