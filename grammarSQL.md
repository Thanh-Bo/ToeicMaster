# Grammar SQL Schema - 3-Layer Hierarchy

## Overview
This file contains SQL migration scripts for Grammar-related tables in ToeicMaster database with a **3-layer hierarchical structure**:
- **Layer 1 (Groups)**: GrammarGroup - Main grammar categories (Nhóm 1, 2, 3)
- **Layer 2 (Topics)**: GrammarTopic - Subcategories under groups (Từ loại, Giới từ, etc.)
- **Layer 3 (Rules)**: Grammar - Individual grammar rules/lessons

## Architecture

```
GrammarGroup (Layer 1)
├── GrammarTopic (Layer 2) [FK: GroupId]
│   ├── Grammar (Layer 3) [FK: TopicId]
│   │   └── GrammarExample
│   └── QuestionGrammar
│       └── QuestionGrammarAnswer
└── UserGrammar (tracks progress)
```

## SQL Migration Script

```sql
BEGIN TRANSACTION;

-- =============================================
-- LAYER 1: Grammar Groups (Main Categories)
-- =============================================
CREATE TABLE [GrammarGroups] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(200) NOT NULL,
    [Description] nvarchar(max) NULL,
    [Order] int NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT ((getdate())),
    CONSTRAINT [PK_GrammarGroups] PRIMARY KEY ([Id])
);

-- =============================================
-- LAYER 2: Grammar Topics (Subcategories)
-- =============================================
CREATE TABLE [GrammarTopics] (
    [Id] int NOT NULL IDENTITY,
    [GroupId] int NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [Description] nvarchar(max) NULL,
    [ImageUrl] nvarchar(max) NULL,
    [Level] nvarchar(50) NULL,
    [LevelRange] nvarchar(50) NULL,
    [Category] nvarchar(100) NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT ((getdate())),
    CONSTRAINT [PK_GrammarTopics] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_GrammarTopics_GrammarGroups_GroupId] FOREIGN KEY ([GroupId]) REFERENCES [GrammarGroups] ([Id]) ON DELETE CASCADE
);

-- =============================================
-- LAYER 3: Grammar Rules/Lessons
-- =============================================
CREATE TABLE [Grammars] (
    [Id] int NOT NULL IDENTITY,
    [TopicId] int NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [Content] nvarchar(max) NULL,
    [Explanation] nvarchar(max) NULL,
    [Examples] nvarchar(max) NULL,
    [Difficulty] int NULL,
    [Order] int NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT ((getdate())),
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Grammars] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Grammars_GrammarTopics_TopicId] FOREIGN KEY ([TopicId]) REFERENCES [GrammarTopics] ([Id]) ON DELETE CASCADE
);

-- =============================================
-- Grammar Examples (for individual rules)
-- =============================================
CREATE TABLE [GrammarExamples] (
    [Id] int NOT NULL IDENTITY,
    [GrammarId] int NOT NULL,
    [Example] nvarchar(max) NOT NULL,
    [ExampleTranslation] nvarchar(max) NULL,
    [Explanation] nvarchar(max) NULL,
    [Order] int NULL,
    CONSTRAINT [PK_GrammarExamples] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_GrammarExamples_Grammars_GrammarId] FOREIGN KEY ([GrammarId]) REFERENCES [Grammars] ([Id]) ON DELETE CASCADE
);

-- =============================================
-- Grammar Questions (nested under Topics)
-- =============================================
CREATE TABLE [QuestionGrammars] (
    [Id] int NOT NULL IDENTITY,
    [TopicId] int NOT NULL,
    [QuestionNo] int NOT NULL,
    [Content] nvarchar(max) NULL,
    [CorrectOption] nvarchar(5) NULL,
    [ShortExplanation] nvarchar(max) NULL,
    [LongExplanation] nvarchar(max) NULL,
    CONSTRAINT [PK_QuestionGrammars] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_QuestionGrammars_GrammarTopics_TopicId] FOREIGN KEY ([TopicId]) REFERENCES [GrammarTopics] ([Id]) ON DELETE CASCADE
);

-- =============================================
-- Grammar Question Answers
-- =============================================
CREATE TABLE [QuestionGrammarAnswers] (
    [Id] int NOT NULL IDENTITY,
    [QuestionGrammarId] int NOT NULL,
    [Label] nvarchar(5) NULL,
    [Content] nvarchar(max) NULL,
    [IsCorrect] bit NOT NULL,
    CONSTRAINT [PK_QuestionGrammarAnswers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_QuestionGrammarAnswers_QuestionGrammars_QuestionGrammarId] FOREIGN KEY ([QuestionGrammarId]) REFERENCES [QuestionGrammars] ([Id]) ON DELETE CASCADE
);

-- =============================================
-- User Grammar Progress (SRS tracking)
-- =============================================
CREATE TABLE [UserGrammars] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [GrammarId] int NOT NULL,
    [Status] int NOT NULL,
    [CorrectCount] int NOT NULL DEFAULT 0,
    [IncorrectCount] int NOT NULL DEFAULT 0,
    [ReviewCount] int NOT NULL DEFAULT 0,
    [Level] int NOT NULL DEFAULT 0,
    [CorrectStreak] int NOT NULL DEFAULT 0,
    [FirstLearnedAt] datetime2 NULL,
    [NextReviewAt] datetime2 NULL,
    [LastReviewedAt] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    -- Practice tracking columns
    [TotalStudyTimeSeconds] int NOT NULL DEFAULT 0,
    [TotalQuestionsAnswered] int NOT NULL DEFAULT 0,
    [TotalCorrectAnswers] int NOT NULL DEFAULT 0,
    CONSTRAINT [PK_UserGrammars] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_UserGrammars_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserGrammars_Grammars_GrammarId] FOREIGN KEY ([GrammarId]) REFERENCES [Grammars] ([Id]) ON DELETE CASCADE
);

-- =============================================
-- Grammar Study Sessions (Track practice sessions)
-- =============================================
CREATE TABLE [GrammarStudySessions] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [GrammarId] int NULL,
    [TopicId] int NULL,
    [GroupId] int NULL,
    [SessionType] nvarchar(50) NOT NULL, -- 'lesson', 'practice', 'review'
    [DurationSeconds] int NOT NULL DEFAULT 0,
    [QuestionsAnswered] int NOT NULL DEFAULT 0,
    [CorrectAnswers] int NOT NULL DEFAULT 0,
    [StartedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
    [EndedAt] datetime2 NULL,
    CONSTRAINT [PK_GrammarStudySessions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_GrammarStudySessions_Users] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_GrammarStudySessions_Grammars] FOREIGN KEY ([GrammarId]) REFERENCES [Grammars] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_GrammarStudySessions_Topics] FOREIGN KEY ([TopicId]) REFERENCES [GrammarTopics] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_GrammarStudySessions_Groups] FOREIGN KEY ([GroupId]) REFERENCES [GrammarGroups] ([Id]) ON DELETE NO ACTION
);

-- =============================================
-- User Daily Activity (Track daily streaks)
-- =============================================
CREATE TABLE [UserDailyActivity] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [Date] date NOT NULL,
    [HasActivity] bit NOT NULL DEFAULT 0,
    [StudyMinutes] int NOT NULL DEFAULT 0,
    [LessonsLearned] int NOT NULL DEFAULT 0,
    [QuestionsAnswered] int NOT NULL DEFAULT 0,
    [CorrectAnswers] int NOT NULL DEFAULT 0,
    CONSTRAINT [PK_UserDailyActivity] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_UserDailyActivity_Users] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [UQ_UserDailyActivity_UserId_Date] UNIQUE ([UserId], [Date])
);

-- =============================================
-- Indexes for Performance Optimization
-- =============================================
CREATE INDEX [IX_GrammarTopics_GroupId] ON [GrammarTopics] ([GroupId]);
CREATE INDEX [IX_Grammars_TopicId] ON [Grammars] ([TopicId]);
CREATE INDEX [IX_GrammarExamples_GrammarId] ON [GrammarExamples] ([GrammarId]);
CREATE INDEX [IX_QuestionGrammars_TopicId] ON [QuestionGrammars] ([TopicId]);
CREATE INDEX [IX_QuestionGrammars_TopicId_Mode] ON [QuestionGrammars] ([TopicId], [Mode]);
CREATE INDEX [IX_QuestionGrammars_Mode] ON [QuestionGrammars] ([Mode]);
CREATE INDEX [IX_QuestionGrammarAnswers_QuestionGrammarId] ON [QuestionGrammarAnswers] ([QuestionGrammarId]);
CREATE INDEX [IX_UserGrammars_UserId] ON [UserGrammars] ([UserId]);
CREATE INDEX [IX_UserGrammars_GrammarId] ON [UserGrammars] ([GrammarId]);
CREATE UNIQUE INDEX [IX_UserGrammars_UserId_GrammarId] ON [UserGrammars] ([UserId], [GrammarId]);

-- Additional indexes for progress tracking
CREATE INDEX [IX_UserGrammars_UserId_Status] ON [UserGrammars] ([UserId], [Status]);
CREATE INDEX [IX_UserGrammars_NextReviewAt] ON [UserGrammars] ([NextReviewAt]) WHERE [NextReviewAt] IS NOT NULL;
CREATE INDEX [IX_UserGrammars_FirstLearnedAt] ON [UserGrammars] ([FirstLearnedAt]) WHERE [FirstLearnedAt] IS NOT NULL;

-- Indexes for study sessions
CREATE INDEX [IX_GrammarStudySessions_UserId] ON [GrammarStudySessions] ([UserId]);
CREATE INDEX [IX_GrammarStudySessions_StartedAt] ON [GrammarStudySessions] ([StartedAt]);
CREATE INDEX [IX_GrammarStudySessions_UserId_StartedAt] ON [GrammarStudySessions] ([UserId], [StartedAt]);

-- Indexes for daily activity
CREATE INDEX [IX_UserDailyActivity_UserId] ON [UserDailyActivity] ([UserId]);
CREATE INDEX [IX_UserDailyActivity_Date] ON [UserDailyActivity] ([Date]);
CREATE INDEX [IX_UserDailyActivity_UserId_Date] ON [UserDailyActivity] ([UserId], [Date]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260427120000_AddGrammarThreeLayerHierarchy', N'10.0.1');

COMMIT;
GO
```

