using System.ComponentModel.DataAnnotations;

namespace ToeicMaster.API.Entities;

public class GrammarGroup
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = null!; // Ví dụ: "Nhóm 1: Từ loại & Cấu trúc cơ bản"

    public string? Description { get; set; }

    public int Order { get; set; } = 0; // Thứ tự hiển thị

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Quan hệ 1-n với GrammarTopics
    public virtual ICollection<GrammarTopic> Topics { get; set; } = new List<GrammarTopic>();
}
