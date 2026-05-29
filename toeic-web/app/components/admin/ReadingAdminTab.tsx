"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/app/services/adminService";
import { Crown, Loader, Lock, Unlock, Eye, EyeOff, Trash2 } from "lucide-react";
import type { ReadingTopic } from "@/app/types";

const difficultyLabels: Record<string, string> = {
  easy: "Dễ",
  medium: "Trung bình",
  hard: "Khó",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  hard: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export default function ReadingAdminTab() {
  const [topics, setTopics] = useState<ReadingTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterPart, setFilterPart] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [savingId, setSavingId] = useState<number | null>(null);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getReadingTopics(filterPart, filterDifficulty);
      setTopics(data);
    } catch (err) {
      setError("Failed to load reading topics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    loadTopics();
  }, [filterPart, filterDifficulty]);

  const toggleActive = async (topic: ReadingTopic) => {
    if (savingId === topic.id) return;
    setSavingId(topic.id);
    setTopics((prev) =>
      prev.map((t) => (t.id === topic.id ? { ...t, isActive: !t.isActive } : t))
    );
    try {
      await adminService.toggleReadingTopicActive(topic.id);
    } catch {
      setTopics((prev) =>
        prev.map((t) => (t.id === topic.id ? { ...t, isActive: topic.isActive } : t))
      );
    } finally {
      setSavingId(null);
    }
  };

  const togglePremium = async (topic: ReadingTopic) => {
    if (savingId === topic.id) return;
    const nextValue = !topic.isPremiumRequired;
    setSavingId(topic.id);
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topic.id ? { ...t, isPremiumRequired: nextValue } : t
      )
    );
    try {
      await adminService.toggleReadingTopicPremium(topic.id);
    } catch {
      setTopics((prev) =>
        prev.map((t) =>
          t.id === topic.id
            ? { ...t, isPremiumRequired: topic.isPremiumRequired }
            : t
        )
      );
    } finally {
      setSavingId(null);
    }
  };

  const deleteTopic = async (topic: ReadingTopic) => {
    if (!window.confirm(`Xóa topic "${topic.title}" và toàn bộ nội dung bên trong?`)) return;
    try {
      await adminService.deleteReadingTopic(topic.id);
      setTopics((prev) => prev.filter((t) => t.id !== topic.id));
    } catch (err) {
      console.error(err);
    }
  };

  const partFilters = [
    { value: "all", label: "Tất cả" },
    { value: "6", label: "Part 6" },
    { value: "7", label: "Part 7" },
  ];

  const diffFilters = [
    { value: "all", label: "Tất cả" },
    { value: "easy", label: "Dễ" },
    { value: "medium", label: "Trung bình" },
    { value: "hard", label: "Khó" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Reading Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Quản lý topic Reading, toggle Premium/Free
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
          {partFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterPart(f.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filterPart === f.value
                  ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
          {diffFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterDifficulty(f.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filterDifficulty === f.value
                  ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <Loader className="animate-spin mx-auto mb-2" />
          Loading...
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No reading topics found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => {
            const diffKey = topic.difficulty || "";
            const diffLabel = difficultyLabels[diffKey] || diffKey || "Chưa phân loại";
            const diffColor = difficultyColors[diffKey] || "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300";

            return (
              <div
                key={topic.id}
                className={`bg-white dark:bg-zinc-800 rounded-lg border p-4 transition-shadow hover:shadow-md ${
                  topic.isActive === false
                    ? "border-gray-200 dark:border-zinc-700 opacity-60"
                    : "border-gray-200 dark:border-zinc-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                        {topic.title}
                      </h3>
                      {topic.isPremiumRequired && (
                        <Crown className="h-4 w-4 shrink-0 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        Part {topic.partType}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${diffColor}`}>
                        {diffLabel}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {topic.passageCount} bài • {topic.questionCount} câu
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Premium toggle */}
                  <button
                    type="button"
                    disabled={savingId === topic.id}
                    onClick={() => togglePremium(topic)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-70 ${
                      topic.isPremiumRequired
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
                    }`}
                  >
                    {savingId === topic.id ? (
                      <Loader className="h-3 w-3 animate-spin" />
                    ) : topic.isPremiumRequired ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3" />
                    )}
                    {topic.isPremiumRequired ? "Premium" : "Free"}
                  </button>

                  {/* Active toggle */}
                  <button
                    type="button"
                    disabled={savingId === topic.id}
                    onClick={() => toggleActive(topic)}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600 transition"
                  >
                    {topic.isActive !== false ? (
                      <><Eye className="h-3 w-3" /> Hiện</>
                    ) : (
                      <><EyeOff className="h-3 w-3" /> Ẩn</>
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => deleteTopic(topic)}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-500/30 transition"
                  >
                    <Trash2 className="h-3 w-3" />
                    Xóa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
