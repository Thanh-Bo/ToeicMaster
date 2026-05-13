"use client";

import { useState, useEffect, useRef } from "react";
import { QuestionGrammar } from "@/app/types";
import { GrammarQuestion } from "./GrammarQuestion";
import { ChevronLeft, ChevronRight, Trophy, Target, Zap, CheckCircle, Shuffle } from "lucide-react";
import { grammarService } from "@/app/services/grammarService";
import { useAuth } from "@/app/contexts/AuthContext";

interface GrammarPracticeTabProps {
  questionsByMode: {
    easy: QuestionGrammar[];
    medium: QuestionGrammar[];
    hard: QuestionGrammar[];
  };
  selectedMode: 'easy' | 'medium' | 'hard';
  onModeChange: (mode: 'easy' | 'medium' | 'hard') => void;
  isLoading: boolean;
  grammarId?: number;
  topicId?: number;
  groupId?: number;
}

export function GrammarPracticeTab({ 
  questionsByMode, 
  selectedMode,
  onModeChange,
  isLoading,
  grammarId,
  topicId,
  groupId,
}: GrammarPracticeTabProps) {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Set<number>>(new Set());
  const [sessionStartTime] = useState(() => Date.now());
  const [sessionRecorded, setSessionRecorded] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const questions = questionsByMode[selectedMode] || [];

  // Calculate score - MUST be before useEffect that uses them
  const totalCorrect = Object.entries(userAnswers).filter(([index, answer]) => {
    const question = questions[parseInt(index)];
    // Safety check: question might be undefined if questions array changed
    return question && answer === question.correctOption;
  }).length;
  
  const totalAttempted = submittedAnswers.size;

  // Record session when all questions are completed
  useEffect(() => {
    const recordSession = async () => {
      if (
        questions.length > 0 &&
        totalAttempted === questions.length &&
        !sessionRecorded &&
        user?.id
      ) {
        try {
          const durationSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
         
          
          // Only include IDs that are defined
          const sessionData: any = {
            sessionType: "practice",
            durationSeconds: durationSeconds,
            questionsAnswered: totalAttempted,
            correctAnswers: totalCorrect,
          };
          
          if (grammarId !== undefined && grammarId !== null) {
            sessionData.grammarId = grammarId;
          }
          if (topicId !== undefined && topicId !== null) {
            sessionData.topicId = topicId;
          }
          if (groupId !== undefined && groupId !== null) {
            sessionData.groupId = groupId;
          }
          
          await grammarService.recordStudySession(user.id, sessionData);
          setSessionRecorded(true);
        } catch (error) {
          console.error("Failed to record grammar practice session:", error);
        }
      }
    };

    recordSession();
  }, [questions.length, totalAttempted, sessionRecorded, user?.id, grammarId, topicId, groupId, sessionStartTime, totalCorrect]);

  // Reset state when mode changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSubmittedAnswers(new Set());
    setSessionRecorded(false);
    setQuestionStartTime(Date.now());
  }, [selectedMode]);

  const handleAnswer = (questionIndex: number, selectedOption: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const handleSubmitAnswer = async (questionIndex: number) => {
    const question = questions[questionIndex];
    if (!question) return;

    const selectedAnswer = userAnswers[questionIndex];
    const isCorrect = selectedAnswer === question.correctOption;
    
    // Calculate actual duration spent on this question
    const durationSeconds = Math.round((Date.now() - questionStartTime) / 1000);
    
    // Mark as submitted locally
    setSubmittedAnswers(prev => new Set(prev).add(questionIndex));
    
    // Update progress on every answer submit (real-time tracking)
    if (user?.id && grammarId) {
      try {
        await grammarService.updateProgress(user.id, grammarId, {
          isCorrect: isCorrect,
          level: question.mode === 'easy' ? 1 : question.mode === 'medium' ? 2 : 3,
          nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // +1 day
          durationSeconds: durationSeconds
        });
      } catch (error) {
        console.error("Failed to update grammar progress:", error);
      }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const modeConfig = {
    easy: { 
      label: 'Dễ', 
      color: 'green',
      icon: Target,
      description: '20 câu cơ bản' 
    },
    medium: { 
      label: 'Trung bình', 
      color: 'blue',
      icon: Trophy,
      description: '20 câu nâng cao' 
    },
    hard: { 
      label: 'Khó', 
      color: 'red',
      icon: Zap,
      description: '20 câu thử thách' 
    },
  };

  const currentMode = modeConfig[selectedMode];

  const canGoPrevious = currentQuestionIndex > 0;
  const canGoNext = currentQuestionIndex < questions.length - 1;
  const hasAnswered = userAnswers[currentQuestionIndex] !== undefined;
  const isSubmitted = submittedAnswers.has(currentQuestionIndex);

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-8">
      {/* Mode Selection Tabs - Responsive */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {(['easy', 'medium', 'hard'] as const).map((mode) => {
          const config = modeConfig[mode];
          const Icon = config.icon;
          const count = questionsByMode[mode]?.length || 0;
          const isSelected = mode === selectedMode;
          
          const colorClasses = {
            easy: isSelected 
              ? 'bg-green-100 dark:bg-green-950/50 border-green-400 dark:border-green-600 text-green-600 dark:text-green-400'
              : 'border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-green-300 dark:hover:border-green-700',
            medium: isSelected 
              ? 'bg-blue-100 dark:bg-blue-950/50 border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700',
            hard: isSelected 
              ? 'bg-red-100 dark:bg-red-950/50 border-red-400 dark:border-red-600 text-red-600 dark:text-red-400'
              : 'border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-red-300 dark:hover:border-red-700',
          };

          return (
            <button
              key={mode}
              onClick={() => {
                onModeChange(mode);
                // State reset is handled by useEffect when selectedMode changes
              }}
              disabled={isLoading}
              className={`flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 lg:p-4 rounded-xl border-1 font-semibold transition-all duration-200 ${colorClasses[mode]} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <div className="text-center">
                <div className="text-xs sm:text-sm">{config.label}</div>
                <div className="text-xs opacity-80 hidden sm:block">{count} câu</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mode Description - Responsive */}
      <div className="rounded-lg border-1 border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <currentMode.icon className={`w-4 h-4 text-${currentMode.color}-600 dark:text-${currentMode.color}-400`} />
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">{currentMode.label}:</span> {currentMode.description}
          </p>
        </div>
      </div>

      {/* No Questions Message - Responsive */}
      {questions.length === 0 && !isLoading && (
        <div className="rounded-xl p-6 sm:p-8 border-1 border-dashed border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/20 text-center">
          <p className="text-yellow-700 dark:text-yellow-400 font-semibold mb-2 text-sm sm:text-base">
            Chưa có câu hỏi luyện tập
          </p>
          <p className="text-yellow-600 dark:text-yellow-300 text-xs sm:text-sm">
            Hãy quay lại sau khi thêm câu hỏi cho quy tắc này
          </p>
        </div>
      )}

      {/* Loading State - Responsive */}
      {questions.length === 0 && isLoading && (
        <div className="rounded-xl p-6 sm:p-8 border-1 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 text-center">
          <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-blue-700 dark:text-blue-400 font-semibold text-sm sm:text-base">
            Đang tải câu hỏi...
          </p>
        </div>
      )}

      {/* Page Stats Header - Responsive */}
      {questions.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="rounded-lg border-1 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 sm:p-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng số câu</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {questions.length}
            </p>
          </div>
          <div className="rounded-lg border-1 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 sm:p-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Đã hoàn thành</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
              {totalAttempted}/{questions.length}
            </p>
          </div>
          <div className="rounded-lg border-1 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 sm:p-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng điểm</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0}%
            </p>
          </div>
        </div>
      )}

      {/* Single Question Display with Navigation - Responsive */}
      {questions.length > 0 && currentQuestion && (
        <div className="space-y-4 sm:space-y-6">
          {/* Question Card */}
          <div className="border-1 border-gray-200 dark:border-zinc-700 rounded-xl p-4 sm:p-6 bg-white dark:bg-zinc-900">
            <GrammarQuestion
              question={currentQuestion}
              questionNumber={questionNumber}
              totalQuestions={questions.length}
              onAnswer={(selectedOption) => handleAnswer(currentQuestionIndex, selectedOption)}
              onSubmit={() => handleSubmitAnswer(currentQuestionIndex)}
              showResult={isSubmitted}
              userAnswer={userAnswers[currentQuestionIndex]}
              canSubmit={hasAnswered && !isSubmitted}
            />
          </div>

          {/* Navigation Controls - Responsive */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Previous Button */}
            <button
              onClick={() => {
                setCurrentQuestionIndex(prev => prev - 1);
                setQuestionStartTime(Date.now()); // Reset timer for new question
              }}
              disabled={!canGoPrevious}
              className={`flex items-center justify-center border  border-gray-200 dark:border-zinc-700  gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 w-full sm:w-auto ${
                canGoPrevious
                  ? 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                  : 'bg-gray-50 dark:bg-zinc-900 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Câu trước</span>
            </button>

            {/* Question Number List - Responsive */}
            <div className="flex-1 flex items-center justify-center gap-1 flex-wrap px-1 sm:px-2 order-first sm:order-none">
              {questions.map((_, index) => {
                const isCurrent = index === currentQuestionIndex;
                const isAnswered = userAnswers[index] !== undefined;
                const isSubmitted = submittedAnswers.has(index);
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setQuestionStartTime(Date.now()); // Reset timer for new question
                    }}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isCurrent
                        ? 'bg-blue-500 text-white ring-2 ring-blue-300 dark:ring-blue-700'
                        : isSubmitted
                          ? isAnswered && userAnswers[index] === questions[index]?.correctOption
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700'
                          : isAnswered
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700'
                    }`}
                    title={`Câu ${index + 1}${isSubmitted ? (userAnswers[index] === questions[index]?.correctOption ? ' - Đúng' : ' - Sai') : isAnswered ? ' - Đã chọn' : ''}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => {
                setCurrentQuestionIndex(prev => prev + 1);
                setQuestionStartTime(Date.now()); // Reset timer for new question
              }}
              disabled={!canGoNext}
              className={`flex items-center border  border-gray-200 dark:border-zinc-700 justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 w-full sm:w-auto ${
                canGoNext
                  ? 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                  : 'bg-gray-50 dark:bg-zinc-900 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              <span className="hidden sm:inline">Câu tiếp</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      
      {/* Completion Message - Responsive */}
      {questions.length > 0 && totalAttempted === questions.length && (
        <div className="rounded-xl p-4 sm:p-6 border-1 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-base sm:text-lg font-bold text-green-700 dark:text-green-400">
                 Hoàn thành!
              </p>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-500">
                Bạn đã hoàn thành tất cả {questions.length} câu hỏi
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 sm:p-4 text-center border-1 border-green-200 dark:border-green-900">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Kết quả</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                {totalCorrect}/{questions.length}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 sm:p-4 text-center border-1 border-blue-200 dark:border-blue-900">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Độ chính xác</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {accuracy}%
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 sm:p-4 text-center border-1 border-purple-200 dark:border-purple-900">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Số câu sai</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">
                {questions.length - totalCorrect}
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
              Bạn có thể xem lại các câu hỏi bằng cách sử dụng nút điều hướng
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
