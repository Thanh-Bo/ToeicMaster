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
  Sparkles,
  Lock,
} from "lucide-react";
import Link from "next/link";
import type { VocabLevelAnalysis } from "@/app/types";
import { ProFeatureModal } from "../grammar/ProFeatureModal";

interface VocabularyProgressTabProps {
  period?: string;
}

const PERIODS = [
  { value: "week", label: "7 ngày", requiresPro: true },
  { value: "month", label: "30 ngày", requiresPro: true },
  { value: "quarter", label: "90 ngày", requiresPro: true },
  { value: "year", label: "1 năm", requiresPro: true },
  { value: "all", label: "Tất cả", requiresPro: false },
];

const LEVEL_COLORS = {
  Basic: {
    primary: "blue",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    border: "border-blue-200/50 dark:border-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    bar: "bg-blue-500",
  },
  Intermediate: {
    primary: "amber",
    bg: "bg-amber-50/50 dark:bg-amber-950/20",
    border: "border-amber-200/50 dark:border-amber-900/30",
    text: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
  },
  Advanced: {
    primary: "purple",
    bg: "bg-purple-50/50 dark:bg-purple-950/20",
    border: "border-purple-200/50 dark:border-purple-900/30",
    text: "text-purple-600 dark:text-purple-400",
    bar: "bg-purple-500",
  },
};

const LEVEL_COLORS_BY_NUMBER = {
  1: {
    bar: "bg-teal-500",
    text: "text-teal-600 dark:text-teal-400",
  },
  2: {
    bar: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
  },
  3: {
    bar: "bg-indigo-500",
    text: "text-indigo-600 dark:text-indigo-400",
  },
  4: {
    bar: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400",
  },
  5: {
    bar: "bg-yellow-500",
    text: "text-yellow-600 dark:text-yellow-400",
  },
};

