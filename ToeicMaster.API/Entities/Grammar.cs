using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ToeicMaster.API.Entities;

public class Grammar
{
    public int Id { get; set; }

    public int TopicId { get; set; }

    [Required]
    public string RuleName { get; set; } = null!; // Ví dụ: "Present Perfect for Life Experiences"

    public string? Structure { get; set; } // Formula: "Subject + have/has + V3"

    [Required]
    public string Meaning { get; set; } = null!; // When to use it

    public string? Example { get; set; } // Example sentence

    public string? ExampleTranslation { get; set; } // Vietnamese translation

    public string? AudioUrl { get; set; }

    public string? ImageUrl { get; set; } // Timeline diagram or visual

    public string? CommonMistakes { get; set; }

    public int Difficulty { get; set; } // 1-5 scale

    public string? NegativeExample { get; set; } // What NOT to do

    public string? NegativeExampleTranslation { get; set; } // Vietnamese translation of negative example

    public string? TestTip { get; set; } // TOEIC test strategy/tip

    public int? Frequency { get; set; } // 1-10 scale for importance in TOEIC

    public string? RelatedRuleIds { get; set; } // JSON string: "[1,5,12]"

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public virtual GrammarTopic? Topic { get; set; }

    public virtual ICollection<GrammarExample> GrammarExamples { get; set; } = new List<GrammarExample>();

    public virtual ICollection<UserGrammar> UserGrammars { get; set; } = new List<UserGrammar>();
}
