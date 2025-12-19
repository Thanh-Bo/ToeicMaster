"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { testService, HistoryItem } from "../services/testService";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
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
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-50 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải lịch sử làm bài...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TOEIC Master
              </span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Trang chủ
              </Link>
              <Link href="/history" className="text-blue-600 font-medium">
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Lịch sử làm bài</h1>
          <p className="text-gray-600">Xem lại kết quả các bài thi bạn đã hoàn thành</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Chưa có bài làm nào</h2>
            <p className="text-gray-500 mb-6">Hãy bắt đầu làm bài thi đầu tiên của bạn!</p>
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
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Tổng số bài làm</p>
                    <p className="text-2xl font-bold text-gray-800">{history.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Điểm cao nhất</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.max(...history.map((h) => h.totalScore))} điểm
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Điểm trung bình</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(history.reduce((sum, h) => sum + h.totalScore, 0) / history.length)} điểm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* History List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600">
                <h2 className="text-lg font-semibold text-white">Chi tiết các lần làm bài</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {history.map((item, index) => (
                  <div
                    key={item.attemptId}
                    className="p-6 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left - Test Info */}
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{item.testTitle}</h3>
                          <p className="text-gray-500 text-sm mt-1">
                            🕐 {formatDate(item.completedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Middle - Score */}
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-1">Điểm số</p>
                          <div className="flex items-baseline space-x-1">
                            <span
                              className={`text-3xl font-bold ${getScoreColor(
                                item.totalScore,
                                item.totalQuestions
                              )}`}
                            >
                              {item.totalScore}
                            </span>
                            <span className="text-gray-400">/{item.totalQuestions}</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-1">Tỷ lệ</p>
                          <span
                            className={`text-2xl font-bold ${getScoreColor(
                              item.totalScore,
                              item.totalQuestions
                            )}`}
                          >
                            {getScorePercent(item.totalScore, item.totalQuestions)}%
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="hidden lg:block w-32">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm"
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
      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          © 2024 TOEIC Master. Luyện thi TOEIC hiệu quả.
        </div>
      </footer>
    </div>
  );
}
