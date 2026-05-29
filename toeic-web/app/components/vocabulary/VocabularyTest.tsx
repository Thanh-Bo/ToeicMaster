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
  Crown,
  Lock,
} from "lucide-react";
import { QuestionVocab } from "@/app/types";
import { playSound } from "@/app/lib/audio";

interface VocabularyTestProps {
  topicId: number;
  topicTitle: string;
  onComplete?: () => void;
  skipLevelUp?: boolean; // Nếu true, chỉ gọi onComplete mà không submit test results
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
  skipLevelUp = false,
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
    if (currentQuestion.explanationLocked) {
      setExplanation(null);
    } else {
      setExplanation({
        short: (currentQuestion.shortExplanation && currentQuestion.shortExplanation !== "null")
          ? currentQuestion.shortExplanation
          : "Không có giải thích",
        long: (currentQuestion.longExplanation && currentQuestion.longExplanation !== "null")
          ? currentQuestion.longExplanation
          : "",
      });
    }
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
    // Nếu skipLevelUp = true, chỉ gọi onComplete mà không gọi API
    if (skipLevelUp) {
      onComplete?.();
      return;
    }
    try {
      // Gọi levelUp và update stats
      await vocabularyService.levelUp(topicId);
      // Cập nhật số câu hỏi đã làm
      await vocabularyService.updateVocabStats(topicId, {
        totalQuestions: questions.length,
        correctAnswers: stats.correctCount
      });
      onComplete?.();
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
    <div className="max-w-3xl mx-auto px-2 sm:px-0">
      {hasSubmitted && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-xl p-3 border border-gray-200/50 dark:border-zinc-800/80 text-center flex flex-col justify-center">
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
              Tổng số câu
            </p>
            <p className="text-lg sm:text-2xl font-black text-blue-600 dark:text-blue-400">
              {stats.totalQuestions}
            </p>
          </div>
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-xl p-3 border border-gray-200/50 dark:border-zinc-800/80 text-center flex flex-col justify-center">
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
              Đã hoàn thành
            </p>
            <p className="text-lg sm:text-2xl font-black text-green-600 dark:text-green-400">
              {stats.answered}/{stats.totalQuestions}
            </p>
          </div>
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-xl p-3 border border-gray-200/50 dark:border-zinc-800/80 text-center flex flex-col justify-center col-span-2 sm:col-span-1">
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
              Tổng điểm
            </p>
            <p className="text-lg sm:text-2xl font-black text-purple-600 dark:text-purple-400">
              {Math.round((stats.correctCount / (stats.answered || 1)) * 100)}%
            </p>
          </div>
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-xl p-3 border border-gray-200/50 dark:border-zinc-800/80 text-center flex flex-col justify-center">
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
              Số câu đúng
            </p>
            <p className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.correctCount}
            </p>
          </div>
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-xl p-3 border border-gray-200/50 dark:border-zinc-800/80 text-center flex flex-col justify-center">
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
              Số câu sai
            </p>
            <p className="text-lg sm:text-2xl font-black text-rose-600 dark:text-rose-400">
              {stats.wrongCount}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md text-gray-900 dark:text-white border border-gray-200/50 dark:border-zinc-800/80 rounded-2xl shadow-xs p-4 sm:p-6 transition-all">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200/30 dark:border-blue-800/20 flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0">
            {currentIndex + 1}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-relaxed flex-1 pt-1.5">
            {currentQuestion.content}
          </h3>
        </div>

        <div className="space-y-2 mb-5">
          {answers.map((answer: QuestionAnswer) => {
            const isSelected = selectedAnswer === answer.label;
            const isCorrectAnswer =
              answer.label === currentQuestion.correctOption;

            let buttonClass =
              "border-gray-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500/80 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200";

            if (hasSubmitted) {
              if (isCorrectAnswer) {
                buttonClass =
                  "border-green-500 dark:border-green-500 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400";
              } else if (isSelected && !isCorrect) {
                buttonClass =
                  "border-red-500 dark:border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400";
              } else {
                buttonClass =
                  "border-gray-200 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30 text-gray-400 dark:text-gray-500 opacity-60 cursor-default";
              }
            } else if (isSelected) {
              buttonClass =
                "border-blue-500 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 ring-2 ring-blue-100 dark:ring-blue-950/30";
            }

            return (
              <button
                key={answer.label}
                onClick={() => handleSelectOption(answer.label)}
                disabled={hasSubmitted}
                className={`group w-full p-3.5 rounded-xl text-left border transition-all duration-200 font-semibold flex items-center justify-between gap-3 ${buttonClass} ${
                  hasSubmitted
                    ? "cursor-default"
                    : "cursor-pointer hover:shadow-xs hover:scale-[1.01] active:scale-[0.99]"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isSelected 
                      ? "bg-blue-600 text-white"
                      : hasSubmitted && isCorrectAnswer
                      ? "bg-green-600 text-white"
                      : hasSubmitted && isSelected && !isCorrect
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/50"
                  }`}>
                    {answer.label}
                  </span>
                  <span className="flex-1 text-xs sm:text-sm font-semibold break-words">
                    {answer.content}
                  </span>
                </div>
                {hasSubmitted && isCorrectAnswer && (
                  <CheckCircle
                    className="text-green-650 dark:text-green-400 shrink-0"
                    size={18}
                  />
                )}
                {hasSubmitted && isSelected && !isCorrect && (
                  <XCircle
                    className="text-red-650 dark:text-red-400 shrink-0"
                    size={18}
                  />
                )}
              </button>
            );
          })}
        </div>

        {!hasSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full py-3 bg-blue-600 hover:bg-blue-750 text-white rounded-xl font-bold text-sm shadow-xs transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] hover:shadow-md hover:shadow-blue-500/10"
          >
            Kiểm tra
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-3 bg-green-600 hover:bg-green-755 text-white rounded-xl font-bold text-sm shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98] hover:shadow-md hover:shadow-green-500/10"
          >
            Câu tiếp <ChevronRight size={18} />
          </button>
        )}

        {hasSubmitted && (
          <>
            {currentQuestion.explanationLocked ? (
              <div className="mt-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/10 p-4 sm:p-5 backdrop-blur-md">
                <div className="flex items-center gap-2.5 text-sm sm:text-base font-bold text-amber-800 dark:text-amber-300">
                  <div className="w-8 h-8 rounded-lg bg-amber-105 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Crown className="h-4.5 w-4.5 animate-pulse" />
                  </div>
                  Cần nâng cấp Premium để xem giải thích
                </div>
                <p className="mt-2 text-xs sm:text-sm text-amber-700/90 dark:text-amber-400/80 leading-relaxed pl-10">
                  Bạn vẫn có thể làm bài kiểm tra và xem đáp án. Hãy nâng cấp Premium để mở khóa lời giải thích chi tiết, dịch câu và hướng dẫn ngữ nghĩa.
                </p>
                <div className="pl-10 mt-4">
                  <a
                    href="/subscription"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all duration-200 shadow-xs hover:shadow-md hover:scale-102"
                  >
                    <Crown size={14} /> Nâng cấp ngay
                  </a>
                </div>
              </div>
            ) : (
              <div className="mt-5 p-4 bg-blue-50/40 dark:bg-blue-950/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 backdrop-blur-md">
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Languages size={14} className="text-blue-500" /> Dịch &amp; Giải thích câu hỏi
                </div>

                {generatingExplanation ? (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Đang tạo...
                  </div>
                ) : explanation ? (
                  <div className="space-y-2 pl-4 border-l-2 border-blue-500/50">
                    <div
                      className="text-xs sm:text-sm text-gray-800 dark:text-gray-300 leading-relaxed font-medium prose prose-sm max-w-none dark:prose-invert [&_span.highlight-correct]:text-green-600 dark:[&_span.highlight-correct]:text-green-400"
                      dangerouslySetInnerHTML={{ __html: explanation.short }}
                    />
                    {/* {explanation.long && (
                      <div
                        className="text-xs sm:text-sm text-gray-650 dark:text-gray-400 leading-relaxed border-t border-blue-100/50 dark:border-blue-900/20 pt-2 mt-2"
                        dangerouslySetInnerHTML={{ __html: explanation.long }}
                      />
                    )} */}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic pl-4">
                    Không có giải thích
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Question Navigation */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200/50 dark:border-zinc-800/80 text-gray-600 dark:text-gray-400 rounded-xl font-bold text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-zinc-850 hover:text-gray-800 dark:hover:text-gray-250 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
        >
          <ChevronLeft size={16} />
          Câu trước
        </button>

        <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-full">
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
                className={`w-8 h-8 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-blue-600 text-white shadow-xs border border-blue-500 scale-[1.05]"
                    : isAnswered
                    ? "bg-green-50 text-green-600 border border-green-200/60 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/40"
                    : "bg-gray-50/80 text-gray-500 border border-gray-200/50 hover:bg-gray-100 dark:bg-zinc-900/50 dark:text-zinc-400 dark:border-zinc-800/80 dark:hover:bg-zinc-805 hover:text-gray-800 dark:hover:text-gray-200"
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
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200/50 dark:border-zinc-800/80 text-gray-600 dark:text-gray-400 rounded-xl font-bold text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-zinc-850 hover:text-gray-800 dark:hover:text-gray-250 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
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
