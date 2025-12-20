# 📊 ToeicMaster Database Specification

## Thông tin chung

- **Database**: SQL Server
- **Tổng số bảng**: 14 bảng
- **ORM**: Entity Framework Core

---

## 📐 Sơ đồ quan hệ (ERD)

```
Users ──┬── TestAttempts ──── UserAnswers ──── ReviewFeedbacks
        │         │
        │         └── Tests ── Parts ── QuestionGroups ── Questions ── Answers
        │                                                      │
        ├── Bookmarks ─────────────────────────────────────────┤
        │                                                      │
        ├── PracticeSessions ── PracticeAnswers ───────────────┤
        │                                                      │
        ├── UserVocabularies ── Vocabularies ──────────────────┘
        │
        └── Transactions

Questions ── Tags (Many-to-Many)
```

---

## 📋 Chi tiết các bảng

---

### 1. Users (Người dùng)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| FullName | NVARCHAR(255) | YES | | Họ tên |
| Email | NVARCHAR(255) | NO | | Email (Unique) |
| PasswordHash | NVARCHAR(MAX) | NO | | Mật khẩu đã hash (BCrypt) |
| AvatarUrl | NVARCHAR(500) | YES | | Đường dẫn ảnh đại diện |
| Balance | DECIMAL(18,2) | YES | 0 | Số dư tài khoản |
| IsPremium | BIT | YES | 0 | Tài khoản Premium |
| PremiumExpiredAt | DATETIME | YES | | Ngày hết hạn Premium |
| CreatedAt | DATETIME | YES | GETUTCDATE() | Ngày tạo |
| LastLoginAt | DATETIME | YES | | Lần đăng nhập cuối |
| Role | NVARCHAR(50) | YES | 'User' | Vai trò: User, Admin, Moderator |
| IsActive | BIT | NO | 1 | Trạng thái hoạt động |
| RefreshToken | NVARCHAR(500) | YES | | Token làm mới |
| RefreshTokenExpiryTime | DATETIME | YES | | Thời hạn RefreshToken |

**Indexes:**
- PRIMARY KEY (Id)
- UNIQUE (Email)

---

### 2. Tests (Đề thi)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| Title | NVARCHAR(255) | NO | | Tiêu đề đề thi |
| Slug | NVARCHAR(255) | YES | | URL slug |
| Type | NVARCHAR(50) | YES | | Loại: FULL_TEST, MINI_TEST |
| Duration | INT | YES | 120 | Thời gian làm bài (phút) |
| TotalQuestions | INT | YES | 200 | Tổng số câu hỏi |
| TotalParticipants | INT | YES | 0 | Số lượt thi |
| IsActive | BIT | YES | 1 | Trạng thái hiển thị |
| CreatedAt | DATETIME | YES | GETUTCDATE() | Ngày tạo |

**Indexes:**
- PRIMARY KEY (Id)
- INDEX (Slug)

---

### 3. Parts (Phần thi)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| TestId | INT | NO | | FK → Tests.Id |
| Name | NVARCHAR(100) | YES | | Tên Part |
| PartNumber | INT | YES | | Số thứ tự (1-7) |
| Description | NVARCHAR(500) | YES | | Mô tả |

**Indexes:**
- PRIMARY KEY (Id)
- FOREIGN KEY (TestId) REFERENCES Tests(Id) ON DELETE CASCADE

---

### 4. QuestionGroups (Nhóm câu hỏi)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| PartId | INT | NO | | FK → Parts.Id |
| TextContent | NVARCHAR(MAX) | YES | | Đoạn văn/bài đọc |
| AudioUrl | NVARCHAR(500) | YES | | Đường dẫn audio |
| ImageUrl | NVARCHAR(MAX) | YES | | Đường dẫn hình ảnh |
| Transcript | NVARCHAR(MAX) | YES | | Nội dung audio (transcript) |

**Indexes:**
- PRIMARY KEY (Id)
- FOREIGN KEY (PartId) REFERENCES Parts(Id) ON DELETE CASCADE

