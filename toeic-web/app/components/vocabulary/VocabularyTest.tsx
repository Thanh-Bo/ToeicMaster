"use client";

import { useEffect, useState } from "react";
import { vocabularyService } from "@/app/services/vocabularyService";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Check, X } from "lucide-react";
import { QuestionVocab, Question, UserTestResult } from "@/app/types";

interface VocabularyTestProps {
  topicId: number;
  topicTitle: string;
  onComplete?: () => void;
}

export default function VocabularyTest({
  topicId,
  topicTitle,
  onComplete,
}: VocabularyTestProps) {
  const [questions, setQuestions] = useState<QuestionVocab[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [score, setScore] = useState(0);  
  const [results, setResults] = useState<UserTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({});
  const [generatingExplanation, setGeneratingExplanation] = useState<Record<number, boolean>>({});
  const [generatedExplanations, setGeneratedExplanations] = useState<Record<number, { short: string; long: string }>>({});

  const [newLevel, setNewLevel] = useState<number | null>(null);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await vocabularyService.getQuestionVocab(topicId);
        setQuestions(response.questions);
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
    return <div className="text-center py-8">Loading questions...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (questions.length === 0) {
    return <div className="text-center py-8">No questions available</div>;
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedAnswers[currentQuestion.id] !== undefined;

  const handleSelectOption = (label: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: label,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleGenerateExplanation = async (question: QuestionVocab) => {
    // If already generated, just toggle
    if (generatedExplanations[question.id]) {
      setExpandedExplanations({
        ...expandedExplanations,
        [question.id]: !expandedExplanations[question.id],
      });
      return;
    }

    // Otherwise, generate it using the new QuestionVocab endpoint
    try {
      setGeneratingExplanation({
        ...generatingExplanation,
        [question.id]: true,
      });

      const result = await vocabularyService.generateQuestionVocabExplanation(
        question.id
      );

      // Cache the generated explanation
      setGeneratedExplanations({
        ...generatedExplanations,
        [question.id]: {
          short: result.shortExplanation,
          long: result.fullExplanation,
        },
      });

      // Update the question with new explanations
      setQuestions(
        questions.map((q) =>
          q.id === question.id
            ? {
                ...q,
                shortExplanation: result.shortExplanation,
                longExplanation: result.fullExplanation,
              }
            : q
        )
      );

      // Expand the explanation
      setExpandedExplanations({
        ...expandedExplanations,
        [question.id]: true,
      });
    } catch (err) {
      console.error("Failed to generate explanation:", err);
    } finally {
      setGeneratingExplanation({
        ...generatingExplanation,
        [question.id]: false,
      });
    }
  };

  const handleSubmit = async () => {
    // Tính điểm
    let correctCount = 0;
    const testResults: UserTestResult[] = [];

    for (const question of questions) {
      const userAnswer = selectedAnswers[question.id];
      const correctAnswer = (question as any).correctOption;
      const isCorrect = userAnswer === correctAnswer;

      testResults.push({
        questionId: question.id,
        userAnswer: userAnswer || "Not answered",
        correctOption: correctAnswer || "N/A",
        isCorrect,
      });
      if (isCorrect) correctCount++;
    }

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    setResults(testResults);

    // 🆕 BƯỚC MỚI: Gọi API cập nhật vocabulary level
    try {
      const response = await vocabularyService.submitTestResults(topicId, {
        score: calculatedScore,
        correctCount,
        totalQuestions: questions.length,
        results: testResults,
      });

      // ✅ Lưu newLevel từ response
      if (response && response.newLevel) {
        setNewLevel(response.newLevel);
      }
      console.log("✅ Level updated!", response);
    } catch (err) {
      console.error("Error submitting test:", err);
    }

    setShowResults(true);
  };

  // Review Mode - Read-only view of all questions
  if (showResults && reviewMode) {
    const reviewQuestion = questions[reviewIndex];
    const reviewResult = results.find(
      (r) => r.questionId === reviewQuestion.id
    );
    const userAnswer = selectedAnswers[reviewQuestion.id];

    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setReviewMode(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300"
            >
              <ChevronLeft size={20} />
              Quay lại
            </button>
            <span className="text-gray-600 dark:text-gray-300">
              Question {reviewIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Question */}
          <div className="mb-8">
            <p className="text-lg font-semibold mb-6">
              {reviewQuestion.content}
            </p>

            {/* Options - Read only */}
            <div className="space-y-3 mb-6">
              {reviewQuestion.options.map((option) => {
                const isUserAnswer = userAnswer === option.label;
                const isCorrectAnswer =
                  reviewResult?.correctOption === option.label;

                let borderColor = "border-gray-200 dark:border-gray-600";
                let bgColor = "";

                if (isCorrectAnswer) {
                  borderColor = "border-green-500 dark:border-green-400";
                  bgColor = "bg-green-50 dark:bg-green-900/20";
                } else if (isUserAnswer && !reviewResult?.isCorrect) {
                  borderColor = "border-red-500 dark:border-red-400";
                  bgColor = "bg-red-50 dark:bg-red-900/20";
                }

                return (
                  <div
                    key={option.label}
                    className={`border-2 p-4 rounded-lg ${borderColor} ${bgColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        ({option.label})
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {option.content}
                      </span>
                      {isCorrectAnswer && (
                        <CheckCircle
                          className="text-green-600 dark:text-green-400 ml-auto"
                          size={20}
                        />
                      )}
                      {isUserAnswer && !reviewResult?.isCorrect && (
                        <XCircle
                          className="text-red-600 dark:text-red-400 ml-auto"
                          size={20}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* User Answer & Explanation */}
            <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg mb-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Your answer:
                  </p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {userAnswer || "Not answered"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Correct answer:
                  </p>
                  <p className="text-lg font-medium text-green-600 dark:text-green-400">
                    {reviewResult?.correctOption}
                  </p>
                </div>
              </div>
            </div>

            {/* Explanation Button */}
            <div className="mb-6">
              <button
                onClick={() => handleGenerateExplanation(reviewQuestion)}
                disabled={generatingExplanation[reviewQuestion.id]}
                className={`w-full px-4 py-3 rounded-lg font-semibold flex items-center justify-between transition-colors ${
                  expandedExplanations[reviewQuestion.id]
                    ? "bg-blue-600 text-white"
                    : "bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-500"
                }`}
              >
                <span>
                  {generatingExplanation[reviewQuestion.id]
                    ? "Đang tạo giải thích..."
                    : "Giải thích"}
                </span>
                {generatingExplanation[reviewQuestion.id] ? (
                  <div className="animate-spin">⟳</div>
                ) : (
                  <ChevronRight
                    size={20}
                    className={`transform transition-transform ${
                      expandedExplanations[reviewQuestion.id] ? "rotate-90" : ""
                    }`}
                  />
                )}
              </button>
            </div>

            {/* Explanation Section - Collapsible */}
            {expandedExplanations[reviewQuestion.id] && generatedExplanations[reviewQuestion.id] && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded mb-6">
                <div className="space-y-4">
                  {/* Short Explanation */}
                  {generatedExplanations[reviewQuestion.id]?.short && (
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                        💡 Quick Notes:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {generatedExplanations[reviewQuestion.id].short}
                      </p>
                    </div>
                  )}

                  {/* Divider */}
                  {generatedExplanations[reviewQuestion.id]?.short &&
                    generatedExplanations[reviewQuestion.id]?.long && (
                      <div className="border-t border-blue-200 dark:border-blue-800"></div>
                    )}
                  
                  {/* Long Explanation */}
                  {generatedExplanations[reviewQuestion.id]?.long && (
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                        📚 Detailed Explanation:
                      </p>
                      <div 
                        className="text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: generatedExplanations[reviewQuestion.id].long }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-4 mt-8">
            <button
              onClick={() => setReviewIndex(Math.max(0, reviewIndex - 1))}
              disabled={reviewIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <button
              onClick={() =>
                setReviewIndex(Math.min(questions.length - 1, reviewIndex + 1))
              }
              disabled={reviewIndex === questions.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Question indicators */}
          <div className="mt-6 flex flex-wrap gap-2">
            {questions.map((q, idx) => {
              const result = results.find((r) => r.questionId === q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => setReviewIndex(idx)}
                  className={`w-10 h-10 rounded text-sm font-semibold transition-all ${
                    result?.isCorrect
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  } ${reviewIndex === idx ? "ring-2 ring-blue-600" : ""}`}
                >
                  {result?.isCorrect ? <Check size={20} /> : <X size={20} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Results Summary Page
  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Test Results</h2>

          {/* Score Summary */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 dark:bg-zinc-900 p-4 rounded">
              <p className="text-gray-600 dark:text-gray-300 text-sm">Score</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {score}%
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Correct
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {results.filter((r) => r.isCorrect).length}/{questions.length}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Feedback
              </p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {score >= 50
                  ? "✨ Xuất sắc!"
                  : "📚 Ôn lại"}
              </p>
            </div>
          </div>
          {newLevel && newLevel > 0 ? (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
              <p className="font-semibold text-green-700">
                ✨ Chúc mừng! Cấp độ ghi nhớ lên giai đoạn {newLevel}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
              <p className="font-semibold text-red-700">
                Chưa đạt mức yêu cầu
              </p>
            </div>
          )}

          {/* Question indicators */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
              Review by question:
            </p>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const result = results.find((r) => r.questionId === q.id);
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setReviewIndex(idx);
                      setReviewMode(true);
                    }}
                    className={`w-12 h-12 rounded-lg text-sm font-semibold transition-all flex items-center justify-center ${
                      result?.isCorrect
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {result?.isCorrect ? (
                      <div className="flex items-center justify-center">
                        <span>Q{idx + 1}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span>Q{idx + 1}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* View Details Button */}
          <button
            onClick={() => {
              setReviewIndex(0);
              setReviewMode(true);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded mb-4"
          >
            Xem chi tiết (12 câu hỏi)
          </button>

          {/* Retry Button */}
          <button
            onClick={() => {
              setShowResults(false);
              setCurrentIndex(0);
              setSelectedAnswers({});
              setScore(0);
              setResults([]);
            }}
            className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded mb-4 transition-colors"
          >
            Ôn lại
          </button>

          {/* Complete Button */}
          {onComplete && (
            <button
              onClick={onComplete}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded transition-all"
            >
              Hoàn thành
            </button>
          )}
        </div>
      </div>
    );
  }

  // Test view
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg  p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {topicTitle} - Part 5 Test
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">
              Question {currentIndex + 1} of {questions.length}
            </span>
            {/* Progress bar */}
            <div className="flex-1 mx-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <p className="text-lg font-semibold mb-4">
            {currentQuestion.content}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.label}
                onClick={() => handleSelectOption(option.label)}
                className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                  selectedAnswers[currentQuestion.id] === option.label
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  ({option.label})
                </span>{" "}
                <span className="text-gray-700 dark:text-gray-300">
                  {option.content}
                </span>
                {selectedAnswers[currentQuestion.id] === option.label && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    <Check size={20} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={
                Object.keys(selectedAnswers).length !== questions.length
              }
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit ({Object.keys(selectedAnswers).length}/{questions.length})
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            >
              Next
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Answered indicator */}
        <div className="mt-4 flex flex-wrap gap-2">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-10 h-10 rounded text-sm font-semibold transition-all ${
                selectedAnswers[q.id]
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-800"
              } ${currentIndex === idx ? "ring-2 ring-blue-600" : ""}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