## Table Descriptions

| Table | Layer | Purpose | Key Fields |
|-------|-------|---------|-----------|
| **GrammarGroups** | Layer 1 | Main grammar categories (Nhóm 1, 2, 3) | Id, Title, Description, Order |
| **GrammarTopics** | Layer 2 | Topics within groups (Từ loại, Giới từ, etc.) | Id, GroupId (FK), Title, Level, Category |
| **Grammars** | Layer 3 | Individual grammar rules/lessons | Id, TopicId (FK), Title, Content, Explanation |
| **GrammarExamples** | Layer 3 | Example sentences for rules | Id, GrammarId (FK), Example, ExampleTranslation |
| **QuestionGrammars** | Layer 2 | Practice questions for topics | Id, TopicId (FK), Content, CorrectOption, Mode |
| **QuestionGrammarAnswers** | Layer 2 | Answer options for questions | Id, QuestionGrammarId (FK), Label, IsCorrect |
| **UserGrammars** | User Data | User progress tracking (SRS) | Id, UserId (FK), GrammarId (FK), Status, NextReviewAt, TotalStudyTimeSeconds, TotalQuestionsAnswered, TotalCorrectAnswers |
| **GrammarStudySessions** | User Data | Track individual study sessions | Id, UserId (FK), TopicId (FK), DurationSeconds, QuestionsAnswered, CorrectAnswers |
| **UserDailyActivity** | User Data | Track daily activity for streaks | Id, UserId (FK), Date, HasActivity, StudyMinutes, QuestionsAnswered |

