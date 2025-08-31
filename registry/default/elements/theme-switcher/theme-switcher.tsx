"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="border-2 border-dashed border-foreground/50 p-3 rounded-md">
        <div className="h-[1.15rem] w-8 bg-input rounded-full border shadow-xs animate-pulse" />
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";

  return (
    <div className="relative h-[1.15rem] w-8">
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-secondary absolute inset-0"
      />

      {/* Sun icon - positioned on the left side */}
      <div
        className={`absolute left-0 top-0 h-full w-4 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
          isDark ? "opacity-0" : "opacity-100"
        }`}
      >
        <SunIcon className="text-foreground" />
      </div>

      {/* Moon icon - positioned on the right side */}
      <div
        className={`absolute right-0 top-0 h-full w-4 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      >
        <MoonIcon className="text-foreground" />
      </div>
    </div>
  );
}
