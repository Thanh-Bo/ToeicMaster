namespace ToeicMaster.API.Models.Exam
{
    public class TestResultDetailDto
    {
        public int AttemptId { get; set; }
        public int TestId { get; set; }
        public string TestTitle { get; set; } 
        public int TotalScore { get; set; }
        public int TotalQuestions { get; set; }
        public DateTime CompletedAt { get; set; }
        public List<ResultQuestionDto> Questions { get; set; } = new();
    }

    public class ResultQuestionDto
    {
        public int QuestionId { get; set; }
        public int QuestionNo { get; set; }
        public string Content { get; set; } = string.Empty;
        public string UserSelected { get; set; } = string.Empty; // Đáp án user chọn (VD: "A")
        public string CorrectOption { get; set; } = string.Empty; // Đáp án đúng (VD: "B")
        public bool IsCorrect { get; set; }
        public string? ShortExplanation { get; set; } 
        public string? FullExplanation { get; set; }
        public List<ResultAnswerDto> Answers { get; set; } = new();

        public int? GroupId { get; set; }           
        public string? GroupContent { get; set; }
        
        // Thêm các trường cho Part 1, 2
        public int PartNumber { get; set; }
        public string? PartName { get; set; }
        public string? ImageUrl { get; set; }
        public string? AudioUrl { get; set; }
    }

    public class ResultAnswerDto
    {
        public string Label { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}