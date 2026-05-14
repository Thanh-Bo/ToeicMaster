"use client";

import { useEffect, useState } from "react";
import { vocabularyService } from "@/app/services/vocabularyService";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Sparkles, Trophy } from "lucide-react";
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
  const [explanation, setExplanation] = useState<{ short: string; long: string } | null>(null);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await vocabularyService.getQuestionVocab(topicId);
        setQuestions(response.questions || []);
        setStats(prev => ({ ...prev, totalQuestions: response.questions?.length || 0 }));
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

    setStats(prev => ({
      ...prev,
      answered: prev.answered + 1,
      correctCount: correct ? prev.correctCount + 1 : prev.correctCount,
      wrongCount: correct ? prev.wrongCount : prev.wrongCount + 1,
    }));

    if (correct) {
      playSound('correct');
    } else {
      playSound('wrong');
    }

    try {
      setGeneratingExplanation(true);
      const result = await vocabularyService.generateQuestionVocabExplanation(currentQuestion.id);
      setExplanation({
        short: result.shortExplanation,
        long: result.fullExplanation,
      });
    } catch (err) {
      console.error("Failed to generate explanation:", err);
    } finally {
      setGeneratingExplanation(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setHasSubmitted(false);
      setIsCorrect(null);
      setExplanation(null);
    } else {
      const finalScore = Math.round((stats.correctCount / questions.length) * 100);
      setStats(prev => ({ ...prev, score: finalScore }));
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

  if (showCompletion) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl shadow-lg border border-green-200 dark:border-green-800 p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={40} />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hoàn thành! <Sparkles className="inline w-6 h-6" />
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Bạn đã hoàn thành bài kiểm tra {topicTitle}
          </p>

          <div className="grid grid-cols-5 gap-4 mb-8">
            <StatBox label="Tổng số câu" value={stats.totalQuestions} color="text-blue-500" />
            <StatBox label="Đã hoàn thành" value={`${stats.answered}/${stats.totalQuestions}`} color="text-green-500" />
            <StatBox label="Tổng điểm" value={`${stats.score}%`} color="text-purple-500" />
            <StatBox label="Số câu đúng" value={stats.correctCount} color="text-green-500" />
            <StatBox label="Số câu sai" value={stats.wrongCount} color="text-red-500" />
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
            >
              Làm lại
            </button>
            <button
              onClick={onComplete}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg"
            >
              Hoàn thành
            </button>
          </div>
        </div>
      </div>
    );
  }

  const answers = getAnswers(currentQuestion);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Câu {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {Math.round(((currentIndex) / questions.length) * 100)}% hoàn thành
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-300"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 p-6 md:p-8">
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-relaxed">
            {currentQuestion.content}
          </h3>
        </div>

        <div className="space-y-3 mb-8">
          {answers.map((answer: QuestionAnswer) => {
            const isSelected = selectedAnswer === answer.label;
            const isCorrectAnswer = answer.label === currentQuestion.correctOption;
            
            let buttonClass = "border-2 border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-zinc-900";
            
            if (hasSubmitted) {
              if (isCorrectAnswer) {
                buttonClass = "border-2 border-green-500 bg-green-50 dark:bg-green-900/20";
              } else if (isSelected && !isCorrect) {
                buttonClass = "border-2 border-red-500 bg-red-50 dark:bg-red-900/20";
              }
            } else if (isSelected) {
              buttonClass = "border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20";
            }

            return (
              <button
                key={answer.label}
                onClick={() => handleSelectOption(answer.label)}
                disabled={hasSubmitted}
                className={`w-full p-4 rounded-xl text-left transition-all ${buttonClass} ${
                  hasSubmitted ? "cursor-default" : "cursor-pointer hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300">
                    {answer.label}
                  </span>
                  <span className="flex-1 text-gray-800 dark:text-gray-200">
                    {answer.content}
                  </span>
                  {hasSubmitted && isCorrectAnswer && (
                    <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                  )}
                  {hasSubmitted && isSelected && !isCorrect && (
                    <XCircle className="text-red-600 dark:text-red-400" size={24} />
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
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Kiểm tra
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg shadow-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2"
          >
            Câu tiếp <ChevronRight size={20} />
          </button>
        )}

        {hasSubmitted && (
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-blue-600 dark:text-blue-400" size={20} />
              <h4 className="font-bold text-gray-900 dark:text-white">Giải thích</h4>
            </div>
            
            {generatingExplanation ? (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Đang tạo giải thích...
              </div>
            ) : explanation ? (
              <div className="space-y-3">
                <p className="text-gray-800 dark:text-gray-200 font-medium">{explanation.short}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{explanation.long}</p>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Không có giải thích</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-gray-200 dark:border-zinc-700">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
