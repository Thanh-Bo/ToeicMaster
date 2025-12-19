using System.ComponentModel.DataAnnotations;

namespace ToeicMaster.API.Models.Admin
{
    // Cấu trúc tổng của 1 đề thi
    public class CreateTestDto
    {
        public string Title { get; set; } = string.Empty; // VD: ETS 2024 Test 1
        public string Slug { get; set; } = string.Empty;  // VD: ets-2024-test-1
        public int Duration { get; set; } = 120;
        public List<CreatePartDto> Parts { get; set; } = new();
    }

    public class CreatePartDto
    {
        public string Name { get; set; } = string.Empty; // VD: Part 1
        public int PartNumber { get; set; } // 1, 2, ... 7
        public List<CreateGroupDto> Groups { get; set; } = new();
    }

    public class CreateGroupDto
    {
        public string? TextContent { get; set; } // Dùng cho Part 6, 7 (Đoạn văn)
        public string? ImageUrl { get; set; }    // Dùng cho Part 1, 3, 4, 7
        public string? AudioUrl { get; set; }    // Dùng cho Part 1, 2, 3, 4
        public List<CreateQuestionDto> Questions { get; set; } = new();
    }

    public class CreateQuestionDto
    {
        public int QuestionNo { get; set; } // VD: 101
        public string Content { get; set; } = string.Empty; // Nội dung câu hỏi
        public string CorrectOption { get; set; } = "A"; // Đáp án đúng
        public string? Explanation { get; set; } // Giải thích (Optional)
        public List<CreateAnswerDto> Answers { get; set; } = new();
    }

    public class CreateAnswerDto
    {
        public string Label { get; set; } = string.Empty; // A, B, C, D
        public string Content { get; set; } = string.Empty; // Nội dung đáp án
    }

    // Request đơn giản để tạo Test mới (không kèm Parts)
    public class CreateTestRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Slug { get; set; }
        public string? Type { get; set; } // FULL_TEST, MINI_TEST, PRACTICE
        public int? Duration { get; set; }
        public int? TotalQuestions { get; set; }
    }
}