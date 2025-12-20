"use client";

interface Props {
  /** Trang hiện tại (1-based) */
  currentPage: number;
  /** Tổng số trang */
  totalPages: number;
  /** Callback khi đổi trang */
  onPageChange: (page: number) => void;
  /** Hiển thị nút số trang hay chỉ prev/next */
  showPageNumbers?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = false,
}: Props) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Tạo danh sách số trang để hiển thị
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Số trang hiển thị bên trái/phải trang hiện tại

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white rounded-lg shadow border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
      >
        ← Trước
      </button>

      {showPageNumbers ? (
        <div className="flex gap-1">
          {getPageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  page === currentPage
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ) : (
              <span
                key={index}
                className="w-10 h-10 flex items-center justify-center text-gray-400"
              >
                {page}
              </span>
            )
          )}
        </div>
      ) : (
        <span className="px-4 py-2 bg-white rounded-lg shadow border border-gray-200 font-medium text-gray-700">
          {currentPage} / {totalPages}
        </span>
      )}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white rounded-lg shadow border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
      >
        Sau →
      </button>
    </div>
  );
}
