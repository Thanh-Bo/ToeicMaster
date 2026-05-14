# AI Prompts cho tạo Grammar Questions

> **Hướng dẫn sử dụng:** Copy từng prompt dưới đây, paste vào Google Gemini/Claude/ChatGPT để tạo 20 câu hỏi. AI sẽ trả về JSON array.

---

## 📚 **DANH TỪ (Nouns)**

### **1️⃣ EASY - Danh từ**

````
Bạn là giáo viên TOEIC chuyên ngữ pháp tiếng Anh.

NHIỆM VỤ: Tạo 20 câu hỏi trắc nghiệm ngữ pháp Part 5 TOEIC.

CHỦ ĐỀ: Vị trí & Đuôi nhận biết Danh từ (Nouns)
MỨC ĐỘ: easy

YÊU CẦU CHO MỖI CÂU:
1. Content: Câu với 1 chỗ trống (_____)
2. 4 đáp án A, B, C, D (chỉ 1 đáp án đúng)
3. Correct option: A, B, C, hoặc D
4. Short explanation: 1-2 câu tiếng Việt, dưới 30 từ
5. LongExplanation: 3 mục (Loại câu hỏi, Giải thích, Bẫy) với HTML <br>

QUY TẮC:
- ✅ Câu hỏi tập trung vào: vị trí danh từ (sau mạo từ, tính từ sở hữu, giới từ), đuôi danh từ (-tion, -ment, -ness, -ity, -er, -ee, -ist, -ant)
- ✅ Mức độ easy: Câu ngắn (8-15 từ), từ vựng cơ bản A2-B1, 1 điểm ngữ pháp duy nhất
- ✅ 4 đáp án có tính gây nhiễu (ví dụ: danh từ vs động từ cùng gốc)
- ✅ Giải thích rõ ràng, dễ hiểu

TRẢ VỀ JSON ARRAY thuần (KHÔNG có markdown ```json):
[
  {
    "content": "The company is looking for a new _____.",
    "options": ["manage", "management", "manager", "managing"],
    "correctOption": "C",
    "shortExplanation": "Câu dịch: Công ty đang tìm kiếm một người quản lý mới. - Đáp án C vì cần danh từ chỉ người sau mạo từ 'a'",
    "LongExplanation": "- Loại câu hỏi: Từ loại (danh từ chỉ người)<br>- Giải thích: Sau mạo từ 'a' và tính từ 'new' cần danh từ. Đuôi -er chỉ người thực hiện hành động<br>- Cảnh báo bẫy: Nhầm lẫn giữa 'manager' (danh từ) và 'managing' (tính từ/động từ)"
  }
]
````

---

### **2️⃣ MEDIUM - Danh từ**

````
Bạn là giáo viên TOEIC chuyên ngữ pháp tiếng Anh.

NHIỆM VỤ: Tạo 20 câu hỏi trắc nghiệm ngữ pháp Part 5 TOEIC.

CHỦ ĐỀ: Vị trí & Đuôi nhận biết Danh từ (Nouns)
MỨC ĐỘ: medium

YÊU CẦU CHO MỖI CÂU:
1. Content: Câu với 1 chỗ trống (_____)
2. 4 đáp án A, B, C, D (chỉ 1 đáp án đúng)
3. Correct option: A, B, C, hoặc D
4. Short explanation: 1-2 câu tiếng Việt, dưới 30 từ
5. LongExplanation: 3 mục (Loại câu hỏi, Giải thích, Bẫy) với HTML <br>

QUY TẮC:
- ✅ Câu hỏi tập trung vào: vị trí danh từ (sau giới từ, lượng từ), đuôi danh từ nâng cao (-ity, -ance/-ence, -ee, -ist)
- ✅ Mức độ medium: Câu dài (15-25 từ), có mệnh đề phụ, từ vựng TOEIC B1-B2, 2-3 điểm ngữ pháp
- ✅ 4 đáp án có tính gây nhiễu tinh vi (cùng gốc từ, khác loại)
- ✅ Có 1 bẫy TOEIC điển hình trong mỗi câu
- ✅ Giải thích chỉ rõ bẫy

TRẢ VỀ JSON ARRAY thuần (KHÔNG có markdown ```json):
[
  {
    "content": "The _____ of the new policy was announced at the meeting.",
    "options": ["implement", "implementation", "implementing", "implementer"],
    "correctOption": "B",
    "shortExplanation": "Câu dịch: Việc triển khai chính sách mới đã được công bố tại cuộc họp. - Đáp án B vì cần danh từ sau mạo từ 'The'",
    "LongExplanation": "- Loại câu hỏi: Từ loại (danh từ sau mạo từ)<br>- Giải thích: Sau mạo từ 'The' và trước giới từ 'of' cần danh từ. Đuôi -ation tạo danh từ từ động từ 'implement'<br>- Cảnh báo bẫy: Nhầm với động từ 'implement' vì nghĩ đây là mệnh đề chính"
  }
]
````

