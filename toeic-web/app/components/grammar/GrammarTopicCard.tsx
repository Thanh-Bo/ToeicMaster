"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap } from "lucide-react";
import { GrammarTopic } from "@/app/types";

interface GrammarTopicCardProps {
  topic: GrammarTopic;
  groupId?: number;
  href?: string;
}

export function GrammarTopicCard({ topic, groupId, href }: GrammarTopicCardProps) {
  const defaultHref = topic.groupGuid && topic.topicGuid
    ? `/grammar/groups/${topic.groupGuid}/topics/${topic.topicGuid}`
    : topic.groupGuid
    ? `/grammar/groups/${topic.groupGuid}/topics/${topic.id}`
    : `/grammar/topics/${topic.id}`;
  const finalHref = href || defaultHref;
  const router = useRouter();
  const progressPercent =
    topic.totalRules > 0 ? Math.round((topic.learnedRules / topic.totalRules) * 100) : 0;

  const handleClick = () => {
    router.push(finalHref);
  };

  return (
    <div
      onClick={handleClick}
      className="group flex flex-col gap-4 p-6 rounded-xl border-1 border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-zinc-900 hover:shadow-lg dark:hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full "
    >
      {/* Image */}
      {topic.imageUrl && (
        <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
          <img
            src={topic.imageUrl}
            alt={topic.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      

      {/* Category Badge */}
      <div className="inline-flex items-center gap-2 w-fit">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
          {topic.category}
        </span>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">
          {topic.level}
        </span>
      </div>

      {/* Title - fixed height for alignment */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 min-h-[3.5rem]">
        {topic.title}
      </h3>

      {/* Stats & Progress */}
      <div className="flex flex-col gap-3">
        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {topic.learnedRules} / {topic.totalRules} quy tắc
          </span>
          <span className={`text-xs font-semibold ${
            progressPercent >= 75
              ? "text-green-600 dark:text-green-400"
              : progressPercent >= 50
              ? "text-blue-600 dark:text-blue-400"
              : progressPercent >= 25
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-gray-600 dark:text-gray-400"
          }`}>
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              progressPercent >= 75
                ? "bg-green-500"
                : progressPercent >= 50
                ? "bg-blue-500"
                : progressPercent >= 25
                ? "bg-yellow-500"
                : "bg-gray-400"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* CTA Button */}
      <button className="w-full px-4 py-2.5 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all duration-200 hover:shadow-md">
        {topic.canReviewNow ? "Ôn tập ngay" : "Học quy tắc"}
      </button>
      
    </div>
  );
}
