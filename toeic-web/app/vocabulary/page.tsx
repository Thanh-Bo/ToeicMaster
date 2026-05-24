"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Loader, ArrowLeft, Book, BookOpen, X, Library, ALargeSmall, FileText, BarChart2 } from "lucide-react";
import { vocabularyService } from "../services/vocabularyService";
import TopicCard from "../components/vocabulary/TopicCard";
import { VocabularyProgressTab } from "../components/vocabulary/VocabularyProgressTab";
import { VocabularyTopic } from "../types";
import { PageHeader } from "../components";

export default function VocabularyPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<VocabularyTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"practice" | "progress">("practice");
  const [selectedLevel, setSelectedLevel] = useState<"all" | "basic" | "intermediate" | "advanced">("all");

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const data = await vocabularyService.getTopics();
      setTopics(data);
    } catch (err: unknown) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Loi khi tai chu de tu vung");
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "all" || topic.level.toLowerCase() === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <Loader className="w-16 h-16 text-blue-600 animate-spin relative" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Đang tải chủ đề từ vựng...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <PageHeader
        navLinks={[
          { href: "/grammar", label: "Grammar", icon: Library },
          { href: "/vocabulary", label: "Vocab", icon: ALargeSmall },
          { href: "/practice", label: "Practice", icon: FileText },
          { href: "/reading", label: "Reading", icon: BookOpen },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        

        {/* Tabs - iOS Style Segment Control */}
        <div className="flex gap-1.5 p-1.5 bg-gray-100/80 dark:bg-zinc-900/60 backdrop-blur-md rounded-xl max-w-xs mb-6 sm:mb-8 border border-gray-200/50 dark:border-zinc-800/50">
          <button
            onClick={() => setActiveTab("practice")}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
              activeTab === "practice"
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm scale-[1.02]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <Book className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Học
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
              activeTab === "progress"
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm scale-[1.02]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Tiến độ
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "progress" ? (
          <VocabularyProgressTab />
        ) : (
          <>
            {/* Search Section with Level Filter */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search Box */}
                <div className="relative max-w-md w-full group">
                  <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 dark:text-gray-500 transition-transform duration-300 group-focus-within:scale-110 pointer-events-none"
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
                    placeholder="Tìm kiếm chủ đề từ vựng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl
                      bg-white dark:bg-zinc-900 text-gray-900 dark:text-white
                      placeholder-gray-400 dark:placeholder-gray-500
                      focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/30 transition-all
                      text-sm font-semibold shadow-xs"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Level Filter Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { key: "all", label: "Tất cả", color: "gray" },
                    { key: "basic", label: "Cơ bản", color: "emerald" },
                    { key: "intermediate", label: "Trung cấp", color: "blue" },
                    { key: "advanced", label: "Nâng cao", color: "purple" },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setSelectedLevel(filter.key as typeof selectedLevel)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                        selectedLevel === filter.key
                          ? filter.color === "gray"
                            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md shadow-zinc-200 dark:shadow-none"
                            : filter.color === "emerald"
                            ? "bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20"
                            : filter.color === "blue"
                            ? "bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "bg-linear-to-br from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/20"
                          : "bg-gray-50/80 text-gray-600 border border-gray-200/80 hover:bg-gray-100 dark:bg-zinc-900/60 dark:text-zinc-400 dark:border-zinc-800/80 dark:hover:bg-zinc-800/80 hover:shadow-xs"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg backdrop-blur-sm">
                <div className="flex items-start gap-2">
                  <X
                    size={24}
                    className="text-red-600 dark:text-red-400 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-red-700 dark:text-red-300 mb-1 text-sm">
                      Lỗi tải dữ liệu
                    </h3>
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Topics Grid */}
            {filteredTopics.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 animate-fade-in">
                {filteredTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 bg-white dark:bg-zinc-800/30 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-700">
                <div className="text-4xl sm:text-5xl mb-3">📭</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium">
                  {searchTerm
                    ? "Không tìm thấy chủ đề từ vựng phù hợp"
                    : "Chưa có chủ đề từ vựng"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    Xóa tìm kiếm
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