export function VocabularyProgressTab({
  period: initialPeriod,
}: VocabularyProgressTabProps) {
  const { user } = useAuth();
  const isPro = user?.isPremium === true;
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(
    initialPeriod || (isPro ? "month" : "all"),
  );
  const [showProModal, setShowProModal] = useState(false);
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

  // Force free users to "all" period
  useEffect(() => {
    if (!isPro && selectedPeriod !== "all") {
      setSelectedPeriod("all");
    }
  }, [isPro, selectedPeriod]);

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
      <div className="text-center py-12 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-zinc-800/80 p-6 max-w-sm mx-auto">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400 font-bold text-sm">
          Vui lòng đăng nhập để xem tiến độ
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <Loader className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">
          Đang tải dữ liệu tiến trình...
        </p>
      </div>
    );
  }

  if (!stats || !levelAnalysis) {
    return (
      <div className="text-center py-12 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-zinc-800/80 p-6 max-w-sm mx-auto">
        <p className="text-red-500 font-bold text-sm">
          Không thể tải dữ liệu. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProFeatureModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
      />

      {/* Period Filter Switcher - iOS Pill Style */}
      <div className="inline-flex gap-1 p-1 bg-gray-100/80 dark:bg-zinc-900/60 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-zinc-800/50">
        {PERIODS.map((period) => {
          const isLocked = period.requiresPro && !isPro;
          const isActive = selectedPeriod === period.value;

          return (
            <button
              key={period.value}
              onClick={() => {
                if (isLocked) {
                  setShowProModal(true);
                  return;
                }
                setSelectedPeriod(period.value);
              }}
              className={`group inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-zinc-850 text-blue-600 dark:text-blue-400 shadow-xs scale-[1.02]"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <span>{period.label}</span>
              {isLocked && (
                <span className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 group-hover:ml-1.5 transition-all duration-200 overflow-hidden inline-flex items-center">
                  <Lock className="w-3 h-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Streak Card */}
      <StreakCard streak={stats.streak} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          icon={
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          }
          value={stats.totalTopicsLearned}
          label="Chủ đề đã học"
          bgColor="bg-blue-50/50 dark:bg-blue-950/20"
          borderColor="border-blue-200/40 dark:border-blue-800/30"
        />
        <StatCard
          icon={
            <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
          }
          value={stats.totalVocabLearned}
          label="Từ đã học"
          bgColor="bg-green-50/50 dark:bg-green-950/20"
          borderColor="border-green-200/40 dark:border-green-800/30"
        />
        <StatCard
          icon={
            <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          }
          value={stats.reviewDue}
          label="Cần ôn tập"
          bgColor="bg-orange-50/50 dark:bg-orange-950/20"
          borderColor="border-orange-200/40 dark:border-orange-800/30"
        />
        <StatCard
          icon={
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          }
          value={`${stats.totalTimeMinutes}m`}
          label="Thời gian học"
          bgColor="bg-purple-50/50 dark:bg-purple-950/20"
          borderColor="border-purple-200/40 dark:border-purple-800/30"
        />
        <StatCard
          icon={
            <TrendingUp className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          }
          value={stats.totalQuestionsAnswered}
          label="Câu đã làm"
          bgColor="bg-pink-50/50 dark:bg-pink-950/20"
          borderColor="border-pink-200/40 dark:border-pink-800/30"
        />
        <StatCard
          icon={<Target className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
          value={`${stats.accuracy}%`}
          label="Độ chính xác"
          bgColor="bg-teal-50/50 dark:bg-teal-950/20"
          borderColor="border-teal-200/40 dark:border-teal-800/30"
        />
      </div>

      {/* Level Analysis Section */}
      <div className="mt-8">
        <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white mb-4">
          Phân tích tiến độ theo Cấp độ
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

// Level Card Component (Accordion Style)
function LevelCard({
  data,
  isExpanded,
  onToggle,
}: {
  data: VocabLevelAnalysis;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const colors =
    LEVEL_COLORS[data.level as keyof typeof LEVEL_COLORS] || LEVEL_COLORS.Basic;

  return (
    <div className="rounded-2xl border border-gray-200/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md overflow-hidden transition-all shadow-xs">
      {/* Level Header */}
      <button
        onClick={onToggle}
        className="w-full p-5 text-left hover:bg-gray-50/50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer flex flex-col gap-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )}
            </div>
            <h4 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
              {data.levelName}
            </h4>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
              ({data.totalTopics} chủ đề)
            </span>
          </div>
          <span className={`text-xs sm:text-sm font-black ${colors.text}`}>
            {data.progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
            style={{ width: `${data.progressPercent}%` }}
          />
        </div>

        {/* Stats */}
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wide">
          Đã học:{" "}
          <span className="text-gray-900 dark:text-white font-black">
            {data.learnedVocab}
          </span>{" "}
          / {data.totalVocab} từ
        </p>
      </button>

      {/* Topics List */}
      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-zinc-800/80 bg-gray-50/10 dark:bg-zinc-900/20">
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
  const colors =
    LEVEL_COLORS[level as keyof typeof LEVEL_COLORS] || LEVEL_COLORS.Basic;
  const levelColors =
    LEVEL_COLORS_BY_NUMBER[
      topic.currentLevel as keyof typeof LEVEL_COLORS_BY_NUMBER
    ] || LEVEL_COLORS_BY_NUMBER[1];
  const levelProgress = (topic.currentLevel / topic.maxLevel) * 100;

  return (
    <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-zinc-800/80 last:border-b-0 hover:bg-gray-50/30 dark:hover:bg-zinc-800/30 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Left: Icon & Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0`}
          >
            <BookMarked className={`w-4.5 h-4.5 ${colors.text}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h5 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                {topic.topicName}
              </h5>
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}
              >
                {level === "Basic"
                  ? "Cơ bản"
                  : level === "Intermediate"
                  ? "Trung cấp"
                  : "Nâng cao"}
              </span>
            </div>

            {/* Progress and Numbers */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 flex-1 min-w-[100px] max-w-xs">
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${levelColors.bar} transition-all duration-300`}
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  Giai đoạn {topic.currentLevel}/5
                </span>
              </div>

              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
                Đã thuộc:{" "}
                <span className="text-gray-700 dark:text-gray-300 font-extrabold">
                  {topic.learnedVocab}
                </span>
                /{topic.totalVocab} từ
              </span>
            </div>
          </div>
        </div>

        {/* Right: Button Link */}
        <Link
          href={topic.topicGuid ? `/vocabulary/${topic.topicGuid}` : "#"}
          className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-[1.02] active:scale-98 text-center cursor-pointer flex items-center justify-center gap-1"
        >
          <span>Học ngay</span>
          <ChevronRight size={14} />
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
  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <div className="rounded-2xl border border-gray-200/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Streak Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/30 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-orange-500/10 rounded-full animate-ping"></div>
            <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400 relative z-10" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>{streak.current} ngày liên tục</span>
            </div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
              Kỷ lục: {streak.longest} ngày • Hoạt động đều đặn để nhớ lâu hơn
            </div>
          </div>
        </div>

        {/* Middle: Weekly Activity */}
        <div className="flex items-center gap-1.5 sm:gap-2 justify-center lg:justify-start">
          {weekDays.map((day, index) => {
            const activity = streak.weeklyActivity?.[index];
            const isActive = activity?.hasActivity;
            return (
              <div key={day} className="text-center flex-shrink-0">
                <div
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                    isActive
                      ? "bg-green-500 text-white border-green-500 shadow-xs shadow-green-500/20"
                      : "bg-gray-100/50 dark:bg-zinc-800/40 text-gray-400 dark:text-zinc-600 border-transparent"
                  }`}
                >
                  {day.charAt(0)}
                </div>
                <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 select-none">
                  {day}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: CTA Button */}
        <button
          onClick={() => {
            if (!streak.hasActivityToday) {
              window.location.reload();
            }
          }}
          className={`px-5 py-2.5 rounded-xl font-black transition-all duration-300 text-xs sm:text-sm shadow-xs ${
            streak.hasActivityToday
              ? "bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-800/30 cursor-default"
              : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] active:scale-98 cursor-pointer"
          }`}
        >
          {streak.hasActivityToday ? "Đã học hôm nay! 🎉" : "Học ngay thôi"}
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
  borderColor,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md p-4 sm:p-5 flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 shadow-xs">
      <div
        className={`w-9 h-9 rounded-xl ${bgColor} ${borderColor} border flex items-center justify-center mb-3`}
      >
        {icon}
      </div>
      <div>
        <div className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-0.5 select-none tracking-tight">
          {value}
        </div>
        <div className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500">
          {label}
        </div>
      </div>
    </div>
  );
}
