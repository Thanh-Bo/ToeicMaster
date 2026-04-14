# 📋 SETUP HƯỚNG DẪN - FEEDBACK FEATURE

Tính năng Feedback đã được tạo hoàn chỉnh. Dưới đây là hướng dẫn setup:

---

## ✅ CHECKLIST SETUP

### **Backend Setup**

- [x] Entity `UserFeedback.cs` được tạo
- [x] Models `FeedbackModels.cs` được tạo (CreateFeedbackRequest, FeedbackResponse, etc.)
- [x] Service `FeedbackService.cs` được tạo
- [x] Controller `FeedbackController.cs` được tạo
- [x] DbContext được cập nhật với `UserFeedbacks` DbSet
- [x] EntityFramework configuration được thêm vào `OnModelCreating`
- [x] DI Service được đăng ký trong `Program.cs`
- [ ] **TODO**: Chạy migration hoặc SQL script

### **Frontend Setup**

- [x] `feedbackService.ts` được tạo
- [x] `FeedbackWidget.tsx` (floating button) được tạo
- [x] `FeedbackModal.tsx` được tạo
- [x] `FeedbackForm.tsx` được tạo
- [x] `FeedbackSection.tsx` được tạo (cho Footer)
- [x] `FeedbackList.tsx` được tạo (display feedbacks)
- [x] `AdminFeedbackPanel.tsx` được tạo (admin dashboard)
- [x] Feedback button thêm vào `PageHeader.tsx`
- [x] Feedback section thêm vào `Footer.tsx`
- [x] `/feedback` page được tạo
- [x] `/admin/feedback` page được tạo

---

## 🚀 CÁC BƯỚC TRIỂN KHAI

### **Step 1: Backend Database Migration**

Chọn **1 trong 2 cách**:

#### **Cách 1: Chạy SQL Script trực tiếp** (Nếu không muốn dùng EF Migration)
```bash
# Mở SQL Server Management Studio (SSMS)
# Chạy file: ToeicMaster.API/migration_add_userfeedback.sql
```

#### **Cách 2: Dùng Entity Framework Migration**
```bash
# Trong folder ToeicMaster.API:
cd d:\ToeicMaster\ToeicMaster.API

# Tạo migration
dotnet ef migrations add AddUserFeedbackTable

# Apply migration vào database
dotnet ef database update
```

### **Step 2: Backend Build & Test**

```bash
# Kiểm tra build
cd d:\ToeicMaster\ToeicMaster.API
dotnet build

# Chạy API
dotnet run
```

### **Step 3: Frontend**

Không cần setup gì thêm, các component đã được tạo sẵn.

```bash
# Vào folder frontend
cd d:\ToeicMaster\toeic-web

# Chạy dev server
npm run dev
```

---

## 📍 VỊ TRÍ HIỂN THỊ FEEDBACK

### **1. Floating Button (Góc phải dưới)**
- Component: `FeedbackWidget.tsx`
- Tự động hiển thị trên tất cả pages
- Import vào `layout.tsx` hoặc `page.tsx` để kích hoạt

### **2. PageHeader (Icon trong header)**
- ✅ Đã thêm: `PageHeader.tsx` - MessageCircle icon
- Click để mở FeedbackModal

### **3. Footer (Link "Gửi ý kiến")**
- ✅ Đã thêm: `Footer.tsx` - FeedbackSection component
- Hiển thị trong footer links

### **4. Riêng Page (/feedback)**
- ✅ Tạo: `/app/feedback/page.tsx`
- Hiển thị form + danh sách feedbacks
- Accessible via: `http://localhost:3000/feedback`

### **5. Admin Panel (/admin/feedback)**
- ✅ Tạo: `/app/admin/feedback/page.tsx`
- Chỉ dành cho admin
- Quản lý, phản hồi, xóa feedback
- Accessible via: `http://localhost:3000/admin/feedback`

---

## 🔌 API ENDPOINTS

