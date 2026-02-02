using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Models.Speaking
{
    public class SpeakingPracticeRequest
    {
        public string Part { get; set; } // "Part1", "Part2", etc
        public int QuestionId { get; set; }
        public string AudioUrl { get; set; } // URL của audio sau khi upload S3
        public int AudioDurationSeconds { get; set; }
        public string TranscriptText { get; set; } // Optional: user provided transcript
    }

    public class SpeakingPracticeResponse
    {
        public int Id { get; set; }
        public string Part { get; set; }
        public int QuestionId { get; set; }
        public string AudioUrl { get; set; }
        public int AudioDurationSeconds { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class SpeakingFeedbackResponse
    {
        public int PracticeId { get; set; }
        public int PronunciationScore { get; set; }
        public int GrammarScore { get; set; }
        public int VocabularyScore { get; set; }
        public int FluencyScore { get; set; }
        public int OverallScore { get; set; }
        public int BandScore { get; set; }

        public string PronunciationFeedback { get; set; }
        public string GrammarFeedback { get; set; }
        public string VocabularyFeedback { get; set; }
        public string FluencyFeedback { get; set; }
        public string GeneralFeedback { get; set; }

        public List<SpeakingIssueFeedback> DetailedFeedback { get; set; } = new();
        public DateTime EvaluatedAt { get; set; }
    }

    public class SpeakingIssueFeedback
    {
        public string Type { get; set; } // "PRONUNCIATION", "GRAMMAR", "VOCABULARY", "FLUENCY"
        public string Issue { get; set; }
        public string Suggestion { get; set; }
        public string Example { get; set; }
    }

    public class SpeakingHistoryItem
    {
        public int Id { get; set; }
        public string Part { get; set; }
        public int QuestionId { get; set; }
        public string QuestionText { get; set; }
        public int OverallScore { get; set; }
        public int BandScore { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public int AudioDurationSeconds { get; set; }
    }

    public class SpeakingStatsResponse
    {
        public int TotalPractices { get; set; }
        public double AverageScore { get; set; }
        public int BestScore { get; set; }
        public Dictionary<string, int> ScoreByPart { get; set; } = new();
        public Dictionary<string, double> AverageByMetric { get; set; } = new();
    }
}
