// ============================================
// 📦 TOEIC MASTER - TYPE DEFINITIONS
// ============================================

// --------------------------------------------
// 🔤 Common / Shared Types
// --------------------------------------------
export interface Answer {
  label: string;
  content: string;
}

// --------------------------------------------
// 📝 Test Types (Đề thi)
// --------------------------------------------
export interface Question {
  id: number;
  questionNo: number;
  imageUrl: string | null;
  audioUrl: string | null;
  content: string;
  answers: Answer[];
  explanation: string;
  correctOption: string;
}

export interface Group {
  id: number;
  textContent: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  questions: Question[];
  hasAudio: boolean;
  transcript: string | null;
}

export interface Part {
  id: number;
  name: string;
  groups: Group[];
}

export interface TestDetail {
  id: number;
  title: string;
  duration?: number;
  parts: Part[];
}
export interface GenerateAudioResponse {
  message: string;
  url: string;
}

// ============================================
// 👤 Admin Types
// ============================================
export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  totalTests: number;
}

export interface AdminTest {
  id: number;
  title: string;
  type: string;
  duration: number;
  totalQuestions: number;
  isActive: boolean;
  isExplanationPremiumRequired: boolean;
  createdAt: string;
}

export interface AdminQuestion {
  id: number;
  testId: number;
  partNumber: number;
  questionNo: number;
  content: string;
  correctOption: string;
}

// Dashboard Admin
export interface DashboardStats {
  totalUsers: number;
  totalTests: number;
  totalQuestions: number;
  totalAttempts: number;
  activeUsers: number;
  newUsersToday: number;
  totalLearningTimeMinutes : number ;
}

export interface TestHistoryItem {
  attemptId: number;  // Internal ID (not exposed in URLs)
  attemptGuid: string; // UUID for public URLs
  testId: number;
  testTitle: string;
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  listeningScore: number | null;
  readingScore: number | null;
  startedAt: string;
  completedAt: string;
  status: string;
}

// --------------------------------------------
// 📊 Result Types (Kết quả)
// --------------------------------------------
export interface ResultQuestion {
  questionId: number;
  questionNo: number;
  content: string;
  userSelected: string;
  correctOption: string;
  isCorrect: boolean;
  shortExplanation: string | null;
  fullExplanation: string | null;
  explanationLocked?: boolean;
  groupId: number | null;
  groupContent: string | null;
  answers: Answer[];
}

export interface ResultDetail {
  timeLeft?: number; // Thời gian còn lại khi nộp bài (giây)
  duration?: number; // Tổng thời gian quy định (phút)
  timeTaken?: number;
  attemptId: number;
  testId: number;
  testTitle: string;
  totalScore: number;
  totalQuestions: number;
  listeningScore?: number; // Điểm Listening (5-495)
  readingScore?: number; // Điểm Reading (5-495)
  completedAt: string;
  questions: ResultQuestion[];
}

export interface GroupedResult {
  groupId: number;
  groupContent: string | null;
  imageUrl?: string | null;
  questions: ResultQuestion[];
}

// --------------------------------------------
// 🎯 Practice Types (Luyện tập)
// --------------------------------------------
export interface PracticeQuestion {
  id: number;
  questionNo: number;
  content: string;
  audioUrl: string | null;
  groupId: number;
  groupContent: string | null;
  groupImageUrl: string | null;
  groupAudioUrl: string | null;
  answers: Answer[];
}

export interface PracticeSession {
  sessionId: number;
  partNumber: number;
  questions: PracticeQuestion[];
  totalQuestions: number;
}

export interface PracticeResult {
  sessionId: number;
  partNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpent: number;
  completedAt: string;
}

export interface PartInfo {
  partNumber: number;
  name: string;
  description: string;
  type: string;
  icon: string;
  totalQuestions: number;
}

export interface PracticeHistoryItem {
  id: number;
  partNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpentSeconds: number;
  startedAt: string;
  completedAt: string;
}

// --------------------------------------------
// 🔖 Bookmark Types
// --------------------------------------------
export interface BookmarkItem {
  sourceTestName?: string;
  id: number;
  questionId: number;
  note: string | null;
  createdAt: string;
  question: {
    id: number;
    groupId: number;
    questionNo: number;
    content: string;
    audioUrl?: string;
    imageUrl?: string;
    textContent: string ;
    correctOption: string;
    partNumber: number;
    partName: string;
    answers: { label: string; content: string }[];
  };
  group?: {
    id: number;
    textContent: string | null;
    imageUrl: string | null;
    audioUrl: string | null;
  };
}
// ==========================================
  // VOCABULARY TYPES
  // ==========================================

