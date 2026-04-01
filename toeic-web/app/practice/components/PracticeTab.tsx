"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, BookOpen, Play, Zap, Filter } from "lucide-react";

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
  filterPrefix,
  onPrefixChange,
  uniquePrefixes,
  getCountByPrefix,
  LoadingSpinner,
  AlertMessage,
  EmptyState,
}: PracticeTabProps) {
  // Filter theo search query và prefix
  let filteredTests = tests.filter((t) => {
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
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1 flex-wrap">
        {/* All Tests Tab */}
        <button
          onClick={() => onPrefixChange("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
            filterPrefix === "all"
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
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
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filterPrefix === prefix
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
            }`}
          >
            {prefix} ({getCountByPrefix(prefix)})
          </button>
        ))}
      </div>

      {/* Search & Filter Section */}
      <div className="flex gap-4 mb-8 items-center flex-wrap">
        {/* Search Bar */}
        <div className="flex-1 relative min-w-xs">
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
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
            className="w-full px-6 py-3 pl-12 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-zinc-500 transition"
          />
        </div>

        {/* Filter Button */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
            <Filter className="w-5 h-5" />
            Chưa làm
          </button>
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner
            text="Đang tải dữ liệu..."
            fullScreen={false}
            size="lg"
          />
        </div>
      ) : error ? (
        <AlertMessage type="error" message={error} closable={false} />
      ) : filteredTests.length === 0 ? (
        <div className="py-16">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 hover:shadow-md dark:hover:shadow-zinc-800/50 hover:scale-105 transition-all duration-200 group"
            >
              {/* Title */}
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                {test.title}
              </h3>

              {/* Test Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>{test.totalQuestions} câu</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{test.duration} phút</span>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href={`/tests/${test.testGuid}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-all duration-200"
              >
                <Play className="w-4 h-4" />
                Luyện tập
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