---

### **3️⃣ HARD - Danh từ**

````
Bạn là giáo viên TOEIC chuyên ngữ pháp tiếng Anh.

NHIỆM VỤ: Tạo 20 câu hỏi trắc nghiệm ngữ pháp Part 5 TOEIC.

CHỦ ĐỀ: Vị trí & Đuôi nhận biết Danh từ (Nouns)
MỨC ĐỘ: hard

YÊU CẦU CHO MỖI CÂU:
1. Content: Câu với 1 chỗ trống (_____)
2. 4 đáp án A, B, C, D (chỉ 1 đáp án đúng)
3. Correct option: A, B, C, hoặc D
4. Short explanation: 1-2 câu tiếng Việt, dưới 30 từ
5. LongExplanation: 3 mục (Loại câu hỏi, Giải thích, Bẫy) với HTML <br>

QUY TẮC:
- ✅ Câu hỏi tập trung vào: cấu trúc phức, danh từ trừu tượng, bẫy danh từ/tính từ cùng gốc
- ✅ Mức độ hard: Câu phức (25-40 từ), nhiều mệnh đề, từ vựng C1-C2, cấu trúc bị động/đảo ngữ
- ✅ 4 đáp án có tính gây nhiễu rất cao (bẫy TOEIC điển hình)
- ✅ Có 2-3 bẫy trong mỗi câu
- ✅ Giải thích chi tiết, chỉ rõ ngoại lệ

TRẢ VỀ JSON ARRAY thuần (KHÔNG có markdown ```json):
[
  {
    "content": "Despite the _____ of evidence supporting the theory, many scientists remained skeptical.",
    "options": ["abound", "abundance", "abundant", "abundantly"],
    "correctOption": "B",
    "shortExplanation": "Câu dịch: Mặc dù có nhiều bằng chứng ủng hộ lý thuyết, nhiều nhà khoa học vẫn nghi ngờ. - Đáp án B vì cần danh từ sau 'the'",
    "LongExplanation": "- Loại câu hỏi: Từ loại (danh từ trừu tượng)<br>- Giải thích: Sau mạo từ 'the' và trước giới từ 'of' cần danh từ. 'Abundance' là danh từ trừu tượng chỉ số lượng lớn<br>- Cảnh báo bẫy: (1) Nhầm với tính từ 'abundant' vì nghĩ bổ nghĩa cho 'evidence'; (2) Nhầm với động từ 'abound' vì nghĩ là mệnh đề"
  }
]
````

---

## 📚 **TÍNH TỪ (Adjectives)**

### **4️⃣ EASY - Tính từ**

````
Bạn là giáo viên TOEIC chuyên ngữ pháp tiếng Anh.

NHIỆM VỤ: Tạo 20 câu hỏi trắc nghiệm ngữ pháp Part 5 TOEIC.

CHỦ ĐỀ: Vị trí & Đuôi nhận biết Tính từ (Adjectives)
MỨC ĐỘ: easy

YÊU CẦU CHO MỖI CÂU:
1. Content: Câu với 1 chỗ trống (_____)
2. 4 đáp án A, B, C, D (chỉ 1 đáp án đúng)
3. Correct option: A, B, C, hoặc D
4. Short explanation: 1-2 câu tiếng Việt, dưới 30 từ
5. Full explanation: 3 mục (Loại câu hỏi, Giải thích, Bẫy) với HTML <br>

QUY TẮC:
- ✅ Câu hỏi tập trung vào: vị trí tính từ (trước danh từ, sau tobe), đuôi tính từ cơ bản (-al, -ive, -ful, -ous)
- ✅ Mức độ easy: Câu ngắn (8-15 từ), từ vựng A2-B1
- ✅ 4 đáp án có tính gây nhiễu (tính từ vs danh từ cùng gốc)
- ✅ Giải thích rõ ràng

TRẢ VỀ JSON ARRAY thuần (KHÔNG có markdown ```json):
[
  {
    "content": "The _____ team completed the project on time.",
    "options": ["success", "successful", "successfully", "succeed"],
    "correctOption": "B",
    "shortExplanation": "Câu dịch: Nhóm thành công đã hoàn thành dự án đúng hạn. - Đáp án B vì cần tính từ trước danh từ 'team'",
    "LongExplanation": "- Loại câu hỏi: Từ loại (tính từ trước danh từ)<br>- Giải thích: Trước danh từ 'team' cần tính từ bổ nghĩa. Đuôi -ful tạo tính từ từ danh từ 'success'<br>- Cảnh báo bẫy: Nhầm với trạng từ 'successfully' vì nghĩ bổ nghĩa cho động từ"
  }
]
````

