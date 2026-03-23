"use client";

import { useEffect, useState } from "react";
import { testService } from "../services/testService";
import { PageHeader } from "../components/layout";
import { LoadingSpinner, EmptyState, AlertMessage } from "../components/common";
import { BookOpen } from "lucide-react";
import PracticeTab from "./components/PracticeTab";
import ProgressTab from "./components/ProgressTab";
import BookmarksTab from "./components/BookmarksTab";

// Định nghĩa kiểu dữ liệu
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

export default function PracticePage() {
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "not-completed">("all");
  const [filterPrefix, setFilterPrefix] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"practice" | "progress" | "bookmarks">("practice");

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
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab("practice")}
            className={`px-4 py-3 font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === "practice"
                ? "text-blue-600 dark:text-white border-blue-600 dark:border-blue-500"
                : "text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Học
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "progress"
                ? "text-blue-600 dark:text-white border-blue-600 dark:border-blue-500"
                : "text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700"
            }`}
          >
            Tiến độ
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "bookmarks"
                ? "text-blue-600 dark:text-white border-blue-600 dark:border-blue-500"
                : "text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700"
            }`}
          >
            Đã lưu
          </button>
        </div>

        {/* Title Section (only show on practice tab) */}
        {activeTab === "practice" && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Chinh phục <span className="text-cyan-500 dark:text-cyan-400">TOEIC Full Test</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Luyện đề TOEIC với đề thi thật và chấm điểm tự động</p>
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
        ) : (
          <BookmarksTab />
        )}
      </div>
    </div>
  );
}
