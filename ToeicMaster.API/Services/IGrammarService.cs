using ToeicMaster.API.Entities;
using ToeicMaster.API.Models;
using ToeicMaster.API.Models.Grammar;

namespace ToeicMaster.API.Services;

public interface IGrammarService
{
    // ==========================================
    // GRAMMAR GROUPS (Layer 1)
    // ==========================================
    Task<List<GrammarGroupDto>> GetAllGrammarGroupsAsync();
    Task<GrammarGroupDto?> GetGrammarGroupByIdAsync(int id);
    Task<GrammarGroup> CreateGrammarGroupAsync(AddGrammarGroupRequest request);
    Task<GrammarGroup?> UpdateGrammarGroupAsync(int id, UpdateGrammarGroupRequest request);
    Task<bool> DeleteGrammarGroupAsync(int id);

    // ==========================================
    // GRAMMAR TOPICS (Layer 2)
    // ==========================================
    Task<List<GrammarTopicDto>> GetAllGrammarTopicsAsync(int? userId = null);
    Task<List<GrammarTopicDto>> GetGrammarsByGroupIdAsync(int groupId, int? userId = null);
    Task<GrammarTopicDto?> GetGrammarTopicByIdAsync(int id, int? userId = null);
    Task<GrammarTopic> CreateGrammarTopicAsync(int groupId, AddGrammarTopicRequest request);
    Task<List<GrammarTopic>> CreateGrammarTopicsAsync(int groupId, List<AddGrammarTopicRequest> requests);
    Task<GrammarTopic?> UpdateGrammarTopicAsync(int id, UpdateGrammarTopicRequest request);
    Task<bool> DeleteGrammarTopicAsync(int id);

    // ==========================================
    // GRAMMARS (Layer 3)
    // ==========================================
    Task<List<GrammarDto>> GetGrammarsByTopicIdAsync(int topicId);
    Task<GrammarDto?> GetGrammarByIdAsync(int id);
    Task<Grammar> CreateGrammarAsync(AddGrammarRequest request);
    Task<BulkAddGrammarResponse> CreateGrammarsAsync(BulkAddGrammarRequest request);
    Task<Grammar?> UpdateGrammarAsync(int id, UpdateGrammarRequest request);
    Task<BulkUpdateGrammarResponse> UpdateGrammarsAsync(BulkUpdateGrammarRequest request);
    Task<bool> DeleteGrammarAsync(int id);
    Task<int> DeleteAllGrammarsByTopicAsync(int topicId);
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
    Task<UserGrammar> MarkGrammarAsLearnedAsync(int userId, int grammarId);
    Task<List<GrammarDto>> GetGrammarsForReviewAsync(int userId, int count = 20);
    Task<int> GetUserMasteredGrammarsCountAsync(int userId);

    // ==========================================
    // GRAMMAR QUESTIONS
    // ==========================================
    Task<List<QuestionGrammarDto>> GetGrammarQuestionsByTopicAsync(int topicId, int page = 1, int pageSize = 20);
    Task<QuestionGrammarDto?> GetGrammarQuestionByIdAsync(int id);
    Task<List<QuestionGrammarDto>> GetGrammarQuestionsByModeAsync(int topicId, string mode, int count = 20);
    Task<List<QuestionGrammarDto>> GetGrammarQuestionsByGrammarIdAsync(int grammarId, string? mode = null, int page = 1, int pageSize = 20);
    Task<int> GetGrammarQuestionCountAsync(int grammarId, string? mode = null);
    Task<QuestionGrammar> CreateGrammarQuestionAsync(int grammarId, QuestionGrammarImportItemDto request);
    Task<QuestionGrammar?> UpdateGrammarQuestionAsync(int id, QuestionGrammarImportItemDto request);
    Task<bool> DeleteGrammarQuestionAsync(int id);
    Task<int> DeleteAllQuestionsByGrammarIdAsync(int grammarId);
    Task<int> DeleteQuestionsByGrammarIdAndModeAsync(int grammarId, string mode);
    Task<int> DeleteAllGrammarQuestionsAsync(int grammarId);

    // ==========================================
    // GRAMMAR QUESTION ANSWERS
    // ==========================================
    Task<List<QuestionGrammarAnswerDto>> GetQuestionAnswersAsync(int questionId);

    // ==========================================
    // GRAMMAR STATS & ANALYTICS (Progress Tab)
    // ==========================================
    Task<GrammarStatsDto> GetGrammarStatsAsync(int userId, string period = "all");
    Task<StreakInfoDto> GetStreakAsync(int userId);
    Task<HeatmapDataDto> GetHeatmapDataAsync(int userId, int weeks = 52);
    Task<TimeDistributionDto> GetTimeDistributionAsync(int userId, string period = "all");
    Task<List<GroupProgressDto>> GetGroupProgressAsync(int userId);
    Task<TopicProgressDto?> GetTopicProgressAsync(int userId, int topicId);
    Task RecordStudySessionAsync(int userId, RecordStudySessionRequest request);
    Task UpdateDailyActivityAsync(int userId, DateTime date, Action<UserDailyActivity> updateAction);
}
