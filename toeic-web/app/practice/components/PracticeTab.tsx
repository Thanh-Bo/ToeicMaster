"use client";

import Link from "next/link";
import { Clock, BookOpen, Play, Crown } from "lucide-react";

interface TestSummary {
  id: number;
  testGuid: string;
  title: string;
  slug?: string;
  type?: string;
  duration: number;
  totalQuestions: number;
  totalParticipants?: number;
  completed?: boolean;
  isExplanationPremiumRequired?: boolean;
  canViewExplanation?: boolean;
  createdAt?: string;
}

interface PracticeTabProps {
  tests: TestSummary[];
  loading: boolean;
  error: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterPrefix: string;
  onPrefixChange: (prefix: string) => void;
  uniquePrefixes: string[];
  getCountByPrefix: (prefix: string) => number;
  LoadingSpinner: React.ComponentType<{
    text?: string;
    fullScreen?: boolean;
    size?: "sm" | "md" | "lg";
  }>;
  AlertMessage: React.ComponentType<{
    type: "success" | "error" | "warning" | "info";
    message: string;
    closable?: boolean;
  }>;
  EmptyState: React.ComponentType<{
    icon?: string;
    title: string;
    description?: string;
  }>;
}

export default function PracticeTab({
  tests,
  loading,
  error,
  searchQuery,
  onSearchChange,
  filterPrefix,
  onPrefixChange,
  uniquePrefixes,
  getCountByPrefix,
  LoadingSpinner,
  AlertMessage,
  EmptyState,
}: PracticeTabProps) {
  // Filter theo search query và prefix
  const filteredTests = tests.filter((t) => {
    const matchesSearch = t.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPrefix =
      filterPrefix === "all" || t.title.startsWith(filterPrefix);
    return matchesSearch && matchesPrefix;
  });

  return (
    <>
      {/* Test Prefix Tabs */}
      <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-none flex-nowrap sm:flex-wrap">
        {/* All Tests Tab */}
        <button
          onClick={() => onPrefixChange("all")}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
            filterPrefix === "all"
              ? "bg-blue-600 dark:bg-blue-550 text-white shadow-sm shadow-blue-500/20"
              : "bg-gray-100/50 dark:bg-zinc-800/40 border border-gray-200/40 dark:border-zinc-800/45 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/80"
          }`}
        >
          Tất cả ({tests.length})
        </button>

        {/* Prefix Tabs */}
        {uniquePrefixes.map((prefix) => (
          <button
            key={prefix}
            onClick={() => onPrefixChange(prefix)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
              filterPrefix === prefix
                ? "bg-blue-600 dark:bg-blue-550 text-white shadow-sm shadow-blue-500/20"
                : "bg-gray-100/50 dark:bg-zinc-800/40 border border-gray-200/40 dark:border-zinc-800/45 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/80"
            }`}
          >
            {prefix} ({getCountByPrefix(prefix)})
          </button>
        ))}
      </div>

      {/* Search Section */}
      <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8 items-center flex-wrap">
        {/* Search Bar */}
        <div className="flex-1 relative min-w-[200px]">
          <svg
            className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm bộ đề..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 sm:px-6 py-3 pl-10 sm:pl-12 rounded-xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-gray-200/50 dark:border-zinc-800/85 text-gray-800 dark:text-gray-200 placeholder-gray-450 dark:placeholder-gray-550 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-blue-500/10 dark:focus:border-blue-500/50 transition-all text-sm sm:text-base shadow-xs"
          />
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="flex justify-center py-12 sm:py-16">
          <LoadingSpinner
            text="Đang tải dữ liệu..."
            fullScreen={false}
            size="lg"
          />
        </div>
      ) : error ? (
        <AlertMessage type="error" message={error} closable={false} />
      ) : filteredTests.length === 0 ? (
        <div className="py-12 sm:py-16">
          <EmptyState
            icon="📭"
            title={searchQuery ? "Không tìm thấy đề thi" : "Chưa có đề thi"}
            description={
              searchQuery
                ? "Hãy thử tìm kiếm với từ khóa khác"
                : "Hiện tại chưa có đề thi nào."
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-zinc-900/40 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-900/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Title & Badge */}
                <div className="mb-3 sm:mb-4 flex min-h-[40px] items-start justify-between gap-3">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {test.title}
                  </h3>
                  {test.isExplanationPremiumRequired && (
                    <span
                      className="inline-flex h-7 shrink-0 items-center justify-center rounded-full border border-amber-300/30 bg-amber-500/10 px-2 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 shadow-xs"
                      title="Giải thích cần Premium"
                      aria-label="Giải thích cần Premium"
                    >
                      <Crown className="h-3.5 w-3.5 mr-0.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider hidden xs:inline">Pro</span>
                    </span>
                  )}
                </div>

                {/* Test Info pills */}
                <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100/50 dark:bg-zinc-800/40 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-semibold">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                    <span>{test.totalQuestions} câu</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100/50 dark:bg-zinc-800/40 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    <span>{test.duration} phút</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href={`/tests/${test.testGuid}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Play className="w-4 h-4 fill-current" />
                Luyện tập
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
