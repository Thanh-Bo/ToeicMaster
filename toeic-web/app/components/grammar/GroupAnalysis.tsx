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

  // if (loading) {
  //   return (
  //     <div className="flex justify-center py-12">
  //       <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 dark:border-zinc-700 border-t-blue-500"></div>
  //     </div>
  //   );
  // }

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
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Phân tích theo nhóm
      </h3>

      {groups.map((group) => {
        const isExpanded = expandedGroups.has(group.groupId);
        // Use accuracyPercent for progress bar color
        const progressColor =
          group.accuracyPercent >= 75
            ? "bg-green-500"
            : group.accuracyPercent >= 50
            ? "bg-blue-500"
            : group.accuracyPercent >= 25
            ? "bg-yellow-500"
            : "bg-gray-400";

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
            className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden"
          >
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.groupId)}
              className="w-full flex items-center gap-4 p-4 sm:p-6 text-left hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {group.groupTitle}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {group.totalTopics} chủ đề
                  </span>
                </div>

                {/* Progress Bar - based on accuracy */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${progressColor}`}
                      style={{ width: `${group.accuracyPercent}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem]">
                    {group.accuracyPercent}%
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    {group.learnedLessons}/{group.totalLessons} bài học
                  </span>

                  <span>
                    Đúng {groupCorrectAnswers}/{group.questionsAnswered} câu đã
                    làm
                  </span>
                </div>
              </div>
            </button>

            {/* Topics List */}
            {isExpanded && (
              <div className="border-t border-gray-200 dark:border-zinc-700">
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

// Topic Row Component
function TopicRow({ topic, groupId }: { topic: any; groupId: number }) {
  // Use accuracyPercent for progress bar color
  const progressColor =
    topic.accuracyPercent >= 75
      ? "bg-green-500"
      : topic.accuracyPercent >= 50
      ? "bg-blue-500"
      : topic.accuracyPercent >= 25
      ? "bg-yellow-500"
      : "bg-gray-400";

  // Calculate correct answers for topic
  const topicCorrectAnswers =
    topic.questionsAnswered > 0
      ? Math.round((topic.questionsAnswered * topic.accuracyPercent) / 100)
      : 0;

  const statusIcon = <BookOpen className="size-8 text-gray-400" />;

  return (
    <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-zinc-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
      <div className="flex items-center justify-center gap-4">
        {/* Status Icon */}
        <div className="flex-shrink-0 mt-1 ">{statusIcon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900 dark:text-white">
              {topic.topicTitle}
            </span>
            {topic.category && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600">
                {topic.category}
              </span>
            )}
          </div>

          {/* Progress Bar - based on accuracy */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
              <div
                className={`h-full rounded-full ${progressColor}`}
                style={{ width: `${topic.accuracyPercent}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 min-w-[2.5rem]">
              {topic.accuracyPercent}%
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>
              {topic.learnedLessons}/{topic.totalLessons} bài
            </span>

            <span>
              Đúng {topicCorrectAnswers}/{topic.questionsAnswered} câu đã làm
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/grammar/groups/${groupId}/topics/${topic.topicId}`}
          className="flex-shrink-0 flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          Đi đến topic
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
