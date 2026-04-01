"use client";

import { useEffect, useState } from "react";
import { testService } from "../services/testService";
import { PageHeader } from "../components/layout";
import { LoadingSpinner, EmptyState, AlertMessage } from "../components/common";
import { BookOpen, BarChart2, History, Bookmark } from "lucide-react";
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
  createdAt?: string;
}

export default function PracticePage() {
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "not-completed">("all");
  const [filterPrefix, setFilterPrefix] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"practice" | "progress" | "history" | "bookmarks">("practice");

  useEffect(() => {
    testService.getList()
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
    new Set(tests.map((t) => extractPrefix(t.title)))
  ).sort();

  // Get count of tests per prefix
  const getCountByPrefix = (prefix: string) => {
    return tests.filter(t => extractPrefix(t.title) === prefix).length;
  };


  return (
    <div className="min-h-screen bg-white  dark:bg-zinc-900 ">
      {/* HEADER */}
      <PageHeader />

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs Section */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-zinc-700">
          <button
            onClick={() => setActiveTab("practice")}
            className={`px-4 py-3 font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === "practice"
                ? "text-gray-900 dark:text-white border-gray-900 dark:border-white"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Học
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`px-4 py-3 font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === "progress"
                ? "text-gray-900 dark:text-white border-gray-900 dark:border-white"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Tiến độ
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-3 font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === "history"
                ? "text-gray-900 dark:text-white border-gray-900 dark:border-white"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <History className="w-4 h-4" />
            Lịch sử
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`px-4 py-3 font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === "bookmarks"
                ? "text-gray-900 dark:text-white border-gray-900 dark:border-white"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Đã lưu
          </button>
        </div>

        {/* Title Section (only show on practice tab) */}
        {activeTab === "practice" && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Chinh phục TOEIC Full Test
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Luyện đề TOEIC với đề thi thật và chấm điểm tự động</p>
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
