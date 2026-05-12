-- ============================================
-- TOEIC MASTER - GRAMMAR PROGRESS TRACKING
-- Database Migration Script
-- Run this script in order to set up progress tracking
-- ============================================

-- ============================================
-- STEP 1: Update UserGrammars Table
-- Add columns for SRS and progress tracking
-- ============================================

PRINT 'Step 1: Updating UserGrammars table...'

-- Use COL_LENGTH to check if column exists (more reliable)
IF COL_LENGTH('dbo.UserGrammars', 'FirstLearnedAt') IS NULL
BEGIN
    ALTER TABLE [dbo].[UserGrammars] 
    ADD [FirstLearnedAt] datetime2 NULL
    PRINT 'Added column: FirstLearnedAt'
END
ELSE
BEGIN
    PRINT 'Column FirstLearnedAt already exists, skipping...'
END

IF COL_LENGTH('dbo.UserGrammars', 'TotalStudyTimeSeconds') IS NULL
BEGIN
    ALTER TABLE [dbo].[UserGrammars] 
    ADD [TotalStudyTimeSeconds] int NOT NULL DEFAULT 0
    PRINT 'Added column: TotalStudyTimeSeconds'
END
ELSE
BEGIN
    PRINT 'Column TotalStudyTimeSeconds already exists, skipping...'
END

IF COL_LENGTH('dbo.UserGrammars', 'TotalQuestionsAnswered') IS NULL
BEGIN
    ALTER TABLE [dbo].[UserGrammars] 
    ADD [TotalQuestionsAnswered] int NOT NULL DEFAULT 0
    PRINT 'Added column: TotalQuestionsAnswered'
END
ELSE
BEGIN
    PRINT 'Column TotalQuestionsAnswered already exists, skipping...'
END

IF COL_LENGTH('dbo.UserGrammars', 'TotalCorrectAnswers') IS NULL
BEGIN
    ALTER TABLE [dbo].[UserGrammars] 
    ADD [TotalCorrectAnswers] int NOT NULL DEFAULT 0
    PRINT 'Added column: TotalCorrectAnswers'
END
ELSE
BEGIN
    PRINT 'Column TotalCorrectAnswers already exists, skipping...'
END

IF COL_LENGTH('dbo.UserGrammars', 'Level') IS NULL
BEGIN
    ALTER TABLE [dbo].[UserGrammars] 
    ADD [Level] int NOT NULL DEFAULT 0
    PRINT 'Added column: Level'
END
ELSE
BEGIN
    PRINT 'Column Level already exists, skipping...'
END

IF COL_LENGTH('dbo.UserGrammars', 'CorrectStreak') IS NULL
BEGIN
    ALTER TABLE [dbo].[UserGrammars] 
    ADD [CorrectStreak] int NOT NULL DEFAULT 0
    PRINT 'Added column: CorrectStreak'
END
ELSE
BEGIN
    PRINT 'Column CorrectStreak already exists, skipping...'
END

PRINT 'UserGrammars table updated successfully!'

-- ============================================
-- STEP 2: Create GrammarStudySessions Table
-- Track individual study sessions
-- ============================================

