-- =============================================
-- TOEICMASTER DATABASE - FULL SQL SCRIPT
-- Created: December 20, 2024
-- Database: SQL Server
-- =============================================

-- Tạo Database (Chạy riêng nếu cần)
-- CREATE DATABASE ToeicMasterDb;
-- GO
-- USE ToeicMasterDb;
-- GO

-- =============================================
-- 1. MODULE USER & AUTH
-- =============================================

-- Bảng Users: Lưu thông tin người dùng
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100),
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,         -- Lưu chuỗi hash (BCrypt)
    AvatarUrl VARCHAR(500),
    Balance DECIMAL(18, 2) DEFAULT 0,           -- Số dư tài khoản
    IsPremium BIT DEFAULT 0,                    -- 0: Free, 1: VIP
    PremiumExpiredAt DATETIME2,                 -- Ngày hết hạn VIP
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    LastLoginAt DATETIME2,
    Role NVARCHAR(50) DEFAULT 'User',           -- 'User', 'Admin', 'Moderator'
    IsActive BIT DEFAULT 1,                     -- Trạng thái tài khoản
    RefreshToken NVARCHAR(500) NULL,            -- JWT Refresh Token
    RefreshTokenExpiryTime DATETIME2 NULL       -- Thời hạn Refresh Token
);

-- Bảng Transactions: Lịch sử giao dịch nạp tiền
CREATE TABLE Transactions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Amount DECIMAL(18, 2) NOT NULL,
    Content NVARCHAR(255),                      -- Nội dung CK: "USER123 MUA VIP"
    Status VARCHAR(20),                         -- 'PENDING', 'SUCCESS', 'FAILED'
    PaymentGateway VARCHAR(50),                 -- 'VNPAY', 'MOMO', 'SEPAY'
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Transactions_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- =============================================
-- 2. MODULE CONTENT (ĐỀ THI)
-- =============================================

-- Bảng Tests: Thông tin đề thi
CREATE TABLE Tests (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,               -- VD: ETS 2024 Test 1
    Slug VARCHAR(200),                          -- VD: ets-2024-test-1 (cho SEO URL)
    Type VARCHAR(20),                           -- 'FULL_TEST', 'MINI_TEST', 'PRACTICE'
    Duration INT DEFAULT 120,                   -- Thời gian làm bài (phút)
    TotalQuestions INT DEFAULT 200,
    TotalParticipants INT DEFAULT 0,            -- Số người đã làm (để sort)
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Bảng Parts: 7 Part của TOEIC
CREATE TABLE Parts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TestId INT NOT NULL,
    Name NVARCHAR(100),                         -- 'Part 1: Photographs', 'Part 5: Incomplete Sentences'
    PartNumber INT,                             -- 1, 2, ... 7
    Description NVARCHAR(500),                  -- Hướng dẫn làm bài
    CONSTRAINT FK_Parts_Tests FOREIGN KEY (TestId) REFERENCES Tests(Id) ON DELETE CASCADE
);

-- Bảng QuestionGroups: Nhóm câu hỏi (đoạn văn/audio chung cho Part 3,4,6,7)
CREATE TABLE QuestionGroups (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PartId INT NOT NULL,
    TextContent NVARCHAR(MAX),                  -- Bài đọc (Reading Passage)
    AudioUrl VARCHAR(500),                      -- Link file nghe (Cloudinary/Local)
    ImageUrl NVARCHAR(MAX),                     -- Link ảnh (Part 1)
    Transcript NVARCHAR(MAX),                   -- Lời thoại (để hiện khi xem đáp án)
    CONSTRAINT FK_QuestionGroups_Parts FOREIGN KEY (PartId) REFERENCES Parts(Id) ON DELETE CASCADE
);

-- Bảng Questions: Câu hỏi chi tiết
CREATE TABLE Questions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    GroupId INT NOT NULL,
    QuestionNo INT NOT NULL,                    -- Số thứ tự câu (1-200)
    Content NVARCHAR(MAX),                      -- Nội dung câu hỏi
    QuestionType VARCHAR(20) DEFAULT 'MCQ',     -- 'MCQ', 'WRITING', 'SPEAKING'
    CorrectOption NVARCHAR(MAX),                -- 'A', 'B', 'C', 'D'
    ScoreWeight DECIMAL(5, 2) DEFAULT 5.0,      -- Điểm số của câu này
    ShortExplanation NVARCHAR(MAX),             -- Giải thích ngắn gọn
    FullExplanation NVARCHAR(MAX),              -- Giải thích chi tiết (AI generated)
    AudioUrl NVARCHAR(500),                     -- Audio riêng của câu hỏi
    Transcript NVARCHAR(MAX),                   -- Lời thoại riêng
    CONSTRAINT FK_Questions_QuestionGroups FOREIGN KEY (GroupId) REFERENCES QuestionGroups(Id) ON DELETE CASCADE
);

