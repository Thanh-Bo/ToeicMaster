"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize on mount
  useEffect(() => {
    setIsMounted(true);
    
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    setThemeState(savedTheme);
    applyThemeToDOM(savedTheme);
  }, []);

  const applyThemeToDOM = (newTheme: Theme) => {
    let effectiveTheme: "light" | "dark";

    if (newTheme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      effectiveTheme = newTheme;
    }

    const htmlElement = document.documentElement;
    
    console.log(`🎨 applyThemeToDOM: newTheme=${newTheme}, effectiveTheme=${effectiveTheme}`);
    console.log(`📍 Before - html.className:`, htmlElement.className);
    
    if (effectiveTheme === "dark") {
      htmlElement.classList.add("dark");
      setIsDark(true);
      console.log(`✅ Added "dark" class`);
    } else {
      htmlElement.classList.remove("dark");
      setIsDark(false);
      console.log(`✅ Removed "dark" class`);
    }
    
    console.log(`📍 After - html.className:`, htmlElement.className);
    localStorage.setItem("theme", newTheme);
    void htmlElement.offsetHeight;
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);
  };

  // Watch for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      } else {
        document.documentElement.classList.remove("dark");
        setIsDark(false);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
