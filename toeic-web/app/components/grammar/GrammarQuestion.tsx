"use client";

import { useState, useEffect } from "react";
import { QuestionGrammar } from "@/app/types";
import { CheckCircle, Languages, Lightbulb, XCircle } from "lucide-react";

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
  useEffect(() => {
    setSelectedOption(userAnswer || null);
  }, [question.id, userAnswer]);

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
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      {/* Question Number Badge + Content in same row */}
      <div className="flex items-center  gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300">
            {questionNumber}
          </span>
        </div>
        <p className="text-xs sm:text-lg  text-gray-900 dark:text-white leading-relaxed flex-1">
          {question.content}
        </p>
      </div>

      {/* Answer Options - Responsive */}
      <div className="space-y-2 sm:space-y-3">
          {question.answers.map((answer) => {
            const isSelected = selectedOption === answer.label;
            const showAsCorrect =
              showResult && answer.label === question.correctOption;
            const showAsIncorrect = showResult && isSelected && !isCorrect;

            return (
              <button
                key={answer.label}
                onClick={() => handleSelectOption(answer.label)}
                disabled={showResult}
                className={`w-full p-3 sm:p-4 rounded-lg border-1 transition-all duration-200 text-left flex items-center gap-2 sm:gap-3 ${
                  isSelected
                    ? showAsCorrect
                      ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-950/30"
                      : showAsIncorrect
                      ? "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-950/30"
                      : "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                    : "border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800"
                } ${showResult ? "cursor-default" : "cursor-pointer"}`}
              >
                {/* Option Label */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm ${
                    isSelected
                      ? showAsCorrect
                        ? "bg-green-500 text-white"
                        : showAsIncorrect
                        ? "bg-red-500 text-white"
                        : "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {answer.label}
                </div>

                {/* Option Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm sm:text-base break-words ${
                      isSelected
                        ? showAsCorrect
                          ? "text-green-700 dark:text-green-400"
                          : showAsIncorrect
                          ? "text-red-700 dark:text-red-400"
                          : "text-blue-700 dark:text-blue-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {answer.content}
                  </p>
                </div>

                {/* Result Icon */}
                {showResult && showAsCorrect && (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                )}
                {showResult && showAsIncorrect && (
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />
                )}
              </button>
            );
          })}
      </div>

      {/* Explanation (shown after selection) - Responsive */}
      {showResult && (
        <div
          className={`rounded-xl p-4 sm:p-6 mb-4 mt-4 sm:mb-6 border-1 ${
            isCorrect
              ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30"
              : "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30"
          }`}
        >
          <div
            className={`font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base ${
              isCorrect
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Chính xác!
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Sai rồi
              </>
            )}
          </div>

          {/* Short Explanation */}
          {question.shortExplanation && (
            <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-3">
              <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Languages size={12} className="sm:w-3.5 sm:h-3.5" /> Dịch câu hỏi
              </h4>
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: question.shortExplanation }}
              />
            </p>
          )}

          {/* Long Explanation */}
          {question.longExplanation && (
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Lightbulb size={12} className="sm:w-3.5 sm:h-3.5" /> Giải thích
              </h4>
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: question.longExplanation }}
              />
            </div>
          )}
        </div>
      )}

      {/* Action Buttons - Responsive */}
      {!showResult && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            disabled={!selectedOption || !canSubmit}
            className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
              selectedOption && canSubmit
                ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white hover:shadow-md"
                : "bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
