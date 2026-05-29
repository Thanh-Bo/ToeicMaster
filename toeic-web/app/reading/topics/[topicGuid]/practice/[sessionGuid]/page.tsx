"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import toast from "react-hot-toast";
import ReadingPassageView from "@/app/components/reading/ReadingPassageView";
import ReadingQuestionList from "@/app/components/reading/ReadingQuestionList";
import ReadingResultView from "@/app/components/reading/ReadingResultView";
import { readingService } from "@/app/services/readingService";
import type { ReadingSession } from "@/app/types";

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as { response?: { data?: { error?: string } } };
  return apiError.response?.data?.error || fallback;
};

export default function ReadingSessionPage() {
  const params = useParams();
  const router = useRouter();
  const topicGuid = params.topicGuid as string;
  const sessionGuid = params.sessionGuid as string;

  const [session, setSession] = useState<ReadingSession | null>(null);
  const [result, setResult] = useState<ReadingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentPassageIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const data = await readingService.getSession(sessionGuid);
        if (!mounted) return;
        setSession(data);
        setElapsedSeconds(data.timeSpentSeconds || 0);

        const selected: Record<number, string> = {};
        data.passages.forEach((passage) => {
          passage.questions.forEach((question) => {
            if (question.selectedOption) selected[question.id] = question.selectedOption;
          });
        });
        setSelectedAnswers(selected);
      } catch {
        if (!mounted) return;
        toast.error("Không thể tải phiên Reading.");
        router.push("/reading");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSession();
    return () => {
      mounted = false;
    };
  }, [router, sessionGuid]);

  useEffect(() => {
    if (!session || session.status === "completed") return;
    const timer = setInterval(() => {
      setElapsedSeconds((value) => value + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [session]);

  const currentPassage = session?.passages[currentPassageIndex];
  const isCompleted = session?.status === "completed" || !!result;

  const totalAnswered = useMemo(() => Object.keys(selectedAnswers).length, [selectedAnswers]);

  const selectAnswer = async (questionId: number, option: string) => {
    if (!session || isCompleted) return;

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
    try {
      await readingService.submitAnswer(session.sessionId, questionId, option);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Không thể lưu đáp án."));
    }
  };

  const completeSession = async () => {
    if (!session) return;

    const ok = window.confirm("Nộp bài Reading này ngay bây giờ?");
    if (!ok) return;

    try {
      setSubmitting(true);
      const data = await readingService.complete(session.sessionId, elapsedSeconds);
      setResult(data);
      setSession(data);
      toast.success("Đã nộp bài Reading.");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Không thể nộp bài."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
       
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 animate-pulse">
          {/* Top buttons skeleton */}
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-gray-100 pb-5 dark:border-zinc-900">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-zinc-800" />
              <div className="space-y-1.5">
                <div className="h-3 w-24 rounded bg-gray-200 dark:bg-zinc-800" />
                <div className="h-5 w-40 rounded bg-gray-200 dark:bg-zinc-800" />
              </div>
            </div>
            <div className="h-10 w-32 rounded-xl bg-gray-200 dark:bg-zinc-800" />
          </div>

          {/* Content grid skeleton */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            {/* Passage skeleton */}
            <div className="h-[500px] rounded-2xl bg-gray-100 dark:bg-zinc-900/40 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 rounded bg-gray-200 dark:bg-zinc-800" />
                <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-zinc-800" />
              </div>
              <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-zinc-800" />
              <div className="h-48 w-full rounded-xl bg-gray-200 dark:bg-zinc-800" />
              <div className="space-y-2 pt-4">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-zinc-800" />
                <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-zinc-800" />
                <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-zinc-800" />
              </div>
            </div>

            {/* Questions skeleton */}
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-2xl bg-gray-100 dark:bg-zinc-900/40 p-6 space-y-4">
                  <div className="h-3 w-20 rounded bg-gray-200 dark:bg-zinc-800" />
                  <div className="h-5 w-5/6 rounded bg-gray-200 dark:bg-zinc-800" />
                  <div className="space-y-2 pt-2">
                    <div className="h-11 rounded-xl bg-gray-200 dark:bg-zinc-800" />
                    <div className="h-11 rounded-xl bg-gray-200 dark:bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!session || !currentPassage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-zinc-950 dark:text-white transition-colors duration-200">
     

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Testing Header Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5 dark:border-zinc-900">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(`/reading/topics/${topicGuid}`)}
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 transition cursor-pointer"
              title="Quay lại"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Luyện tập Reading</span>
              <h1 className="text-xl font-extrabold text-gray-950 dark:text-white leading-tight mt-0.5">
                Phiên luyện tập Reading
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isCompleted && (
              <button
                type="button"
                onClick={completeSession}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-60 transition cursor-pointer shadow-sm shadow-blue-500/10"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Đang nộp..." : `Nộp bài (${totalAnswered}/${session.totalQuestions})`}
              </button>
            )}
          </div>
        </div>

        {isCompleted && <div className="mb-6"><ReadingResultView session={session} result={result} topicId={topicGuid} /></div>}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <ReadingPassageView
            passage={currentPassage}
            currentIndex={currentPassageIndex}
            total={session.passages.length}
          />

          <div>
            <ReadingQuestionList
              passage={currentPassage}
              selectedAnswers={selectedAnswers}
              onSelect={selectAnswer}
              disabled={isCompleted}
              showResult={isCompleted}
            />

            {/* <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 dark:border-zinc-900 pt-4">
              <button
                type="button"
                onClick={() => setCurrentPassageIndex((value) => Math.max(0, value - 1))}
                disabled={currentPassageIndex === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentPassageIndex((value) =>
                    Math.min(session.passages.length - 1, value + 1),
                  )
                }
                disabled={currentPassageIndex === session.passages.length - 1}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 transition cursor-pointer"
              >
                Tiếp theo
                <ChevronRight className="h-4 w-4" />
              </button>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}
