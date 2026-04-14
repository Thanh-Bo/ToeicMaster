import axiosClient from "./axiosClient";
import type {
  GrammarTopic,
  Grammar,
  GrammarExample,
  UserGrammarProgress,
  QuestionGrammar,
  QuestionGrammarAnswer,
} from "../types";

export const grammarService = {
  // ==========================================
  // TOPICS
  // ==========================================

  getTopics: async (): Promise<GrammarTopic[]> => {
    const response = await axiosClient.get("/grammar/topics");
    return response.data || [];
  },

  getTopicById: async (id: number): Promise<GrammarTopic | null> => {
    const response = await axiosClient.get(`/grammar/topics/${id}`);
    return response.data || null;
  },

  createTopic: async (data: Partial<GrammarTopic>) => {
    const response = await axiosClient.post("/grammar/topics", data);
    return response.data;
  },

  updateTopic: async (id: number, data: Partial<GrammarTopic>) => {
    const response = await axiosClient.put(`/grammar/topics/${id}`, data);
    return response.data;
  },

  deleteTopic: async (id: number) => {
    const response = await axiosClient.delete(`/grammar/topics/${id}`);
    return response.data;
  },

  // ==========================================
  // GRAMMARS (Rules)
  // ==========================================

  getGrammarsByTopic: async (topicId: number): Promise<Grammar[]> => {
    const response = await axiosClient.get(
      `/grammar/topics/${topicId}/grammars`
    );
    return response.data || [];
  },

  getGrammarById: async (id: number): Promise<Grammar | null> => {
    const response = await axiosClient.get(`/grammar/${id}`);
    return response.data || null;
  },

  createGrammar: async (data: Partial<Grammar>) => {
    const response = await axiosClient.post("/grammar", data);
    return response.data;
  },

  updateGrammar: async (id: number, data: Partial<Grammar>) => {
    const response = await axiosClient.put(`/grammar/${id}`, data);
    return response.data;
  },

  deleteGrammar: async (id: number) => {
    const response = await axiosClient.delete(`/grammar/${id}`);
    return response.data;
  },

  searchGrammars: async (keyword: string): Promise<Grammar[]> => {
    const response = await axiosClient.get("/grammar/search", {
      params: { keyword },
    });
    return response.data || [];
  },

  // ==========================================
  // EXAMPLES
  // ==========================================

  getExamples: async (grammarId: number): Promise<GrammarExample[]> => {
    const response = await axiosClient.get(`/grammar/${grammarId}/examples`);
    return response.data || [];
  },

  addExample: async (grammarId: number, data: Partial<GrammarExample>) => {
    const response = await axiosClient.post(
      `/grammar/${grammarId}/examples`,
      data
    );
    return response.data;
  },

  deleteExample: async (id: number) => {
    const response = await axiosClient.delete(`/grammar/examples/${id}`);
    return response.data;
  },

  // ==========================================
  // USER PROGRESS
  // ==========================================

  getUserProgress: async (): Promise<UserGrammarProgress[]> => {
    const response = await axiosClient.get("/usergrammar/progress");
    return response.data || [];
  },

  getGrammarProgress: async (
    grammarId: number
  ): Promise<UserGrammarProgress | null> => {
    const response = await axiosClient.get(`/usergrammar/progress/${grammarId}`);
    return response.data || null;
  },

  updateProgress: async (
    grammarId: number,
    data: { isCorrect: boolean; level: number; nextReviewAt?: string }
  ) => {
    const response = await axiosClient.put(
      `/usergrammar/progress/${grammarId}`,
      data
    );
    return response.data;
  },

  // ==========================================
  // SPACED REPETITION / REVIEW
  // ==========================================

  getForReview: async (count: number = 20): Promise<Grammar[]> => {
    const response = await axiosClient.get("/usergrammar/review", {
      params: { count },
    });
    return response.data?.items || [];
  },

  getFlashcards: async (count: number = 20): Promise<any[]> => {
    const response = await axiosClient.get("/usergrammar/flashcards", {
      params: { count },
    });
    return response.data?.items || [];
  },

  getMasteredCount: async (): Promise<number> => {
    const response = await axiosClient.get("/usergrammar/mastered-count");
    return response.data?.count || 0;
  },

  // ==========================================
  // QUESTIONS
  // ==========================================

  getQuestionsByTopic: async (
    topicId: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ items: QuestionGrammar[]; total: number }> => {
    const response = await axiosClient.get(
      `/questiongrammar/topic/${topicId}`,
      { params: { page, pageSize } }
    );
    return {
      items: response.data?.items || [],
      total: response.data?.total || 0,
    };
  },

  getQuestionById: async (id: number): Promise<QuestionGrammar | null> => {
    const response = await axiosClient.get(`/questiongrammar/${id}`);
    return response.data || null;
  },

  getQuestionAnswers: async (questionId: number): Promise<QuestionGrammarAnswer[]> => {
    const response = await axiosClient.get(`/questiongrammar/${questionId}/answers`);
    return response.data || [];
  },

  createQuestion: async (data: any) => {
    const response = await axiosClient.post("/questiongrammar", data);
    return response.data;
  },

  deleteQuestion: async (id: number) => {
    const response = await axiosClient.delete(`/questiongrammar/${id}`);
    return response.data;
  },

  // ==========================================
  // TEST SUBMISSION
  // ==========================================

  submitTest: async (answers: any[]) => {
    const response = await axiosClient.post("/usergrammar/submit-test", {
      answers,
    });
    return response.data;
  },
};
