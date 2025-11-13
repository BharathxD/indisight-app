"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const StandaloneThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted)
    return (
      <button
        aria-label="Toggle theme"
        className="flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted"
        type="button"
      >
        <div className="size-4" />
      </button>
    );

  return (
    <button
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      className="flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted"
      onClick={toggleTheme}
      type="button"
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  );
};
