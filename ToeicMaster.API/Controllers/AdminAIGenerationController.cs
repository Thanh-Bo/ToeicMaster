using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;

namespace ToeicMaster.API.Controllers;

public class AdminAIGenerationController : AdminBaseController
{
    private readonly AiExplanationService _aiService;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public AdminAIGenerationController(AppDbContext context, AiExplanationService aiService, IServiceScopeFactory serviceScopeFactory) : base(context)
    {
        _aiService = aiService;
        _serviceScopeFactory = serviceScopeFactory;
    }

    // ==========================================
    // EXPLANATION GENERATION
    // ==========================================

    [HttpPost("tests/{testId}/generate-explanations")]
    public async Task<IActionResult> GenerateExplanationsForTest(int testId)
    {
        if (!await IsAdminAsync()) return Forbid();

        var test = await _context.Tests.FindAsync(testId);
        if (test == null) return NotFound("Không tìm thấy bài test");

        var questions = await _context.Questions.Include(q => q.Group).ThenInclude(g => g.Part)
            .Include(q => q.Answers)
            .Where(q => q.Group.Part.TestId == testId && (q.ShortExplanation == null || q.FullExplanation == null))
            .ToListAsync();

        if (!questions.Any())
            return Ok(new { message = "Tất cả câu hỏi trong đề thi này đã có giải thích rồi.", taskId = "", totalUpdated = 0 });

        var taskId = $"explain_test_{testId}_{DateTime.UtcNow.Ticks}";
        TaskStatusTracker.TryAdd(taskId, new TaskStatusInfo { TaskId = taskId, Status = "processing", TotalItems = questions.Count, StartedAt = DateTime.UtcNow });
        _ = ProcessExplanationsInParallel(questions, testId, taskId);

        return Accepted(new { message = $"Bắt đầu xử lý {questions.Count} câu hỏi...", taskId, testId, totalQuestions = questions.Count, status = "processing" });
    }

    [HttpPost("tests/{testId}/parts/{partNumber}/generate-explanations")]
    public async Task<IActionResult> GenerateExplanationsForPart(int testId, int partNumber)
    {
        if (!await IsAdminAsync()) return Forbid();

        var test = await _context.Tests.FindAsync(testId);
        if (test == null) return NotFound("Không tìm thấy bài test");

        var questions = await _context.Questions.Include(q => q.Group).ThenInclude(g => g.Part)
            .Include(q => q.Answers)
            .Where(q => q.Group.Part.TestId == testId && q.Group.Part.PartNumber == partNumber && (q.ShortExplanation == null || q.FullExplanation == null))
            .ToListAsync();

        if (!questions.Any())
            return Ok(new { message = $"Tất cả câu hỏi trong Part {partNumber} đã có giải thích.", taskId = "", testId, partNumber, totalUpdated = 0 });

        var taskId = $"explain_test_{testId}_part_{partNumber}_{DateTime.UtcNow.Ticks}";
        TaskStatusTracker.TryAdd(taskId, new TaskStatusInfo { TaskId = taskId, Status = "processing", TotalItems = questions.Count, StartedAt = DateTime.UtcNow });
        _ = ProcessExplanationsInParallel(questions, testId, partNumber, taskId);

        return Accepted(new { message = $"Bắt đầu xử lý {questions.Count} câu hỏi trong Part {partNumber}...", taskId, testId, partNumber, totalQuestions = questions.Count, status = "processing" });
    }

    // ==========================================
    // TRANSLATION GENERATION
    // ==========================================

    [HttpPost("tests/{testId}/translate-transcripts")]
    public async Task<IActionResult> TranslateTranscriptsForTest(int testId)
    {
        if (!await IsAdminAsync()) return Forbid();
        var test = await _context.Tests.FindAsync(testId);
        if (test == null) return NotFound("Không tìm thấy bài test");

        var groups = await _context.QuestionGroups.Include(qg => qg.Part)
            .Where(qg => qg.Part.TestId == testId && (qg.Part.PartNumber == 3 || qg.Part.PartNumber == 4) && qg.Transcript != null && string.IsNullOrEmpty(qg.TranscriptTranslation))
            .ToListAsync();

        if (!groups.Any()) return Ok(new { message = "Tất cả Transcript đã được dịch rồi.", taskId = "", testId, totalTranslated = 0 });

        var taskId = $"translate_transcript_test_{testId}_{DateTime.UtcNow.Ticks}";
        TaskStatusTracker.TryAdd(taskId, new TaskStatusInfo { TaskId = taskId, Status = "processing", TotalItems = groups.Count, StartedAt = DateTime.UtcNow });
        _ = ProcessTranscriptTranslationsInParallel(groups, testId, taskId);

        return Accepted(new { message = $"Bắt đầu dịch {groups.Count} Transcript...", taskId, testId, totalGroups = groups.Count, status = "processing" });
    }

