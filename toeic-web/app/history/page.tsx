"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TestHistoryItem, testService } from "../services/testService";

export default function HistoryPage() {
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await testService.getHistory();
        if (response.success) {
          setHistory(response.data);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push("/login");
        } else {
          setError("Không thể tải lịch sử làm bài");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [router]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score: number, total: number) => {
    const percent = (score / total) * 100;
    if (percent >= 80) return "text-green-600";
    if (percent >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScorePercent = (score: number, total: number) => {
    return Math.round((score / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 bg-linear-to-br from-blue-50 dark:from-zinc-900 via-white dark:via-zinc-800 to-indigo-50 dark:to-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 dark:border-blue-500 border-opacity-50"></div>
            <div className="absolute inset-0 rounded-full border-2 border-blue-600 dark:border-blue-400 blur-md opacity-50"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Đang tải lịch sử làm bài...</p>
        </div>
      </div>
    );
  }

  const filteredAndSortedHistory = history
    .filter(item => item.testTitle.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
        case 'highest':
          return b.totalScore - a.totalScore;
        case 'lowest':
          return a.totalScore - b.totalScore;
        case 'newest':
        default:
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900  ">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-blue-600 bg-clip-text text-transparent">
                TOEIC Master
              </span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Trang chủ
              </Link>
              <Link href="/history" className="text-blue-600 dark:text-blue-400 font-medium">
                Lịch sử làm bài
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-900 dark:via-zinc-800 dark:to-indigo-900 py-12 md:py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 dark:bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 animate-fade-in">📊 Lịch sử làm bài của bạn</h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto animate-fade-in animation-delay-200">Theo dõi tiến độ học tập, phân tích điểm số và cải thiện kết quả thi TOEIC</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 text-red-600 dark:text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center space-x-3">
            <span className="text-2xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {filteredAndSortedHistory.length === 0 && history.length === 0 ? (
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-12 text-center border border-gray-100 dark:border-zinc-700">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">Chưa có bài làm nào</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Hãy bắt đầu làm bài thi đầu tiên của bạn!</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
            >
              🚀 Khám phá đề thi
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl shadow-md p-6 border border-blue-200 dark:border-blue-700/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    📚
                  </div>
                  <div>
                    <p className="text-blue-600 dark:text-blue-300 text-sm font-medium">Tổng số bài làm</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{history.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl shadow-md p-6 border border-green-200 dark:border-green-700/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    🎯
                  </div>
                  <div>
                    <p className="text-green-600 dark:text-green-300 text-sm font-medium">Điểm cao nhất</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-300 dark:to-green-400 bg-clip-text text-transparent">
                      {Math.max(...history.map((h) => h.totalScore))}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl shadow-md p-6 border border-purple-200 dark:border-purple-700/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    📈
                  </div>
                  <div>
                    <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">Điểm trung bình</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-300 dark:to-purple-400 bg-clip-text text-transparent">
                      {Math.round(history.reduce((sum, h) => sum + h.totalScore, 0) / history.length)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-zinc-700">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="🔍 Tìm kiếm tên bài thi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                {/* Sort */}
                <div className="w-full md:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="newest">📅 Mới nhất</option>
                    <option value="oldest">📅 Cũ nhất</option>
                    <option value="highest">⬆️ Điểm cao nhất</option>
                    <option value="lowest">⬇️ Điểm thấp nhất</option>
                  </select>
                </div>
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  Tìm thấy <span className="font-semibold text-gray-700 dark:text-gray-300">{filteredAndSortedHistory.length}</span> kết quả cho "<span className="font-semibold text-gray-700 dark:text-gray-300">{searchQuery}</span>"
                </p>
              )}
            </div>

            {/* No Results */}
            {filteredAndSortedHistory.length === 0 ? (
              <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-12 text-center border border-gray-100 dark:border-zinc-700">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">Không tìm thấy bài làm</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Thử tìm kiếm với từ khóa khác</p>
              </div>
            ) : null}

            {/* History List */}
            {filteredAndSortedHistory.length > 0 && (
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-zinc-700">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
                <h2 className="text-lg font-semibold text-white">Chi tiết các lần làm bài</h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-zinc-700">
                {filteredAndSortedHistory.map((item, index) => {
                  const percentage = getScorePercent(item.totalScore, item.totalQuestions);
                  const scoreColor = percentage >= 80 ? 'from-green-500 to-green-600' : percentage >= 60 ? 'from-yellow-500 to-yellow-600' : 'from-red-500 to-red-600';
                  return (
                  <div
                    key={item.attemptId}
                    className="p-6 hover:bg-blue-50 dark:hover:bg-zinc-700/50 transition-all duration-200 border-gray-100 dark:border-zinc-700 hover:shadow-md"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left - Test Info */}
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group hover:scale-110 transition-transform">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.testTitle}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            🕐 {formatDate(item.completedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Middle - Score with Circular Progress */}
                      <div className="flex items-center justify-center gap-6">
                        {/* Circular Progress */}
                        <div className="flex flex-col items-center">
                          <div className="relative w-20 h-20">
                            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                              {/* Background circle */}
                              <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200 dark:text-zinc-700" />
                              {/* Progress circle */}
                              <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke="url(#gradient)"
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 36}`}
                                strokeDashoffset={`${2 * Math.PI * 36 * (1 - percentage / 100)}`}
                                strokeLinecap="round"
                                className="transition-all duration-500"
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor={percentage >= 80 ? '#10b981' : percentage >= 60 ? '#eab308' : '#ef4444'} />
                                  <stop offset="100%" stopColor={percentage >= 80 ? '#059669' : percentage >= 60 ? '#ca8a04' : '#dc2626'} />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className={`text-xl font-bold bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>{percentage}%</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{item.totalScore}/{item.totalQuestions}</p>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="hidden lg:flex lg:flex-col lg:items-center">
                          <div className="w-32 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${scoreColor}`}
                              style={{
                                width: `${percentage}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Right - Action */}
                      <Link
                        href={`/results/${item.attemptId}`}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm group w-full md:w-auto"
                      >
                        👁️ <span className="ml-1">Xem chi tiết</span>
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-800 border-t border-gray-100 dark:border-zinc-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          © 2024 TOEIC Master. Luyện thi TOEIC hiệu quả.
        </div>
      </footer>
    </div>
  );
}
