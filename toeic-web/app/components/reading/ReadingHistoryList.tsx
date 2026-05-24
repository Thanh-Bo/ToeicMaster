"use client";

import Link from "next/link";
import { Clock, FileText } from "lucide-react";
import type { ReadingHistoryItem } from "../../types";

interface Props {
  items: ReadingHistoryItem[];
  loading?: boolean;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
};

export default function ReadingHistoryList({ items, loading = false }: Props) {
  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-zinc-400">Đang tải lịch sử...</p>;
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center dark:border-zinc-800">
        <p className="font-bold text-gray-950 dark:text-white">Chưa có phiên Reading nào.</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
          Bắt đầu một phiên để xem tiến độ tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/reading/${item.id}`}
          className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:bg-blue-50/40 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-800 dark:hover:bg-blue-500/5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-gray-950 dark:text-white">
                {item.correctAnswers}/{item.totalQuestions} correct
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {item.totalPassages} passages - {item.accuracy}% accuracy
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-1 text-sm font-semibold text-gray-500 dark:text-zinc-400 sm:flex">
            <Clock className="h-4 w-4" />
            {formatTime(item.timeSpentSeconds)}
          </div>
        </Link>
      ))}
    </div>
  );
}