---

### **5️⃣ MEDIUM - Tính từ**

````
Bạn là giáo viên TOEIC chuyên ngữ pháp tiếng Anh.

NHIỆM VỤ: Tạo 20 câu hỏi trắc nghiệm ngữ pháp Part 5 TOEIC.

CHỦ ĐỀ: Vị trí & Đuôi nhận biết Tính từ (Adjectives)
MỨC ĐỘ: medium

YÊU CẦU CHO MỖI CÂU:
1. Content: Câu với 1 chỗ trống (_____)
2. 4 đáp án A, B, C, D (chỉ 1 đáp án đúng)
3. Correct option: A, B, C, hoặc D
4. Short explanation: 1-2 câu tiếng Việt, dưới 30 từ
5. Full explanation: 3 mục (Loại câu hỏi, Giải thích, Bẫy) với HTML <br>

QUY TẮC:
- ✅ Câu hỏi tập trung vào: tính từ sau linking verbs (become, remain, seem), đuôi -able/-ible, -ic
- ✅ Mức độ medium: Câu dài (15-25 từ), từ vựng B1-B2, có mệnh đề phụ
- ✅ 4 đáp án tinh vi (tính từ vs trạng từ cùng gốc)
- ✅ Có 1 bẫy TOEIC

TRẢ VỀ JSON ARRAY thuần (KHÔNG có markdown ```json):
[
  {
    "content": "The marketing strategy remains highly _____ despite recent market changes.",
    "options": ["effect", "effective", "effectively", "effectiveness"],
    "correctOption": "B",
    "shortExplanation": "Câu dịch: Chiến lược tiếp thị vẫn cực kỳ hiệu quả bất chấp thay đổi thị trường. - Đáp án B vì sau linking verb 'remains' cần tính từ",
    "LongExplanation": "- Loại câu hỏi: Từ loại (tính từ sau linking verb)<br>- Giải thích: Sau linking verb 'remains' và trạng từ 'highly' phải là tính từ. Đuôi -ive tạo tính từ từ danh từ 'effect'<br>- Cảnh báo bẫy: Nhầm với trạng từ 'effectively' vì thấy 'highly'"
  }
]
````

---

### **6️⃣ HARD - Tính từ**

````
Bạn là giáo viên TOEIC chuyên ngữ pháp tiếng Anh.

NHIỆM VỤ: Tạo 20 câu hỏi trắc nghiệm ngữ pháp Part 5 TOEIC.

CHỦ ĐỀ: Vị trí & Đuôi nhận biết Tính từ (Adjectives)
MỨC ĐỘ: hard

YÊU CẦU CHO MỖI CÂU:
1. Content: Câu với 1 chỗ trống (_____)
2. 4 đáp án A, B, C, D (chỉ 1 đáp án đúng)
3. Correct option: A, B, C, hoặc D
4. Short explanation: 1-2 câu tiếng Việt, dưới 30 từ
5. Full explanation: 3 mục (Loại câu hỏi, Giải thích, Bẫy) với HTML <br>

QUY TẮC:
- ✅ Câu hỏi tập trung vào: cấu trúc Make/Keep/Find + Object + Adj, tính từ bất quy tắc, ngoại lệ
- ✅ Mức độ hard: Câu phức (25-40 từ), từ vựng C1-C2, nhiều bẫy
- ✅ 4 đáp án rất tinh vi (bẫy -ly là tính từ: friendly, costly, timely, likely)
- ✅ Có 2-3 bẫy TOEIC

TRẢ VỀ JSON ARRAY thuần (KHÔNG có markdown ```json):
[
  {
    "content": "The board found the proposal _____, given the current financial constraints.",
    "options": ["attract", "attractive", "attractively", "attractiveness"],
    "correctOption": "B",
    "shortExplanation": "Câu dịch: Hội đồng thấy đề xuất hấp dẫn, xét các hạn chế tài chính hiện tại. - Đáp án B vì cấu trúc Find + Object + Adj",
    "LongExplanation": "- Loại câu hỏi: Từ loại (tính từ trong cấu trúc đặc biệt)<br>- Giải thích: Cấu trúc 'Find + Object (the proposal) + Adjective' → cần tính từ 'attractive' bổ nghĩa cho object<br>- Cảnh báo bẫy: (1) Nhầm với trạng từ 'attractively' vì nghĩ bổ nghĩa cho 'found'; (2) Không nhận ra cấu trúc Find + Obj + Adj"
  }
]
````

