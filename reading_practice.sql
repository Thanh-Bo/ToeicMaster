-- Reading Practice Part 6 & 7 schema
-- Run this script manually in the ToeicMaster database before using the feature.
-- This script is non-destructive: it only creates tables/indexes that do not exist.

IF OBJECT_ID('dbo.ReadingPassages', 'U') IS NULL
BEGIN
CREATE TABLE dbo.ReadingPassages
(
    Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ReadingPassages PRIMARY KEY,
    TopicId INT NULL,
    Title NVARCHAR(255) NULL,
    TextContent NVARCHAR(MAX) NULL,
    ImageUrl NVARCHAR(MAX) NULL,
    TextContentTranslation NVARCHAR(MAX) NULL,
    PartType INT NOT NULL,
    DisplayOrder INT NOT NULL CONSTRAINT DF_ReadingPassages_DisplayOrder DEFAULT (0),
    IsActive BIT NOT NULL CONSTRAINT DF_ReadingPassages_IsActive DEFAULT (1),
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_ReadingPassages_CreatedAt DEFAULT (GETDATE()),
    CONSTRAINT CK_ReadingPassages_PartType CHECK (PartType IN (6, 7))
);
END
GO

IF OBJECT_ID('dbo.ReadingTopics', 'U') IS NULL
BEGIN
CREATE TABLE dbo.ReadingTopics
(
    Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ReadingTopics PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    PartType INT NOT NULL,
    Difficulty NVARCHAR(20) NULL,
    DisplayOrder INT NOT NULL CONSTRAINT DF_ReadingTopics_DisplayOrder DEFAULT (0),
    IsActive BIT NOT NULL CONSTRAINT DF_ReadingTopics_IsActive DEFAULT (1),
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_ReadingTopics_CreatedAt DEFAULT (GETDATE()),
    CONSTRAINT CK_ReadingTopics_PartType CHECK (PartType IN (6, 7)),
    CONSTRAINT CK_ReadingTopics_Difficulty CHECK (Difficulty IS NULL OR Difficulty IN ('easy', 'medium', 'hard'))
);
END
GO

IF OBJECT_ID('dbo.ReadingPassages', 'U') IS NOT NULL
   AND OBJECT_ID('dbo.ReadingTopics', 'U') IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ReadingPassages_ReadingTopics_TopicId')
BEGIN
    ALTER TABLE dbo.ReadingPassages
    ADD CONSTRAINT FK_ReadingPassages_ReadingTopics_TopicId
    FOREIGN KEY (TopicId) REFERENCES dbo.ReadingTopics(Id);
END
GO

IF OBJECT_ID('dbo.ReadingQuestions', 'U') IS NULL
BEGIN
CREATE TABLE dbo.ReadingQuestions
(
    Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ReadingQuestions PRIMARY KEY,
    PassageId INT NOT NULL,
    QuestionNo INT NOT NULL,
    Content NVARCHAR(MAX) NULL,
    CorrectOption NVARCHAR(5) NULL,
    ShortExplanation NVARCHAR(MAX) NULL,
    FullExplanation NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_ReadingQuestions_CreatedAt DEFAULT (GETDATE()),
    CONSTRAINT FK_ReadingQuestions_ReadingPassages_PassageId
        FOREIGN KEY (PassageId) REFERENCES dbo.ReadingPassages(Id) ON DELETE CASCADE,
    CONSTRAINT CK_ReadingQuestions_CorrectOption CHECK (CorrectOption IS NULL OR CorrectOption IN ('A', 'B', 'C', 'D'))
);
END
GO

IF OBJECT_ID('dbo.ReadingAnswers', 'U') IS NULL
BEGIN
CREATE TABLE dbo.ReadingAnswers
(
    Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ReadingAnswers PRIMARY KEY,
    ReadingQuestionId INT NOT NULL,
    Label NVARCHAR(5) NULL,
    Content NVARCHAR(MAX) NULL,
    CONSTRAINT FK_ReadingAnswers_ReadingQuestions_ReadingQuestionId
        FOREIGN KEY (ReadingQuestionId) REFERENCES dbo.ReadingQuestions(Id) ON DELETE CASCADE,
    CONSTRAINT CK_ReadingAnswers_Label CHECK (Label IS NULL OR Label IN ('A', 'B', 'C', 'D'))
);
END
GO

