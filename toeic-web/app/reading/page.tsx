"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ALargeSmall,
  BarChart2,
  Book,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  Library,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "../components/layout";
import ReadingHistoryList from "../components/reading/ReadingHistoryList";
import { readingService } from "../services/readingService";
import type { ReadingHistoryItem, ReadingStats, ReadingTopic } from "../types";

const partOptions = [
  { value: "all", label: "Tất cả" },
  { value: "6", label: "Part 6" },
  { value: "7", label: "Part 7" },
];

const difficultyOptions = [
  { value: "all", label: "Tất cả" },
  { value: "easy", label: "Dễ" },
  { value: "medium", label: "Trung bình" },
  { value: "hard", label: "Khó" },
];

const difficultyLabels: Record<string, string> = {
  easy: "Dễ",
  medium: "Trung bình",
  hard: "Khó",
};

const difficultyStyles: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  hard: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

const topicAccents = [
  "border-t-blue-500",
  "border-t-emerald-500",
  "border-t-amber-500",
  "border-t-cyan-500",
  "border-t-rose-500",
  "border-t-violet-500",
];

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as { response?: { data?: { error?: string } } };
  return apiError.response?.data?.error || fallback;
};

export default function ReadingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"study" | "progress">("study");
  const [partType, setPartType] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [topics, setTopics] = useState<ReadingTopic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const [statsData, historyData] = await Promise.all([
          readingService.getStats(),
          readingService.getHistory(1, 5),
        ]);
        if (!mounted) return;
        setStats(statsData);
        setHistory(historyData.items);
      } catch {
        if (!mounted) return;
        setStats(null);
        setHistory([]);
      } finally {
        if (mounted) setLoadingHistory(false);
      }
    };

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadTopics = async () => {
      try {
        setLoadingTopics(true);
        const data = await readingService.getTopics(partType, difficulty);
        if (!mounted) return;
        setTopics(data);
      } catch (error: unknown) {
        if (!mounted) return;
        setTopics([]);
        toast.error(getErrorMessage(error, "Không thể tải danh sách topic Reading."));
      } finally {
        if (mounted) setLoadingTopics(false);
      }
    };

    loadTopics();
    return () => {
      mounted = false;
    };
  }, [partType, difficulty]);

  const filteredTopics = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return topics;

    return topics.filter((topic) => {
      const title = topic.title.toLowerCase();
      const description = topic.description?.toLowerCase() || "";
      return title.includes(keyword) || description.includes(keyword);
    });
  }, [topics, searchTerm]);

  const topicCountLabel = loadingTopics
    ? "Đang tải topic"
    : `${filteredTopics.length} topic phù hợp`;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-zinc-950 dark:text-white">
      <PageHeader
        navLinks={[
          { href: "/grammar", label: "Grammar", icon: Library },
          { href: "/vocabulary", label: "Vocab", icon: ALargeSmall },
          { href: "/practice", label: "Practice", icon: FileText },
          { href: "/reading", label: "Reading", icon: BookOpen },
        ]}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            TOEIC Reading
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-4xl">
            Reading Practice
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
            Chọn topic Reading, sau đó luyện từng bài Part 6 hoặc Part 7 trong topic đó.
          </p>
        </section>

        <div className="mb-8 flex max-w-xs gap-1.5 rounded-xl border border-gray-200/70 bg-gray-100/80 p-1.5 dark:border-zinc-800/70 dark:bg-zinc-900/70">
          <button
            type="button"
            onClick={() => setActiveTab("study")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${
              activeTab === "study"
                ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Book className="h-4 w-4" />
              Học
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("progress")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${
              activeTab === "progress"
                ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Tiến độ
            </span>
          </button>
        </div>

        {activeTab === "progress" ? (
          <section className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
                <BookOpen className="mb-4 h-5 w-5 text-blue-500" />
                <p className="text-3xl font-black">{stats?.activePassages ?? 0}</p>
                <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-zinc-400">Bài đang mở</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
                <TrendingUp className="mb-4 h-5 w-5 text-emerald-500" />
                <p className="text-3xl font-black">{stats?.accuracy ?? 0}%</p>
                <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-zinc-400">Độ chính xác TB</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
                <CheckCircle2 className="mb-4 h-5 w-5 text-cyan-500" />
                <p className="text-3xl font-black">{stats?.totalSessions ?? 0}</p>
                <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-zinc-400">Phiên hoàn thành</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
                <Clock className="mb-4 h-5 w-5 text-amber-500" />
                <p className="text-3xl font-black">{formatTime(stats?.totalTimeSeconds ?? 0)}</p>
                <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-zinc-400">Tổng thời gian</p>
              </div>
            </div>

            {stats?.partStats && stats.partStats.length > 0 && (
              <div>
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Theo từng Part</p>
                  <h2 className="text-xl font-black text-gray-950 dark:text-white">Hiệu suất Reading</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {stats.partStats.map((part) => (
                    <div
                      key={part.partType}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-lg font-black text-gray-950 dark:text-white">Part {part.partType}</p>
                          <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">
                            {part.correctAnswers}/{part.totalQuestions} câu đúng
                          </p>
                        </div>
                        <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-black text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                          {part.accuracy}%
                        </div>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${Math.min(100, Math.max(0, part.accuracy))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Lịch sử</p>
                <h2 className="text-xl font-black text-gray-950 dark:text-white">Phiên gần đây</h2>
              </div>
              <ReadingHistoryList items={history} loading={loadingHistory} />
            </div>
          </section>
        ) : (
          <section>
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Tìm kiếm topic Reading..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm font-semibold text-gray-900 shadow-xs transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-950/30"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {partOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPartType(option.value)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition hover:scale-105 active:scale-95 ${
                      partType === option.value
                        ? "bg-zinc-900 text-white shadow-md shadow-zinc-200 dark:bg-white dark:text-zinc-950 dark:shadow-none"
                        : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Danh sách topic</p>
                <h2 className="text-xl font-black text-gray-950 dark:text-white">{topicCountLabel}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDifficulty(option.value)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition hover:scale-105 active:scale-95 ${
                      difficulty === option.value
                        ? option.value === "easy"
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                          : option.value === "medium"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : option.value === "hard"
                              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                              : "bg-zinc-900 text-white shadow-md shadow-zinc-200 dark:bg-white dark:text-zinc-950 dark:shadow-none"
                        : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingTopics ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-sm font-semibold text-gray-500 dark:border-zinc-800 dark:text-zinc-400">
                Đang tải danh sách topic Reading...
              </div>
            ) : filteredTopics.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center dark:border-zinc-800">
                <Layers className="mx-auto mb-3 h-9 w-9 text-gray-300 dark:text-zinc-700" />
                <p className="font-bold text-gray-950 dark:text-white">Không có topic phù hợp.</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                  Hãy thử đổi từ khóa, Part hoặc độ khó khác.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTopics.map((topic, index) => {
                  const difficultyKey = topic.difficulty || "";
                  const difficultyLabel = difficultyKey
                    ? difficultyLabels[difficultyKey] || difficultyKey
                    : "Chưa phân loại";
                  const accent = topicAccents[index % topicAccents.length];

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => router.push(`/reading/topics/${topic.id}`)}
                      className={`group flex min-h-[260px] flex-col overflow-hidden rounded-2xl border border-gray-200 border-t-4 ${accent} bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/70`}
                    >
                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-5 flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            {topic.partType === 6 ? (
                              <FileText className="h-7 w-7" />
                            ) : (
                              <BookOpen className="h-7 w-7" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="line-clamp-2 text-lg font-black leading-snug text-gray-950 dark:text-white">
                              {topic.title}
                            </h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-600 dark:text-blue-400">
                                Part {topic.partType}
                              </span>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-black ${
                                  difficultyStyles[difficultyKey] ||
                                  "bg-gray-500/10 text-gray-600 dark:text-zinc-400"
                                }`}
                              >
                                {difficultyLabel}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4 grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-zinc-950/70">
                            <p className="text-lg font-black text-gray-950 dark:text-white">{topic.passageCount}</p>
                            <p className="text-xs font-bold text-gray-500 dark:text-zinc-400">bài luyện</p>
                          </div>
                          <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-zinc-950/70">
                            <p className="text-lg font-black text-gray-950 dark:text-white">{topic.questionCount}</p>
                            <p className="text-xs font-bold text-gray-500 dark:text-zinc-400">câu hỏi</p>
                          </div>
                        </div>

                        {topic.description && (
                          <p className="line-clamp-3 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                            {topic.description}
                          </p>
                        )}
                      </div>

                      <div className="border-t border-gray-100 p-5 dark:border-zinc-800">
                        <span className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white transition group-hover:bg-blue-700">
                          Xem bài luyện
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
