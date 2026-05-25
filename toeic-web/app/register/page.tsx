"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import { Globe, TrendingUp, GraduationCap, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Luyện TOEIC theo từng kỹ năng",
      subtitle:
        "Ôn Grammar, Vocabulary, Reading và Practice trong cùng một hệ thống.",
      icon: <Globe className="w-10 h-10 text-zinc-800 dark:text-zinc-200" />,
    },
    {
      title: "Học ngắn, làm đều mỗi ngày",
      subtitle:
        "Mỗi bài luyện tập được thiết kế ngắn gọn để bạn dễ duy trì thói quen học.",
      icon: (
        <TrendingUp className="w-10 h-10 text-zinc-800 dark:text-zinc-200" />
      ),
    },
    {
      title: "Theo dõi tiến độ rõ ràng",
      subtitle: "Xem kết quả luyện tập và biết phần nào cần cải thiện thêm.",
      icon: (
        <GraduationCap className="w-10 h-10 text-zinc-800 dark:text-zinc-200" />
      ),
    },
  ];
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    try {
      await register(email, password, fullName);
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      await loginWithGoogle(credentialResponse.credential);
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-zinc-950 overflow-x-hidden">
      {/* Cột trái: Carousel giới thiệu (chỉ hiện trên màn hình lg) */}
      <div className="hidden lg:flex relative flex-col justify-between p-16 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800/80 overflow-hidden">
        
        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center p-2 shadow-sm border border-zinc-200 dark:border-zinc-700">
            <img
              src="/logo.ico"
              alt="TOEIC Masters Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-wider text-zinc-900 dark:text-white">
            TOEIC Masters
          </span>
        </div>

        {/* Middle: Carousel / Slideshow */}
        <div className="relative z-10 my-auto max-w-lg w-full">
          <div className="min-h-[260px] flex flex-col justify-center relative">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`transition-all duration-700 ease-in-out absolute inset-0 flex flex-col justify-center ${
                  idx === currentSlide
                    ? "opacity-100 translate-x-0 pointer-events-auto"
                    : "opacity-0 translate-x-8 pointer-events-none"
                }`}
              >
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                  {slide.icon}
                </div>
                <h3 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight text-zinc-900 dark:text-white">
                  {slide.title}
                </h3>
                <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                  {slide.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 mt-8">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? "w-8 bg-zinc-900 dark:bg-white"
                    : "w-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Footer info */}
        <div className="relative z-10 text-sm text-zinc-400 dark:text-zinc-500">
          © 2026 TOEIC Masters. All rights reserved.
        </div>
      </div>

      {/* Cột phải: Form Đăng ký */}
      <div className="relative flex items-center justify-center p-6 bg-white dark:bg-zinc-950 min-h-screen">
        <div className="relative z-10 w-full max-w-md px-4 py-8">
          {/* Logo cho mobile/tablet */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-11 h-11 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center p-2 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <img
                src="/logo.ico"
                alt="TOEIC Masters Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-zinc-900 dark:text-white tracking-wider">
              TOEIC Masters
            </span>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-zinc-900/30 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800/80 shadow-xs dark:shadow-none">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Tạo tài khoản mới
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
                Bắt đầu hành trình chinh phục TOEIC
              </p>
            </div>

            {error && (
              <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-3.5 rounded-lg mb-4 text-sm flex items-center gap-2 animate-fade-in">
                <svg
                  className="w-5 h-5 shrink-0 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Họ và tên
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none transition-all bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-white dark:focus:border-white"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none transition-all bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-white dark:focus:border-white"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-12 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none transition-all bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-white dark:focus:border-white"
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none transition-all bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-white dark:focus:border-white
                      ${
                        confirmPassword && password !== confirmPassword
                          ? "border-red-300 dark:border-red-700"
                          : "border-zinc-200 dark:border-zinc-800"
                      }
                      ${
                        confirmPassword && password === confirmPassword
                          ? "border-green-300 dark:border-green-700"
                          : ""
                      }`}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {password === confirmPassword ? (
                        <svg
                          className="h-5 w-5 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 text-zinc-900 dark:text-white rounded focus:ring-zinc-900 dark:focus:ring-white border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Tôi đồng ý với{" "}
                  <a
                    href="#"
                    className="text-zinc-900 dark:text-white underline underline-offset-4 font-medium"
                  >
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a
                    href="#"
                    className="text-zinc-900 dark:text-white underline underline-offset-4 font-medium"
                  >
                    Chính sách bảo mật
                  </a>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3 rounded-lg font-semibold hover:bg-black dark:hover:bg-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>Đăng Ký Ngay</>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-zinc-900 dark:text-white font-semibold hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500">
                    hoặc
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Đăng nhập Google thất bại")}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="350"
                />
              </div>
            </div>
          </div>

          {/* Footer cho mobile */}
          <p className="text-center mt-8 text-zinc-400 dark:text-zinc-500 text-xs lg:hidden">
            © 2026 TOEIC Masters. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
