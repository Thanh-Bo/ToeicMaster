// app/components/common/ThemeToggle.tsx
"use client";

import { useTheme } from "@/app/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

// Inner component that uses hooks
function ThemeToggleContent() {
  try {
    const { theme, setTheme, isDark } = useTheme();
    const [showMenu, setShowMenu] = useState(false);

    // console.log("🎭 ThemeToggleContent rendered - theme:", theme, "isDark:", isDark);

    return (
      <div className="relative">
        <button
          onClick={() => {
            // console.log("🔘 Theme button clicked, showMenu:", !showMenu);
            setShowMenu(!showMenu);
          }}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 px-3 py-2">
                Chế độ
              </p>
              
              {[
                { value: "light" as const, label: "☀️ Sáng" },
                { value: "dark" as const, label: "🌙 Tối" },
                { value: "system" as const, label: "🖥️ Hệ thống" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    // console.log("🎨 Setting theme to:", option.value);
                    setTheme(option.value);
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md transition ${
                    theme === option.value
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("❌ ThemeToggle error - ThemeProvider not ready:", error);
    // Fallback - placeholder button
    return <div className="w-9 h-9" />;
  }
}

// Outer wrapper component
export function ThemeToggle() {
  return <ThemeToggleContent />;
}

export default ThemeToggle;
