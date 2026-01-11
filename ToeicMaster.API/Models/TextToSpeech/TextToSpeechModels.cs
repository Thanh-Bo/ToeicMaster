namespace ToeicMaster.API.Models.TextToSpeech
{
    public class TextToSpeechRequest
    {
        public string Text { get; set; } = "Hello, this is a test.";
    }

    public class TextToSpeechResponse
    {
        public string Message { get; set; }
        public string TestText { get; set; }
        public string AudioUrl { get; set; }
    }

    public class AudioBatchRequest
    {
        public List<int> QuestionIds { get; set; }
    }
}
