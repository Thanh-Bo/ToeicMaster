const WordDetailFeedback = ({ word }: { word: any }) => {
  return (
    // 👇 Thay đổi quan trọng: bg-transparent, bỏ shadow, bỏ border + text đậm hơn
    <div className="mt-2 bg-transparent text-left">
      {/* Header: Word + Type + Pronunciation */}
      <div className="flex flex-wrap items-end gap-2 sm:gap-3 ">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {word.word}
        </h3>

        {/* Màu vàng đậm hơn chút để dễ đọc trên nền xanh/đỏ nhạt */}
        <span className="text-yellow-700 dark:text-yellow-400 font-bold italic text-base sm:text-lg">
          ({word.partOfSpeech || word.type})
        </span>
      </div>

      <span className="text-gray-700 dark:text-gray-200 font-mono font-semibold text-base sm:text-lg">
        {word.pronunciation}
      </span>

      {/* Meaning */}
      {/* Chỉnh màu text đậm hơn để nổi trên nền màu */}
      <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
        {word.meaning}
      </p>

      {/* Example Section */}
      {word.example && (
        // Đổi màu border kẻ ngang cho hợp với nền màu
        <div className="text-sm sm:text-base border-t border-gray-300 dark:border-white/20 pt-2 sm:pt-3 mt-2">
          <p className="text-gray-900 dark:text-white font-bold italic mb-1">
            "{word.example}"
          </p>
          <p className="text-gray-800 dark:text-gray-200 font-medium">
            {word.exampleTranslation}
          </p>
        </div>
      )}
    </div>
  );
};

export default WordDetailFeedback;
