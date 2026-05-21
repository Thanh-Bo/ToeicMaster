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
      <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 flex-wrap">
        {/* All Tests Tab */}
        <button
          onClick={() => onPrefixChange("all")}
          className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${
            filterPrefix === "all"
              ? "bg-blue-500 dark:bg-blue-500  text-white dark:text-white"
              : "border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
          }`}
        >
          Tất cả ({tests.length})
        </button>

        {/* Prefix Tabs */}
        {uniquePrefixes.map((prefix) => (
          <button
            key={prefix}
            onClick={() => onPrefixChange(prefix)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${
              filterPrefix === prefix
                ? "bg-blue-500 dark:bg-blue-500 text-white dark:text-white"
                : "border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
            }`}
          >
            {prefix} ({getCountByPrefix(prefix)})
          </button>
        ))}
      </div>

      {/* Search & Filter Section */}
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
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 pl-10 sm:pl-12 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-zinc-500 transition text-sm sm:text-base"
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
              className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl p-4 sm:p-6 hover:shadow-md dark:hover:shadow-zinc-800/50 hover:scale-[1.02] transition-all duration-200 group"
            >
              {/* Title */}
              <div className="mb-3 sm:mb-4 flex min-h-[40px] items-start justify-between gap-3">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {test.title}
                </h3>
                {test.isExplanationPremiumRequired && (
                  <span
                    className="inline-flex h-7 shrink-0 items-center justify-center rounded-full border border-yellow-300 bg-yellow-50 px-2 text-yellow-700 dark:border-yellow-500/40 dark:bg-yellow-500/10 dark:text-yellow-300"
                    title="Giải thích cần Premium"
                    aria-label="Giải thích cần Premium"
                  >
                    <Crown className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>

              {/* Test Info */}
              <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{test.totalQuestions} câu</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{test.duration} phút</span>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href={`/tests/${test.testGuid}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm bg-blue-500 dark:bg-blue-500 text-white dark:text-white hover:opacity-90 transition-all duration-200"
              >
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Luyện tập
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