---

### 5. Questions (Câu hỏi)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| GroupId | INT | NO | | FK → QuestionGroups.Id |
| QuestionNo | INT | NO | | Số thứ tự câu hỏi (1-200) |
| Content | NVARCHAR(MAX) | YES | | Nội dung câu hỏi |
| QuestionType | NVARCHAR(20) | YES | 'MCQ' | Loại: MCQ, FILL_BLANK |
| CorrectOption | NVARCHAR(MAX) | YES | | Đáp án đúng (A, B, C, D) |
| ScoreWeight | DECIMAL(5,2) | YES | 5 | Điểm số |
| ShortExplanation | NVARCHAR(MAX) | YES | | Giải thích ngắn |
| FullExplanation | NVARCHAR(MAX) | YES | | Giải thích chi tiết |
| AudioUrl | NVARCHAR(500) | YES | | Audio riêng của câu hỏi |
| Transcript | NVARCHAR(MAX) | YES | | Lời thoại |

**Indexes:**
- PRIMARY KEY (Id)
- FOREIGN KEY (GroupId) REFERENCES QuestionGroups(Id) ON DELETE CASCADE
- INDEX (QuestionNo)

---

### 6. Answers (Đáp án)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| QuestionId | INT | NO | | FK → Questions.Id |
| Label | NVARCHAR(5) | YES | | Nhãn: A, B, C, D |
| Content | NVARCHAR(MAX) | YES | | Nội dung đáp án |

**Indexes:**
- PRIMARY KEY (Id)
- FOREIGN KEY (QuestionId) REFERENCES Questions(Id) ON DELETE CASCADE

---

### 7. TestAttempts (Lượt thi)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| UserId | INT | NO | | FK → Users.Id |
| TestId | INT | NO | | FK → Tests.Id |
| StartedAt | DATETIME | NO | | Thời gian bắt đầu |
| CompletedAt | DATETIME | NO | | Thời gian kết thúc |
| TotalScore | INT | NO | 0 | Tổng điểm (số câu đúng) |
| ListeningScore | INT | YES | | Điểm Listening |
| ReadingScore | INT | YES | | Điểm Reading |
| Status | NVARCHAR(20) | YES | 'COMPLETED' | Trạng thái |

**Indexes:**
- PRIMARY KEY (Id)
- FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
- FOREIGN KEY (TestId) REFERENCES Tests(Id) ON DELETE CASCADE
- INDEX (UserId, CompletedAt)

---

### 8. UserAnswers (Câu trả lời của user)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| AttemptId | INT | NO | | FK → TestAttempts.Id |
| QuestionId | INT | NO | | FK → Questions.Id |
| SelectedOption | NVARCHAR(5) | NO | | Đáp án đã chọn |
| IsCorrect | BIT | NO | 0 | Đúng/Sai |
| TextResponse | NVARCHAR(MAX) | YES | | Câu trả lời text (future) |
| AudioResponseUrl | NVARCHAR(500) | YES | | Audio trả lời (future) |

**Indexes:**
- PRIMARY KEY (Id)
- FOREIGN KEY (AttemptId) REFERENCES TestAttempts(Id) ON DELETE CASCADE
- FOREIGN KEY (QuestionId) REFERENCES Questions(Id)
- UNIQUE (AttemptId, QuestionId)

---

### 9. ReviewFeedbacks (Đánh giá AI)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| UserAnswerId | INT | NO | | FK → UserAnswers.Id |
| Score | DECIMAL(5,2) | YES | | Điểm đánh giá |
| FeedbackJson | NVARCHAR(MAX) | YES | | Phản hồi chi tiết (JSON) |
| EvaluatedAt | DATETIME | YES | | Thời gian đánh giá |

**Indexes:**
- PRIMARY KEY (Id)
- FOREIGN KEY (UserAnswerId) REFERENCES UserAnswers(Id) ON DELETE CASCADE

---