IF OBJECT_ID('dbo.ReadingSessions', 'U') IS NULL
BEGIN
CREATE TABLE dbo.ReadingSessions
(
    Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ReadingSessions PRIMARY KEY,
    UserId INT NOT NULL,
    TotalPassages INT NOT NULL CONSTRAINT DF_ReadingSessions_TotalPassages DEFAULT (0),
    TotalQuestions INT NOT NULL CONSTRAINT DF_ReadingSessions_TotalQuestions DEFAULT (0),
    CorrectAnswers INT NOT NULL CONSTRAINT DF_ReadingSessions_CorrectAnswers DEFAULT (0),
    TimeSpentSeconds INT NOT NULL CONSTRAINT DF_ReadingSessions_TimeSpentSeconds DEFAULT (0),
    StartedAt DATETIME2 NOT NULL CONSTRAINT DF_ReadingSessions_StartedAt DEFAULT (GETDATE()),
    CompletedAt DATETIME2 NULL,
    Status NVARCHAR(20) NOT NULL CONSTRAINT DF_ReadingSessions_Status DEFAULT ('in_progress'),
    CONSTRAINT FK_ReadingSessions_Users_UserId
        FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE,
    CONSTRAINT CK_ReadingSessions_Status CHECK (Status IN ('in_progress', 'completed', 'cancelled'))
);
END
GO

IF OBJECT_ID('dbo.ReadingSessionPassages', 'U') IS NULL
BEGIN
CREATE TABLE dbo.ReadingSessionPassages
(
    Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ReadingSessionPassages PRIMARY KEY,
    SessionId INT NOT NULL,
    PassageId INT NOT NULL,
    DisplayOrder INT NOT NULL,
    CONSTRAINT FK_ReadingSessionPassages_ReadingSessions_SessionId
        FOREIGN KEY (SessionId) REFERENCES dbo.ReadingSessions(Id) ON DELETE CASCADE,
    CONSTRAINT FK_ReadingSessionPassages_ReadingPassages_PassageId
        FOREIGN KEY (PassageId) REFERENCES dbo.ReadingPassages(Id) ON DELETE CASCADE
);
END
GO

IF OBJECT_ID('dbo.ReadingSessionAnswers', 'U') IS NULL
BEGIN
CREATE TABLE dbo.ReadingSessionAnswers
(
    Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ReadingSessionAnswers PRIMARY KEY,
    SessionId INT NOT NULL,
    ReadingQuestionId INT NOT NULL,
    SelectedOption NVARCHAR(5) NULL,
    IsCorrect BIT NOT NULL CONSTRAINT DF_ReadingSessionAnswers_IsCorrect DEFAULT (0),
    AnsweredAt DATETIME2 NOT NULL CONSTRAINT DF_ReadingSessionAnswers_AnsweredAt DEFAULT (GETDATE()),
    CONSTRAINT FK_ReadingSessionAnswers_ReadingSessions_SessionId
        FOREIGN KEY (SessionId) REFERENCES dbo.ReadingSessions(Id) ON DELETE CASCADE,
    CONSTRAINT FK_ReadingSessionAnswers_ReadingQuestions_ReadingQuestionId
        FOREIGN KEY (ReadingQuestionId) REFERENCES dbo.ReadingQuestions(Id),
    CONSTRAINT CK_ReadingSessionAnswers_SelectedOption CHECK (SelectedOption IS NULL OR SelectedOption IN ('A', 'B', 'C', 'D'))
);
END
GO

