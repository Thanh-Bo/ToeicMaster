import axiosClient from "./axiosClient";
import type {
  VocabularyItem,
  Flashcard,
  VocabStats,
  SaveVocabFromQuestionRequest,
  MyVocabularyItem
} from "../types";

// Re-export types để các component có thể import từ service
export type { VocabularyItem, Flashcard, VocabStats, SaveVocabFromQuestionRequest, MyVocabularyItem };

export const vocabularyService = {
  // Lấy danh sách từ vựng
  getVocabularies: async (params?: { category?: string; difficulty?: number; search?: string; page?: number; pageSize?: number }) => {
    const response = await axiosClient.get("/vocabulary", { params });
    return response.data;
  },

  // Lấy categories
  getCategories: async () => {
    const response = await axiosClient.get("/vocabulary/categories");
    return response.data;
  },

  // Lấy flashcards
  getFlashcards: async (count = 20, category?: string): Promise<{ cards: Flashcard[]; newCount: number; reviewCount: number }> => {
    const response = await axiosClient.get("/vocabulary/flashcards", {
      params: { count, category }
    });
    return response.data;
  },

  // Review flashcard
  reviewFlashcard: async (vocabId: number, remembered: boolean) => {
    const response = await axiosClient.post(`/vocabulary/flashcards/${vocabId}/review`, {
      remembered
    });
    return response.data;
  },

  // Thống kê
  getStats: async (): Promise<VocabStats> => {
    const response = await axiosClient.get("/vocabulary/stats");
    return response.data;
  },

  // Thêm từ vựng
  addVocabulary: async (vocab: Partial<VocabularyItem>) => {
    const response = await axiosClient.post("/vocabulary", vocab);
    return response.data;
  },

  // Import hàng loạt
  importVocabularies: async (vocabularies: Partial<VocabularyItem>[]) => {
    const response = await axiosClient.post("/vocabulary/import", vocabularies);
    return response.data;
  },

  // === USER VOCABULARY (Lưu từ bài thi) ===

  // Lưu từ vựng từ câu hỏi
  saveFromQuestion: async (data: SaveVocabFromQuestionRequest): Promise<{ message: string; vocabId: number; alreadySaved: boolean }> => {
    const response = await axiosClient.post("/vocabulary/save-from-question", data);
    return response.data;
  },

  // Lấy danh sách từ vựng đã lưu của user
  getMyVocabulary: async (page = 1, pageSize = 20): Promise<{ items: MyVocabularyItem[]; total: number; totalPages: number }> => {
    const response = await axiosClient.get("/vocabulary/my-vocabulary", {
      params: { page, pageSize }
    });
    return response.data;
  },

  // Xóa từ vựng khỏi danh sách của user
  removeFromMyVocabulary: async (vocabId: number) => {
    const response = await axiosClient.delete(`/vocabulary/my-vocabulary/${vocabId}`);
    return response.data;
  }
};
