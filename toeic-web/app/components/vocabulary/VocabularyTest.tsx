"use client";

import { useEffect, useState } from "react";
import { vocabularyService } from "@/app/services/vocabularyService";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Sparkles,
  Trophy,
  Languages,
} from "lucide-react";
import { QuestionVocab } from "@/app/types";
import { playSound } from "@/app/lib/audio";

interface VocabularyTestProps {
  topicId: number;
  topicTitle: string;
  onComplete?: () => void;
}

interface TestStats {
  totalQuestions: number;
  answered: number;
  score: number;
  correctCount: number;
  wrongCount: number;
}

interface QuestionAnswer {
  label: string;
  content: string;
}

export default function VocabularyTest({
  topicId,
  topicTitle,
  onComplete,
}: VocabularyTestProps) {
  const [questions, setQuestions] = useState<QuestionVocab[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCompletion, setShowCompletion] = useState(false);
  const [stats, setStats] = useState<TestStats>({
    totalQuestions: 0,
    answered: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
  });
  const [generatingExplanation, setGeneratingExplanation] = useState(false);
  const [explanation, setExplanation] = useState<{
    short: string;
    long: string;
  } | null>(null);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await vocabularyService.getQuestionVocab(topicId);
        setQuestions(response.questions || []);
        setStats((prev) => ({
          ...prev,
          totalQuestions: response.questions?.length || 0,
        }));
      } catch (err) {
        setError("Failed to load questions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topicId]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Đang tải câu hỏi...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (questions.length === 0) {
    return <div className="text-center py-8">Không có câu hỏi nào</div>;
  }

  const currentQuestion = questions[currentIndex];

  // Get answers from question
  const getAnswers = (question: QuestionVocab): QuestionAnswer[] => {
    if ((question as any).answers) {
      return (question as any).answers;
    }
    if ((question as any).options) {
      return (question as any).options;
    }
    return [];
  };

  const handleSelectOption = (label: string) => {
    if (hasSubmitted) return;
    setSelectedAnswer(label);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === currentQuestion.correctOption;
    setIsCorrect(correct);
    setHasSubmitted(true);

    setStats((prev) => ({
      ...prev,
      answered: prev.answered + 1,
      correctCount: correct ? prev.correctCount + 1 : prev.correctCount,
      wrongCount: correct ? prev.wrongCount : prev.wrongCount + 1,
    }));

    if (correct) {
      playSound("correct");
    } else {
      playSound("wrong");
    }

    // Use explanation from database instead of generating
    setExplanation({
      short: currentQuestion.shortExplanation || "Không có giải thích",
      long: currentQuestion.longExplanation || "",
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasSubmitted(false);
      setIsCorrect(null);
      setExplanation(null);
    } else {
      const finalScore = Math.round(
        (stats.correctCount / questions.length) * 100,
      );
      setStats((prev) => ({ ...prev, score: finalScore }));
      setShowCompletion(true);
      submitTestResults(finalScore);
    }
  };

  const submitTestResults = async (finalScore: number) => {
    try {
      await vocabularyService.submitTestResults(topicId, {
        score: finalScore,
        correctCount: stats.correctCount,
        totalQuestions: questions.length,
      });
    } catch (err) {
      console.error("Error submitting test:", err);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setIsCorrect(null);
    setExplanation(null);
    setShowCompletion(false);
    setStats({
      totalQuestions: questions.length,
      answered: 0,
      score: 0,
      correctCount: 0,
      wrongCount: 0,
    });
  };


  const answers = getAnswers(currentQuestion);

  return (
    <div className="max-w-3xl mx-auto">
      {hasSubmitted && (
        <>
          {/* Stats Result */}
          <div className="mt-4 grid grid-cols-5 gap-2">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-700 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Tổng số câu
              </p>
              <p className="text-xl font-bold text-blue-600">
                {stats.totalQuestions}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-700 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Đã hoàn thành
              </p>
              <p className="text-xl font-bold text-green-600">
                {stats.answered}/{stats.totalQuestions}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-700 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Tổng điểm
              </p>
              <p className="text-xl font-bold text-purple-600">
                {Math.round((stats.correctCount / (stats.answered || 1)) * 100)}
                %
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-700 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Số câu đúng
              </p>
              <p className="text-xl font-bold text-green-600">
                {stats.correctCount}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-700 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Số câu sai
              </p>
              <p className="text-xl font-bold text-red-600">
                {stats.wrongCount}
              </p>
            </div>
          </div>
        </>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-gray-200 dark:border-zinc-800 p-3 md:p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
            <span className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300">
              {currentIndex + 1}
            </span>
          </div>
          <h3 className="text-sm md:text-base text-gray-900 dark:text-white leading-relaxed flex-1 pt-2">
            {currentQuestion.content}
          </h3>
        </div>

        <div className="space-y-1.5 mb-4">
          {answers.map((answer: QuestionAnswer) => {
            const isSelected = selectedAnswer === answer.label;
            const isCorrectAnswer =
              answer.label === currentQuestion.correctOption;

            let buttonClass =
              "border-2 border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-zinc-900";

            if (hasSubmitted) {
              if (isCorrectAnswer) {
                buttonClass =
                  "border-2 border-green-500 bg-green-50 dark:bg-green-900/20";
              } else if (isSelected && !isCorrect) {
                buttonClass =
                  "border-2 border-red-500 bg-red-50 dark:bg-red-900/20";
              }
            } else if (isSelected) {
              buttonClass =
                "border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20";
            }

            return (
              <button
                key={answer.label}
                onClick={() => handleSelectOption(answer.label)}
                disabled={hasSubmitted}
                className={`w-full p-2 rounded-md text-left transition-all ${buttonClass} ${
                  hasSubmitted
                    ? "cursor-default"
                    : "cursor-pointer hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-gray-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-gray-700 dark:text-gray-300">
                    {answer.label}
                  </span>
                  <span className="flex-1 text-xs text-gray-800 dark:text-gray-200">
                    {answer.content}
                  </span>
                  {hasSubmitted && isCorrectAnswer && (
                    <CheckCircle
                      className="text-green-600 dark:text-green-400"
                      size={16}
                    />
                  )}
                  {hasSubmitted && isSelected && !isCorrect && (
                    <XCircle
                      className="text-red-600 dark:text-red-400"
                      size={16}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {!hasSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md font-bold text-sm shadow-sm hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Kiểm tra
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md font-bold text-sm shadow-sm hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-1"
          >
            Câu tiếp <ChevronRight size={16} />
          </button>
        )}

        {hasSubmitted && (
          <>
            {/* Explanation */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Languages size={14} /> Dịch câu hỏi
              </div>

              {generatingExplanation ? (
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-xs">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Đang tạo...
                </div>
              ) : explanation ? (
                <div className="space-y-1">
                  <div
                    className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert [&_span.highlight-correct]:text-green-600 dark:[&_span.highlight-correct]:text-green-400"
                    dangerouslySetInnerHTML={{ __html: explanation.short }}
                  />
                </div>
              ) : (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Không có giải thích
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Question Navigation */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          onClick={() => {
            if (currentIndex > 0) {
              setCurrentIndex((prev) => prev - 1);
              setSelectedAnswer(null);
              setHasSubmitted(false);
              setIsCorrect(null);
              setExplanation(null);
            }
          }}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-lg font-medium text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Câu trước
        </button>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {questions.map((_, index) => {
            const isCurrent = index === currentIndex;
            const isAnswered =
              index < currentIndex || (index === currentIndex && hasSubmitted);

            return (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setSelectedAnswer(null);
                  setHasSubmitted(false);
                  setIsCorrect(null);
                  setExplanation(null);
                }}
                className={`w-8 h-8 rounded-lg font-medium text-sm transition-all ${
                  isCurrent
                    ? "bg-blue-600 text-white shadow-md"
                    : isAnswered
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={!hasSubmitted}
          className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-lg font-medium text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Câu tiếp
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-md p-2 border border-gray-200 dark:border-zinc-700">
      <p className="text-[9px] text-gray-500 dark:text-gray-400 mb-0.5 truncate">
        {label}
      </p>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
    </div>
  );
}