-- Bảng Answers: Đáp án A, B, C, D
CREATE TABLE Answers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    QuestionId INT NOT NULL,
    Label VARCHAR(5),                           -- 'A', 'B', 'C', 'D'
    Content NVARCHAR(MAX),                      -- Nội dung đáp án
    CONSTRAINT FK_Answers_Questions FOREIGN KEY (QuestionId) REFERENCES Questions(Id) ON DELETE CASCADE
);

-- Bảng Tags: Nhãn phân loại câu hỏi
CREATE TABLE Tags (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) UNIQUE                    -- 'Grammar', 'Vocabulary', 'Tenses'
);

-- Bảng QuestionTags: Liên kết Many-to-Many giữa Questions và Tags
CREATE TABLE QuestionTags (
    QuestionId INT NOT NULL,
    TagId INT NOT NULL,
    PRIMARY KEY (QuestionId, TagId),
    CONSTRAINT FK_QuestionTags_Questions FOREIGN KEY (QuestionId) REFERENCES Questions(Id) ON DELETE CASCADE,
    CONSTRAINT FK_QuestionTags_Tags FOREIGN KEY (TagId) REFERENCES Tags(Id) ON DELETE CASCADE
);

-- =============================================
-- 3. MODULE EXAM (LÀM BÀI THI)
-- =============================================

-- Bảng TestAttempts: Lượt làm bài của User
CREATE TABLE TestAttempts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    TestId INT NOT NULL,
    StartedAt DATETIME2 DEFAULT GETDATE(),
    CompletedAt DATETIME2 NOT NULL,
    TotalScore INT DEFAULT 0,                   -- Số câu đúng
    ListeningScore INT,                         -- Điểm Listening (5-495)
    ReadingScore INT,                           -- Điểm Reading (5-495)
    Status VARCHAR(20) DEFAULT 'COMPLETED',     -- 'IN_PROGRESS', 'COMPLETED'
    CONSTRAINT FK_TestAttempts_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_TestAttempts_Tests FOREIGN KEY (TestId) REFERENCES Tests(Id)
);

-- Bảng UserAnswers: Chi tiết câu trả lời của user
CREATE TABLE UserAnswers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AttemptId INT NOT NULL,
    QuestionId INT NOT NULL,
    SelectedOption VARCHAR(5) NOT NULL,         -- User chọn A/B/C/D
    IsCorrect BIT DEFAULT 0,                    -- True/False
    TextResponse NVARCHAR(MAX),                 -- Bài viết essay (future)
    AudioResponseUrl VARCHAR(500),              -- Link file ghi âm (future)
    CONSTRAINT FK_UserAnswers_TestAttempts FOREIGN KEY (AttemptId) REFERENCES TestAttempts(Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserAnswers_Questions FOREIGN KEY (QuestionId) REFERENCES Questions(Id),
    CONSTRAINT UQ_UserAnswers_AttemptQuestion UNIQUE (AttemptId, QuestionId)
);

-- Bảng ReviewFeedbacks: Kết quả chấm Writing/Speaking từ AI
CREATE TABLE ReviewFeedbacks (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserAnswerId INT UNIQUE NOT NULL,           -- Link 1-1 với câu trả lời
    Score DECIMAL(4, 1),                        -- Điểm AI chấm (VD: 6.5)
    FeedbackJson NVARCHAR(MAX),                 -- JSON chi tiết lỗi sai
    EvaluatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_ReviewFeedbacks_UserAnswers FOREIGN KEY (UserAnswerId) REFERENCES UserAnswers(Id) ON DELETE CASCADE
);

-- =============================================
-- 4. MODULE PRACTICE (LUYỆN TẬP)
-- =============================================

-- Bảng PracticeSessions: Phiên luyện tập (không tính điểm chính thức)
CREATE TABLE PracticeSessions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    PartNumber INT NOT NULL,                    -- Part luyện tập (1-7)
    TotalQuestions INT DEFAULT 0,
    CorrectAnswers INT DEFAULT 0,
    TimeSpentSeconds INT DEFAULT 0,             -- Thời gian làm (giây)
    StartedAt DATETIME2 DEFAULT GETDATE(),
    CompletedAt DATETIME2,
    Status NVARCHAR(20) DEFAULT 'in_progress',  -- 'in_progress', 'completed', 'abandoned'
    CONSTRAINT FK_PracticeSessions_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Bảng PracticeAnswers: Câu trả lời trong phiên luyện tập
