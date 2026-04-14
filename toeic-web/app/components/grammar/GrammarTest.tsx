"use client";

import { useState, useEffect } from "react";
import { QuestionGrammar, QuestionGrammarAnswer } from "@/app/types";
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle } from "lucide-react";

interface GrammarTestProps {
  questions: QuestionGrammar[];
  onComplete: (results: TestResult[]) => void;
  onBack: () => void;
  showTimer?: boolean;
  timeLimit?: number; // in minutes
}

export interface TestResult {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
  score: number;
}

export function GrammarTest({
  questions,
  onComplete,
  onBack,
  showTimer = false,
  timeLimit = 60,
}: GrammarTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // in seconds

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = currentQuestion?.id in selectedAnswers;
  const selectedAnswerId = selectedAnswers[currentQuestion?.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Timer Effect
  useEffect(() => {
    if (!showTimer || showResults) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showTimer, showResults]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && showTimer && !showResults) {
      handleSubmit();
    }
  }, [timeRemaining, showTimer, showResults]);

  const handleSelectAnswer = (answerId: string) => {
    if (showResults) return; // Prevent changing answer after result shown
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion && isAnswered) {
      setShowResults(true);
    } else if (isAnswered && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const results = questions.map((question) => {
      const selectedId = selectedAnswers[question.id];
      const selectedAnswer = question.answers?.find(
        (ans) => String(ans.id) === String(selectedId)
      );
      const isCorrect = selectedAnswer?.isCorrect || false;

      return {
        questionId: String(question.id),
        selectedAnswerId: String(selectedId || ""),
        isCorrect,
        score: isCorrect ? 1 : 0,
      };
    });

    onComplete(results);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const correctCount = Object.keys(selectedAnswers).length;
  const totalScore = questions.reduce((sum, question) => {
    const selectedId = selectedAnswers[question.id];
    const selectedAnswer = question.answers?.find(
      (ans) => String(ans.id) === String(selectedId)
    );
    return sum + (selectedAnswer?.isCorrect ? 1 : 0);
  }, 0);

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-400">Không có câu hỏi nào</p>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        {/* Results Summary */}
        <div className="text-center mb-12">
          <CheckCircle className="w-24 h-24 mx-auto mb-4 text-green-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hoàn thành bài kiểm tra!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Bạn đã trả lời hết các câu hỏi
          </p>

          {/* Score Card */}
          <div className="rounded-2xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-8 mb-8">
            <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {totalScore}/{questions.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              Điểm của bạn
            </p>
            <div className="text-2xl font-semibold text-green-600 dark:text-green-400">
              {Math.round((totalScore / questions.length) * 100)}%
            </div>
          </div>

          {/* Performance Message */}
          <div className="mb-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
            <p className="text-blue-600 dark:text-blue-400 font-semibold">
              {totalScore === questions.length
                ? "🎉 Xuất sắc! Bạn nắm vững tất cả các quy tắc ngữ pháp."
                : totalScore >= questions.length * 0.75
                  ? "👏 Tốt lắm! Bạn hiểu rõ hầu hết các quy tắc."
                  : totalScore >= questions.length * 0.5
                    ? "📚 Ổn. Hãy ôn tập lại những phần còn yếu."
                    : "💪 Hãy tiếp tục ôn tập và luyện tập thêm."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setSelectedAnswers({});
                setShowResults(false);
                setTimeRemaining(timeLimit * 60);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5" />
              Làm lại
            </button>

            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-950/30 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại
            </button>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Chi tiết từng câu
          </h3>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const selectedId = selectedAnswers[question.id];
              const selectedAnswer = question.answers?.find(
                (ans) => String(ans.id) === String(selectedId)
              );
              const isCorrect = selectedAnswer?.isCorrect || false;

              return (
                <div
                  key={question.id}
                  className="rounded-lg border-l-4 p-4"
                  style={{
                    borderLeftColor: isCorrect ? "#10b981" : "#ef4444",
                    backgroundColor: isCorrect
                      ? "rgba(16, 185, 129, 0.05)"
                      : "rgba(239, 68, 68, 0.05)",
                  }}
                >
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    {index + 1}. {question.content}
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: isCorrect ? "#10b981" : "#ef4444",
                    }}
                  >
                    {isCorrect ? "✅ Đúng" : "❌ Sai"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        {showTimer && (
          <div
            className={`px-4 py-2 rounded-lg font-bold text-lg ${
              timeRemaining < 60
                ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30"
                : "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30"
            }`}
          >
            ⏱ {formatTime(timeRemaining)}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Câu {currentQuestionIndex + 1}/{questions.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {correctCount} được chọn
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="rounded-2xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
          {currentQuestion.content}
        </h2>

        {/* Answers */}
        <div className="space-y-3">
          {currentQuestion.answers?.map((answer: QuestionGrammarAnswer) => {
            const isSelected = String(selectedAnswerId) === String(answer.id);
            const isCorrectAnswer = answer.isCorrect;
            let bgColor = "bg-white dark:bg-zinc-800";
            let borderColor = "border-gray-200 dark:border-zinc-700";
            let textColor = "text-gray-900 dark:text-white";

            if (isSelected && isAnswered) {
              if (isCorrectAnswer) {
                bgColor = "bg-green-50 dark:bg-green-950/30";
                borderColor = "border-green-400 dark:border-green-600";
                textColor = "text-green-600 dark:text-green-400";
              } else {
                bgColor = "bg-red-50 dark:bg-red-950/30";
                borderColor = "border-red-400 dark:border-red-600";
                textColor = "text-red-600 dark:text-red-400";
              }
            } else if (isSelected) {
              bgColor = "bg-blue-50 dark:bg-blue-950/30";
              borderColor = "border-blue-400 dark:border-blue-600";
              textColor = "text-blue-600 dark:text-blue-400";
            }

            return (
              <button
                key={answer.id}
                onClick={() => handleSelectAnswer(String(answer.id))}
                disabled={showResults || (isAnswered && !isSelected)}
                className={`w-full p-4 rounded-lg border-2 text-left font-semibold transition-all duration-200 ${bgColor} ${borderColor} ${textColor} ${
                  !showResults && !isAnswered
                    ? "hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer hover:shadow-md"
                    : "cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                      isSelected && isAnswered
                        ? isCorrectAnswer
                          ? "border-green-400 bg-green-400 text-white"
                          : "border-red-400 bg-red-400 text-white"
                        : isSelected
                          ? "border-blue-400 bg-blue-400 text-white"
                          : "border-gray-400 dark:border-gray-600"
                    }`}
                  >
                    {answer.label}
                  </div>
                  <span>{answer.content}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation (if answered and showing results) */}
        {isAnswered && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Giải thích
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {currentQuestion.shortExplanation || currentQuestion.longExplanation || "Không có giải thích"}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-200 ${
            currentQuestionIndex === 0
              ? "border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-950/30"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Trước
        </button>

        {isLastQuestion && isAnswered ? (
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-green-400 dark:border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all duration-200 hover:shadow-md"
          >
            <CheckCircle className="w-5 h-5" />
            Nộp bài
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-200 ${
              !isAnswered
                ? "border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                : "border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:shadow-md"
            }`}
          >
            Sau
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
