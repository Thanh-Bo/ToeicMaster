"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { grammarService } from "@/app/services/grammarService";
import { GrammarTopicCard } from "@/app/components/grammar/GrammarTopicCard";
import { GrammarProgressTab } from "@/app/components/grammar/GrammarProgressTab";
import { GroupAnalysis } from "@/app/components/grammar/GroupAnalysis";
import type { GrammarTopic } from "@/app/types";
import {
  Book,
  Flame,
  Target,
  TrendingUp,
  ArrowRight,
  Layers,
  Zap,
  Code,
  Bookmark,
  BarChart2,
  BookOpen,
  History,
  ChevronDown,
  ChevronRight,
  Puzzle,
  GitBranch,
  Activity,
  Loader,
  FileText,
  ALargeSmall,
  Library,
} from "lucide-react";
import { PageHeader } from "../components";

interface GrammarGroup {
  id: number;
  groupGuid: string; // UUID for public URLs
  title: string;
  description: string;
  order: number;
  totalTopics: number;
}

export default function GrammarHub() {
  const [groups, setGroups] = useState<GrammarGroup[]>([]);
  const [groupTopics, setGroupTopics] = useState<
    Record<string, GrammarTopic[]>
  >({});
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"practice" | "progress">(
    "practice",
  );
  const [progressPeriod, setProgressPeriod] = useState("30d");

  useEffect(() => {
    loadGroupsAndTopics();
  }, []);

  const loadGroupsAndTopics = async () => {
    try {
      setLoading(true);
      const data = await grammarService.getAllGroups();
      setGroups(data || []);

      // Load topics for each group and expand all by default
      if (data && data.length > 0) {
        const topicsMap: Record<string, GrammarTopic[]> = {};
        const expandedSet = new Set<string>();

        await Promise.all(
          data.map(async (group) => {
            expandedSet.add(group.groupGuid);
            try {
              const topics = await grammarService.getTopicsByGroup(group.groupGuid);
              // Add groupGuid to each topic for navigation
              const topicsWithGroupGuid = topics?.map(topic => ({
                ...topic,
                groupGuid: group.groupGuid
              })) || [];
              topicsMap[group.groupGuid] = topicsWithGroupGuid;
            } catch (error) {
              console.error(
                `Error loading topics for group ${group.groupGuid}:`,
                error,
              );
              topicsMap[group.groupGuid] = [];
            }
          }),
        );

        setGroupTopics(topicsMap);
        setExpandedGroups(expandedSet);
      }
    } catch (error) {
      console.error("Error loading grammar groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (groupGuid: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupGuid)) {
        newSet.delete(groupGuid);
      } else {
        newSet.add(groupGuid);
      }
      return newSet;
    });
  };

  const getGroupIcon = (order: number) => {
    switch (order) {
      case 1:
        return <Puzzle className="w-8 h-8 text-blue-600 dark:text-blue-400" />;
      case 2:
        return (
          <Activity className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
        );
      case 3:
        return (
          <GitBranch className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        );
      default:
        return <Book className="w-8 h-8 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getGroupColor = (order: number) => {
    switch (order) {
      case 1:
        return "border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600";
      case 2:
        return "border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600";
      case 3:
        return "border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600";
      default:
        return "border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <PageHeader
        navLinks={[
          { href: "/grammar", label: "Grammar", icon: Library },
          { href: "/vocabulary", label: "Vocab", icon: ALargeSmall },
          { href: "/practice", label: "Practice", icon: FileText },
        ]}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-gray-200 dark:border-zinc-700">
          <button
            onClick={() => setActiveTab("practice")}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium border-b-2 flex items-center gap-2 transition text-sm sm:text-base ${
              activeTab === "practice"
                ? "text-gray-900 dark:text-white border-gray-900 dark:border-white"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            Học
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium border-b-2 flex items-center gap-2 transition text-sm sm:text-base ${
              activeTab === "progress"
                ? "text-gray-900 dark:text-white border-gray-900 dark:border-white"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Tiến độ
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "progress" ? (
          <div className="space-y-6">
            {/* Time Period Filter */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 w-full sm:w-auto">
                Thời gian:
              </span>
              {[
                { value: "7d", label: "7 ngày" },
                { value: "30d", label: "30 ngày" },
                { value: "90d", label: "90 ngày" },
                { value: "1y", label: "1 năm" },
                { value: "all", label: "Tất cả" },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setProgressPeriod(period.value)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    progressPeriod === period.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            {/* Progress Stats */}
            <GrammarProgressTab period={progressPeriod} />

            {/* Group Analysis */}
            <GroupAnalysis />
          </div>
        ) : (
          /* Practice Tab - Grammar Groups */
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Nhóm ngữ pháp chính
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
              Chọn nhóm để bắt đầu học quy tắc ngữ pháp từng bước
            </p>

            {loading ? (
              <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
                <div className="text-center">
                  <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Đang tải dữ liệu...
                  </p>
                </div>
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Chưa có nhóm ngữ pháp nào. Vui lòng quay lại sau.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {groups.map((group) => {
                  const isExpanded = expandedGroups.has(group.groupGuid);
                  const topics = groupTopics[group.groupGuid] || [];

                  return (
                    <div
                      key={group.groupGuid}
                      className={`rounded-xl border-1 bg-white dark:bg-zinc-900 overflow-hidden ${getGroupColor(
                        group.order,
                      )}`}
                    >
                      {/* Group Header - Clickable to toggle */}
                      <button
                        onClick={() => toggleGroup(group.groupGuid)}
                        className="w-full flex items-center gap-4 p-4 sm:p-6 text-left hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        {/* Icon */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                          {getGroupIcon(group.order)}
                        </div>

                        {/* Title & Description */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {group.title}
                            </h3>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">
                              {group.totalTopics} chủ đề
                            </span>
                          </div>
                          {group.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                              {group.description}
                            </p>
                          )}
                        </div>

                        {/* Toggle Icon */}
                        <div className="flex-shrink-0">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {/* Topics Grid - Shows when expanded */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 dark:border-zinc-700 p-4 sm:p-6">
                          {topics.length === 0 ? (
                            <div className="text-center py-8">
                              <BookOpen className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Chưa có chủ đề nào trong nhóm này
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
                              {topics.map((topic) => (
                                <GrammarTopicCard
                                  key={topic.topicGuid || topic.id}
                                  topic={topic}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