---

## 📚 **TRẠNG TỪ (Adverbs)**

### **7️⃣ EASY - Trạng từ**

````
Bạn là giáo viên TOEIC chuyên ngữ pháp tiếng Anh.

NHIỆM VỤ: Tạo 20 câu hỏi trắc nghiệm ngữ pháp Part 5 TOEIC.

CHỦ ĐỀ: Vị trí & Đuôi nhận biết Trạng từ (Adverbs)
MỨC ĐỘ: easy

YÊU CẦU CHO MỖI CÂU:
1. Content: Câu với 1 chỗ trống (_____)
2. 4 đáp án A, B, C, D (chỉ 1 đáp án đúng)
3. Correct option: A, B, C, hoặc D
4. Short explanation: 1-2 câu tiếng Việt, dưới 30 từ
5. Full explanation: 3 mục (Loại câu hỏi, Giải thích, Bẫy) với HTML <br>

QUY TẮC:
- ✅ Câu hỏi tập trung vào: trạng từ đuôi -ly, vị trí trước động từ thường
- ✅ Mức độ easy: Câu ngắn (8-15 từ), từ vựng A2-B1
- ✅ 4 đáp án rõ ràng (trạng từ vs tính từ cùng gốc)
- ✅ Giải thích dễ hiểu

TRẢ VỀ JSON ARRAY thuần (KHÔNG có markdown ```json):
[
  {
    "content": "She _____ completed the assignment before the deadline.",
    "options": ["quick", "quickly", "quickness", "quicken"],
    "correctOption": "B",
    "shortExplanation": "Câu dịch: Cô ấy đã hoàn thành bài tập nhanh chóng trước hạn chót. - Đáp án B vì cần trạng từ bổ nghĩa cho động từ 'completed'",
    "LongExplanation": "- Loại câu hỏi: Từ loại (trạng từ)<br>- Giải thích: Trước động từ thường 'completed' cần trạng từ để bổ nghĩa cho hành động. Đuôi -ly tạo trạng từ từ tính từ 'quick'<br>- Cảnh báo bẫy: Nhầm với tính từ 'quick' vì nghĩ bổ nghĩa cho danh từ"
  }
]
````

---

### **8️⃣ MEDIUM - Trạng từ**

````
Bạn là giáo viên TOEIC chuyên ngữ pháp tiếng Anh.

NHIỆM VỤ: Tạo 20 câu hỏi trắc nghiệm ngữ pháp Part 5 TOEIC.

CHỦ ĐỀ: Vị trí & Đuôi nhận biết Trạng từ (Adverbs)
MỨC ĐỘ: medium

YÊU CẦU CHO MỖI CÂU:
1. Content: Câu với 1 chỗ trống (_____)
2. 4 đáp án A, B, C, D (chỉ 1 đáp án đúng)
3. Correct option: A, B, C, hoặc D
4. Short explanation: 1-2 câu tiếng Việt, dưới 30 từ
5. Full explanation: 3 mục (Loại câu hỏi, Giải thích, Bẫy) với HTML <br>

QUY TẮC:
- ✅ Câu hỏi tập trung vào: trạng từ kẹp giữa auxiliary + V3, trạng từ trước tính từ
- ✅ Mức độ medium: Câu dài (15-25 từ), từ vựng B1-B2, cấu trúc bị động
- ✅ 4 đáp án tinh vi (trạng từ vs tính từ)
- ✅ Có 1 bẫy TOEIC

TRẢ VỀ JSON ARRAY thuần (KHÔNG có markdown ```json):
[
  {
    "content": "The factory's machinery is _____ inspected to ensure worker safety.",
    "options": ["routine", "routinely", "routinary", "routineness"],
    "correctOption": "B",
    "shortExplanation": "Câu dịch: Máy móc nhà máy được kiểm tra định kỳ để đảm bảo an toàn. - Đáp án B vì cần trạng từ bổ nghĩa cho động từ bị động 'inspected'",
    "LongExplanation": "- Loại câu hỏi: Từ loại (trạng từ trong câu bị động)<br>- Giải thích: Chỗ trống nằm giữa tobe 'is' và động từ dạng bị động 'inspected' (V3/ed) → bắt buộc dùng trạng từ đuôi -ly để bổ nghĩa cho động từ<br>- Cảnh báo bẫy: Nhầm với tính từ 'routine' vì nghĩ bổ nghĩa cho danh từ 'machinery'"
  }
]
````

