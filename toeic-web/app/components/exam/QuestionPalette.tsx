"use client";

interface QuestionButton {
  id: number;
  questionNo: number;
  isAnswered?: boolean;
  isCorrect?: boolean | null;
  isSkipped?: boolean;
}

interface PartGroup {
  partId?: number;
  partName?: string;
  questions: QuestionButton[];
}

interface Props {
  /** Danh sách parts với câu hỏi */
  parts: PartGroup[];
  /** ID câu hỏi đang active */
  currentQuestionId?: number | null;
  /** Callback khi click vào câu hỏi */
  onQuestionClick: (questionId: number) => void;
  /** Số cột grid */
  columns?: number;
  /** Hiển thị tên part */
  showPartNames?: boolean;
  /** Mode hiển thị: exam (đang làm) hoặc result (xem kết quả) */
  mode?: "exam" | "result";
}

export default function QuestionPalette({
  parts,
  currentQuestionId,
  onQuestionClick,
  columns = 5,
  showPartNames = true,
  mode = "exam",
}: Props) {
  const getButtonClass = (q: QuestionButton): string => {
    const base = "font-bold rounded-lg flex items-center justify-center border transition-all text-xs";
    const size = "h-8 w-8";
    const active = currentQuestionId === q.id ? "ring-2 ring-blue-400" : "";

    if (mode === "result") {
      // Mode xem kết quả
      if (q.isCorrect === true) {
        return `${base} ${size} ${active} bg-green-100 text-green-700 border-green-400`;
      } else if (q.isCorrect === false && q.isAnswered) {
        return `${base} ${size} ${active} bg-red-50 text-red-600 border-red-300`;
      } else if (q.isSkipped || !q.isAnswered) {
        return `${base} ${size} ${active} bg-gray-50 text-gray-400 border-gray-200`;
      }
    }

    // Mode làm bài
    if (q.isAnswered) {
      return `${base} ${size} ${active} bg-blue-600 text-white border-blue-600`;
    }
    return `${base} ${size} ${active} bg-white text-gray-600 border-gray-300`;
  };

  return (
    <div className="space-y-4">
      {parts.map((part, index) => (
        <div key={part.partId || index}>
          {showPartNames && part.partName && (
            <h4 className="font-bold text-gray-700 text-sm mb-2">{part.partName}</h4>
          )}
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {part.questions.map((q) => (
              <button
                key={q.id}
                onClick={() => onQuestionClick(q.id)}
                className={getButtonClass(q)}
              >
                {q.questionNo}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
