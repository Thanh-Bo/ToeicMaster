namespace ToeicMaster.API.Models;

public class ImportQuestionVocabRequest
{
    public string Content { get; set; } = string.Empty;
    public string CorrectOption { get; set; } = string.Empty;
    public string? ShortExplanation { get; set; }
    public string? LongExplanation { get; set; }
    public List<ImportQuestionVocabAnswerRequest> Answers { get; set; } = new();
}

public class ImportQuestionVocabAnswerRequest
{
    public string Label { get; set; } = string.Empty;  // A, B, C, D
    public string Content { get; set; } = string.Empty;
}
