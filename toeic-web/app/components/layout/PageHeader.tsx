"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  ALargeSmall,
  BookOpen,
  ChevronRight,
  Crown,
  FileText,
  Library,
  LogOut,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

const ThemeToggle = dynamic(
  () => import("../common/ThemeToggle").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="w-9 h-9" />,
  },
);

const FeedbackModal = dynamic(
  () => import("../feedback/FeedbackModal").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  },
);

interface NavLink {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface Props {
  logoText?: string;
  navLinks?: NavLink[];
  showDefaultLinks?: boolean;
}

const defaultNavLinks: NavLink[] = [
  { href: "/grammar", label: "Ngữ pháp", icon: Library },
  { href: "/vocabulary", label: "Từ vựng", icon: ALargeSmall },
  { href: "/practice", label: "Luyện đề", icon: FileText },
  { href: "/reading", label: "Luyện đọc", icon: BookOpen },
];

export default function PageHeader({
  logoText = "TOEIC Masters",
  navLinks,
  showDefaultLinks = true,
}: Props) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleUpgradeClick = () => {
    router.push("/subscription");
  };

  const links = navLinks || (showDefaultLinks ? defaultNavLinks : []);

  return (
    <header className="bg-white dark:bg-zinc-950 text-gray-700 dark:text-white sticky top-0 z-50 border-b border-gray-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center gap-4 md:gap-6 lg:gap-8">
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="size-15 flex items-center justify-center">
            <img src="/logo.ico" alt="TOEIC Masters Logo" />
          </div>
          <span className="text-lg font-bold hidden sm:block">{logoText}</span>
        </Link>

        <nav className="flex items-center gap-4 md:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors font-medium text-sm hidden md:flex"
            >
              {link.icon && <link.icon className="w-5 h-5" />}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
            <button
              onClick={handleUpgradeClick}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all text-sm"
            >
              <Crown size={16} />
              Nâng cấp PRO
            </button>

            <ThemeToggle />

            <button
              onClick={() => setShowFeedback(true)}
              className="hidden md:block text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
              title="Gửi ý kiến"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            <Link
              href="/profile"
              className="flex items-center justify-center w-9 h-9 rounded-full text-white dark:text-gray-900 font-bold text-sm hover:opacity-80 transition overflow-hidden"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                  {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </Link>

            <div className="relative hidden md:block">
              <button
                onClick={() => setShowLogoutConfirm((v) => !v)}
                className="text-gray-400 hover:text-red-400 transition"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Hamburger button for logged in users */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              href="/login"
              className="border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg transition font-medium text-sm px-3 py-2"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="hidden sm:block bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 sm:px-6 py-2 rounded-lg hover:opacity-90 transition font-medium text-sm"
            >
              Đăng ký
            </Link>

            {/* Hamburger button for logged out users */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Global logout confirmation dialog (for mobile drawer trigger) */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-sm mx-4 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Đăng xuất
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bạn có chắc chắn muốn đăng xuất?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 dark:hover:bg-red-650 transition"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-zinc-950 p-6 shadow-2xl flex flex-col justify-between transition-transform duration-300">
            <div>
              {/* Drawer header */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-zinc-900">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <img src="/logo.ico" alt="TOEIC Masters Logo" className="w-8 h-8" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {logoText}
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:text-gray-700 dark:hover:text-zinc-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="mt-6 space-y-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3.5 rounded-xl text-gray-600 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition font-medium"
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-5 h-5 text-gray-400" />}
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions inside drawer */}
            <div className="pt-6 border-t border-gray-100 dark:border-zinc-900 space-y-4">
              {user ? (
                <>
                  {/* User Profile Info */}
                  <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-zinc-900/40 rounded-xl">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center font-bold">
                        {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-zinc-500">
                        Tài khoản {user.role === "admin" ? "Admin" : "Học viên"}
                      </p>
                    </div>
                  </div>

                  {/* PRO Upgrade Button in drawer */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleUpgradeClick();
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-650 text-white font-bold rounded-xl transition shadow-md"
                  >
                    <Crown size={18} />
                    Nâng cấp tài khoản PRO
                  </button>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {/* Feedback button */}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setShowFeedback(true);
                      }}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 font-medium text-sm transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Góp ý
                    </button>

                    {/* Logout button */}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl border border-red-200 dark:border-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium text-sm transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-xl transition font-bold text-sm py-3"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition font-bold text-sm py-3"
                  >
                    Đăng ký tài khoản
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </header>
  );
}