## Relationships

```
Users (1) ──→ (Many) UserGrammars
             ↓
        Grammars (Many)
             ↑
        GrammarTopics (1)
             ↑
        GrammarGroups (1)

GrammarGroups (1) ──→ (Many) GrammarTopics
GrammarTopics (1) ──→ (Many) Grammars
GrammarTopics (1) ──→ (Many) QuestionGrammars
Grammars (1) ──→ (Many) GrammarExamples
QuestionGrammars (1) ──→ (Many) QuestionGrammarAnswers

Users (1) ──→ (Many) GrammarStudySessions
Users (1) ──→ (Many) UserDailyActivity
```

## Implementation Steps

### Step 1: Add Migration
```bash
dotnet ef migrations add AddGrammarThreeLayerHierarchy
```

### Step 2: Apply to Database
```bash
dotnet ef database update
```

### Step 3: Populate Sample Data (see Sample Data section below)

## Question Import Flows

### Flow cũ (Grammar-based) - DEPRECATED
**Endpoint:**
```
POST /api/v1/grammar/grammars/{grammarId}/questions/import?mode=easy
```

**Mục đích:**
- Import questions cho 1 grammar rule cụ thể (Layer 3)
- Mỗi grammar có 20 questions per mode
- Dùng cho flow học theo từng rule riêng lẻ

