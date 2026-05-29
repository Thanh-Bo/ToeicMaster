"use client";

import { useState } from "react";
import { Grammar, QuestionGrammar } from "@/app/types";
import { GrammarTopicDetail } from "./GrammarTopicDetail";
import { RandomPracticeTab } from "./RandomPracticeTab";
import { ChevronLeft, BookOpen, Crown, Dices, CheckCircle } from "lucide-react";
import { GrammarStatus } from "@/app/types";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";

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
  questionsLocked?: boolean;
  selectedGrammarId: number | null;
}

export function GrammarTopicRulesList({
  topicTitle,
  topicId,
  rules,
  questionsByMode,
  onLoadQuestions,
  questionsLoading,
  questionsLocked = false,
  selectedGrammarId,
}: GrammarTopicRulesListProps) {
  const { user } = useAuth();
  const isPro = user?.isPremium === true || user?.role?.toLowerCase() === "admin";
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(selectedGrammarId || rules[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'rules' | 'random-practice'>('rules');

  const selectedRule = rules.find((r) => r.id === selectedRuleId);

  if (!selectedRule) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Không có quy tắc nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header - Responsive */}
      <div className="border-b border-gray-200 dark:border-zinc-800/80 sticky top-0 bg-white dark:bg-zinc-950 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
          <Link
            href="/grammar"
            className="p-2 rounded-lg border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Chủ đề</p>
            </div>
            <h1 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white truncate">
              {topicTitle}
            </h1>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/20 dark:border-blue-500/10 flex-shrink-0">
            {rules.length} quy tắc
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar: Rules List - Responsive */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500 mb-2 sm:mb-3 uppercase tracking-wider">
                Các quy tắc
              </h2>
              <div className="space-y-1.5 sm:space-y-2 max-h-80 sm:max-h-96 overflow-y-auto pr-1">
                {rules.map((rule) => {
                  const isSelected = activeTab === 'rules' && rule.id === selectedRuleId;

                  return (
                    <button
                      key={rule.id}
                      onClick={() => {
                        setSelectedRuleId(rule.id);
                        setActiveTab('rules'); // Fix 3b: switch về rules khi click
                        onLoadQuestions(rule.id);
                      }}
                      className={`w-full text-left rounded-lg transition-all duration-200 flex items-center justify-between gap-2 border ${
                        isSelected
                          ? "bg-blue-50/60 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40 border-l-4 border-l-blue-500 py-2.5 pl-2 sm:pl-3 pr-3 sm:py-3 sm:pr-4"
                          : "border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 text-gray-700 dark:text-zinc-300 py-2.5 px-3 sm:py-3 sm:px-4"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {rule.status === GrammarStatus.Mastered && (
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        )}
                        <div className={`font-semibold text-xs sm:text-sm line-clamp-2 ${
                          isSelected ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-white"
                        }`}>
                          {rule.ruleName}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {rule.isQuestionsPremiumRequired && !isPro && (
                          <Crown
                            className="h-3.5 w-3.5 shrink-0 text-yellow-500"
                            aria-label="Explanation Premium"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* NEW: Random Practice Tab Button */}
                <div className="pt-2 border-t border-gray-200 dark:border-zinc-800/80 mt-2">
                  <button
                    onClick={() => setActiveTab('random-practice')}
                    className={`w-full text-left rounded-lg transition-all duration-200 flex items-center justify-between gap-2 border ${
                      activeTab === 'random-practice'
                        ? "bg-blue-50/60 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40 border-l-4 border-l-blue-500 py-2.5 pl-2 sm:pl-3 pr-3 sm:py-3 sm:pr-4"
                        : "border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 text-gray-700 dark:text-zinc-300 py-2.5 px-3 sm:py-3 sm:px-4"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
                      <Dices className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>Luyện tập ngẫu nhiên</span>
                    </div>
                  </button>
                </div>
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
                questionsLocked={questionsLocked}
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
