$path = "D:\ToeicMaster\ToeicMaster.API\Services\AiExplanationService.cs"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$old = @'
    private string BuildPromptForPart6Translation(string passage)
    {
        return $@"Bạn là dịch giả chuyên nghiệp. Dịch email/tài liệu PART 6 tiếng Anh dưới đây sang tiếng Việt.

**QUY TẮC BẮT BUỘC:**

1. **Cách dòng với <br>:**
   - PHẢI thêm <br> GIỮA MỖI CĂU/ĐOẠN
   - KHÔNG dùng newline mà phải dùng <br> HTML
   - Mỗi dòng trong output phải có <br> phía cuối (trừ dòng cuối cùng)

2. **Xử lý Blank (--------):**
   - Nếu có dòng blank như: ""We are -------- (131)""
   - Giữ nguyên ""--------"" và số trong ngoặc, chỉ dịch phần chữ xung quanh

3. **HTML Tags:**
   - Giữ nguyên tất cả thẻ HTML (<table>, <tr>, <th>, <td>, <b>, <br>, v.v.).
   - Nếu có <table>, giữ nguyên cấu trúc, chỉ dịch nội dung bên trong <th> và <td>

4. **Định dạng output:**
   - KHÔNG dùng Markdown (không dùng **, *, ##)
   - Chỉ trả về bản dịch, không giải thích thêm
   - BẮTBUỘC: Mỗi dòng phải kết thúc = <br> (trừ dòng cuối)

Đoạn văn:
{passage}";
    }
'@

$new = @'
    private string BuildPromptForPart6Translation(string passage)
    {
        return $@"Bạn là dịch giả chuyên nghiệp. Dịch email/tài liệu PART 6 tiếng Anh dưới đây sang tiếng Việt.

**QUY TẮC BẮT BUỘC:**

1. **Giữ nguyên cấu trúc đoạn văn:**
   - Mỗi ĐOẠN VĂN (paragraph) của bản gốc → bọc trong thẻ <p>...</p>
   - Các câu TRONG CÙNG MỘT ĐOẠN phải nối liền nhau, KHÔNG thêm <br> giữa các câu
   - Chỉ ngắt đoạn khi bản gốc ngắt đoạn (xuống dòng mới, dòng trống)

2. **Xử lý Header / Tiêu đề:**
   - Nếu có tiêu đề hoặc dòng chủ đề → bọc trong <p><b>...</b></p>

3. **Xử lý thông tin địa chỉ / ngày tháng (đầu thư):**
   - Mỗi dòng riêng biệt → một thẻ <p> riêng

4. **HTML Tags:**
   - Giữ nguyên tất cả thẻ HTML (<table>, <tr>, <th>, <td>, <b>, v.v.)
   - Nếu có <table>, giữ nguyên cấu trúc, chỉ dịch nội dung bên trong <th> và <td>

5. **Định dạng output:**
   - KHÔNG dùng Markdown (không dùng **, *, ##)
   - KHÔNG thêm <br> trừ khi bản gốc đã có <br>
   - Chỉ trả về bản dịch, không giải thích thêm

Đoạn văn:
{passage}";
    }
'@

$content = $content.Replace($old, $new)
[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done"
