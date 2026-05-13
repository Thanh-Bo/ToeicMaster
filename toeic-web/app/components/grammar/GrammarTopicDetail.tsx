"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, BookOpen, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Grammar, QuestionGrammar } from "@/app/types";
import { GrammarLessonTab } from "./GrammarLessonTab";
import { GrammarPracticeTab } from "./GrammarPracticeTab";

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
}

type TabType = "lesson" | "practice";

export function GrammarTopicDetail({ 
  grammar, 
  topicId,
  questionsByMode,
  onBack,
  onLoadQuestions,
  questionsLoading = false,
}: GrammarTopicDetailProps) {
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
  }, [grammar.id, activeTab]); // Watch for grammar changes

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
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Header with Back Button and Tabs */}
      <div className="border-b border-gray-200 dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-900 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          {/* Back Button and Title */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/grammar"
              className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 truncate">
              {grammar.ruleName}
            </h1>
            {grammar.difficulty && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                Độ khó: {grammar.difficulty}/5
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("lesson")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "lesson"
                  ? "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-1 border-blue-400 dark:border-blue-600"
                  : "border-1 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-zinc-600"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Bài học
            </button>

            <button
              onClick={handlePracticeTabClick}
              disabled={questionsLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "practice"
                  ? "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-1 border-blue-400 dark:border-blue-600"
                  : "border-1 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-zinc-600"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ClipboardList className="w-4 h-4" />
              Luyện tập 
              {questionsLoading && (
                <span className="text-xs ml-1 animate-spin">⟳</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === "lesson" && <GrammarLessonTab grammar={grammar} topicId={topicId} />}
        {activeTab === "practice" && (
          <GrammarPracticeTab 
            questionsByMode={questionsByMode}
            selectedMode={selectedMode}
            onModeChange={handleModeChange}
            isLoading={questionsLoading}  
            grammarId={grammar.id}
            topicId={topicId}
          />
        )}
      </div>
    </div>
  );
}
