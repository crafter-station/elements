"use client";

import { useEffect, useState } from "react";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

interface ThemeSwitcherButtonProps {
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ThemeSwitcherButton({
  size = "icon",
  className = "",
}: ThemeSwitcherButtonProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size={size} disabled className={className}>
        <div className="w-4 h-4 bg-input rounded animate-pulse" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size={size}
      onClick={toggleTheme}
      className={`relative overflow-hidden ${className}`}
    >
      <SunIcon
        className={`w-4 h-4 transition-all duration-300 ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <MoonIcon
        className={`absolute w-4 h-4 transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
