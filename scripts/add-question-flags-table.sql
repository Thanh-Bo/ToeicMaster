-- ============================================================
-- Bảng lưu câu hỏi người dùng đánh dấu "Lưu lại để xem sau" (flag).
-- Trước đây trạng thái này chỉ nằm trong localStorage + chuỗi
-- TestAttempts.Flags lúc nộp bài; giờ lưu thật trong DB theo user.
-- Chạy 1 lần trên ToeicMasterDB. Script an toàn khi chạy lại.
-- ============================================================

USE ToeicMasterDB;
GO

IF OBJECT_ID('dbo.QuestionFlags', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.QuestionFlags
    (
        Id         INT IDENTITY(1,1) NOT NULL,
        UserId     INT               NOT NULL,
        QuestionId INT               NOT NULL,
        CreatedAt  DATETIME2(7)      NOT NULL
            CONSTRAINT DF_QuestionFlags_CreatedAt DEFAULT (SYSUTCDATETIME()),

        CONSTRAINT PK_QuestionFlags PRIMARY KEY CLUSTERED (Id),

        CONSTRAINT FK_QuestionFlags_Users_UserId
            FOREIGN KEY (UserId) REFERENCES dbo.Users (Id)
            ON DELETE CASCADE,

        CONSTRAINT FK_QuestionFlags_Questions_QuestionId
            FOREIGN KEY (QuestionId) REFERENCES dbo.Questions (Id)
            ON DELETE CASCADE
    );

    -- Mỗi user chỉ đánh dấu một câu một lần
    CREATE UNIQUE INDEX IX_QuestionFlags_UserId_QuestionId
        ON dbo.QuestionFlags (UserId, QuestionId);

    PRINT 'Table dbo.QuestionFlags created.';
END
ELSE
BEGIN
    PRINT 'Table dbo.QuestionFlags already exists - nothing to do.';
END
GO

-- Verify
SELECT TOP 10 Id, UserId, QuestionId, CreatedAt
FROM dbo.QuestionFlags
ORDER BY Id DESC;
GO