---

### **9️⃣ HARD - Trạng từ**

````
Bạn là giáo viên TOEIC chuyên ngữ pháp tiếng Anh.

NHIỆM VỤ: Tạo 20 câu hỏi trắc nghiệm ngữ pháp Part 5 TOEIC.

CHỦ ĐỀ: Vị trí & Đuôi nhận biết Trạng từ (Adverbs)
MỨC ĐỘ: hard

YÊU CẦU CHO MỖI CÂU:
1. Content: Câu với 1 chỗ trống (_____)
2. 4 đáp án A, B, C, D (chỉ 1 đáp án đúng)
3. Correct option: A, B, C, hoặc D
4. Short explanation: 1-2 câu tiếng Việt, dưới 30 từ
5. Full explanation: 3 mục (Loại câu hỏi, Giải thích, Bẫy) với HTML <br>

QUY TẮC:
- ✅ Câu hỏi tập trung vào: bẫy từ đuôi -ly nhưng là TÍNH TỪ (friendly, costly, timely, likely), trạng từ đầu câu
- ✅ Mức độ hard: Câu phức (25-40 từ), từ vựng C1-C2, đảo ngữ
- ✅ 4 đáp án rất tinh vi (bẫy TOEIC kinh điển)
- ✅ Có 2-3 bẫy TOEIC

