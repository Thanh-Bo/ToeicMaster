using System.Text;
using System.Text.Json;
using ToeicMaster.API.Entities;

namespace ToeicMaster.API.Services;

public class GrammarAiExplanationService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public GrammarAiExplanationService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["Gemini:ApiKey"] ?? throw new Exception("Chưa cấu hình API Key trong appsettings.json!");
    }

    /// <summary>
    /// Build prompt cho câu hỏi ngữ pháp (Grammar Questions - Part 5 style)
    /// </summary>
    private string BuildPromptForGrammarQuestion(
        string content,
        List<string> options,
        string correctOption,
        string grammarTopic,
        string mode
    )
    {
        var optionsText = string.Join("\n", options.Select((o, i) => $"{(char)('A' + i)}. {o}"));

        return $@"
Bạn là giáo viên TOEIC chuyên ngữ pháp tiếng Anh.

**CHỦ ĐỀ NGỮ PHÁP:** {grammarTopic}
**MỨC ĐỘ:** {mode} (easy/medium/hard)

Đây là câu hỏi ngữ pháp Part 5 TOEIC (Incomplete Sentences).

**Câu hỏi:** {content}

**Các đáp án:**
{optionsText}

**Đáp án đúng:** {correctOption}

**YÊU CẦU BẮT BUỘC:**

1. **Dịch nghĩa (CHỈ trong Short):**
   - Dịch câu hoàn chỉnh sang tiếng Việt
   - Dịch 4 đáp án A, B, C, D sang tiếng Việt (ngắn gọn)

2. **Loại câu hỏi:**
   - Xác định: Từ loại, Thì động từ, Giới từ, Liên từ, Đại từ, Collocations, v.v.

3. **Giải thích:**
   - Quy tắc ngữ pháp cần nhớ
   - Tại sao đáp án đúng
   - Các đáp án sai tại sao sai

4. **Cảnh báo bẫy:**
   - CHỌN 1 bẫy quan trọng nhất (nếu có)

**ĐỊNH DẠNG OUTPUT:**

- **Short** (tối đa 6 dòng HTML với <br>):
  - Dòng 1: ""Câu hỏi: "" + dịch câu hỏi
  - Dòng 2-5: 4 đáp án với format: A. [English] : [Vietnamese]<br>
    + Đáp án đúng BAO BỌC trong <span class='highlight-correct'>[dòng đầy đủ]</span>
  - Dòng 6: ""- Đáp án [X] vì..."" (lý do ngắn gọn)
  - ❌ KHÔNG dùng <b> ở bất kỳ đâu

- **Full** (tối đa 3 mục, mỗi mục MAX 1-2 dòng với <br>):
  - ""- Loại câu hỏi: [từ loại/thì/giới từ/...]"" 
  - ""- Giải thích: [Quy tắc + Tại sao đúng, gộp 1-2 dòng]""
  - ""- Cảnh báo bẫy: [CHỌN 1 bẫy quan trọng nhất]""
  - ❌ KHÔNG dùng <b> in đậm
  - ❌ KHÔNG dịch lại

**TRẢ VỀ JSON THUẦN (KHÔNG có markdown ```json):**
{{
  ""Short"": ""[HTML với <br>]"",
  ""Full"": ""[HTML với <br>]""
}}

**VÍ DỤ OUTPUT ĐÚNG:**
{{
  ""Short"": ""Câu hỏi: Công ty đang tìm kiếm một nhân viên mới.<br><span class='highlight-correct'>A. experienced : có kinh nghiệm</span><br>B. experience : kinh nghiệm (danh từ)<br>C. experiencing : đang trải qua<br>D. experiences : trải nghiệm (số nhiều)<br>- Đáp án A vì cần tính từ bổ nghĩa cho danh từ 'nhân viên'"",
  ""Full"": ""- Loại câu hỏi: Từ loại (tính từ)<br>- Giải thích: Sau mạo từ 'a' và trước danh từ 'nhân viên' cần tính từ. 'Experienced' là tính từ có nghĩa 'có kinh nghiệm'<br>- Cảnh báo bẫy: Nhầm lẫn giữa 'experience' (danh từ) và 'experienced' (tính từ)""
}}
";
    }

    /// <summary>
    /// Generate explanation cho câu hỏi ngữ pháp
    /// </summary>
    public async Task<(string? Short, string? Full)> GenerateExplanationAsync(
        string content,
        List<string> options,
        string correctOption,
        string grammarTopic,
        string mode = "medium"
    )
    {
        // Build prompt
        var prompt = BuildPromptForGrammarQuestion(content, options, correctOption, grammarTopic, mode);

        // Cấu trúc Body gửi lên Google Gemini
        var requestBody = new
        {
            contents = new[] { new { parts = new[] { new { text = prompt } } } },
        };

        var jsonContent = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json"
        );

        var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={_apiKey}";

        try
        {
            var response = await _httpClient.PostAsync(url, jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                return ($"Lỗi: {response.StatusCode}", $"Chi tiết: {errorContent}");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);

            // Extract text from Gemini response
            var textResult = doc
                .RootElement.GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            // Remove markdown code blocks if present
            textResult = textResult?.Replace("```json", "").Replace("```", "").Trim();

            // Parse JSON to get Short/Full
            var resultObj = JsonSerializer.Deserialize<AiGrammarResponse>(textResult ?? "{}");
            return (resultObj?.Short, resultObj?.Full);
        }
        catch (Exception ex)
        {
            return ($"Lỗi: {ex.Message}", "Không thể tạo giải thích từ AI");
        }
    }

    
}

// DTOs
public class AiGrammarResponse
{
    public string? Short { get; set; }
    public string? Full { get; set; }
}

public class GrammarQuestionWithExplanation
{
    public string Content { get; set; } = "";
    public List<string> Options { get; set; } = new();
    public string CorrectOption { get; set; } = "";
    public string ShortExplanation { get; set; } = "";
    public string FullExplanation { get; set; } = "";
}
