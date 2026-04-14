using ToeicMaster.API.Entities;
using ToeicMaster.API.Models;

namespace ToeicMaster.API.Services;

public interface IGrammarService
{
    // ==========================================
    // GRAMMAR TOPICS
    // ==========================================
    Task<List<GrammarTopicDto>> GetAllGrammarTopicsAsync();
    Task<GrammarTopicDto?> GetGrammarTopicByIdAsync(int id);
    Task<GrammarTopic> CreateGrammarTopicAsync(AddGrammarTopicRequest request);
    Task<GrammarTopic?> UpdateGrammarTopicAsync(int id, UpdateGrammarTopicRequest request);
    Task<bool> DeleteGrammarTopicAsync(int id);

    // ==========================================
    // GRAMMARS
    // ==========================================
    Task<List<GrammarDto>> GetGrammarsByTopicIdAsync(int topicId);
    Task<GrammarDto?> GetGrammarByIdAsync(int id);
    Task<Grammar> CreateGrammarAsync(AddGrammarRequest request);
    Task<Grammar?> UpdateGrammarAsync(int id, UpdateGrammarRequest request);
    Task<bool> DeleteGrammarAsync(int id);
    Task<List<GrammarDto>> SearchGrammarsAsync(string keyword);

    // ==========================================
    // GRAMMAR EXAMPLES
    // ==========================================
    Task<List<GrammarExampleDto>> GetGrammarExamplesAsync(int grammarId);
    Task<GrammarExample> AddGrammarExampleAsync(int grammarId, GrammarExampleDto request);
    Task<bool> DeleteGrammarExampleAsync(int id);

    // ==========================================
    // USER GRAMMAR PROGRESS (Spaced Repetition)
    // ==========================================
    Task<UserGrammarProgressDto?> GetUserGrammarProgressAsync(int userId, int grammarId);
    Task<List<UserGrammarProgressDto>> GetUserGrammarsProgressAsync(int userId);
    Task<UserGrammar> UpdateUserGrammarProgressAsync(int userId, int grammarId, UpdateGrammarProgressRequest request);
    Task<List<GrammarDto>> GetGrammarsForReviewAsync(int userId, int count = 20);
    Task<int> GetUserMasteredGrammarsCountAsync(int userId);

    // ==========================================
    // GRAMMAR QUESTIONS
    // ==========================================
    Task<List<QuestionGrammarDto>> GetGrammarQuestionsByTopicAsync(int topicId, int page = 1, int pageSize = 20);
    Task<QuestionGrammarDto?> GetGrammarQuestionByIdAsync(int id);
    Task<QuestionGrammar> CreateGrammarQuestionAsync(int topicId, QuestionGrammarImportItemDto request);
    Task<bool> DeleteGrammarQuestionAsync(int id);

    // ==========================================
    // GRAMMAR QUESTION ANSWERS
    // ==========================================
    Task<List<QuestionGrammarAnswerDto>> GetQuestionAnswersAsync(int questionId);
}
