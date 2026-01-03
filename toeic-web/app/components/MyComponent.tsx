"use client";

import { useTheme } from "@/app/contexts/ThemeContext";

export function MyComponent() {
  const { isDark, theme } = useTheme();
  
  return <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-4">
    {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
  </div>;
}