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
  // GRAMMAR GROUPS (Layer 1)
  // ==========================================

  getAllGroups: async (): Promise<any[]> => {
    const response = await axiosClient.get("/grammar/groups");
    return response.data || [];
  },

  getGroupById: async (groupGuid: string): Promise<any | null> => {
    const response = await axiosClient.get(`/grammar/groups/${groupGuid}`);
    return response.data || null;
  },

  createGroup: async (data: any) => {
    const response = await axiosClient.post("/grammar/groups", data);
    return response.data;
  },

  updateGroup: async (groupId: number, data: any) => {
    const response = await axiosClient.put(`/grammar/groups/${groupId}`, data);
    return response.data;
  },

  deleteGroup: async (groupId: number) => {
    const response = await axiosClient.delete(`/grammar/groups/${groupId}`);
    return response.data;
  },

  // ==========================================
  // GRAMMAR TOPICS (Layer 2 - under Groups)
  // ==========================================

  getTopicsByGroup: async (groupGuid: string): Promise<GrammarTopic[]> => {
    const response = await axiosClient.get(`/grammar/groups/${groupGuid}/topics`);
    return response.data || [];
  },

  getTopicById: async (groupGuid: string, topicGuid: string): Promise<GrammarTopic | null> => {
    const response = await axiosClient.get(`/grammar/groups/${groupGuid}/topics/${topicGuid}`);
    return response.data || null;
  },

  createTopic: async (groupId: number, data: Partial<GrammarTopic>) => {
    const response = await axiosClient.post(`/grammar/groups/${groupId}/topics`, data);
    return response.data;
  },

  updateTopic: async (groupId: number, topicId: number, data: Partial<GrammarTopic>) => {
    const response = await axiosClient.put(`/grammar/groups/${groupId}/topics/${topicId}`, data);
    return response.data;
  },

  deleteTopic: async (groupId: number, topicId: number) => {
    const response = await axiosClient.delete(`/grammar/groups/${groupId}/topics/${topicId}`);
    return response.data;
  },

  // ⚠️ Backward Compatibility: Get all topics (legacy)
  getTopics: async (): Promise<GrammarTopic[]> => {
    // This is a fallback for components that still use the old API
    // In practice, you should use getTopicsByGroup(groupId) for new code
    try {
      const groups = await grammarService.getAllGroups();
      let allTopics: GrammarTopic[] = [];
      
      for (const group of groups) {
        const topics = await grammarService.getTopicsByGroup(group.id);
        allTopics = [...allTopics, ...topics];
      }
      
      return allTopics;
    } catch (error) {
      console.error("Error getting all topics:", error);
      return [];
    }
  },

  // ==========================================
  // GRAMMARS (Layer 3 - Rules under Topics)
  // ==========================================

  getGrammarsByTopic: async (topicId: number): Promise<Grammar[]> => {
    const response = await axiosClient.get(`/grammar/groups/topics/${topicId}/grammars`);
    return response.data || [];
  },

  getGrammarById: async (topicId: number, grammarId: number): Promise<Grammar | null> => {
    const response = await axiosClient.get(`/grammar/groups/topics/${topicId}/grammars/${grammarId}`);
    return response.data || null;
  },

  createGrammar: async (topicId: number, data: Partial<Grammar>) => {
    const response = await axiosClient.post(`/grammar/groups/topics/${topicId}/grammars`, data);
    return response.data;
  },

  bulkCreateGrammars: async (topicId: number, data: any) => {
    const response = await axiosClient.post(`/grammar/groups/topics/${topicId}/grammars/bulk`, data);
    return response.data;
  },

  updateGrammar: async (topicId: number, grammarId: number, data: Partial<Grammar>) => {
    const response = await axiosClient.put(`/grammar/groups/topics/${topicId}/grammars/${grammarId}`, data);
    return response.data;
  },

  deleteGrammar: async (topicId: number, grammarId: number) => {
    const response = await axiosClient.delete(`/grammar/groups/topics/${topicId}/grammars/${grammarId}`);
    return response.data;
  },

  deleteAllGrammarsByTopic: async (topicId: number) => {
    const response = await axiosClient.delete(`/grammar/groups/topics/${topicId}/grammars`);
    return response.data;
  },

  // ==========================================
  // USER PROGRESS (Spaced Repetition)
  // ==========================================

  getUserProgress: async (userId: number): Promise<UserGrammarProgress[]> => {
    const response = await axiosClient.get(`/users/${userId}/grammar/progress`);
    return response.data || [];
  },

  getGrammarProgress: async (userId: number, grammarId: number): Promise<UserGrammarProgress | null> => {
    const response = await axiosClient.get(`/users/${userId}/grammar/progress/${grammarId}`);
    return response.data || null;
  },

  updateProgress: async (userId: number, grammarId: number, data: any) => {
    const response = await axiosClient.put(
      `/users/${userId}/grammar/progress/${grammarId}`,
      data
    );
    return response.data;
  },

  /**
   * Mark grammar as learned when user views the lesson (Option A)
   * POST /api/v1/grammar/groups/topics/{topicId}/grammars/{grammarId}/learn
   */
  markAsLearned: async (topicId: number, grammarId: number) => {
    const response = await axiosClient.post(
      `/grammar/groups/topics/${topicId}/grammars/${grammarId}/learn`
    );
    return response.data;
  },

  // ==========================================
  // GRAMMAR QUESTIONS (NEW - 3-layer hierarchy)
  // ==========================================

  /**
   * Get questions by grammarId with optional mode filter
   * GET /api/v1/grammar/grammars/{grammarId}/questions
   * Returns ALL questions (no pagination) when mode is specified
   */
  getQuestionsByGrammar: async (
    grammarId: number,
    mode?: 'easy' | 'medium' | 'hard'
  ): Promise<{ items: QuestionGrammar[]; total: number; isLocked?: boolean; message?: string }> => {
    const params: any = {};
    if (mode) {
      params.mode = mode;
    }
    // No page/pageSize params - backend returns all questions
    
    const response = await axiosClient.get(
      `/grammar/grammars/${grammarId}/questions`,
      { params }
    );
    return {
      items: response.data?.items || [],
      total: response.data?.total || 0,
      isLocked: response.data?.isLocked || false,
      message: response.data?.message,
    };
  },

  /**
   * Get single question by ID
   * GET /api/v1/grammar/grammars/{grammarId}/questions/{id}
   */
  getQuestionById: async (grammarId: number, id: number): Promise<QuestionGrammar | null> => {
    const response = await axiosClient.get(`/grammar/grammars/${grammarId}/questions/${id}`);
    return response.data || null;
  },

  /**
   * Get answers for a question
   * GET /api/v1/grammar/grammars/{grammarId}/questions/{questionId}/answers
   */
  getQuestionAnswers: async (grammarId: number, questionId: number): Promise<QuestionGrammarAnswer[]> => {
    const response = await axiosClient.get(`/grammar/grammars/${grammarId}/questions/${questionId}/answers`);
    return response.data || [];
  },

  /**
   * Create single question
   * POST /api/v1/grammar/grammars/{grammarId}/questions
   */
  createQuestion: async (grammarId: number, data: any) => {
    const response = await axiosClient.post(`/grammar/grammars/${grammarId}/questions`, data);
    return response.data;
  },

  /**
   * Import questions batch with mode
   * POST /api/v1/grammar/grammars/{grammarId}/questions/import?mode={easy|medium|hard}
   */
  importQuestions: async (grammarId: number, data: any, mode: 'easy' | 'medium' | 'hard' = 'medium') => {
    const response = await axiosClient.post(
      `/grammar/grammars/${grammarId}/questions/import?mode=${mode}`,
      data
    );
    return response.data;
  },

  /**
   * Delete single question
   * DELETE /api/v1/grammar/grammars/{grammarId}/questions/{id}
   */
  deleteQuestion: async (grammarId: number, id: number) => {
    const response = await axiosClient.delete(`/grammar/grammars/${grammarId}/questions/${id}`);
    return response.data;
  },

  /**
   * Delete all questions for a grammar
   * DELETE /api/v1/grammar/grammars/{grammarId}/questions/delete-all
   */
  deleteAllQuestionsByGrammar: async (grammarId: number) => {
    const response = await axiosClient.delete(`/grammar/grammars/${grammarId}/questions/delete-all`);
    return response.data;
  },

  // ==========================================
  // GRAMMAR PRACTICE (By Mode: easy/medium/hard)
  // ==========================================

  getQuestionsByMode: async (topicId: number, mode: 'easy' | 'medium' | 'hard', count: number = 20): Promise<QuestionGrammar[]> => {
    const response = await axiosClient.get(`/grammar/topics/${topicId}/practice/${mode}`, {
      params: { count }
    });
    return response.data?.questions || [];
  },

  /**
   * Get random practice questions by topicId (new flow - GrammarId IS NULL)
   * GET /api/v1/grammar/topics/{topicId}/questions?mode=easy&pageSize=25
   */
  getQuestionsByTopic: async (
    topicId: number,
    mode?: 'easy' | 'medium' | 'hard',
    pageSize: number = 25
  ): Promise<{ items: QuestionGrammar[]; total: number }> => {
    const params: any = { pageSize };
    if (mode) params.mode = mode;
    const response = await axiosClient.get(`/grammar/topics/${topicId}/questions`, { params });
    return {
      items: response.data?.items || [],
      total: response.data?.total || 0,
    };
  },

  // ==========================================
  // GRAMMAR STATS & ANALYTICS (Progress Tab)
  // ==========================================

  /**
   * Get overall grammar statistics
   * GET /api/v1/users/{userId}/grammar/stats?period=7d|30d|90d|1y|all
   */
  getStats: async (userId: number, period: string = 'all'): Promise<any> => {
    const response = await axiosClient.get(`/users/${userId}/grammar/stats`, {
      params: { period }
    });
    return response.data;
  },

  /**
   * Get streak information
   * GET /api/v1/users/{userId}/grammar/stats/streak
   */
  getStreak: async (userId: number): Promise<any> => {
    const response = await axiosClient.get(`/users/${userId}/grammar/stats/streak`);
    return response.data;
  },

  /**
   * Get activity heatmap data
   * GET /api/v1/users/{userId}/grammar/stats/heatmap?weeks=52
   */
  getHeatmap: async (userId: number, weeks: number = 52): Promise<any> => {
    const response = await axiosClient.get(`/users/${userId}/grammar/stats/heatmap`, {
      params: { weeks }
    });
    return response.data;
  },

  /**
   * Get time distribution by time of day
   * GET /api/v1/users/{userId}/grammar/stats/time-distribution?period=all
   */
  getTimeDistribution: async (userId: number, period: string = 'all'): Promise<any> => {
    const response = await axiosClient.get(`/users/${userId}/grammar/stats/time-distribution`, {
      params: { period }
    });
    return response.data;
  },

  /**
   * Get progress for all groups with topics breakdown
   * GET /api/v1/users/{userId}/grammar/stats/groups
   */
  getGroupProgress: async (userId: number): Promise<any[]> => {
    const response = await axiosClient.get(`/users/${userId}/grammar/stats/groups`);
    return response.data || [];
  },

  /**
   * Get detailed progress for a specific topic
   * GET /api/v1/users/{userId}/grammar/stats/topics/{topicId}
   */
  getTopicProgress: async (userId: number, topicId: number): Promise<any | null> => {
    const response = await axiosClient.get(`/users/${userId}/grammar/stats/topics/${topicId}`);
    return response.data || null;
  },

  /**
   * Record a study session
   * POST /api/v1/users/{userId}/grammar/stats/record-session
   */
  recordStudySession: async (userId: number, data: {
    grammarId?: number;
    topicId?: number;
    groupId?: number;
    sessionType: 'lesson' | 'practice' | 'review';
    durationSeconds: number;
    questionsAnswered: number;
    correctAnswers: number;
  }) => {
    const response = await axiosClient.post(`/users/${userId}/grammar/stats/record-session`, data);
    return response.data;
  },

};

