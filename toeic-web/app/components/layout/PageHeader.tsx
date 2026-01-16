"use client";

import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import dynamic from "next/dynamic";

// Load ThemeToggle dynamically with SSR disabled - to avoid ThemeProvider error on server
const ThemeToggle = dynamic(() => import("../common/ThemeToggle").then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="w-9 h-9" /> // Placeholder while loading
});

interface NavLink {
  href: string;
  label: string;
}

interface Props {
  /** Logo text - mặc định "TOEIC Master" */
  logoText?: string;
  /** Các links hiển thị trên nav */
  navLinks?: NavLink[];
  /** Có hiển thị các quick links mặc định không */
  showDefaultLinks?: boolean;
}

const defaultNavLinks: NavLink[] = [
  { href: "/", label: "Đề thi" },
  { href: "/vocabulary", label: "Từ vựng" },
  { href: "/bookmarks", label: "Đánh dấu" },
  { href: "/statistics", label: "Thống kê" },

  { href: "/history", label: "Lịch sử" },
];

export default function PageHeader({
  logoText = "TOEIC Master",
  navLinks,
  showDefaultLinks = true,
}: Props) {
  const { user, logout } = useAuth();

  const links = navLinks || (showDefaultLinks ? defaultNavLinks : []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white/80 dark:bg-zinc-900 backdrop-blur-md shadow-sm dark:shadow-md sticky top-0 z-50 border-b border-gray-100 dark:border-zinc-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
            {logoText}
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {/* Nav Links */}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm hidden md:block"
            >
              {link.label}
            </Link>
          ))}

<ThemeToggle />
          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
              > 
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm hidden sm:block">
                  {user.fullName}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                title="Đăng xuất"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm px-3 py-2"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition font-medium text-sm shadow-md shadow-blue-200 dark:shadow-blue-900/50"
              >
                Đăng ký miễn phí
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
