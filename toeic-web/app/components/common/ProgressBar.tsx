"use client";

interface Props {
  /** Phần trăm hoàn thành (0-100) */
  percentage: number;
  /** Chiều cao thanh progress */
  height?: "sm" | "md" | "lg";
  /** Màu gradient */
  color?: "blue" | "green" | "red" | "purple";
  /** Hiển thị phần trăm */
  showPercentage?: boolean;
  /** Animation khi load */
  animated?: boolean;
}

const heightClasses = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2.5",
};

const colorClasses = {
  blue: "from-blue-500 to-indigo-500",
  green: "from-green-500 to-emerald-500",
  red: "from-red-500 to-rose-500",
  purple: "from-purple-500 to-violet-500",
};

export default function ProgressBar({
  percentage,
  height = "md",
  color = "blue",
  showPercentage = false,
  animated = true,
}: Props) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full">
      <div className={`bg-gray-200 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div
          className={`h-full bg-linear-to-r ${colorClasses[color]} ${
            animated ? "transition-all duration-300" : ""
          }`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-right mt-1">
          <span className="text-sm font-medium text-gray-600">
            {Math.round(clampedPercentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
