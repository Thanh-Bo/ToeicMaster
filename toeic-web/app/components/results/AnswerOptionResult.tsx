export const AnswerOptionResult = ({
  q,
  label,
  content,
}: {
  q: any;
  label: string;
  content: string;
}) => {
  const userSelected = (q.userSelected || "").toString().toUpperCase();
  const isUserSelected = userSelected === label;
  const correctOpt = (q.correctOption || "").toString().toUpperCase();
  const isCorrect = correctOpt === label;

  // Strip leading "(A) " / "(B) " etc. from content if present
  const cleanContent = content.replace(/^\([A-D]\)\s*/i, "").trim();

  let containerClass =
    "border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 opacity-100";
  let badgeClass =
    "bg-gray-300 dark:bg-zinc-600 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-zinc-600";
  let statusText = null;

  if (isCorrect) {
    containerClass =
      "border-green-500 dark:border-green-700 bg-green-50 dark:bg-green-900 ring-1 ring-green-500 dark:ring-green-700 opacity-100";
    badgeClass =
      "bg-green-600 dark:bg-green-700 text-white border-green-600 dark:border-green-700";
    statusText = (
      <span className="text-green-700 dark:text-green-300 text-xs font-bold ml-auto">
        ✔ Đáp án đúng
      </span>
    );
  } else if (isUserSelected) {
    containerClass =
      "border-red-500 dark:border-red-700 bg-red-50 dark:bg-red-900 ring-1 ring-red-500 dark:ring-red-700 opacity-100";
    badgeClass =
      "bg-red-600 dark:bg-red-700 text-white border-red-600 dark:border-red-700";
    statusText = (
      <span className="text-red-600 dark:text-red-300 text-xs font-bold ml-auto">
        ✖ Bạn chọn
      </span>
    );
  }

  return (
    <div
      className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl transition-all ${containerClass}`}
    >
      <span
        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg flex items-center justify-center text-xs font-bold mr-2 sm:mr-3 border shrink-0 ${badgeClass}`}
      >
        {label}
      </span>
      <span
        className={`text-sm sm:text-base flex-1 ${
          isCorrect || isUserSelected
            ? "text-gray-900 dark:text-gray-100"
            : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {cleanContent}
      </span>
      {statusText}
    </div>
  );
};
