"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, BookOpen, ClipboardList, Crown } from "lucide-react";
import Link from "next/link";
import { Grammar, QuestionGrammar } from "@/app/types";
import { GrammarLessonTab } from "./GrammarLessonTab";
import { GrammarPracticeTab } from "./GrammarPracticeTab";
import { useAuth } from "@/app/contexts/AuthContext";

interface GrammarTopicDetailProps {
  grammar: Grammar;
  topicId?: number;
  questionsByMode: {
    easy: QuestionGrammar[];
    medium: QuestionGrammar[];
    hard: QuestionGrammar[];
  };
  onBack?: () => void;
  onLoadQuestions?: (grammarId: number, mode?: 'easy' | 'medium' | 'hard') => Promise<void>;
  questionsLoading?: boolean;
  questionsLocked?: boolean;
}

type TabType = "lesson" | "practice";

export function GrammarTopicDetail({ 
  grammar, 
  topicId,
  questionsByMode,
  onLoadQuestions,
  questionsLoading = false,
  questionsLocked = false,
}: GrammarTopicDetailProps) {
  const { user } = useAuth();
  const isPro = user?.isPremium === true || user?.role?.toLowerCase() === "admin";
  const [activeTab, setActiveTab] = useState<TabType>("lesson");
  const [selectedMode, setSelectedMode] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Load all modes when grammar changes while in Practice tab
  useEffect(() => {
    if (activeTab === "practice" && grammar.id && onLoadQuestions) {
      const modes: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
      const modesToLoad = modes.filter(mode => questionsByMode[mode].length === 0);
      
      if (modesToLoad.length > 0) {
        Promise.all(
          modesToLoad.map(mode => onLoadQuestions(grammar.id!, mode))
        );
      }
    }
  }, [grammar.id, activeTab, onLoadQuestions, questionsByMode]); // Watch for grammar changes

  const handlePracticeTabClick = async () => {
    setActiveTab("practice");
    // Load all 3 modes at once to show correct counts
    if (onLoadQuestions && grammar.id) {
      const modes: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
      const modesToLoad = modes.filter(mode => questionsByMode[mode].length === 0);
      
      if (modesToLoad.length > 0) {
        await Promise.all(
          modesToLoad.map(mode => onLoadQuestions(grammar.id!, mode))
        );
      }
    }
  };

  const handleModeChange = async (mode: 'easy' | 'medium' | 'hard') => {
    setSelectedMode(mode);
    // Load from API if not yet cached for this mode
    if (onLoadQuestions && grammar.id && questionsByMode[mode].length === 0) {
      await onLoadQuestions(grammar.id, mode);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header with Back Button and Tabs */}
      <div className="border-b border-gray-200 dark:border-zinc-800/80 sticky top-0 bg-white dark:bg-zinc-950 z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {/* Back Button and Title */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Link
              href="/grammar"
              className="p-1.5 sm:p-2 rounded-lg border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
            </Link>
            <h1 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white flex-1 truncate">
              {grammar.ruleName}
            </h1>
            {grammar.difficulty && (
              <span className="text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/10 dark:border-blue-500/10 flex-shrink-0">
                Độ khó: {grammar.difficulty}/5
              </span>
            )}
            {grammar.isQuestionsPremiumRequired && !isPro && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border border-yellow-300/30 dark:border-yellow-500/20 flex-shrink-0">
                <Crown className="h-3.5 w-3.5" />
                Premium
              </span>
            )}
          </div>

          {/* Tabs - Pill design */}
          <div className="flex justify-start">
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl w-full sm:w-auto border border-gray-200/40 dark:border-zinc-800/60">
              <button
                onClick={() => setActiveTab("lesson")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 text-xs sm:text-sm ${
                  activeTab === "lesson"
                    ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Bài học</span>
              </button>

              <button
                onClick={handlePracticeTabClick}
                disabled={questionsLoading}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 text-xs sm:text-sm ${
                  activeTab === "practice"
                    ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ClipboardList className="w-4 h-4 text-emerald-500" />
                <span>Luyện tập</span>
                {questionsLoading && (
                  <span className="text-xs ml-1 animate-spin">⟳</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {activeTab === "lesson" && <GrammarLessonTab grammar={grammar} topicId={topicId} />}
        {activeTab === "practice" && (
          <GrammarPracticeTab 
            questionsByMode={questionsByMode}
            selectedMode={selectedMode}
            onModeChange={handleModeChange}
            isLoading={questionsLoading}  
            grammarId={grammar.id}
            topicId={topicId}
            isLocked={questionsLocked}
            requiresPremium={grammar.isQuestionsPremiumRequired}
          />
        )}
      </div>
    </div>
  );
}
