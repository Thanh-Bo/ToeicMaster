namespace ToeicMaster.API.Models.Exam
{
    public class SubmitTestRequest
    {
        public int TestId { get; set; }

        /// <summary>
        /// Parts the user chose, e.g. "5" or "1,2,5".
        /// Null/empty means the full test.
        /// </summary>
        public string? Parts { get; set; }

        public List<UserAnswerDto> Answers { get; set; } = new();
        public int Duration { get; set; }
    }

    public class UserAnswerDto
    {
        public int QuestionId { get; set; }
        public string SelectedOption { get; set; } = string.Empty;
    }

    public class TestResultResponse
    {   
        public int ListeningScore { get; set; }
        public int ReadingScore { get; set; }
        public int AttemptId { get; set; }
        public Guid AttemptGuid { get; set; }
        public int TotalScore { get; set; }
        public int TotalQuestions { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}