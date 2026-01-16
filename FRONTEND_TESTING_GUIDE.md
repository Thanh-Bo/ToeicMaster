# 🚀 Testing & Setup Guide

## ✅ Prerequisites

### 1. Backend Setup (Đã hoàn thành)
- ✅ NuGet packages installed (NAudio, Google TTS, AWSSDK.S3)
- ✅ TextToSpeechService.cs (Generate audio)
- ✅ ImportController.cs (API endpoints)
- ✅ Database migrations (QuestionGroups, Questions, AudioUrl)

### 2. Frontend Dependencies
Kiểm tra xem `lucide-react` đã được install:

```bash
cd D:\ToeicMaster\toeic-web
npm list lucide-react
```

**Nếu chưa có, install:**
```bash
npm install lucide-react
```

---

## 📋 Testing Checklist

### Phase 1: Setup
- [ ] Backend running: `dotnet run` (PORT 7094 or configured)
- [ ] Frontend running: `npm run dev` (PORT 3000)
- [ ] Check CORS configuration (backend should accept frontend requests)
- [ ] AWS S3 credentials configured in appsettings.json
- [ ] Google TTS credentials configured

### Phase 2: Test Import Page Access
```
1. Login as Admin
2. Go to: http://localhost:3000/admin
3. Click "⚡ Import & Audio" in sidebar
4. Should see:
   - Left panel: Test selection + Excel upload
   - Right panel: "Chọn đề thi từ bên trái" message
```

### Phase 3: Test Excel Import (Giai đoạn 1)
```
1. Create Excel file với cấu trúc:
   - Column A: Speaker (M/W)
   - Column B: Text
   - Column C: Question
   - Leave Column D (AudioUrl) empty

2. Select a test từ dropdown
3. Choose Excel file
4. Click "Upload Excel"
5. Should see: "✅ Đã import xong..."
```

### Phase 4: Test Audio Generation (Giai đoạn 2)
```
1. Sau import, Part3AudioManager sẽ load
2. Should see danh sách groups với:
   - "⚡ Tạo Audio" buttons (nhóm chưa có audio)
   - "✓ Có" + "▶ Nghe" (nhóm đã có audio)

3. Click "⚡ Tạo Audio" cho 1 nhóm:
   - Button shows "⏳ Đang tạo..."
   - After 5-10 sec, button changes to "▶ Nghe"
   - Success message: "✅ Tạo audio thành công"

4. Click "▶ Nghe" để test play audio

5. Click "Tạo tất cả" để batch generate
```

---

## 🐛 Troubleshooting

### Issue 1: "404 - Không tìm thấy endpoint"
**Solution:**
- Check backend is running
- Verify endpoint URLs match in service:
  - `/tests/{testId}/part3-groups`
  - `/import/generate-audio/{groupId}`
  - `/import/import-part3/{testId}`

### Issue 2: "CORS Error"
**Solution:**
Program.cs (Backend):
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

app.UseCors("AllowFrontend");
```

### Issue 3: "Google TTS Error" / "AWS S3 Error"
**Solution:**
- Check environment variables
- Check credentials file path
- Check S3 bucket name & region
- Check IAM permissions for S3

### Issue 4: "Audio không nghe được"
**Solution:**
- Verify S3 URL is public
- Check S3 bucket CORS settings
- Test audio URL directly in browser

### Issue 5: Excel upload fails
**Solution:**
- Check file format (.xlsx, .xls, .csv)
- Check file size (max limit?)
- Check column names match backend parser
- Check test ID exists

---

## 📊 Expected Database State

### After Import (Giai đoạn 1):
```sql
QuestionGroups:
├── ID: 1, TestId: 1, Transcript: "M: Hello...", AudioUrl: NULL
├── ID: 2, TestId: 1, Transcript: "W: Hi...", AudioUrl: NULL
└── ...

Questions:
├── ID: 1, GroupId: 1, Content: "What...", AudioUrl: NULL
├── ID: 2, GroupId: 1, Content: "Where...", AudioUrl: NULL
└── ...
```

### After Audio Generation (Giai đoạn 2):
```sql
QuestionGroups:
├── ID: 1, TestId: 1, Transcript: "M: Hello...", 
│   AudioUrl: "https://toeicmaster-audio.s3.ap-southeast-1.amazonaws.com/part3/auto_import_xyz.mp3"
└── ...
```

---

## 🎬 Manual API Testing (Postman/Thunder Client)

### Test 1: Get Part3 Groups
```
GET http://localhost:7094/tests/1/part3-groups
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "transcript": "M: Hello W: Hi",
    "audioUrl": null,
    "hasAudio": false
  }
]
```

### Test 2: Generate Audio
```
POST http://localhost:7094/import/generate-audio/1
Authorization: Bearer {token}

Response:
{
  "message": "Tạo audio thành công",
  "url": "https://toeicmaster-audio.s3.ap-southeast-1.amazonaws.com/part3/auto_import_xyz.mp3"
}
```

### Test 3: Verify Database Update
```
GET http://localhost:7094/tests/1/part3-groups
Authorization: Bearer {token}

Response (should have URL now):
[
  {
    "id": 1,
    "transcript": "M: Hello W: Hi",
    "audioUrl": "https://...",
    "hasAudio": true
  }
]
```

---

## 🔧 Development Tips

### Clear Cache & Restart:
```bash
# Frontend
cd D:\ToeicMaster\toeic-web
rm -r .next
npm run dev

# Backend
cd D:\ToeicMaster\ToeicMaster.API
dotnet clean
dotnet build
dotnet run
```

### Enable Debug Logging (Frontend):
Add to audioService.ts:
```typescript
console.log("Calling API:", url);
console.log("Response:", response);
```

### Check Network Requests:
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action
4. Check request/response details

---

## 📈 Performance Notes

- **Batch Generation:** 2 second delay between requests (anti-throttle)
- **File Upload:** Max size depends on backend config
- **Audio Generation Time:** ~5-10 seconds per group (Google TTS)
- **S3 Upload:** ~1-2 seconds

**Total Time for 13 groups:** ~1.5-2 minutes

---

## ✨ Success Indicators

✅ You know it's working when:

1. **Page loads without 404 errors**
   - Import page accessible at `/admin/import`
   
2. **Tests dropdown populates**
   - GET `/tests` returns data
   
3. **Excel upload works**
   - File accepted, success message shown
   
4. **Groups list loads**
   - GET `/tests/{testId}/part3-groups` returns data
   
5. **Audio generation works**
   - Button changes from "⚡ Tạo Audio" → "▶ Nghe"
   - S3 URL appears in database
   
6. **Audio plays**
   - Click "▶ Nghe" → audio plays in browser

---

## 📞 Common Commands

```bash
# Check if ports are in use
netstat -ano | findstr ":3000"      # Frontend
netstat -ano | findstr ":7094"      # Backend

# Kill process on Windows
taskkill /PID {PID} /F

# Check npm packages
npm list
npm list lucide-react

# Install missing packages
npm install lucide-react
```

---

## 🎯 Next Meeting Agenda

After testing, discuss:
1. UI refinements (colors, animations)
2. Error handling edge cases
3. Batch operation limits
4. Audio quality settings
5. User feedback mechanisms

---

**Ready to test! Good luck! 🚀**