TRẢ VỀ JSON ARRAY thuần (KHÔNG có markdown ```json):
[
  {
    "content": "The consultant's _____ approach to problem-solving impressed the entire team.",
    "options": ["friend", "friendly", "friendliness", "unfriendly"],
    "correctOption": "B",
    "shortExplanation": "Câu dịch: Phương pháp giải quyết vấn đề thân thiện của cố vấn đã gây ấn tượng với cả nhóm. - Đáp án B vì 'friendly' là tính từ bổ nghĩa cho 'approach'",
    "LongExplanation": "- Loại câu hỏi: Từ loại (bẫy -ly là tính từ)<br>- Giải thích: Trước danh từ 'approach' cần tính từ bổ nghĩa. 'Friendly' là TÍNH TỪ đuôi -ly (ngoại lệ), không phải trạng từ<br>- Cảnh báo bẫy: (1) Nghĩ -ly luôn là trạng từ → chọn sai; (2) Nhầm với danh từ 'friendliness' vì thấy sở hữu cách 'consultant's'"
  }
]
````

---


 1. EASY - Mix Danh từ + Tính từ + Trạng từ
 Bạn là giáo viên TOEIC chuyên ngữ pháp tiếng Anh.

NHIỆM VỤ: Tạo 20 câu hỏi trắc nghiệm ngữ pháp Part 5 TOEIC.

CHỦ ĐỀ: Phân biệt Danh từ (Nouns), Tính từ (Adjectives), và Trạng từ (Adverbs)
MỨC ĐỘ: easy

YÊU CẦU CHO MỖI CÂU:
1. Content: Câu với 1 chỗ trống (_____)
2. 4 đáp án A, B, C, D (chỉ 1 đáp án đúng)
3. Correct option: A, B, C, hoặc D
4. Short explanation: 1-2 câu tiếng Việt, dưới 30 từ
5. LongExplanation: 3 mục (Loại câu hỏi, Giải thích, Bẫy) với HTML <br>

PHÂN BỔ CÂU HỎI:
- 7 câu về Danh từ (vị trí sau mạo từ/giới từ, đuôi -tion/-ment/-ness/-er)
- 7 câu về Tính từ (vị trí trước danh từ/sau tobe, đuôi -ful/-ive/-ous)
- 6 câu về Trạng từ (vị trí trước động từ, đuôi -ly)

QUY TẮC:
- ✅ Câu ngắn (8-15 từ), từ vựng cơ bản A2-B1
- ✅ 4 đáp án cùng gốc từ, khác loại (ví dụ: success, successful, successfully, succeed)
- ✅ Giải thích rõ ràng, dễ hiểu

TRẢ VỀ JSON ARRAY thuần (KHÔNG có markdown ```json):
[
  {
    "content": "The _____ employee worked _____ to finish the _____.",
    "options": ["dedication/dedicated/dedicately/dedicate", "dedicated/dedication/dedicately/dedicate", "dedicate/dedicated/dedication/dedicately", "dedicated/dedicately/dedication/dedicate"],
    "correctOption": "B",
    "shortExplanation": "Câu dịch: Nhân viên tận tâm đã làm việc chăm chỉ để hoàn thành sự cống hiến. - Đáp án B: tính từ 'dedicated' trước danh từ, trạng từ 'dedicately', danh từ 'dedication'",
    "LongExplanation": "- Loại câu hỏi: Từ loại (tính từ + trạng từ + danh từ)<br>- Giải thích: (1) Trước danh từ 'employee' cần tính từ 'dedicated'; (2) Sau động từ 'worked' cần trạng từ 'dedicately'; (3) Sau mạo từ 'the' cần danh từ 'dedication'<br>- Cảnh báo bẫy: Nhầm lẫn giữa các đuôi tạo từ loại khác nhau"
  }
]

2. MEDIUM - Mix Danh từ + Tính từ + Trạng từ

Bạn là giáo viên TOEIC chuyên ngữ pháp tiếng Anh.

NHIỆM VỤ: Tạo 20 câu hỏi trắc nghiệm ngữ pháp Part 5 TOEIC.

CHỦ ĐỀ: Phân biệt Danh từ (Nouns), Tính từ (Adjectives), và Trạng từ (Adverbs)
MỨC ĐỘ: medium

YÊU CẦU CHO MỖI CÂU:
1. Content: Câu với 1 chỗ trống (_____)
2. 4 đáp án A, B, C, D (chỉ 1 đáp án đúng)
3. Correct option: A, B, C, hoặc D
4. Short explanation: 1-2 câu tiếng Việt, dưới 30 từ
5. LongExplanation: 3 mục (Loại câu hỏi, Giải thích, Bẫy) với HTML <br>

PHÂN BỔ CÂU HỎI:
- 7 câu về Danh từ (sau giới từ, lượng từ, đuôi -ity/-ance/-ence)
- 7 câu về Tính từ (sau linking verbs become/remain/seem, đuôi -able/-ible)
- 6 câu về Trạng từ (kẹp giữa auxiliary + V3, trước tính từ)

QUY TẮC:
- ✅ Câu dài (15-25 từ), có mệnh đề phụ, từ vựng TOEIC B1-B2
- ✅ 4 đáp án tinh vi (cùng gốc từ, khác loại)
- ✅ Có 1-2 bẫy TOEIC điển hình trong mỗi câu
- ✅ Giải thích chỉ rõ bẫy

