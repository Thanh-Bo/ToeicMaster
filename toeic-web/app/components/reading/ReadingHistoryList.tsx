"use client";

import Link from "next/link";
import { CalendarDays, Clock, FileText, ChevronRight, Award } from "lucide-react";
import type { ReadingHistoryItem } from "../../types";

interface Props {
  items: ReadingHistoryItem[];
  loading?: boolean;
  topicId?: number | string;
}

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0m 00s";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
};

export default function ReadingHistoryList({ items, loading = false, topicId }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-205 dark:border-zinc-700 border-t-blue-500"></div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
        <FileText className="w-10 h-10 mx-auto text-gray-300 dark:text-zinc-600 mb-3" />
        <p className="font-bold text-gray-900 dark:text-white">Chưa có phiên Reading nào.</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
          Bắt đầu một phiên luyện tập để xem tiến độ tại đây.
        </p>
      </div>
    );
  }

  // Helper to determine accuracy badge and color config
  const getAccuracyConfig = (accuracy: number) => {
    if (accuracy >= 80) {
      return {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/20 dark:border-emerald-500/30",
        iconBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-450",
      };
    }
    if (accuracy >= 50) {
      return {
        bg: "bg-amber-500/10 dark:bg-amber-500/20",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20 dark:border-amber-500/30",
        iconBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-450",
      };
    }
    return {
      bg: "bg-rose-500/10 dark:bg-rose-500/20",
      text: "text-rose-600 dark:text-rose-450",
      border: "border-rose-500/20 dark:border-rose-500/30",
      iconBg: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-450",
    };
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const accuracy = item.accuracy || 0;
        const config = getAccuracyConfig(accuracy);

        return (
          <Link
            key={item.id}
            href={
              topicId || item.topicIds?.[0]
                ? `/reading/topics/${topicId ?? item.topicIds?.[0]}/practice/${item.id}`
                : "/reading"
            }
            className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-200/60 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-4 sm:p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-400/50 dark:border-zinc-800/60 dark:hover:border-blue-500/50 hover:bg-blue-50/20 dark:hover:bg-zinc-900"
          >
            {/* Left - Icon and Details */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${config.iconBg}`}>
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-extrabold text-gray-900 dark:text-white text-sm sm:text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.correctAnswers}/{item.totalQuestions} correct
                  </p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] sm:text-xs font-bold ${config.bg} ${config.text} ${config.border}`}>
                    <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{accuracy}% accuracy</span>
                  </span>
                </div>
                
                {/* Passage count, mobile timeSpent, and Date info */}
                <div className="flex items-center gap-x-2.5 gap-y-1 mt-1.5 flex-wrap text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <span>{item.totalPassages} passages</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-700 sm:hidden"></span>
                  {/* Time spent: Visible on mobile inside details block */}
                  <span className="flex items-center gap-1 sm:hidden">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(item.timeSpentSeconds)}
                  </span>
                  {item.completedAt && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-700"></span>
                      <span className="inline-flex items-center gap-1 text-gray-400 dark:text-zinc-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(item.completedAt).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right - Desktop Time and Chevron */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-700 dark:text-zinc-300 bg-gray-100/60 dark:bg-zinc-800/60 px-3 py-1.5 rounded-xl border border-gray-200/50 dark:border-zinc-700/50 sm:flex">
                <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                {formatTime(item.timeSpentSeconds)}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