### 10. Bookmarks (Đánh dấu câu hỏi)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| UserId | INT | NO | | FK → Users.Id |
| QuestionId | INT | NO | | FK → Questions.Id |
| Note | NVARCHAR(500) | YES | | Ghi chú |
| CreatedAt | DATETIME | NO | GETUTCDATE() | Ngày tạo |

**Indexes:**
- PRIMARY KEY (Id)
- FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
- FOREIGN KEY (QuestionId) REFERENCES Questions(Id)
- UNIQUE (UserId, QuestionId)

---

### 11. Vocabularies (Từ vựng)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| Word | NVARCHAR(100) | NO | | Từ vựng |
| Pronunciation | NVARCHAR(100) | YES | | Phiên âm |
| PartOfSpeech | NVARCHAR(20) | YES | | Từ loại: noun, verb, adj... |
| Meaning | NVARCHAR(500) | NO | | Nghĩa tiếng Việt |
| Example | NVARCHAR(500) | YES | | Câu ví dụ |
| ExampleTranslation | NVARCHAR(500) | YES | | Dịch câu ví dụ |
| AudioUrl | NVARCHAR(500) | YES | | Đường dẫn audio phát âm |
| ImageUrl | NVARCHAR(500) | YES | | Hình ảnh minh họa |
| QuestionId | INT | YES | | FK → Questions.Id (nếu trích từ câu hỏi) |
| Category | NVARCHAR(50) | YES | | Danh mục: business, travel... |
| Difficulty | INT | NO | 1 | Độ khó (1-5) |
| CreatedAt | DATETIME | NO | GETUTCDATE() | Ngày tạo |

**Indexes:**
- PRIMARY KEY (Id)
- FOREIGN KEY (QuestionId) REFERENCES Questions(Id)
- INDEX (Word)
- INDEX (Category)

---

### 12. UserVocabularies (Tiến độ học từ vựng)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| UserId | INT | NO | | FK → Users.Id |
| VocabularyId | INT | NO | | FK → Vocabularies.Id |
| Status | INT | NO | 0 | 0=New, 1=Learning, 2=Review, 3=Mastered |
| CorrectStreak | INT | NO | 0 | Số lần đúng liên tiếp |
| ReviewCount | INT | NO | 0 | Tổng số lần ôn tập |
| NextReviewAt | DATETIME | YES | | Ngày ôn tập tiếp theo |
| LastReviewedAt | DATETIME | YES | | Lần ôn tập cuối |
| CreatedAt | DATETIME | NO | GETUTCDATE() | Ngày bắt đầu học |

**Indexes:**
- PRIMARY KEY (Id)
- FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
- FOREIGN KEY (VocabularyId) REFERENCES Vocabularies(Id) ON DELETE CASCADE
- UNIQUE (UserId, VocabularyId)
- INDEX (NextReviewAt)

---

### 13. PracticeSessions (Phiên luyện tập)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| UserId | INT | NO | | FK → Users.Id |
| PartNumber | INT | NO | | Part luyện tập (1-7) |
| TotalQuestions | INT | NO | 0 | Tổng số câu hỏi |
| CorrectAnswers | INT | NO | 0 | Số câu đúng |
| TimeSpentSeconds | INT | NO | 0 | Thời gian làm (giây) |
| StartedAt | DATETIME | NO | GETUTCDATE() | Thời gian bắt đầu |
| CompletedAt | DATETIME | YES | | Thời gian kết thúc |
| Status | NVARCHAR(20) | NO | 'in_progress' | in_progress, completed, abandoned |

**Indexes:**
- PRIMARY KEY (Id)
- FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
- INDEX (UserId, CompletedAt)

---

### 14. PracticeAnswers (Câu trả lời luyện tập)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| SessionId | INT | NO | | FK → PracticeSessions.Id |
| QuestionId | INT | NO | | FK → Questions.Id |
| SelectedOption | NVARCHAR(5) | YES | | Đáp án đã chọn |
| IsCorrect | BIT | NO | 0 | Đúng/Sai |
| AnsweredAt | DATETIME | NO | GETUTCDATE() | Thời gian trả lời |

