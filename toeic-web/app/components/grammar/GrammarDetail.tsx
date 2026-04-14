"use client";

import { useState } from "react";
import { ChevronLeft, Play, Volume2 } from "lucide-react";
import Link from "next/link";
import { Grammar } from "@/app/types";

interface GrammarDetailProps {
  grammar: Grammar;
  onBack?: () => void;
}

export function GrammarDetail({ grammar, onBack }: GrammarDetailProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);

  const playAudio = (url: string | undefined) => {
    if (!url) return;
    const audio = new Audio(url);
    setIsPlayingAudio(true);
    audio.play();
    audio.onended = () => setIsPlayingAudio(false);
  };

  const currentExample = grammar.grammarExamples?.[currentExampleIndex];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Header with Back Button */}
      <div className="border-b border-gray-200 dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-900 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 truncate">
            {grammar.ruleName}
          </h1>
          {grammar.difficulty && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              Độ khó: {grammar.difficulty}/5
            </span>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Main Content Grid */}
        <div className="grid gap-8">
          {/* 1. Structure */}
          {grammar.structure && (
            <div className="rounded-xl p-6 border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30">
              <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
                CẤU TRÚC
              </div>
              <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                {grammar.structure}
              </div>
            </div>
          )}

          {/* 2. Meaning */}
          <div className="rounded-xl p-6 border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase">
              Ý NGHĨA
            </div>
            <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
              {grammar.meaning}
            </p>
          </div>

          {/* 3. Main Example */}
          {grammar.example && (
            <div className="rounded-xl p-6 border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase">
                Ví dụ
              </div>
              <div className="space-y-3">
                {/* English Example */}
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Tiếng Anh:</p>
                  <p className="text-lg text-gray-900 dark:text-white font-medium">
                    {grammar.example}
                  </p>
                  {grammar.audioUrl && (
                    <button
                      onClick={() => playAudio(grammar.audioUrl)}
                      className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                    >
                      {isPlayingAudio ? (
                        <Volume2 className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      Nghe phát âm
                    </button>
                  )}
                </div>

                {/* Vietnamese Translation */}
                {grammar.exampleTranslation && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Tiếng Việt:</p>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      {grammar.exampleTranslation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Common Mistakes */}
          {grammar.commonMistakes && (
            <div className="rounded-xl p-6 border-2 border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20">
              <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 uppercase">
                ⚠️ Lỗi Thường Gặp
              </div>
              <p className="text-gray-900 dark:text-white">{grammar.commonMistakes}</p>
            </div>
          )}

          {/* 5. Image */}
          {grammar.imageUrl && (
            <div className="rounded-xl overflow-hidden border-2 border-gray-200 dark:border-zinc-700">
              <img
                src={grammar.imageUrl}
                alt={grammar.ruleName}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* 6. Grammar Examples */}
          {grammar.grammarExamples && grammar.grammarExamples.length > 0 && (
            <div className="rounded-xl p-6 border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 uppercase">
                Các ví dụ bổ sung ({grammar.grammarExamples.length})
              </div>

              <div className="space-y-4">
                {/* Current Example */}
                {currentExample && (
                  <div className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-zinc-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ví dụ {currentExampleIndex + 1}
                    </p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {currentExample.sentence}
                    </p>
                    {currentExample.translation && (
                      <p className="text-gray-700 dark:text-gray-300">
                        {currentExample.translation}
                      </p>
                    )}
                    {currentExample.context && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        Ngữ cảnh: {currentExample.context}
                      </p>
                    )}
                    {currentExample.audioUrl && (
                      <button
                        onClick={() => playAudio(currentExample.audioUrl)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-sm"
                      >
                        <Play className="w-4 h-4" />
                        Nghe
                      </button>
                    )}
                  </div>
                )}

                {/* Navigation */}
                {grammar.grammarExamples.length > 1 && (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        setCurrentExampleIndex((i) =>
                          i === 0 ? grammar.grammarExamples!.length - 1 : i - 1
                        )
                      }
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    >
                      ← Trước
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {currentExampleIndex + 1} / {grammar.grammarExamples.length}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentExampleIndex((i) =>
                          i === grammar.grammarExamples!.length - 1 ? 0 : i + 1
                        )
                      }
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Tiếp →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-4">
            <Link
              href={`/grammar/practice?grammarId=${grammar.id}`}
              className="flex-1 px-6 py-3 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all duration-200 hover:shadow-md text-center"
            >
              Luyện tập
            </Link>
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3 rounded-lg font-semibold border-2 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-200"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
