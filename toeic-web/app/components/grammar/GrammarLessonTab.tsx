"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Grammar } from "@/app/types";
import { grammarService } from "@/app/services/grammarService";
import { Play, Volume2, AlertTriangle, XCircle, Lightbulb, BookOpen } from "lucide-react";

interface GrammarLessonTabProps {
  grammar: Grammar;
  topicId?: number;
}

export function GrammarLessonTab({ grammar, topicId }: GrammarLessonTabProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);

  // Mark grammar as learned when user views the lesson (Option A)
  useEffect(() => {
    if (topicId && grammar.id) {
      grammarService.markAsLearned(topicId, grammar.id).catch((error) => {
        // Silently fail - don't block user from viewing lesson
        console.log("Failed to mark as learned:", error);
      });
    }
  }, [topicId, grammar.id]);

  const parseMarkdown = (text: string | undefined) => {
    if (!text) return "";
    // Convert \\n literal string to actual newlines
    return text.replace(/\\n/g, '\n');
  };

  const playAudio = (url: string | undefined) => {
    if (!url) return;
    const audio = new Audio(url);
    setIsPlayingAudio(true);
    audio.play();
    audio.onended = () => setIsPlayingAudio(false);
  };

  const currentExample = grammar.grammarExamples?.[currentExampleIndex];

  return (
    <div className="space-y-4 sm:space-y-8 pb-4 sm:pb-8">
      {/* 1. Structure */}
      {grammar.structure && (
        <div className="rounded-xl p-4 sm:p-6 border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30">
          <div className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2 sm:mb-3">
            CẤU TRÚC
          </div>
          <div className="text-base sm:text-xl text-gray-900 dark:text-white leading-relaxed prose dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:ml-5 [&_li]:mb-3 [&_strong]:font-bold [&_strong]:text-gray-950 dark:[&_strong]:text-white  break-words whitespace-pre-wrap">
            {grammar.structure}
          </div>
        </div>  
      )}

      {/* 2. Meaning */}
      <div className="rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 uppercase">
          Ý NGHĨA
        </div>
        <div className="text-sm sm:text-base text-gray-900 dark:text-white leading-relaxed prose dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:ml-5 [&_li]:mb-3 [&_strong]:font-bold [&_strong]:text-gray-950 dark:[&_strong]:text-white">
          <ReactMarkdown>{grammar.meaning}</ReactMarkdown>
        </div>
      </div>

      {/* 3. Main Example */}
      {grammar.example && (
        <div className="rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 uppercase">
            Ví dụ
          </div>
          <div className="space-y-2 sm:space-y-3">
            {/* English Example */}
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Tiếng Anh:</p>
              <p className="text-base sm:text-lg text-gray-900 dark:text-white font-medium">
                {grammar.example}
              </p>
              {grammar.audioUrl && (
                <button
                  onClick={() => playAudio(grammar.audioUrl)}
                  className="mt-2 inline-flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-sm"
                >
                  {isPlayingAudio ? (
                    <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                  ) : (
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                  Nghe phát âm
                </button>
              )}
            </div>

            {/* Vietnamese Translation */}
            {grammar.exampleTranslation && (
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Tiếng Việt:</p>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                  {grammar.exampleTranslation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Common Mistakes */}
      {grammar.commonMistakes && (
        <div className="rounded-xl p-6 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 mb-3 uppercase">
            <AlertTriangle className="w-4 h-4" />
            Lỗi Thường Gặp
          </div>
          <p className="text-gray-900 dark:text-white">{grammar.commonMistakes}</p>
        </div>
      )}

      {/* 4.1 Negative Example */}
      {grammar.negativeExample && (
        <div className="rounded-xl p-6 border border-orange-200 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-950/20">
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400 mb-3 uppercase">
            <XCircle className="w-4 h-4" />
            Cách Sai
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Tiếng Anh:</p>
              <p className="text-lg text-gray-900 dark:text-white font-medium line-through opacity-75">
                {grammar.negativeExample}
              </p>
            </div>
            {grammar.negativeExampleTranslation && (
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Tiếng Việt:</p>
                <p className="text-lg text-gray-700 dark:text-gray-300 opacity-75">
                  {grammar.negativeExampleTranslation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4.2 Test Tip */}
      {grammar.testTip && (
        <div className="rounded-xl p-6 border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-950/20">
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400 mb-3 uppercase">
            <Lightbulb className="w-4 h-4" />
            Mẹo Thi TOEIC
          </div>
          <p className="text-gray-900 dark:text-white">{grammar.testTip}</p>
        </div>
      )}

      {/* 4.3 Frequency & Difficulty Indicators */}
      <div className="grid grid-cols-2 gap-4">
        {grammar.difficulty && (
          <div className="rounded-xl p-6 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase">
              Độ Khó
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-6 rounded-full transition-colors ${
                      level <= grammar.difficulty
                        ? "bg-yellow-500"
                        : "bg-gray-300 dark:bg-zinc-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {grammar.difficulty}/5
              </span>
            </div>
          </div>
        )}

        {grammar.frequency && (
          <div className="rounded-xl p-6 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase">
              Tần Suất
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-300 dark:bg-zinc-600 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(grammar.frequency / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {grammar.frequency}/10
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 6. Grammar Examples */}
      {grammar.grammarExamples && grammar.grammarExamples.length > 0 && (
        <div className="rounded-xl p-6 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 uppercase">
            Các ví dụ bổ sung 
          </div>

          <div className="space-y-4">
            {/* Current Example */}
            {currentExample && (
              <div className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-zinc-900">
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
              <div className="flex items-center justify-between mt-4">
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
    </div>
  );
}
