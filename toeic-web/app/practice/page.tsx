"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { testService } from "../services/testService";
import { PageHeader } from "../components/layout";
import { LoadingSpinner, EmptyState, AlertMessage } from "../components/common";
import { Clock, BookOpen, Play, Zap, Filter } from "lucide-react";

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
  const [filterYear, setFilterYear] = useState<string>("all");

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

  // Filter theo search query và status
  let filteredTests = tests.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const testYear = new Date(t.createdAt || "").getFullYear().toString();
    const matchesYear = filterYear === "all" || testYear === filterYear;
    if (filterStatus === "completed") return matchesSearch && t.completed && matchesYear;
    if (filterStatus === "not-completed") return matchesSearch && !t.completed && matchesYear;
    return matchesSearch && matchesYear;
  });

  // Get unique years from tests (sorted descending)
  const uniqueYears = Array.from(
    new Set(tests.map((t) => new Date(t.createdAt || "").getFullYear()).filter(year => year > 1970))
  ).sort((a, b) => b - a);

  // Get count of tests per year
  const getCountByYear = (year: number) => {
    return tests.filter(t => new Date(t.createdAt || "").getFullYear() === year).length;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
      {/* HEADER */}
      <PageHeader />

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs Section */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800">
          <button className="px-4 py-3 text-blue-600 dark:text-white font-medium border-b-2 border-blue-600 dark:border-blue-500 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Học
          </button>
          <button className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700 transition">
            Tiến độ
          </button>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Chính phục <span className="text-cyan-500 dark:text-cyan-400">TOEIC Full Test</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Luyện đề TOEIC với đề thi thật và chấm điểm tự động</p>
        </div>

        {/* Year Tabs */}
        <div className="flex gap-8 mb-8 border-b border-gray-300 dark:border-gray-800 overflow-x-auto pb-3">
          {/* All Years Tab */}
          <button
            onClick={() => setFilterYear("all")}
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
              onClick={() => setFilterYear(year.toString())}
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
            {filteredTests.map((test, index) => (
              <div
                key={test.id}
                className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-xl p-6 hover:border-gray-400 dark:hover:border-gray-700 transition group relative overflow-hidden"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-blue-600/5 dark:from-cyan-600/10 dark:to-blue-600/10 opacity-0 group-hover:opacity-100 transition"></div>

                <div className="relative">
                  {/* Header with Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition">
                      {test.title}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800">
                      Free
                    </span>
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
                      href={`/practice/${test.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-cyan-700 dark:text-cyan-400 font-medium rounded-lg border border-gray-400 dark:border-gray-700 hover:border-cyan-600 dark:hover:border-cyan-600 transition"
                    >
                      
                      Luyện tập
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
