"use client";

import { Users, CheckCircle, FileText, HelpCircle, Target, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@/app/types";

interface DashboardTabProps {
  stats: DashboardStats | null;
}

export default function DashboardTab({ stats }: DashboardTabProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Tổng Users</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.totalUsers}</p>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">+{stats.newUsersToday} hôm nay</p>
          </div>
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
            <Users className="w-7 h-7 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Users hoạt động</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.activeUsers}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% tổng</p>
          </div>
          <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Tổng Đề thi</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.totalTests}</p>
          </div>
          <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
            <FileText className="w-7 h-7 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Tổng Câu hỏi</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.totalQuestions}</p>
          </div>
          <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
            <HelpCircle className="w-7 h-7 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Tổng lượt thi</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.totalAttempts}</p>
          </div>
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
            <Target className="w-7 h-7 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Trung bình</p>
            <p className="text-3xl font-bold">{Math.round(stats.totalAttempts / stats.totalUsers)} bài/user</p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
