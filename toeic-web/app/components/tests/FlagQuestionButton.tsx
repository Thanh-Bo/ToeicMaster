"use client";

import { Flag } from "lucide-react";

interface Props {
  flagged: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Small toggle shown next to a question number to mark it for later.
 * Green = marked, neutral = not marked.
 */
export default function FlagQuestionButton({ flagged, onToggle, className = "" }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      title={flagged ? "Bỏ đánh dấu làm sau" : "Đánh dấu làm sau"}
      aria-label={flagged ? "Bỏ đánh dấu làm sau" : "Đánh dấu làm sau"}
      aria-pressed={flagged}
      className={`shrink-0 ml-auto w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border transition-all active:scale-95 ${
        flagged
          ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-500/20"
          : "border-gray-300 dark:border-zinc-600 text-gray-400 dark:text-zinc-500 hover:text-emerald-600 hover:border-emerald-500 dark:hover:text-emerald-400 dark:hover:border-emerald-500"
      } ${className}`}
    >
      <Flag className="w-3.5 h-3.5" fill={flagged ? "currentColor" : "none"} />
    </button>
  );
}
