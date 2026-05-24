"use client";

import { useEffect, useState } from "react";
import { testService } from "../services/testService";
import { PageHeader } from "../components/layout";
import { LoadingSpinner, EmptyState, AlertMessage } from "../components/common";
import {
  BookOpen,
  BarChart2,
  History,
  Bookmark,
  Library,
  ALargeSmall,
  FileText,
} from "lucide-react";
import PracticeTab from "./components/PracticeTab";
import ProgressTab from "./components/ProgressTab";
import BookmarksTab from "./components/BookmarksTab";
import HistoryTab from "./components/HistoryTab";

// Định nghĩa kiểu dữ liệu
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

export default function PracticePage() {
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "not-completed"
  >("all");
  const [filterPrefix, setFilterPrefix] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<
    "practice" | "progress" | "history" | "bookmarks"
  >("practice");

  useEffect(() => {
    testService
      .getList()
      .then((res) => {
        setTests(res.data.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Không thể tải danh sách đề thi. Vui lòng thử lại sau.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Extract unique test prefixes from titles
  // Examples: "ETS 2026 Test 3" → "ETS 2026"
  const extractPrefix = (title: string): string => {
    // Match pattern like "ETS 2026" or "Test 2024" etc
    const match = title.match(/^(.+?)\s+(?:Test|test)\s+\d+/i);
    return match ? match[1].trim() : title;
  };

  // Get unique prefixes from tests (sorted)
  const uniquePrefixes = Array.from(
    new Set(tests.map((t) => extractPrefix(t.title))),
  ).sort();

  // Get count of tests per prefix
  const getCountByPrefix = (prefix: string) => {
    return tests.filter((t) => extractPrefix(t.title) === prefix).length;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* HEADER */}
      <PageHeader
        navLinks={[
          { href: "/grammar", label: "Grammar", icon: Library },
          { href: "/vocabulary", label: "Vocab", icon: ALargeSmall },
          { href: "/practice", label: "Practice", icon: FileText },
          { href: "/reading", label: "Reading", icon: BookOpen },
        ]}
      />

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Tabs Section */}
        <div className="inline-flex w-full sm:w-auto p-1.5 bg-gray-100/80 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-zinc-800/50 mb-6 sm:mb-8 gap-1">
          <button
            onClick={() => setActiveTab("practice")}
            className={`flex-1 sm:flex-initial px-4 py-2.5 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-sm ${
              activeTab === "practice"
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm scale-[1.02]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/30 dark:hover:bg-zinc-850"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Học</span>
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`flex-1 sm:flex-initial px-4 py-2.5 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-sm ${
              activeTab === "progress"
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm scale-[1.02]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/30 dark:hover:bg-zinc-850"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Tiến độ</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 sm:flex-initial px-4 py-2.5 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-sm ${
              activeTab === "history"
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm scale-[1.02]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/30 dark:hover:bg-zinc-850"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Lịch sử</span>
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex-1 sm:flex-initial px-4 py-2.5 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-sm ${
              activeTab === "bookmarks"
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm scale-[1.02]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/30 dark:hover:bg-zinc-850"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Đã lưu</span>
          </button>
        </div>

        {/* Title Section (only show on practice tab) */}
        {activeTab === "practice" && (
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Chinh phục TOEIC Full Test
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Luyện đề TOEIC với đề thi thật và chấm điểm tự động
            </p>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "practice" ? (
          <PracticeTab
            tests={tests}
            loading={loading}
            error={error}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterPrefix={filterPrefix}
            onPrefixChange={setFilterPrefix}
            uniquePrefixes={uniquePrefixes}
            getCountByPrefix={getCountByPrefix}
            LoadingSpinner={LoadingSpinner}
            AlertMessage={AlertMessage}
            EmptyState={EmptyState}
          />
        ) : activeTab === "progress" ? (
          <ProgressTab />
        ) : activeTab === "history" ? (
          <HistoryTab />
        ) : (
          <BookmarksTab />
        )}
      </div>
    </div>
  );
}
