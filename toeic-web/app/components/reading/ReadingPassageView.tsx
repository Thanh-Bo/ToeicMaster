"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import type { ReadingPassage } from "../../types";

interface Props {
  passage: ReadingPassage;
  currentIndex: number;
  total: number;
}

export default function ReadingPassageView({ passage, currentIndex, total }: Props) {
  const [showTranslation, setShowTranslation] = useState(false);
  const hasTranslation = !!passage.textContentTranslation;

  return (
    <section className="lg:sticky lg:top-24 self-start max-h-[calc(100vh-140px)] overflow-y-auto rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs transition-all duration-200">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Passage {currentIndex + 1} / {total}
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-gray-950 dark:text-white">
            {passage.title || `Part ${passage.partType} Reading`}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {hasTranslation && (
            <button
              type="button"
              onClick={() => setShowTranslation((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                showTranslation
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
              title={showTranslation ? "Ẩn bản dịch" : "Hiện bản dịch"}
            >
              <Languages className="h-3.5 w-3.5" />
              Song ngữ
            </button>
          )}
          <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-zinc-900 dark:text-zinc-300">
            Part {passage.partType}
          </div>
        </div>
      </div>

      {passage.imageUrl && (
        <img
          src={passage.imageUrl}
          alt={passage.title || "Reading passage"}
          className="mb-4 max-h-80 w-full rounded-xl object-contain border border-gray-100 dark:border-zinc-800"
        />
      )}

      <div
        className="prose prose-sm max-w-none text-gray-800 dark:prose-invert dark:text-zinc-200"
        dangerouslySetInnerHTML={{
          __html: passage.textContent || "<p>No passage content.</p>",
        }}
      />

      {showTranslation && passage.textContentTranslation && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-800 dark:bg-emerald-950/40">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            Bản dịch tiếng Việt
          </p>
          <div
            className="prose prose-sm max-w-none text-gray-700 dark:text-zinc-300"
            dangerouslySetInnerHTML={{
              __html: passage.textContentTranslation,
            }}
          />
        </div>
      )}
    </section>
  );
}
