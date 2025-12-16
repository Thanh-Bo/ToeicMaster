import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: "http://localhost:5298/api/v1", // Cấu hình Base URL chung
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Tự động gắn Token vào mọi Request (Nếu có)
axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Xử lý lỗi chung (Ví dụ: Token hết hạn -> Tự logout)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
        // Nếu lỗi 401 (Unauthorized), tự động xóa token và đẩy về login
        // Cookies.remove("token");
        // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;