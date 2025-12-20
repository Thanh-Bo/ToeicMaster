"use client";

interface Props {
  /** Label phía trên số */
  label: string;
  /** Giá trị chính */
  value: string | number;
  /** Giá trị total (hiển thị dạng value/total) */
  total?: string | number;
  /** Icon hoặc emoji */
  icon?: string;
  /** Màu gradient */
  color?: "blue" | "green" | "purple" | "orange" | "red" | "teal";
  /** Kích thước */
  size?: "sm" | "md" | "lg";
}

const colorClasses = {
  blue: "from-blue-500 to-indigo-600",
  green: "from-green-500 to-emerald-600",
  purple: "from-purple-500 to-violet-600",
  orange: "from-orange-500 to-amber-600",
  red: "from-red-500 to-rose-600",
  teal: "from-teal-500 to-cyan-600",
};

const labelColorClasses = {
  blue: "text-blue-100",
  green: "text-green-100",
  purple: "text-purple-100",
  orange: "text-orange-100",
  red: "text-red-100",
  teal: "text-teal-100",
};

const sizeClasses = {
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

const valueSizeClasses = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

export default function StatsCard({
  label,
  value,
  total,
  icon,
  color = "blue",
  size = "md",
}: Props) {
  return (
    <div
      className={`bg-linear-to-br ${colorClasses[color]} text-white rounded-2xl shadow-lg ${sizeClasses[size]}`}
    >
      <p className={`${labelColorClasses[color]} text-xs uppercase tracking-wider mb-1 flex items-center gap-1`}>
        {icon && <span>{icon}</span>}
        {label}
      </p>
      <p className={`${valueSizeClasses[size]} font-extrabold`}>
        {value}
        {total !== undefined && (
          <span className="text-lg opacity-70">/{total}</span>
        )}
      </p>
    </div>
  );
}
