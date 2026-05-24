"use client";

import { BookOpen, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import type { ReadingStats } from "../../types";

interface Props {
  stats: ReadingStats | null;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
};

export default function ReadingStatsView({ stats }: Props) {
  return (
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
    </section>
  );
}
