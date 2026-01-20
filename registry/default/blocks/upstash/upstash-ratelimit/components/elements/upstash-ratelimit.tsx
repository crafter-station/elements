"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface UpstashRatelimitProps {
  limit: number;
  remaining: number;
  reset: number;
  success?: boolean;
  showResetTimer?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "0s";
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

const SIZE_CLASSES = {
  sm: { container: "p-3 gap-2", icon: "w-4 h-4", text: "text-xs", bar: "h-1.5" },
  md: { container: "p-4 gap-3", icon: "w-5 h-5", text: "text-sm", bar: "h-2" },
  lg: { container: "p-5 gap-4", icon: "w-6 h-6", text: "text-base", bar: "h-2.5" },
};

export function UpstashRatelimit({
  limit,
  remaining,
  reset,
  success = true,
  showResetTimer = true,
  size = "md",
  className,
}: UpstashRatelimitProps) {
  const [timeRemaining, setTimeRemaining] = useState(reset - Date.now());
  const percentage = (remaining / limit) * 100;
  const sizes = SIZE_CLASSES[size];

  useEffect(() => {
    if (!showResetTimer) return;

    const interval = setInterval(() => {
      const newTime = reset - Date.now();
      setTimeRemaining(newTime > 0 ? newTime : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [reset, showResetTimer]);

  const getStatusColor = () => {
    if (!success) return "text-destructive";
    if (percentage > 50) return "text-green-500";
    if (percentage > 20) return "text-yellow-500";
    return "text-orange-500";
  };

  const getBarColor = () => {
    if (!success) return "bg-destructive";
    if (percentage > 50) return "bg-green-500";
    if (percentage > 20) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div
      data-slot="upstash-ratelimit"
      className={cn(
        "rounded-lg border border-border bg-card",
        "flex flex-col",
        sizes.container,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldIcon className={cn(sizes.icon, getStatusColor())} />
          <span className={cn("font-medium", sizes.text)}>Rate Limit</span>
        </div>
        <div className={cn("font-mono", sizes.text, getStatusColor())}>
          {remaining} / {limit}
        </div>
      </div>

      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizes.bar)}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            getBarColor()
          )}
          style={{ width: `${Math.max(percentage, 0)}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className={cn("text-muted-foreground", sizes.text)}>
          {success ? "Requests available" : "Rate limit exceeded"}
        </span>
        {showResetTimer && timeRemaining > 0 && (
          <span className={cn("text-muted-foreground font-mono", sizes.text)}>
            Resets in {formatTimeRemaining(timeRemaining)}
          </span>
        )}
      </div>
    </div>
  );
}
