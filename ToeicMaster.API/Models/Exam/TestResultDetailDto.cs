namespace ToeicMaster.API.Models.Exam
{

    public class TestResultDetailDto
    {
        public int TimeTaken { get; set; }
        public int AttemptId { get; set; }
        public int TestId { get; set; }
        public string TestTitle { get; set; }
        public bool IsExplanationPremiumRequired { get; set; }
        public bool CanViewExplanation { get; set; }
        public int TotalScore { get; set; }
        public int ListeningScore { get; set; } // Điểm Listening (5-495)
        public int ReadingScore { get; set; } // Điểm Reading (5-495)
        public int TotalQuestions { get; set; }

        /// <summary>
        /// True when the attempt covers the whole test. When false, the scaled
        /// TOEIC scores are not meaningful and the UI should show raw counts.
        /// </summary>
        public bool IsFullTest { get; set; }
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
        public bool ExplanationLocked { get; set; }
        public List<ResultAnswerDto> Answers { get; set; } = new();

        public int? GroupId { get; set; }
        public string? GroupContent { get; set; }

        // Thêm các trường cho Part 1, 2
        public int PartNumber { get; set; }
        public string? PartName { get; set; }
        public string? ImageUrl { get; set; }
        public string? AudioUrl { get; set; }
        public string? Transcript { get; set; }
        public string? GroupContentTranslation { get; set; } // Cached translation of TextContent
        public string? TranscriptTranslation { get; set; }   // Cached translation of Transcript
    }

    public class ResultAnswerDto
    {
        public string Label { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}