    [HttpPost("tests/{testId}/translate-passages")]
    public async Task<IActionResult> TranslatePassagesForTest(int testId)
    {
        if (!await IsAdminAsync()) return Forbid();
        var test = await _context.Tests.FindAsync(testId);
        if (test == null) return NotFound("Không tìm thấy bài test");

        var groups = await _context.QuestionGroups.Include(qg => qg.Part)
            .Where(qg => qg.Part.TestId == testId && (qg.Part.PartNumber == 6 || qg.Part.PartNumber == 7) && qg.TextContent != null && string.IsNullOrEmpty(qg.TextContentTranslation))
            .ToListAsync();

        if (!groups.Any()) return Ok(new { message = "Tất cả Passage đã được dịch rồi.", taskId = "", testId, totalTranslated = 0 });

        var taskId = $"translate_passage_test_{testId}_{DateTime.UtcNow.Ticks}";
        TaskStatusTracker.TryAdd(taskId, new TaskStatusInfo { TaskId = taskId, Status = "processing", TotalItems = groups.Count, StartedAt = DateTime.UtcNow });
        _ = ProcessPassageTranslationsInParallel(groups, testId, taskId);

        return Accepted(new { message = $"Bắt đầu dịch {groups.Count} Passage...", taskId, testId, totalGroups = groups.Count, status = "processing" });
    }

    [HttpPost("tests/{testId}/parts/{partNumber}/translate-transcripts")]
    public async Task<IActionResult> TranslateTranscriptsForPart(int testId, int partNumber)
    {
        if (!await IsAdminAsync()) return Forbid();
        if (partNumber != 3 && partNumber != 4) return BadRequest("Part Transcript chỉ có ở Part 3 hoặc Part 4");
        var test = await _context.Tests.FindAsync(testId);
        if (test == null) return NotFound("Không tìm thấy bài test");

        var groups = await _context.QuestionGroups.Include(qg => qg.Part)
            .Where(qg => qg.Part.TestId == testId && qg.Part.PartNumber == partNumber && qg.Transcript != null && string.IsNullOrEmpty(qg.TranscriptTranslation))
            .ToListAsync();

        if (!groups.Any()) return Ok(new { message = $"Tất cả Transcript Part {partNumber} đã được dịch.", taskId = "", testId, partNumber, totalTranslated = 0 });

        var taskId = $"translate_transcript_test_{testId}_part_{partNumber}_{DateTime.UtcNow.Ticks}";
        TaskStatusTracker.TryAdd(taskId, new TaskStatusInfo { TaskId = taskId, Status = "processing", TotalItems = groups.Count, StartedAt = DateTime.UtcNow });
        _ = ProcessTranscriptTranslationsInParallel(groups, testId, partNumber, taskId);

        return Accepted(new { message = $"Bắt đầu dịch {groups.Count} Transcript Part {partNumber}...", taskId, testId, partNumber, totalGroups = groups.Count, status = "processing" });
    }

    [HttpPost("tests/{testId}/parts/{partNumber}/translate-passages")]
    public async Task<IActionResult> TranslatePassagesForPart(int testId, int partNumber)
    {
        if (!await IsAdminAsync()) return Forbid();
        if (partNumber != 6 && partNumber != 7) return BadRequest("Part Passage chỉ có ở Part 6 hoặc Part 7");
        var test = await _context.Tests.FindAsync(testId);
        if (test == null) return NotFound("Không tìm thấy bài test");

        var groups = await _context.QuestionGroups.Include(qg => qg.Part)
            .Where(qg => qg.Part.TestId == testId && qg.Part.PartNumber == partNumber && qg.TextContent != null && string.IsNullOrEmpty(qg.TextContentTranslation))
            .ToListAsync();

        if (!groups.Any()) return Ok(new { message = $"Tất cả Passage Part {partNumber} đã được dịch.", taskId = "", testId, partNumber, totalTranslated = 0 });

        var taskId = $"translate_passage_test_{testId}_part_{partNumber}_{DateTime.UtcNow.Ticks}";
        TaskStatusTracker.TryAdd(taskId, new TaskStatusInfo { TaskId = taskId, Status = "processing", TotalItems = groups.Count, StartedAt = DateTime.UtcNow });
        _ = ProcessPassageTranslationsInParallel(groups, testId, partNumber, taskId);

        return Accepted(new { message = $"Bắt đầu dịch {groups.Count} Passage Part {partNumber}...", taskId, testId, partNumber, totalGroups = groups.Count, status = "processing" });
    }

