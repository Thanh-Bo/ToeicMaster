import { Question, Answer } from "@/app/types";

interface AnswerOptionProps {
  q: Question;
  ans: Answer;
  isSelected: boolean;
  onSelect: () => void;
}

export default function AnswerOption({ q, ans, isSelected, onSelect }: AnswerOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 border rounded-xl transition-all flex items-center group
        ${isSelected
          ? "bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-200"
          : "border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-gray-700"
        }`}
    >
      <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold mr-3 border
         ${isSelected ? "bg-white text-blue-600 border-transparent" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
        {ans.label}
      </span>
      <span className="text-sm font-medium">{ans.content}</span>
    </button>
  );
}
