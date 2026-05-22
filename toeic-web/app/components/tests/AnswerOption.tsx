import { Question, Answer } from "@/app/types";

interface AnswerOptionProps {
  q: Question;
  ans: Answer;
  isSelected: boolean;
  onSelect: () => void;
}

export default function AnswerOption({
  q,
  ans,
  isSelected,
  onSelect,
}: AnswerOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-3 py-2 sm:px-4 sm:py-3 border rounded-xl transition-all flex items-center group hover:scale-[1.005] active:scale-[0.995]
        ${
          isSelected
            ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-500 dark:border-blue-400 font-semibold shadow-xs"
            : "hover:bg-gray-50/85 dark:hover:bg-zinc-800/60 border-gray-250/60 dark:border-zinc-800/50 text-zinc-700 dark:text-zinc-350 hover:border-blue-500/20 dark:hover:border-blue-400/20"
        }`}
    >
      <span
        className={`shrink-0 w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold mr-2.5 sm:mr-3 text-xs sm:text-sm border transition-colors
         ${
           isSelected
             ? "bg-blue-600 dark:bg-blue-500 text-white border-transparent shadow-sm shadow-blue-500/10"
             : "bg-gray-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 border-gray-200 dark:border-zinc-800"
         }`}
      >
        {ans.label}
      </span>
      <span className={`text-xs sm:text-sm leading-snug font-medium ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-zinc-700 dark:text-zinc-300"}`}>
        {ans.content.replace(/^\([A-D]\)\s*/i, "").trim()}
      </span>
    </button>
  );
}
