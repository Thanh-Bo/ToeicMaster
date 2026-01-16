# Frontend - Import & Audio Management Documentation

## 📋 Tổng quan
Đã xây dựng frontend hoàn chỉnh cho quy trình 2 giai đoạn:
- **Giai đoạn 1:** Import dữ liệu thô (Excel → Database)
- **Giai đoạn 2:** Tạo audio AI (Google TTS → S3)

---

## 🎨 Components Created

### 1. **audioService.ts** (Service API)
Location: `app/services/audioService.ts`

**Chức năng:**
- `getPart3Groups(testId)` - Lấy danh sách groups chưa có audio
- `generateAudioForGroup(groupId)` - Tạo audio cho 1 group
- `generateAudioForAllGroups(testId)` - Tạo audio cho tất cả groups

```typescript
// Usage Example
const groups = await audioService.getPart3Groups(testId);
const result = await audioService.generateAudioForGroup(groupId);
```

---

### 2. **Part3AudioManager.tsx** (Component)
Location: `app/components/Part3AudioManager.tsx`

**Chức năng:**
- Hiển thị danh sách các nhóm câu hỏi Part 3
- Nút "⚡ Tạo Audio" cho mỗi nhóm
- Nút "Tạo tất cả" để batch generation
- Nút "▶ Nghe" để preview audio
- Real-time status (Đã có/Chưa có audio)
- Progress counter (Đã tạo: X / Y nhóm)

**Props:**
```typescript
interface Part3AudioManagerProps {
  testId: number; // ID của đề thi
}
```

---

### 3. **ImportManagementPage** (Page)
Location: `app/admin/import/page.tsx`

**Giao diện 2 cột:**

**Cột trái (Sticky):**
- Chọn đề thi từ dropdown
- Upload file Excel (.xlsx, .xls, .csv)
- Nút "Upload Excel"
- Status messages (success/error)

**Cột phải:**
- Component `Part3AudioManager`
- Hiển thị danh sách groups sau khi import
- Tạo audio cho từng group hoặc tất cả

---

## 🔗 Integration Points

### Admin Sidebar Navigation
File: `app/admin/page.tsx`

Đã thêm link "⚡ Import & Audio" vào sidebar admin:
```
Admin Panel
├── 📊 Dashboard
├── 👥 Quản lý Users
├── 📝 Quản lý Đề thi
├── ❓ Quản lý Câu hỏi
├── ─────────────
└── ⚡ Import & Audio ← NEW
```

---

## 📡 API Endpoints Used

### Backend Endpoints Required:

1. **GET** `/tests` - Lấy danh sách đề thi
   ```json
   Response: Test[]
   ```

2. **GET** `/tests/{testId}/part3-groups` - Lấy danh sách Part 3 Groups
   ```json
   Response: {
     id: number,
     transcript: string,
     audioUrl: string | null,
     hasAudio: boolean
   }[]
   ```

3. **POST** `/import/generate-audio/{groupId}` - Tạo audio cho 1 group
   ```json
   Response: {
     message: string,
     url: string (S3 URL)
   }
   ```

4. **POST** `/import/import-part3/{testId}` - Upload Excel
   ```json
   FormData: { file: File }
   Response: { message: string }
   ```

---

## 🎯 User Flow

### Giai đoạn 1: Import Excel
```
1. Admin → /admin/import
2. Chọn đề thi từ dropdown
3. Chọn file Excel (Excel chỉ chứa TEXT)
4. Click "Upload Excel"
5. ✅ "Import thành công" → Refresh trang
```

### Giai đoạn 2: Tạo Audio
```
1. Danh sách Part 3 Groups hiển thị
2. Bên cạnh mỗi group: Nút "⚡ Tạo Audio"
3. Click để tạo audio cho group đó
4. ⏳ Loading... (Google TTS generate + S3 upload)
5. ✅ Audio ready → Nút "▶ Nghe" hiển thị
6. Hoặc click "Tạo tất cả" để batch generation
```

---

## 🎨 UI Features

### Status Indicators:
- 🟢 **Có Audio:** Nút green "▶ Nghe"
- 🔵 **Không có:** Nút blue "⚡ Tạo Audio"
- ⏳ **Loading:** Icon spinning + "Đang tạo..."

### Progress Tracking:
- Counter: "Đã tạo: 8 / 13 nhóm"
- Gradient header với stats

### Error Handling:
- Error messages từ API
- User-friendly notifications
- Try-again buttons

---

## 🔒 Security & Validation

- ✅ Admin-only access (checked in page)
- ✅ File type validation (.xlsx, .xls, .csv)
- ✅ Test selection required
- ✅ Error boundary & user feedback

---

## 📦 Dependencies Used

```json
{
  "next": "^15.x",
  "lucide-react": "for icons"
}
```

Icon imports từ lucide-react:
- `Upload` - Import section
- `FileUp` - Audio section  
- `Play` - Play button
- `Zap` - Generate button
- `Loader` - Loading spinner
- `AlertCircle` - Error message
- `CheckCircle` - Success message

---

## 🚀 Deployment Notes

1. Confirm backend endpoints exist (see API Endpoints section)
2. Install lucide-react nếu chưa có:
   ```bash
   npm install lucide-react
   ```
3. Test flow:
   - Upload Excel → Check if groups appear
   - Click "Tạo Audio" → Check S3 URL in database
   - Click "▶ Nghe" → Audio should play

---

## 💡 Next Steps

### Optional Enhancements:
1. **Batch progress:** Show progress bar for batch operations
2. **Audio preview:** Waveform display
3. **Export:** Export groups with audio URLs to Excel
4. **Scheduling:** Schedule audio generation for later
5. **Logs:** View generation logs & error details

---

## 📝 File Structure
```
toeic-web/
├── app/
│   ├── services/
│   │   └── audioService.ts          ✅ NEW
│   ├── components/
│   │   └── Part3AudioManager.tsx    ✅ NEW
│   └── admin/
│       ├── page.tsx                 ✅ MODIFIED
│       └── import/
│           └── page.tsx             ✅ NEW
```

---

**Frontend Implementation Complete! ✅**
Backend already done, ready for testing.
