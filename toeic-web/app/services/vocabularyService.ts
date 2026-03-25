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

  // Lấy từ vựng của 1 Topic
  getWordsByTopic: async (topicId: number): Promise<VocabularyItem[]> => {
    const response = await axiosClient.get(
      `/vocabulary/topics/${topicId}/words`
    );
    return response.data;
  },

  // Lấy Vocabulary questions của Topic
  getQuestionVocab: async (topicId: number): Promise<QuestionVocabResponse> => {
    const response = await axiosClient.get(`/import/topics/${topicId}/question-vocab`);
    return response.data;
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
};
