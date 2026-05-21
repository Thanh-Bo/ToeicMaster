namespace ToeicMaster.API.Models
{
    // --- 1. DTO Trả về cho Frontend (OUTPUT) ---
    public class GrammarExampleDto
    {
        public int Id { get; set; }
        public int? GrammarId { get; set; }
        public string? Sentence { get; set; }
        public string? Translation { get; set; }
        public string? Context { get; set; }
        public string? AudioUrl { get; set; }
    }

    // Input DTO for Grammar Examples (matches user JSON)
    public class GrammarExampleInputDto
    {
        public string? Example { get; set; } // Maps to Sentence
        public string? ExampleTranslation { get; set; } // Maps to Translation
        public string? Explanation { get; set; } // Maps to Context
        public string? AudioUrl { get; set; }
        public int? Order { get; set; }
    }

    // DTO cho Grammar (Output)
    public class GrammarDto
    {
        public int Id { get; set; }
        public int? TopicId { get; set; }
        public string? RuleName { get; set; }
        public string? Structure { get; set; }
        public string? Meaning { get; set; }
        public string? Example { get; set; }
        public string? ExampleTranslation { get; set; }
        public string? AudioUrl { get; set; }
        public string? ImageUrl { get; set; }
        public string? CommonMistakes { get; set; }
        public int? Difficulty { get; set; }
        public bool IsQuestionsPremiumRequired { get; set; }
        public string? NegativeExample { get; set; }
        public string? NegativeExampleTranslation { get; set; }
        public string? TestTip { get; set; }
        public int? Frequency { get; set; }
        public string? RelatedRuleIds { get; set; }
        public string? TopicTitle { get; set; } // Topic name
        public int? Level { get; set; }
        public DateTime? NextReviewAt { get; set; }
        
        // List of examples
        public List<GrammarExampleDto> GrammarExamples { get; set; } = new();
        
        // User Progress
        public int Status { get; set; } // 0: New, 1: Learning, 3: Mastered
        public bool IsBookmarked { get; set; }
    }

    // DTO cho Grammar Topic Card (Trang chủ)
    public class GrammarTopicDto
    {
        public int Id { get; set; }
        public Guid TopicGuid { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? Level { get; set; }
        public string? LevelRange { get; set; }
        public string? Category { get; set; }
        public int GroupId { get; set; }
        public Guid GroupGuid { get; set; }

        // Progress tracking
        public int TotalRules { get; set; }
        public int LearnedRules { get; set; } // Số quy tắc đã học (Status > 0)

        // SRS Progress
        public int CurrentLevel { get; set; } // 0-5
        public DateTime? NextReviewAt { get; set; }
        public Dictionary<int, int> RuleCounts { get; set; } = new(); // level -> count
        public bool CanReviewNow { get; set; }
        public string TimeUntilReady { get; set; } = ""; // "12h 30m"
        public bool IsExplanationPremiumRequired { get; set; }
        public bool CanViewExplanation { get; set; }
    }

    // DTO cho Grammar Group (Layer 1)
    public class GrammarGroupDto
    {
        public int Id { get; set; }
        public Guid GroupGuid { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int Order { get; set; }
        public int TotalTopics { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // --- 2. DTO Request (INPUT) ---
    public class AddGrammarGroupRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? Order { get; set; }
    }

    public class UpdateGrammarGroupRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? Order { get; set; }
    }

    public class AddGrammarRequest
    {
        public int? TopicId { get; set; }
        public string? RuleName { get; set; }
        public string? Structure { get; set; }
        public string? Meaning { get; set; }
        public string? Example { get; set; }
        public string? ExampleTranslation { get; set; }
        public string? AudioUrl { get; set; }
        public string? ImageUrl { get; set; }
        public string? CommonMistakes { get; set; }
        public int? Difficulty { get; set; }
        public bool? IsQuestionsPremiumRequired { get; set; }
        public string? NegativeExample { get; set; }
        public string? NegativeExampleTranslation { get; set; }
        public string? TestTip { get; set; }
        public int? Frequency { get; set; }
        public string? RelatedRuleIds { get; set; }
        public List<GrammarExampleInputDto>? GrammarExamples { get; set; }
    }

    public class UpdateGrammarRequest
    {
        public string? RuleName { get; set; }
        public string? Structure { get; set; }
        public string? Meaning { get; set; }
        public string? Example { get; set; }
        public string? ExampleTranslation { get; set; }
        public string? AudioUrl { get; set; }
        public string? ImageUrl { get; set; }
        public string? CommonMistakes { get; set; }
        public int? Difficulty { get; set; }
        public bool? IsQuestionsPremiumRequired { get; set; }
        public int? TopicId { get; set; }
        public string? NegativeExample { get; set; }
        public string? NegativeExampleTranslation { get; set; }
        public string? TestTip { get; set; }
        public int? Frequency { get; set; }
        public string? RelatedRuleIds { get; set; }
        public List<GrammarExampleInputDto>? GrammarExamples { get; set; }
    }

    public class AddGrammarTopicRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? Level { get; set; }
        public string? LevelRange { get; set; }
        public string? Category { get; set; }
    }

    public class UpdateGrammarTopicRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? Level { get; set; }
        public string? LevelRange { get; set; }
        public string? Category { get; set; }
    }

    // --- 3. User Progress DTOs ---
    public class UserGrammarProgressDto
    {
        public int? Id { get; set; }
        public int? UserId { get; set; }
        public int? GrammarId { get; set; }
        public int? Status { get; set; } // 0: New, 1: Learning, 3: Mastered
        public int? CorrectStreak { get; set; }
        public int? ReviewCount { get; set; }
        public DateTime? NextReviewAt { get; set; }
        public DateTime? LastReviewedAt { get; set; }
        public int? Level { get; set; }
        public DateTime? CreatedAt { get; set; }

        public GrammarDto? Grammar { get; set; }
    }

    public class UpdateGrammarProgressRequest
    {
        public bool? IsCorrect { get; set; }
        public int? Level { get; set; }
        public DateTime? NextReviewAt { get; set; }
        public int? DurationSeconds { get; set; }  // NEW: Track practice time per answer
    }

    // --- 4. Question Grammar DTOs ---
    public class QuestionGrammarAnswerDto
    {
        public int? Id { get; set; }
        public int? QuestionGrammarId { get; set; }
        public string? Label { get; set; } // A, B, C, D
        public string? Content { get; set; }
        public bool? IsCorrect { get; set; }
    }

    public class QuestionGrammarDto
    {
        public int? Id { get; set; }
        public int? TopicId { get; set; }
        public int? GrammarId { get; set; }  // ← MỚI THÊM
        public int? RuleId { get; set; }     // ← MỚI THÊM
        public int? QuestionNo { get; set; }
        public string? Content { get; set; }
        public string? CorrectOption { get; set; }
        public string? ShortExplanation { get; set; }
        public string? LongExplanation { get; set; }
        public bool ExplanationLocked { get; set; }
        public string? Mode { get; set; } // easy, medium, hard

        public List<QuestionGrammarAnswerDto> Answers { get; set; } = new();
    }

    public class QuestionGrammarWithAnswersDto
    {
        public int? Id { get; set; }
        public int? TopicId { get; set; }
        public int? QuestionNo { get; set; }
        public string? Content { get; set; }
        public string? Mode { get; set; } // easy, medium, hard
        public List<QuestionGrammarAnswerDto> Answers { get; set; } = new();
    }

    // Request DTOs for Grammar Questions
    public class CreateQuestionGrammarRequest
    {
        public int? TopicId { get; set; }
        public int? QuestionNo { get; set; }
        public string? Content { get; set; }
        public string? CorrectOption { get; set; }
        public string? ShortExplanation { get; set; }
        public string? LongExplanation { get; set; }
        public string? Mode { get; set; } = "medium"; // easy, medium, hard
        public List<QuestionGrammarAnswerInputDto>? Answers { get; set; }
    }

    public class QuestionGrammarAnswerInputDto
    {
        public string? Label { get; set; } // A, B, C, D
        public string? Content { get; set; }
        public bool IsCorrect { get; set; }
    }

    // --- 5. Import Grammar DTOs ---
    public class QuestionGrammarImportDto
    {
        public List<QuestionGrammarImportItemDto>? Questions { get; set; }
    }

    public class QuestionGrammarImportItemDto
    {
        public int? QuestionNo { get; set; }
        public string? Content { get; set; }
        public string? CorrectOption { get; set; } // "A", "B", "C", "D"
        public List<string>? Options { get; set; } // [A, B, C, D]
        public string? ShortExplanation { get; set; }
        public string? LongExplanation { get; set; }
        public string? Mode { get; set; } // easy, medium, hard (optional, sẽ được set từ query param)
    }

    // --- 6. Bulk Grammar Creation ---
    public class BulkAddGrammarRequest
    {
        public int TopicId { get; set; }
        public List<AddGrammarRequest> Rules { get; set; } = new();
    }

    public class BulkAddGrammarResponse
    {
        public int TotalCreated { get; set; }
        public List<GrammarDto> CreatedRules { get; set; } = new();
        public List<string> Errors { get; set; } = new();
    }

    // --- Bulk Update DTOs ---
    public class UpdateGrammarItemRequest
    {
        public int Id { get; set; }
        public string? RuleName { get; set; }
        public string? Structure { get; set; }
        public string? Meaning { get; set; }
        public string? Example { get; set; }
        public string? ExampleTranslation { get; set; }
        public string? AudioUrl { get; set; }
        public string? ImageUrl { get; set; }
        public string? CommonMistakes { get; set; }
        public int? Difficulty { get; set; }
        public bool? IsQuestionsPremiumRequired { get; set; }
        public string? NegativeExample { get; set; }
        public string? NegativeExampleTranslation { get; set; }
        public string? TestTip { get; set; }
        public int? Frequency { get; set; }
        public string? RelatedRuleIds { get; set; }
        public List<GrammarExampleInputDto>? GrammarExamples { get; set; }
    }

    public class BulkUpdateGrammarRequest
    {
        public int TopicId { get; set; }
        public List<UpdateGrammarItemRequest> Rules { get; set; } = new();
    }

    public class BulkUpdateGrammarResponse
    {
        public int TotalUpdated { get; set; }
        public List<GrammarDto> UpdatedRules { get; set; } = new();
        public List<string> Errors { get; set; } = new();
    }
}
