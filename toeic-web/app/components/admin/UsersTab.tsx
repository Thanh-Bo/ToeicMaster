"use client";

import { useState } from "react";
import type { AdminUser } from "@/app/types";
import { ChevronLeft, ChevronRight, Crown } from "lucide-react";

interface UsersTabProps {
  filteredUsers: AdminUser[];
  onToggleStatus: (userId: number) => void;
  onTogglePremium: (user: AdminUser) => void;
  savingPremiumUsers?: Record<number, boolean>;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalUsers: number;
  usersPerPage: number;
}

export default function UsersTab({
  filteredUsers,
  onToggleStatus,
  onTogglePremium,
  savingPremiumUsers = {},
  currentPage,
  onPageChange,
  totalUsers,
  usersPerPage,
}: UsersTabProps) {
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const [now] = useState(() => Date.now());

  const isPremiumActive = (user: AdminUser) => {
    if (user.role === "Admin") return true;
    if (!user.isPremium || !user.premiumExpiredAt) return false;
    return new Date(user.premiumExpiredAt).getTime() > now;
  };

  const formatPremiumExpiry = (premiumExpiredAt?: string | null) => {
    if (!premiumExpiredAt) return null;
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(premiumExpiredAt));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Trang {currentPage} cua {totalPages}
        </span>
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Trang truoc"
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
            title="Trang tiep"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">ID</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Ho ten</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Email</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Goi</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Bai thi</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Trang thai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((u) => {
                const premiumActive = isPremiumActive(u);
                const expiry = formatPremiumExpiry(u.premiumExpiredAt);
                const isSavingPremium = savingPremiumUsers[u.id];

                return (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 dark:text-gray-400 text-sm">#{u.id}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="font-medium text-gray-800 dark:text-gray-100 text-sm">{u.fullName}</div>
                      {u.role === "Admin" && (
                        <div className="mt-1 text-xs text-purple-600 dark:text-purple-300">Admin</div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-400 text-sm">{u.email}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                          premiumActive
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        }`}>
                          {premiumActive && <Crown className="h-3.5 w-3.5" />}
                          {premiumActive ? "Premium" : "Normal"}
                        </span>
                        {premiumActive && expiry && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">Het han {expiry}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-400 text-sm">{u.totalTests}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.isActive
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}>
                        {u.isActive ? "Hoat dong" : "Bi khoa"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex flex-wrap gap-2">
                        
                        
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
