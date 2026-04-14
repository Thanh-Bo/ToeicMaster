using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models;
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
    // GRAMMAR TOPICS
    // ==========================================

    public async Task<List<GrammarTopicDto>> GetAllGrammarTopicsAsync()
    {
        try
        {
            var topics = await _context.GrammarTopics
                .OrderBy(t => t.Title)
                .ToListAsync();

            return topics.Select(t => MapGrammarTopicToDto(t)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar topics: {ex.Message}");
            return new List<GrammarTopicDto>();
        }
    }

    public async Task<GrammarTopicDto?> GetGrammarTopicByIdAsync(int id)
    {
        try
        {
            var topic = await _context.GrammarTopics
                .FirstOrDefaultAsync(t => t.Id == id);

            return topic != null ? MapGrammarTopicToDto(topic) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar topic {id}: {ex.Message}");
            return null;
        }
    }

    public async Task<GrammarTopic> CreateGrammarTopicAsync(AddGrammarTopicRequest request)
    {
        try
        {
            var topic = new GrammarTopic
            {
                Title = request.Title,
                Description = request.Description,
                ImageUrl = request.ImageUrl,
                Level = request.Level,
                LevelRange = request.LevelRange,
                Category = request.Category
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
    // GRAMMARS
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
                TopicId = request.TopicId,
                RuleName = request.RuleName,
                Structure = request.Structure,
                Meaning = request.Meaning,
                Example = request.Example,
                ExampleTranslation = request.ExampleTranslation,
                AudioUrl = request.AudioUrl,
                ImageUrl = request.ImageUrl,
                CommonMistakes = request.CommonMistakes,
                Difficulty = request.Difficulty,
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
                        Sentence = example.Sentence,
                        Translation = example.Translation,
                        Context = example.Context,
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

            if (progress == null)
            {
                // Create new progress entry
                progress = new UserGrammar
                {
                    UserId = userId,
                    GrammarId = grammarId,
                    Status = request.IsCorrect ? 1 : 0,
                    CorrectStreak = request.IsCorrect ? 1 : 0,
                    ReviewCount = 1,
                    Level = request.Level,
                    NextReviewAt = request.NextReviewAt,
                    LastReviewedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                };
                _context.UserGrammars.Add(progress);
            }
            else
            {
                // Update existing progress
                if (request.IsCorrect)
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
                progress.Level = request.Level;
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

    public async Task<QuestionGrammar> CreateGrammarQuestionAsync(int topicId, QuestionGrammarImportItemDto request)
    {
        try
        {
            var question = new QuestionGrammar
            {
                TopicId = topicId,
                QuestionNo = request.QuestionNo,
                Content = request.Content,
                CorrectOption = request.CorrectOption,
                ShortExplanation = request.ShortExplanation,
                LongExplanation = request.LongExplanation
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

    private GrammarTopicDto MapGrammarTopicToDto(GrammarTopic topic)
    {
        var totalRules = _context.Grammars.Count(g => g.TopicId == topic.Id);

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
            LearnedRules = 0,
            CurrentLevel = 0,
            CanReviewNow = false
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
            QuestionNo = question.QuestionNo,
            Content = question.Content,
            CorrectOption = question.CorrectOption,
            ShortExplanation = question.ShortExplanation,
            LongExplanation = question.LongExplanation,
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
}
