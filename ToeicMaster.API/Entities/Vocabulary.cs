using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class Vocabulary
{
    public string? Icon { get; set; }
    public int Id { get; set; }

    public string Word { get; set; } = null!;

    public string? Pronunciation { get; set; }

    public string? PartOfSpeech { get; set; }

    public string Meaning { get; set; } = null!;

    public string? Example { get; set; }

    public string? ExampleTranslation { get; set; }

    public string? AudioUrl { get; set; }

    public string? ImageUrl { get; set; }

    public int? QuestionId { get; set; }

    public int? TopicId { get; set; } 
    public virtual Topic? Topic { get; set; }

    // Thêm danh sách WordFamily
    public virtual ICollection<WordFamily> WordFamilies { get; set; } = new List<WordFamily>();

    // Collocations, Synonyms, Antonyms (JSON format)
    public string? Collocations { get; set; }
    public string? Synonyms { get; set; }
    public string? Antonyms { get; set; }

    public int Difficulty { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Question? Question { get; set; }

}
