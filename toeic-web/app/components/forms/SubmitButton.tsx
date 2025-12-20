"use client";

interface Props {
  /** Văn bản nút */
  children: React.ReactNode;
  /** Đang loading */
  loading?: boolean;
  /** Văn bản khi loading */
  loadingText?: string;
  /** Disabled */
  disabled?: boolean;
  /** Kiểu submit hay button */
  type?: "submit" | "button";
  /** Callback khi click (nếu type="button") */
  onClick?: () => void;
  /** Full width */
  fullWidth?: boolean;
  /** Màu */
  variant?: "primary" | "secondary" | "danger";
  /** Kích thước */
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  primary: "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200",
  danger: "bg-linear-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-200",
};

const sizeClasses = {
  sm: "py-2 px-4 text-sm",
  md: "py-3 px-6 text-base",
  lg: "py-4 px-8 text-lg",
};

export default function SubmitButton({
  children,
  loading = false,
  loadingText = "Đang xử lý...",
  disabled = false,
  type = "submit",
  onClick,
  fullWidth = true,
  variant = "primary",
  size = "md",
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        ${fullWidth ? "w-full" : ""}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-xl font-semibold transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
      `}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
