
namespace ToeicMaster.API.Entities;
public partial  class ScoreConversion
{
    public int Id { get; set; }
    public int CorrectCount { get; set; } // 0 đến 100
    public int ListeningScore { get; set; }
    public int ReadingScore { get; set; }
}