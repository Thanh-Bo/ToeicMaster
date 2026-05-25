"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authService } from "../services/authService";
import { Mail, Lock, KeyRound, ArrowLeft, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Set email from searchParams after mounting to prevent SSR mismatch
  useEffect(() => {
    setEmail(searchParams.get("email") || "");
  }, [searchParams]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError("Mã OTP phải đúng 6 ký tự");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.resetPassword({ email, otp, newPassword });
      alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data || "Mã OTP không đúng hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-4 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md px-4 py-6">
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
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Đặt lại mật khẩu</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
              Nhập mã OTP và mật khẩu mới của bạn
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

          {/* Form */}
          <form onSubmit={handleReset} className="space-y-5">
            {/* Email (Readonly) */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-lg cursor-not-allowed outline-none"
                  value={email}
                  readOnly
                />
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                Email không thể thay đổi
              </p>
            </div>

            {/* OTP */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Mã OTP (6 số)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-700 dark:text-white text-zinc-900 rounded-lg focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-white dark:focus:border-white outline-none transition-all font-mono tracking-widest text-center text-lg focus:bg-white dark:focus:bg-zinc-800"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>

            {/* Mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Mật khẩu mới
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-2.5 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-white dark:focus:border-white outline-none transition-all placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-800"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none transition-all bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-800
                    ${
                      confirmPassword && newPassword !== confirmPassword
                        ? "border-red-300 dark:border-red-700"
                        : "border-zinc-200 dark:border-zinc-800"
                    }
                    ${
                      confirmPassword && newPassword === confirmPassword
                        ? "border-green-300 dark:border-green-700"
                        : ""
                    }`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {newPassword === confirmPassword ? (
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3 rounded-lg font-semibold hover:bg-black dark:hover:bg-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Đổi mật khẩu"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center border-t border-zinc-100 dark:border-zinc-800 pt-5">
            <Link href="/forgot-password" className="inline-flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white underline underline-offset-4 font-medium text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Gửi lại mã OTP
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-zinc-900 dark:border-white"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}