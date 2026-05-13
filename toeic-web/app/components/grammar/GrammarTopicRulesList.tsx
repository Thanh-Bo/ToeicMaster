"use client";

import { useState, useEffect } from "react";
import { Grammar, QuestionGrammar } from "@/app/types";
import { GrammarTopicDetail } from "./GrammarTopicDetail";
import { RandomPracticeTab } from "./RandomPracticeTab";
import { ChevronLeft, BookOpen } from "lucide-react";
import Link from "next/link";

interface GrammarTopicRulesListProps {
  topicTitle: string;
  topicId: number;
  rules: Grammar[];
  questionsByMode: {
    easy: QuestionGrammar[];
    medium: QuestionGrammar[];
    hard: QuestionGrammar[];
  };
  onLoadQuestions: (grammarId: number, mode?: 'easy' | 'medium' | 'hard') => Promise<void>;
  questionsLoading: boolean;
  selectedGrammarId: number | null;
}

export function   GrammarTopicRulesList({
  topicTitle,
  topicId,
  rules,
  questionsByMode,
  onLoadQuestions,
  questionsLoading,
  selectedGrammarId,
}: GrammarTopicRulesListProps) {
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(selectedGrammarId || rules[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'rules' | 'random-practice'>('rules');

  // Sync selectedRuleId with selectedGrammarId prop
  useEffect(() => {
    if (selectedGrammarId && selectedGrammarId !== selectedRuleId) {
      setSelectedRuleId(selectedGrammarId);
    }
  }, [selectedGrammarId]);

  const selectedRule = rules.find((r) => r.id === selectedRuleId);

  // Total questions loaded for the sidebar counter
  const allQuestions = [
    ...questionsByMode.easy,
    ...questionsByMode.medium,
    ...questionsByMode.hard,
  ];


  if (!selectedRule) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Không có quy tắc nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Header - Responsive */}
      <div className="border-b border-gray-200 dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-900 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
          <Link
            href="/grammar"
            className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Chủ đề</p>
            </div>
            <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white truncate">
              {topicTitle}
            </h1>
          </div>
          <span className="text-xs font-semibold px-2 sm:px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex-shrink-0">
            {rules.length} quy tắc
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar: Rules List - Responsive */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 uppercase">
                Các quy tắc
              </h2>
              <div className="space-y-1.5 sm:space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
                {rules.map((rule) => {
                  const ruleQuestionCount = allQuestions.filter(
                    (q) => q.grammarId === rule.id || q.ruleId === rule.id
                  ).length;
                  const isSelected = activeTab === 'rules' && rule.id === selectedRuleId;

                  return (
                    <button
                      key={rule.id}
                      onClick={() => {
                        setSelectedRuleId(rule.id);
                        setActiveTab('rules'); // Fix 3b: switch về rules khi click
                        onLoadQuestions(rule.id);
                      }}
                      className={`w-full text-left p-2.5 sm:p-3 rounded-lg transition-all duration-200 ${
                        isSelected
                          ? "bg-blue-100 dark:bg-blue-950/50 border-1 border-blue-400 dark:border-blue-600"
                          : "border-1 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
                      }`}
                    >
                      <div className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-2">
                        {rule.ruleName}
                      </div>
                     
                    </button>
                  );
                })}
                
                {/* NEW: Random Practice Tab Button */}
                <button
                  onClick={() => setActiveTab('random-practice')}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-lg transition-all duration-200 ${
                    activeTab === 'random-practice'
                      ? "bg-blue-100 dark:bg-blue-950/50 border-1 border-blue-400 dark:border-blue-600"
                      : "border-1 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">
                    Luyện tập ngẫu nhiên
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content: Lesson + Practice */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {activeTab === 'rules' && (
              <GrammarTopicDetail
                grammar={selectedRule}
                topicId={topicId}
                questionsByMode={questionsByMode}
                onBack={() => setActiveTab('rules')}
                onLoadQuestions={onLoadQuestions}
                questionsLoading={questionsLoading}
              />
            )}
            
            {activeTab === 'random-practice' && (
              <RandomPracticeTab
                topicId={topicId}
                topicName={topicTitle}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
