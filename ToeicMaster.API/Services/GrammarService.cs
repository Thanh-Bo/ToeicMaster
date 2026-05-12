using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models;
using ToeicMaster.API.Models.Grammar;
using Microsoft.EntityFrameworkCore;

namespace ToeicMaster.API.Services;

public class GrammarService : IGrammarService
{
    private readonly AppDbContext _context;
    private readonly ILogger<GrammarService> _logger;

    public GrammarService(AppDbContext context, ILogger<GrammarService> logger)
    {
        _context = context;
        _logger = logger;
    }

    // ==========================================
    // GRAMMAR GROUPS (Layer 1)
    // ==========================================

    public async Task<List<GrammarGroupDto>> GetAllGrammarGroupsAsync()
    {
        try
        {
            var groups = await _context.GrammarGroups
                .OrderBy(g => g.Order)
                .ToListAsync();

            return groups.Select(g => MapGrammarGroupToDto(g)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar groups: {ex.Message}");
            return new List<GrammarGroupDto>();
        }
    }

    public async Task<GrammarGroupDto?> GetGrammarGroupByIdAsync(int id)
    {
        try
        {
            var group = await _context.GrammarGroups
                .FirstOrDefaultAsync(g => g.Id == id);

            return group != null ? MapGrammarGroupToDto(group) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar group {id}: {ex.Message}");
            return null;
        }
    }

    public async Task<GrammarGroup> CreateGrammarGroupAsync(AddGrammarGroupRequest request)
    {
        try
        {
            var group = new GrammarGroup
            {
                Title = request.Title ?? "Untitled",
                Description = request.Description,
                Order = request.Order ?? 0,
                CreatedAt = DateTime.UtcNow
            };

            _context.GrammarGroups.Add(group);
            await _context.SaveChangesAsync();

            return group;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammar group: {ex.Message}");
            throw;
        }
    }

    public async Task<GrammarGroup?> UpdateGrammarGroupAsync(int id, UpdateGrammarGroupRequest request)
    {
        try
        {
            var group = await _context.GrammarGroups.FindAsync(id);
            if (group == null) return null;

            if (!string.IsNullOrEmpty(request.Title)) group.Title = request.Title;
            if (request.Description != null) group.Description = request.Description;
            if (request.Order.HasValue) group.Order = request.Order.Value;

            await _context.SaveChangesAsync();
            return group;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating grammar group {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> DeleteGrammarGroupAsync(int id)
    {
        try
        {
            var group = await _context.GrammarGroups.FindAsync(id);
            if (group == null) return false;

            _context.GrammarGroups.Remove(group);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting grammar group {id}: {ex.Message}");
            throw;
        }
    }

    // ==========================================
    // GRAMMAR TOPICS (Layer 2)
    // ==========================================

    public async Task<List<GrammarTopicDto>> GetAllGrammarTopicsAsync(int? userId = null)
    {
        try
        {
            var topics = await _context.GrammarTopics
                .OrderBy(t => t.Title)
                .ToListAsync();

            return topics.Select(t => MapGrammarTopicToDto(t, userId)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar topics: {ex.Message}");
            return new List<GrammarTopicDto>();
        }
    }

    public async Task<List<GrammarTopicDto>> GetGrammarsByGroupIdAsync(int groupId, int? userId = null)
    {
        try
        {
            var topics = await _context.GrammarTopics
                .Where(t => t.GroupId == groupId)
                .OrderBy(t => t.Title)
                .ToListAsync();

            return topics.Select(t => MapGrammarTopicToDto(t, userId)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar topics for group {groupId}: {ex.Message}");
            return new List<GrammarTopicDto>();
        }
    }

    public async Task<GrammarTopicDto?> GetGrammarTopicByIdAsync(int id, int? userId = null)
    {
        try
        {
            var topic = await _context.GrammarTopics
                .FirstOrDefaultAsync(t => t.Id == id);

            return topic != null ? MapGrammarTopicToDto(topic, userId) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar topic {id}: {ex.Message}");
            return null;
        }
    }

    public async Task<GrammarTopic> CreateGrammarTopicAsync(int groupId, AddGrammarTopicRequest request)
    {
        try
        {
            var topic = new GrammarTopic
            {
                GroupId = groupId,
                Title = request.Title ?? "Untitled",
                Description = request.Description,
                ImageUrl = request.ImageUrl,
                Level = request.Level ?? "Basic",
                LevelRange = request.LevelRange ?? "0-450",
                Category = request.Category ?? "General"
            };

            _context.GrammarTopics.Add(topic);
            await _context.SaveChangesAsync();

            return topic;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammar topic: {ex.Message}");
            throw;
        }
    }

    public async Task<List<GrammarTopic>> CreateGrammarTopicsAsync(int groupId, List<AddGrammarTopicRequest> requests)
    {
        try
        {
            var topics = new List<GrammarTopic>();
            
            foreach (var request in requests)
            {
                var topic = new GrammarTopic
                {
                    GroupId = groupId,
                    Title = request.Title ?? "Untitled",
                    Description = request.Description,
                    ImageUrl = request.ImageUrl,
                    Level = request.Level ?? "Basic",
                    LevelRange = request.LevelRange ?? "0-450",
                    Category = request.Category ?? "General"
                };

                _context.GrammarTopics.Add(topic);
                topics.Add(topic);
            }

            await _context.SaveChangesAsync();
            return topics;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammar topics: {ex.Message}");
            throw;
        }
    }

    public async Task<GrammarTopic?> UpdateGrammarTopicAsync(int id, UpdateGrammarTopicRequest request)
    {
        try
        {
            var topic = await _context.GrammarTopics.FindAsync(id);
            if (topic == null) return null;

            if (!string.IsNullOrEmpty(request.Title)) topic.Title = request.Title;
            if (request.Description != null) topic.Description = request.Description;
            if (request.ImageUrl != null) topic.ImageUrl = request.ImageUrl;
            if (!string.IsNullOrEmpty(request.Level)) topic.Level = request.Level;
            if (!string.IsNullOrEmpty(request.LevelRange)) topic.LevelRange = request.LevelRange;
            if (!string.IsNullOrEmpty(request.Category)) topic.Category = request.Category;

            await _context.SaveChangesAsync();
            return topic;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating grammar topic {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> DeleteGrammarTopicAsync(int id)
    {
        try
        {
            var topic = await _context.GrammarTopics.FindAsync(id);
            if (topic == null) return false;

            _context.GrammarTopics.Remove(topic);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting grammar topic {id}: {ex.Message}");
            throw;
        }
    }

    // ==========================================
    // GRAMMARS (Layer 3)
    // ==========================================

    public async Task<List<GrammarDto>> GetGrammarsByTopicIdAsync(int topicId)
    {
        try
        {
            var grammars = await _context.Grammars
                .Where(g => g.TopicId == topicId)
                .Include(g => g.GrammarExamples)
                .Include(g => g.Topic)
                .OrderBy(g => g.RuleName)
                .ToListAsync();

            return grammars.Select(g => MapGrammarToDto(g)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammars for topic {topicId}: {ex.Message}");
            return new List<GrammarDto>();
        }
    }

    public async Task<GrammarDto?> GetGrammarByIdAsync(int id)
    {
        try
        {
            var grammar = await _context.Grammars
                .Include(g => g.GrammarExamples)
                .Include(g => g.Topic)
                .FirstOrDefaultAsync(g => g.Id == id);

            return grammar != null ? MapGrammarToDto(grammar) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar {id}: {ex.Message}");
            return null;
        }
    }

    public async Task<Grammar> CreateGrammarAsync(AddGrammarRequest request)
    {
        try
        {
            var grammar = new Grammar
            {
                TopicId = request.TopicId ?? 0,
                RuleName = request.RuleName ?? "Untitled",
                Structure = request.Structure,
                Meaning = request.Meaning ?? "No meaning provided",
                Example = request.Example,
                ExampleTranslation = request.ExampleTranslation,
                AudioUrl = request.AudioUrl,
                ImageUrl = request.ImageUrl,
                CommonMistakes = request.CommonMistakes,
                Difficulty = request.Difficulty ?? 0,
                NegativeExample = request.NegativeExample,
                NegativeExampleTranslation = request.NegativeExampleTranslation,
                TestTip = request.TestTip,
                Frequency = request.Frequency,
                RelatedRuleIds = request.RelatedRuleIds,
                CreatedAt = DateTime.UtcNow
            };

            _context.Grammars.Add(grammar);
            await _context.SaveChangesAsync();

            if (request.GrammarExamples != null && request.GrammarExamples.Any())
            {
                foreach (var example in request.GrammarExamples)
                {
                    var grammarExample = new GrammarExample
                    {
                        GrammarId = grammar.Id,
                        Sentence = example.Example, // Map Example → Sentence
                        Translation = example.ExampleTranslation, // Map ExampleTranslation → Translation
                        Context = example.Explanation, // Map Explanation → Context
                        AudioUrl = example.AudioUrl
                    };
                    _context.GrammarExamples.Add(grammarExample);
                }
                await _context.SaveChangesAsync();
            }

            return grammar;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammar: {ex.Message}");
            throw;
        }
    }

    public async Task<BulkAddGrammarResponse> CreateGrammarsAsync(BulkAddGrammarRequest request)
    {
        var response = new BulkAddGrammarResponse();

        try
        {
            if (request.Rules == null || !request.Rules.Any())
            {
                response.Errors.Add("Danh sách quy tắc không được để trống");
                return response;
            }

            foreach (var rule in request.Rules)
            {
                try
                {
                    var grammarRequest = new AddGrammarRequest
                    {
                        TopicId = request.TopicId,
                        RuleName = rule.RuleName,
                        Structure = rule.Structure,
                        Meaning = rule.Meaning,
                        Example = rule.Example,
                        ExampleTranslation = rule.ExampleTranslation,
                        AudioUrl = rule.AudioUrl,
                        ImageUrl = rule.ImageUrl,
                        CommonMistakes = rule.CommonMistakes,
                        Difficulty = rule.Difficulty,
                        NegativeExample = rule.NegativeExample,
                        NegativeExampleTranslation = rule.NegativeExampleTranslation,
                        TestTip = rule.TestTip,
                        Frequency = rule.Frequency,
                        RelatedRuleIds = rule.RelatedRuleIds,
                        GrammarExamples = rule.GrammarExamples
                    };

                    var grammar = await CreateGrammarAsync(grammarRequest);
                    response.CreatedRules.Add(MapGrammarToDto(grammar));
                    response.TotalCreated++;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error creating grammar rule: {ex.Message}");
                    response.Errors.Add($"Lỗi tạo quy tắc '{rule.RuleName}': {ex.Message}");
                }
            }

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammars in bulk: {ex.Message}");
            response.Errors.Add($"Lỗi tạo quy tắc hàng loạt: {ex.Message}");
            return response;
        }
    }

    public async Task<Grammar?> UpdateGrammarAsync(int id, UpdateGrammarRequest request)
    {
        try
        {
            var grammar = await _context.Grammars
                .Include(g => g.GrammarExamples)
                .FirstOrDefaultAsync(g => g.Id == id);
            
            if (grammar == null) return null;

            if (!string.IsNullOrEmpty(request.RuleName)) grammar.RuleName = request.RuleName;
            if (request.Structure != null) grammar.Structure = request.Structure;
            if (!string.IsNullOrEmpty(request.Meaning)) grammar.Meaning = request.Meaning;
            if (request.Example != null) grammar.Example = request.Example;
            if (request.ExampleTranslation != null) grammar.ExampleTranslation = request.ExampleTranslation;
            if (request.AudioUrl != null) grammar.AudioUrl = request.AudioUrl;
            if (request.ImageUrl != null) grammar.ImageUrl = request.ImageUrl;
            if (request.CommonMistakes != null) grammar.CommonMistakes = request.CommonMistakes;
            if (request.Difficulty.HasValue) grammar.Difficulty = request.Difficulty.Value;
            if (request.NegativeExample != null) grammar.NegativeExample = request.NegativeExample;
            if (request.NegativeExampleTranslation != null) grammar.NegativeExampleTranslation = request.NegativeExampleTranslation;
            if (request.TestTip != null) grammar.TestTip = request.TestTip;
            if (request.Frequency.HasValue) grammar.Frequency = request.Frequency.Value;
            if (request.RelatedRuleIds != null) grammar.RelatedRuleIds = request.RelatedRuleIds;
            if (request.TopicId.HasValue) grammar.TopicId = request.TopicId.Value;

            await _context.SaveChangesAsync();
            return grammar;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating grammar {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<BulkUpdateGrammarResponse> UpdateGrammarsAsync(BulkUpdateGrammarRequest request)
    {
        var response = new BulkUpdateGrammarResponse();

        try
        {
            foreach (var ruleItem in request.Rules)
            {
                try
                {
                    var grammar = await _context.Grammars
                        .Include(g => g.GrammarExamples)
                        .FirstOrDefaultAsync(g => g.Id == ruleItem.Id);

                    if (grammar == null)
                    {
                        response.Errors.Add($"Grammar with ID {ruleItem.Id} not found");
                        continue;
                    }

                    // Update fields if provided
                    if (!string.IsNullOrEmpty(ruleItem.RuleName)) grammar.RuleName = ruleItem.RuleName;
                    if (ruleItem.Structure != null) grammar.Structure = ruleItem.Structure;
                    if (!string.IsNullOrEmpty(ruleItem.Meaning)) grammar.Meaning = ruleItem.Meaning;
                    if (ruleItem.Example != null) grammar.Example = ruleItem.Example;
                    if (ruleItem.ExampleTranslation != null) grammar.ExampleTranslation = ruleItem.ExampleTranslation;
                    if (ruleItem.AudioUrl != null) grammar.AudioUrl = ruleItem.AudioUrl;
                    if (ruleItem.ImageUrl != null) grammar.ImageUrl = ruleItem.ImageUrl;
                    if (ruleItem.CommonMistakes != null) grammar.CommonMistakes = ruleItem.CommonMistakes;
                    if (ruleItem.Difficulty.HasValue) grammar.Difficulty = ruleItem.Difficulty.Value;
                    if (ruleItem.NegativeExample != null) grammar.NegativeExample = ruleItem.NegativeExample;
                    if (ruleItem.NegativeExampleTranslation != null) grammar.NegativeExampleTranslation = ruleItem.NegativeExampleTranslation;
                    if (ruleItem.TestTip != null) grammar.TestTip = ruleItem.TestTip;
                    if (ruleItem.Frequency.HasValue) grammar.Frequency = ruleItem.Frequency.Value;
                    if (ruleItem.RelatedRuleIds != null) grammar.RelatedRuleIds = ruleItem.RelatedRuleIds;

                    // Update GrammarExamples if provided
                    if (ruleItem.GrammarExamples?.Count > 0)
                    {
                        // Remove old examples
                        _context.GrammarExamples.RemoveRange(grammar.GrammarExamples);

                        // Add new examples
                        var examples = ruleItem.GrammarExamples.Select(ex => new GrammarExample
                        {
                            GrammarId = grammar.Id,
                            Sentence = ex.Example,
                            Translation = ex.ExampleTranslation,
                            Context = ex.Explanation,
                            AudioUrl = ex.AudioUrl
                        }).ToList();

                        grammar.GrammarExamples = examples;
                    }

                    _context.Grammars.Update(grammar);
                    response.UpdatedRules.Add(MapGrammarToDto(grammar));
                }
                catch (Exception ex)
                {
                    response.Errors.Add($"Error updating rule {ruleItem.Id}: {ex.Message}");
                }
            }

            await _context.SaveChangesAsync();
            response.TotalUpdated = response.UpdatedRules.Count;
            _logger.LogInformation($"Bulk updated {response.TotalUpdated} grammars for topic {request.TopicId}");
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error in bulk update: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> DeleteGrammarAsync(int id)
    {
        try
        {
            var grammar = await _context.Grammars.FindAsync(id);
            if (grammar == null) return false;

            _context.Grammars.Remove(grammar);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting grammar {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<int> DeleteAllGrammarsByTopicAsync(int topicId)
    {
        try
        {
            var grammars = await _context.Grammars
                .Where(g => g.TopicId == topicId)
                .ToListAsync();

            if (grammars.Count == 0) return 0;

            _context.Grammars.RemoveRange(grammars);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Deleted {grammars.Count} grammars for topic {topicId}");
            return grammars.Count;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting all grammars for topic {topicId}: {ex.Message}");
            throw;
        }
    }

    public async Task<List<GrammarDto>> SearchGrammarsAsync(string keyword)
    {
        try
        {
            var grammars = await _context.Grammars
                .Where(g => g.RuleName.Contains(keyword) || 
                           g.Meaning.Contains(keyword) ||
                           g.Example != null && g.Example.Contains(keyword))
                .Include(g => g.GrammarExamples)
                .Include(g => g.Topic)
                .ToListAsync();

            return grammars.Select(g => MapGrammarToDto(g)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error searching grammars: {ex.Message}");
            return new List<GrammarDto>();
        }
    }

    // ==========================================
    // GRAMMAR EXAMPLES
    // ==========================================

    public async Task<List<GrammarExampleDto>> GetGrammarExamplesAsync(int grammarId)
    {
        try
        {
            var examples = await _context.GrammarExamples
                .Where(e => e.GrammarId == grammarId)
                .ToListAsync();

            return examples.Select(e => new GrammarExampleDto
            {
                Id = e.Id,
                GrammarId = e.GrammarId,
                Sentence = e.Sentence,
                Translation = e.Translation,
                Context = e.Context,
                AudioUrl = e.AudioUrl
            }).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar examples for {grammarId}: {ex.Message}");
            return new List<GrammarExampleDto>();
        }
    }

    public async Task<GrammarExample> AddGrammarExampleAsync(int grammarId, GrammarExampleDto request)
    {
        try
        {
            var example = new GrammarExample
            {
                GrammarId = grammarId,
                Sentence = request.Sentence,
                Translation = request.Translation,
                Context = request.Context,
                AudioUrl = request.AudioUrl
            };

            _context.GrammarExamples.Add(example);
            await _context.SaveChangesAsync();
            return example;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error adding grammar example: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> DeleteGrammarExampleAsync(int id)
    {
        try
        {
            var example = await _context.GrammarExamples.FindAsync(id);
            if (example == null) return false;

            _context.GrammarExamples.Remove(example);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting grammar example {id}: {ex.Message}");
            throw;
        }
    }

    // ==========================================
    // USER GRAMMAR PROGRESS (Spaced Repetition)
    // ==========================================

    public async Task<UserGrammarProgressDto?> GetUserGrammarProgressAsync(int userId, int grammarId)
    {
        try
        {
            var progress = await _context.UserGrammars
                .Include(ug => ug.Grammar!.GrammarExamples)
                .Include(ug => ug.Grammar!.Topic)
                .FirstOrDefaultAsync(ug => ug.UserId == userId && ug.GrammarId == grammarId);

            return progress != null ? MapUserGrammarToDto(progress) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting user grammar progress: {ex.Message}");
            return null;
        }
    }

    public async Task<List<UserGrammarProgressDto>> GetUserGrammarsProgressAsync(int userId)
    {
        try
        {
            var progresses = await _context.UserGrammars
                .Where(ug => ug.UserId == userId)
                .Include(ug => ug.Grammar!.GrammarExamples)
                .Include(ug => ug.Grammar!.Topic)
                .OrderBy(ug => ug.LastReviewedAt)
                .ToListAsync();

            return progresses.Select(p => MapUserGrammarToDto(p)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting user grammar progress list: {ex.Message}");
            return new List<UserGrammarProgressDto>();
        }
    }

    public async Task<UserGrammar> UpdateUserGrammarProgressAsync(int userId, int grammarId, UpdateGrammarProgressRequest request)
    {
        try
        {
            var progress = await _context.UserGrammars
                .FirstOrDefaultAsync(ug => ug.UserId == userId && ug.GrammarId == grammarId);

            var isCorrect = request.IsCorrect ?? false;
            var level = request.Level ?? 0;
            var durationSeconds = request.DurationSeconds ?? 0;

            if (progress == null)
            {
                // Create new progress entry
                progress = new UserGrammar
                {
                    UserId = userId,
                    GrammarId = grammarId,
                    Status = isCorrect ? 1 : 0,
                    CorrectStreak = isCorrect ? 1 : 0,
                    ReviewCount = 1,
                    Level = level,
                    TotalQuestionsAnswered = 1,
                    TotalCorrectAnswers = isCorrect ? 1 : 0,
                    TotalStudyTimeSeconds = durationSeconds,
                    FirstLearnedAt = DateTime.UtcNow,
                    NextReviewAt = request.NextReviewAt,
                    LastReviewedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                };
                _context.UserGrammars.Add(progress);
            }
            else
            {
                // Update existing progress
                if (isCorrect)
                {
                    progress.CorrectStreak++;
                    progress.Status = 1; // Learning
                    if (progress.CorrectStreak >= 5)
                        progress.Status = 3; // Mastered
                }
                else
                {
                    progress.CorrectStreak = 0;
                    progress.Status = 0; // New
                }

                progress.ReviewCount++;
                progress.Level = level;
                progress.TotalQuestionsAnswered++;
                progress.TotalCorrectAnswers += isCorrect ? 1 : 0;
                progress.TotalStudyTimeSeconds += durationSeconds;
                progress.NextReviewAt = request.NextReviewAt;
                progress.LastReviewedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return progress;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating user grammar progress: {ex.Message}");
            throw;
        }
    }

    public async Task<List<GrammarDto>> GetGrammarsForReviewAsync(int userId, int count = 20)
    {
        try
        {
            var now = DateTime.UtcNow;

            var grammarsToReview = await _context.UserGrammars
                .Where(ug => ug.UserId == userId && 
                            ug.NextReviewAt <= now &&
                            ug.Status != 3) // Not mastered
                .Include(ug => ug.Grammar!.GrammarExamples)
                .Include(ug => ug.Grammar!.Topic)
                .OrderBy(ug => ug.NextReviewAt)
                .Take(count)
                .Select(ug => ug.Grammar!)
                .ToListAsync();

            return grammarsToReview.Select(g => MapGrammarToDto(g)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammars for review: {ex.Message}");
            return new List<GrammarDto>();
        }
    }

    public async Task<int> GetUserMasteredGrammarsCountAsync(int userId)
    {
        try
        {
            return await _context.UserGrammars
                .CountAsync(ug => ug.UserId == userId && ug.Status == 3);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting mastered grammars count: {ex.Message}");
            return 0;
        }
    }

    /// <summary>
    /// Mark grammar as learned when user views the lesson (Option A)
    /// </summary>
    public async Task<UserGrammar> MarkGrammarAsLearnedAsync(int userId, int grammarId)
    {
        try
        {
            var progress = await _context.UserGrammars
                .FirstOrDefaultAsync(ug => ug.UserId == userId && ug.GrammarId == grammarId);

            if (progress == null)
            {
                // Create new progress entry with Status = 1 (Learning)
                progress = new UserGrammar
                {
                    UserId = userId,
                    GrammarId = grammarId,
                    Status = 1, // Learning
                    CorrectStreak = 0,
                    ReviewCount = 0,
                    Level = 0,
                    NextReviewAt = DateTime.UtcNow.AddDays(1), // Review tomorrow
                    LastReviewedAt = null,
                    CreatedAt = DateTime.UtcNow
                };
                _context.UserGrammars.Add(progress);
            }
            else if (progress.Status == 0)
            {
                // Update from "New" to "Learning" if not already learned
                progress.Status = 1;
                if (progress.NextReviewAt == null)
                {
                    progress.NextReviewAt = DateTime.UtcNow.AddDays(1);
                }
            }

            await _context.SaveChangesAsync();
            return progress;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error marking grammar as learned: {ex.Message}");
            throw;
        }
    }

    // ==========================================
    // GRAMMAR QUESTIONS
    // ==========================================

    public async Task<List<QuestionGrammarDto>> GetGrammarQuestionsByTopicAsync(int topicId, int page = 1, int pageSize = 20)
    {
        try
        {
            var skip = (page - 1) * pageSize;
            var questions = await _context.QuestionGrammars
                .Where(q => q.TopicId == topicId)
                .Include(q => q.Answers)
                .OrderBy(q => q.QuestionNo)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            return questions.Select(q => MapQuestionGrammarToDto(q)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar questions: {ex.Message}");
            return new List<QuestionGrammarDto>();
        }
    }

    public async Task<QuestionGrammarDto?> GetGrammarQuestionByIdAsync(int id)
    {
        try
        {
            var question = await _context.QuestionGrammars
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == id);

            return question != null ? MapQuestionGrammarToDto(question) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar question {id}: {ex.Message}");
            return null;
        }
    }

    public async Task<List<QuestionGrammarDto>> GetGrammarQuestionsByModeAsync(int topicId, string mode, int count = 20)
    {
        try
        {
            var questions = await _context.QuestionGrammars
                .Where(q => q.TopicId == topicId && q.Mode == mode)
                .Include(q => q.Answers)
                .OrderBy(q => q.QuestionNo)
                .Take(count)
                .ToListAsync();

            return questions.Select(q => MapQuestionGrammarToDto(q)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar questions by mode {mode} for topic {topicId}: {ex.Message}");
            return new List<QuestionGrammarDto>();
        }
    }

    public async Task<List<QuestionGrammarDto>> GetGrammarQuestionsByGrammarIdAsync(int grammarId, string? mode = null, int page = 1, int pageSize = 20)
    {
        try
        {
            var query = _context.QuestionGrammars
                .Include(q => q.Answers)
                .Where(q => q.GrammarId == grammarId);
            
            // Filter by mode if provided
            if (!string.IsNullOrEmpty(mode))
            {
                query = query.Where(q => q.Mode == mode.ToLower());
            }
            
            // Get total count BEFORE pagination
            var totalCount = await query.CountAsync();
            
            // Then apply pagination
            var questions = await query
                .OrderBy(q => q.QuestionNo)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            
            return questions.Select(q => MapQuestionGrammarToDto(q)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar questions by grammarId {grammarId}: {ex.Message}");
            return new List<QuestionGrammarDto>();
        }
    }

    public async Task<int> GetGrammarQuestionCountAsync(int grammarId, string? mode = null)
    {
        try
        {
            var query = _context.QuestionGrammars
                .Where(q => q.GrammarId == grammarId);
            
            // Filter by mode if provided
            if (!string.IsNullOrEmpty(mode))
            {
                query = query.Where(q => q.Mode == mode.ToLower());
            }
            
            return await query.CountAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar question count for grammarId {grammarId}: {ex.Message}");
            return 0;
        }
    }

    public async Task<QuestionGrammar> CreateGrammarQuestionAsync(int grammarId, QuestionGrammarImportItemDto request)
    {
        try
        {
            // Get Grammar to retrieve TopicId
            var grammar = await _context.Grammars.FindAsync(grammarId);
            if (grammar == null)
            {
                throw new Exception($"Grammar with Id {grammarId} not found");
            }

            var question = new QuestionGrammar
            {
                GrammarId = grammarId,
                TopicId = grammar.TopicId,  // Tự động lấy TopicId từ Grammar
                QuestionNo = request.QuestionNo ?? 0,
                Content = request.Content ?? "No content",
                CorrectOption = request.CorrectOption ?? "A",
                ShortExplanation = request.ShortExplanation,
                LongExplanation = request.LongExplanation,
                Mode = request.Mode ?? "medium"  // Lấy từ request hoặc default
            };

            _context.QuestionGrammars.Add(question);
            await _context.SaveChangesAsync();

            // Add answer options
            if (request.Options != null && request.Options.Any())
            {
                var labels = new[] { "A", "B", "C", "D" };
                for (int i = 0; i < request.Options.Count; i++)
                {
                    var answer = new QuestionGrammarAnswer
                    {
                        QuestionGrammarId = question.Id,
                        Label = labels[i],
                        Content = request.Options[i],
                        IsCorrect = labels[i] == request.CorrectOption
                    };
                    _context.QuestionGrammarAnswers.Add(answer);
                }
                await _context.SaveChangesAsync();
            }

            return question;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammar question: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> DeleteGrammarQuestionAsync(int id)
    {
        try
        {
            var question = await _context.QuestionGrammars.FindAsync(id);
            if (question == null) return false;

            _context.QuestionGrammars.Remove(question);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting grammar question {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<QuestionGrammar?> UpdateGrammarQuestionAsync(int id, QuestionGrammarImportItemDto request)
    {
        try
        {
            var question = await _context.QuestionGrammars
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == id);
            
            if (question == null) return null;

            // Update question fields
            if (!string.IsNullOrEmpty(request.Content)) question.Content = request.Content;
            if (!string.IsNullOrEmpty(request.CorrectOption)) question.CorrectOption = request.CorrectOption;
            if (request.QuestionNo.HasValue) question.QuestionNo = request.QuestionNo.Value;
            if (!string.IsNullOrEmpty(request.ShortExplanation)) question.ShortExplanation = request.ShortExplanation;
            if (!string.IsNullOrEmpty(request.LongExplanation)) question.LongExplanation = request.LongExplanation;
            if (!string.IsNullOrEmpty(request.Mode)) question.Mode = request.Mode.ToLower();

            // Update answers if provided
            if (request.Options != null && request.Options.Count == 4)
            {
                // Remove old answers
                _context.QuestionGrammarAnswers.RemoveRange(question.Answers);

                // Add new answers
                var labels = new[] { "A", "B", "C", "D" };
                for (int i = 0; i < request.Options.Count; i++)
                {
                    var answer = new QuestionGrammarAnswer
                    {
                        QuestionGrammarId = question.Id,
                        Label = labels[i],
                        Content = request.Options[i],
                        IsCorrect = labels[i] == request.CorrectOption
                    };
                    _context.QuestionGrammarAnswers.Add(answer);
                }
            }

            await _context.SaveChangesAsync();
            return question;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating grammar question {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<int> DeleteAllQuestionsByGrammarIdAsync(int grammarId)
    {
        try
        {
            var questions = await _context.QuestionGrammars
                .Where(q => q.GrammarId == grammarId)
                .ToListAsync();

            if (questions.Count == 0) return 0;

            _context.QuestionGrammars.RemoveRange(questions);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Deleted {questions.Count} questions for grammar {grammarId}");
            return questions.Count;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting all questions for grammar {grammarId}: {ex.Message}");
            throw;
        }
    }

    public async Task<int> DeleteQuestionsByGrammarIdAndModeAsync(int grammarId, string mode)
    {
        try
        {
            var questions = await _context.QuestionGrammars
                .Where(q => q.GrammarId == grammarId && q.Mode == mode)
                .ToListAsync();

            if (questions.Count == 0) return 0;

            _context.QuestionGrammars.RemoveRange(questions);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Deleted {questions.Count} questions with mode '{mode}' for grammar {grammarId}");
            return questions.Count;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting questions by mode for grammar {grammarId}: {ex.Message}");
            throw;
        }
    }

    public async Task<int> DeleteAllGrammarQuestionsAsync(int grammarId)
    {
        try
        {
            var questions = await _context.QuestionGrammars
                .Where(q => q.GrammarId == grammarId)
                .ToListAsync();

            if (questions.Count == 0) return 0;

            _context.QuestionGrammars.RemoveRange(questions);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Deleted {questions.Count} questions for grammar {grammarId}");
            return questions.Count;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting all questions for grammar {grammarId}: {ex.Message}");
            throw;
        }
    }

    // ==========================================
    // GRAMMAR QUESTION ANSWERS
    // ==========================================

    public async Task<List<QuestionGrammarAnswerDto>> GetQuestionAnswersAsync(int questionId)
    {
        try
        {
            var answers = await _context.QuestionGrammarAnswers
                .Where(a => a.QuestionGrammarId == questionId)
                .ToListAsync();

            return answers.Select(a => new QuestionGrammarAnswerDto
            {
                Id = a.Id,
                QuestionGrammarId = a.QuestionGrammarId,
                Label = a.Label,
                Content = a.Content,
                IsCorrect = a.IsCorrect
            }).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting question answers: {ex.Message}");
            return new List<QuestionGrammarAnswerDto>();
        }
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    private GrammarGroupDto MapGrammarGroupToDto(GrammarGroup group)
    {
        var totalTopics = _context.GrammarTopics.Count(t => t.GroupId == group.Id);

        return new GrammarGroupDto
        {
            Id = group.Id,
            Title = group.Title,
            Description = group.Description,
            Order = group.Order,
            TotalTopics = totalTopics,
            CreatedAt = group.CreatedAt
        };
    }

    private GrammarTopicDto MapGrammarTopicToDto(GrammarTopic topic, int? userId = null)
    {
        var totalRules = _context.Grammars.Count(g => g.TopicId == topic.Id);
        
        // Calculate learned rules for this user
        int learnedRules = 0;
        int currentLevel = 0;
        bool canReviewNow = false;
        
        if (userId.HasValue && totalRules > 0)
        {
            // Get all grammar IDs in this topic
            var grammarIds = _context.Grammars
                .Where(g => g.TopicId == topic.Id)
                .Select(g => g.Id)
                .ToList();
            
            // Count learned grammars (Status > 0 means user has viewed/interacted)
            // Fix: Use Distinct to avoid counting duplicate grammar entries
            learnedRules = _context.UserGrammars
                .Where(ug => ug.UserId == userId.Value && 
                             grammarIds.Contains(ug.GrammarId) && 
                             ug.Status > 0)
                .Select(ug => ug.GrammarId)
                .Distinct()
                .Count();
            
            // Calculate average level
            var userGrammars = _context.UserGrammars
                .Where(ug => ug.UserId == userId.Value && 
                            grammarIds.Contains(ug.GrammarId))
                .ToList();
            
            if (userGrammars.Any())
            {
                currentLevel = (int)Math.Round(userGrammars.Average(ug => ug.Level));
            }
            
            // Check if any grammar is ready for review
            var now = DateTime.UtcNow;
            canReviewNow = _context.UserGrammars
                .Any(ug => ug.UserId == userId.Value && 
                          grammarIds.Contains(ug.GrammarId) && 
                          ug.Status > 0 && 
                          ug.Status < 3 && // Not mastered
                          ug.NextReviewAt <= now);
        }

        return new GrammarTopicDto
        {
            Id = topic.Id,
            Title = topic.Title,
            Description = topic.Description,
            ImageUrl = topic.ImageUrl,
            Level = topic.Level,
            LevelRange = topic.LevelRange,
            Category = topic.Category,
            TotalRules = totalRules,
            LearnedRules = learnedRules,
            CurrentLevel = currentLevel,
            CanReviewNow = canReviewNow
        };
    }

    private GrammarDto MapGrammarToDto(Grammar grammar)
    {
        return new GrammarDto
        {
            Id = grammar.Id,
            TopicId = grammar.TopicId,
            RuleName = grammar.RuleName,
            Structure = grammar.Structure,
            Meaning = grammar.Meaning,
            Example = grammar.Example,
            ExampleTranslation = grammar.ExampleTranslation,
            AudioUrl = grammar.AudioUrl,
            ImageUrl = grammar.ImageUrl,
            CommonMistakes = grammar.CommonMistakes,
            Difficulty = grammar.Difficulty,
            NegativeExample = grammar.NegativeExample,
            NegativeExampleTranslation = grammar.NegativeExampleTranslation,
            TestTip = grammar.TestTip,
            Frequency = grammar.Frequency,
            RelatedRuleIds = grammar.RelatedRuleIds,
            TopicTitle = grammar.Topic?.Title,
            GrammarExamples = grammar.GrammarExamples?.Select(e => new GrammarExampleDto
            {
                Id = e.Id,
                GrammarId = e.GrammarId,
                Sentence = e.Sentence,
                Translation = e.Translation,
                Context = e.Context,
                AudioUrl = e.AudioUrl
            }).ToList() ?? new List<GrammarExampleDto>()
        };
    }

    private UserGrammarProgressDto MapUserGrammarToDto(UserGrammar userGrammar)
    {
        return new UserGrammarProgressDto
        {
            Id = userGrammar.Id,
            UserId = userGrammar.UserId,
            GrammarId = userGrammar.GrammarId,
            Status = userGrammar.Status,
            CorrectStreak = userGrammar.CorrectStreak,
            ReviewCount = userGrammar.ReviewCount,
            NextReviewAt = userGrammar.NextReviewAt,
            LastReviewedAt = userGrammar.LastReviewedAt,
            Level = userGrammar.Level,
            CreatedAt = userGrammar.CreatedAt,
            Grammar = userGrammar.Grammar != null ? MapGrammarToDto(userGrammar.Grammar) : null
        };
    }

    private QuestionGrammarDto MapQuestionGrammarToDto(QuestionGrammar question)
    {
        return new QuestionGrammarDto
        {
            Id = question.Id,
            TopicId = question.TopicId,
            GrammarId = question.GrammarId,  // ← MỚI THÊM
            RuleId = question.GrammarId,     // ← SỬA: RuleId = GrammarId (vì QuestionGrammar không có RuleId property)
            QuestionNo = question.QuestionNo,
            Content = question.Content,
            CorrectOption = question.CorrectOption,
            ShortExplanation = question.ShortExplanation,
            LongExplanation = question.LongExplanation,
            Mode = question.Mode,
            Answers = question.Answers?.Select(a => new QuestionGrammarAnswerDto
            {
                Id = a.Id,
                QuestionGrammarId = a.QuestionGrammarId,
                Label = a.Label,
                Content = a.Content,
                IsCorrect = a.IsCorrect
            }).ToList() ?? new List<QuestionGrammarAnswerDto>()
        };
    }

    // ==========================================
    // GRAMMAR STATS & ANALYTICS (Progress Tab)
    // ==========================================

    public async Task<GrammarStatsDto> GetGrammarStatsAsync(int userId, string period = "all")
    {
        try
        {
            var endDate = DateTime.UtcNow;
            var startDate = period.ToLower() switch
            {
                "7d" or "7days" => endDate.AddDays(-7),
                "30d" or "30days" => endDate.AddDays(-30),
                "90d" or "90days" => endDate.AddDays(-90),
                "1y" or "1year" => endDate.AddYears(-1),
                _ => DateTime.MinValue
            };

            // Lessons learned: Always show total count regardless of period filter
            // (User wants to see overall progress, not just recent lessons)
            var lessonsLearned = await _context.UserGrammars
                .Where(ug => ug.UserId == userId && ug.Status > 0)
                .Select(ug => ug.GrammarId)
                .Distinct()
                .CountAsync();
            var totalLessons = await _context.Grammars.CountAsync();

            // Read practice stats from UserGrammars instead of GrammarStudySessions
            var userGrammarsQuery = _context.UserGrammars.Where(ug => ug.UserId == userId);
            if (period != "all") userGrammarsQuery = userGrammarsQuery.Where(ug => ug.LastReviewedAt >= startDate);
            
            var totalStudySeconds = await userGrammarsQuery.SumAsync(ug => (int?)ug.TotalStudyTimeSeconds) ?? 0;
            var totalQuestions = await userGrammarsQuery.SumAsync(ug => (int?)ug.TotalQuestionsAnswered) ?? 0;
            var totalCorrect = await userGrammarsQuery.SumAsync(ug => (int?)ug.TotalCorrectAnswers) ?? 0;

            var accuracy = totalQuestions > 0 ? Math.Round((double)totalCorrect / totalQuestions * 100, 1) : 0;

            return new GrammarStatsDto
            {
                TotalLessonsLearned = lessonsLearned,
                TotalLessonsAvailable = totalLessons,
                LessonsProgressPercent = totalLessons > 0 ? Math.Round((double)lessonsLearned / totalLessons * 100, 1) : 0,
                TotalQuestionsPracticed = totalQuestions,
                TotalCorrectAnswers = totalCorrect,
                AccuracyPercent = accuracy,
                TotalStudyTimeMinutes = totalStudySeconds / 60,
                TotalStudyTimeFormatted = FormatStudyTime(totalStudySeconds),
                Period = period,
                StartDate = period != "all" ? startDate : null,
                EndDate = endDate
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar stats for user {userId}: {ex.Message}");
            return new GrammarStatsDto();
        }
    }

    public async Task<StreakInfoDto> GetStreakAsync(int userId)
    {
        try
        {
            // Get unique dates from LastReviewedAt in UserGrammars (real-time tracking)
            var activityDates = await _context.UserGrammars
                .Where(ug => ug.UserId == userId && ug.LastReviewedAt != null)
                .Select(ug => ug.LastReviewedAt!.Value.Date)
                .Distinct()
                .OrderByDescending(d => d)
                .ToListAsync();

            var today = DateTime.UtcNow.Date;
            var yesterday = today.AddDays(-1);

            int currentStreak = 0;
            if (activityDates.Any())
            {
                var lastActivity = activityDates.First();
                if (lastActivity == today || lastActivity == yesterday)
                {
                    currentStreak = 1;
                    for (int i = 1; i < activityDates.Count; i++)
                    {
                        if (activityDates[i] == activityDates[i - 1].AddDays(-1))
                            currentStreak++;
                        else
                            break;
                    }
                }
            }

            int longestStreak = 0, tempStreak = 0;
            DateTime? prevDate = null;
            foreach (var date in activityDates.OrderBy(d => d))
            {
                if (prevDate == null || date == prevDate.Value.AddDays(1))
                    tempStreak++;
                else
                {
                    longestStreak = Math.Max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
                prevDate = date;
            }
            longestStreak = Math.Max(longestStreak, tempStreak);

            var weeklyActivity = new List<DailyActivityDto>();
            for (int i = 6; i >= 0; i--)
            {
                var date = today.AddDays(-i);
                weeklyActivity.Add(new DailyActivityDto
                {
                    Date = date,
                    HasActivity = activityDates.Contains(date),
                    DayOfWeek = date.ToString("ddd")
                });
            }

            return new StreakInfoDto
            {
                CurrentStreak = currentStreak,
                LongestStreak = longestStreak,
                TotalStudyDays = activityDates.Count,
                HasActivityToday = activityDates.Contains(today),
                LastActivityDate = activityDates.FirstOrDefault(),
                WeeklyActivity = weeklyActivity
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting streak for user {userId}: {ex.Message}");
            return new StreakInfoDto();
        }
    }

    public async Task<HeatmapDataDto> GetHeatmapDataAsync(int userId, int weeks = 52)
    {
        try
        {
            var endDate = DateTime.UtcNow.Date;
            var startDate = endDate.AddDays(-(weeks * 7));

            // Get study time from UserGrammars (real-time tracking)
            var activities = await _context.UserGrammars
                .Where(ug => ug.UserId == userId && ug.LastReviewedAt != null)
                .GroupBy(ug => ug.LastReviewedAt!.Value.Date)
                .Select(g => new { Date = g.Key, TotalSeconds = g.Sum(ug => ug.TotalStudyTimeSeconds) })
                .ToDictionaryAsync(a => a.Date, a => a.TotalSeconds / 60);

            var heatmapWeeks = new List<HeatmapWeekDto>();
            var maxMinutes = 0;
            var currentWeekStart = startDate.AddDays(-(int)startDate.DayOfWeek);

            while (currentWeekStart <= endDate)
            {
                var week = new HeatmapWeekDto { Days = new List<HeatmapDayDto>() };
                for (int i = 0; i < 7; i++)
                {
                    var date = currentWeekStart.AddDays(i);
                    var minutes = activities.ContainsKey(date) ? activities[date] : 0;
                    maxMinutes = Math.Max(maxMinutes, minutes);
                    week.Days.Add(new HeatmapDayDto
                    {
                        Date = date,
                        StudyMinutes = minutes,
                        HasActivity = minutes > 0,
                        ActivityLevel = CalculateActivityLevel(minutes)
                    });
                }
                heatmapWeeks.Add(week);
                currentWeekStart = currentWeekStart.AddDays(7);
            }

            return new HeatmapDataDto
            {
                Weeks = heatmapWeeks,
                MaxActivityMinutes = maxMinutes,
                StartDate = startDate,
                EndDate = endDate
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting heatmap data for user {userId}: {ex.Message}");
            return new HeatmapDataDto();
        }
    }

    public async Task<TimeDistributionDto> GetTimeDistributionAsync(int userId, string period = "all")
    {
        try
        {
            // Get study time from UserGrammars (real-time tracking)
            var query = _context.UserGrammars
                .Where(ug => ug.UserId == userId && ug.LastReviewedAt != null);
            
            if (period != "all")
            {
                var days = period.ToLower() switch
                {
                    "7d" or "7days" => 7,
                    "30d" or "30days" => 30,
                    "90d" or "90days" => 90,
                    "1y" or "1year" => 365,
                    _ => 0
                };
                if (days > 0)
                    query = query.Where(ug => ug.LastReviewedAt >= DateTime.UtcNow.AddDays(-days));
            }

            var userGrammars = await query.ToListAsync();
            int morning = 0, afternoon = 0, evening = 0, night = 0;

            foreach (var ug in userGrammars)
            {
                var hour = ug.LastReviewedAt!.Value.Hour;
                var duration = ug.TotalStudyTimeSeconds / 60;
                if (hour >= 6 && hour < 12) morning += duration;
                else if (hour >= 12 && hour < 18) afternoon += duration;
                else if (hour >= 18 && hour < 22) evening += duration;
                else night += duration;
            }

            var times = new[] { ("Morning", morning), ("Afternoon", afternoon), ("Evening", evening), ("Night", night) };
            var peak = times.OrderByDescending(x => x.Item2).First();

            return new TimeDistributionDto
            {
                MorningMinutes = morning,
                AfternoonMinutes = afternoon,
                EveningMinutes = evening,
                NightMinutes = night,
                PeakStudyTime = peak.Item2 > 0 ? peak.Item1 : "No activity"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting time distribution for user {userId}: {ex.Message}");
            return new TimeDistributionDto();
        }
    }

    public async Task<List<GroupProgressDto>> GetGroupProgressAsync(int userId)
    {
        try
        {
            var groups = await _context.GrammarGroups.OrderBy(g => g.Order).ToListAsync();
            var result = new List<GroupProgressDto>();

            foreach (var group in groups)
            {
                var topics = await _context.GrammarTopics.Where(t => t.GroupId == group.Id).ToListAsync();
                var topicIds = topics.Select(t => t.Id).ToList();
                var grammars = await _context.Grammars.Where(g => topicIds.Contains(g.TopicId)).ToListAsync();
                var grammarIds = grammars.Select(g => g.Id).ToList();
                var userGrammars = await _context.UserGrammars.Where(ug => ug.UserId == userId && grammarIds.Contains(ug.GrammarId)).ToListAsync();

                var totalLessons = grammars.Count;
                // Fix: Use Distinct to avoid counting duplicate grammar entries
                var learnedLessons = userGrammars
                    .Where(ug => ug.Status > 0)
                    .Select(ug => ug.GrammarId)
                    .Distinct()
                    .Count();
                // Get stats from UserGrammars (real-time tracking)
                var totalQuestions = userGrammars.Sum(ug => ug.TotalQuestionsAnswered);
                var correctAnswers = userGrammars.Sum(ug => ug.TotalCorrectAnswers);
                var totalStudySeconds = userGrammars.Sum(ug => ug.TotalStudyTimeSeconds);

                var groupProgress = new GroupProgressDto
                {
                    GroupId = group.Id,
                    GroupTitle = group.Title,
                    GroupDescription = group.Description,
                    GroupOrder = group.Order,
                    TotalTopics = topics.Count,
                    TotalLessons = totalLessons,
                    LearnedLessons = learnedLessons,
                    ProgressPercent = totalLessons > 0 ? Math.Round((double)learnedLessons / totalLessons * 100, 1) : 0,
                    StudyTimeMinutes = totalStudySeconds / 60,
                    QuestionsAnswered = totalQuestions,
                    AccuracyPercent = totalQuestions > 0 ? Math.Round((double)correctAnswers / totalQuestions * 100, 1) : 0,
                    Topics = new List<TopicProgressDto>()
                };

                foreach (var topic in topics)
                {
                    var topicGrammars = grammars.Where(g => g.TopicId == topic.Id).ToList();
                    var topicGrammarIds = topicGrammars.Select(g => g.Id).ToList();
                    var topicUserGrammars = userGrammars.Where(ug => topicGrammarIds.Contains(ug.GrammarId)).ToList();
                    // Fix: Use Distinct to avoid counting duplicate grammar entries
                    var topicLearnedLessons = topicUserGrammars
                        .Where(ug => ug.Status > 0)
                        .Select(ug => ug.GrammarId)
                        .Distinct()
                        .Count();
                    // Get stats from UserGrammars (real-time tracking)
                    var topicTotalQuestions = topicUserGrammars.Sum(ug => ug.TotalQuestionsAnswered);
                    var topicCorrectAnswers = topicUserGrammars.Sum(ug => ug.TotalCorrectAnswers);
                    var topicStudySeconds = topicUserGrammars.Sum(ug => ug.TotalStudyTimeSeconds);

                    groupProgress.Topics.Add(new TopicProgressDto
                    {
                        TopicId = topic.Id,
                        TopicTitle = topic.Title,
                        Category = topic.Category,
                        Level = topic.Level,
                        ImageUrl = topic.ImageUrl,
                        TotalLessons = topicGrammars.Count,
                        LearnedLessons = topicLearnedLessons,
                        ProgressPercent = topicGrammars.Count > 0 ? Math.Round((double)topicLearnedLessons / topicGrammars.Count * 100, 1) : 0,
                        StudyTimeMinutes = topicStudySeconds / 60,
                        QuestionsAnswered = topicTotalQuestions,
                        AccuracyPercent = topicTotalQuestions > 0 ? Math.Round((double)topicCorrectAnswers / topicTotalQuestions * 100, 1) : 0,
                        LastStudiedAt = topicUserGrammars.Max(ug => ug.LastReviewedAt),
                        NextReviewAt = topicUserGrammars.Where(ug => ug.Status > 0 && ug.Status < 3).Min(ug => ug.NextReviewAt),
                        IsReadyForReview = topicUserGrammars.Any(ug => ug.Status > 0 && ug.Status < 3 && ug.NextReviewAt <= DateTime.UtcNow),
                        Lessons = topicUserGrammars.Select(ug => new LessonProgressDto
                        {
                            GrammarId = ug.GrammarId,
                            GrammarTitle = ug.Grammar?.RuleName ?? "",
                            Status = ug.Status,
                            StatusText = GetStatusText(ug.Status),
                            Level = ug.Level,
                            CorrectStreak = ug.CorrectStreak,
                            FirstLearnedAt = ug.FirstLearnedAt,
                            LastReviewedAt = ug.LastReviewedAt,
                            NextReviewAt = ug.NextReviewAt,
                            IsReadyForReview = ug.Status > 0 && ug.Status < 3 && ug.NextReviewAt <= DateTime.UtcNow
                        }).ToList()
                    });
                }

                result.Add(groupProgress);
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting group progress for user {userId}: {ex.Message}");
            return new List<GroupProgressDto>();
        }
    }

    public async Task<TopicProgressDto?> GetTopicProgressAsync(int userId, int topicId)
    {
        try
        {
            var topic = await _context.GrammarTopics.FindAsync(topicId);
            if (topic == null) return null;

            var grammars = await _context.Grammars.Where(g => g.TopicId == topicId).ToListAsync();
            var grammarIds = grammars.Select(g => g.Id).ToList();
            var userGrammars = await _context.UserGrammars.Where(ug => ug.UserId == userId && grammarIds.Contains(ug.GrammarId)).Include(ug => ug.Grammar).ToListAsync();

            // Get stats from UserGrammars (real-time tracking)
            var totalQuestions = userGrammars.Sum(ug => ug.TotalQuestionsAnswered);
            var correctAnswers = userGrammars.Sum(ug => ug.TotalCorrectAnswers);
            var totalStudySeconds = userGrammars.Sum(ug => ug.TotalStudyTimeSeconds);

            return new TopicProgressDto
            {
                TopicId = topic.Id,
                TopicTitle = topic.Title,
                Category = topic.Category,
                Level = topic.Level,
                ImageUrl = topic.ImageUrl,
                TotalLessons = grammars.Count,
                LearnedLessons = userGrammars.Count(ug => ug.Status > 0),
                ProgressPercent = grammars.Count > 0 ? Math.Round((double)userGrammars.Count(ug => ug.Status > 0) / grammars.Count * 100, 1) : 0,
                StudyTimeMinutes = totalStudySeconds / 60,
                QuestionsAnswered = totalQuestions,
                AccuracyPercent = totalQuestions > 0 ? Math.Round((double)correctAnswers / totalQuestions * 100, 1) : 0,
                LastStudiedAt = userGrammars.Max(ug => ug.LastReviewedAt),
                NextReviewAt = userGrammars.Where(ug => ug.Status > 0 && ug.Status < 3).Min(ug => ug.NextReviewAt),
                IsReadyForReview = userGrammars.Any(ug => ug.Status > 0 && ug.Status < 3 && ug.NextReviewAt <= DateTime.UtcNow),
                Lessons = userGrammars.Select(ug => new LessonProgressDto
                {
                    GrammarId = ug.GrammarId,
                    GrammarTitle = ug.Grammar?.RuleName ?? "",
                    Status = ug.Status,
                    StatusText = GetStatusText(ug.Status),
                    Level = ug.Level,
                    CorrectStreak = ug.CorrectStreak,
                    FirstLearnedAt = ug.FirstLearnedAt,
                    LastReviewedAt = ug.LastReviewedAt,
                    NextReviewAt = ug.NextReviewAt,
                    IsReadyForReview = ug.Status > 0 && ug.Status < 3 && ug.NextReviewAt <= DateTime.UtcNow
                }).ToList()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting topic progress for user {userId}, topic {topicId}: {ex.Message}");
            return null;
        }
    }

    public async Task RecordStudySessionAsync(int userId, RecordStudySessionRequest request)
    {
        try
        {
            var session = new GrammarStudySession
            {
                UserId = userId,
                GrammarId = request.GrammarId,
                TopicId = request.TopicId,
                GroupId = request.GroupId,
                SessionType = request.SessionType,
                DurationSeconds = request.DurationSeconds,
                QuestionsAnswered = request.QuestionsAnswered,
                CorrectAnswers = request.CorrectAnswers,
                StartedAt = DateTime.UtcNow.AddSeconds(-request.DurationSeconds),
                EndedAt = DateTime.UtcNow
            };
            _context.GrammarStudySessions.Add(session);

            var today = DateTime.UtcNow.Date;
            var dailyActivity = await _context.UserDailyActivity.FirstOrDefaultAsync(a => a.UserId == userId && a.Date == today);

            if (dailyActivity == null)
            {
                dailyActivity = new UserDailyActivity
                {
                    UserId = userId,
                    Date = today,
                    HasActivity = true,
                    TotalStudySeconds = request.DurationSeconds,
                    LessonsLearnedCount = request.SessionType == "lesson" ? 1 : 0,
                    QuestionsAnsweredCount = request.QuestionsAnswered,
                    CorrectAnswersCount = request.CorrectAnswers,
                    LastActivityAt = DateTime.UtcNow
                };
                _context.UserDailyActivity.Add(dailyActivity);
            }
            else
            {
                dailyActivity.HasActivity = true;
                dailyActivity.TotalStudySeconds += request.DurationSeconds;
                if (request.SessionType == "lesson") dailyActivity.LessonsLearnedCount++;
                dailyActivity.QuestionsAnsweredCount += request.QuestionsAnswered;
                dailyActivity.CorrectAnswersCount += request.CorrectAnswers;
                dailyActivity.LastActivityAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error recording study session for user {userId}: {ex.Message}");
            throw;
        }
    }

    public async Task UpdateDailyActivityAsync(int userId, DateTime date, Action<UserDailyActivity> updateAction)
    {
        try
        {
            var dailyActivity = await _context.UserDailyActivity.FirstOrDefaultAsync(a => a.UserId == userId && a.Date == date.Date);
            if (dailyActivity == null)
            {
                dailyActivity = new UserDailyActivity { UserId = userId, Date = date.Date, HasActivity = true };
                _context.UserDailyActivity.Add(dailyActivity);
            }
            updateAction(dailyActivity);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating daily activity for user {userId}: {ex.Message}");
            throw;
        }
    }

    private string FormatStudyTime(int totalSeconds)
    {
        var hours = totalSeconds / 3600;
        var minutes = (totalSeconds % 3600) / 60;
        return hours > 0 ? $"{hours}h {minutes}m" : $"{minutes}m";
    }

    private int CalculateActivityLevel(int minutes)
    {
        return minutes switch { 0 => 0, <= 10 => 1, <= 30 => 2, <= 60 => 3, _ => 4 };
    }

    private string GetStatusText(int status)
    {
        return status switch { 0 => "New", 1 => "Learning", 2 => "Reviewing", 3 => "Mastered", _ => "Unknown" };
    }
}
