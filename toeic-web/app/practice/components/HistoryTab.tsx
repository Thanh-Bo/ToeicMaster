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
  const [animateProgress, setAnimateProgress] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await testService.getHistory();
        if (response.success) {
          setHistory(response.data);
          // Trigger animations after data loads
          setTimeout(() => setAnimateProgress(true), 100);
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

  const getScoreStrokeColor = (pct: number) => {
    if (pct >= 80) return "stroke-emerald-500 dark:stroke-emerald-400";
    if (pct >= 60) return "stroke-amber-500 dark:stroke-amber-400";
    return "stroke-rose-500 dark:stroke-rose-400";
  };

  const getScoreTextColor = (pct: number) => {
    if (pct >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (pct >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-zinc-700 border-t-blue-500"></div>
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

  const highestScore = history.length > 0 ? Math.max(...history.map(h => h.totalScore)) : 0;
  const averageScore = history.length > 0 ? Math.round(history.reduce((s, h) => s + h.totalScore, 0) / history.length) : 0;

  return (
    <div className="space-y-8">
      {filteredAndSortedHistory.length === 0 && history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700 p-12 text-center bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
          <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-zinc-600 mb-4" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Chưa có bài làm nào</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Hãy bắt đầu làm bài thi đầu tiên của bạn!</p>
          <Link
            href="/practice"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Khám phá đề thi
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: <BookOpen className="w-5 h-5" />, label: "Tổng số bài làm", value: history.length, colorClass: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" },
              { icon: <Target className="w-5 h-5" />, label: "Điểm cao nhất", value: highestScore, colorClass: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" },
              { icon: <TrendingUp className="w-5 h-5" />, label: "Điểm trung bình", value: averageScore, colorClass: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-350 flex items-center gap-3 sm:gap-4"
              >
                <div className={`p-2.5 rounded-xl ${card.colorClass} shrink-0`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">{card.label}</p>
                  <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-0.5">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-gray-200/50 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm tên bài thi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-2xs"
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white/85 dark:bg-zinc-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer text-sm font-semibold shadow-2xs"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="highest">Điểm cao nhất</option>
                  <option value="lowest">Điểm thấp nhất</option>
                </select>
              </div>
            </div>

            {/* Pagination Controls */}
            {filteredAndSortedHistory.length > 0 && (
              <div className="flex flex-wrap items-center justify-end gap-2 pt-4 mt-4 border-t border-gray-200/40 dark:border-zinc-800/50">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold mr-2">
                  Trang <span className="text-gray-800 dark:text-gray-200 font-bold">{currentPage}</span> / <span className="text-gray-800 dark:text-gray-200 font-bold">{totalPages}</span>
                </p>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div className="hidden sm:flex items-center gap-1.5">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                            : 'border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}
            
            {searchQuery && (
              <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mt-3">
                Tìm thấy <span className="font-bold text-blue-600 dark:text-blue-400">{filteredAndSortedHistory.length}</span> kết quả phù hợp
              </p>
            )}
          </div>

          {/* No Results */}
          {filteredAndSortedHistory.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700 p-12 text-center bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
              <Search className="w-10 h-10 mx-auto text-gray-300 dark:text-zinc-600 mb-3" />
              <h2 className="text-base font-bold text-gray-700 dark:text-white mb-1">Không tìm thấy kết quả làm bài</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hãy thử tìm kiếm với từ khóa khác</p>
            </div>
          )}

          {/* History List */}
          {filteredAndSortedHistory.length > 0 && (
            <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden shadow-xs">
              <div className="px-5 py-4 border-b border-gray-200/40 dark:border-zinc-800/50 bg-gray-50/50 dark:bg-zinc-900/40">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Chi tiết lịch sử làm bài</h2>
              </div>
              <div className="divide-y divide-gray-200/30 dark:divide-zinc-800/40">
                {paginatedHistory.map((item, index) => {
                  const pct = item.totalQuestions > 0 ? Math.round((item.correctAnswers / item.totalQuestions) * 100) : 0;
                  const strokeColor = getScoreStrokeColor(pct);
                  const circumference = 2 * Math.PI * 36;
                  const strokeDashoffset = animateProgress 
                    ? circumference * (1 - pct / 100) 
                    : circumference;

                  return (
                    <div
                      key={item.attemptId}
                      className="group p-4 sm:p-5 hover:bg-gray-100/40 dark:hover:bg-zinc-800/40 transition-all duration-300"
                    >
                      {/* Mobile Layout: Stack vertically */}
                      <div className="flex flex-col gap-3 sm:hidden">
                        {/* Row 1: Number + Title + Date */}
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800/60 border border-gray-200/60 dark:border-zinc-700/50 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-xs shrink-0">
                            {startIndex + index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug break-words">{item.testTitle}</h3>
                            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-400 mt-1 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(item.completedAt)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Row 2: Score Circle + Button */}
                        <div className="flex items-center justify-between border-t border-gray-100/50 dark:border-zinc-800/40 pt-2.5 mt-1">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 shrink-0">
                              <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-100 dark:text-zinc-800/60" />
                                <circle
                                  cx="40" cy="40" r="36"
                                  strokeWidth="6"
                                  fill="none"
                                  strokeDasharray={circumference}
                                  strokeDashoffset={strokeDashoffset}
                                  strokeLinecap="round"
                                  className={`transition-all duration-1000 ease-out ${strokeColor}`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-[10px] font-bold ${getScoreTextColor(pct)}`}>{pct}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{item.correctAnswers}/{item.totalQuestions} câu</p>
                              <p className="text-[10px] font-semibold text-gray-400">Độ chính xác</p>
                            </div>
                          </div>
                          
                          <Link
                            href={`/results/${item.attemptGuid}`}
                            className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-500/15 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white rounded-xl font-bold text-xs transition-all duration-300"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Chi tiết
                          </Link>
                        </div>
                      </div>

                      {/* Desktop Layout: Horizontal */}
                      <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Left - Test Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-gray-100/80 dark:bg-zinc-800/60 border border-gray-200/50 dark:border-zinc-700/50 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-sm shrink-0 shadow-2xs">
                            {startIndex + index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.testTitle}</h3>
                            <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {formatDate(item.completedAt)}
                            </p>
                          </div>
                        </div>

                        {/* Middle - Circular Score */}
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-3 border-r border-gray-200/40 dark:border-zinc-800/50 pr-6">
                            <div className="relative w-14 h-14 shrink-0">
                              <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="5" fill="none" className="text-gray-100 dark:text-zinc-800/60" />
                                <circle
                                  cx="40" cy="40" r="36"
                                  strokeWidth="5"
                                  fill="none"
                                  strokeDasharray={circumference}
                                  strokeDashoffset={strokeDashoffset}
                                  strokeLinecap="round"
                                  className={`transition-all duration-1000 ease-out ${strokeColor}`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-xs font-extrabold ${getScoreTextColor(pct)}`}>{pct}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800 dark:text-gray-250">{item.correctAnswers}/{item.totalQuestions}</p>
                              <p className="text-xs font-semibold text-gray-400">Đúng/Tổng số câu</p>
                            </div>
                          </div>
                        </div>

                        {/* Right - Action */}
                        <Link
                          href={`/results/${item.attemptGuid}`}
                          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Eye className="w-4 h-4" />
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Info */}
              <div className="px-5 py-3.5 border-t border-gray-200/40 dark:border-zinc-800/50 bg-gray-50/50 dark:bg-zinc-900/40">
                <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Hiển thị <span className="text-gray-800 dark:text-gray-200">{startIndex + 1}</span> - <span className="text-gray-800 dark:text-gray-200">{Math.min(endIndex, filteredAndSortedHistory.length)}</span> của <span className="text-gray-800 dark:text-gray-200">{filteredAndSortedHistory.length}</span> bài thi
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
