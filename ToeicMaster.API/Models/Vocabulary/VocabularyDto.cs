namespace ToeicMaster.API.Models
{
    // --- 1. DTO Trả về cho Frontend (OUTPUT) ---
   public class WordFamilyDto 
    {
        public string Word { get; set; }
        public string PartOfSpeech { get; set; }
        public string? Meaning { get; set; }
    }

    // DTO cho Vocabulary (Output)
    public class VocabularyDto
    {
        public int Id { get; set; }
        public string Word { get; set; }
        public string Meaning { get; set; }
        public string? Pronunciation { get; set; }
        public string? PartOfSpeech { get; set; }
        public string? Example { get; set; }
        public string? ExampleTranslation { get; set; }
        public string? AudioUrl { get; set; }
        public string? ImageUrl { get; set; }
        public int? TopicId { get; set; }      // Sửa lỗi dòng 80, 244
        public string? Tocpic { get; set; }  // Sửa lỗi dòng 245 (Tên Topic)
        public int Difficulty { get; set; }    // Sửa lỗi dòng 246
        public string? Icon { get; set; }
        
        // Trả về danh sách Word Family cho mặt sau Flashcard
        public List<WordFamilyDto> WordFamilies { get; set; } = new();

        // User Progress
        public int Status { get; set; } // 0: New, 1: Learning, 3: Mastered
        public bool IsBookmarked { get; set; } // Nếu bạn có tính năng bookmark từ vựng
    }

    // DTO cho Topic Card (Trang chủ)
    public class TopicDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Level { get; set; }
        public string LevelRange { get; set; }
        public string? ImageUrl { get; set; }
        
        // Tiến độ học
        public int TotalWords { get; set; }
        public int LearnedWords { get; set; } // Số từ đã học (Status > 0)
    }
    public class AddVocabularyRequest
    {
        public string? Icon { get; set; }
        public string Word { get; set; } = null!; // Bắt buộc
        public string Meaning { get; set; } = null!; // Bắt buộc
        public string? Pronunciation { get; set; }
        public string? PartOfSpeech { get; set; }
        public string? Example { get; set; }
        public string? ExampleTranslation { get; set; }
        public string? AudioUrl { get; set; }
        public string? ImageUrl { get; set; }
        public int? TopicId { get; set; }
        public int? Difficulty { get; set; }
        public int? QuestionId { get; set; } // Optional: Link tới câu hỏi gốc

        public List<WordFamilyDto>? WordFamilies { get; set; }
    }

    public class UpdateVocabularyRequest
    {
        // Update thường không cho sửa Word gốc để tránh hỏng dữ liệu User học
        public string? Word { get; set; }
        public string? Meaning { get; set; }
        public string? Pronunciation { get; set; }
        public string? PartOfSpeech { get; set; }
        public string? Example { get; set; }
        public string? ExampleTranslation { get; set; }
        public string? AudioUrl { get; set; }
        public string? ImageUrl { get; set; }
        public int? TopicId { get; set; }
        public int? Difficulty { get; set; }
        public int? QuestionId { get; set; } // Optional: Link tới câu hỏi gốc

        public List<WordFamilyDto>? WordFamilies { get; set; }
    }

    // --- 3. User Action Requests ---
    public class SaveVocabFromQuestionRequest
    {
        public string Word { get; set; } = null!;
        public string Meaning { get; set; } = null!;
        public string? ContextSentence { get; set; } // Ví dụ lấy từ câu hỏi
        public int? QuestionId { get; set; }
    }

    public class ReviewFlashcardRequest
    {
        public bool Remembered { get; set; }
    }
}