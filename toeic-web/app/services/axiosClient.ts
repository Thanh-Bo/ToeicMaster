import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: "http://localhost:5298/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag để tránh gọi refresh nhiều lần
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Interceptor: Tự động gắn Token vào mọi Request
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

// Interceptor: Xử lý lỗi 401 -> Auto refresh token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu đang refresh, đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get("refreshToken");
      
      if (!refreshToken) {
        // Không có refresh token -> logout
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh token
        const response = await axios.post(
          "http://localhost:5298/api/v1/auth/refresh-token",
          { refreshToken }
        );

        const { token: newToken, refreshToken: newRefreshToken } = response.data;

        // Lưu token mới
        Cookies.set("token", newToken, { expires: 7 });
        Cookies.set("refreshToken", newRefreshToken, { expires: 7 });

        // Retry các request đang đợi
        processQueue(null, newToken);

        // Retry request gốc
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
        
      } catch (refreshError) {
        // Refresh thất bại -> logout
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper: Xử lý logout
const handleLogout = () => {
  Cookies.remove("token");
  Cookies.remove("refreshToken");
  Cookies.remove("user");
  
  // Chỉ redirect nếu đang ở client
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

export default axiosClient;