**Indexes:**
- PRIMARY KEY (Id)
- FOREIGN KEY (SessionId) REFERENCES PracticeSessions(Id) ON DELETE CASCADE
- FOREIGN KEY (QuestionId) REFERENCES Questions(Id)

---

### 15. Tags (Nhãn)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| Name | NVARCHAR(50) | YES | | Tên tag |

**Indexes:**
- PRIMARY KEY (Id)
- UNIQUE (Name)

---

### 16. QuestionTags (Bảng trung gian Many-to-Many)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| QuestionId | INT | NO | | FK → Questions.Id |
| TagId | INT | NO | | FK → Tags.Id |

**Indexes:**
- PRIMARY KEY (QuestionId, TagId)
- FOREIGN KEY (QuestionId) REFERENCES Questions(Id) ON DELETE CASCADE
- FOREIGN KEY (TagId) REFERENCES Tags(Id) ON DELETE CASCADE

---

### 17. Transactions (Giao dịch)

| Cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|-----|--------------|------|----------|-------|
| **Id** | INT | NO | IDENTITY | Khóa chính |
| UserId | INT | NO | | FK → Users.Id |
| Amount | DECIMAL(18,2) | NO | | Số tiền |
| Content | NVARCHAR(500) | YES | | Nội dung giao dịch |
| Status | NVARCHAR(20) | YES | | pending, completed, failed |
| PaymentGateway | NVARCHAR(50) | YES | | Cổng thanh toán: VNPay, Momo... |
| CreatedAt | DATETIME | YES | GETUTCDATE() | Thời gian tạo |

**Indexes:**
- PRIMARY KEY (Id)
- FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE

---

## 🔗 Quan hệ giữa các bảng

| Bảng cha | Bảng con | Quan hệ | Mô tả |
|----------|----------|---------|-------|
| Users | TestAttempts | 1:N | Mỗi user có nhiều lượt thi |
| Users | Bookmarks | 1:N | Mỗi user có nhiều bookmark |
| Users | UserVocabularies | 1:N | Mỗi user học nhiều từ |
| Users | PracticeSessions | 1:N | Mỗi user có nhiều phiên luyện tập |
| Users | Transactions | 1:N | Mỗi user có nhiều giao dịch |
| Tests | Parts | 1:N | Mỗi đề thi có 7 Parts |
| Tests | TestAttempts | 1:N | Mỗi đề thi có nhiều lượt thi |
| Parts | QuestionGroups | 1:N | Mỗi Part có nhiều nhóm câu hỏi |
| QuestionGroups | Questions | 1:N | Mỗi nhóm có nhiều câu hỏi |
| Questions | Answers | 1:N | Mỗi câu hỏi có 4 đáp án |
| Questions | Bookmarks | 1:N | Mỗi câu hỏi có thể được bookmark bởi nhiều user |
| Questions | Tags | N:N | Mỗi câu hỏi có nhiều tag |
| TestAttempts | UserAnswers | 1:N | Mỗi lượt thi có nhiều câu trả lời |
| UserAnswers | ReviewFeedbacks | 1:1 | Mỗi câu trả lời có 1 feedback AI |
| Vocabularies | UserVocabularies | 1:N | Mỗi từ được học bởi nhiều user |
| PracticeSessions | PracticeAnswers | 1:N | Mỗi phiên có nhiều câu trả lời |

---

## 📜 Script tạo Database

