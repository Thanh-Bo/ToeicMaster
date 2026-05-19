"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Loader, ArrowLeft, Book, X, Library, ALargeSmall, FileText, BarChart2 } from "lucide-react";
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
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Lỗi khi tải chủ đề từ vựng");
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
      <PageHeader
        navLinks={[
          { href: "/grammar", label: "Grammar", icon: Library },
          { href: "/vocabulary", label: "Vocab", icon: ALargeSmall },
          { href: "/practice", label: "Practice", icon: FileText },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        

        {/* Tabs */}
        <div className="flex gap-3 mb-6 border-b border-gray-200 dark:border-zinc-700">
          <button
            onClick={() => setActiveTab("practice")}
            className={`px-3 py-2 text-sm font-medium border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "practice"
                ? "text-gray-900 dark:text-white border-gray-900 dark:border-white"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Book className="w-4 h-4" />
            Học 
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`px-3 py-2 text-sm font-medium border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "progress"
                ? "text-gray-900 dark:text-white border-gray-900 dark:border-white"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Tiến độ
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "progress" ? (
          <VocabularyProgressTab />
        ) : (
          <>
            {/* Search Section with Level Filter */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                {/* Search Box */}
                <div className="relative max-w-md w-full">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none"
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
                    placeholder="Tìm kiếm chủ đề..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 dark:border-zinc-700 rounded-lg
                      bg-white dark:bg-zinc-800 text-gray-900 dark:text-white
                      placeholder-gray-500 dark:placeholder-gray-400
                      focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 transition-all
                      text-sm font-medium shadow-sm"
                  />
                </div>

                {/* Level Filter Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { key: "all", label: "Tất cả", color: "gray" },
                    { key: "basic", label: "Basic", color: "emerald" },
                    { key: "intermediate", label: "Intermediate", color: "blue" },
                    { key: "advanced", label: "Advanced", color: "purple" },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setSelectedLevel(filter.key as typeof selectedLevel)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                        selectedLevel === filter.key
                          ? filter.color === "gray"
                            ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 shadow-md"
                            : filter.color === "emerald"
                            ? "bg-emerald-600 text-white dark:bg-emerald-500 shadow-md"
                            : filter.color === "blue"
                            ? "bg-blue-600 text-white dark:bg-blue-500 shadow-md"
                            : "bg-purple-600 text-white dark:bg-purple-500 shadow-md"
                          : `bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 hover:shadow-sm`
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in">
                {filteredTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-zinc-800/30 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-700">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
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