PRINT 'Step 2: Creating GrammarStudySessions table...'

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GrammarStudySessions')
BEGIN
    CREATE TABLE [dbo].[GrammarStudySessions] (
        [Id] int IDENTITY(1,1) PRIMARY KEY,
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
        
        CONSTRAINT [FK_GrammarStudySessions_Users] 
            FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_GrammarStudySessions_Grammars] 
            FOREIGN KEY ([GrammarId]) REFERENCES [Grammars]([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_GrammarStudySessions_Topics] 
            FOREIGN KEY ([TopicId]) REFERENCES [GrammarTopics]([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_GrammarStudySessions_Groups] 
            FOREIGN KEY ([GroupId]) REFERENCES [GrammarGroups]([Id]) ON DELETE NO ACTION
    )
    
    -- Indexes for performance
    CREATE INDEX [IX_GrammarStudySessions_UserId] ON [dbo].[GrammarStudySessions]([UserId])
    CREATE INDEX [IX_GrammarStudySessions_StartedAt] ON [dbo].[GrammarStudySessions]([StartedAt])
    CREATE INDEX [IX_GrammarStudySessions_UserId_StartedAt] ON [dbo].[GrammarStudySessions]([UserId], [StartedAt])
    
    PRINT 'GrammarStudySessions table created successfully!'
END
ELSE
BEGIN
    PRINT 'GrammarStudySessions table already exists, skipping...'
END

-- ============================================
-- STEP 3: Create UserDailyActivity Table
-- Track daily activity for streaks
-- ============================================

PRINT 'Step 3: Creating UserDailyActivity table...'

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserDailyActivity')
BEGIN
    CREATE TABLE [dbo].[UserDailyActivity] (
        [Id] int IDENTITY(1,1) PRIMARY KEY,
        [UserId] int NOT NULL,
        [Date] date NOT NULL,
        [HasActivity] bit NOT NULL DEFAULT 0,
        [StudyMinutes] int NOT NULL DEFAULT 0,
        [LessonsLearned] int NOT NULL DEFAULT 0,
        [QuestionsAnswered] int NOT NULL DEFAULT 0,
        [CorrectAnswers] int NOT NULL DEFAULT 0,
        
        CONSTRAINT [FK_UserDailyActivity_Users] 
            FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]) ON DELETE CASCADE,
        CONSTRAINT [UQ_UserDailyActivity_UserId_Date] 
            UNIQUE ([UserId], [Date])
    )
    
    -- Indexes for performance
    CREATE INDEX [IX_UserDailyActivity_UserId] ON [dbo].[UserDailyActivity]([UserId])
    CREATE INDEX [IX_UserDailyActivity_Date] ON [dbo].[UserDailyActivity]([Date])
    CREATE INDEX [IX_UserDailyActivity_UserId_Date] ON [dbo].[UserDailyActivity]([UserId], [Date])
    
    PRINT 'UserDailyActivity table created successfully!'
END
ELSE
BEGIN
    PRINT 'UserDailyActivity table already exists, skipping...'
END

-- ============================================
-- STEP 4: Create Indexes on UserGrammars
-- For better query performance
-- ============================================

PRINT 'Step 4: Creating indexes on UserGrammars...'

-- Only create indexes if columns exist (using COL_LENGTH)
IF COL_LENGTH('dbo.UserGrammars', 'Status') IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserGrammars_UserId_Status')
    BEGIN
        CREATE INDEX [IX_UserGrammars_UserId_Status] 
        ON [dbo].[UserGrammars]([UserId], [Status])
        PRINT 'Created index IX_UserGrammars_UserId_Status'
    END
END

IF COL_LENGTH('dbo.UserGrammars', 'NextReviewAt') IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserGrammars_NextReviewAt')
    BEGIN
        EXEC('CREATE INDEX [IX_UserGrammars_NextReviewAt] ON [dbo].[UserGrammars]([NextReviewAt]) WHERE [NextReviewAt] IS NOT NULL')
        PRINT 'Created index IX_UserGrammars_NextReviewAt'
    END
END

IF COL_LENGTH('dbo.UserGrammars', 'FirstLearnedAt') IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserGrammars_FirstLearnedAt')
    BEGIN
        EXEC('CREATE INDEX [IX_UserGrammars_FirstLearnedAt] ON [dbo].[UserGrammars]([FirstLearnedAt]) WHERE [FirstLearnedAt] IS NOT NULL')
        PRINT 'Created index IX_UserGrammars_FirstLearnedAt'
    END
END

PRINT 'Indexes created successfully!'

-- ============================================
-- VERIFICATION
-- ============================================

PRINT ''
PRINT '========================================'
PRINT 'Migration Complete!'
PRINT '========================================'
PRINT ''
PRINT 'Tables created/updated:'
PRINT '  1. UserGrammars - Added SRS columns'
PRINT '  2. GrammarStudySessions - New table'
PRINT '  3. UserDailyActivity - New table'
PRINT ''
PRINT 'You can now use the Progress Tab features!'
PRINT ''

-- Verify columns were added
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'UserGrammars'
AND COLUMN_NAME IN ('FirstLearnedAt', 'TotalStudyTimeSeconds', 'TotalQuestionsAnswered', 
    'TotalCorrectAnswers', 'Level', 'CorrectStreak')
ORDER BY ORDINAL_POSITION
