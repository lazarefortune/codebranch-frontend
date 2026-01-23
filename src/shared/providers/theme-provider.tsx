"use client";

import * as React from "react";

type Theme = "light" | "dark";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  const [mounted, setMounted] = React.useState(false);

  const applyTheme = React.useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  }, []);

  React.useEffect(() => {
    setMounted(() => true);
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, [applyTheme]);

  const handleSetTheme = React.useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);
      applyTheme(newTheme);
    },
    [applyTheme]
  );

  const toggleTheme = React.useCallback(() => {
    // Read current theme from DOM to ensure we have the latest state
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";
    handleSetTheme(newTheme);
  }, [handleSetTheme]);

  // Always provide context, even before mount
  // This prevents errors during SSR
  const contextValue = React.useMemo(
    () => ({
      theme: mounted ? theme : defaultTheme,
      setTheme: handleSetTheme,
      toggleTheme,
    }),
    [mounted, theme, defaultTheme, handleSetTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
