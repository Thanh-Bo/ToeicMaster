"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ALargeSmall,
  ArrowLeft,
  BookOpen,
  FileText,
  History,
  Library,
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/app/components/layout";
import ReadingHistoryList from "@/app/components/reading/ReadingHistoryList";
import { readingService } from "@/app/services/readingService";
import type { ReadingHistoryItem, ReadingTopicDetail } from "@/app/types";

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

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as { response?: { data?: { error?: string } } };
  return apiError.response?.data?.error || fallback;
};

export default function ReadingTopicHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const [topic, setTopic] = useState<ReadingTopicDetail | null>(null);
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [loadingTopic, setLoadingTopic] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadTopic = async () => {
      try {
        const data = await readingService.getTopic(topicId);
        if (!mounted) return;
        setTopic(data);
      } catch (error: unknown) {
        if (!mounted) return;
        toast.error(getErrorMessage(error, "Không thể tải topic Reading."));
        router.push("/reading");
      } finally {
        if (mounted) setLoadingTopic(false);
      }
    };

    loadTopic();
    return () => {
      mounted = false;
    };
  }, [router, topicId]);

  useEffect(() => {
    let mounted = true;

    const loadHistory = async () => {
      try {
        const data = await readingService.getHistory(1, 50, undefined, topicId);
        if (!mounted) return;
        setHistory(data.items);
      } catch (error: unknown) {
        if (!mounted) return;
        setHistory([]);
        toast.error(getErrorMessage(error, "Không thể tải lịch sử Reading."));
      } finally {
        if (mounted) setLoadingHistory(false);
      }
    };

    loadHistory();
    return () => {
      mounted = false;
    };
  }, [topicId]);

  if (loadingTopic) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <PageHeader />
        <div className="mx-auto max-w-7xl px-4 py-12 text-center text-sm font-semibold text-gray-500 dark:text-zinc-400">
          Đang tải lịch sử Reading...
        </div>
      </div>
    );
  }

  if (!topic) return null;

  const difficultyKey = topic.difficulty || "";
  const difficultyLabel = difficultyKey
    ? difficultyLabels[difficultyKey] || difficultyKey
    : "Chưa phân loại";

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
        <button
          type="button"
          onClick={() => router.push("/reading")}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại topic
        </button>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="mb-4 flex flex-wrap items-center gap-2">
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
          <h1 className="text-3xl font-black tracking-tight text-gray-950 dark:text-white">
            {topic.title}
          </h1>
          {topic.description && (
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
              {topic.description}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-zinc-950/70">
              <p className="text-xl font-black">{topic.passageCount}</p>
              <p className="text-xs font-bold text-gray-500 dark:text-zinc-400">bài luyện</p>
            </div>
            <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-zinc-950/70">
              <p className="text-xl font-black">{topic.questionCount}</p>
              <p className="text-xs font-bold text-gray-500 dark:text-zinc-400">câu hỏi</p>
            </div>
          </div>
        </section>

        <div className="mb-8 flex max-w-sm gap-1.5 rounded-xl border border-gray-200/70 bg-gray-100/80 p-1.5 dark:border-zinc-800/70 dark:bg-zinc-900/70">
          <Link
            href={`/reading/topics/${topicId}`}
            className="flex-1 rounded-lg px-3 py-2 text-center text-sm font-bold text-gray-500 transition hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <BookOpen className="h-4 w-4" />
              Bài luyện
            </span>
          </Link>
          <Link
            href={`/reading/topics/${topicId}/history`}
            className="flex-1 rounded-lg bg-white px-3 py-2 text-center text-sm font-bold text-blue-600 shadow-sm transition dark:bg-zinc-800 dark:text-blue-400"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <History className="h-4 w-4" />
              Lịch sử
            </span>
          </Link>
        </div>

        <section>
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Lịch sử</p>
            <h2 className="text-xl font-black text-gray-950 dark:text-white">Phiên đã hoàn thành</h2>
          </div>
          <ReadingHistoryList items={history} loading={loadingHistory} topicId={topicId} />
        </section>
      </main>
    </div>
  );
}
