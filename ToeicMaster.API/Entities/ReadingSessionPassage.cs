namespace ToeicMaster.API.Entities;

public partial class ReadingSessionPassage
{
    public int Id { get; set; }

    public int SessionId { get; set; }

    public int PassageId { get; set; }

    public int DisplayOrder { get; set; }

    public virtual ReadingSession Session { get; set; } = null!;

    public virtual ReadingPassage Passage { get; set; } = null!;
}
