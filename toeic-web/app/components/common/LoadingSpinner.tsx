"use client";

interface Props {
  /** Văn bản hiển thị bên dưới spinner */
  text?: string;
  /** Kích thước spinner: 'sm' | 'md' | 'lg' */
  size?: "sm" | "md" | "lg";
  /** Hiển thị full screen hay inline */
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8 border-2",
  md: "h-12 w-12 border-4",
  lg: "h-16 w-16 border-4",
};

export default function LoadingSpinner({
  text = "Đang tải...",
  size = "lg",
  fullScreen = true,
}: Props) {
  const spinner = (
    <div className="text-center">
      <div
        className={`animate-spin rounded-full border-blue-600 border-t-transparent mx-auto mb-4 ${sizeClasses[size]}`}
      ></div>
      {text && <p className="text-blue-600 font-bold text-lg">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
}