CREATE TABLE PracticeAnswers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SessionId INT NOT NULL,
    QuestionId INT NOT NULL,
    SelectedOption NVARCHAR(5),
    IsCorrect BIT DEFAULT 0,
    AnsweredAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_PracticeAnswers_PracticeSessions FOREIGN KEY (SessionId) REFERENCES PracticeSessions(Id) ON DELETE CASCADE,
    CONSTRAINT FK_PracticeAnswers_Questions FOREIGN KEY (QuestionId) REFERENCES Questions(Id)
);

-- =============================================
-- 5. MODULE BOOKMARK (ĐÁNH DẤU CÂU HỎI)
-- =============================================

CREATE TABLE Bookmarks (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    QuestionId INT NOT NULL,
    Note NVARCHAR(500),                         -- Ghi chú của user
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Bookmarks_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Bookmarks_Questions FOREIGN KEY (QuestionId) REFERENCES Questions(Id),
    CONSTRAINT UQ_Bookmarks_UserQuestion UNIQUE (UserId, QuestionId)
);

-- =============================================
-- 6. MODULE VOCABULARY (TỪ VỰNG)
-- =============================================

-- Bảng Vocabularies: Kho từ vựng
CREATE TABLE Vocabularies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Word NVARCHAR(100) NOT NULL,                -- Từ vựng
    Pronunciation NVARCHAR(200),                -- Phiên âm IPA
    PartOfSpeech NVARCHAR(20),                  -- 'noun', 'verb', 'adj', 'adv'
    Meaning NVARCHAR(500) NOT NULL,             -- Nghĩa tiếng Việt
    Example NVARCHAR(MAX),                      -- Câu ví dụ
    ExampleTranslation NVARCHAR(MAX),           -- Dịch câu ví dụ
    AudioUrl NVARCHAR(500),                     -- Audio phát âm
    ImageUrl NVARCHAR(500),                     -- Hình ảnh minh họa
    QuestionId INT NULL,                        -- Trích từ câu hỏi nào (nullable)
    Category NVARCHAR(50),                      -- 'business', 'travel', 'technology'
    Difficulty INT DEFAULT 1,                   -- Độ khó 1-5
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Vocabularies_Questions FOREIGN KEY (QuestionId) REFERENCES Questions(Id) ON DELETE SET NULL
);

-- Bảng UserVocabularies: Tiến độ học từ vựng của user (Spaced Repetition)
CREATE TABLE UserVocabularies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    VocabularyId INT NOT NULL,
    Status INT DEFAULT 0,                       -- 0=New, 1=Learning, 2=Review, 3=Mastered
    CorrectStreak INT DEFAULT 0,                -- Số lần đúng liên tiếp
    ReviewCount INT DEFAULT 0,                  -- Tổng số lần ôn tập
    NextReviewAt DATETIME2,                     -- Ngày ôn tập tiếp theo
    LastReviewedAt DATETIME2,                   -- Lần ôn tập cuối
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_UserVocabularies_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserVocabularies_Vocabularies FOREIGN KEY (VocabularyId) REFERENCES Vocabularies(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_UserVocabularies_UserVocab UNIQUE (UserId, VocabularyId)
);

-- =============================================
-- 7. MODULE AI & CACHING (TIẾT KIỆM CHI PHÍ AI)
-- =============================================

-- Bảng AIExplanations: Cache lời giải thích của AI
CREATE TABLE AIExplanations (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    QuestionId INT UNIQUE NOT NULL,             -- 1 câu chỉ cần 1 lời giải
    ExplanationJson NVARCHAR(MAX),              -- JSON chứa: { text, vocab: [], grammar: "" }
    ModelUsed VARCHAR(50),                      -- 'gpt-4o-mini', 'gemini-flash'
    TokensUsed INT,                             -- Số tokens đã dùng
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_AIExplanations_Questions FOREIGN KEY (QuestionId) REFERENCES Questions(Id) ON DELETE CASCADE
);

-- =============================================
-- INDEXES (TỐI ƯU HIỆU NĂNG)
-- =============================================

-- Users
CREATE UNIQUE INDEX IX_Users_Email ON Users(Email);

-- Tests
CREATE INDEX IX_Tests_Type_IsActive ON Tests(Type, IsActive) INCLUDE (Title, Slug);
CREATE INDEX IX_Tests_Slug ON Tests(Slug);