    // ==========================================
    // BACKGROUND PROCESSING (PRIVATE)
    // ==========================================

    private async Task ProcessExplanationsInParallel(List<Question> questions, int testId, string taskId)
    {
        await ProcessBatch(questions, testId, taskId, async (question, ctx) =>
        {
            var (shortExp, fullExp) = await _aiService.GenerateExplanationAsync(question, question.Answers.ToList());
            var tracked = await ctx.Questions.FindAsync(question.Id);
            if (tracked != null) { tracked.ShortExplanation = shortExp; tracked.FullExplanation = fullExp; }
        });
    }

    private async Task ProcessExplanationsInParallel(List<Question> questions, int testId, int partNumber, string taskId)
    {
        await ProcessBatch(questions, testId, taskId, async (question, ctx) =>
        {
            var (shortExp, fullExp) = await _aiService.GenerateExplanationAsync(question, question.Answers.ToList());
            var tracked = await ctx.Questions.FindAsync(question.Id);
            if (tracked != null) { tracked.ShortExplanation = shortExp; tracked.FullExplanation = fullExp; }
        });
    }

    private async Task ProcessTranscriptTranslationsInParallel(List<QuestionGroup> groups, int testId, string taskId)
    {
        await ProcessBatch(groups, testId, taskId, async (group, ctx) =>
        {
            var translation = await _aiService.TranslatePassageAsync(group.Transcript ?? "");
            if (!string.IsNullOrEmpty(translation)) { var tracked = await ctx.QuestionGroups.FindAsync(group.Id); if (tracked != null) tracked.TranscriptTranslation = translation; }
        });
    }

    private async Task ProcessTranscriptTranslationsInParallel(List<QuestionGroup> groups, int testId, int partNumber, string taskId)
    {
        await ProcessBatch(groups, testId, taskId, async (group, ctx) =>
        {
            var translation = await _aiService.TranslatePassageAsync(group.Transcript ?? "");
            if (!string.IsNullOrEmpty(translation)) { var tracked = await ctx.QuestionGroups.FindAsync(group.Id); if (tracked != null) tracked.TranscriptTranslation = translation; }
        });
    }

    private async Task ProcessPassageTranslationsInParallel(List<QuestionGroup> groups, int testId, string taskId)
    {
        await ProcessBatch(groups, testId, taskId, async (group, ctx) =>
        {
            var translation = await _aiService.TranslatePassageAsync(group.TextContent ?? "");
            if (!string.IsNullOrEmpty(translation)) { var tracked = await ctx.QuestionGroups.FindAsync(group.Id); if (tracked != null) tracked.TextContentTranslation = translation; }
        });
    }

    private async Task ProcessPassageTranslationsInParallel(List<QuestionGroup> groups, int testId, int partNumber, string taskId)
    {
        await ProcessBatch(groups, testId, taskId, async (group, ctx) =>
        {
            var translation = await _aiService.TranslatePassageAsync(group.TextContent ?? "");
            if (!string.IsNullOrEmpty(translation)) { var tracked = await ctx.QuestionGroups.FindAsync(group.Id); if (tracked != null) tracked.TextContentTranslation = translation; }
        });
    }

    private async Task ProcessBatch<T>(List<T> items, int contextId, string taskId, Func<T, AppDbContext, Task> processor, int batchSize = 5, int delayMs = 1000)
    {
        int success = 0, errors = 0;
        try
        {
            for (int i = 0; i < items.Count; i += batchSize)
            {
                var batch = items.Skip(i).Take(batchSize).ToList();
                var tasks = batch.Select(async item =>
                {
                    using var scope = _serviceScopeFactory.CreateScope();
                    var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    try
                    {
                        await processor(item, ctx);
                        await ctx.SaveChangesAsync();
                        ctx.ChangeTracker.Clear();
                        if (TaskStatusTracker.TryGetValue(taskId, out var s)) s.CompletedItems++;
                        return true;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error: {ex.Message}");
                        ctx.ChangeTracker.Clear();
                        if (TaskStatusTracker.TryGetValue(taskId, out var s)) s.ErrorItems++;
                        return false;
                    }
                }).ToList();

                var results = await Task.WhenAll(tasks);
                success += results.Count(r => r);
                errors += results.Count(r => !r);
                if (i + batchSize < items.Count) await Task.Delay(delayMs);
            }
        }
        catch (Exception ex) { Console.WriteLine($"Batch error: {ex.Message}"); }

        if (TaskStatusTracker.TryGetValue(taskId, out var status)) { status.Status = "completed"; status.CompletedAt = DateTime.UtcNow; }
        Console.WriteLine($"Task {taskId}: {success} success, {errors} errors");
    }
}
