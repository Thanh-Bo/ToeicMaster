using System;

namespace ToeicMaster.API.Models.Grammar
{
    /// <summary>
    /// DTO for grammar statistics overview
    /// </summary>
    public class GrammarStatsDto
    {
        // Overview stats
        public int TotalLessonsLearned { get; set; }
        public int TotalLessonsAvailable { get; set; }
        public double LessonsProgressPercent { get; set; }
        
        public int TotalQuestionsPracticed { get; set; }
        public int TotalCorrectAnswers { get; set; }
        public double AccuracyPercent { get; set; }
        
        public int TotalStudyTimeMinutes { get; set; }
        public string TotalStudyTimeFormatted { get; set; } = string.Empty;
        
        // Streak info
        public StreakInfoDto Streak { get; set; } = new();
        
        // Time period filter applied
        public string Period { get; set; } = "all";
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    /// <summary>
    /// Streak information
    /// </summary>
    public class StreakInfoDto
    {
        public int CurrentStreak { get; set; }
        public int LongestStreak { get; set; }
        public int TotalStudyDays { get; set; }
        public bool HasActivityToday { get; set; }
        public DateTime? LastActivityDate { get; set; }
        public List<DailyActivityDto> WeeklyActivity { get; set; } = new();
    }

    /// <summary>
    /// Daily activity for streak and heatmap
    /// </summary>
    public class DailyActivityDto
    {
        public DateTime Date { get; set; }
        public bool HasActivity { get; set; }
        public int TotalStudyMinutes { get; set; }
        public int LessonsLearned { get; set; }
        public int QuestionsAnswered { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
    }

    /// <summary>
    /// Study session recording request
    /// </summary>
    public class RecordStudySessionRequest
    {
        public int? GrammarId { get; set; }
        public int? TopicId { get; set; }
        public int? GroupId { get; set; }
        public string SessionType { get; set; } = "lesson"; // 'lesson', 'practice', 'review'
        public int DurationSeconds { get; set; }
        public int QuestionsAnswered { get; set; }
        public int CorrectAnswers { get; set; }
    }

    /// <summary>
    /// Group progress analysis
    /// </summary>
    public class GroupProgressDto
    {
        public int GroupId { get; set; }
        public string GroupTitle { get; set; } = string.Empty;
        public string? GroupDescription { get; set; }
        public int GroupOrder { get; set; }
        
        public int TotalTopics { get; set; }
        public int TotalLessons { get; set; }
        public int LearnedLessons { get; set; }
        public double ProgressPercent { get; set; }
        
        public int StudyTimeMinutes { get; set; }
        public int QuestionsAnswered { get; set; }
        public double AccuracyPercent { get; set; }
        
        public List<TopicProgressDto> Topics { get; set; } = new();
    }

    /// <summary>
    /// Topic progress within a group
    /// </summary>
    public class TopicProgressDto
    {
        public int TopicId { get; set; }
        public string TopicTitle { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string? Level { get; set; }
        public string? ImageUrl { get; set; }
        
        public int TotalLessons { get; set; }
        public int LearnedLessons { get; set; }
        public double ProgressPercent { get; set; }
        
        public int StudyTimeMinutes { get; set; }
        public int QuestionsAnswered { get; set; }
        public double AccuracyPercent { get; set; }
        
        public DateTime? LastStudiedAt { get; set; }
        public DateTime? NextReviewAt { get; set; }
        public bool IsReadyForReview { get; set; }
        
        public List<LessonProgressDto> Lessons { get; set; } = new();
    }

    /// <summary>
    /// Individual lesson progress
    /// </summary>
    public class LessonProgressDto
    {
        public int GrammarId { get; set; }
        public string GrammarTitle { get; set; } = string.Empty;
        public int Status { get; set; } // 0=New, 1=Learning, 2=Reviewing, 3=Mastered
        public string StatusText { get; set; } = string.Empty;
        public int Level { get; set; }
        public int CorrectStreak { get; set; }
        public DateTime? FirstLearnedAt { get; set; }
        public DateTime? LastReviewedAt { get; set; }
        public DateTime? NextReviewAt { get; set; }
        public bool IsReadyForReview { get; set; }
    }

    /// <summary>
    /// Heatmap data for activity visualization
    /// </summary>
    public class HeatmapDataDto
    {
        public List<HeatmapWeekDto> Weeks { get; set; } = new();
        public int MaxActivityMinutes { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class HeatmapWeekDto
    {
        public List<HeatmapDayDto> Days { get; set; } = new();
    }

    public class HeatmapDayDto
    {
        public DateTime Date { get; set; }
        public int ActivityLevel { get; set; } // 0-4 (0=none, 4=max)
        public int StudyMinutes { get; set; }
        public bool HasActivity { get; set; }
    }

    /// <summary>
    /// Time distribution data
    /// </summary>
    public class TimeDistributionDto
    {
        public int MorningMinutes { get; set; } // 6-12h
        public int AfternoonMinutes { get; set; } // 12-18h
        public int EveningMinutes { get; set; } // 18-22h
        public int NightMinutes { get; set; } // 22-6h
        public string PeakStudyTime { get; set; } = string.Empty;
    }
}
