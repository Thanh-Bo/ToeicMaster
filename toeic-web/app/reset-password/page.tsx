"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "../services/authService";


function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Tự điền email từ URL nếu có
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.resetPassword({ email, otp, newPassword });
      
      alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      router.push("/login"); // Về trang login
      
    } catch (err: any) {
      setError(err.response?.data || "Mã OTP không đúng hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Đặt lại mật khẩu</h2>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleReset} className="space-y-4">
          {/* Email (Readonly cho tiện, hoặc cho sửa cũng được) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              value={email}
              readOnly
            />
          </div>

          {/* OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã OTP (6 số)</label>
            <input
              type="text"
              required
              maxLength={6}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono tracking-widest text-center"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Bọc Suspense vì dùng useSearchParams
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}