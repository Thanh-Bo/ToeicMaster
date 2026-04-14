"use client";

import { GrammarTopic } from "@/app/types";
import { GrammarTopicCard } from "./GrammarTopicCard";
import { Loader } from "lucide-react";

interface GrammarTopicGridProps {
  topics: GrammarTopic[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

export function GrammarTopicGrid({
  topics,
  isLoading = false,
  isEmpty = false,
}: GrammarTopicGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 p-6 rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 animate-pulse"
          >
            <div className="w-full h-32 rounded-lg bg-gray-200 dark:bg-zinc-700" />
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-zinc-700 rounded" />
            <div className="h-2 w-full bg-gray-200 dark:bg-zinc-700 rounded-full" />
            <div className="h-10 w-full bg-gray-200 dark:bg-zinc-700 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty || topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <Loader className="w-8 h-8 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Không tìm thấy chủ đề ngữ pháp
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Vui lòng quay lại sau hoặc liên hệ với chúng tôi
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic) => (
        <GrammarTopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
}
