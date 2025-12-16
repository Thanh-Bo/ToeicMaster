namespace ToeicMaster.API.Models.Exam
{
    public class SubmitTestRequest
    {
        public int TestId { get; set; }
        public List<UserAnswerDto> Answers { get; set; } = new();
    }

    public class UserAnswerDto
    {
        public int QuestionId { get; set; }
        public string SelectedOption { get; set; } = string.Empty;
    }

    public class TestResultResponse
    {
        public int AttemptId { get; set; }
        public int TotalScore { get; set; }
        public int TotalQuestions { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}