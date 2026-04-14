"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap } from "lucide-react";
import { GrammarTopic } from "@/app/types";

interface GrammarTopicCardProps {
  topic: GrammarTopic;
  href?: string;
}

export function GrammarTopicCard({ topic, href = `/grammar/${topic.id}` }: GrammarTopicCardProps) {
  const router = useRouter();
  const progressPercent =
    topic.totalRules > 0 ? Math.round((topic.learnedRules / topic.totalRules) * 100) : 0;

  const handleClick = () => {
    router.push(href);
  };

  return (
    <div
      onClick={handleClick}
      className="group flex flex-col gap-4 p-6 rounded-xl border-2 border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-zinc-900 hover:shadow-lg dark:hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
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

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
        {topic.title}
      </h3>

      {/* Description */}
      {topic.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {topic.description}
        </p>
      )}

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

      {/* Next Review / Action */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {topic.canReviewNow ? (
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
              <Zap className="w-3 h-3" />
              {topic.timeUntilReady}
            </div>
          ) : (
            <span>Ôn tập sau {topic.timeUntilReady}</span>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform duration-200" />
      </div>

      {/* CTA Button */}
      <button className="w-full mt-2 px-4 py-2.5 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all duration-200 hover:shadow-md">
        {topic.canReviewNow ? "Ôn tập ngay" : "Học quy tắc"}
      </button>
    </div>
  );
}
