"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { testService } from "./services/testService";
import { useAuth } from "./contexts/AuthContext";

// 1. Định nghĩa kiểu dữ liệu
interface TestSummary {
  id: number;
  title: string;
  slug?: string;
  type?: string;
  duration: number;
  totalQuestions: number;
  totalParticipants?: number;
}

export default function HomePage() {
  const { user, logout } = useAuth();
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    testService.getList()
      .then((res) => {
        setTests(res.data.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Không thể tải danh sách đề thi. Vui lòng thử lại sau.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    logout();
  };

  // Filter đề thi theo type
  const filteredTests = filter === "all" 
    ? tests 
    : tests.filter(t => t.type?.toLowerCase() === filter);

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* ========== HEADER ========== */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            
            <span className="text-xl font-bold text-gray-800 hidden sm:block">TOEIC Master</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium text-sm hidden md:block">
              Đề thi
            </Link>
            <Link href="/practice" className="text-gray-600 hover:text-blue-600 font-medium text-sm hidden md:block">
              Luyện tập
            </Link>
            <Link href="/vocabulary" className="text-gray-600 hover:text-blue-600 font-medium text-sm hidden md:block">
              Từ vựng
            </Link>
            <Link href="/bookmarks" className="text-gray-600 hover:text-blue-600 font-medium text-sm hidden md:block">
              Đánh dấu
            </Link>
            <Link href="/statistics" className="text-gray-600 hover:text-blue-600 font-medium text-sm hidden md:block">
              Thống kê
            </Link>
            <Link href="/leaderboard" className="text-gray-600 hover:text-blue-600 font-medium text-sm hidden md:block">
              Xếp hạng
            </Link>
            <Link href="/history" className="text-gray-600 hover:text-blue-600 font-medium text-sm hidden md:block">
              Lịch sử
            </Link>
            
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition">
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="font-medium text-gray-700 text-sm hidden sm:block">{user.fullName}</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-sm text-gray-500 hover:text-red-600 transition"
                  title="Đăng xuất"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium text-sm px-3 py-2">
                  Đăng nhập
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-md shadow-blue-200">
                  Đăng ký miễn phí
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* ========== HERO BANNER ========== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-700"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white/90 text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Miễn phí 100% • Không giới hạn
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Luyện thi TOEIC <br className="hidden md:block"/>
              <span className="text-yellow-300">hiệu quả & thông minh</span>
            </h1>
            
            <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
              Kho đề thi chuẩn format ETS, giải thích chi tiết bằng AI, 
              giúp bạn đạt 900+ điểm TOEIC nhanh chóng.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#tests" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg">
                Bắt đầu luyện thi →
              </a>
              <Link href="/register" className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-medium hover:bg-white/20 transition border border-white/30">
                Tạo tài khoản miễn phí
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{tests.length}+</div>
              <div className="text-blue-200 text-sm">Đề thi</div>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="text-2xl md:text-3xl font-bold text-white">1000+</div>
              <div className="text-blue-200 text-sm">Câu hỏi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">AI</div>
              <div className="text-blue-200 text-sm">Giải thích</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== QUICK ACCESS FEATURES ========== */}
      <section className="max-w-6xl mx-auto px-4 py-12 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link 
            href="/practice" 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl hover:border-blue-200 transition-all group text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500 transition">
              <span className="text-2xl group-hover:scale-110 transition">🎯</span>
            </div>
            <h3 className="font-bold text-gray-800 text-sm">Luyện tập</h3>
            <p className="text-gray-500 text-xs mt-1">Theo từng Part</p>
          </Link>

          <Link 
            href="/vocabulary" 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl hover:border-green-200 transition-all group text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500 transition">
              <span className="text-2xl group-hover:scale-110 transition">📖</span>
            </div>
            <h3 className="font-bold text-gray-800 text-sm">Từ vựng</h3>
            <p className="text-gray-500 text-xs mt-1">Flashcards</p>
          </Link>

          <Link 
            href="/bookmarks" 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl hover:border-orange-200 transition-all group text-center"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-500 transition">
              <span className="text-2xl group-hover:scale-110 transition">🔖</span>
            </div>
            <h3 className="font-bold text-gray-800 text-sm">Đánh dấu</h3>
            <p className="text-gray-500 text-xs mt-1">Câu hỏi khó</p>
          </Link>

          <Link 
            href="/statistics" 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl hover:border-purple-200 transition-all group text-center"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-500 transition">
              <span className="text-2xl group-hover:scale-110 transition">📊</span>
            </div>
            <h3 className="font-bold text-gray-800 text-sm">Thống kê</h3>
            <p className="text-gray-500 text-xs mt-1">Tiến độ học</p>
          </Link>

          <Link 
            href="/leaderboard" 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl hover:border-yellow-200 transition-all group text-center"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-500 transition">
              <span className="text-2xl group-hover:scale-110 transition">🏆</span>
            </div>
            <h3 className="font-bold text-gray-800 text-sm">Xếp hạng</h3>
            <p className="text-gray-500 text-xs mt-1">Top điểm cao</p>
          </Link>

          <Link 
            href="/history" 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl hover:border-indigo-200 transition-all group text-center"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-500 transition">
              <span className="text-2xl group-hover:scale-110 transition">📋</span>
            </div>
            <h3 className="font-bold text-gray-800 text-sm">Lịch sử</h3>
            <p className="text-gray-500 text-xs mt-1">Bài đã làm</p>
          </Link>
        </div>
      </section>

      {/* ========== DANH SÁCH ĐỀ THI ========== */}
      <section id="tests" className="max-w-6xl mx-auto px-4 py-12">
        {/* Header + Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📚 Thư viện đề thi</h2>
            <p className="text-gray-500">Chọn một đề để bắt đầu luyện tập ngay</p>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {[
              { key: "all", label: "Tất cả" },
              { key: "full_test", label: "Full Test" },
              { key: "mini_test", label: "Mini Test" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition
                  ${filter === tab.key 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Test Cards */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-red-50 text-red-600 rounded-xl border border-red-200">
            ❌ {error}
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            📭 {filter === "all" ? "Hiện chưa có đề thi nào." : "Không có đề thi phù hợp."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test, index) => (
              <div 
                key={test.id} 
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden"
              >
                {/* Card Header with gradient */}
                <div className={`h-24 relative overflow-hidden ${
                  index % 3 === 0 ? "bg-linear-to-br from-blue-500 to-blue-700" :
                  index % 3 === 1 ? "bg-linear-to-br from-purple-500 to-indigo-700" :
                  "bg-linear-to-br from-emerald-500 to-teal-700"
                }`}>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {test.type === "FULL_TEST" ? "Full Test" : test.type === "MINI_TEST" ? "Mini Test" : "Practice"}
                    </span>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition">
                    {test.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {test.duration} phút
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {test.totalQuestions} câu
                    </span>
                    {test.totalParticipants && test.totalParticipants > 0 && (
                      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {test.totalParticipants}
                      </span>
                    )}
                  </div>
                  
                  <Link 
                    href={`/tests/${test.id}`} 
                    className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200/50"
                  >
                    Làm bài ngay →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                T
              </div>
              <span className="text-xl font-bold text-white">TOEIC Master</span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/" className="hover:text-white transition">Trang chủ</Link>
              <Link href="/practice" className="hover:text-white transition">Luyện tập</Link>
              <Link href="/vocabulary" className="hover:text-white transition">Từ vựng</Link>
              <Link href="/bookmarks" className="hover:text-white transition">Đánh dấu</Link>
              <Link href="/statistics" className="hover:text-white transition">Thống kê</Link>
              <Link href="/leaderboard" className="hover:text-white transition">Xếp hạng</Link>
              <Link href="/history" className="hover:text-white transition">Lịch sử</Link>
            </div>
            
            <div className="text-sm">
              © 2024 TOEIC Master. Made with ❤️
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}