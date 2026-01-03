"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TestHistoryItem, testService } from "../services/testService";

export default function HistoryPage() {
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 dark:border-blue-500 border-opacity-50 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Đang tải lịch sử làm bài...</p>
        </div>
      </div>
    );
  }

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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">📊 Lịch sử làm bài</h1>
          <p className="text-gray-600 dark:text-gray-400">Xem lại kết quả các bài thi bạn đã hoàn thành</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {history.length === 0 ? (
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
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-zinc-700">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Tổng số bài làm</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{history.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-zinc-700">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Điểm cao nhất</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.max(...history.map((h) => h.totalScore))} điểm
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-zinc-700">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Điểm trung bình</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {Math.round(history.reduce((sum, h) => sum + h.totalScore, 0) / history.length)} điểm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* History List */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-zinc-700">
              <div className="px-6 py-4 bg-blue-600 ">
                <h2 className="text-lg font-semibold text-white">Chi tiết các lần làm bài</h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-zinc-700">
                {history.map((item, index) => (
                  <div
                    key={item.attemptId}
                    className="p-6 hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors duration-200 border-gray-100 dark:border-zinc-700"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left - Test Info */}
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-500  rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{item.testTitle}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            🕐 {formatDate(item.completedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Middle - Score */}
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Điểm số</p>
                          <div className="flex items-baseline space-x-1">
                            <span
                              className={`text-3xl font-bold ${
                                getScorePercent(item.totalScore, item.totalQuestions) >= 80
                                  ? "text-green-600 dark:text-green-400"
                                  : getScorePercent(item.totalScore, item.totalQuestions) >= 60
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {item.totalScore}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500">/{item.totalQuestions}</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tỷ lệ</p>
                          <span
                            className={`text-2xl font-bold ${
                              getScorePercent(item.totalScore, item.totalQuestions) >= 80
                                ? "text-green-600 dark:text-green-400"
                                : getScorePercent(item.totalScore, item.totalQuestions) >= 60
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {getScorePercent(item.totalScore, item.totalQuestions)}%
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="hidden lg:block w-32">
                          <div className="h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                getScorePercent(item.totalScore, item.totalQuestions) >= 80
                                  ? "bg-green-500"
                                  : getScorePercent(item.totalScore, item.totalQuestions) >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${getScorePercent(item.totalScore, item.totalQuestions)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Right - Action */}
                      <Link
                        href={`/results/${item.attemptId}`}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600  text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm"
                      >
                        👁️ Xem chi tiết
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