**Status:** Vẫn giữ cho backward compatibility nhưng không dùng cho flow luyện tập mới.

---

### Flow mới (Topic-based) - KHUYẾN NGHỊ
**Endpoint:**
```
POST /api/v1/grammar/topics/{topicId}/questions/import?mode=easy
```

**Mục đích:**
- Import questions cho 1 topic (Layer 2) - trộn nhiều grammar rules
- Mỗi topic có 25 questions per mode (trộn ngẫu nhiên 3 chủ đề con)
- Dùng cho flow **Luyện tập ngẫu nhiên** mới

**Yêu cầu:**
- ✅ 25 questions per mode (easy/medium/hard)
- ✅ Trộn ngẫu nhiên 3 chủ đề: Danh từ, Tính từ, Trạng từ
- ✅ Distribution đề xuất: 8-8-9 (8 Danh từ, 8 Tính từ, 9 Trạng từ)
- ✅ Sắp xếp ngẫu nhiên, không theo thứ tự chủ đề

**Status:** ✅ KHUYẾN NGHỊ sử dụng

---

### Insert 3 Grammar Groups
```sql
INSERT INTO [GrammarGroups] ([Title], [Description], [Order], [CreatedAt])
VALUES 
    (N'Nhóm 1: Từ loại & Cấu trúc cơ bản', 
     N'Từ loại tiếng Anh, câu cơ bản, động từ TO BE, Have/Has', 
     1, GETDATE()),
    (N'Nhóm 2: Động từ & Thì', 
     N'Thì hiện tại, quá khứ, tương lai, động từ khuyết thiếu', 
     2, GETDATE()),
    (N'Nhóm 3: Mệnh đề & Cấu trúc nâng cao', 
     N'Mệnh đề quan hệ, so sánh, đảo ngữ, câu điều kiện', 
     3, GETDATE());
```

### Insert Topics for Group 1
```sql
INSERT INTO [GrammarTopics] ([GroupId], [Title], [Description], [Level], [Category], [CreatedAt])
VALUES 
    (1, N'Từ loại', N'Các loại từ trong tiếng Anh (danh từ, động từ, tính từ, etc.)', N'A1', N'Cơ bản', GETDATE()),
    (1, N'Từ hạn định & Đại từ', N'Mạo từ A/An/The, đại từ nhân xưng và sở hữu', N'A1', N'Cơ bản', GETDATE()),
    (1, N'Giới từ', N'In, On, At, From, To và các cấu trúc with giới từ', N'A1', N'Cơ bản', GETDATE());
```

## Question Import Flows

### Flow cũ (Grammar-based) - DEPRECATED
**Endpoint:**
```
POST /api/v1/grammar/grammars/{grammarId}/questions/import?mode=easy
```

**Mục đích:**
- Import questions cho 1 grammar rule cụ thể (Layer 3)
- Mỗi grammar có 20 questions per mode
- Dùng cho flow học theo từng rule riêng lẻ

**Request Body:**
```json
[
  {
    "content": "The company is looking for a new _____.",
    "options": ["manage", "management", "manager", "managing"],
    "correctOption": "C",
    "shortExplanation": "...",
    "LongExplanation": "..."
  }
]
```

**Response:**
```json
{
  "message": "Import 20 questions thành công",
  "grammarId": 30,
  "mode": "easy",
  "count": 20
}
```

**Lưu ý:** Flow này vẫn được giữ cho backward compatibility nhưng không dùng cho flow luyện tập mới.

---

### Flow mới (Topic-based) - KHUYẾN NGHỊ
**Endpoint:**
```
POST /api/v1/grammar/topics/{topicId}/questions/import?mode=easy
```

**Mục đích:**
- Import questions cho 1 topic (Layer 2) - trộn nhiều grammar rules
- Mỗi topic có 25 questions per mode (trộn ngẫu nhiên 3 chủ đề con)
- Dùng cho flow **Luyện tập ngẫu nhiên** mới

**Request Body:**
```json
[
  {
    "content": "The _____ team completed the project.",
    "options": ["success", "successful", "successfully", "succeed"],
    "correctOption": "B",
    "shortExplanation": "Định dạng HTML với . Dòng 1 = - \"Câu hỏi : \" + dich cau hoi.",
    "LongExplanation": "- Loại câu hỏi: Từ loại (tính từ)<br>- Giải thích: Trước danh từ 'team' cần tính từ<br>- Cảnh báo bẫy: Nhầm với trạng từ 'successfully'"
  }
]
```

