IF EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE name = 'CK_ReadingPassages_PassageType'
      AND parent_object_id = OBJECT_ID('dbo.ReadingPassages')
)
BEGIN
    ALTER TABLE dbo.ReadingPassages
    DROP CONSTRAINT CK_ReadingPassages_PassageType;
END;
GO

IF EXISTS (
    SELECT 1
    FROM sys.default_constraints
    WHERE name = 'DF_ReadingPassages_PassageType'
      AND parent_object_id = OBJECT_ID('dbo.ReadingPassages')
)
BEGIN
    ALTER TABLE dbo.ReadingPassages
    DROP CONSTRAINT DF_ReadingPassages_PassageType;
END;
GO

IF COL_LENGTH('dbo.ReadingPassages', 'PassageType') IS NOT NULL
BEGIN
    ALTER TABLE dbo.ReadingPassages
    DROP COLUMN PassageType;
END;
GO
