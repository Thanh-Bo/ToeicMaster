using System.Text;
using System.Text.Json;
using ToeicMaster.API.Entities;

public class AiExplanationService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public AiExplanationService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        // Lấy key an toàn từ file cấu hình
        _apiKey = configuration["Gemini:ApiKey"];

        if (string.IsNullOrEmpty(_apiKey))
        {
            throw new Exception("Chưa cấu hình API Key trong appsettings.json!");
        }
    }

    /// <summary>
    /// Tạo prompt phù hợp cho từng Part TOEIC
    /// </summary>
    private string BuildPromptByPart(
        int partNumber,
        Question question,
        List<Answer> answers,
        string? transcript = null
    )
    {
        var answerText = string.Join("\n", answers.Select(a => $"{a.Label}. {a.Content}"));

        // Phần chung về định dạng output
        var outputFormat =
            @"
                    Trả về kết quả dưới dạng JSON thuần (KHÔNG có markdown ```json) gồm 2 trường:
                    1. ""Short"": Giải thích siêu ngắn gọn (dưới 20 từ tiếng Việt).
                    2. ""Full"": Giải thích chi tiết bằng tiếng Việt, định dạng HTML đơn giản (dùng <br>, <b>, <i>).";

        return partNumber switch
        {
            // ===== PART 1: Mô tả tranh =====
            1 => $@"
Bạn là giáo viên TOEIC giỏi tiếng Anh.
Đây là câu hỏi PART 1 (Photographs). Thí sinh nghe 4 câu mô tả (A, B, C, D) và chọn câu đúng nhất.

Đọc transcript này {transcript} và hiển các đáp án A B C D 
Đáp án đúng: {question.CorrectOption}

Hãy dịch từng đáp án (A), (B), (C), (D) sang tiếng Việt ngắn gọn, và viết 1 câu ngắn giải thích tại sao đáp án {question.CorrectOption} đúng.
Trả về JSON thuần (KHÔNG có markdown backtick) với 2 trường:
{{""Short"": ""A : [transcript A]<br>B : [transcript B]<br>C : [transcript C]<br>D : [transcript D]<br><br><b>"", ""Full"": ""A : [bản dịch]<br>B : [bản dịch]<br>C : [bản dịch]<br>D : [bản dịch]<br><br><b>Giải thích:</b> [Giải thích tại sao đáp án {question.CorrectOption} đúng]""}}",

            // ===== PART 2: Hỏi - Đáp =====
            2 => $@"
Bạn là giáo viên TOEIC giỏi tiếng Anh.
Đây là câu hỏi PART 2 (Question-Response). Thí sinh nghe 1 câu hỏi và 3 câu trả lời (A, B, C), chọn câu phù hợp nhất.

Đáp án đúng: {question.CorrectOption}
Đọc transcript này {transcript} và hiển các đáp án A B C và câu hỏi
Hãy dịch từng đáp án (A), (B), (C) sang tiếng Việt ngắn gọn.
Trả về JSON thuần (KHÔNG có markdown backtick) với 2 trường:
{{""Short"": ""Question : [transcript câu hỏi]<br>A: [transcript A]<br>B: [transcript B]<br>C: [transcript C]<br><b>"", ""Full"": ""Câu hỏi : [transcript câu hỏi dịch]<br>A: [bản dịch]<br>B: [bản dịch]<br>C: [bản dịch]<br><b>Giải thích:</b> [Giải thích tại sao đáp án {question.CorrectOption} đúng]""}}",

            // ===== PART 3 & 4: Hội thoại / Bài nói =====
            3 or 4 => $@"
Bạn là giáo viên TOEIC. Đây là câu hỏi PART {partNumber} ({(partNumber == 3 ? "Conversations - Hội thoại" : "Talks - Bài nói")}).
Thí sinh nghe đoạn hội thoại/bài nói và trả lời câu hỏi.

Câu hỏi: {question.Content}
Các đáp án:
{answerText}
Đáp án đúng là: {question.CorrectOption}
{(string.IsNullOrEmpty(transcript) ? "" : $"\nTranscript tham khảo:\n{transcript}")}

Hãy giải thích:
- Từ khóa/câu quan trọng trong audio giúp xác định đáp án
- Loại câu hỏi (Main idea, Detail, Inference, What does X mean...)
- Tại sao các đáp án khác sai

{outputFormat}",

            // ===== PART 5: Incomplete Sentences (Ngữ pháp/Từ vựng) =====
            5 => $@"
Bạn là giáo viên TOEIC. Đây là câu hỏi PART 5 (Incomplete Sentences - Điền từ vào câu).
Part 5 kiểm tra ngữ pháp và từ vựng.

Câu hỏi: {question.Content}
Các đáp án:
{answerText}
Đáp án đúng là: {question.CorrectOption}

Hãy giải thích CHI TIẾT:
- Dịch nghĩa câu hoàn chỉnh
- Đây là dạng câu hỏi gì (Từ loại, Thì động từ, Giới từ, Liên từ, Đại từ, Từ vựng/Collocations...)
- Quy tắc ngữ pháp áp dụng
- Tại sao đáp án {question.CorrectOption} đúng và các đáp án khác sai
- Mẹo nhận biết nhanh

{outputFormat}",

            // ===== PART 6: Text Completion (Điền đoạn văn) =====
            6 => $@"
Bạn là giáo viên TOEIC. Đây là câu hỏi PART 6 (Text Completion - Hoàn thành đoạn văn).
Part 6 yêu cầu điền từ/cụm từ/câu vào đoạn văn, cần hiểu ngữ cảnh.

{(string.IsNullOrEmpty(question.Group?.TextContent) ? "" : $"Nội dung đoạn văn:\n{question.Group.TextContent}\n")}
Câu hỏi: {question.Content}
Các đáp án:
{answerText}
Đáp án đúng là: {question.CorrectOption}

Hãy giải thích:
- Ngữ cảnh của đoạn văn giúp xác định đáp án như thế nào
- Đây là dạng gì (Từ vựng, Ngữ pháp, hay Điền câu hoàn chỉnh)
- Từ khóa/manh mối trong đoạn văn
- Tại sao các đáp án khác không phù hợp ngữ cảnh

{outputFormat}",

            // ===== PART 7: Reading Comprehension (Đọc hiểu) =====
            7 => $@"
Bạn là giáo viên TOEIC. Đây là câu hỏi PART 7 (Reading Comprehension - Đọc hiểu).
Part 7 yêu cầu đọc văn bản (email, quảng cáo, bài báo...) và trả lời câu hỏi.

{(string.IsNullOrEmpty(question.Group?.TextContent) ? "" : $"Nội dung bài đọc:\n{question.Group.TextContent}\n")}
Câu hỏi: {question.Content}
Các đáp án:
{answerText}
Đáp án đúng là: {question.CorrectOption}

Hãy giải thích:
- Loại câu hỏi (Main purpose, Detail, Inference, Vocabulary in context, NOT/TRUE question...)
- Vị trí thông tin trong bài đọc (nếu là Detail question)
- Cách paraphrase từ bài gốc sang đáp án đúng
- Tại sao các đáp án khác là bẫy (distractor)

{outputFormat}",

            // TOEIC only has Parts 1-7; any other value is a bug
            _ => throw new NotSupportedException(
                $"Không hỗ trợ Part {partNumber}. TOEIC chỉ có Part 1-7."
            ),
        };
    }

    public async Task<(string? Short, string? Full)> GenerateExplanationAsync(
        Question question,
        List<Answer> answers
    )
    {
        // Lấy Part Number từ navigation property (cần Include khi query)
        int partNumber = question.Group?.Part?.PartNumber ?? 0;

        // Lấy Transcript từ Group hoặc Question (tùy cấu trúc data)
        string? transcript = question.Transcript ?? question.Group?.Transcript;

        // Build prompt phù hợp với Part
        var prompt = BuildPromptByPart(partNumber, question, answers, transcript);

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

        var url =
            $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={_apiKey}";

        var response = await _httpClient.PostAsync(url, jsonContent);

        if (!response.IsSuccessStatusCode)
        {
            // Đọc chi tiết lỗi Google trả về
            var errorContent = await response.Content.ReadAsStringAsync();
            // Trả về nội dung lỗi để hiển thị lên màn hình
            return ($"Lỗi: {response.StatusCode}", $"Chi tiết: {errorContent}");
        }

        var responseString = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseString);

        // Gemini trả về cấu trúc hơi sâu, cần trích xuất text ra
        try
        {
            var textResult = doc
                .RootElement.GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            // Cắt bỏ phần ```json nếu có
            textResult = textResult?.Replace("```json", "").Replace("```", "").Trim();

            // Parse JSON từ text của AI để lấy 2 trường Short/Full
            var resultObj = JsonSerializer.Deserialize<AiResponse>(textResult ?? "{}");
            return (resultObj?.Short, resultObj?.Full);
        }
        catch
        {
            return ("Lỗi parse", "AI trả về format không đúng");
        }
    }

    /// <summary>
    /// Dịch đoạn văn (đã điền sẵn đáp án đúng) sang tiếng Việt
    /// </summary>
    public async Task<string?> TranslatePassageAsync(string passage)
    {
        var prompt =
            $@"Bạn là dịch giả chuyên nghiệp. Dịch đoạn văn tiếng Anh dưới đây sang tiếng Việt.

YÊU CẦU ĐẦU RA:
- Trả về văn bản thuần (plain text), giữ nguyên xuống dòng.
- KHÔNG dùng Markdown (không dùng **, *, ##, v.v.).
- CHỈ dùng thẻ <b>...</b> (và không thẻ HTML nào khác) cho các trường hợp SAU:
  1. Nhãn email/memo: To, From, Date, Subject, Kính gửi, v.v. (ví dụ: <b>Đến:</b>)
  2. Tiêu đề bài báo, tiêu đề đoạn văn.
  3. Tiêu đề cột bảng / lịch trình.
  4. Từ vựng được in nghiêng/đậm trong câu hỏi (ví dụ: từ <b>""contract""</b>).
- Mọi nội dung khác: văn bản thuần, không thẻ.
- Chỉ trả về bản dịch, không giải thích thêm.

Đoạn văn:
{passage}";

        var requestBody = new
        {
            contents = new[] { new { parts = new[] { new { text = prompt } } } },
        };

        var jsonContent = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json"
        );
        var url =
            $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={_apiKey}";

        var response = await _httpClient.PostAsync(url, jsonContent);
        if (!response.IsSuccessStatusCode)
            throw new Exception($"Gemini lỗi: {response.StatusCode}");

        var responseString = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseString);

        return doc
            .RootElement.GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString()
            ?.Trim();
    }
}

// Class phụ để hứng dữ liệu
public class AiResponse
{
    public string? Short { get; set; }
    public string? Full { get; set; }

    // Part 1 specific fields
    public string? Translations { get; set; }
    public List<VocabularyItem>? Vocabulary { get; set; }
}

public class VocabularyItem
{
    public string? Word { get; set; }
    public string? Type { get; set; }
    public string? Meaning { get; set; }
}
