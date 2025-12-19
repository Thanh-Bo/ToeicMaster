"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { practiceService } from "../../services/practiceService";

interface HistoryItem {
  id: number;
  partNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpentSeconds: number;
  startedAt: string;
  completedAt: string;
}

export default function PracticeHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadHistory = async () => {
    try {
      const data = await practiceService.getHistory(page, 10);
      setHistory(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const partNames: Record<number, string> = {
    1: "Photographs",
    2: "Question-Response",
    3: "Conversations",
    4: "Short Talks",
    5: "Incomplete Sentences",
    6: "Text Completion",
    7: "Reading Comprehension"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📊 Lịch sử luyện tập</h1>
            <p className="text-gray-600 mt-1">Theo dõi tiến độ học tập của bạn</p>
          </div>
          <Link href="/practice" className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition text-gray-700">
            ← Luyện tập
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có lịch sử</h3>
            <p className="text-gray-600 mb-6">Bạn chưa hoàn thành phiên luyện tập nào</p>
            <Link
              href="/practice"
              className="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition"
            >
              Bắt đầu luyện tập
            </Link>
          </div>
        ) : (
          <>
            {/* History List */}
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        item.accuracy >= 80 ? "bg-green-100 text-green-600" :
                        item.accuracy >= 60 ? "bg-blue-100 text-blue-600" :
                        "bg-red-100 text-red-600"
                      }`}>
                        {item.partNumber}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          Part {item.partNumber}: {partNames[item.partNumber]}
                        </h3>
                        <p className="text-gray-500 text-sm">{formatDate(item.completedAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-bold text-gray-800">
                          {item.correctAnswers}/{item.totalQuestions}
                        </div>
                        <div className="text-gray-500 text-sm">câu đúng</div>
                      </div>
                      <div className={`text-2xl font-bold ${
                        item.accuracy >= 80 ? "text-green-600" :
                        item.accuracy >= 60 ? "text-blue-600" :
                        "text-red-600"
                      }`}>
                        {item.accuracy}%
                      </div>
                      <div className="text-gray-400">
                        ⏱️ {formatTime(item.timeSpentSeconds)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition"
                >
                  ←
                </button>
                <span className="px-4 py-2 bg-white rounded-lg shadow">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
