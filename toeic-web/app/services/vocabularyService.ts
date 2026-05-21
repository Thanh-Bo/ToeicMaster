import axiosClient from "./axiosClient";
import type {
  VocabularyItem,
  VocabStats,
  VocabularyTopic,
  Flashcard,
  QuestionVocabResponse,
} from "../types";

// Re-export types để các component có thể import từ service
export type { VocabularyItem, VocabStats };


// Local Flashcard interface

export const vocabularyService = {
  // ==========================================
  // TOPICS APIs
  // ==========================================

  // Lấy danh sách Topics
  getTopics: async (): Promise<VocabularyTopic[]> => {
    const response = await axiosClient.get("/vocabulary/topics");
    return response.data;
  },

  // Lấy từ vựng của 1 Topic (UUID)
  getWordsByTopic: async (topicGuid: string): Promise<VocabularyItem[]> => {
    const response = await axiosClient.get(
      `/vocabulary/topics/${topicGuid}/words`
    );
    return response.data;
  },

  // Lấy Vocabulary questions của Topic
  getQuestionVocab: async (topicId: number): Promise<QuestionVocabResponse> => {
    const response = await axiosClient.get(`/questionvocab/topic/${topicId}`, {
      params: { pageSize: 100 },
    });
    return {
      topicId,
      topicName: "",
      totalQuestions: response.data?.total || 0,
      questions: (response.data?.items || []).map((q: any) => ({
        id: q.id,
        questionNo: q.questionNo,
        content: q.content,
        correctOption: q.correctOption,
        shortExplanation: q.shortExplanation,
        longExplanation: q.longExplanation,
        explanationLocked: q.explanationLocked,
        options: q.answers || [],
      })),
    };
  },


  submitTestResults: async (topicId: number, testData: any) => {
    const response = await axiosClient.post(
      `/import/topics/${topicId}/test-results`,
      testData
    );
    return response.data;
  },

  // ==========================================
  // FLASHCARDS & LEARNING APIs
  // ==========================================

  // Lấy flashcards
  getFlashcards: async (
    count = 20,
    topicId?: number
  ): Promise<{ cards: Flashcard[]; newCount: number; reviewCount: number }> => {
    const params = topicId ? { count, topicId } : { count };
    const response = await axiosClient.get("/vocabulary/flashcards", {
      params,
    });
    return response.data;
  },

  // ==========================================
  // STATISTICS & ADMIN APIs
  // ==========================================

  // 🔴 1. Thống kê chi tiết (GET /stats)
  getStats: async () => {
    const response = await axiosClient.get("/statistics/stats");
    return response.data;
  },

  // 🔴 3. Nộp bài test và grade (POST /topics/{id}/test)
  submitTest: async (topicId: number, answers: Record<string, string>) => {
    const response = await axiosClient.post(
      `/statistics/topics/${topicId}/test`,
      { answers }
    );
    return response.data;
  },

  // Lấy danh sách từ vựng (search, filter)
  getVocabularies: async (params?: {
    category?: string;
    difficulty?: number;
    search?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const response = await axiosClient.get("/vocabulary", { params });
    return response.data;
  },

  // Lấy categories
  getCategories: async () => {
    const response = await axiosClient.get("/vocabulary/categories");
    return response.data;
  },

  // ==========================================
  // ADMIN/IMPORT APIs
  // ==========================================

  // Thêm từ vựng
  addVocabulary: async (vocab: Partial<VocabularyItem>) => {
    const response = await axiosClient.post("/vocabulary", vocab);
    return response.data;
  },

  // Generate AI explanation for a QuestionVocab
  generateQuestionVocabExplanation: async (questionVocabId: number) => {
    const response = await axiosClient.post(
      `/questionvocab/${questionVocabId}/generate-explanation`
    );
    return response.data;
  },

  // Get QuestionVocab by ID
  getQuestionVocabById: async (questionVocabId: number) => {
    const response = await axiosClient.get(
      `/question-vocab/${questionVocabId}`
    );
    return response.data;
  },

  // Get QuestionVocab list by Topic
  getQuestionVocabByTopic: async (
    topicId: number,
    page: number = 1,
    pageSize: number = 20
  ) => {
    const response = await axiosClient.get(
      `/question-vocab/topic/${topicId}`,
      { params: { page, pageSize } }
    );
    return response.data;
  },

  
  // Import hàng loạt
  importVocabularies: async (vocabularies: Partial<VocabularyItem>[]) => {
    const response = await axiosClient.post("/vocabulary/import", vocabularies);
    return response.data;
  },

  // ==========================================
  // STATS APIs
  // ==========================================

  // Get vocabulary stats (total topics, words learned, review due, time, streak, accuracy)
  getVocabStats: async (userId: number, period: string = "all"): Promise<{
    totalTopicsLearned: number;
    totalVocabLearned: number;
    reviewDue: number;
    totalTimeMinutes: number;
    totalQuestionsAnswered: number;
    accuracy: number;
    streak: { current: number; longest: number };
  }> => {
    const response = await axiosClient.get(`/users/${userId}/vocabulary/stats`, { params: { period } });
    return response.data;
  },

  // Get vocabulary analysis by level with period filter
  getVocabAnalysisByLevel: async (userId: number, period: string = "all"): Promise<{
    level: 'Basic' | 'Intermediate' | 'Advanced';
    levelName: string;
    totalTopics: number;
    totalVocab: number;
    learnedVocab: number;
    progressPercent: number;
    topics: {
      topicId: number;
      topicName: string;
      totalVocab: number;
      learnedVocab: number;
      currentLevel: number;
      maxLevel: number;
    }[];
  }[]> => {
    const response = await axiosClient.get(`/users/${userId}/vocabulary/analysis-by-level`, { params: { period } });
    return response.data;
  },

  // Start a study session
  startSession: async (userId: number): Promise<{ sessionId: number }> => {
    const response = await axiosClient.post(`/users/${userId}/vocabulary/sessions/start`);
    return response.data;
  },

  // End a study session
  endSession: async (userId: number, sessionId: number): Promise<{ durationSeconds: number }> => {
    const response = await axiosClient.post(`/users/${userId}/vocabulary/sessions/${sessionId}/end`);
    return response.data;
  },

  // Get streak info
  getStreak: async (userId: number): Promise<{
    current: number;
    longest: number;
    lastActivityDate: string | null;
  }> => {
    const response = await axiosClient.get(`/users/${userId}/vocabulary/streak`);
    return response.data;
  },

  // Level up for a topic (dùng cho cả Matching Game và Test)
  levelUp: async (topicId: number): Promise<{ message: string; newLevel: number }> => {
    const response = await axiosClient.post(`/vocabulary/topics/${topicId}/level-up`);
    return response.data;
  },

  // Cập nhật số câu hỏi đã làm và câu đúng
  updateVocabStats: async (topicId: number, data: { totalQuestions: number; correctAnswers: number }): Promise<{ 
    message: string; 
    totalQuestionsAnswered: number; 
    totalCorrectAnswers: number;
    accuracy: number;
  }> => {
    const response = await axiosClient.post(`/vocabulary/topics/${topicId}/update-stats`, data);
    return response.data;
  },
};
