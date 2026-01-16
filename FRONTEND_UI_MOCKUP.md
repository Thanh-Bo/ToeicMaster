# 🎨 Frontend UI Mockup & Visual Guide

## 📱 Page Layout

### `/admin/import` Page Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│ ← Dashboard    Import & Audio                                        │
│ Quản lý Import dữ liệu và tạo audio Part 3                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐ │
│  │                              │  │                              │ │
│  │      LEFT PANEL              │  │     RIGHT PANEL              │ │
│  │    (Upload Section)          │  │ (Audio Manager)              │ │
│  │  [Sticky - follows scroll]   │  │                              │ │
│  │                              │  │                              │
│  │ ┌────────────────────────┐  │  │ ┌──────────────────────────┐ │
│  │ │ 📥 BƯỚC 1: IMPORT      │  │  │ │ ⚡ BƯỚC 2: TẠO AUDIO   │ │
│  │ │                        │  │  │ │                          │ │
│  │ │ Chọn đề thi:           │  │  │ │ Đã tạo: 8 / 13 nhóm   │ │
│  │ │ [Dropdown ▼]           │  │  │ │ [Tạo tất cả]           │ │
│  │ │ - Test 1               │  │  │ │                          │ │
│  │ │ - Test 2               │  │  │ │ ┌──────────────────────┐│ │
│  │ │                        │  │  │ │ │ Nhóm #1               ││ │
│  │ │ Chọn file Excel:       │  │  │ │ │ M: Hello, W: Hi      ││ │
│  │ │ [📄 Choose file]       │  │  │ │ │                       ││ │
│  │ │                        │  │  │ │ │  [⚡ Tạo Audio]      ││ │
│  │ │ [📤 Upload Excel]      │  │  │ │ └──────────────────────┘│ │
│  │ │                        │  │  │ │                          │ │
│  │ │ ✅ Import thành công! │  │  │ │ ┌──────────────────────┐│ │
│  │ │    (auto-dismiss)      │  │  │ │ │ Nhóm #2               ││ │
│  │ │                        │  │  │ │ │ M: Good morning...   ││ │
│  │ └────────────────────────┘  │  │ │ │                       ││ │
│  │                              │  │ │ │  [▶️ Nghe]  [✓ Có]   ││ │
│  │                              │  │ │ └──────────────────────┘│ │
│  │                              │  │ │                          │ │
│  │                              │  │ │ ... (more groups)       │ │
│  │                              │  │ │                          │ │
│  └──────────────────────────────┘  │ └──────────────────────────┘ │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Component Details

### Left Panel - Upload Section

```
┌─────────────────────────────────┐
│  📥 Bước 1: Import Excel        │ ← Header
│                                 │
│ Chọn đề thi                     │ ← Label
│ ┌─────────────────────────────┐ │
│ │ -- Chọn đề thi --       ▼ │ │ ← Dropdown
│ │ Test 1 - ETS 2024           │
│ │ Test 2 - Mini Test          │
│ └─────────────────────────────┘
│                                 │
│ Chọn file Excel                 │ ← Label
│ ┌─────────────────────────────┐ │
│ │ 📁 Choose file...           │ │ ← File input
│ │ .xlsx, .xls, .csv           │
│ └─────────────────────────────┘
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📤 Upload Excel             │ │ ← Button (blue gradient)
│ └─────────────────────────────┘
│                                 │
│ ✅ Import thành công!          │ ← Success message (green)
│ 13 đoạn hội thoại              │
│                                 │
│ [Sticky position - stays on    │
│  screen while scrolling right] │
└─────────────────────────────────┘
```

