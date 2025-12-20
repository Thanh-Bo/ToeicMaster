"use client";

interface Props {
  /** Loại thông báo */
  type: "success" | "error" | "warning" | "info";
  /** Nội dung thông báo */
  message: string;
  /** Callback khi đóng (nếu có nút đóng) */
  onClose?: () => void;
  /** Có hiển thị nút đóng không */
  closable?: boolean;
}

const typeConfig = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export default function AlertMessage({
  type,
  message,
  onClose,
  closable = true,
}: Props) {
  const config = typeConfig[type];

  return (
    <div
      className={`p-4 rounded-xl flex items-center gap-3 border ${config.bg} ${config.border} ${config.text}`}
    >
      <div className="shrink-0">{config.icon}</div>
      <p className="flex-1 font-medium">{message}</p>
      {closable && onClose && (
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
