"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { grammarService } from "@/app/services/grammarService";
import type { GrammarTopic } from "@/app/types";
import { ChevronLeft, BookOpen, Layers, Loader } from "lucide-react";
import { PageHeader } from "@/app/components";

interface GrammarGroup {
  id: number;
  title: string;
  description?: string;
  order: number;
}

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupGuid = params.groupId as string;

  const [group, setGroup] = useState<GrammarGroup | null>(null);
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (groupGuid) {
      loadGroupAndTopics();
    }
  }, [groupGuid]);

  const loadGroupAndTopics = async () => {
    try {
      setLoading(true);
      
      // Load group details using UUID
      const groupData = await grammarService.getGroupById(groupGuid);
      setGroup(groupData);

      // Load topics for this group using UUID
      const topicsData = await grammarService.getTopicsByGroup(groupGuid);
      setTopics(topicsData || []);
    } catch (error) {
      console.error("Error loading group details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercent = (topic: GrammarTopic) => {
    return topic.totalRules > 0
      ? Math.round((topic.learnedRules / topic.totalRules) * 100)
      : 0;
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 75) return "bg-green-500";
    if (percent >= 50) return "bg-blue-500";
    if (percent >= 25) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getProgressTextColor = (percent: number) => {
    if (percent >= 75) return "text-green-600 dark:text-green-400";
    if (percent >= 50) return "text-blue-600 dark:text-blue-400";
    if (percent >= 25) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <PageHeader />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Không tìm thấy nhóm ngữ pháp
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <PageHeader />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header with Back Button */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/grammar"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border-1 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Quay lại danh sách nhóm</span>
            <span className="sm:hidden">Quay lại</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Nhóm {group.order}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                {group.title}
              </h1>
              {group.description && (
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {group.description}
                </p>
              )}
            </div>
            <div className="bg-blue-100 dark:bg-blue-950/50 px-3 sm:px-4 py-2 rounded-lg self-start">
              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-semibold">
                {topics.length} chủ đề
              </p>
            </div>
          </div>
        </div>

        {/* Topics Grid (Layer 2) - Responsive */}
        {topics.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
              Chưa có chủ đề nào trong nhóm này
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
              Vui lòng quay lại sau
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {topics.map((topic) => {
              const progress = getProgressPercent(topic);
              const progressColor = getProgressColor(progress);
              const textColor = getProgressTextColor(progress);

              return (
                <Link
                  key={topic.id}
                  href={`/grammar/groups/${groupGuid}/topics/${topic.topicGuid || topic.id}`}
                  className="group flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-zinc-900 hover:shadow-lg dark:hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                >
                  {/* Image */}
                  {topic.imageUrl && (
                    <div className="w-full h-28 sm:h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                      <img
                        src={topic.imageUrl}
                        alt={topic.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="inline-flex items-center gap-2 w-fit flex-wrap">
                    {topic.category && (
                      <span className="text-xs font-semibold px-2 sm:px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                        {topic.category}
                      </span>
                    )}
                    {topic.level && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">
                        {topic.level}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {topic.title}
                  </h3>

                  {/* Description */}
                  {topic.description && (
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {topic.description}
                    </p>
                  )}

                  {/* Progress */}
                  <div className="flex items-center justify-between text-xs sm:text-sm mt-1 sm:mt-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {topic.learnedRules} / {topic.totalRules} quy tắc
                    </span>
                    <span className={`font-semibold ${textColor}`}>
                      {progress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 sm:h-2 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
