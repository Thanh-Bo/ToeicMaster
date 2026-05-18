"use client";

import { useState, useEffect } from "react";
import { vocabularyService } from "@/app/services/vocabularyService";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  Flame,
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  Loader,
  ChevronDown,
  ChevronUp,
  BookMarked,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import type { VocabLevelAnalysis } from "@/app/types";

interface VocabularyProgressTabProps {
  period?: string;
}

const PERIODS = [
  { value: "week", label: "7 ngày" },
  { value: "month", label: "30 ngày" },
  { value: "quarter", label: "90 ngày" },
  { value: "year", label: "1 năm" },
  { value: "all", label: "Tất cả" },
];

const LEVEL_COLORS = {
  Basic: {
    primary: "blue",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-600 dark:text-blue-400",
    bar: "bg-blue-500",
  },
  Intermediate: {
    primary: "amber",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
  },
  Advanced: {
    primary: "purple",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-600 dark:text-purple-400",
    bar: "bg-purple-500",
  },
};

const LEVEL_COLORS_BY_NUMBER = {
  1: {
    bar: "bg-gradient-to-r from-teal-400 to-teal-500 dark:from-teal-600 dark:to-teal-700",
    text: "text-teal-600 dark:text-teal-400",
  },
  2: {
    bar: "bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
    text: "text-blue-600 dark:text-blue-400",
  },
  3: {
    bar: "bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700",
    text: "text-indigo-600 dark:text-indigo-400",
  },
  4: {
    bar: "bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700",
    text: "text-orange-600 dark:text-orange-400",
  },
  5: {
    bar: "bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600",
    text: "text-yellow-600 dark:text-yellow-400",
  },
};

export function VocabularyProgressTab({
  period: initialPeriod,
}: VocabularyProgressTabProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(
    initialPeriod || "month",
  );
  const [stats, setStats] = useState<{
    totalTopicsLearned: number;
    totalVocabLearned: number;
    reviewDue: number;
    totalTimeMinutes: number;
    totalQuestionsAnswered: number;
    accuracy: number;
    streak: { current: number; longest: number };
  } | null>(null);
  const [levelAnalysis, setLevelAnalysis] = useState<
    VocabLevelAnalysis[] | null
  >(null);
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id, selectedPeriod]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, analysisData] = await Promise.all([
        vocabularyService.getVocabStats(user!.id, selectedPeriod),
        vocabularyService.getVocabAnalysisByLevel(user!.id, selectedPeriod),
      ]);
      setStats(statsData);
      setLevelAnalysis(analysisData);
    } catch (error) {
      console.error("Error loading vocab progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLevel = (level: string) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(level)) {
      newExpanded.delete(level);
    } else {
      newExpanded.add(level);
    }
    setExpandedLevels(newExpanded);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Vui lòng đăng nhập để xem tiến độ
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!stats || !levelAnalysis) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Không thể tải dữ liệu. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((period) => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === period.value
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Streak Card */}
      <StreakCard streak={stats.streak} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          }
          value={stats.totalTopicsLearned}
          label="Chủ đề đã học"
          bgColor="bg-blue-50 dark:bg-blue-950/30"
        />
        <StatCard
          icon={
            <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
          }
          value={stats.totalVocabLearned}
          label="Từ đã học"
          bgColor="bg-green-50 dark:bg-green-950/30"
        />
        <StatCard
          icon={
            <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          }
          value={stats.reviewDue}
          label="Cần ôn tập"
          bgColor="bg-orange-50 dark:bg-orange-950/30"
        />
        <StatCard
          icon={
            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          }
          value={`${stats.totalTimeMinutes}m`}
          label="Thời gian học"
          bgColor="bg-purple-50 dark:bg-purple-950/30"
        />
        <StatCard
          icon={
            <TrendingUp className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          }
          value={stats.totalQuestionsAnswered}
          label="Câu đã làm"
          bgColor="bg-pink-50 dark:bg-pink-950/30"
        />
        <StatCard
          icon={<Target className="w-6 h-6 text-teal-600 dark:text-teal-400" />}
          value={`${stats.accuracy}%`}
          label="Độ chính xác"
          bgColor="bg-teal-50 dark:bg-teal-950/30"
        />
      </div>

      {/* Level Analysis Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Phân tích theo Level
        </h3>
        <div className="space-y-4">
          {levelAnalysis.map((level) => (
            <LevelCard
              key={level.level}
              data={level}
              isExpanded={expandedLevels.has(level.level)}
              onToggle={() => toggleLevel(level.level)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Level Card Component
function LevelCard({
  data,
  isExpanded,
  onToggle,
}: {
  data: VocabLevelAnalysis;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const colors = LEVEL_COLORS[data.level];

  return (
    <div
      className={`rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden`}
    >
      {/* Level Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 sm:p-6 text-left hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {data.levelName}
            </h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {data.totalTopics} chủ đề
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${colors.text}`}>
              {data.progressPercent}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full ${colors.bar} transition-all duration-500`}
            style={{ width: `${data.progressPercent}%` }}
          />
        </div>

        {/* Stats */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {data.learnedVocab}/{data.totalVocab} từ đã học
        </p>
      </button>

      {/* Topics List */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-zinc-700">
          {data.topics.map((topic) => (
            <TopicRow key={topic.topicId} topic={topic} level={data.level} />
          ))}
        </div>
      )}
    </div>
  );
}

