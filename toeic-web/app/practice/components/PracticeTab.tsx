"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, BookOpen, Play, Zap, Filter } from "lucide-react";

interface TestSummary {
  id: number;
  title: string;
  slug?: string;
  type?: string;
  duration: number;
  totalQuestions: number;
  totalParticipants?: number;
  completed?: boolean;
  createdAt?: string;
}

interface PracticeTabProps {
  tests: TestSummary[];
  loading: boolean;
  error: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterYear: string;
  onYearChange: (year: string) => void;
  uniqueYears: number[];
  getCountByYear: (year: number) => number;
  LoadingSpinner: React.ComponentType<any>;
  AlertMessage: React.ComponentType<any>;
  EmptyState: React.ComponentType<any>;
}

export default function PracticeTab({
  tests,
  loading,
  error,
  searchQuery,
  onSearchChange,
  filterYear,
  onYearChange,
  uniqueYears,
  getCountByYear,
  LoadingSpinner,
  AlertMessage,
  EmptyState,
}: PracticeTabProps) {
  // Filter theo search query và year
  let filteredTests = tests.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const testYear = new Date(t.createdAt || "").getFullYear().toString();
    const matchesYear = filterYear === "all" || testYear === filterYear;
    return matchesSearch && matchesYear;
  });

  return (
    <>
      {/* Year Tabs */}
      <div className="flex gap-8 mb-8 border-b border-gray-300 dark:border-gray-800 overflow-x-auto pb-3">
        {/* All Years Tab */}
        <button
          onClick={() => onYearChange("all")}
          className={`px-4 py-2 font-semibold whitespace-nowrap border-b-2 transition ${
            filterYear === "all"
              ? "text-blue-600 dark:text-cyan-400 border-blue-600 dark:border-cyan-400"
              : "text-gray-700 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Tất cả ({tests.length})
        </button>

        {/* Year Tabs */}
        {uniqueYears.map(year => (
          <button
            key={year}
            onClick={() => onYearChange(year.toString())}
            className={`px-4 py-2 font-semibold whitespace-nowrap border-b-2 transition ${
              filterYear === year.toString()
                ? "text-blue-600 dark:text-cyan-400 border-blue-600 dark:border-cyan-400"
                : "text-gray-700 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            ETS {year} ({getCountByYear(year)})
          </button>
        ))}
      </div>

      {/* Search & Filter Section */}
      <div className="flex gap-4 mb-8 items-center flex-wrap">
        {/* Search Bar */}
        <div className="flex-1 relative min-w-xs">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm bộ đề..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-6 py-3 pl-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 transition"
          />
        </div>

        {/* Filter Button */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600 transition">
            <Filter className="w-5 h-5" />
            Chưa làm
          </button>
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner text="Đang tải dữ liệu..." fullScreen={false} size="lg" />
        </div>
      ) : error ? (
        <AlertMessage type="error" message={error} closable={false} />
      ) : filteredTests.length === 0 ? (
        <div className="py-16">
          <EmptyState
            icon="📭"
            title={searchQuery ? "Không tìm thấy đề thi" : "Chưa có đề thi"}
            description={searchQuery ? "Hãy thử tìm kiếm với từ khóa khác" : "Hiện tại chưa có đề thi nào."}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-800 rounded-xl p-6 hover:border-gray-400 dark:hover:border-gray-700 transition group relative overflow-hidden"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition"></div>

              <div className="relative">
                {/* Header with Badge */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition">
                    {test.title}
                  </h3>
                  
                </div>

                {/* Test Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">{test.totalQuestions} câu</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{test.duration} phút</span>
                  </div>
                </div>

                {/* Score Display */}
                <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Điểm cao nhất</div>
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">0/990</div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href={`/tests/${test.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white font-medium rounded-lg transition"
                  >
                    <Play className="w-4 h-4" />
                    Luyện tập
                  </Link>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
