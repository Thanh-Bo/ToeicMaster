"use client";

import { useState } from "react";
import { QuestionGrammar } from "@/app/types";
import { CheckCircle, XCircle } from "lucide-react";

interface GrammarQuestionProps {
  question: QuestionGrammar;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedOption: string, isCorrect: boolean) => void;
  showResult?: boolean;
  userAnswer?: string;
}

export function GrammarQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showResult = false,
  userAnswer,
}: GrammarQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(userAnswer || null);

  const isCorrect = selectedOption === question.correctOption;

  const handleSelectOption = (label: string) => {
    if (showResult) return; // Don't allow changing answer after showing result
    setSelectedOption(label);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    onAnswer(selectedOption, isCorrect);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Question Number */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Câu hỏi {questionNumber}/{totalQuestions}
        </span>
        <div className="w-48 h-2 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="rounded-xl p-6 mb-6 border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-6 leading-relaxed">
          {question.content}
        </p>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.answers.map((answer) => {
            const isSelected = selectedOption === answer.label;
            const showAsCorrect = showResult && answer.label === question.correctOption;
            const showAsIncorrect = showResult && isSelected && !isCorrect;

            return (
              <button
                key={answer.label}
                onClick={() => handleSelectOption(answer.label)}
                disabled={showResult}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-center gap-3 ${
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
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
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
                <div className="flex-1">
                  <p className={`font-medium ${
                    isSelected
                      ? showAsCorrect
                        ? "text-green-700 dark:text-green-400"
                        : showAsIncorrect
                        ? "text-red-700 dark:text-red-400"
                        : "text-blue-700 dark:text-blue-400"
                      : "text-gray-900 dark:text-white"
                  }`}>
                    {answer.content}
                  </p>
                </div>

                {/* Result Icon */}
                {showResult && showAsCorrect && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
                {showResult && showAsIncorrect && (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation (shown after selection) */}
      {showResult && (
        <div className={`rounded-xl p-6 mb-6 border-2 ${
          isCorrect
            ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30"
            : "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30"
        }`}>
          <div className={`font-semibold mb-2 flex items-center gap-2 ${
            isCorrect
              ? "text-green-700 dark:text-green-400"
              : "text-red-700 dark:text-red-400"
          }`}>
            {isCorrect ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Chính xác!
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5" />
                Sai rồi
              </>
            )}
          </div>

          {/* Short Explanation */}
          {question.shortExplanation && (
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
              {question.shortExplanation}
            </p>
          )}

          {/* Long Explanation */}
          {question.longExplanation && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-semibold mb-2 text-gray-900 dark:text-gray-200">Giải thích chi tiết:</p>
              <div dangerouslySetInnerHTML={{ __html: question.longExplanation }} />
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {!showResult && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
              selectedOption
                ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white hover:shadow-md"
                : "bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            Trả lời
          </button>
        </div>
      )}
    </div>
  );
}
