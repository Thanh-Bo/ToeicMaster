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

  // Hàm đổi mật khẩu
  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    return axiosClient.post("/auth/change-password", data);
  },
};