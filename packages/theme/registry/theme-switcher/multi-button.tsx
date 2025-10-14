"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

interface ThemeSwitcherMultiButtonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function ThemeSwitcherMultiButton({
  className,
  ...props
}: ThemeSwitcherMultiButtonProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "relative isolate inline-flex h-8 items-center rounded-full border border-dotted px-1",
          className,
        )}
        {...props}
      >
        <div className="flex space-x-0">
          <div className="size-6 rounded-full bg-input animate-pulse" />
          <div className="size-6 rounded-full bg-input animate-pulse" />
          <div className="size-6 rounded-full bg-input animate-pulse" />
        </div>
      </div>
    );
  }

  const themes = [
    { value: "system", icon: MonitorIcon, label: "Switch to system theme" },
    { value: "light", icon: SunIcon, label: "Switch to light theme" },
    { value: "dark", icon: MoonIcon, label: "Switch to dark theme" },
  ];

  return (
    <div
      className={cn(
        "relative isolate inline-flex h-8 items-center rounded-full border border-dotted px-1",
        className,
      )}
      {...props}
    >
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          aria-label={label}
          title={label}
          type="button"
          onClick={() => setTheme(value)}
          className="group relative size-6 rounded-full transition duration-200 ease-out"
        >
          {theme === value && (
            <div className="-z-1 absolute inset-0 rounded-full bg-muted" />
          )}
          <Icon
            className={`relative m-auto size-3.5 transition duration-200 ease-out ${
              theme === value
                ? "text-foreground"
                : "text-secondary-foreground group-hover:text-foreground group-focus-visible:text-foreground"
            }`}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}
