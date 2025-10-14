"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

interface ThemeSwitcherToggleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function ThemeSwitcherToggle({
  className,
  ...props
}: ThemeSwitcherToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("flex items-center space-x-2", className)} {...props}>
        <div className="w-10 h-6 bg-input rounded-full animate-pulse" />
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";

  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          isDark ? "bg-primary" : "bg-muted"
        }`}
      >
        <span className="sr-only">Toggle theme</span>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-background transition duration-200 ease-in-out ${
            isDark ? "translate-x-6" : "translate-x-1"
          }`}
        >
          {isDark ? (
            <MoonIcon className="h-3 w-3 text-foreground mt-0.5 ml-0.5" />
          ) : (
            <SunIcon className="h-3 w-3 text-foreground mt-0.5 ml-0.5" />
          )}
        </span>
      </button>
    </div>
  );
}
