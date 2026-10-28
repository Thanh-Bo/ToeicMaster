import axiosClient from "./axiosClient";

export const authService = {
  // Hàm Login
  login: (data: { email: string; password: string }) => {
    return axiosClient.post("/auth/login", data);
  },

  // Hàm Register
  register: (data: { email: string; password: string; fullName: string }) => {
    return axiosClient.post("/auth/register", data);
  },

  // Hàm lấy thông tin User (Không cần truyền Token vì axiosClient tự gắn rồi)
  getMe: () => {
    return axiosClient.get("/auth/me");
  },

  // Hàm cập nhật thông tin profile
  updateProfile: (data: { fullName: string }) => {
    return axiosClient.put("/auth/update-profile", data);
  },

  // Hàm upload avatar
  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/auth/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Hàm đổi mật khẩu
  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    return axiosClient.post("/auth/change-password", data);
  },

  forgotPassword: async (email: string) => {
    // Gọi API: POST /api/v1/Auth/forgot-password
    return axiosClient.post(`auth/forgot-password`, { email });
  },

  // 2. Gửi yêu cầu đổi pass (kèm OTP)
  resetPassword: async (data: { email: string; otp: string; newPassword: string }) => {
    // Gọi API: POST /api/v1/Auth/reset-password
    return axiosClient.post(`auth/reset-password`, data);
  }
};