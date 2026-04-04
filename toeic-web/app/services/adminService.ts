import axiosClient from "./axiosClient";
import { AdminTest, AdminUser, AdminQuestion, DashboardStats } from "@/app/types";


// ===== DASHBOARD =====
export const adminService = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosClient.get<DashboardStats>("/admin/dashboard");
    return response.data;
  },

  // Users
  getUsers: async (): Promise<AdminUser[]> => {
    const response = await axiosClient.get<{ items: AdminUser[] }>("/admin/users");
    return response.data.items || [];
  },

  toggleUserStatus: async (userId: number): Promise<void> => {
    await axiosClient.post(`/admin/users/${userId}/toggle-status`);
  },

  // Tests
  getTests: async (): Promise<AdminTest[]> => {
    const response = await axiosClient.get<AdminTest[] | { items?: AdminTest[], data?: AdminTest[] }>("/tests");
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
  generateExplanationsForTest: async (testId: number): Promise<{ message: string; totalUpdated: number; totalErrors: number; totalQuestions: number }> => {
    const response = await axiosClient.post(`/admin/tests/${testId}/generate-explanations`);
    return response.data;
  },

  generateExplanationsForPart: async (testId: number, partNumber: number): Promise<{ message: string; totalUpdated: number; totalErrors: number; totalQuestions: number }> => {
    const response = await axiosClient.post(`/admin/tests/${testId}/parts/${partNumber}/generate-explanations`);
    return response.data;
  },

  // AI Translations - Transcripts (Part 3/4)
  translateTranscriptsForTest: async (testId: number): Promise<{ message: string; totalTranslated: number; totalErrors: number; totalGroups: number }> => {
    const response = await axiosClient.post(`/admin/tests/${testId}/translate-transcripts`);
    return response.data;
  },

  translateTranscriptsForPart: async (testId: number, partNumber: number): Promise<{ message: string; totalTranslated: number; totalErrors: number; totalGroups: number }> => {
    const response = await axiosClient.post(`/admin/tests/${testId}/parts/${partNumber}/translate-transcripts`);
    return response.data;
  },

  // AI Translations - Passages (Part 6/7)
  translatePassagesForTest: async (testId: number): Promise<{ message: string; totalTranslated: number; totalErrors: number; totalGroups: number }> => {
    const response = await axiosClient.post(`/admin/tests/${testId}/translate-passages`);
    return response.data;
  },

  translatePassagesForPart: async (testId: number, partNumber: number): Promise<{ message: string; totalTranslated: number; totalErrors: number; totalGroups: number }> => {
    const response = await axiosClient.post(`/admin/tests/${testId}/parts/${partNumber}/translate-passages`);
    return response.data;
  },
};
