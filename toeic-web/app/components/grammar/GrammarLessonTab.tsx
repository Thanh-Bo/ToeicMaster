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

  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentExampleIndex]);

  const currentExample = grammar.grammarExamples?.[currentExampleIndex];

  return (
    <div className="space-y-6 sm:space-y-8 pb-6 sm:pb-8">
      {/* 1. Structure */}
      {grammar.structure && (
        <div className="rounded-xl border border-gray-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 p-4 sm:p-6 overflow-hidden">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>CẤU TRÚC / CÔNG THỨC</span>
          </div>
          <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 font-mono text-xs sm:text-sm md:text-base text-gray-800 dark:text-zinc-200 overflow-x-auto leading-relaxed shadow-sm break-words whitespace-pre-wrap">
            {grammar.structure}
          </div>
        </div>  
      )}

      {/* 2. Meaning */}
      <div className="rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
        <div className="text-xs sm:text-sm font-bold text-gray-500 dark:text-zinc-400 mb-2 sm:mb-3 uppercase tracking-wider">
          Ý NGHĨA
        </div>
        <div className="text-sm sm:text-base text-gray-900 dark:text-white leading-relaxed prose dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:ml-5 [&_li]:mb-3 [&_strong]:font-bold [&_strong]:text-gray-950 dark:[&_strong]:text-white">
          <ReactMarkdown>{grammar.meaning}</ReactMarkdown>
        </div>
      </div>

      {/* 3. Main Example & Comparison */}
      {grammar.example && (
        <div className="space-y-4">
          <div className="text-xs sm:text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider px-1">
            Ví dụ & So sánh trực quan
          </div>
          
          {grammar.negativeExample ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Correct Column */}
              <div className="rounded-xl p-5 border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/20 dark:bg-emerald-950/10 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-[10px] font-extrabold">✓</span>
                    Cách dùng đúng (Correct)
                  </div>
                  <p className="text-base sm:text-lg text-gray-900 dark:text-white font-bold leading-relaxed">
                    {grammar.example}
                  </p>
                  {grammar.exampleTranslation && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 font-medium">
                      {grammar.exampleTranslation}
                    </p>
                  )}
                </div>
                {grammar.audioUrl && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => playAudio(grammar.audioUrl)}
                      className={`p-2 rounded-full border transition-all flex items-center justify-center ${
                        isPlayingAudio
                          ? "bg-blue-500/20 border-blue-500 text-blue-500 animate-pulse"
                          : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 hover:text-blue-500 hover:border-blue-500"
                      }`}
                      title="Nghe phát âm"
                    >
                      {isPlayingAudio ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Incorrect Column */}
              <div className="rounded-xl p-5 border border-red-200 dark:border-red-900/30 bg-red-50/20 dark:bg-red-950/10 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-[10px] font-extrabold">✗</span>
                    Cách dùng sai (Incorrect)
                  </div>
                  <p className="text-base sm:text-lg text-red-600 dark:text-red-400 font-bold line-through opacity-85 leading-relaxed">
                    {grammar.negativeExample}
                  </p>
                  {grammar.negativeExampleTranslation && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 font-medium">
                      {grammar.negativeExampleTranslation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Standalone Example if no negative example exists */
            <div className="rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2 flex-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tiếng Anh</div>
                <p className="text-base sm:text-lg text-gray-900 dark:text-white font-bold leading-relaxed">
                  {grammar.example}
                </p>
                {grammar.exampleTranslation && (
                  <div className="space-y-1 mt-2">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tiếng Việt</div>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      {grammar.exampleTranslation}
                    </p>
                  </div>
                )}
              </div>
              {grammar.audioUrl && (
                <button
                  onClick={() => playAudio(grammar.audioUrl)}
                  className={`p-3 rounded-full border transition-all flex items-center justify-center flex-shrink-0 ${
                    isPlayingAudio
                      ? "bg-blue-500/20 border-blue-500 text-blue-500 animate-pulse"
                      : "bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 hover:text-blue-500 hover:border-blue-500"
                  }`}
                >
                  {isPlayingAudio ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. Common Mistakes */}
      {grammar.commonMistakes && (
        <div className="rounded-xl p-5 border border-red-200/60 dark:border-red-900/20 bg-red-50/20 dark:bg-red-950/5">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 mb-2 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            Lỗi Thường Gặp
          </div>
          <p className="text-sm sm:text-base text-gray-800 dark:text-zinc-300 leading-relaxed">
            {grammar.commonMistakes}
          </p>
        </div>
      )}

      {/* 4.2 Test Tip */}
      {grammar.testTip && (
        <div className="rounded-xl p-5 sm:p-6 border border-amber-200 dark:border-amber-900/40 bg-amber-500/5 dark:bg-amber-950/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 mb-3 uppercase tracking-wider relative z-10">
            <Lightbulb className="w-5 h-5 text-amber-500 dark:text-amber-400 animate-pulse" />
            <span>Mẹo Thi TOEIC</span>
          </div>
          <p className="text-sm sm:text-base text-gray-800 dark:text-zinc-200 leading-relaxed relative z-10 font-semibold">
            {grammar.testTip}
          </p>
        </div>
      )}

      {/* 4.3 Circular Gauges for Frequency & Difficulty */}
      {(grammar.difficulty || grammar.frequency) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {grammar.difficulty && (
            <div className="flex flex-col items-center justify-center p-5 rounded-xl border border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
              <div className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-4">Độ Khó</div>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="6" className="text-zinc-100 dark:text-zinc-800" fill="transparent" />
                  <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="6" className="text-amber-500 transition-all duration-500" fill="transparent" strokeDasharray="238.7" strokeDashoffset={238.7 - (238.7 * (grammar.difficulty / 5))} />
                </svg>
                <span className="absolute text-lg font-extrabold text-gray-800 dark:text-zinc-200 font-mono">{grammar.difficulty}/5</span>
              </div>
            </div>
          )}

          {grammar.frequency && (
            <div className="flex flex-col items-center justify-center p-5 rounded-xl border border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
              <div className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-4">Tần Suất Ra Thi</div>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="6" className="text-zinc-100 dark:text-zinc-800" fill="transparent" />
                  <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="6" className="text-blue-500 transition-all duration-500" fill="transparent" strokeDasharray="238.7" strokeDashoffset={238.7 - (238.7 * (grammar.frequency / 10))} />
                </svg>
                <span className="absolute text-lg font-extrabold text-gray-800 dark:text-zinc-200 font-mono">{grammar.frequency}/10</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Grammar Examples (Interactive 3D Flip Card) */}
      {grammar.grammarExamples && grammar.grammarExamples.length > 0 && (
        <div className="rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 space-y-5">
          <div className="text-xs sm:text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
            Các ví dụ bổ sung (Flashcard tương tác)
          </div>

          <div className="space-y-4">
            {currentExample && (
              <div className="w-full min-h-[180px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)} style={{ perspective: "1000px", WebkitPerspective: "1000px" }}>
                <div 
                  className="relative w-full h-full min-h-[180px] rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-500 shadow-sm"
                  style={{
                    transformStyle: "preserve-3d",
                    WebkitTransformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front side */}
                  <div 
                    className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between items-center text-center rounded-xl bg-white dark:bg-zinc-900 transition-opacity duration-300"
                    style={{ 
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      opacity: isFlipped ? 0 : 1,
                      pointerEvents: isFlipped ? "none" : "auto",
                    }}
                  >
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                      Ví dụ {currentExampleIndex + 1} (Tiếng Anh)
                    </div>
                    <p className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white max-w-md my-auto leading-relaxed">
                      {currentExample.sentence}
                    </p>
                    <div className="text-xs text-blue-500 dark:text-blue-400 font-bold mb-1 flex items-center gap-1.5 animate-pulse">
                      <span>Chạm để lật thẻ dịch nghĩa</span>
                      <span>↺</span>
                    </div>
                  </div>

                  {/* Back side */}
                  <div 
                    className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between items-center text-center rounded-xl bg-blue-50/20 dark:bg-zinc-950/40 transition-opacity duration-300"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      opacity: isFlipped ? 1 : 0,
                      pointerEvents: isFlipped ? "auto" : "none",
                    }}
                  >
                    <div className="text-[10px] font-bold text-emerald-500 dark:text-emerald-450 uppercase tracking-widest mt-1">
                      Dịch nghĩa & Ngữ cảnh
                    </div>
                    
                    <div className="my-auto space-y-2">
                      <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {currentExample.translation || "Chưa có bản dịch"}
                      </p>
                      {currentExample.context && (
                        <p className="text-xs text-gray-500 dark:text-zinc-400 italic">
                          Ngữ cảnh: {currentExample.context}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {currentExample.audioUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card from flipping back
                            playAudio(currentExample.audioUrl);
                          }}
                          className={`p-2 rounded-full border transition-all flex items-center justify-center ${
                            isPlayingAudio
                              ? "bg-blue-500/20 border-blue-500 text-blue-500 animate-pulse"
                              : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:text-blue-500 hover:border-blue-500"
                          }`}
                        >
                          {isPlayingAudio ? (
                            <Volume2 className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <span className="text-[10px] text-zinc-400 font-bold">
                        Chạm để quay lại ↺
                      </span>
                    </div>
                  </div>
                </div>
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
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors font-bold text-xs sm:text-sm text-gray-700 dark:text-gray-300 shadow-xs"
                >
                  ← Trước
                </button>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold font-mono">
                  {currentExampleIndex + 1} / {grammar.grammarExamples.length}
                </span>
                <button
                  onClick={() =>
                    setCurrentExampleIndex((i) =>
                      i === grammar.grammarExamples!.length - 1 ? 0 : i + 1
                    )
                  }
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors font-bold text-xs sm:text-sm text-gray-700 dark:text-gray-300 shadow-xs"
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
