import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Stats {
  totalTests: number;
  avgScore: number;
  bestScore: number;
  totalTime: number;
}

interface ProfileStatsTabProps {
  stats: Stats;
}

export default function ProfileStatsTab({ stats }: ProfileStatsTabProps) {
  const statCards = [
    { label: "Tổng bài thi", value: stats.totalTests },
    { label: "Điểm TB", value: stats.avgScore },
    { label: "Điểm cao nhất", value: stats.bestScore },
    { label: "Tổng giờ học", value: `${Math.round(stats.totalTime / 60)}h` },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thống kê học tập</h3>

      <div className="grid grid-cols-2 gap-4">
        {statCards.map(({ label, value }) => (
          <div
            key={label}
            className="border border-gray-200 dark:border-zinc-700 rounded-2xl p-5"
          >
            <p className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider font-medium">{label}</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <Link
          href="/history"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition font-medium"
        >
          Xem chi tiết lịch sử làm bài
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
