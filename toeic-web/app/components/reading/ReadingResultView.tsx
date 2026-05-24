"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import type { ReadingSession } from "../../types";

interface Props {
  session: ReadingSession;
  result?: ReadingSession | null;
  topicId?: string | number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
};

export default function ReadingResultView({ session, result, topicId }: Props) {
  const correct = result?.correctAnswers ?? session.correctAnswers;
  const total = result?.totalQuestions ?? session.totalQuestions;
  const accuracy = result?.accuracy ?? (total > 0 ? Math.round((correct / total) * 1000) / 10 : 0);
  const time = result?.timeSpentSeconds ?? session.timeSpentSeconds;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/10 p-6 dark:border-emerald-950/20 dark:bg-emerald-950/5">
      {/* Decorative accent gradient */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Hoàn thành luyện tập
          </p>
          <h2 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
            Kết quả Reading
          </h2>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-zinc-400">
            Hãy xem lại chi tiết bài làm bên dưới để xem đáp án đúng và giải thích.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-xs dark:border-zinc-900 dark:bg-zinc-950">
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{correct}/{total}</p>
            <p className="mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-wide">Số câu đúng</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-xs dark:border-zinc-900 dark:bg-zinc-950">
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{accuracy}%</p>
            <p className="mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-wide">Độ chính xác</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-xs dark:border-zinc-900 dark:bg-zinc-950">
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{formatTime(time)}</p>
            <p className="mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-wide">Thời gian</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={topicId ? `/reading/topics/${topicId}` : "/reading"}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Link>
        <Link
          href="/reading"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-blue-500/10 hover:bg-blue-700 transition-all cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          Luyện tập bài khác
        </Link>
      </div>
    </section>
  );
}
