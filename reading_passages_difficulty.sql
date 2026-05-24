IF COL_LENGTH('dbo.ReadingPassages', 'Difficulty') IS NULL
BEGIN
    ALTER TABLE dbo.ReadingPassages
    ADD Difficulty NVARCHAR(20) NULL;
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE name = 'CK_ReadingPassages_Difficulty'
      AND parent_object_id = OBJECT_ID('dbo.ReadingPassages')
)
BEGIN
    ALTER TABLE dbo.ReadingPassages
    ADD CONSTRAINT CK_ReadingPassages_Difficulty
    CHECK (Difficulty IS NULL OR Difficulty IN ('easy', 'medium', 'hard'));
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_ReadingPassages_PartType_Difficulty_IsActive'
      AND object_id = OBJECT_ID('dbo.ReadingPassages')
)
BEGIN
    CREATE INDEX IX_ReadingPassages_PartType_Difficulty_IsActive
    ON dbo.ReadingPassages (PartType, Difficulty, IsActive);
END;
GO

-- Example updates after you decide the level for each passage:
-- UPDATE dbo.ReadingPassages SET Difficulty = 'easy' WHERE Id IN (1, 2, 3);
-- UPDATE dbo.ReadingPassages SET Difficulty = 'medium' WHERE Id IN (4, 5, 6);
-- UPDATE dbo.ReadingPassages SET Difficulty = 'hard' WHERE Id IN (7, 8, 9);
