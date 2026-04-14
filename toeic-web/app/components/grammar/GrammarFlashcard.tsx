"use client";

import { useState } from "react";
import { Grammar } from "@/app/types";
import { Volume2, RotateCcw, CheckCircle, XCircle } from "lucide-react";

interface GrammarFlashcardProps {
  grammar: Grammar;
  cardNumber: number;
  totalCards: number;
  onMark: (isCorrect: boolean) => void;
  isLast?: boolean;
}

export function GrammarFlashcard({
  grammar,
  cardNumber,
  totalCards,
  onMark,
  isLast = false,
}: GrammarFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const playAudio = (url: string | undefined) => {
    if (!url) return;
    const audio = new Audio(url);
    setIsPlayingAudio(true);
    audio.play();
    audio.onended = () => setIsPlayingAudio(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Thẻ {cardNumber}/{totalCards}
        </span>
        <div className="w-40 h-2 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${(cardNumber / totalCards) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="h-80 rounded-2xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-pointer mb-8 flex items-center justify-center p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.6s",
        }}
      >
        <div
          style={{
            backfaceVisibility: "hidden",
          }}
          className="text-center w-full"
        >
          {!isFlipped ? (
            // Front Side - Rule Name
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Quy tắc</p>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {grammar.ruleName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Nhấp để xem chi tiết
              </p>
            </div>
          ) : (
            // Back Side - Details
            <div className="space-y-4 text-left">
              {grammar.structure && (
                <div>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 uppercase">
                    Cấu trúc
                  </p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">
                    {grammar.structure}
                  </p>
                </div>
              )}

              {grammar.meaning && (
                <div>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 uppercase">
                    Ý nghĩa
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {grammar.meaning}
                  </p>
                </div>
              )}

              {grammar.example && (
                <div>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 uppercase">
                    Ví dụ
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {grammar.example}
                  </p>
                  {grammar.exampleTranslation && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {grammar.exampleTranslation}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Audio Button */}
      {grammar.audioUrl && (
        <div className="flex justify-center mb-8">
          <button
            onClick={() => playAudio(grammar.audioUrl)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200 font-semibold"
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-5 h-5 animate-pulse" />
                Đang phát...
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                Phát âm thanh
              </>
            )}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => onMark(false)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-red-400 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 hover:shadow-md"
        >
          <XCircle className="w-5 h-5" />
          Chưa thuộc
        </button>

        <button
          onClick={() => {
            setIsFlipped(false);
          }}
          className="px-4 py-3 rounded-lg font-semibold border-2 border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-950/30 transition-all duration-200"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => onMark(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-green-400 dark:border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all duration-200 hover:shadow-md"
        >
          <CheckCircle className="w-5 h-5" />
          Đã thuộc
        </button>
      </div>

      {/* End Message */}
      {isLast && (
        <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
          <p className="text-sm text-blue-600 dark:text-blue-400 text-center font-semibold">
            Đây là thẻ cuối cùng. Nhấn "Đã thuộc" hoặc "Chưa thuộc" để hoàn thành ôn tập.
          </p>
        </div>
      )}
    </div>
  );
}