-- Parts
CREATE INDEX IX_Parts_TestId ON Parts(TestId) INCLUDE (Name, PartNumber, Description);

-- QuestionGroups
CREATE INDEX IX_QuestionGroups_PartId ON QuestionGroups(PartId);

-- Questions
CREATE INDEX IX_Questions_GroupId ON Questions(GroupId) INCLUDE (QuestionNo, QuestionType, CorrectOption);
CREATE INDEX IX_Questions_QuestionNo ON Questions(QuestionNo);

-- Answers
CREATE INDEX IX_Answers_QuestionId ON Answers(QuestionId) INCLUDE (Label, Content);

-- TestAttempts
CREATE INDEX IX_TestAttempts_UserId ON TestAttempts(UserId) INCLUDE (TestId, TotalScore, CompletedAt);
CREATE INDEX IX_TestAttempts_TestId ON TestAttempts(TestId);
CREATE INDEX IX_TestAttempts_UserId_CompletedAt ON TestAttempts(UserId, CompletedAt DESC);

-- UserAnswers
CREATE INDEX IX_UserAnswers_AttemptId ON UserAnswers(AttemptId);
CREATE INDEX IX_UserAnswers_QuestionId ON UserAnswers(QuestionId);
CREATE INDEX IX_UserAnswers_Stat ON UserAnswers(AttemptId, IsCorrect);

-- PracticeSessions
CREATE INDEX IX_PracticeSessions_UserId ON PracticeSessions(UserId);
CREATE INDEX IX_PracticeSessions_UserId_CompletedAt ON PracticeSessions(UserId, CompletedAt DESC);

-- PracticeAnswers
CREATE INDEX IX_PracticeAnswers_SessionId ON PracticeAnswers(SessionId);
CREATE INDEX IX_PracticeAnswers_QuestionId ON PracticeAnswers(QuestionId);

-- Bookmarks
CREATE INDEX IX_Bookmarks_UserId ON Bookmarks(UserId);
CREATE INDEX IX_Bookmarks_QuestionId ON Bookmarks(QuestionId);

-- Vocabularies
CREATE INDEX IX_Vocabularies_Word ON Vocabularies(Word);
CREATE INDEX IX_Vocabularies_Category ON Vocabularies(Category);
CREATE INDEX IX_Vocabularies_QuestionId ON Vocabularies(QuestionId);

-- UserVocabularies
CREATE INDEX IX_UserVocabularies_UserId ON UserVocabularies(UserId);
CREATE INDEX IX_UserVocabularies_VocabularyId ON UserVocabularies(VocabularyId);
CREATE INDEX IX_UserVocabularies_NextReviewAt ON UserVocabularies(NextReviewAt);

-- Transactions
CREATE INDEX IX_Transactions_UserId ON Transactions(UserId);

-- QuestionTags
CREATE INDEX IX_QuestionTags_TagId ON QuestionTags(TagId);

-- =============================================
-- SEED DATA (DỮ LIỆU MẪU)
-- =============================================

-- Tạo Admin mặc định (Password: Admin@123)
INSERT INTO Users (FullName, Email, PasswordHash, Role, IsActive, CreatedAt)
VALUES (N'Administrator', 'admin@toeicmaster.com', '$2a$11$K8xJqHBXTXqTZ9xHLXbLUOWQPzKJXJf5ZbVYRqXCm1V6u9.F9q6Uy', 'Admin', 1, GETDATE());

-- Tạo Tags mẫu
INSERT INTO Tags (Name) VALUES 
(N'Grammar'),
(N'Vocabulary'),
(N'Tenses'),
(N'Prepositions'),
(N'Articles'),
(N'Conjunctions'),
(N'Business'),
(N'Travel'),
(N'Technology'),
(N'Health');

-- =============================================
-- VIEWS (TIỆN ÍCH QUERY)
-- =============================================

-- View: Thống kê tổng quan user
CREATE VIEW vw_UserStats AS
SELECT 
    u.Id AS UserId,
    u.FullName,
    u.Email,
    COUNT(DISTINCT ta.Id) AS TotalTests,
    ISNULL(AVG(ta.TotalScore), 0) AS AvgScore,
    ISNULL(MAX(ta.TotalScore), 0) AS BestScore,
    COUNT(DISTINCT ps.Id) AS TotalPracticeSessions,
    COUNT(DISTINCT b.Id) AS TotalBookmarks,
    COUNT(DISTINCT uv.Id) AS TotalVocabLearned