// Topic Row Component
function TopicRow({
  topic,
  level,
}: {
  topic: {
    topicId: number;
    topicName: string;
    topicGuid?: string;
    totalVocab: number;
    learnedVocab: number;
    currentLevel: number;
    maxLevel: number;
  };
  level: string;
}) {
  const colors = LEVEL_COLORS[level as keyof typeof LEVEL_COLORS];
  const levelColors =
    LEVEL_COLORS_BY_NUMBER[
      topic.currentLevel as keyof typeof LEVEL_COLORS_BY_NUMBER
    ] || LEVEL_COLORS_BY_NUMBER[1];
  const levelProgress = (topic.currentLevel / topic.maxLevel) * 100;

  return (
    <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-zinc-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
      <div className="flex items-center gap-3">
        {/* Left: Icon */}
        <div
          className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}
        >
          <BookMarked className={`w-5 h-5 ${colors.text}`} />
        </div>

        {/* Middle: Content */}
        <div className="flex-1 min-w-0">
          {/* Topic Name */}
          <div className="flex items-center gap-2 mb-2">
            <h5 className="text-sm font-medium text-gray-900 dark:text-white">
              {topic.topicName}
            </h5>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
            >
              {level === "Basic"
                ? "Cơ bản"
                : level === "Intermediate"
                ? "Trung cấp"
                : "Nâng cao"}
            </span>
          </div>

          {/* Progress Bar - Full Width */}
          <div className="flex items-center gap-2">
            {/* Progress Bar */}
            <div className="flex-1 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${levelColors.bar} transition-all duration-300`}
                style={{ width: `${levelProgress}%` }}
              />
            </div>

            {/* Level Text - Beside the progress bar */}
            <span
              className={`text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap`}
            >
              Level {topic.currentLevel}
            </span>
          </div>

          {/* Bottom Info */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {topic.learnedVocab}/{topic.totalVocab} từ đã học
            </p>
          </div>
        </div>

        {/* Right: Link - Vertically centered */}
        <Link
          href={topic.topicGuid ? `/vocabulary/${topic.topicGuid}` : "#"}
          className="flex-shrink-0 flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          Đi đến topic
        </Link>
      </div>
    </div>
  );
}

// Streak Card Component
function StreakCard({
  streak,
}: {
  streak: {
    current: number;
    longest: number;
    weeklyActivity?: { hasActivity: boolean }[];
    hasActivityToday?: boolean;
  };
}) {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Streak Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {streak.current} ngày liên tục
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Kỷ lục: {streak.longest} ngày · Tổng: {streak.current} ngày học
            </div>
          </div>
        </div>

        {/* Middle: Weekly Activity */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto">
          {weekDays.map((day, index) => {
            const activity = streak.weeklyActivity?.[index];
            const isActive = activity?.hasActivity;
            return (
              <div key={day} className="text-center flex-shrink-0">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    isActive
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-400"
                  }`}
                >
                  {day.charAt(0)}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1 hidden sm:block">
                  {day.substring(0, 3)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Button */}
        <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors text-sm sm:text-base whitespace-nowrap">
          {streak.hasActivityToday ? "Đã học hôm nay!" : "Học ngay"}
        </button>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  value,
  label,
  bgColor,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  bgColor: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 sm:p-6">
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${bgColor} flex items-center justify-center mb-3 sm:mb-4`}
      >
        {icon}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        {label}
      </div>
    </div>
  );
}
