"use client";

import type { AdminUser } from "@/app/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UsersTabProps {
  filteredUsers: AdminUser[];
  onToggleStatus: (userId: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalUsers: number;
  usersPerPage: number;
}

export default function UsersTab({
  filteredUsers,
  onToggleStatus,
  currentPage,
  onPageChange,
  totalUsers,
  usersPerPage,
}: UsersTabProps) {
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div className="space-y-4">
      {/* Pagination Controls - Top */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Trang {currentPage} của {totalPages}
        </span>
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Trang trước"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="hidden sm:flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <span className="sm:hidden px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Trang tiếp"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">ID</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Họ tên</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Email</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Role</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Bài thi</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Trạng thái</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 dark:text-gray-400 text-sm">#{u.id}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-800 dark:text-gray-100 text-sm">{u.fullName}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-400 text-sm">{u.email}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.role === "Admin" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-400 text-sm">{u.totalTests}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}>
                      {u.isActive ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <button
                      onClick={() => onToggleStatus(u.id)}
                      className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition ${
                        u.isActive
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                      }`}
                    >
                      {u.isActive ? "Khóa" : "Mở khóa"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
