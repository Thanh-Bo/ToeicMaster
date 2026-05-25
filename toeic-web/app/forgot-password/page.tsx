"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import { Mail, ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-4 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center p-2 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <img src="/logo.ico" alt="TOEIC Masters Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 dark:text-white tracking-wider">TOEIC Masters</span>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900/30 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800/80 shadow-xs dark:shadow-none">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Quên mật khẩu?</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
              Nhập email của bạn để nhận mã xác thực OTP.
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-3.5 rounded-lg mb-4 text-sm flex items-center gap-2 animate-fade-in">
              <svg className="w-5 h-5 shrink-0 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-3.5 rounded-lg mb-4 text-sm flex items-center gap-2 animate-fade-in">
              <svg className="w-5 h-5 shrink-0 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Email của bạn
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none transition-all bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-white dark:focus:border-white"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3 rounded-lg font-semibold hover:bg-black dark:hover:bg-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi...
                </>
              ) : (
                "Gửi mã OTP"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center border-t border-zinc-100 dark:border-zinc-800 pt-5">
            <Link href="/login" className="inline-flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white underline underline-offset-4 font-medium text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Quay lại Đăng nhập
            </Link>
          </div>
        </div>

        {/* Footer copyright */}
        <p className="text-center mt-8 text-zinc-400 dark:text-zinc-500 text-xs">
          © 2026 TOEIC Masters. All rights reserved.
        </p>
      </div>
    </div>
  );
}