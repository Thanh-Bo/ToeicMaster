"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ALargeSmall,
  ArrowLeft,
  BookOpen,
  FileText,
  Library,
  PlayCircle,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/app/components/layout";
import { readingService } from "@/app/services/readingService";
import type { ReadingLesson, ReadingTopicDetail } from "@/app/types";

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

const accents = [
  "border-t-blue-500",
  "border-t-emerald-500",
  "border-t-amber-500",
  "border-t-cyan-500",
  "border-t-rose-500",
  "border-t-violet-500",
];

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as { response?: { data?: { error?: string } } };
  return apiError.response?.data?.error || fallback;
};

export default function ReadingTopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const [topic, setTopic] = useState<ReadingTopicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<number | null>(null);

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
        if (mounted) setLoading(false);
      }
    };

    loadTopic();
    return () => {
      mounted = false;
    };
  }, [router, topicId]);

  const startLesson = async (passageId: number) => {
    try {
      setStartingId(passageId);
      const session = await readingService.startLesson(passageId);
      router.push(`/reading/topics/${topicId}/pratice/${session.sessionId}`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Không thể bắt đầu bài Reading."));
    } finally {
      setStartingId(null);
    }
  };

  const renderLessonCard = (lesson: ReadingLesson, index: number) => {
    const difficultyKey = lesson.difficulty || "";
    const difficultyLabel = difficultyKey
      ? difficultyLabels[difficultyKey] || difficultyKey
      : "Chưa phân loại";
    const accent = accents[index % accents.length];

    return (
      <article
        key={lesson.id}
        className={`flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-gray-200 border-t-4 ${accent} bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/70`}
      >
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              {lesson.partType === 6 ? (
                <FileText className="h-7 w-7" />
              ) : (
                <BookOpen className="h-7 w-7" />
              )}
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400">
                Bài {index + 1}
              </p>
              <h3 className="line-clamp-2 text-lg font-black leading-snug text-gray-950 dark:text-white">
                {lesson.title || `Reading Part ${lesson.partType}`}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-600 dark:text-blue-400">
                  Part {lesson.partType}
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

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between text-sm font-bold">
              <span className="text-gray-500 dark:text-zinc-400">Cấu trúc bài</span>
              <span className="text-blue-600 dark:text-blue-400">{lesson.questionCount} câu</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, questionIndex) => {
                const active = questionIndex < Math.min(lesson.questionCount, 5);
                return (
                  <div
                    key={questionIndex}
                    className={`h-9 rounded-lg border text-center text-xs font-black leading-9 ${
                      active
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-gray-200 bg-gray-50 text-gray-300 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-700"
                    }`}
                  >
                    {questionIndex + 1}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-5 flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-zinc-400">
            <Target className="h-4 w-4 text-emerald-500" />
            {lesson.partType === 6 ? "Text Completion" : "Reading Comprehension"}
          </div>

          {lesson.shortDescription && (
            <p className="line-clamp-3 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
              {lesson.shortDescription}
            </p>
          )}
        </div>

        <div className="border-t border-gray-100 p-5 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => startLesson(lesson.id)}
            disabled={startingId === lesson.id}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <PlayCircle className="h-4 w-4" />
            {startingId === lesson.id ? "Đang bắt đầu..." : "Bắt đầu luyện"}
          </button>
        </div>
      </article>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <PageHeader />
        <div className="mx-auto max-w-7xl px-4 py-12 text-center text-sm font-semibold text-gray-500 dark:text-zinc-400">
          Đang tải topic Reading...
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

        {topic.passages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center dark:border-zinc-800">
            <BookOpen className="mx-auto mb-3 h-9 w-9 text-gray-300 dark:text-zinc-700" />
            <p className="font-bold text-gray-950 dark:text-white">Topic này chưa có bài luyện.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topic.passages.map(renderLessonCard)}
          </div>
        )}
      </main>
    </div>
  );
}