IF OBJECT_ID('dbo.ReadingSessions', 'U') IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1
        FROM sys.check_constraints
        WHERE name = 'CK_ReadingSessions_Status'
          AND parent_object_id = OBJECT_ID('dbo.ReadingSessions')
    )
        ALTER TABLE dbo.ReadingSessions DROP CONSTRAINT CK_ReadingSessions_Status;

    ALTER TABLE dbo.ReadingSessions
    ADD CONSTRAINT CK_ReadingSessions_Status CHECK (Status IN ('in_progress', 'completed', 'cancelled'));
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ReadingPassages_PartType_IsActive' AND object_id = OBJECT_ID('dbo.ReadingPassages'))
    CREATE INDEX IX_ReadingPassages_PartType_IsActive ON dbo.ReadingPassages(PartType, IsActive);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ReadingPassages_TopicId' AND object_id = OBJECT_ID('dbo.ReadingPassages'))
    CREATE INDEX IX_ReadingPassages_TopicId ON dbo.ReadingPassages(TopicId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ReadingTopics_PartType_Difficulty_IsActive' AND object_id = OBJECT_ID('dbo.ReadingTopics'))
    CREATE INDEX IX_ReadingTopics_PartType_Difficulty_IsActive ON dbo.ReadingTopics(PartType, Difficulty, IsActive);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ReadingQuestions_PassageId' AND object_id = OBJECT_ID('dbo.ReadingQuestions'))
    CREATE INDEX IX_ReadingQuestions_PassageId ON dbo.ReadingQuestions(PassageId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ReadingAnswers_ReadingQuestionId' AND object_id = OBJECT_ID('dbo.ReadingAnswers'))
    CREATE INDEX IX_ReadingAnswers_ReadingQuestionId ON dbo.ReadingAnswers(ReadingQuestionId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_ReadingAnswers_Question_Label' AND object_id = OBJECT_ID('dbo.ReadingAnswers'))
    CREATE UNIQUE INDEX UX_ReadingAnswers_Question_Label ON dbo.ReadingAnswers(ReadingQuestionId, Label);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ReadingSessions_UserId_StartedAt' AND object_id = OBJECT_ID('dbo.ReadingSessions'))
    CREATE INDEX IX_ReadingSessions_UserId_StartedAt ON dbo.ReadingSessions(UserId, StartedAt);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_ReadingSessionPassages_Session_Passage' AND object_id = OBJECT_ID('dbo.ReadingSessionPassages'))
    CREATE UNIQUE INDEX UX_ReadingSessionPassages_Session_Passage ON dbo.ReadingSessionPassages(SessionId, PassageId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ReadingSessionAnswers_SessionId' AND object_id = OBJECT_ID('dbo.ReadingSessionAnswers'))
    CREATE INDEX IX_ReadingSessionAnswers_SessionId ON dbo.ReadingSessionAnswers(SessionId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_ReadingSessionAnswers_Session_Question' AND object_id = OBJECT_ID('dbo.ReadingSessionAnswers'))
    CREATE UNIQUE INDEX UX_ReadingSessionAnswers_Session_Question ON dbo.ReadingSessionAnswers(SessionId, ReadingQuestionId);
GO

-- Optional seed template:
-- INSERT INTO dbo.ReadingPassages (Title, TextContent, PartType, DisplayOrder)
-- VALUES (N'Email notice', N'<p>Paste passage HTML here.</p>', 7, 1);
--
-- DECLARE @PassageId INT = SCOPE_IDENTITY();
-- INSERT INTO dbo.ReadingQuestions (PassageId, QuestionNo, Content, CorrectOption, ShortExplanation)
-- VALUES (@PassageId, 1, N'What is the purpose of the email?', N'A', N'Explain why A is correct.');
--
-- DECLARE @QuestionId INT = SCOPE_IDENTITY();
-- INSERT INTO dbo.ReadingAnswers (ReadingQuestionId, Label, Content)
-- VALUES
-- (@QuestionId, N'A', N'Correct answer'),
-- (@QuestionId, N'B', N'Distractor'),
-- (@QuestionId, N'C', N'Distractor'),
-- (@QuestionId, N'D', N'Distractor');
