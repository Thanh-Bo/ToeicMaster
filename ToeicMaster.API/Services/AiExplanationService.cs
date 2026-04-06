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
    /// Tạo prompt cho câu hỏi vocabulary (QuestionVocab)
    /// </summary>
    private string BuildPromptForVocabulary(
        string content,
        List<string> options,
        string correctOption
    )
    {
        var optionsText = string.Join("\n", options.Select((o, i) => $"{(char)('A' + i)}. {o}"));

        return $@"
Bạn là giáo viên TOEIC giỏi tiếng Anh.
Đây là câu hỏi VOCABULARY (Từ vựng). Thí sinh chọn từ phù hợp để điền vào chỗ trống.

Câu hỏi: {content}
Các đáp án:
{optionsText}
Đáp án đúng: {correctOption}

Hãy giải thích đơn giản:
1. Dịch nghĩa câu hoàn chỉnh
2. Giải thích từ đúng: ý nghĩa, cách sử dụng
3. Tại sao các đáp án khác sai
4. Ví dụ minh họa

Trả về kết quả dưới dạng JSON thuần (KHÔNG có markdown ```json) gồm 2 trường:
1. ""Short"": Giải thích siêu ngắn gọn (1-2 câu, dưới 20 từ tiếng Việt).
2. ""Full"": Giải thích đơn giản bằng tiếng Việt, định dạng HTML (dùng <br>, <b>).
";
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

        return partNumber switch
        {
            // ===== PART 1: Mô tả tranh =====
            1 => $@"
Bạn là giáo viên TOEIC giỏi tiếng Anh.
Đây là câu hỏi PART 1 (Photographs). Thí sinh nghe 4 câu mô tả (A, B, C, D) và chọn câu đúng nhất.

Đọc transcript này {transcript} và hiển các đáp án A B C D 
Đáp án đúng: {question.CorrectOption}

Hãy dịch từng đáp án (A), (B), (C), (D) sang tiếng Việt ngắn gọn.

Trả về JSON với 2 trường Short và Full:
- Short: Liệt kê 4 đáp án CHỈ VỚI TIẾNG ANH (transcript gốc). Format: A. [English text]<br>B.  [English text]<br>C. [English text]<br>D. [English text]. QUAN TRỌNG: Toàn bộ dòng của đáp án đúng PHẢI được bọc trong <span class='highlight-correct'>[dòng đầy đủ]</span>. KHÔNG thêm giải thích hay lý do.
- Full: A. [dịch tiếng Việt]<br>B. [dịch tiếng Việt]<br>C. [dịch tiếng Việt]<br>D. [dịch tiếng Việt] .QUAN TRỌNG: Toàn bộ dòng của đáp án đúng PHẢI được bọc trong <span class='highlight-correct'>[dòng đầy đủ]</span>.",
            // ===== PART 2: Hỏi - Đáp =====
            2 => $@"
Bạn là giáo viên TOEIC giỏi tiếng Anh.
Đây là câu hỏi PART 2 (Question-Response). Thí sinh nghe 1 câu hỏi và 3 câu trả lời (A, B, C), chọn câu phù hợp nhất.

Đáp án đúng: {question.CorrectOption}
Đọc transcript này {transcript} và hiển các đáp án A B C và câu hỏi
Hãy dịch từng đáp án (A), (B), (C) sang tiếng Việt ngắn gọn.

Trả về JSON với 2 trường Short và Full:
- Short: Question : [English text]<br>A. [English text]<br>B. [English text]<br>C. [English text]. QUAN TRỌNG: Toàn bộ dòng của đáp án đúng PHẢI được bọc trong <span class='highlight-correct'>[dòng đầy đủ]</span>. KHÔNG thêm giải thích hay lý do.
- Full: Câu hỏi : [dịch tiếng Việt]<br>A. [dịch tiếng Việt]<br>B. [dịch tiếng Việt]<br>C. [dịch tiếng Việt]. QUAN TRỌNG: Toàn bộ dòng của đáp án đúng PHẢI được bọc trong <span class='highlight-correct'>[dòng đầy đủ]</span>.",

            // ===== PART 3 & 4: Hội thoại / Bài nói =====
            3 or 4 => $@"
Bạn là giáo viên TOEIC. Hướng dẫn làm Part {partNumber} ({(partNumber == 3 ? "Conversations - Hội thoại" : "Talks - Bài nói")}).

**YÊU CẦU BẮT BUỘC:**

1. **Dịch nghĩa (chỉ trong Short):**
   - Dịch câu hỏi sang tiếng Việt
   - Dịch 4 đáp án A, B, C, D sang tiếng Việt (ngắn gọn, tự nhiên)
2. **Vị trí thông tin:**
   - Ai nói (người đàn ông/người phụ nữ)
   - Vị trí trong hội thoại (câu đầu/giữa/cuối)

3. **Giải thích:**
   - Từ đồng nghĩa/paraphrase giữa transcript và đáp án đúng
   - Có thể dẫn chứng ngắn từ transcript (nếu cần)

4. **Cảnh báo bẫy:**
   - CHỌN 1 bẫy quan trọng nhất (từ xuất hiện trong audio nhưng KHÔNG phải đáp án)

**ĐỊNH DẠNG:**
- Dùng gạch đầu dòng, không viết đoạn dài
- Mỗi ý tối đa 2 dòng

**JSON Output (2 trường):**
- ""Short"": Định dạng HTML với <br>. Dòng 1 = ""Câu hỏi: "" + dịch câu hỏi. Dòng 2-5 = 4 đáp án ĐÓ phải có format: A. answer<br>B. answer<br>C. answer<br>D. answer. TRONG ĐÓ đáp án đúng được BAO BỌC bằng thẻ <span class='highlight-correct'>D. answer</span> (bọc cả chữ D. vào).
- ""Full"": Giải thích chi tiết với HTML (<br>). KHÔNG dịch lại. KHÔNG dùng <b> in đậm. Chỉ có: - Vị trí: (ai nói, khi nào)<br>- Giải thích: (từ đồng nghĩa, paraphrase)<br>- Cảnh báo bẫy: (CHỌN 1 bẫy quan trọng nhất)

---
Transcript: {(string.IsNullOrEmpty(transcript) ? "Không có" : transcript)}
Câu hỏi: {question.Content}
Đáp án: {answerText}
Đáp án đúng: {question.CorrectOption}
",

            // ===== PART 5: Incomplete Sentences (Ngữ pháp/Từ vựng) =====
            5 => $@"
Bạn là giáo viên TOEIC. Hướng dẫn làm Part 5 (Incomplete Sentences - Điền từ vào câu).

**YÊU CẦU BẮT BUỘC:**

1. **Dịch nghĩa (chỉ trong Short):**
   - Dịch câu hoàn chỉnh
   - Dịch các đáp án A, B, C, D sang tiếng Việt (ngắn gọn)

2. **Loại câu hỏi:**
   - Từ loại, Thì động từ, Giới từ, Liên từ, Đại từ, Collocations

3. **Giải thích:**
   - Quy tắc ngữ pháp hoặc từ vựng cần nhớ
   - Tại sao đáp án đúng

4. **Cảnh báo bẫy:**
   - CHỌN 1 bẫy quan trọng nhất

**ĐỊNH DẠNG:**
- Dùng gạch đầu dòng, không viết đoạn dài
- Mỗi ý tối đa 2 dòng

**JSON Output (2 trường):**
- ""Short"": Định dạng HTML với <br>. Dòng 1 = ""Câu hỏi: "" + dịch câu hỏi. Dòng 2-5 = 4 đáp án với format: A. [English] : [Vietnamese]<br>B. [English] : [Vietnamese]... TRONG ĐÓ đáp án đúng được BAO BỌC bằng thẻ <span class='highlight-correct'>[dòng đầy đủ]</span>. Dòng 6 = - Đáp án [X] vì... (có gạch đầu dòng). Tổng 6 dòng. KHÔNG dùng <b> ở bất kỳ đâu.
- ""Full"": Giải thích chi tiết với HTML (<br>). KHÔNG dịch lại. KHÔNG dùng <b> in đậm. Chỉ có 3 mục, mỗi mục MAX 1 dòng: - Loại câu hỏi: (từ loại, thì, giới từ...)<br>- Giải thích: (Quy tắc + Tại sao đúng, gộp vào 1 dòng)<br>- Cảnh báo bẫy: (CHỌN 1 bẫy quan trọng nhất)

---
Câu hỏi: {question.Content}
Các đáp án:
{answerText}
Đáp án đúng: {question.CorrectOption}
",

            // ===== PART 6: Text Completion (Điền đoạn văn) =====
            6 => $@"
Bạn là giáo viên TOEIC. Hướng dẫn làm Part 6 (Text Completion - Hoàn thành đoạn văn).

**YÊU CẦU BẮT BUỘC:**

1. **Dịch nghĩa (chỉ trong Short):**
   - Dịch câu hoàn chỉnh
   - Dịch các đáp án A, B, C, D sang tiếng Việt (ngắn gọn)



2. **Giải thích:**
   - Câu trước/sau gợi ý    
   - Ngữ cảnh & từ khóa liên kết
   - Chỉ lấy 1 giải thích quan trọng nhất
   

3. **Bẫy điển hình:**
   - Từ đúng ngữ pháp nhưng sai bối cảnh
   - Từ xuất hiện trong đoạn nhưng sai vị trí
   - Tense/tone không match
   - Chỉ lấy 1 bẫy quan trọng nhất

**ĐỊNH DẠNG:**
- Dùng gạch đầu dòng, không viết đoạn dài
- Mỗi ý tối đa 2 dòng

**JSON Output (2 trường):**
- ""Short"": Định dạng HTML với <br>. Dòng 1-4 = 4 đáp án, TRONG ĐÓ đáp án đúng được BAO BỌC bằng thẻ <span class='highlight-correct'>...</span> để tô màu xanh lá. Dòng 5 = - Đáp án [X] vì... (có gạch đầu dòng va không cần thêm phần dịch) . Tổng 5 dòng. KHÔNG dùng <b> ở bất kỳ đâu.
- ""Full"": Giải thích chi tiết với HTML (<br>). KHÔNG dịch lại. KHÔNG dùng <b> in đậm. Cấu trúc: - Giải thích : (câu trước/sau)<br>- Bẫy: (1 bẫy quan trọng)

--- 
{(string.IsNullOrEmpty(question.Group?.TextContent) ? "" : $"Nội dung đoạn văn:\n{question.Group.TextContent}\n")}Câu hỏi: {question.Content}
Các đáp án:
{answerText}
Đáp án đúng: {question.CorrectOption}
",

            // ===== PART 7: Reading Comprehension (Đọc hiểu) =====
            7 => $@"
Bạn là giáo viên TOEIC. Hướng dẫn làm Part 7 (Reading Comprehension - Đọc hiểu).

**YÊU CẦU BẮT BUỘC:**

1. **Dịch nghĩa (chỉ trong Short):**
   - Dịch câu hỏi sang tiếng Việt
   - Dịch 4 đáp án A, B, C, D sang tiếng Việt (ngắn gọn, tự nhiên)

2. **Loại câu hỏi:**
   - Main purpose, Detail, Inference, Vocabulary in context, NOT/TRUE

3. **Giải thích:**
   - Vị trí thông tin trong bài đọc
   - Cách paraphrase từ bài gốc sang đáp án đúng

4. **Cảnh báo bẫy:**
   - CHỌN 1 bẫy quan trọng nhất (distractor)

**ĐỊNH DẠNG:**
- Dùng gạch đầu dòng, không viết đoạn dài
- Mỗi ý tối đa 2 dòng

**JSON Output (2 trường):**
- ""Short"": Định dạng HTML với <br>. Dòng 1 = ""Câu hỏi: "" + dịch câu hỏi. Dòng 2-5 = 4 đáp án, TRONG ĐÓ đáp án đúng được BAO BỌC bằng thẻ <span class='highlight-correct'>...</span> để tô màu xanh lá. Dòng 6 = - Đáp án [X] vì... (có gạch đầu dòng). Tổng 6 dòng. KHÔNG dùng <b> ở bất kỳ đâu.
- ""Full"": Giải thích chi tiết với HTML (<br>). KHÔNG dịch lại. KHÔNG dùng <b> in đậm. Chỉ có 3 mục, mỗi mục MAX 1 dòng: - Loại: (Main purpose/Detail/Inference/...)<br>- Giải thích: (Vị trí + Paraphrase, gộp vào 1 dòng)<br>- Cảnh báo bẫy: (CHỌN 1 bẫy quan trọng nhất)

---
{(string.IsNullOrEmpty(question.Group?.TextContent) ? "" : $"Nội dung bài đọc:\n{question.Group.TextContent}\n")}Câu hỏi: {question.Content}
Các đáp án:
{answerText}
Đáp án đúng: {question.CorrectOption}
",

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
    /// Generate explanation for vocabulary questions (QuestionVocab)
    /// </summary>
    public async Task<(string? Short, string? Full)> GenerateVocabularyExplanationAsync(
        string content,
        List<string> options,
        string correctOption
    )
    {
        // Build prompt for vocabulary
        var prompt = BuildPromptForVocabulary(content, options, correctOption);

        // Send to Gemini
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
            var errorContent = await response.Content.ReadAsStringAsync();
            return ($"Lỗi: {response.StatusCode}", $"Chi tiết: {errorContent}");
        }

        var responseString = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseString);

        try
        {
            var textResult = doc
                .RootElement.GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            textResult = textResult?.Replace("```json", "").Replace("```", "").Trim();

            var resultObj = JsonSerializer.Deserialize<AiResponse>(textResult ?? "{}");
            return (resultObj?.Short, resultObj?.Full);
        }
        catch
        {
            return ("Lỗi parse", "AI trả về format không đúng");
        }
    }

    /// <summary>
    /// Build prompt cho dịch transcript Part 3 (Conversations - Hội thoại)
    /// </summary>
    private string BuildPromptForPart3TranslateTranscript(string transcript)
    {
        return $@"Bạn là dịch giả chuyên nghiệp. Dịch hội thoại PART 3 sang tiếng Việt.

**YÊU CẦU BẮT BUỘC:**

1. **GIỮ NGUYÊN M: và W:** (hoặc Man:, Woman:, Narrator:)
2. **SỬ DỤNG <br> ĐỂ TÁCH MỖI DÒNG NÓI** - TUYỆT ĐỐI PHẢI CÓ <br> SAU MỖI LỜI NÓI
3. **MỖI DÒNG PHẢI CÓ FORMAT:** [Speaker]: [nội dung dịch]<br>

**TRẢ VỀ JSON THUẦN (KHÔNG có markdown ```json) với 1 TRƯỜNG DUY NHẤT:**
{{
  ""Translations"": ""M: [tiếng Việt]<br>W: [tiếng Việt]<br>M: [tiếng Việt]<br>W: [tiếng Việt]<br>""
}}

**VÍ DỤ OUTPUT ĐÚNG:**
{{
  ""Translations"": ""M: Xin chào<br>W: Chào bạn<br>M: Bạn khỏe không?<br>W: Tôi khỏe, cảm ơn<br>""
}}

**TUYỆT ĐỐI KHÔNG:**
❌ KHÔNG trả về plain text - PHẢI là JSON có trường ""Translations""
❌ KHÔNG bỏ <br> giữa các dòng
❌ KHÔNG kết hợp nhiều lời nói trên cùng 1 dòng
❌ KHÔNG dùng markdown ```json bao quanh

Transcript:
{transcript}";
    }

    /// <summary>
    /// Build prompt cho dịch transcript Part 4 (Talks - Bài nói)
    /// </summary>
    private string BuildPromptForPart4TranslateTranscript(string transcript)
    {
        return $@"Bạn là dịch giả chuyên nghiệp. Dịch bài nói PART 4 (Talks) tiếng Anh dưới đây sang tiếng Việt.

OUTPUT FORMAT:
- PHẢI là MỘT ĐOẠN VĂN LIỀN MẠCH (one continuous paragraph)
- Mỗi speaker và nội dung của họ nối tiếp nhau thành một dòng duy nhất
- OUTPUT LÀ PLAIN TEXT, KHÔNG CÓ HTML

TUYỆT ĐỐI KHÔNG ĐƯỢC:
❌ KHÔNG dùng <br> tags
❌ KHÔNG dùng <table>, <tr>, <td> tags hay bất kỳ HTML nào
❌ KHÔNG xuống dòng giữa các speaker
❌ KHÔNG thêm line breaks

Ví dụ OUTPUT (một dòng duy nhất):
Narrator: Chào mừng quý khách. M: Xin chào, tôi muốn hỏi gì đó. W: Vâng, tôi sẽ giúp bạn. Narrator: Cảm ơn bạn.

Transcript:
{transcript}";

    }

    /// <summary>
    /// Build prompt cho dịch passage Part 6 (Email/Tài liệu ngắn)
    /// </summary>
    private string BuildPromptForPart6Translation(string passage)
    {
        return $@"Bạn là dịch giả chuyên nghiệp. Dịch email/tài liệu PART 6 tiếng Anh dưới đây sang tiếng Việt.

**QUY TẮC BẮT BUỘC:**

1. **Giữ nguyên cấu trúc HTML:**
   - Hãy giữ nguyên tất cả thẻ HTML (<p>, <table>, <tr>, <th>, <td>, <b>, <br>, v.v.)
   - Chỉ dịch nội dung TEXT bên trong các thẻ, KHÔNG xóa hay thay thế các thẻ

2. **XỬ LÝ BẢNG (NẾU CÓ):**
   - Nếu đầu vào có <table>, bạn PHẢI trả về output có <table> HOÀN TOÀN GIỐNG NHƯ VẬY
   - KHÔNG dùng dấu gạch ngang (---) hoặc ký hiệu pipe (|) để thay thế bảng
   - ❌ TUYỆT ĐỐI KHÔNG biến bảng thành văn bản thuần hay danh sách
   - ✓ Chỉ dịch nội dung bên trong <th> và <td>, giữ nguyên cấu trúc <table>

3. **Xử lý Header / Tiêu đề:**
   - Nếu có tiêu đề → được bọc trong <p><b>...</b></p>

4. **Xử lý thông tin địa chỉ / ngày tháng (đầu thư):**
   - Mỗi dòng riêng biệt → một thẻ <p> riêng

5. **Định dạng output:**
   - KHÔNG dùng Markdown (không dùng **, *, ##)
   - KHÔNG thêm <br> trừ khi bản gốc đã có <br>
   - Chỉ trả về bản dịch HTML, không giải thích thêm

Đoạn văn:
{passage}";
    }

    /// <summary>
    /// Build prompt cho dịch passage Part 7 (Bài đọc dài)
    /// </summary>
    private string BuildPromptForPart7Translation(string passage)
    {
        return $@"Bạn là dịch giả chuyên nghiệp. Dịch bài đọc PART 7 tiếng Anh dưới đây sang tiếng Việt.

⚠️ QUY TẮC XỬ LÝ BẢNG (TUYỆT ĐỐI PHẢI TUÂN THỦ):
1. NẾU đầu vào có thẻ <table>, bạn PHẢI trả về output có thẻ <table> HOÀN TOÀN GIỐNG NHƯ VẬY.
2. Cấu trúc HTML bảng: <table><tr><th>...</th></tr><tr><td>...</td></tr></table> PHẢI được giữ nguyên 100%.
3. CHỈ dịch nội dung TEXT bên trong các thẻ <th> và <td>. KHÔNG xóa hay sửa cấu trúc <table>, <tr>, <th>, <td>.
4. ❌ TUYỆT ĐỐI KHÔNG chuyển bảng thành:
   - Danh sách
   - Văn bản thuần (plain text)
   - Dấu gạch ngang (---)
   - Định dạng khác
5. Nếu vì lý do nào đó không thể giữ <table>, TẤN CÔNG BẰNG CẬU TRÚC: 
   <table><tr><td>Cột1</td><td>Cột2</td></tr></table>
   (vẫn phải dùng HTML table, không dùng ký hiệu pipe |)

✓ YÊU CẦU ĐẦU RA:
- Giữ nguyên tất cả thẻ HTML (<table>, <tr>, <th>, <td>, <b>, <br>, v.v.).
- Chỉ dịch nội dung bên trong các thẻ, KHÔNG sửa cấu trúc.
- KHÔNG dùng Markdown (không dùng **, *, ##).
- Chỉ trả về bản dịch HTML, không giải thích thêm.

Đoạn văn:
{passage}";
    }

    /// <summary>
    /// Dịch đoạn văn hoặc transcript (đã điền sẵn đáp án đúng) sang tiếng Việt
    /// </summary>
    public async Task<string?> TranslatePassageAsync(string passage, int partNumber = 7)
    {
        var prompt = partNumber switch
        {
            3 => BuildPromptForPart3TranslateTranscript(passage),
            4 => BuildPromptForPart4TranslateTranscript(passage),
            6 => BuildPromptForPart6Translation(passage),
            _ => BuildPromptForPart7Translation(passage),
        };

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

        var textResult = doc
            .RootElement.GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString()
            ?.Trim();

        // Cắt bỏ phần ```json nếu có
        textResult = textResult?.Replace("```json", "").Replace("```", "").Trim();

        // Với Part 3, parse JSON để lấy trường Translations
        if (partNumber == 3 && !string.IsNullOrEmpty(textResult))
        {
            try
            {
                var aiResponse = JsonSerializer.Deserialize<AiResponse>(textResult);
                return aiResponse?.Translations;
            }
            catch
            {
                // Fallback: nếu không parse được, trả về raw text
                return textResult;
            }
        }

        return textResult;
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
