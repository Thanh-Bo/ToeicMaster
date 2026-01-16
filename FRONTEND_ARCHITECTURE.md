# 🏗️ Frontend Architecture - Import & Audio System

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TOEIC MASTER - ADMIN                         │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              /admin/import PAGE (ImportManagementPage)      │   │
│  │                                                              │   │
│  │  ┌────────────────────┐     ┌──────────────────────────┐   │   │
│  │  │   LEFT PANEL       │     │   RIGHT PANEL            │   │   │
│  │  │ (Upload Section)   │     │ (Audio Manager)          │   │   │
│  │  │                    │     │                          │   │   │
│  │  │ 📥 Test Selection  │────▶│  Part3AudioManager       │   │   │
│  │  │    (Dropdown)      │     │                          │   │   │
│  │  │                    │     │ ┌────────────────────┐   │   │   │
│  │  │ 📄 Excel Upload    │     │ │ Group #1           │   │   │   │
│  │  │    (File Input)    │     │ │ ⚡ Tạo Audio      │   │   │   │
│  │  │                    │     │ └────────────────────┘   │   │   │
│  │  │ 🚀 Upload Button   │     │ ┌────────────────────┐   │   │   │
│  │  │    (Submit)        │     │ │ Group #2           │   │   │   │
│  │  │                    │     │ │ ▶️ Nghe / ✓ Có    │   │   │   │
│  │  │ ✅/❌ Messages      │     │ └────────────────────┘   │   │   │
│  │  └────────────────────┘     │ ... (more groups)       │   │   │
│  │                             │ 🎯 Tạo tất cả          │   │   │
│  │                             └──────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                           Admin Page (/admin)                       │
│              ┌─────────────────────────────────────┐                │
│              │ Sidebar Navigation                  │                │
│              │ 📊 Dashboard                        │                │
│              │ 👥 Quản lý Users                    │                │
│              │ 📝 Quản lý Đề thi                   │                │
│              │ ❓ Quản lý Câu hỏi                  │                │
│              │ ⚡ Import & Audio  ←── NEW         │                │
│              └─────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────────────┘
                            ▼ API Calls
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (ASP.NET Core)                         │
│                                                                       │
│  ┌────────────────────────┐      ┌──────────────────────────────┐  │
│  │ ImportController       │      │ TextToSpeechController       │  │
│  │                        │      │                              │  │
│  │ POST /import-part3/{id}│      │ GET /tests/{id}/part3-groups│  │
│  │   ↓ Read Excel         │      │   ↓ Fetch from DB            │  │
│  │   ↓ Parse data         │      │   ↓ Return groups w/ URLs   │  │
│  │   ↓ Save to DB         │      │                              │  │
│  │   ↓ Return message     │      │ POST /generate-audio/{groupId}
│  └────────────────────────┘      │   ↓ Get transcript from DB   │  │
│                                   │   ↓ Call Google TTS          │  │
│                                   │   ↓ Upload to S3             │  │
│                                   │   ↓ Update DB with S3 URL   │  │
│                                   │   ↓ Return S3 URL           │  │
│                                   └──────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Database (SQL Server)                                      │    │
│  │ ┌──────────────────┐  ┌──────────────────┐                │    │
│  │ │ QuestionGroups   │  │ Questions        │                │    │
│  │ │ ID: 1            │  │ ID: 1            │                │    │
│  │ │ Transcript: "..." │  │ Content: "..."   │                │    │
│  │ │ AudioUrl: NULL→  │──│ AudioUrl: NULL   │                │    │
│  │ │   (updated here) │  │                  │                │    │
│  │ └──────────────────┘  └──────────────────┘                │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ External Services                                          │    │
│  │ ✓ Google Cloud Text-to-Speech                            │    │
│  │ ✓ AWS S3 (Storage)                                       │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Component Hierarchy

```
ImportManagementPage (app/admin/import/page.tsx)
│
├── Left Section (Upload)
│   ├── Test Dropdown (select)
│   ├── File Input (Excel)
│   ├── Upload Button (onClick → handleUploadExcel)
│   └── Message Display (success/error)
│
└── Right Section (Audio Management)
    └── Part3AudioManager (app/components/Part3AudioManager.tsx)
        │
        ├── useEffect → loadPart3Groups()
        │
        ├── Header
        │   ├── Counter ("Đã tạo X / Y")
        │   └── "Tạo tất cả" Button
        │
        ├── Message Display (error/success)
        │
        └── Groups List
            ├── Group Item 1
            │   ├── Transcript preview
            │   ├── "⚡ Tạo Audio" / "▶️ Nghe" Button
            │   └── Status indicator
            │
            ├── Group Item 2
            │   └── ...
            │
            └── Group Item N
```

---

## 🔄 Data Flow Diagram

### Giai đoạn 1: Excel Import

