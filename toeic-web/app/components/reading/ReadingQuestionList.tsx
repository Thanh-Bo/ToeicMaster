"use client";

import { CheckCircle, XCircle } from "lucide-react";
import type { ReadingPassage } from "../../types";

interface Props {
  passage: ReadingPassage;
  selectedAnswers: Record<number, string>;
  onSelect: (questionId: number, option: string) => void;
  disabled?: boolean;
  showResult?: boolean;
}

export default function ReadingQuestionList({
  passage,
  selectedAnswers,
  onSelect,
  disabled = false,
  showResult = false,
}: Props) {
  return (
    <section className="space-y-4">
      {passage.questions.map((question) => {
        const selected = selectedAnswers[question.id] || question.selectedOption || "";
        const isCorrect = selected && selected === question.correctOption;

        return (
          <div
            key={question.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Question {question.questionNo}
                </p>
                <h3 className="mt-1 text-base font-bold text-gray-950 dark:text-white">
                  {question.content}
                </h3>
              </div>
              {showResult && selected && (
                <div
                  className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
                    isCorrect
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                  }`}
                >
                  {isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              {question.answers.map((answer) => {
                const active = selected === answer.label;
                const correct = showResult && answer.label === question.correctOption;
                const wrong = showResult && active && answer.label !== question.correctOption;

                return (
                  <button
                    key={answer.id || answer.label}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelect(question.id, answer.label)}
                    className={`group flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-200 cursor-pointer ${
                      correct
                        ? "border-emerald-400 bg-emerald-50 text-emerald-950 dark:border-emerald-500/40 dark:bg-emerald-950/20 dark:text-emerald-100"
                        : wrong
                          ? "border-red-400 bg-red-50 text-red-955 dark:border-red-500/40 dark:bg-red-950/20 dark:text-red-100"
                          : active
                            ? "border-blue-600 bg-blue-50/50 text-blue-950 shadow-xs dark:border-blue-500 dark:bg-blue-950/20 dark:text-blue-100"
                            : "border-gray-200 bg-gray-50/30 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black shadow-xs transition-all duration-250 ${
                      correct
                        ? "bg-emerald-600 text-white dark:bg-emerald-500"
                        : wrong
                          ? "bg-red-600 text-white dark:bg-red-500"
                          : active
                            ? "bg-blue-600 text-white dark:bg-blue-500"
                            : "bg-white text-gray-800 dark:bg-zinc-800 dark:text-zinc-100 group-hover:bg-gray-100 dark:group-hover:bg-zinc-700"
                    }`}>
                      {answer.label}
                    </span>
                    <span className="leading-relaxed font-medium mt-0.5">{answer.content}</span>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-sm text-gray-700 dark:border-zinc-900/50 dark:bg-zinc-900/20 dark:text-zinc-300">
                <div className="flex items-center gap-2 font-bold text-gray-950 dark:text-white mb-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Đáp án đúng: {question.correctOption || "N/A"}
                  </span>
                </div>
                {question.explanationLocked && (
                  <p className="mt-2 font-semibold text-amber-600 dark:text-amber-400">
                    Chi tiết lời giải chỉ hiển thị với tài khoản Premium.
                  </p>
                )}
                {question.shortExplanation && (
                  <div className="mt-3 border-t border-gray-100 pt-2.5 dark:border-zinc-800/40 leading-relaxed">
                    <span className="block font-extrabold text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Giải thích ngắn:</span>
                    <div
                      className="text-gray-600 dark:text-zinc-400"
                      dangerouslySetInnerHTML={{ __html: question.shortExplanation }}
                    />
                  </div>
                )}
                {question.fullExplanation && (
                  <div className="mt-3 border-t border-gray-100 pt-2.5 dark:border-zinc-800/40 leading-relaxed">
                    <span className="block font-extrabold text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Giải thích chi tiết:</span>
                    <div
                      className="text-gray-600 dark:text-zinc-400"
                      dangerouslySetInnerHTML={{ __html: question.fullExplanation }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
