"use client";

import { useState, useEffect } from "react";
import { grammarService } from "@/app/services/grammarService";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RotateCcw,

} from "lucide-react";
import Link from "next/link";

export function GroupAnalysis() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<any[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

  useEffect(() => {
    console.log("GroupAnalysis - user:", user);
    if (user?.id) {
      loadGroupProgress();
    } else {
      console.log("No user ID, skipping load");
      setLoading(false);
    }
  }, [user?.id]);

  const loadGroupProgress = async () => {
    try {
      setLoading(true);
      console.log("Loading group progress for user:", user?.id);
      const data = await grammarService.getGroupProgress(user!.id);
      console.log("Group progress data:", data);
      setGroups(data || []);
      // Expand first group by default
      if (data?.length > 0) {
        setExpandedGroups(new Set([data[0].groupId]));
      }
    } catch (error) {
      console.error("Error loading group progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (groupId: number) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  if (!user) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Phân tích theo nhóm
        </h3>
        <div className="text-center py-12 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Vui lòng đăng nhập để xem tiến độ
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 dark:border-zinc-800 border-t-blue-500"></div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Phân tích theo nhóm
        </h3>
        <div className="text-center py-12 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Chưa có dữ liệu phân tích
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Bắt đầu học để xem tiến độ của bạn
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">
        Phân tích theo nhóm
      </h3>

      {groups.map((group) => {
        const isExpanded = expandedGroups.has(group.groupId);
        // Use accuracyPercent for progress bar color with standard Tailwind classes
        const progressColor =
          group.accuracyPercent >= 75
            ? "bg-emerald-500"
            : group.accuracyPercent >= 50
            ? "bg-sky-500"
            : group.accuracyPercent >= 25
            ? "bg-amber-500"
            : "bg-zinc-400 dark:bg-zinc-600";

        // Calculate correct answers for group
        const groupCorrectAnswers =
          group.questionsAnswered > 0
            ? Math.round(
                (group.questionsAnswered * group.accuracyPercent) / 100,
              )
            : 0;

        return (
          <div
            key={group.groupId}
            className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md overflow-hidden hover:shadow-md hover:border-zinc-300/60 dark:hover:border-zinc-700/50 hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.groupId)}
              className="w-full flex items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 text-left hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 transition-colors group"
            >
              <div className="flex-shrink-0 mt-1 sm:mt-0 w-8 h-8 rounded-full bg-zinc-100/80 dark:bg-zinc-800/50 border border-zinc-200/30 dark:border-zinc-700/30 flex items-center justify-center transition-all duration-300 group-hover:bg-white dark:group-hover:bg-zinc-700">
                <ChevronRight className={`w-4 h-4 text-zinc-500 dark:text-zinc-400 transition-transform duration-300 ${isExpanded ? "rotate-90" : "rotate-0"}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                  <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white truncate">
                    {group.groupTitle}
                  </h4>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold flex-shrink-0">
                    {group.totalTopics} chủ đề
                  </span>
                </div>

                {/* Progress Bar - based on accuracy */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200/20 dark:border-zinc-800/20">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${group.accuracyPercent}%` }}
                      />
                  </div>
                  <span className="text-xs sm:text-sm font-bold font-mono text-zinc-700 dark:text-zinc-300 min-w-[2.5rem] sm:min-w-[3rem]">
                    {group.accuracyPercent}%
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                    {group.learnedLessons}/{group.totalLessons} bài học
                  </span>

                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                    Đúng {groupCorrectAnswers}/{group.questionsAnswered} câu đã làm
                  </span>
                </div>
              </div>
            </button>

            {/* Topics List */}
            {isExpanded && (
              <div className="border-t border-zinc-200/50 dark:border-zinc-800/40">
                {group.topics?.map((topic: any) => (
                  <TopicRow key={topic.topicId} topic={topic} groupId={group.groupId} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Color palettes for Notion-style letter avatars
const colorPalettes = [
  {
    bg: "bg-indigo-50/70 dark:bg-indigo-950/20",
    border: "border-indigo-100/50 dark:border-indigo-900/30",
    text: "text-indigo-600 dark:text-indigo-400",
  },
  {
    bg: "bg-emerald-50/70 dark:bg-emerald-950/20",
    border: "border-emerald-100/50 dark:border-emerald-900/30",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  {
    bg: "bg-rose-50/70 dark:bg-rose-950/20",
    border: "border-rose-100/50 dark:border-rose-900/30",
    text: "text-rose-600 dark:text-rose-400",
  },
  {
    bg: "bg-amber-50/70 dark:bg-amber-950/20",
    border: "border-amber-100/50 dark:border-amber-900/30",
    text: "text-amber-600 dark:text-amber-400",
  },
  {
    bg: "bg-violet-50/70 dark:bg-violet-950/20",
    border: "border-violet-100/50 dark:border-violet-900/30",
    text: "text-violet-600 dark:text-violet-400",
  },
  {
    bg: "bg-sky-50/70 dark:bg-sky-950/20",
    border: "border-sky-100/50 dark:border-sky-900/30",
    text: "text-sky-600 dark:text-sky-400",
  },
  {
    bg: "bg-teal-50/70 dark:bg-teal-950/20",
    border: "border-teal-100/50 dark:border-teal-900/30",
    text: "text-teal-600 dark:text-teal-400",
  },
  {
    bg: "bg-fuchsia-50/70 dark:bg-fuchsia-950/20",
    border: "border-fuchsia-100/50 dark:border-fuchsia-900/30",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
  },
];

const getTopicAbbreviation = (title: string): string => {
  const match = title.match(/\(([^)]+)\)/);
  const textToUse = match ? match[1] : title;
  
  const words = textToUse
    .replace(/&/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !["of", "and", "or", "the", "a", "an"].includes(w.toLowerCase()));
    
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    return words[0].substring(0, Math.min(words[0].length, 2)).toUpperCase();
  }
  return "GR";
};

// Topic Row Component
function TopicRow({ topic, groupId }: { topic: any; groupId: number }) {
  // Use accuracyPercent for progress bar color with standard Tailwind classes
  const progressColor =
    topic.accuracyPercent >= 75
      ? "bg-emerald-500"
      : topic.accuracyPercent >= 50
      ? "bg-sky-500"
      : topic.accuracyPercent >= 25
      ? "bg-amber-500"
      : "bg-zinc-400 dark:bg-zinc-600";

  // Calculate correct answers for topic
  const topicCorrectAnswers =
    topic.questionsAnswered > 0
      ? Math.round((topic.questionsAnswered * topic.accuracyPercent) / 100)
      : 0;

  const abbreviation = getTopicAbbreviation(topic.topicTitle);
  const palette = colorPalettes[topic.topicId % colorPalettes.length];

  const statusIcon = (
    <div className={`w-10 h-10 rounded-xl ${palette.bg} ${palette.text} flex items-center justify-center border ${palette.border} font-bold font-mono text-sm tracking-wider shadow-xs`}>
      {abbreviation}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 border-t border-dashed border-zinc-200/45 dark:border-zinc-800/35 first:border-t-0 hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 transition-all duration-200 group/row">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Status Icon */}
        <div className="flex-shrink-0 hidden sm:block">{statusIcon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 mb-2">
            <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
              {topic.topicTitle}
            </span>
            {topic.category && (
              <span className="text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/30 w-fit">
                {topic.category}
              </span>
            )}
          </div>

          {/* Progress Bar - based on accuracy */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/60 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${topic.accuracyPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold font-mono text-zinc-500 dark:text-zinc-400 min-w-[2.5rem]">
              {topic.accuracyPercent}%
            </span>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-zinc-400" />
              {topic.learnedLessons}/{topic.totalLessons} bài
            </span>

            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-zinc-400" />
              Đúng {topicCorrectAnswers}/{topic.questionsAnswered} câu đã làm
            </span>
          </div>
        </div>

        {/* Action Link */}
        <Link
          href={`/grammar/groups/${groupId}/topics/${topic.topicId}`}
          className="flex-shrink-0 inline-flex items-center justify-center gap-1 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 w-full sm:w-auto mt-2 sm:mt-0 group/link"
        >
          <span>Đi đến topic</span>
          <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/row:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

// Helper function
function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
