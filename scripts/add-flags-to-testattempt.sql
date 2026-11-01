-- ============================================================
-- Add Flags column to TestAttempts
-- Stores the question IDs the user flagged for later review
-- during one attempt, e.g. "131,136,146".
-- Run once against ToeicMasterDB.
-- ============================================================

USE ToeicMasterDB;
GO

IF COL_LENGTH('dbo.TestAttempts', 'Flags') IS NULL
BEGIN
    ALTER TABLE dbo.TestAttempts
        ADD Flags NVARCHAR(1000) NULL;
    PRINT 'Column TestAttempts.Flags added.';
END
ELSE
BEGIN
    PRINT 'Column TestAttempts.Flags already exists - nothing to do.';
END
GO

-- Verify
SELECT TOP 5 Id, AttemptGuid, Parts, Flags
FROM dbo.TestAttempts
ORDER BY Id DESC;
GO
