"use client";

import { Clock } from "lucide-react";
import type { ReadingSession } from "../../types";

interface Props {
  session: ReadingSession;
  currentIndex: number;
  elapsedSeconds: number;
  selectedAnswers: Record<number, string>;
  onJump: (index: number) => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function ReadingSessionSidebar({
  session,
  currentIndex,
  elapsedSeconds,
  selectedAnswers,
  onJump,
}: Props) {
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = session.totalQuestions > 0 ? Math.round((answeredCount / session.totalQuestions) * 100) : 0;

  return (
    <aside className="lg:sticky lg:top-24 self-start rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-200">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500">Tiến trình</p>
            <p className="text-xl font-black text-gray-950 dark:text-white">
              {answeredCount}/{session.totalQuestions}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 border border-gray-100 px-3 py-1.5 text-sm font-bold text-gray-700 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-300">
            <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400 animate-pulse" />
            {formatTime(elapsedSeconds)}
          </div>
        </div>
        <div className="w-full bg-gray-100 dark:bg-zinc-900 rounded-full h-2 overflow-hidden border border-transparent">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 lg:grid-cols-1 border-t border-gray-100 dark:border-zinc-900 pt-4">
        {session.passages.map((passage, index) => {
          const total = passage.questions.length;
          const answered = passage.questions.filter((q) => selectedAnswers[q.id]).length;
          const active = index === currentIndex;
          const isAllAnswered = answered === total;

          return (
            <button
              key={passage.id}
              type="button"
              onClick={() => onJump(index)}
              className={`flex items-center justify-center lg:justify-between gap-1.5 lg:gap-2 rounded-xl border px-2 py-2 lg:px-4 lg:py-2.5 text-center lg:text-left text-sm transition duration-200 cursor-pointer ${
                active
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/20 dark:border-blue-500 dark:bg-blue-600"
                  : isAllAnswered
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70 dark:border-emerald-950/20 dark:bg-emerald-950/10 dark:text-emerald-400 dark:hover:bg-emerald-950/25 dark:border-emerald-900/30"
                    : answered > 0
                      ? "border-amber-200 bg-amber-50/50 text-amber-700 hover:bg-amber-100/50 dark:border-amber-950/20 dark:bg-amber-950/5 dark:text-amber-400 dark:hover:bg-amber-950/15 dark:border-amber-900/20"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
              }`}
            >
              <div className="flex flex-col lg:block">
                <span className="block font-black lg:hidden text-xs">P{index + 1}</span>
                <span className="hidden lg:block font-extrabold text-sm">Passage {index + 1}</span>
                <span className={`text-[9px] lg:text-xs font-semibold ${active ? "text-blue-100" : "text-gray-400 dark:text-zinc-500"}`}>
                  Part {passage.partType}
                </span>
              </div>
              <span className={`rounded-lg px-1.5 py-0.5 text-[9px] lg:text-xs font-extrabold ${
                active
                  ? "bg-blue-700/50 text-white"
                  : isAllAnswered
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : answered > 0
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}>
                {answered}/{total}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
