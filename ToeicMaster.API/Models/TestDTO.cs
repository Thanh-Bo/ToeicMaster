namespace ToeicMaster.API.Models
{
    // 1. DTO dùng cho API lấy danh sách (GET /api/v1/tests)
    public class TestSummaryDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public int Duration { get; set; }
        public int TotalQuestions { get; set; }
    }

    // 2. DTO dùng cho API lấy chi tiết đề thi (GET /api/v1/tests/{id}/full)
    public class TestDetailDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public int Duration { get; set; }
        public List<PartDto> Parts { get; set; } = new();
    }

    public class PartDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public List<GroupDto> Groups { get; set; } = new();
    }

    public class GroupDto
    {
        public int Id { get; set; }
        public string? TextContent { get; set; }
        public string? ImageUrl { get; set; }
        public string? AudioUrl { get; set; }
        public List<QuestionDto> Questions { get; set; } = new();
    }

    public class QuestionDto
    {
        public int Id { get; set; }
        public int QuestionNo { get; set; }
        public string? Content { get; set; }
        public List<AnswerDto> Answers { get; set; } = new();
    }

    public class AnswerDto
    {
        public string? Label { get; set; } // A, B, C, D
        public string? Content { get; set; }
    }
}