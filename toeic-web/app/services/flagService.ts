import axiosClient from "./axiosClient";

/**
 * Đánh dấu câu hỏi "Lưu lại để xem sau".
 * Backend: ToeicMaster.API/Controllers/FlagsController.cs (bảng dbo.QuestionFlags)
 */
export const flagService = {
  // Tất cả câu đã đánh dấu của user
  getAll: async (): Promise<number[]> => {
    const response = await axiosClient.get("/flags");
    return (response.data?.flaggedIds ?? []) as number[];
  },

  // Kiểm tra hàng loạt câu hỏi đã đánh dấu chưa
  checkBatch: async (questionIds: number[]): Promise<number[]> => {
    if (!questionIds.length) return [];
    const response = await axiosClient.post("/flags/check-batch", questionIds);
    return (response.data?.flaggedIds ?? []) as number[];
  },

  // Thêm đánh dấu (idempotent)
  add: async (questionId: number) => {
    const response = await axiosClient.post("/flags", { questionId });
    return response.data as { flagged: boolean; questionId: number };
  },

  // Bỏ đánh dấu (idempotent)
  remove: async (questionId: number) => {
    const response = await axiosClient.delete(`/flags/${questionId}`);
    return response.data as { flagged: boolean; questionId: number };
  },

  // Đảo trạng thái, trả về trạng thái mới
  toggle: async (questionId: number): Promise<boolean> => {
    const response = await axiosClient.post("/flags/toggle", { questionId });
    return Boolean(response.data?.flagged);
  },
};