// 1. Enum trạng thái (Giữ nguyên hoặc mapping lại theo UI mới)
export enum VocabularyStatus {
  New = 0,        // Chưa học (Màu trắng)
  Learning = 1,   // Đang học / Hay quên (Màu vàng/cam)
  Review = 2,     // Cần ôn tập (Màu đỏ - logic SRS)
  Mastered = 3,   // Đã thuộc (Màu xanh)
}

// 2. Word Family (Mới - Cần cho mặt sau Flashcard)
export interface WordFamily {
  word: string;
  partOfSpeech: string; // n, v, adj...
  meaning?: string; // Optional
}

// 2.1 Collocation (Cụm từ hay đi với từ vựng)
export interface Collocation {
  phrase: string;
  meaning: string;
}

// 2.2 Synonym (Từ đồng nghĩa)
export interface Synonym {
  word: string;
  meaning: string;
}

// 2.3 Antonym (Từ trái nghĩa)
export interface Antonym {
  word: string;
  meaning: string;
}

// 3. Main Vocabulary Item (Cập nhật)
export interface VocabularyItem {
  id: number;
  word: string;
  meaning: string;
  pronunciation?: string;
  partOfSpeech?: string;
  type?: string; // Alias for partOfSpeech
  example?: string;
  exampleTranslation?: string;
  
  audioUrl?: string;
  imageUrl?: string;
  
  // Quan trọng cho bài học theo chủ đề
  topicId?: number; 
  
  // Quan trọng cho Flashcard mặt sau
  wordFamilies: WordFamily[]; 

  // Collocations, Synonyms, Antonyms
  collocations?: Collocation[];
  synonyms?: Synonym[];
  antonyms?: Antonym[];

  // User Progress
  status: VocabularyStatus;
  isBookmarked?: boolean; // Để user bookmark từ khó
  level?: number; // SRS Level (0-5)
  nextReviewAt?: string | Date; // SRS Next Review Date
}

// Alias for backward compatibility
export type VocabWord = VocabularyItem;

// 4. Topic (Mới - Dùng cho màn hình Home Vocabulary)
export interface Topic {
  id: number;
  title: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  levelRange: string; // "0-450"
  imageUrl?: string;
  
  // SRS Fields - từ GetTopics() API
  currentLevel: number; // 0-5
  totalWords: number;
  learnedWords: number;
  nextReviewAt?: string; // ISO datetime
  canReviewNow: boolean;
  timeUntilReady: string; // "2d 3h", "4h 20m", etc
  wordCounts: Record<number, number>; // { 0: 5, 1: 3, 2: 2, ... }
  
  // Legacy fields (optional)
  slug?: string;
  description?: string;
  thumbnailUrl?: string;
  isCompleted?: boolean;
}

// 5. VocabStats (Giữ nguyên dùng cho Dashboard)
export interface VocabStats {
  totalVocabulary: number;
  learned: number;
  learning: number;
  mastered: number;
  dueForReview: number;
  progressPercent: number;
}

// Vocabulary Analysis by Level Types
export interface VocabTopicAnalysis {
  topicId: number;
  topicName: string;
  totalVocab: number;
  learnedVocab: number;
  currentLevel: number;
  maxLevel: number;
}

export interface VocabLevelAnalysis {
  level: 'Basic' | 'Intermediate' | 'Advanced';
  levelName: string;
  totalTopics: number;
  totalVocab: number;
  learnedVocab: number;
  progressPercent: number;
  topics: VocabTopicAnalysis[];
}

