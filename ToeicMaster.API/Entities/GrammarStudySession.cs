using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToeicMaster.API.Entities
{
    /// <summary>
    /// Tracks individual grammar study sessions
    /// </summary>
    [Table("GrammarStudySessions")]
    public class GrammarStudySession
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        public int? GrammarId { get; set; }

        public int? TopicId { get; set; }

        public int? GroupId { get; set; }

        [Required]
        [MaxLength(50)]
        public string SessionType { get; set; } = "lesson"; // 'lesson', 'practice', 'review'

        public int DurationSeconds { get; set; } = 0;

        public int QuestionsAnswered { get; set; } = 0;

        public int CorrectAnswers { get; set; } = 0;

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;

        public DateTime? EndedAt { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public User? User { get; set; }

        [ForeignKey("GrammarId")]
        public Grammar? Grammar { get; set; }

        [ForeignKey("TopicId")]
        public GrammarTopic? Topic { get; set; }

        [ForeignKey("GroupId")]
        public GrammarGroup? Group { get; set; }
    }
}