TRẢ VỀ JSON ARRAY thuần (KHÔNG có markdown ```json):
[
  {
    "content": "The manager remained _____ about the _____ of the project, which was _____ delayed.",
    "options": ["optimistic/optimism/optimistically/optimize", "optimism/optimistic/optimistically/optimize", "optimistic/optimism/optimistically/optimize", "optimistically/optimistic/optimism/optimize"],
    "correctOption": "C",
    "shortExplanation": "Câu dịch: Người quản lý vẫn lạc quan về sự lạc quan của dự án, vốn bị trì hoãn đáng kể. - Đáp án C: tính từ sau 'remained', danh từ sau 'the', trạng từ trước 'delayed'",
    "LongExplanation": "- Loại câu hỏi: Từ loại (tính từ + danh từ + trạng từ)<br>- Giải thích: (1) Sau linking verb 'remained' cần tính từ 'optimistic'; (2) Sau mạo từ 'the' và trước giới từ 'of' cần danh từ 'optimism'; (3) Trước động từ 'delayed' cần trạng từ 'optimistically'<br>- Cảnh báo bẫy: (1) Nhầm 'optimistic' với 'optimism' sau 'remained'; (2) Không nhận ra vị trí trạng từ trước động từ bị động"
  }
]

 3. HARD - Mix Danh từ + Tính từ + Trạng từ

 Bạn là giáo viên TOEIC chuyên ngữ pháp tiếng Anh.

NHIỆM VỤ: Tạo 20 câu hỏi trắc nghiệm ngữ pháp Part 5 TOEIC.

CHỦ ĐỀ: Phân biệt Danh từ (Nouns), Tính từ (Adjectives), và Trạng từ (Adverbs)
MỨC ĐỘ: hard

YÊU CẦU CHO MỖI CÂU:
1. Content: Câu với 1 chỗ trống (_____)
2. 4 đáp án A, B, C, D (chỉ 1 đáp án đúng)
3. Correct option: A, B, C, hoặc D
4. Short explanation: 1-2 câu tiếng Việt, dưới 30 từ
5. LongExplanation: 3 mục (Loại câu hỏi, Giải thích, Bẫy) với HTML <br>

PHÂN BỔ CÂU HỎI:
- 7 câu về Danh từ (cấu trúc phức, danh từ trừu tượng, bẫy danh từ/tính từ cùng gốc)
- 7 câu về Tính từ (cấu trúc Make/Keep/Find + Object + Adj, tính từ đuôi -ly như friendly/costly/timely)
- 6 câu về Trạng từ (trạng từ đầu câu, bẫy từ đuôi -ly là tính từ)

QUY TẮC:
- ✅ Câu phức (25-40 từ), nhiều mệnh đề, từ vựng C1-C2
- ✅ Cấu trúc bị động, đảo ngữ, mệnh đề quan hệ
- ✅ 4 đáp án rất tinh vi (bẫy TOEIC kinh điển)
- ✅ Có 2-3 bẫy trong mỗi câu
- ✅ Giải thích chi tiết, chỉ rõ ngoại lệ

TRẢ VỀ JSON ARRAY thuần (KHÔNG có markdown ```json):
[
  {
    "content": "Despite the _____ nature of the proposal, the board found it _____ that the project would be completed _____.",
    "options": ["cost/costly/costliness/costly", "costly/cost/costliness/costly", "costliness/costly/cost/costly", "costly/costliness/cost/costly"],
    "correctOption": "B",
    "shortExplanation": "Câu dịch: Mặc dù bản chất tốn kém của đề xuất, hội đồng thấy rằng dự án sẽ được hoàn thành đúng lúc. - Đáp án B: tính từ 'costly' trước 'nature', danh từ 'cost' sau 'the', trạng từ 'costly' (bẫy -ly là tính từ)",
    "LongExplanation": "- Loại câu hỏi: Từ loại (tính từ + danh từ + bẫy -ly)<br>- Giải thích: (1) Trước danh từ 'nature' cần tính từ 'costly'; (2) Sau mạo từ 'the' cần danh từ 'cost'; (3) 'Timely' là TÍNH TỪ đuôi -ly (ngoại lệ), không phải trạng từ<br>- Cảnh báo bẫy: (1) Nhầm 'costly' là trạng từ vì đuôi -ly; (2) Không nhận ra cấu trúc Find + it + Adj + that clause; (3) Nhầm lẫn giữa danh từ trừu tượng và tính từ"
  }
]