FROM Users u
LEFT JOIN TestAttempts ta ON u.Id = ta.UserId
LEFT JOIN PracticeSessions ps ON u.Id = ps.UserId
LEFT JOIN Bookmarks b ON u.Id = b.UserId
LEFT JOIN UserVocabularies uv ON u.Id = uv.UserId
GROUP BY u.Id, u.FullName, u.Email;
GO

-- View: Bảng xếp hạng
CREATE VIEW vw_Leaderboard AS
SELECT 
    u.Id AS UserId,
    u.FullName,
    u.AvatarUrl,
    SUM(ta.TotalScore) AS TotalScore,
    COUNT(ta.Id) AS TotalTests,
    AVG(ta.TotalScore) AS AvgScore,
    MAX(ta.TotalScore) AS HighestScore
FROM Users u
INNER JOIN TestAttempts ta ON u.Id = ta.UserId
WHERE u.IsActive = 1
GROUP BY u.Id, u.FullName, u.AvatarUrl;
GO

-- View: Thống kê theo Part
CREATE VIEW vw_PartStatistics AS
SELECT 
    p.PartNumber,
    p.Name AS PartName,
    COUNT(DISTINCT qg.Id) AS TotalGroups,
    COUNT(DISTINCT q.Id) AS TotalQuestions
FROM Parts p
LEFT JOIN QuestionGroups qg ON p.Id = qg.PartId
LEFT JOIN Questions q ON qg.Id = q.GroupId
GROUP BY p.PartNumber, p.Name;
GO

-- =============================================
-- STORED PROCEDURES
-- =============================================

-- SP: Lấy điểm yếu của user (Weakness Hunter)
CREATE PROCEDURE sp_GetUserWeakness
    @UserId INT
AS
BEGIN
    SELECT 
        t.Name AS TagName,
        COUNT(*) AS TotalQuestions,
        SUM(CASE WHEN ua.IsCorrect = 0 THEN 1 ELSE 0 END) AS WrongAnswers,
        CAST(SUM(CASE WHEN ua.IsCorrect = 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS DECIMAL(5,2)) AS ErrorRate
    FROM UserAnswers ua
    INNER JOIN TestAttempts ta ON ua.AttemptId = ta.Id
    INNER JOIN Questions q ON ua.QuestionId = q.Id
    INNER JOIN QuestionTags qt ON q.Id = qt.QuestionId
    INNER JOIN Tags t ON qt.TagId = t.Id
    WHERE ta.UserId = @UserId
    GROUP BY t.Name
    HAVING COUNT(*) >= 5
    ORDER BY ErrorRate DESC;
END;
GO

-- SP: Thống kê dashboard cho Admin
CREATE PROCEDURE sp_GetAdminDashboard
AS
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM Users) AS TotalUsers,
        (SELECT COUNT(*) FROM Users WHERE IsActive = 1) AS ActiveUsers,
        (SELECT COUNT(*) FROM Users WHERE CreatedAt >= CAST(GETDATE() AS DATE)) AS NewUsersToday,
        (SELECT COUNT(*) FROM Tests) AS TotalTests,
        (SELECT COUNT(*) FROM Questions) AS TotalQuestions,
        (SELECT COUNT(*) FROM TestAttempts) AS TotalAttempts,
        (SELECT COUNT(*) FROM TestAttempts WHERE CompletedAt >= DATEADD(DAY, -7, GETDATE())) AS AttemptsThisWeek;
END;
GO

-- =============================================
-- KIỂM TRA SAU KHI TẠO
-- =============================================

-- Liệt kê tất cả tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE' 
ORDER BY TABLE_NAME;

-- Liệt kê tất cả indexes
SELECT 
    t.name AS TableName,
    i.name AS IndexName,
    i.type_desc AS IndexType
FROM sys.indexes i
INNER JOIN sys.tables t ON i.object_id = t.object_id
WHERE i.name IS NOT NULL
ORDER BY t.name, i.name;

-- Liệt kê tất cả foreign keys
SELECT 
    fk.name AS ForeignKeyName,
    tp.name AS ParentTable,
    cp.name AS ParentColumn,
    tr.name AS ReferencedTable,
    cr.name AS ReferencedColumn
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
INNER JOIN sys.tables tp ON fkc.parent_object_id = tp.object_id
INNER JOIN sys.columns cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
INNER JOIN sys.tables tr ON fkc.referenced_object_id = tr.object_id
INNER JOIN sys.columns cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
ORDER BY tp.name;

PRINT N'✅ Database ToeicMaster đã được tạo thành công!';
GO
