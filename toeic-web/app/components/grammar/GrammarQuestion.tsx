"use client";

import { useState, useEffect } from "react";
import { QuestionGrammar } from "@/app/types";
import { CheckCircle, Crown, Languages, Lightbulb, XCircle, ChevronRight } from "lucide-react";

interface GrammarQuestionProps {
  question: QuestionGrammar;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedOption: string) => void;
  onSubmit: () => void;
  showResult?: boolean;
  userAnswer?: string;
  canSubmit?: boolean;
}

export function GrammarQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onSubmit,
  showResult = false,
  userAnswer,
  canSubmit = true,
}: GrammarQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    userAnswer || null,
  );

  // Reset selected option when question changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setSelectedOption(userAnswer || null);
  }, [question.id, userAnswer]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const isCorrect = selectedOption === question.correctOption;

  const handleSelectOption = (label: string) => {
    if (showResult) return; // Don't allow changing answer after showing result
    setSelectedOption(label);
    // Notify parent of selection change
    onAnswer(label);
  };

  const handleSubmit = () => {
    if (!selectedOption || !canSubmit) return;
    onSubmit();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-2">
      {/* Question Number Capsule Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 text-[10px] sm:text-xs font-mono font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/5 border border-blue-200/50 dark:border-blue-900/40 rounded-full tracking-wider uppercase">
          Câu {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Question Content */}
      <div className="mb-6 sm:mb-8">
        <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white leading-relaxed">
          {question.content}
        </p>
      </div>

      {/* Answer Options - Tactile Cards */}
      <div className="space-y-3">
        {question.answers.map((answer) => {
          const isSelected = selectedOption === answer.label;
          const isCorrectOption = answer.label === question.correctOption;
          const showAsCorrect = showResult && isCorrectOption;
          const showAsIncorrect = showResult && isSelected && !isCorrect;

          // Color and style matching
          let cardClasses = "";
          let badgeClasses = "";
          let textClasses = "";
          if (showResult) {
            if (showAsCorrect) {
              cardClasses = "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)] cursor-default";
              badgeClasses = "bg-emerald-500 text-white border-emerald-500";
              textClasses = "text-emerald-700 dark:text-emerald-400 font-semibold";
            } else if (showAsIncorrect) {
              cardClasses = "border-rose-500 bg-rose-500/10 dark:bg-rose-500/5 text-rose-700 dark:text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.05)] cursor-default";
              badgeClasses = "bg-rose-500 text-white border-rose-500";
              textClasses = "text-rose-700 dark:text-rose-400 font-semibold";
            } else {
              cardClasses = "border-zinc-200/40 dark:border-zinc-800/20 bg-zinc-50/30 dark:bg-zinc-950/10 text-zinc-400 dark:text-zinc-500 opacity-45 cursor-default";
              badgeClasses = "bg-zinc-100/50 dark:bg-zinc-900/50 border-zinc-200/30 dark:border-zinc-800/20 text-zinc-400 dark:text-zinc-500";
              textClasses = "text-zinc-400 dark:text-zinc-500";
            }
          } else {
            // Interactive States
            cardClasses = isSelected
              ? "border-blue-500 bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.05)] cursor-pointer hover:-translate-y-0.5 active:scale-[0.99]"
              : "border-zinc-200/70 dark:border-zinc-800/40 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 cursor-pointer hover:-translate-y-0.5 active:scale-[0.99]";
            badgeClasses = isSelected
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200/60 dark:border-zinc-700/40 text-zinc-500 dark:text-zinc-400";
            textClasses = isSelected
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : "text-gray-900 dark:text-zinc-200";
          }

          return (
            <button
              key={answer.label}
              onClick={() => handleSelectOption(answer.label)}
              disabled={showResult}
              className={`w-full p-3.5 sm:p-4 rounded-xl border text-left flex items-center gap-3 transition-all duration-200 transform ${cardClasses}`}
            >
              {/* Option Label Badge */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs sm:text-sm border transition-all duration-200 shrink-0 ${badgeClasses}`}
              >
                {answer.label}
              </div>

              {/* Option Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm sm:text-base break-words leading-relaxed ${textClasses}`}>
                  {answer.content}
                </p>
              </div>

              {/* Result Icon */}
              {showResult && showAsCorrect && (
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              )}
              {showResult && showAsIncorrect && (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box (shown after selection) */}
      {showResult && (
        <div
          className={`rounded-2xl p-4 sm:p-6 mb-6 mt-6 border border-l-4 transition-all duration-300 ${
            isCorrect
              ? "border-l-emerald-500 border-zinc-200/50 dark:border-zinc-800/40 bg-emerald-500/[0.03] dark:bg-emerald-950/[0.05]"
              : "border-l-rose-500 border-zinc-200/50 dark:border-zinc-800/40 bg-rose-500/[0.03] dark:bg-rose-950/[0.05]"
          }`}
        >
          {/* Correction Title */}
          <div
            className={`font-black mb-4 flex items-center gap-2 text-sm sm:text-base ${
              isCorrect
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Chính xác! Bạn đã chọn đúng.</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5" />
                <span>Chưa chính xác rồi.</span>
              </>
            )}
          </div>

          {question.explanationLocked ? (
            /* Premium Explanation Lock Box */
            <div className="mt-2 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-500/[0.06] dark:bg-amber-950/10 p-5 shadow-[0_4px_20px_rgba(245,158,11,0.03)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shrink-0">
                  <Crown className="h-5 w-5 animate-bounce" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-amber-800 dark:text-amber-400">
                    Cần Premium để xem giải thích chi tiết
                  </h4>
                  <p className="mt-1 text-xs text-amber-700 dark:text-zinc-400 leading-relaxed">
                    Bạn vẫn có thể luyện tập câu hỏi này bình thường. Hãy nâng cấp tài khoản Premium để mở khóa lời giải thích chi tiết, mẹo làm bài, và bản dịch trọn vẹn.
                  </p>
                  <a
                    href="/subscription"
                    className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition duration-200 shadow-[0_2px_8px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 active:translate-y-0 transform"
                  >
                    <span>Nâng cấp ngay</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Short Explanation (Translation) */}
              {question.shortExplanation && (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/40">
                  <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5" /> Dịch câu hỏi
                  </h4>
                  <div
                    className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: question.shortExplanation }}
                  />
                </div>
              )}

              {/* Long Explanation (Detailing Rules) */}
              {question.longExplanation && (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/40">
                  <h4 className="text-xs font-black text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> Giải thích chi tiết
                  </h4>
                  <div
                    className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: question.longExplanation }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {!showResult && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            disabled={!selectedOption || !canSubmit}
            className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 transform ${
              selectedOption && canSubmit
                ? "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
            }`}
          >
            Nộp bài
          </button>
        </div>
      )}
    </div>
  );
}
