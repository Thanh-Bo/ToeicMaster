-- ============================================
-- UUID cho Reading: Thêm cột PublicId
-- ============================================

ALTER TABLE ReadingTopics ADD PublicId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID();
ALTER TABLE ReadingPassages ADD PublicId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID();
ALTER TABLE ReadingSessions ADD PublicId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID();

CREATE UNIQUE INDEX IX_ReadingTopics_PublicId ON ReadingTopics(PublicId);
CREATE UNIQUE INDEX IX_ReadingPassages_PublicId ON ReadingPassages(PublicId);
CREATE UNIQUE INDEX IX_ReadingSessions_PublicId ON ReadingSessions(PublicId);
