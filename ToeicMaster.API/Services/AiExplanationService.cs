using System.Text;
using System.Text.Json;
using ToeicMaster.API.Entities;

public class AiExplanationService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey = "AIzaSyB5OkDvRzbQVQ_yho7-qLfuP6_IgTUZ04M"; 
    public AiExplanationService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<(string? Short, string? Full)> GenerateExplanationAsync(Question question, List<Answer> answers)
    {
        var answerText = string.Join(", ", answers.Select(a => $"{a.Label}. {a.Content}"));

        // Prompt yêu cầu trả về JSON chuẩn
        var prompt = $@"
        Bạn là giáo viên TOEIC. Hãy phân tích câu hỏi sau và trả về kết quả dưới dạng JSON (không có markdown ```json) gồm 2 trường:
        1. ""Short"": Giải thích siêu ngắn gọn (dưới 15 từ), lý do ngữ pháp chính.
        2. ""Full"": Giải thích chi tiết, dịch nghĩa, tại sao đúng/sai, định dạng HTML đơn giản (br, b).

        Câu hỏi: {question.Content}
        Các đáp án: {answerText}
        Đáp án đúng là: {question.CorrectOption}";

        // Cấu trúc Body gửi lên Google Gemini
        var requestBody = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = prompt } } }
            }
        };

        var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
        
        // Gọi API Gemini 1.5 Flash (Bản nhanh và miễn phí)
        var response = await _httpClient.PostAsync($"[https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=](https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=){_apiKey}", jsonContent);

        if (!response.IsSuccessStatusCode) return ("Lỗi API", "Lỗi API");

        var responseString = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseString);
        
        // Gemini trả về cấu trúc hơi sâu, cần trích xuất text ra
        try 
        {
            var textResult = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            // Cắt bỏ phần ```json nếu có
            textResult = textResult.Replace("```json", "").Replace("```", "").Trim();

            // Parse JSON từ text của AI để lấy 2 trường Short/Full
            var resultObj = JsonSerializer.Deserialize<AiResponse>(textResult);
            return (resultObj.Short, resultObj.Full);
        }
        catch 
        {
            return ("Lỗi parse", "AI trả về format không đúng");
        }
    }
}

// Class phụ để hứng dữ liệu
public class AiResponse
{
    public string? Short { get; set; }
    public string? Full { get; set; }
}