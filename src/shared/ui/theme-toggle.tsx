"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import { useTheme } from "@/shared/providers/theme-provider";
import { motion } from "framer-motion";

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
        className="text-muted-foreground"
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
      className="text-muted-foreground hover:text-primary hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:hover:bg-primary/20 dark:hover:text-primary transition-colors duration-200"
    >
      <motion.div

              initial={false}
            animate={{ rotate: theme === "light" ? 0 : 180, scale: 1 }}
          >
        {theme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </motion.div>
    </Button>
  );
}
