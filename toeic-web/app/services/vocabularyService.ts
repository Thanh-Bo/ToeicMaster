import axiosClient from "./axiosClient";
import type {
  VocabularyItem,
  Flashcard,
  VocabStats,

} from "../types";

// Re-export types để các component có thể import từ service
export type { VocabularyItem, Flashcard, VocabStats };

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


};
