namespace ToeicMaster.API.Models
{
    // --- 1. DTO Trả về cho Frontend (OUTPUT) ---
    public class GrammarExampleDto
    {
        public int Id { get; set; }
        public int GrammarId { get; set; }
        public string Sentence { get; set; } = null!;
        public string? Translation { get; set; }
        public string? Context { get; set; }
        public string? AudioUrl { get; set; }
    }

    // DTO cho Grammar (Output)
    public class GrammarDto
    {
        public int Id { get; set; }
        public int TopicId { get; set; }
        public string RuleName { get; set; } = null!;
        public string? Structure { get; set; }
        public string Meaning { get; set; } = null!;
        public string? Example { get; set; }
        public string? ExampleTranslation { get; set; }
        public string? AudioUrl { get; set; }
        public string? ImageUrl { get; set; }
        public string? CommonMistakes { get; set; }
        public int Difficulty { get; set; }
        public string? TopicTitle { get; set; } // Topic name
        public int Level { get; set; }
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
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string Level { get; set; } = null!;
        public string LevelRange { get; set; } = null!;
        public string Category { get; set; } = null!;

        // Progress tracking
        public int TotalRules { get; set; }
        public int LearnedRules { get; set; } // Số quy tắc đã học (Status > 0)

        // SRS Progress
        public int CurrentLevel { get; set; } // 0-5
        public DateTime? NextReviewAt { get; set; }
        public Dictionary<int, int> RuleCounts { get; set; } = new(); // level -> count
        public bool CanReviewNow { get; set; }
        public string TimeUntilReady { get; set; } = ""; // "12h 30m"
    }

    // --- 2. DTO Request (INPUT) ---
    public class AddGrammarRequest
    {
        public int TopicId { get; set; }
        public string RuleName { get; set; } = null!;
        public string? Structure { get; set; }
        public string Meaning { get; set; } = null!;
        public string? Example { get; set; }
        public string? ExampleTranslation { get; set; }
        public string? AudioUrl { get; set; }
        public string? ImageUrl { get; set; }
        public string? CommonMistakes { get; set; }
        public int Difficulty { get; set; }

        public List<GrammarExampleDto>? GrammarExamples { get; set; }
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
        public int? TopicId { get; set; }

        public List<GrammarExampleDto>? GrammarExamples { get; set; }
    }

    public class AddGrammarTopicRequest
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string Level { get; set; } = null!;
        public string LevelRange { get; set; } = null!;
        public string Category { get; set; } = null!;
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
        public int Id { get; set; }
        public int UserId { get; set; }
        public int GrammarId { get; set; }
        public int Status { get; set; } // 0: New, 1: Learning, 3: Mastered
        public int CorrectStreak { get; set; }
        public int ReviewCount { get; set; }
        public DateTime? NextReviewAt { get; set; }
        public DateTime? LastReviewedAt { get; set; }
        public int Level { get; set; }
        public DateTime CreatedAt { get; set; }

        public GrammarDto? Grammar { get; set; }
    }

    public class UpdateGrammarProgressRequest
    {
        public bool IsCorrect { get; set; }
        public int Level { get; set; }
        public DateTime? NextReviewAt { get; set; }
    }

    // --- 4. Question Grammar DTOs ---
    public class QuestionGrammarAnswerDto
    {
        public int Id { get; set; }
        public int QuestionGrammarId { get; set; }
        public string? Label { get; set; } // A, B, C, D
        public string? Content { get; set; }
        public bool IsCorrect { get; set; }
    }

    public class QuestionGrammarDto
    {
        public int Id { get; set; }
        public int TopicId { get; set; }
        public int QuestionNo { get; set; }
        public string? Content { get; set; }
        public string? CorrectOption { get; set; }
        public string? ShortExplanation { get; set; }
        public string? LongExplanation { get; set; }

        public List<QuestionGrammarAnswerDto> Answers { get; set; } = new();
    }

    public class QuestionGrammarWithAnswersDto
    {
        public int Id { get; set; }
        public int TopicId { get; set; }
        public int QuestionNo { get; set; }
        public string? Content { get; set; }
        public List<QuestionGrammarAnswerDto> Answers { get; set; } = new();
    }

    // --- 5. Import Grammar DTOs ---
    public class QuestionGrammarImportDto
    {
        public List<QuestionGrammarImportItemDto> Questions { get; set; } = new();
    }

    public class QuestionGrammarImportItemDto
    {
        public int QuestionNo { get; set; }
        public string Content { get; set; } = string.Empty;
        public string CorrectOption { get; set; } = string.Empty; // "A", "B", "C", "D"
        public List<string> Options { get; set; } = new(); // [A, B, C, D]
        public string? ShortExplanation { get; set; }
        public string? LongExplanation { get; set; }
    }
}