```
POST   /api/feedback/create          - Tạo feedback mới
GET    /api/feedback/list            - Lấy danh sách (Admin only)
GET    /api/feedback/{id}            - Chi tiết feedback (Admin only)
PUT    /api/feedback/update/{id}     - Cập nhật status + response (Admin only)
DELETE /api/feedback/delete/{id}     - Xóa feedback (Admin only)
```

---

## 🎯 CÁC TÍNH NĂNG

### **User Features**
- ✅ Gửi feedback (bug, feature, ui_ux, other)
- ✅ Nhập tiêu đề, nội dung, email
- ✅ Xem trạng thái feedback của mình
- ✅ Floating button luôn sẵn sàng
- ✅ Form validation

### **Admin Features**
- ✅ Xem tất cả feedbacks
- ✅ Filter by status (pending, reviewing, resolved, rejected)
- ✅ Update status + send response
- ✅ Priority levels (low, medium, high)
- ✅ Xóa feedback
- ✅ View detailed info

---

## 📁 FILE STRUCTURE

```
Backend:
ToeicMaster.API/
├─ Entities/UserFeedback.cs
├─ Models/FeedbackModels.cs
├─ Services/FeedbackService.cs
├─ Controllers/FeedbackController.cs
└─ migration_add_userfeedback.sql

Frontend:
toeic-web/app/
├─ services/feedbackService.ts
├─ components/feedback/
│  ├─ FeedbackWidget.tsx
│  ├─ FeedbackModal.tsx
│  ├─ FeedbackForm.tsx
│  ├─ FeedbackSection.tsx
│  ├─ FeedbackList.tsx
│  ├─ AdminFeedbackPanel.tsx
│  └─ index.ts
├─ feedback/page.tsx
└─ admin/feedback/page.tsx
```

---

## 🌐 ENABLE FLOATING WIDGET

Để floating button luôn hiển thị, thêm vào `layout.tsx`:

```tsx
import { FeedbackWidget } from "./components/feedback";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <FeedbackWidget />
      </body>
    </html>
  );
}
```

---

## 🧪 TESTING

### **1. Test Floating Button**
- Mở website
- Nhìn góc phải dưới có button 💬 không?
- Click để mở form

### **2. Test PageHeader Button**
- Header có icon 💬 không?
- Click để mở form

### **3. Test Footer Link**
- Scroll xuống footer
- Có link "Gửi ý kiến" không?
- Click để mở form

### **4. Test Feedback Form**
- Chọn loại feedback
- Nhập tiêu đề + nội dung
- Click "Gửi Feedback"
- Kiểm tra response success

### **5. Test /feedback Page**
- Vào: `http://localhost:3000/feedback`
- Gửi multiple feedbacks
- Kiểm tra list hiển thị

### **6. Test Admin Panel**
- Login as admin
- Vào: `http://localhost:3000/admin/feedback`
- Xem danh sách feedbacks
- Update status + add response
- Test delete

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### **Issue 1: "FeedbackModal is not defined"**
- Giải pháp: Kiểm tra dynamic import path
- Đảm bảo `FeedbackModal.tsx` tồn tại

### **Issue 2: "API 404 Not Found"**
- Kiểm tra `FeedbackController.cs` route: `[Route("api/[controller]")]`
- Đảm bảo service được register: `builder.Services.AddScoped<IFeedbackService, FeedbackService>()`

### **Issue 3: "Table 'UserFeedbacks' does not exist"**
- Chạy migration: `dotnet ef database update`
- Hoặc chạy SQL script: `migration_add_userfeedback.sql`

### **Issue 4: "Token unauthorized"**
- Kiểm tra localStorage có token không
- Vào `/login` để lấy token

### **Issue 5: "Admin access denied"**
- User role phải là "admin"
- Kiểm tra database: `SELECT * FROM Users WHERE Id = YOUR_ID`

---

## 📞 SUPPORT

Nếu có vấn đề, kiểm tra:
1. Console errors (Frontend)
2. API logs (Backend)
3. Database record: `SELECT * FROM UserFeedbacks`

---

✅ **Tất cả setup hoàn thành!**
