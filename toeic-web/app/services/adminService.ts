import axiosClient from "./axiosClient";
import { AdminTest, AdminUser, AdminQuestion, DashboardStats } from "@/app/types";
import type { Grammar, GrammarTopic, QuestionGrammar } from "@/app/types";


// ===== DASHBOARD =====
export const adminService = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosClient.get<DashboardStats>("/admin/dashboard");
    return response.data;
  },

  // Users
  getUsers: async (page: number = 1, pageSize: number = 10): Promise<{ items: AdminUser[], total: number }> => {
    const response = await axiosClient.get<{ items: AdminUser[], total: number }>(("/admin/users"), {
      params: { page, pageSize }
    });
    return {
      items: response.data.items || [],
      total: response.data.total || 0
    };
  },

  toggleUserStatus: async (userId: number): Promise<void> => {
    await axiosClient.post(`/admin/users/${userId}/toggle-status`);
  },

  grantUserPremium: async (userId: number, durationMonths: number = 6): Promise<{
    isPremium: boolean;
    premiumExpiredAt: string | null;
  }> => {
    const response = await axiosClient.post(`/premium/users/${userId}/grant`, {
      durationMonths,
      note: "Admin granted from users management",
    });
    return {
      isPremium: response.data?.isPremium ?? true,
      premiumExpiredAt: response.data?.premiumExpiredAt ?? null,
    };
  },

  revokeUserPremium: async (userId: number): Promise<{
    isPremium: boolean;
    premiumExpiredAt: string | null;
  }> => {
    const response = await axiosClient.delete(`/premium/users/${userId}`);
    return {
      isPremium: response.data?.isPremium ?? false,
      premiumExpiredAt: response.data?.premiumExpiredAt ?? null,
    };
  },

  // Tests
  getTests: async (): Promise<AdminTest[]> => {
    const response = await axiosClient.get<AdminTest[] | { items?: AdminTest[], data?: AdminTest[] }>("/admin/tests?pageSize=1000");
    let data: AdminTest[] = [];
    
    if (Array.isArray(response.data)) {
      data = response.data;
    } else if (response.data?.items) {
      data = response.data.items;
    } else if (response.data?.data) {
      data = response.data.data;
    }
    
    return data;
  },

  deleteTest: async (testId: number): Promise<void> => {
    await axiosClient.delete(`/admin/tests/${testId}`);
  },

  updateTestExplanationAccess: async (
    testId: number,
    isExplanationPremiumRequired: boolean
  ): Promise<void> => {
    await axiosClient.put(`/admin/tests/${testId}/explanation-access`, {
      isExplanationPremiumRequired,
    });
  },

  // Grammar management
  getGrammarGroups: async (): Promise<Array<{
    id: number;
    groupGuid: string;
    title: string;
    description?: string;
    order: number;
    totalTopics: number;
  }>> => {
    const response = await axiosClient.get("/grammar/groups");
    return response.data || [];
  },

  getGrammarTopicsByGroup: async (groupGuid: string): Promise<GrammarTopic[]> => {
    const response = await axiosClient.get(`/grammar/groups/${groupGuid}/topics`);
    return response.data || [];
  },

  getGrammarRulesByTopic: async (topicId: number): Promise<Grammar[]> => {
    const response = await axiosClient.get(`/grammar/groups/topics/${topicId}/grammars`);
    return response.data || [];
  },

  getGrammarQuestionsByRule: async (grammarId: number): Promise<{ items: QuestionGrammar[]; total: number }> => {
    const response = await axiosClient.get(`/grammar/grammars/${grammarId}/questions`);
    return {
      items: response.data?.items || [],
      total: response.data?.total || 0,
    };
  },

  updateGrammarRuleQuestionsAccess: async (
    grammarId: number,
    isQuestionsPremiumRequired: boolean
  ): Promise<void> => {
    await axiosClient.put(`/admin/grammar/rules/${grammarId}/questions-access`, {
      isQuestionsPremiumRequired,
    });
  },

  updateVocabularyExplanationAccess: async (
    topicId: number,
    isExplanationPremiumRequired: boolean
  ): Promise<void> => {
    await axiosClient.put(`/admin/vocabulary/topics/${topicId}/explanation-access`, {
      isExplanationPremiumRequired,
    });
  },

  // Questions
  getQuestionsByTest: async (testId: number): Promise<AdminQuestion[]> => {
    const response = await axiosClient.get<{ items: AdminQuestion[] }>(
      `/admin/tests/${testId}/questions`
    );
    return response.data.items || [];
  },

  // Import Excel
  importPartData: async (
    testId: number,
    partNumber: number,
    excelFile: File
  ): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append("excelFile", excelFile);

    const endpoint = `/admin/import-part${partNumber}-data-only?testId=${testId}`;
    const response = await axiosClient.post<{ message: string }>(endpoint, formData, {
      headers: { 
        // Remove explicit Content-Type header - let axios/browser set it automatically
        // "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // AI Explanations
  generateExplanationsForTest: async (testId: number): Promise<{ message: string; taskId: string; totalUpdated?: number; totalErrors?: number; totalQuestions?: number }> => {
    const response = await axiosClient.post(`/admin/tests/${testId}/generate-explanations`);
    return response.data;
  },

  generateExplanationsForPart: async (testId: number, partNumber: number): Promise<{ message: string; taskId: string; totalUpdated?: number; totalErrors?: number; totalQuestions?: number }> => {
    const response = await axiosClient.post(`/admin/tests/${testId}/parts/${partNumber}/generate-explanations`);
    return response.data;
  },

  // AI Translations - Transcripts (Part 3/4)
  translateTranscriptsForTest: async (testId: number): Promise<{ message: string; taskId: string; totalTranslated?: number; totalErrors?: number; totalGroups?: number }> => {
    const response = await axiosClient.post(`/admin/tests/${testId}/translate-transcripts`);
    return response.data;
  },

  translateTranscriptsForPart: async (testId: number, partNumber: number): Promise<{ message: string; taskId: string; totalTranslated?: number; totalErrors?: number; totalGroups?: number }> => {
    const response = await axiosClient.post(`/admin/tests/${testId}/parts/${partNumber}/translate-transcripts`);
    return response.data;
  },

  // AI Translations - Passages (Part 6/7)
  translatePassagesForTest: async (testId: number): Promise<{ message: string; taskId: string; totalTranslated?: number; totalErrors?: number; totalGroups?: number }> => {
    const response = await axiosClient.post(`/admin/tests/${testId}/translate-passages`);
    return response.data;
  },

  translatePassagesForPart: async (testId: number, partNumber: number): Promise<{ message: string; taskId: string; totalTranslated?: number; totalErrors?: number; totalGroups?: number }> => {
    const response = await axiosClient.post(`/admin/tests/${testId}/parts/${partNumber}/translate-passages`);
    return response.data;
  },

  // Task Status Polling
  getTaskStatus: async (taskId: string): Promise<{
    taskId: string;
    status: "processing" | "completed";
    totalItems: number;
    completedItems: number;
    errorItems: number;
    progress: number;
    isComplete: boolean;
  }> => {
    try {
      const response = await axiosClient.get(`/admin/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      // Task not found or expired
      throw error;
    }
  },

  // ==========================================
  // READING TOPIC MANAGEMENT
  // ==========================================

  getReadingTopics: async (partType?: string, difficulty?: string): Promise<any[]> => {
    const response = await axiosClient.get("/reading-practice/topics", {
      params: { partType: partType || "all", difficulty: difficulty || "all" },
    });
    return response.data || [];
  },

  toggleReadingTopicActive: async (topicId: number): Promise<any> => {
    const response = await axiosClient.patch(`/reading-practice/topics/${topicId}/toggle-active`);
    return response.data;
  },

  toggleReadingTopicPremium: async (topicId: number): Promise<any> => {
    const response = await axiosClient.patch(`/reading-practice/topics/${topicId}/toggle-premium`);
    return response.data;
  },

  deleteReadingTopic: async (topicId: number): Promise<any> => {
    const response = await axiosClient.delete(`/reading-practice/topics/${topicId}`);
    return response.data;
  },
};
