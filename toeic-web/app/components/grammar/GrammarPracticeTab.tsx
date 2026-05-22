  "use client";

import { useState, useEffect } from "react";
import { QuestionGrammar } from "@/app/types";
import { GrammarQuestion } from "./GrammarQuestion";
import { ChevronLeft, ChevronRight, Trophy, Target, Zap, Crown } from "lucide-react";
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
  isLocked?: boolean;
  requiresPremium?: boolean;
}

export function GrammarPracticeTab({ 
  questionsByMode, 
  selectedMode,
  onModeChange,
  isLoading,
  grammarId,
  topicId,
  groupId,
  isLocked = false,
}: GrammarPracticeTabProps) {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Set<number>>(new Set());
  const [sessionStartTime] = useState(() => Date.now());
  const [sessionRecorded, setSessionRecorded] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(() => Date.now());

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
          const sessionData: {
            sessionType: "practice";
            durationSeconds: number;
            questionsAnswered: number;
            correctAnswers: number;
            grammarId?: number;
            topicId?: number;
            groupId?: number;
          } = {
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
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSubmittedAnswers(new Set());
    setSessionRecorded(false);
    setQuestionStartTime(Date.now());
  }, [selectedMode]);
  /* eslint-enable react-hooks/set-state-in-effect */

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
    <div className="space-y-5 sm:space-y-6 pb-6 sm:pb-8">
      {/* Mode Selection Tabs - Responsive */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {(['easy', 'medium', 'hard'] as const).map((mode) => {
          const config = modeConfig[mode];
          const Icon = config.icon;
          const count = questionsByMode[mode]?.length || 0;
          const isSelected = mode === selectedMode;
          
          const colorClasses = {
            easy: isSelected 
              ? 'bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
              : 'border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 text-gray-600 dark:text-zinc-400 hover:border-emerald-300 dark:hover:border-emerald-700/50',
            medium: isSelected 
              ? 'bg-blue-500/10 dark:bg-blue-500/5 border-blue-500 text-blue-600 dark:text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
              : 'border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 text-gray-600 dark:text-zinc-400 hover:border-blue-300 dark:hover:border-blue-700/50',
            hard: isSelected 
              ? 'bg-rose-500/10 dark:bg-rose-500/5 border-rose-500 text-rose-600 dark:text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
              : 'border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 text-gray-600 dark:text-zinc-400 hover:border-rose-300 dark:hover:border-rose-700/50',
          };

          return (
            <button
              key={mode}
              onClick={() => {
                onModeChange(mode);
              }}
              disabled={isLoading}
              className={`relative flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl border font-bold transition-all duration-200 ${colorClasses[mode]} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSelected && (
                <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${
                  mode === 'easy' ? 'bg-emerald-500' : mode === 'medium' ? 'bg-blue-500' : 'bg-rose-500'
                } animate-pulse`} />
              )}
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <div className="text-center">
                <div className="text-xs sm:text-sm">{config.label}</div>
                <div className="text-[10px] opacity-75 font-mono mt-0.5">{count} câu</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mode Description - Responsive */}
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md p-4">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${
            selectedMode === 'easy' 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : selectedMode === 'medium'
              ? 'bg-blue-500/10 text-blue-500'
              : 'bg-rose-500/10 text-rose-500'
          }`}>
            <currentMode.icon className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 font-medium">
            <span className="font-bold text-gray-900 dark:text-white">{currentMode.label}:</span> {currentMode.description}
          </p>
        </div>
      </div>

      {isLocked && (
        <div className="rounded-xl p-6 sm:p-8 border border-amber-200 dark:border-amber-900/40 bg-amber-500/5 dark:bg-amber-950/10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <Crown className="mx-auto mb-3 h-8 w-8 text-amber-500 dark:text-amber-450 animate-bounce" />
          <p className="text-amber-800 dark:text-amber-400 font-bold mb-2 text-sm sm:text-base">
            Câu hỏi của quy tắc này dành cho Premium
          </p>
          <p className="text-amber-700/80 dark:text-zinc-400 text-xs sm:text-sm">
            Bài học vẫn miễn phí. Nâng cấp Premium để luyện tập câu hỏi của quy tắc này.
          </p>
        </div>
      )}

      {/* No Questions Message - Responsive */}
      {questions.length === 0 && !isLoading && !isLocked && (
        <div className="rounded-xl p-6 sm:p-8 border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 text-center">
          <p className="text-zinc-500 dark:text-zinc-400 font-semibold mb-2 text-sm sm:text-base">
            Chưa có câu hỏi luyện tập
          </p>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs sm:text-sm">
            Hãy quay lại sau khi thêm câu hỏi cho quy tắc này
          </p>
        </div>
      )}

      {/* Loading State - Responsive */}
      {questions.length === 0 && isLoading && (
        <div className="rounded-xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-md text-center">
          <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500 dark:text-zinc-400 font-semibold text-sm sm:text-base">
            Đang tải câu hỏi...
          </p>
        </div>
      )}

      {/* Page Stats Header - Responsive */}
      {questions.length > 0 && (
        <div className="rounded-xl border border-gray-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md overflow-hidden grid grid-cols-5 p-2 sm:p-4">
          <div className="text-center py-1 sm:py-2 border-r border-gray-200 dark:border-zinc-800/80 last:border-r-0">
            <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-wider mb-1">Tổng số</p>
            <p className="text-lg sm:text-2xl font-black text-zinc-600 dark:text-zinc-300 font-mono">
              {questions.length}
            </p>
          </div>
          <div className="text-center py-1 sm:py-2 border-r border-gray-200 dark:border-zinc-800/80 last:border-r-0">
            <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-wider mb-1">Đã làm</p>
            <p className="text-lg sm:text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
              {totalAttempted}
            </p>
          </div>
          <div className="text-center py-1 sm:py-2 border-r border-gray-200 dark:border-zinc-800/80 last:border-r-0">
            <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-wider mb-1">Điểm số</p>
            <p className="text-lg sm:text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
              {totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0}%
            </p>
          </div>
          <div className="text-center py-1 sm:py-2 border-r border-gray-200 dark:border-zinc-800/80 last:border-r-0">
            <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-wider mb-1">Đúng</p>
            <p className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {totalCorrect}
            </p>
          </div>
          <div className="text-center py-1 sm:py-2 last:border-r-0">
            <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-wider mb-1">Sai</p>
            <p className="text-lg sm:text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {totalAttempted - totalCorrect}
            </p>
          </div>
        </div>
      )}

      {/* Single Question Display with Navigation - Responsive */}
      {questions.length > 0 && currentQuestion && (
        <div className="space-y-4 sm:space-y-6">
          {/* Question Card */}
          <div className="border border-gray-200/80 dark:border-zinc-800/80 rounded-2xl p-5 sm:p-8 bg-white dark:bg-zinc-900/60 backdrop-blur-md">
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
              className={`flex items-center justify-center border gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 w-full sm:w-auto ${
                canGoPrevious
                  ? 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/80 hover:border-gray-300'
                  : 'bg-zinc-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-900 text-zinc-400 dark:text-zinc-600 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            {/* Question Number List - Responsive */}
            <div className="flex-1 flex items-center justify-center gap-1.5 flex-wrap px-1 sm:px-2 order-first sm:order-none">
              {questions.map((_, index) => {
                const isCurrent = index === currentQuestionIndex;
                const isAnswered = userAnswers[index] !== undefined;
                const isSubmitted = submittedAnswers.has(index);
                const isCorrectAnswer = isAnswered && userAnswers[index] === questions[index]?.correctOption;
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setQuestionStartTime(Date.now()); // Reset timer for new question
                    }}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center border ${
                      isCurrent
                        ? 'bg-blue-500 text-white border-blue-500 ring-4 ring-blue-500/20'
                        : isSubmitted
                          ? isCorrectAnswer
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 font-extrabold'
                          : isAnswered
                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold'
                            : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                    title={`Câu ${index + 1}${isSubmitted ? (isCorrectAnswer ? ' - Đúng' : ' - Sai') : ''}`}
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
              className={`flex items-center justify-center border gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 w-full sm:w-auto ${
                canGoNext
                  ? 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/80 hover:border-gray-300'
                  : 'bg-zinc-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-900 text-zinc-400 dark:text-zinc-600 cursor-not-allowed opacity-50'
              }`}
            >
              <span>Câu tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
