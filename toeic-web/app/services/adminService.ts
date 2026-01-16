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
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },
};
