"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { QuestionGrammar } from "@/app/types";
import { grammarService } from "@/app/services/grammarService";
import { GrammarTest, TestResult } from "@/app/components/grammar/GrammarTest";
import { Loader } from "lucide-react";

export default function PracticeTestPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.topicId as string;

  const [questions, setQuestions] = useState<QuestionGrammar[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [topicId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      // Try to get from session storage first
      const cached = sessionStorage.getItem(
        `grammarPractice_${topicId}`
      );
      if (cached) {
        setQuestions(JSON.parse(cached));
      } else {
        // Fetch from API
        const response = await grammarService.getQuestionsByTopic(Number(topicId));
        setQuestions(response.items || []);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestComplete = async (results: TestResult[]) => {
    try {
      setSubmitting(true);

      // Calculate score
      const correctCount = results.filter((r) => r.isCorrect).length;
      const score = (correctCount / results.length) * 100;

      // Submit test results
      await grammarService.submitTest(results);

      // Navigate to results page
      router.push(
        `/grammar/practice/${topicId}/results?score=${Math.round(
          score
        )}&correct=${correctCount}&total=${results.length}`
      );
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Lỗi khi nộp bài kiểm tra");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Đang tải câu hỏi...
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Không có câu hỏi nào cho chủ đề này
          </p>
          <button
            onClick={() => router.push("/grammar/practice")}
            className="mt-4 px-6 py-2 rounded-lg font-semibold border-2 border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <GrammarTest
      questions={questions}
      onComplete={handleTestComplete}
      onBack={() => router.push("/grammar/practice")}
      showTimer={true}
      timeLimit={15}
    />
  );
}
