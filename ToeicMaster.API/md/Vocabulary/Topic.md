Tạo 12 từ vựng TOEIC chủ đề Market Research với định dạng **CSV** để import vào Excel:

Yêu cầu:
- Level: Intermediate (450-700)
- Mỗi từ phải có đầy đủ các cột
- Collocations, Synonyms, Antonyms để ở dạng **JSON string** trong 1 cell

**Cấu trúc CSV (13 cột):**

| Cột | Tên | Mô tả |
|-----|-----|-------|
| 1 | Word | Từ vựng tiếng Anh (bắt buộc) |
| 2 | Meaning | Nghĩa tiếng Việt (bắt buộc) |
| 3 | Pronunciation | Phiên âm IPA (vd: /ˈstrætədʒi/) |
| 4 | PartOfSpeech | Loại từ (n/v/adj/adv) |
| 5 | Example | Câu ví dụ tiếng Anh |
| 6 | ExampleTranslation | Dịch câu ví dụ |
| 7 | AudioUrl | Link audio (để trống) |
| 8 | ImageUrl | Link hình ảnh (để trống) |
| 9 | Difficulty | Độ khó (1-5, mặc định 1) |
| 10 | Icon | Icon (để trống) |
| 11 | Collocations | JSON array: [{"phrase":"...","meaning":"..."}] |
| 12 | Synonyms | JSON array: [{"word":"...","meaning":"..."}] |
| 13 | Antonyms | JSON array: [{"word":"...","meaning":"..."}] |

**Format JSON trong cell (không xuống dòng):**
- Collocations: `[{"phrase":"develop a strategy","meaning":"xây dựng chiến lược"},{"phrase":"business strategy","meaning":"chiến lược kinh doanh"}]`
- Synonyms: `[{"word":"plan","meaning":"kế hoạch"},{"word":"approach","meaning":"phương pháp"}]`
- Antonyms: `[{"word":"tactic","meaning":"chiến thuật ngắn hạn"}]`

**Danh sách 12 từ vung:**


**Yêu cầu output:**
- Dòng 1: Header (Word,Meaning,Pronunciation,PartOfSpeech,Example,ExampleTranslation,AudioUrl,ImageUrl,Difficulty,Icon,Collocations,Synonyms,Antonyms)
- Dòng 2-13: 12 từ vựng
- Format: CSV chuẩn (các cell có dấu phẩy hoặc xuống dòng thì bọc trong dấu ngoặc kép)
- Mỗi từ có 2 collocations, 2 synonyms, 2 antonyms

Hãy tạo file CSV hoàn chỉnh có thể copy paste vào Excel.