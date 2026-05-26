"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap, BookOpen } from "lucide-react";
import { GrammarTopic } from "@/app/types";

interface GrammarTopicCardProps {
  topic: GrammarTopic;
  groupId?: number;
  href?: string;
}

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

  const abbreviation = getTopicAbbreviation(topic.title);
  const palette = colorPalettes[topic.id % colorPalettes.length];

  return (
    <div
      onClick={handleClick}
      className="group flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-zinc-800/80 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-zinc-900 hover:shadow-lg dark:hover:shadow-blue-600/10 hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full"
    >
     

      {/* Category Badge */}
      <div className="inline-flex items-center gap-2 w-fit flex-wrap">
        <span className="text-xs font-semibold px-2 sm:px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/20 dark:border-blue-500/10">
          {topic.category}
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
          {topic.level}
        </span>
      </div>

      {/* Title - fixed height for alignment */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
        {topic.title}
      </h3>

      {/* Stats & Progress */}
      <div className="flex flex-col gap-2 sm:gap-3 mt-auto">
        {/* Stats */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400 font-medium">
            {topic.learnedRules} / {topic.totalRules} quy tắc
          </span>
          <span className={`text-xs font-bold font-mono ${
            progressPercent >= 75
              ? "text-emerald-600 dark:text-emerald-400"
              : progressPercent >= 50
              ? "text-sky-600 dark:text-sky-400"
              : progressPercent >= 25
              ? "text-amber-600 dark:text-amber-400"
              : "text-gray-500 dark:text-gray-400"
          }`}>
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              progressPercent >= 75
                ? "bg-emerald-500"
                : progressPercent >= 50
                ? "bg-sky-500"
                : progressPercent >= 25
                ? "bg-amber-500"
                : "bg-zinc-400 dark:bg-zinc-600"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* CTA Button */}
      <button className="group/btn w-full px-3 sm:px-4 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 hover:shadow-md text-xs sm:text-sm flex items-center justify-center gap-1.5 mt-2">
        <span>{topic.canReviewNow ? "Ôn tập ngay" : "Học quy tắc"}</span>
        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
      
    </div>
  );
}
