"use client";

import { useEffect, useState } from "react";
import { vocabularyService } from "@/app/services/vocabularyService";
import { adminService } from "@/app/services/adminService";
import { Crown, Loader, Lock, Unlock } from "lucide-react";
import type { VocabularyTopic } from "@/app/types";

export default function VocabularyManagement() {
  const [topics, setTopics] = useState<VocabularyTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingTopicId, setSavingTopicId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const data = await vocabularyService.getTopics();
        setTopics(data);
      } catch (err) {
        setError("Failed to load topics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const toggleTopicPremium = async (topic: VocabularyTopic) => {
    if (savingTopicId === topic.id) return;

    const nextValue = !topic.isExplanationPremiumRequired;
    setSavingTopicId(topic.id);
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topic.id
          ? { ...t, isExplanationPremiumRequired: nextValue }
          : t,
      ),
    );

    try {
      await adminService.updateVocabularyExplanationAccess(topic.id, nextValue);
    } catch (err) {
      console.error("Failed to update vocabulary explanation access:", err);
      setTopics((prev) =>
        prev.map((t) =>
          t.id === topic.id
            ? { ...t, isExplanationPremiumRequired: topic.isExplanationPremiumRequired }
            : t,
        ),
      );
    } finally {
      setSavingTopicId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Vocabulary Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Toggle explanation premium requirement for each topic
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <Loader className="animate-spin mx-auto mb-2" />
          Loading topics...
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No topics found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                      {topic.title}
                    </h3>
                    {topic.isExplanationPremiumRequired && (
                      <Crown className="h-4 w-4 shrink-0 text-yellow-500" />
                    )}
                  </div>
                  {topic.totalWords && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {topic.totalWords} words
                    </p>
                  )}
                  <span
                    className={`inline-block mt-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      topic.level === "Advanced"
                        ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                        : topic.level === "Intermediate"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                    }`}
                  >
                    {topic.level === "Advanced"
                      ? "Nâng cao"
                      : topic.level === "Intermediate"
                        ? "Trung cấp"
                        : "Cơ bản"}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={savingTopicId === topic.id}
                  onClick={() => toggleTopicPremium(topic)}
                  className={`inline-flex min-w-[100px] items-center justify-between gap-2 rounded-full px-2 py-1 text-xs font-semibold transition disabled:cursor-wait disabled:opacity-70 ${
                    topic.isExplanationPremiumRequired
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${
                      topic.isExplanationPremiumRequired
                        ? "bg-yellow-500"
                        : "bg-emerald-500"
                    }`}
                  >
                    {savingTopicId === topic.id ? (
                      <Loader className="h-3.5 w-3.5 animate-spin" />
                    ) : topic.isExplanationPremiumRequired ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : (
                      <Unlock className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <span>
                    {topic.isExplanationPremiumRequired ? "Premium" : "Free"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          How it works:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>✓ Premium = explanations require subscription</li>
          <li>✓ Free = explanations available to all users</li>
          <li>✓ Questions and answers are always visible regardless of setting</li>
        </ul>
      </div>
    </div>
  );
}
