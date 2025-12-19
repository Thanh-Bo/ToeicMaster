import axiosClient from "./axiosClient";

export interface VocabularyItem {
  id: number;
  word: string;
  pronunciation: string | null;
  partOfSpeech: string | null;
  meaning: string;
  example: string | null;
  exampleTranslation: string | null;
  audioUrl: string | null;
  imageUrl: string | null;
  category: string | null;
  difficulty: number;
}

export interface Flashcard extends VocabularyItem {
  isNew: boolean;
  isDueReview: boolean;
}

export interface VocabStats {
  totalVocabulary: number;
  learned: number;
  learning: number;
  review: number;
  mastered: number;
  dueForReview: number;
  progress: number;
}

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
  }
};
