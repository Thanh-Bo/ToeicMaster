namespace ToeicMaster.API.Models.Exam
{
    public class TestResultDetailDto
    {
        public int AttemptId { get; set; }
        public string TestTitle { get; set; } = string.Empty;
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
        public string? Explanation { get; set; } // Giải thích
        public List<ResultAnswerDto> Answers { get; set; } = new();
    }

    public class ResultAnswerDto
    {
        public string Label { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}