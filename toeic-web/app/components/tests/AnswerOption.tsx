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
      className={`w-full text-left px-4 py-3 border rounded-xl transition-all flex items-center group
        ${
          isSelected
            ? "bg-blue-600 text-white border-zinc-700 "
            : " hover:bg-gray-200 dark:hover:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300"
        }`}
    >
      <span
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold mr-3 border
         ${
           isSelected
             ? "bg-white text-zinc-600 border-transparent"
             : "bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-600"
         }`}
      >
        {ans.label}
      </span>
      <span className="text-sm">
        {ans.content.replace(/^\([A-D]\)\s*/i, "").trim()}
      </span>
    </button>
  );
}
