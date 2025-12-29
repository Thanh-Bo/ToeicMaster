"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // Thông báo thành công
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await authService.forgotPassword(email);
      setMessage(`Mã OTP đã được gửi đến ${email}. Vui lòng kiểm tra hộp thư.`);
      
      // Sau 2 giây, chuyển sang trang nhập OTP, mang theo email cho tiện
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
      
    } catch (err: any) {
      setError(err.response?.data || "Không thể gửi email. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Quên mật khẩu?</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Nhập email của bạn để nhận mã xác thực OTP.
        </p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Gửi mã OTP"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-blue-600 text-sm hover:underline">
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}