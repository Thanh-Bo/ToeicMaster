"use client";

import { useState, useEffect } from "react";
import { QuestionGrammar, GrammarTopic } from "@/app/types";
import { GrammarPracticeTab } from "./GrammarPracticeTab";
import { grammarService } from "@/app/services/grammarService";
import { Shuffle } from "lucide-react";

interface RandomPracticeTabProps {
  topicId: number;
  topicName: string;
}

export function RandomPracticeTab({ topicId, topicName }: RandomPracticeTabProps) {
  const [selectedMode, setSelectedMode] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questionsByMode, setQuestionsByMode] = useState<{
    easy: QuestionGrammar[];
    medium: QuestionGrammar[];
    hard: QuestionGrammar[];
  }>({
    easy: [],
    medium: [],
    hard: [],
  });
  const [loading, setLoading] = useState(false);
  const [topicData, setTopicData] = useState<GrammarTopic | null>(null);

  // Fetch topic details to get groupId
  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        // Get all groups first
        const groups = await grammarService.getAllGroups();
        // Try to find topic in each group
        for (const group of groups) {
          const topics = await grammarService.getTopicsByGroup(group.id);
          const topic = topics.find(t => t.id === topicId);
          if (topic) {
            setTopicData({ ...topic, groupId: group.id });
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching topic details:', error);
      }
    };
    
    if (topicId) {
      fetchTopicDetails();
    }
  }, [topicId]);

  // Fix 3a: Auto-load khi component mount
  useEffect(() => {
     Promise.all([
    loadQuestions('easy'),
    loadQuestions('medium'),
    loadQuestions('hard')
  ]);
  }, [topicId]);

  const loadQuestions = async (mode: 'easy' | 'medium' | 'hard') => {
    setLoading(true);
    try {
      // Fix URL 404: dùng grammarService (axiosClient) thay vì raw fetch
      const data = await grammarService.getQuestionsByTopic(topicId, mode, 25);
      setQuestionsByMode(prev => ({
        ...prev,
        [mode]: data.items || [],
      }));
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = async (mode: 'easy' | 'medium' | 'hard') => {
    setSelectedMode(mode);
    if (questionsByMode[mode].length === 0) {
      await loadQuestions(mode);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="rounded-xl p-3 sm:p-4 lg:p-5 border-1 border-gray-200 dark:border-zinc-700 bg-white  dark:bg-zinc-900">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base sm:text-lg font-bold text-gray-700 dark:text-gray-300">Luyện tập ngẫu nhiên</h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-400">
          Topic: {topicName} · 60 câu trộn ngẫu nhiên (giống thi TOEIC thật)
        </p>
      </div>

      {/* Fix 1: Không render mode selector ở đây — GrammarPracticeTab đã có sẵn */}
      <GrammarPracticeTab
        questionsByMode={questionsByMode}
        selectedMode={selectedMode}
        onModeChange={handleModeChange}
        isLoading={loading}        topicId={topicId}      />
    </div>
  );
}
