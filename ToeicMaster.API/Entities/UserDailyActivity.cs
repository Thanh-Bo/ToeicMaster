using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToeicMaster.API.Entities
{
    /// <summary>
    /// Tracks daily user activity for streak calculations
    /// </summary>
    [Table("UserDailyActivity")]
    public class UserDailyActivity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public bool HasActivity { get; set; } = false;

        public int TotalStudySeconds { get; set; } = 0;

        public int LessonsLearnedCount { get; set; } = 0;

        public int QuestionsAnsweredCount { get; set; } = 0;

        public int CorrectAnswersCount { get; set; } = 0;

        public DateTime? LastActivityAt { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}
