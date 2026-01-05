import Link from "next/link";

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
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white">Thống kê học tập</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-linear-to-br from-blue-500 to-indigo-600 text-white p-5 rounded-2xl">
          <p className="text-blue-100 text-xs uppercase tracking-wider">Tổng bài thi</p>
          <p className="text-3xl font-bold mt-1">{stats.totalTests}</p>
        </div>
        <div className="bg-linear-to-br from-green-500 to-emerald-600 text-white p-5 rounded-2xl">
          <p className="text-green-100 text-xs uppercase tracking-wider">Điểm TB</p>
          <p className="text-3xl font-bold mt-1">{stats.avgScore}</p>
        </div>
        <div className="bg-linear-to-br from-purple-500 to-violet-600 text-white p-5 rounded-2xl">
          <p className="text-purple-100 text-xs uppercase tracking-wider">Điểm cao nhất</p>
          <p className="text-3xl font-bold mt-1">{stats.bestScore}</p>
        </div>
        <div className="bg-linear-to-br from-orange-500 to-amber-600 text-white p-5 rounded-2xl">
          <p className="text-orange-100 text-xs uppercase tracking-wider">Tổng giờ học</p>
          <p className="text-3xl font-bold mt-1">{Math.round(stats.totalTime / 60)}h</p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link href="/history" className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm">
          Xem chi tiết lịch sử làm bài →
        </Link>
      </div>
    </div>
  );
}
