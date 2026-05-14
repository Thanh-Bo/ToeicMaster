# AI Prompts - Tạo câu hỏi Từ vựng: Contracts (Hợp đồng & Điều khoản)

> **Topic:** Contracts - Hợp đồng & Điều khoản  
> **Level:** Easy  
> **Target:** TOEIC Part 5 (Incomplete Sentences)  
> **Format:** Excel (.xlsx) - 8 cột

---

## 🟢 EASY MODE - Câu hỏi Từ vựng Contracts

````
Bạn là giáo viên TOEIC chuyên từ vựng tiếng Anh thương mại.

NHIỆM VỤ: Tạo câu hỏi trắc nghiệm từ vựng Part 5 TOEIC.

CHỦ ĐỀ: Contracts (Hợp đồng & Điều khoản) - Easy Level

TỪ VỰNG TRỌNG TÂM:
- agreement (n): thỏa thuận, hợp đồng
- sign (v): ký tên
- party (n): bên (tham gia hợp đồng)
- negotiate (v): đàm phán, thương lượng
- establish (v): thiết lập, xác lập
- renew (v): gia hạn, làm mới
- cancel (v): hủy bỏ
- stipulate (v): quy định, điều khoản
- provision (n): điều khoản, điều lệ
- obligate (v): bắt buộc, ràng buộc
- terminate (v): chấm dứt, kết thúc

MỨC ĐỘ: easy (A2-B1)

YÊU CẦU CHO MỖI CÂU:
1. Content: Câu có 1 chỗ trống (_____) cần điền từ vựng phù hợp
2. 4 đáp án A, B, C, D (chỉ 1 đáp án đúng)
3. Correct option: A, B, C, hoặc D
4. Short explanation: Định dạng HTML với <br>. Dòng 1 = "Câu hỏi: " + dịch câu hỏi. Dòng 2-5 = 4 đáp án với format: A. [English] : [Vietnamese]<br>B. [English] : [Vietnamese]... TRONG ĐÓ đáp án đúng được BAO BỌC bằng thẻ <span class='highlight-correct'>[dòng đầy đủ]</span>KHÔNG dùng <b> ở bất kỳ đâu.
5. Long explanation: null (để trống)

QUY TẮC:
- ✅ Tạo đúng 11 câu, mỗi câu sử dụng 1 từ trong danh sách 11 từ (mỗi từ dùng 1 lần)
- ✅ Câu ngắn (8-15 từ), từ vựng cơ bản về hợp đồng
- ✅ 4 đáp án có tính gây nhiễu và nó phải nằm trong từ vựng
- ✅ **QUAN TRỌNG: Đáp án đúng phải PHÂN BỐ ĐỀU giữa A, B, C, D**
- ✅ Thứ tự 11 từ: agreement → sign → party → negotiate → establish → renew → cancel → stipulate → provision → obligate → terminate

TRẢ VỀ DẠNG CSV với 8 cột để import vào Excel (KHÔNG có markdown):

Cấu trúc 8 cột: Content | OptionA | OptionB | OptionC | OptionD | CorrectOption | ShortExplanation | LongExplanation

VÍ DỤ MẪU (1 câu):
```csv
Content,OptionA,OptionB,OptionC,OptionD,CorrectOption,ShortExplanation,LongExplanation
"Both _____ must review the contract terms before signing.",parties,provision,agreement,negotiate,A,"Câu hỏi: Cả hai bên phải xem xét các điều khoản hợp đồng trước khi ký.<br><span class='highlight-correct'>A. parties : các bên</span><br>B. provision : điều khoản<br>C. agreement : thỏa thuận<br>D. negotiate : đàm phán",null
```

Lưu ý:
- Dòng đầu tiên là header (tên cột)
- Tạo đúng 11 câu, mỗi từ trong danh sách xuất hiện đúng 1 lần
- Đáp án đúng phân bố đều: khoảng 2-3 câu A, 2-3 câu B, 2-3 câu C, 2-3 câu D
- Short explanation đúng format: 5 dòng, dùng <br>, đáp án đúng bọc trong <span class='highlight-correct'>, KHÔNG dùng <b>
- LongExplanation luôn là null
- Không có khoảng trắng sau dấu phẩy
- Sau khi có CSV, lưu thành file .xlsx để import vào hệ thống
````

---

## 📊 Tổng kết cấu trúc file Excel

| Cột | Tên cột | Mô tả |
|-----|---------|-------|
| 1 | **Content** | Câu hỏi với chỗ trống (_____) |
| 2 | **OptionA** | Đáp án A |
| 3 | **OptionB** | Đáp án B |
| 4 | **OptionC** | Đáp án C |
| 5 | **OptionD** | Đáp án D |
| 6 | **CorrectOption** | A/B/C/D |
| 7 | **ShortExplanation** | Giải thích ngắn (HTML format) |
| 8 | **LongExplanation** | null |

---

## 📚 Bảng từ vựng Contracts

| Từ vựng | Từ loại | Nghĩa | Ví dụ |
|---------|---------|-------|-------|
| **agreement** | n | thỏa thuận, hợp đồng | sign an agreement |
| **sign** | v | ký tên | sign the contract |
| **party** | n | bên (tham gia) | both parties |
| **negotiate** | v | đàm phán | negotiate terms |
| **establish** | v | thiết lập | establish a contract |
| **renew** | v | gia hạn | renew the agreement |
| **cancel** | v | hủy bỏ | cancel the contract |
| **stipulate** | v | quy định | as stipulated in... |
| **provision** | n | điều khoản | under this provision |
| **obligate** | v | bắt buộc | obligate sb to do |
| **terminate** | v | chấm dứt | terminate the contract |

---

## 🎯 Mẹo sử dụng

1. **Copy** prompt bên trên
2. **Paste** vào Google Gemini / Claude / ChatGPT
3. **Yêu cầu AI** trả về đúng định dạng CSV
4. **Kiểm tra** đáp án đã phân bố đều chưa
5. **Copy** dữ liệu CSV vào Excel
6. **Lưu** thành file `.xlsx` và upload vào hệ thống

---

*Generated for Contracts Vocabulary (TOEIC Part 5)*