**Response:**
```json
{
  "message": "Import 25 questions thành công",
  "topicId": 5,
  "mode": "easy",
  "count": 25
}
```

**Yêu cầu:**
- ✅ 25 questions per mode (easy/medium/hard)
- ✅ Trộn ngẫu nhiên 3 chủ đề: Danh từ, Tính từ, Trạng từ
- ✅ Distribution đề xuất: 8-8-9 (8 Danh từ, 8 Tính từ, 9 Trạng từ)
- ✅ Sắp xếp ngẫu nhiên, không theo thứ tự chủ đề

**Lưu ý:** 
- `TopicId` là FK chính (bắt buộc)
- `Mode` phân loại easy/medium/hard
- Không cần `GrammarId` trong QuestionGrammars cho flow mới

---

## Database Schema

### QuestionGrammars Table
```sql
CREATE TABLE [QuestionGrammars] (
    [Id] int NOT NULL IDENTITY,
    [TopicId] int NOT NULL,  -- ← FK to GrammarTopics (Layer 2)
    [Mode] nvarchar(10) NOT NULL,  -- ← easy/medium/hard
    [QuestionNo] int NOT NULL,
    [Content] nvarchar(max) NULL,
    [CorrectOption] nvarchar(5) NULL,
    [ShortExplanation] nvarchar(max) NULL,
    [LongExplanation] nvarchar(max) NULL,
    CONSTRAINT [PK_QuestionGrammars] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_QuestionGrammars_GrammarTopics_TopicId] 
        FOREIGN KEY ([TopicId]) REFERENCES [GrammarTopics] ([Id]) ON DELETE CASCADE
);
```

### Indexes for Performance
```sql
-- Index trên TopicId + Mode để query nhanh theo mode
CREATE INDEX [IX_QuestionGrammars_TopicId_Mode] 
    ON [QuestionGrammars] ([TopicId], [Mode]);

-- Index trên Mode để filter theo độ khó
CREATE INDEX [IX_QuestionGrammars_Mode] 
    ON [QuestionGrammars] ([Mode]);
```

---

## Migration Script (Nếu cần thêm Mode column)

```sql
-- Add Mode column if not exists
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[QuestionGrammars]') AND name = 'Mode')
BEGIN
    ALTER TABLE [QuestionGrammars] 
    ADD [Mode] nvarchar(10) NOT NULL DEFAULT 'medium';
    
    -- Add index
    CREATE INDEX [IX_QuestionGrammars_TopicId_Mode] 
    ON [QuestionGrammars] ([TopicId], [Mode]);
    
    PRINT 'Added Mode column and index to QuestionGrammars table';
END
```

---

## Question Import Flow Comparison

| Feature | Flow cũ (Grammar-based) | Flow mới (Topic-based) |
|---------|------------------------|------------------------|
| **Endpoint** | `/grammars/{id}/questions/import` | `/topics/{id}/questions/import` |
| **Scope** | 1 grammar rule | 1 topic (3+ grammar rules) |
| **Questions per mode** | 20 | 25 |
| **Total questions** | 60 (20×3 modes) | 75 (25×3 modes) |
| **Question distribution** | Tất cả cùng chủ đề | Trộn 3 chủ đề (8-8-9) |
| **User experience** | Học từng rule riêng | Luyện tập ngẫu nhiên |
| **TOEIC simulation** | ❌ Không giống thi thật | ✅ Giống thi thật |
| **Status** | DEPRECATED (vẫn giữ) | ✅ KHUYẾN NGHỊ |

---

## Implementation Steps

### Step 1: Add Migration
```bash
dotnet ef migrations add AddGrammarThreeLayerHierarchy
```

### Step 2: Apply to Database
```bash
dotnet ef database update
```

### Step 3: Populate Sample Data (see Sample Data section below)

### Step 4: Test Import Endpoints
```bash
# Test flow cũ (grammar-based)
POST http://localhost:5298/api/v1/grammar/grammars/30/questions/import?mode=easy
Body: [20 questions]

# Test flow mới (topic-based)
POST http://localhost:5298/api/v1/grammar/topics/5/questions/import?mode=easy
Body: [25 questions - trộn 3 chủ đề]
```

---
