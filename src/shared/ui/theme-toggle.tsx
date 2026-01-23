"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import { useTheme } from "@/shared/providers/theme-provider";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Basculer entre le mode clair et sombre"
        disabled
      >
        <Moon className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Basculer entre le mode clair et sombre"
      className="hover:bg-accent/80 hover:scale-105 transition-transform"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