```
User Input (Excel File)
        ▼
File Input Component
        ▼
handleUploadExcel()
        ▼
FormData (file + testId)
        ▼
axiosClient.post("/import/import-part3/{testId}")
        ▼
Backend: Parse Excel → Save to DB
        ▼
Response: { message: "Đã import..." }
        ▼
UI: Show success → Reload groups
        ▼
Part3AudioManager loads: loadPart3Groups()
        ▼
Display groups with "⚡ Tạo Audio" buttons
```

### Giai đoạn 2: Audio Generation

```
User Click: "⚡ Tạo Audio" Button
        ▼
setGenerating(groupId)
        ▼
audioService.generateAudioForGroup(groupId)
        ▼
axiosClient.post("/import/generate-audio/{groupId}")
        ▼
Backend:
  1. Get transcript from DB
  2. Call Google TTS
  3. Upload to S3
  4. Update DB with S3 URL
  5. Return { message, url }
        ▼
Response: { message, url: "https://..." }
        ▼
Update state:
  groups.find(g => g.id === groupId).audioUrl = url
  groups.find(g => g.id === groupId).hasAudio = true
        ▼
UI Update:
  "⚡ Tạo Audio" Button → "▶️ Nghe" Button + "✓ Có" badge
  Counter increases: "Đã tạo: 9 / 13"
```

---

## 🎯 State Management

### ImportManagementPage State:
```typescript
const [tests, setTests] = useState<Test[]>([]);           // List of tests
const [selectedTestId, setSelectedTestId] = useState<number | null>(null); // Selected test
const [excelFile, setExcelFile] = useState<File | null>(null); // Selected Excel file
const [uploading, setUploading] = useState(false);       // Upload in progress
const [uploadMessage, setUploadMessage] = useState<{ type, text } | null>(null); // Upload feedback
```

### Part3AudioManager State:
```typescript
const [groups, setGroups] = useState<Part3Group[]>([]);  // List of groups
const [loading, setLoading] = useState(true);            // Initial loading
const [generating, setGenerating] = useState<number | null>(null); // Which group is generating
const [error, setError] = useState<string | null>(null);           // Error message
const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message
```

---

## 📡 API Contract

### Request/Response Format

#### 1. GET /tests/{testId}/part3-groups
```
REQUEST:
  - No body
  
RESPONSE:
  [
    {
      "id": 1,
      "transcript": "M: Hello\nW: Hi there",
      "audioUrl": null,
      "hasAudio": false
    },
    ...
  ]
```

#### 2. POST /import/generate-audio/{groupId}
```
REQUEST:
  - No body (groupId in URL)
  
RESPONSE:
  {
    "message": "Tạo audio thành công",
    "url": "https://toeicmaster-audio.s3.ap-southeast-1.amazonaws.com/part3/auto_import_abc123.mp3"
  }
```

#### 3. POST /import/import-part3/{testId}
```
REQUEST:
  FormData:
    - file: File (Excel)
    
RESPONSE:
  {
    "message": "Đã import xong 13 đoạn hội thoại"
  }
```

---

## 🎨 UI State Transitions

### "⚡ Tạo Audio" Button States:

```
State 1: READY
┌──────────────────────┐
│  ⚡ Tạo Audio       │  (enabled, blue background)
└──────────────────────┘
        ▼ onClick
        
State 2: LOADING
┌──────────────────────┐
│  ⏳ Đang tạo...     │  (disabled, gray, spinner)
└──────────────────────┘
        ▼ Success/Error
        
State 3: COMPLETE
┌──────────────────────┐
│  ▶️ Nghe  ✓ Có      │  (green background, can play)
└──────────────────────┘
```

---

## 🔐 Authorization & Validation

```
✅ Frontend Validation:
  - Admin-only page (checked in useEffect)
  - Test selection required
  - File format validation (.xlsx, .xls, .csv)
  - File size check (optional)

✅ Backend Validation:
  - JWT token verification
  - Admin role check
  - Excel format parsing
  - Database integrity checks
```

---

## 📦 Component Reusability

### Part3AudioManager Component:
Can be reused in other pages:
```typescript
// Example: Summary page showing audio status
import Part3AudioManager from "@/app/components/Part3AudioManager";

export default function SummaryPage() {
  return (
    <div>
      <Part3AudioManager testId={1} />
    </div>
  );
}
```

---

## 🚀 Performance Optimizations

1. **Lazy Loading:** Groups loaded on-demand when test selected
2. **Batch Requests:** 2-second delay between requests prevents API throttle
3. **Optimistic Updates:** UI updates immediately while request processes
4. **Error Handling:** Failed requests don't break the app
5. **Message Auto-Clear:** Success/error messages disappear after 3 seconds

---

## 🎭 Error Handling Flow

```
User Action
    ▼
try {
  API Call
    ▼
  Success → Update State → Show Success Message
} 
catch (error) {
  Extract Error Message (from response.data.error or error.message)
    ▼
  Set error state
    ▼
  Display Error Alert in Red Box
    ▼
  User can retry or adjust input
}
```

---

**Architecture complete and well-documented! 🎉**
