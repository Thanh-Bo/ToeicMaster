/* ============================================================
   Delete every user and their data, keep only thanhbo@gmail.com
   Run against: ToeicMasterDB (localhost\SQLEXPRESS)
   TAKE A BACKUP / EXPORT A .bacpac FIRST.
   ============================================================ */

SET NOCOUNT ON;
SET XACT_ABORT ON;

DECLARE @KeepEmail VARCHAR(100) = 'thanhbo@gmail.com';
DECLARE @KeepId INT = (SELECT Id FROM dbo.Users WHERE Email = @KeepEmail);

IF @KeepId IS NULL
BEGIN
    RAISERROR('Keep user not found - nothing deleted.', 16, 1);
    RETURN;
END

BEGIN TRANSACTION;

BEGIN TRY

    /* --- 1. Test attempts -> answers -> review feedback --- */
    DELETE rf
    FROM dbo.ReviewFeedbacks AS rf
    INNER JOIN dbo.UserAnswers AS ua ON ua.Id = rf.UserAnswerId
    INNER JOIN dbo.TestAttempts AS ta ON ta.Id = ua.AttemptId
    WHERE ta.UserId <> @KeepId;

    DELETE ua
    FROM dbo.UserAnswers AS ua
    INNER JOIN dbo.TestAttempts AS ta ON ta.Id = ua.AttemptId
    WHERE ta.UserId <> @KeepId;

    DELETE FROM dbo.TestAttempts WHERE UserId <> @KeepId;

    /* --- 2. Payment transactions --- */
    DELETE FROM dbo.Transactions WHERE UserId <> @KeepId;

    /* --- 3. Comments (unlink replies first - self FK is NO ACTION) --- */
    UPDATE c
    SET c.ParentCommentId = NULL
    FROM dbo.Comments AS c
    INNER JOIN dbo.Comments AS p ON p.Id = c.ParentCommentId
    WHERE p.UserId <> @KeepId;

    DELETE FROM dbo.CommentLikes WHERE UserId <> @KeepId;
    DELETE FROM dbo.Comments     WHERE UserId <> @KeepId;

    /* --- 4. Bookmarks --- */
    DELETE FROM dbo.Bookmarks WHERE UserId <> @KeepId;

    /* --- 5. Practice sessions (cascades PracticeAnswers) --- */
    DELETE FROM dbo.PracticeSessions WHERE UserId <> @KeepId;

    /* --- 6. Reading sessions (cascades passages + answers) --- */
    DELETE FROM dbo.ReadingSessions WHERE UserId <> @KeepId;

    /* --- 7. Vocabulary --- */
    DELETE FROM dbo.UserVocab                 WHERE UserId <> @KeepId;
    DELETE FROM dbo.UserVocabStreaks          WHERE UserId <> @KeepId;
    DELETE FROM dbo.UserActivityVocabSessions WHERE UserId <> @KeepId;

    /* --- 8. Grammar / daily activity --- */
    DELETE FROM dbo.UserGrammars         WHERE UserId <> @KeepId;
    DELETE FROM dbo.GrammarStudySessions WHERE UserId <> @KeepId;
    DELETE FROM dbo.UserDailyActivity    WHERE UserId <> @KeepId;

    /* --- 9. Feedback (nullable FKs) --- */
    UPDATE dbo.UserFeedbacks SET UserId      = NULL WHERE UserId      <> @KeepId;
    UPDATE dbo.UserFeedbacks SET RespondedBy = NULL WHERE RespondedBy <> @KeepId;

    /* --- 10. Finally the users --- */
    DELETE FROM dbo.Users WHERE Id <> @KeepId;

    COMMIT TRANSACTION;
    PRINT 'Done. Kept user Id = ' + CAST(@KeepId AS VARCHAR(10)) + ' (' + @KeepEmail + ')';

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    PRINT 'ROLLED BACK: ' + ERROR_MESSAGE();
    THROW;
END CATCH;

/* Verify */
SELECT Id, Email, FullName, IsActive, CreatedAt FROM dbo.Users;
