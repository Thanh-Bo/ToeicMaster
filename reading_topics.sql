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
END;
GO

IF COL_LENGTH('dbo.ReadingPassages', 'TopicId') IS NULL
BEGIN
    ALTER TABLE dbo.ReadingPassages
    ADD TopicId INT NULL;
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_ReadingPassages_ReadingTopics_TopicId'
)
BEGIN
    ALTER TABLE dbo.ReadingPassages
    ADD CONSTRAINT FK_ReadingPassages_ReadingTopics_TopicId
    FOREIGN KEY (TopicId)
    REFERENCES dbo.ReadingTopics(Id);
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_ReadingTopics_PartType_Difficulty_IsActive'
      AND object_id = OBJECT_ID('dbo.ReadingTopics')
)
BEGIN
    CREATE INDEX IX_ReadingTopics_PartType_Difficulty_IsActive
    ON dbo.ReadingTopics (PartType, Difficulty, IsActive);
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_ReadingPassages_TopicId'
      AND object_id = OBJECT_ID('dbo.ReadingPassages')
)
BEGIN
    CREATE INDEX IX_ReadingPassages_TopicId
    ON dbo.ReadingPassages (TopicId);
END;
GO

-- Example:
-- INSERT INTO dbo.ReadingTopics (Title, Description, PartType, Difficulty, DisplayOrder)
-- VALUES (N'Office Communication', N'Part 6 practice about office emails and notices.', 6, 'easy', 1);
--
-- Import passages into this topic with:
-- POST /api/v1/reading-practice/import?partType=6&difficulty=easy&topicId=1
