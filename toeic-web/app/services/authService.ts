import axiosClient from "./axiosClient";

export const authService = {
  // Hàm Login
  login: (data: any) => {
    return axiosClient.post("/auth/login", data);
  },

  // Hàm Register
  register: (data: any) => {
    return axiosClient.post("/auth/register", data);
  },

  // Hàm lấy thông tin User (Không cần truyền Token vì axiosClient tự gắn rồi)
  getMe: () => {
    return axiosClient.get("/auth/me");
  }
};