```sql
-- =============================================
-- TOEICMASTER DATABASE CREATION SCRIPT
-- =============================================

-- Tạo Database
CREATE DATABASE ToeicMaster;
GO
USE ToeicMaster;
GO

-- 1. Users
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(255) NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    AvatarUrl NVARCHAR(500) NULL,
    Balance DECIMAL(18,2) DEFAULT 0,
    IsPremium BIT DEFAULT 0,
    PremiumExpiredAt DATETIME NULL,
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    LastLoginAt DATETIME NULL,
    Role NVARCHAR(50) DEFAULT 'User',
    IsActive BIT DEFAULT 1,
    RefreshToken NVARCHAR(500) NULL,
    RefreshTokenExpiryTime DATETIME NULL
);

-- 2. Tests
CREATE TABLE Tests (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Slug NVARCHAR(255) NULL,
    Type NVARCHAR(50) NULL,
    Duration INT DEFAULT 120,
    TotalQuestions INT DEFAULT 200,
    TotalParticipants INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);

-- 3. Parts
CREATE TABLE Parts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TestId INT NOT NULL FOREIGN KEY REFERENCES Tests(Id) ON DELETE CASCADE,
    Name NVARCHAR(100) NULL,
    PartNumber INT NULL,
    Description NVARCHAR(500) NULL
);

-- 4. QuestionGroups
CREATE TABLE QuestionGroups (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PartId INT NOT NULL FOREIGN KEY REFERENCES Parts(Id) ON DELETE CASCADE,
    TextContent NVARCHAR(MAX) NULL,
    AudioUrl NVARCHAR(500) NULL,
    ImageUrl NVARCHAR(MAX) NULL,
    Transcript NVARCHAR(MAX) NULL
);

-- 5. Questions
CREATE TABLE Questions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    GroupId INT NOT NULL FOREIGN KEY REFERENCES QuestionGroups(Id) ON DELETE CASCADE,
    QuestionNo INT NOT NULL,
    Content NVARCHAR(MAX) NULL,
    QuestionType NVARCHAR(20) DEFAULT 'MCQ',
    CorrectOption NVARCHAR(MAX) NULL,
    ScoreWeight DECIMAL(5,2) DEFAULT 5,
    ShortExplanation NVARCHAR(MAX) NULL,
    FullExplanation NVARCHAR(MAX) NULL,
    AudioUrl NVARCHAR(500) NULL,
    Transcript NVARCHAR(MAX) NULL
);

-- 6. Answers
CREATE TABLE Answers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    QuestionId INT NOT NULL FOREIGN KEY REFERENCES Questions(Id) ON DELETE CASCADE,
    Label NVARCHAR(5) NULL,
    Content NVARCHAR(MAX) NULL
);

-- 7. TestAttempts
CREATE TABLE TestAttempts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE,
    TestId INT NOT NULL FOREIGN KEY REFERENCES Tests(Id),
    StartedAt DATETIME NOT NULL,
    CompletedAt DATETIME NOT NULL,
    TotalScore INT DEFAULT 0,
    ListeningScore INT NULL,
    ReadingScore INT NULL,
    Status NVARCHAR(20) DEFAULT 'COMPLETED'
);

-- 8. UserAnswers
CREATE TABLE UserAnswers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AttemptId INT NOT NULL FOREIGN KEY REFERENCES TestAttempts(Id) ON DELETE CASCADE,
    QuestionId INT NOT NULL FOREIGN KEY REFERENCES Questions(Id),
    SelectedOption NVARCHAR(5) NOT NULL,
    IsCorrect BIT DEFAULT 0,
    TextResponse NVARCHAR(MAX) NULL,
    AudioResponseUrl NVARCHAR(500) NULL,
    UNIQUE(AttemptId, QuestionId)
);

-- 9. ReviewFeedbacks
CREATE TABLE ReviewFeedbacks (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserAnswerId INT NOT NULL FOREIGN KEY REFERENCES UserAnswers(Id) ON DELETE CASCADE,
    Score DECIMAL(5,2) NULL,
    FeedbackJson NVARCHAR(MAX) NULL,
    EvaluatedAt DATETIME NULL
);

-- 10. Tags
CREATE TABLE Tags (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NULL UNIQUE
);

-- 11. QuestionTags (Many-to-Many)
CREATE TABLE QuestionTags (
    QuestionId INT NOT NULL FOREIGN KEY REFERENCES Questions(Id) ON DELETE CASCADE,
    TagId INT NOT NULL FOREIGN KEY REFERENCES Tags(Id) ON DELETE CASCADE,
    PRIMARY KEY (QuestionId, TagId)
);

-- 12. Bookmarks
CREATE TABLE Bookmarks (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE,
    QuestionId INT NOT NULL FOREIGN KEY REFERENCES Questions(Id),
    Note NVARCHAR(500) NULL,
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    UNIQUE(UserId, QuestionId)
);

-- 13. Vocabularies
CREATE TABLE Vocabularies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Word NVARCHAR(100) NOT NULL,
    Pronunciation NVARCHAR(100) NULL,
    PartOfSpeech NVARCHAR(20) NULL,
    Meaning NVARCHAR(500) NOT NULL,
    Example NVARCHAR(500) NULL,
    ExampleTranslation NVARCHAR(500) NULL,
    AudioUrl NVARCHAR(500) NULL,
    ImageUrl NVARCHAR(500) NULL,
    QuestionId INT NULL FOREIGN KEY REFERENCES Questions(Id),
    Category NVARCHAR(50) NULL,
    Difficulty INT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);

-- 14. UserVocabularies
CREATE TABLE UserVocabularies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE,
    VocabularyId INT NOT NULL FOREIGN KEY REFERENCES Vocabularies(Id) ON DELETE CASCADE,
    Status INT DEFAULT 0,
    CorrectStreak INT DEFAULT 0,
    ReviewCount INT DEFAULT 0,
    NextReviewAt DATETIME NULL,
    LastReviewedAt DATETIME NULL,
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    UNIQUE(UserId, VocabularyId)
);

-- 15. PracticeSessions
CREATE TABLE PracticeSessions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE,
    PartNumber INT NOT NULL,
    TotalQuestions INT DEFAULT 0,
    CorrectAnswers INT DEFAULT 0,
    TimeSpentSeconds INT DEFAULT 0,
    StartedAt DATETIME DEFAULT GETUTCDATE(),
    CompletedAt DATETIME NULL,
    Status NVARCHAR(20) DEFAULT 'in_progress'
);

-- 16. PracticeAnswers
CREATE TABLE PracticeAnswers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SessionId INT NOT NULL FOREIGN KEY REFERENCES PracticeSessions(Id) ON DELETE CASCADE,
    QuestionId INT NOT NULL FOREIGN KEY REFERENCES Questions(Id),
    SelectedOption NVARCHAR(5) NULL,
    IsCorrect BIT DEFAULT 0,
    AnsweredAt DATETIME DEFAULT GETUTCDATE()
);

-- 17. Transactions
CREATE TABLE Transactions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE,
    Amount DECIMAL(18,2) NOT NULL,
    Content NVARCHAR(500) NULL,
    Status NVARCHAR(20) NULL,
    PaymentGateway NVARCHAR(50) NULL,
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Tests_Slug ON Tests(Slug);
CREATE INDEX IX_Questions_QuestionNo ON Questions(QuestionNo);
CREATE INDEX IX_TestAttempts_UserId ON TestAttempts(UserId, CompletedAt DESC);
CREATE INDEX IX_UserVocabularies_NextReview ON UserVocabularies(NextReviewAt);
CREATE INDEX IX_PracticeSessions_UserId ON PracticeSessions(UserId, CompletedAt DESC);
CREATE INDEX IX_Vocabularies_Word ON Vocabularies(Word);
CREATE INDEX IX_Vocabularies_Category ON Vocabularies(Category);

GO
```

---

## 📊 Thống kê ước tính

| Bảng | Dự kiến số bản ghi | Kích thước/bản ghi |
|------|-------------------|-------------------|
| Users | 10,000+ | ~1 KB |
| Tests | 50-100 | ~500 B |
| Parts | 350-700 | ~200 B |
| QuestionGroups | 5,000+ | ~5 KB |
| Questions | 20,000+ | ~2 KB |
| Answers | 80,000+ | ~500 B |
| TestAttempts | 100,000+ | ~200 B |
| UserAnswers | 20,000,000+ | ~100 B |
| Vocabularies | 5,000+ | ~1 KB |

---

*Generated on: December 20, 2024*
