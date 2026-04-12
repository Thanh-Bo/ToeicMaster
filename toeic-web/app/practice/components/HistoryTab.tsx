"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Target, TrendingUp, FileText, Search, Eye, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { TestHistoryItem } from "@/app/types";
import { testService } from "@/app/services/testService";

const ITEMS_PER_PAGE = 10;

export default function HistoryTab() {
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

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

  const getScorePercent = (score: number, total: number) => Math.round((score / total) * 100);

  const getScoreStrokeColor = (pct: number) => {
    if (pct >= 80) return "#10b981";
    if (pct >= 60) return "#eab308";
    return "#ef4444";
  };

  const getScoreTextColor = (pct: number) => {
    if (pct >= 80) return "text-green-600";
    if (pct >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-zinc-700 border-t-gray-900 dark:border-t-white"></div>
      </div>
    );
  }

  const filteredAndSortedHistory = history
    .filter(item => item.testTitle.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest': return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
        case 'highest': return b.totalScore - a.totalScore;
        case 'lowest': return a.totalScore - b.totalScore;
        default: return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      }
    });

  const totalPages = Math.ceil(filteredAndSortedHistory.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedHistory = filteredAndSortedHistory.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      {filteredAndSortedHistory.length === 0 && history.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 dark:border-zinc-700 p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-zinc-600 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Chưa có bài làm nào</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Hãy bắt đầu làm bài thi đầu tiên của bạn!</p>
          <Link
            href="/practice"
            className="inline-flex items-center px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition"
          >
            Khám phá đề thi
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <BookOpen className="w-5 h-5" />, label: "Tổng số bài làm", value: history.length },
              { icon: <Target className="w-5 h-5" />, label: "Điểm cao nhất", value: Math.max(...history.map(h => h.totalScore)) },
              { icon: <TrendingUp className="w-5 h-5" />, label: "Điểm trung bình", value: Math.round(history.reduce((s, h) => s + h.totalScore, 0) / history.length) },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 dark:border-zinc-700 p-5 hover:shadow-md hover:scale-105 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-400 dark:text-gray-500">{card.icon}</div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="rounded-xl border border-gray-200 dark:border-zinc-700 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm tên bài thi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-zinc-500 transition"
                />
              </div>
              <div className="w-full md:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-gray-400 dark:focus:border-zinc-500 transition cursor-pointer"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="highest">Điểm cao nhất</option>
                  <option value="lowest">Điểm thấp nhất</option>
                </select>
              </div>
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Tìm thấy <span className="font-semibold text-gray-700 dark:text-gray-300">{filteredAndSortedHistory.length}</span> kết quả
              </p>
            )}
          </div>

          {/* No Results */}
          {filteredAndSortedHistory.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 dark:border-zinc-700 p-12 text-center">
              <Search className="w-10 h-10 mx-auto text-gray-300 dark:text-zinc-600 mb-3" />
              <h2 className="text-base font-semibold text-gray-700 dark:text-white mb-1">Không tìm thấy bài làm</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}

          {/* History List */}
          {filteredAndSortedHistory.length > 0 && (
            <div className="rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Chi tiết các lần làm bài</h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                {paginatedHistory.map((item, index) => {
                  const pct = item.totalQuestions > 0 ? Math.round((item.correctAnswers / item.totalQuestions) * 100) : 0;
                  const strokeColor = getScoreStrokeColor(pct);
                  const circumference = 2 * Math.PI * 36;
                  return (
                    <div
                      key={item.attemptId}
                      className="p-5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Left - Test Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-10 h-10 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-sm flex-shrink-0">
                            {startIndex + index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{item.testTitle}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(item.completedAt)}
                            </p>
                          </div>
                        </div>

                        {/* Middle - Circular Score */}
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <div className="relative w-16 h-16">
                              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-100 dark:text-zinc-800" />
                                <circle
                                  cx="40" cy="40" r="36"
                                  stroke={strokeColor}
                                  strokeWidth="4"
                                  fill="none"
                                  strokeDasharray={circumference}
                                  strokeDashoffset={circumference * (1 - pct / 100)}
                                  strokeLinecap="round"
                                  className="transition-all duration-500"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-sm font-bold ${getScoreTextColor(pct)}`}>{pct}%</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.correctAnswers}/{item.totalQuestions}</p>
                          </div>
                        </div>

                        {/* Right - Action */}
                        <Link
                          href={`/results/${item.attemptGuid ?? item.attemptId}`}
                          className="inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium text-sm hover:opacity-90 transition w-full md:w-auto"
                        >
                          <Eye className="w-4 h-4" />
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-700 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hiển thị <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, filteredAndSortedHistory.length)}</span> trên <span className="font-semibold">{filteredAndSortedHistory.length}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          currentPage === page
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                            : 'border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
