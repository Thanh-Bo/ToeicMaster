"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GrammarTopic, Grammar, QuestionGrammar } from "@/app/types";
import { grammarService } from "@/app/services/grammarService";
import { GrammarTopicRulesList } from "@/app/components/grammar/GrammarTopicRulesList";
import { Loader } from "lucide-react";

export default function GrammarTopicDetailsPage() {
  const params = useParams();
  const groupId = Number(params.groupId);
  const topicId = Number(params.topicId);

  const [topic, setTopic] = useState<GrammarTopic | null>(null);
  const [rules, setRules] = useState<Grammar[]>([]);
  const [questionsByMode, setQuestionsByMode] = useState<{
    easy: QuestionGrammar[];
    medium: QuestionGrammar[];
    hard: QuestionGrammar[];
  }>({ easy: [], medium: [], hard: [] });
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGrammarId, setSelectedGrammarId] = useState<number | null>(null);

  useEffect(() => {
    loadTopicData();
  }, [groupId, topicId]);

  const loadTopicData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load topic details with both groupId and topicId
      const topicData = await grammarService.getTopicById(groupId, topicId);
      if (!topicData) {
        setError("Không tìm thấy chủ đề");
        return;
      }
      setTopic(topicData);

      // Load all grammar rules for this topic
      const rulesData = await grammarService.getGrammarsByTopic(topicId);
      setRules(rulesData);

      // Don't load questions on mount - lazy load when Practice tab is clicked
    } catch (err) {
      console.error("Error loading topic data:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async (grammarId: number, mode: 'easy' | 'medium' | 'hard' = 'medium') => {
    console.log(`[page.tsx] loadQuestions called: grammarId=${grammarId}, mode=${mode}`);

    // Reset cache if switching to a different grammar rule
    if (selectedGrammarId !== null && selectedGrammarId !== grammarId) {
      setQuestionsByMode({ easy: [], medium: [], hard: [] });
    }

    // Use per-mode cache: skip API if this mode is already loaded for this grammar
    if (selectedGrammarId === grammarId && questionsByMode[mode].length > 0) {
      console.log(`[page.tsx] Using cached questions for mode: ${mode}`);
      return;
    }

    try {
      console.log(`[page.tsx] Loading questions from API for mode: ${mode}...`);
      setQuestionsLoading(true);
      setSelectedGrammarId(grammarId);

      const questionsData = await grammarService.getQuestionsByGrammar(grammarId, mode);
      console.log(`[page.tsx] Received ${questionsData.items?.length || 0} questions from API`);

      // Store questions keyed by mode — no overwriting other modes
      setQuestionsByMode(prev => ({
        ...prev,
        [mode]: questionsData.items || [],
      }));
    } catch (err) {
      console.error("Error loading questions:", err);
    } finally {
      setQuestionsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">
            {error || "Không tìm thấy chủ đề"}
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 rounded-lg font-semibold border-1 border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Chủ đề này chưa có quy tắc nào
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 rounded-lg font-semibold border-1 border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <GrammarTopicRulesList
      topicTitle={topic.title || "Không xác định"}
      topicId={topicId}
      rules={rules}
      questionsByMode={questionsByMode}
      onLoadQuestions={loadQuestions}
      questionsLoading={questionsLoading}
      selectedGrammarId={selectedGrammarId}
    />
  );
}