**Color Scheme:**
- Background: White (bg-white)
- Border: Blue (#e8eaf6)
- Shadow: Light (shadow-md)
- Button: Gradient blue-indigo (from-blue-500 to-indigo-600)

---

### Right Panel - Part3AudioManager

#### Header Section:
```
┌──────────────────────────────────────────────────┐
│  ⚡ Quản lý Audio Part 3                         │ ← Title
│                                                  │
│  Đã tạo: 8 / 13 nhóm          [Tạo tất cả]    │ ← Counter + Batch button
│          ^^^^^^^^^^^^           ^^^^^^^^^^^^^^
│          (green font)           (blue button)
└──────────────────────────────────────────────────┘
```

#### Group Item (No Audio):
```
┌──────────────────────────────────────────────────┐
│ Nhóm #1 - ID: 1                                  │
│ M: Hello there. W: Hi, how are you today?   │ ← Transcript preview
│                                                  │
│                      [⚡ Tạo Audio] (blue)      │ ← Action button
└──────────────────────────────────────────────────┘
```

#### Group Item (With Audio):
```
┌──────────────────────────────────────────────────┐
│ Nhóm #2 - ID: 2                                  │
│ M: Good morning. W: Good morning, sir.       │ ← Transcript preview
│                                                  │
│                  [▶️ Nghe]      [✓ Có]          │ ← Play + status
│                 (green)      (green text)
└──────────────────────────────────────────────────┘
```

#### Group Item (Loading):
```
┌──────────────────────────────────────────────────┐
│ Nhóm #3 - ID: 3                                  │
│ M: What are you doing?                      │
│                                                  │
│                 [⏳ Đang tạo...] (disabled)      │ ← Loading state
│                    (gray, spinner)
└──────────────────────────────────────────────────┘
```

---

## 💬 Message Displays

### Success Message:
```
┌──────────────────────────────────────────────────┐
│ ✅ Tạo audio thành công cho nhóm #1             │ ← Green background
│                                                  │ ← Auto-dismiss (3 sec)
└──────────────────────────────────────────────────┘
```

### Error Message:
```
┌──────────────────────────────────────────────────┐
│ ⚠️ Lỗi: Google TTS service unavailable          │ ← Red background
│    Vui lòng thử lại sau                         │
└──────────────────────────────────────────────────┘
```

### Empty State (No Test Selected):
```
┌──────────────────────────────────────────────────┐
│                                                  │
│                      ⚙️                          │
│                                                  │
│         Vui lòng chọn đề thi từ bên trái       │
│                                                  │
│      Sau đó bạn sẽ thấy danh sách các nhóm     │
│                  để tạo audio                   │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 🎬 User Interaction Flows

### Flow 1: Upload Excel

```
START
  ↓
Select Test from dropdown
  ↓
Choose Excel file (file input)
  ↓
Click "📤 Upload Excel"
  ↓
[API Call: POST /import/import-part3/{testId}]
  ↓
Is file valid?
  ├─ NO → Show error message (red) → Can retry
  ├─ YES → Show "⏳ Uploading..."
            ↓
            Save to database
            ↓
            Show "✅ Import thành công!"
            ↓
            Reload Part3AudioManager
            ↓
            Display groups list
            ↓
            END (ready for Step 2)
```

### Flow 2: Generate Single Audio

```
START
  ↓
See groups list with "⚡ Tạo Audio" buttons
  ↓
Click "⚡ Tạo Audio" for group #1
  ↓
Button state: → "⏳ Đang tạo..." (disabled)
  ↓
[API Call: POST /import/generate-audio/1]
  ↓
Backend:
  - Get transcript from DB
  - Call Google TTS (5-10 sec)
  - Upload to S3 (1-2 sec)
  - Update DB with S3 URL
  ↓
Is generation successful?
  ├─ NO → Show error (red)
  │       Button returns to "⚡ Tạo Audio"
  │       User can retry
  │
  ├─ YES → Update group state:
           - audioUrl: "https://s3..."
           - hasAudio: true
           ↓
           Button transforms:
           "⚡ Tạo Audio" → "▶️ Nghe" + "✓ Có"
           ↓
           Counter updates: "8 / 13" → "9 / 13"
           ↓
           Show success toast: "✅ Tạo audio thành công"
           ↓
           Toast auto-hides after 3 seconds
           ↓
           User can click "▶️ Nghe" to test audio
           ↓
           END
```

### Flow 3: Batch Generate All

```
START
  ↓
Click "🎯 Tạo tất cả (3)" button
  ↓
For each group without audio (3 groups):
  │
  ├─ Group #1:
  │   Button: "⏳ Đang tạo..." (disabled)
  │   Generate audio → Success
  │   Button: "▶️ Nghe" + Counter: "9 / 13"
  │   Wait 2 seconds
  │
  ├─ Group #3:
  │   Button: "⏳ Đang tạo..." (disabled)
  │   Generate audio → Success
  │   Button: "▶️ Nghe" + Counter: "10 / 13"
  │   Wait 2 seconds
  │
  └─ Group #7:
      Button: "⏳ Đang tạo..." (disabled)
      Generate audio → Success
      Button: "▶️ Nghe" + Counter: "11 / 13"
      Done
  ↓
Show: "✅ Hoàn thành 3 / 3 nhóm"
  ↓
END
```

---

## 🎨 Color Palette

```
Primary Colors:
  - Blue: #3b82f6 (buttons, active states)
  - Indigo: #4f46e5 (gradients)
  
Success:
  - Green: #10b981 (audio ready buttons, counter)
  - Light green: #d1fae5 (success message background)
  
Error:
  - Red: #ef4444 (error buttons)
  - Light red: #fee2e2 (error message background)
  
Neutral:
  - White: #ffffff (backgrounds)
  - Gray: #6b7280 (text)
  - Light gray: #f3f4f6 (borders)
  
Text:
  - Dark: #1f2937 (titles)
  - Medium: #4b5563 (labels)
  - Light: #9ca3af (hints)
```

---

## 📱 Responsive Behavior

```
Desktop (lg: 1024px and up):
  Layout: 2 columns (1fr : 2fr)
  Left:  Sticky, width 30%
  Right: Scrollable, width 70%

Tablet (md: 768px - 1023px):
  Layout: 2 columns (1fr : 1fr)
  Stack vertically on scroll

Mobile (sm: 640px - 767px):
  Layout: 1 column (full width)
  Upload section at top
  Groups list below
  Left panel becomes modal?
```

---

## ✨ Animation & Transitions

```
Button hover states:
  - Slight scale-up (transform scale-105)
  - Shadow increase (shadow-lg)
  - Color darken (hover:bg-blue-600)
  
Loading spinner:
  - animate-spin (Tailwind)
  - Lucide Loader icon
  
Message appearance:
  - Fade-in (opacity 0 → 1)
  - Auto-dismiss after 3 seconds
  
Button state changes:
  - Smooth color transition (200ms)
```

---

## 🎯 Accessibility

```
✅ Color not only indicator (+ icons + text)
✅ Loading state clearly indicated (spinner + text)
✅ Error messages descriptive and visible
✅ Buttons have clear labels
✅ Keyboard navigable (dropdown, buttons, inputs)
✅ Proper heading hierarchy (h1, h2, h3)
✅ ARIA labels on dynamic content
```

---

## 📸 Quick Visual Summary

| State | Visual | Action |
|-------|--------|--------|
| **No Test Selected** | Gray box with ⚙️ | Select from dropdown |
| **Groups Loaded** | List of groups | Click ⚡ buttons |
| **Generating** | ⏳ spinner button | Wait (disabled) |
| **Success** | ▶️ Nghe button | Play audio |
| **Error** | Red alert box | Click retry |

---

**UI Design Complete! Ready for Development Testing! 🎨**