export interface Flashcard {
  id: number;
  word: string;
  meaning: string;
  pronunciation?: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface VocabularyTopic {
  id: number;
  topicGuid: string; // UUID for public URLs
  title: string;
  level: string;
  levelRange: string;
  description: string;
  totalWords: number;
  learnedWords: number;
  wordCount : number ;
}



export interface QuestionVocab {
  id: number;
  questionNo: number;
  content: string;
  options: { label: string; content: string }[];
  correctOption: string; // Backend phải trả về cái này để chấm điểm
  shortExplanation?: string; // 1-sentence explanation from AI
  longExplanation?: string; // Detailed explanation with HTML formatting
}

// 2. Cấu trúc Response từ API
export interface QuestionVocabResponse {
  topicId: number;
  topicName: string;
  totalQuestions: number;
  questions: QuestionVocab[];
}

// 3. Cấu trúc lưu kết quả làm bài của User (FIX LỖI CHÍNH Ở ĐÂY)
export interface UserTestResult {
  questionId: number;
  userAnswer: string;
  correctOption: string;
  isCorrect: boolean;
}
// --------------------------------------------
// 📊 Statistics Types (Thống kê)
// --------------------------------------------
export interface DashboardStats {
  tests: {
    total: number;
    averageScore: number;
    bestScore: number;
    avgListening: number;
    avgReading: number;
  };
  practice: {
    totalSessions: number;
    totalQuestions: number;
    totalCorrect: number;
    accuracy: number;
    totalTimeMinutes: number;
  };
  bookmarks: number;
  vocabulary: {
    learned: number;
    mastered: number;
  };
  recentActivity: {
    testsLast7Days: number;
    practiceLast7Days: number;
  };
}

export interface PartAnalysis {
  partNumber: number;
  name: string;
  type: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  level: string;
  testQuestions: number;
  practiceQuestions: number;
}

export interface ProgressData {
  date: string;
  testScore: number | null;
  listeningScore: number | null;
  readingScore: number | null;
  practiceAccuracy: number | null;
  practiceQuestions: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  last7Days: { date: string; dayName: string; hasActivity: boolean }[];
  todayActive: boolean;
}

// --------------------------------------------
// 💬 Comment Types (Bình luận)
// --------------------------------------------
export interface Comment {
  id: number;
  testId: number;
  userId: number;
  userName: string;
  fullName: string;
  userAvatar?: string | null;
  parentCommentId?: number | null;
  content: string;
  createdAt: string;
  updatedAt?: string | null;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  replies: Comment[];
}

export interface CommentListResponse {
  items: Comment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetCommentsParams {
  testId: string | number;
  page?: number;
  pageSize?: number;
  sortBy?: 'newest' | 'oldest' | 'mostLiked';
}

export interface CreateCommentPayload {
  content: string;
  parentCommentId?: number | null;
}

export interface UpdateCommentPayload {
  content: string;
}

// ==========================================
// GRAMMAR TYPES
// ==========================================

export enum GrammarStatus {
  New = 0,        // Chưa học
  Learning = 1,   // Đang học
  Mastered = 3,   // Đã thuộc
}

export interface GrammarExample {
  id: number;
  grammarId: number;
  sentence: string;
  translation?: string;
  context?: string;
  audioUrl?: string;
}

export interface Grammar {
  id: number;
  topicId: number;
  ruleName: string;
  structure?: string; // e.g., "Subject + have/has + V3"
  meaning: string;
  example?: string;
  exampleTranslation?: string;
  audioUrl?: string;
  imageUrl?: string;
  commonMistakes?: string;
  difficulty: number; // 1-5
  isQuestionsPremiumRequired?: boolean;
  negativeExample?: string; // What NOT to do
  negativeExampleTranslation?: string; // Vietnamese translation of negative example
  testTip?: string; // TOEIC test strategy/tip
  frequency?: number; // 1-10 scale for importance in TOEIC
  relatedRuleIds?: string; // JSON string: "[1,5,12]"
  topicTitle?: string;
  level?: number; // SRS Level (0-5)
  nextReviewAt?: string | Date;
  grammarExamples: GrammarExample[];
  status?: GrammarStatus;
  isBookmarked?: boolean;
}

export interface GrammarTopic {
  id: number;
  topicGuid: string; // UUID for public URLs
  title: string;
  description?: string;
  imageUrl?: string;
  level: string; // "TOEIC 150-300", "Intermediate"
  levelRange: string;
  category: string; // "Tenses", "Clauses", "Prepositions"
  totalRules: number;
  learnedRules: number;
  currentLevel: number; // 0-5
  nextReviewAt?: string;
  canReviewNow: boolean;
  timeUntilReady: string; // "2d 3h"
  ruleCounts: Record<number, number>; // { 0: 5, 1: 3, 2: 2 }
  groupId?: number; // Optional group ID for navigation
  groupGuid?: string; // UUID for group navigation
}

export interface QuestionGrammarAnswer {
  id: number;
  questionGrammarId: number;
  label: string; // A, B, C, D
  content: string;
  isCorrect: boolean;
}

export interface QuestionGrammar {
  id: number;
  topicId: number;
  ruleId: number; // Link to Grammar Rule
  grammarId?: number; // Link to Grammar (Layer 3) - optional for backward compatibility
  questionNo: number;
  content: string; // Question with blank
  correctOption: string; // A, B, C, D
  shortExplanation?: string;
  longExplanation?: string;
  mode?: string; // easy, medium, hard
  explanationLocked?: boolean;
  answers: QuestionGrammarAnswer[];
}

export interface UserGrammarProgress {
  id: number;
  userId: number;
  grammarId: number;
  status: GrammarStatus;
  correctStreak: number;
  reviewCount: number;
  nextReviewAt?: string | Date;
  lastReviewedAt?: string | Date;
  level: number; // 0-5
  createdAt: string;
  grammar?: Grammar;
}

export interface GrammarTestAnswerRequest {
  grammarId: number;
  isCorrect: boolean;
}

export interface GrammarTestResult {
  score: number;
  correctCount: number;
  totalCount: number;
  message: string;
}
