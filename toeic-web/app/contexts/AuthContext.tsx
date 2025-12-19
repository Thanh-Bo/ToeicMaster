"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { authService } from "../services/authService";

// Types
export interface User {
  id: number;
  email: string;
  fullName: string;
  role?: string;
  balance: number;
  isPremium: boolean;
  premiumExpiredAt?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Routes không cần đăng nhập
const publicRoutes = ["/", "/login", "/register"];

// Routes cần đăng nhập
const protectedRoutes = ["/profile", "/history", "/tests", "/results"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("token");
      const userCookie = Cookies.get("user");

      if (token && userCookie) {
        try {
          // Load user từ cookie trước
          setUser(JSON.parse(userCookie));
          
          // Sau đó refresh từ API để đảm bảo data mới nhất
          const response = await authService.getMe();
          const userData = response.data;
          setUser(userData);
          Cookies.set("user", JSON.stringify(userData), { expires: 7 });
        } catch (error) {
          // Token hết hạn hoặc lỗi -> xóa và logout
          console.error("Auth init error:", error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Route protection
  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route) && pathname !== "/"
    );

    if (isProtectedRoute && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, pathname, router]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    setUser(null);
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const { token, refreshToken, user: userData } = response.data;

    Cookies.set("token", token, { expires: 7 });
    Cookies.set("refreshToken", refreshToken, { expires: 7 });
    Cookies.set("user", JSON.stringify(userData), { expires: 7 });
    
    setUser(userData);
  };

  const register = async (email: string, password: string, fullName: string) => {
    await authService.register({ email, password, fullName });
  };

  const logout = () => {
    handleLogout();
    router.push("/login");
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getMe();
      const userData = response.data;
      setUser(userData);
      Cookies.set("user", JSON.stringify(userData), { expires: 7 });
    } catch (error) {
      console.error("Refresh user error:", error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      Cookies.set("user", JSON.stringify(updatedUser), { expires: 7 });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook để sử dụng AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// HOC để bảo vệ route (optional usage)
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedRoute(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!loading && !user) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }, [user, loading, router, pathname]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return null;
    }

    return <Component {...props} />;
  };
}
