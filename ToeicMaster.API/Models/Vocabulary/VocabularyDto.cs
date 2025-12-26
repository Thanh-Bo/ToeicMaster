namespace ToeicMaster.API.Models
{
    // --- 1. DTO Trả về cho Frontend (OUTPUT) ---
    public class VocabularyDto
    {
        public string? Icon { get; set; }
        public int Id { get; set; }
        public string Word { get; set; } = null!;
        public string? Pronunciation { get; set; }
        public string? PartOfSpeech { get; set; }
        public string Meaning { get; set; } = null!;
        public string? Example { get; set; }
        public string? ExampleTranslation { get; set; }
        public string? AudioUrl { get; set; }
        
        // 🔥 Đã thêm cái này (Lúc trước bị thiếu)
        public string? ImageUrl { get; set; } 
        
        public string? Category { get; set; }
        public int Difficulty { get; set; }

        // --- User Progress Fields (Nullable vì User có thể chưa học từ này) ---
        public int Status { get; set; } // 0: New, 1: Learning...
        public DateTime? NextReviewAt { get; set; }
    }

    // --- 2. Request Thêm/Sửa (INPUT) ---
    // Gộp Add và Update cho gọn nếu logic giống nhau, hoặc tách ra tùy bạn.
    // Ở đây mình giữ nguyên nhưng check lại các trường cần thiết.
    
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
        public string? Category { get; set; }
        public int? Difficulty { get; set; }
        public int? QuestionId { get; set; } // Optional: Link tới câu hỏi gốc
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
        public string? Category { get; set; }
        public int? Difficulty { get; set; }
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