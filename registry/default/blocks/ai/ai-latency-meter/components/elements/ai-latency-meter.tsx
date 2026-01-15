"use client";

import * as React from "react";

import { Clock, Timer, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

type LatencyLevel = "fast" | "moderate" | "slow";

interface AiLatencyMeterContextValue {
  ttfb?: number;
  totalDuration?: number;
  isLoading: boolean;
  variant: "compact" | "expanded";
  level: LatencyLevel;
}

const AiLatencyMeterContext =
  React.createContext<AiLatencyMeterContextValue | null>(null);

function useLatencyMeterContext() {
  const context = React.useContext(AiLatencyMeterContext);
  if (!context) {
    throw new Error(
      "AiLatencyMeter components must be used within <AiLatencyMeter>",
    );
  }
  return context;
}

function getLatencyLevel(ms?: number): LatencyLevel {
  if (ms === undefined) return "fast";
  if (ms < 1000) return "fast";
  if (ms < 3000) return "moderate";
  return "slow";
}

interface AiLatencyMeterProps {
  ttfb?: number;
  totalDuration?: number;
  isLoading?: boolean;
  variant?: "compact" | "expanded";
  children?: React.ReactNode;
  className?: string;
}

function AiLatencyMeter({
  ttfb,
  totalDuration,
  isLoading = false,
  variant = "expanded",
  children,
  className,
}: AiLatencyMeterProps) {
  const level = React.useMemo(
    () => getLatencyLevel(totalDuration ?? ttfb),
    [totalDuration, ttfb],
  );

  const contextValue = React.useMemo(
    () => ({ ttfb, totalDuration, isLoading, variant, level }),
    [ttfb, totalDuration, isLoading, variant, level],
  );

  return (
    <AiLatencyMeterContext.Provider value={contextValue}>
      <div
        data-slot="ai-latency-meter"
        data-variant={variant}
        data-loading={isLoading}
        data-level={level}
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground overflow-hidden",
          variant === "compact" && "inline-flex items-center gap-2 px-3 py-2",
          variant === "expanded" && "p-4",
          className,
        )}
      >
        {children}
      </div>
    </AiLatencyMeterContext.Provider>
  );
}

interface AiLatencyMeterHeaderProps {
  title?: string;
  className?: string;
}

function AiLatencyMeterHeader({
  title = "Response Time",
  className,
}: AiLatencyMeterHeaderProps) {
  const { isLoading, level } = useLatencyMeterContext();

  const levelConfig = React.useMemo(() => {
    const configs: Record<
      LatencyLevel,
      { icon: React.ReactNode; color: string }
    > = {
      fast: {
        icon: <Zap className="size-4" />,
        color: "text-green-500",
      },
      moderate: {
        icon: <Clock className="size-4" />,
        color: "text-yellow-500",
      },
      slow: {
        icon: <Timer className="size-4" />,
        color: "text-red-500",
      },
    };
    return configs[level];
  }, [level]);

  return (
    <div
      data-slot="ai-latency-meter-header"
      className={cn("flex items-center gap-2 mb-3", className)}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted",
          isLoading && "animate-pulse",
        )}
      >
        <span className={levelConfig.color}>{levelConfig.icon}</span>
      </div>
      <span className="font-medium text-sm">{title}</span>
    </div>
  );
}

interface AiLatencyMeterBarProps {
  className?: string;
}

function AiLatencyMeterBar({ className }: AiLatencyMeterBarProps) {
  const { ttfb, totalDuration, isLoading, level } = useLatencyMeterContext();

  const maxDuration = 5000;
  const ttfbPercent = React.useMemo(() => {
    if (!ttfb) return 0;
    return Math.min((ttfb / maxDuration) * 100, 100);
  }, [ttfb]);

  const totalPercent = React.useMemo(() => {
    if (!totalDuration) return 0;
    return Math.min((totalDuration / maxDuration) * 100, 100);
  }, [totalDuration]);

  const levelColors = React.useMemo(() => {
    const colors: Record<LatencyLevel, { bg: string; fill: string }> = {
      fast: {
        bg: "bg-green-100 dark:bg-green-950",
        fill: "bg-green-500",
      },
      moderate: {
        bg: "bg-yellow-100 dark:bg-yellow-950",
        fill: "bg-yellow-500",
      },
      slow: {
        bg: "bg-red-100 dark:bg-red-950",
        fill: "bg-red-500",
      },
    };
    return colors[level];
  }, [level]);

  return (
    <div
      data-slot="ai-latency-meter-bar"
      className={cn("space-y-2", className)}
    >
      <div
        className={cn(
          "relative h-3 w-full rounded-full overflow-hidden",
          levelColors.bg,
        )}
      >
        {isLoading ? (
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full animate-pulse",
              levelColors.fill,
            )}
            style={{ width: "60%" }}
          />
        ) : (
          <>
            {ttfb !== undefined && ttfb > 0 && (
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-blue-500 opacity-50"
                style={{ width: `${ttfbPercent}%` }}
              />
            )}
            {totalDuration !== undefined && totalDuration > 0 && (
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full",
                  levelColors.fill,
                )}
                style={{ width: `${totalPercent}%` }}
              />
            )}
          </>
        )}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0ms</span>
        <span>1s</span>
        <span>3s</span>
        <span>5s+</span>
      </div>
    </div>
  );
}

interface AiLatencyMeterStatsProps {
  className?: string;
}

function AiLatencyMeterStats({ className }: AiLatencyMeterStatsProps) {
  const { ttfb, totalDuration, isLoading } = useLatencyMeterContext();

  const formatDuration = React.useCallback((ms?: number) => {
    if (ms === undefined) return "-";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }, []);

  return (
    <div
      data-slot="ai-latency-meter-stats"
      className={cn("grid grid-cols-2 gap-4 mt-3", className)}
    >
      <div className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          TTFB
        </span>
        <p
          className={cn(
            "text-lg font-semibold font-mono",
            isLoading && "animate-pulse text-muted-foreground",
          )}
        >
          {isLoading ? "..." : formatDuration(ttfb)}
        </p>
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Total
        </span>
        <p
          className={cn(
            "text-lg font-semibold font-mono",
            isLoading && "animate-pulse text-muted-foreground",
          )}
        >
          {isLoading ? "..." : formatDuration(totalDuration)}
        </p>
      </div>
    </div>
  );
}

interface AiLatencyMeterCompactProps {
  className?: string;
}

function AiLatencyMeterCompact({ className }: AiLatencyMeterCompactProps) {
  const { ttfb, totalDuration, isLoading, level } = useLatencyMeterContext();

  const levelConfig = React.useMemo(() => {
    const configs: Record<
      LatencyLevel,
      { icon: React.ReactNode; color: string; bgColor: string }
    > = {
      fast: {
        icon: <Zap className="size-3.5" />,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-950",
      },
      moderate: {
        icon: <Clock className="size-3.5" />,
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-100 dark:bg-yellow-950",
      },
      slow: {
        icon: <Timer className="size-3.5" />,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-950",
      },
    };
    return configs[level];
  }, [level]);

  const formatDuration = React.useCallback((ms?: number) => {
    if (ms === undefined) return "-";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }, []);

  const displayValue = totalDuration ?? ttfb;

  return (
    <div
      data-slot="ai-latency-meter-compact"
      className={cn("flex items-center gap-2", className)}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center size-6 rounded",
          levelConfig.bgColor,
          isLoading && "animate-pulse",
        )}
      >
        <span className={levelConfig.color}>{levelConfig.icon}</span>
      </span>
      <span
        className={cn(
          "text-sm font-mono font-medium",
          isLoading && "animate-pulse text-muted-foreground",
        )}
      >
        {isLoading ? "..." : formatDuration(displayValue)}
      </span>
    </div>
  );
}

export {
  AiLatencyMeter,
  AiLatencyMeterHeader,
  AiLatencyMeterBar,
  AiLatencyMeterStats,
  AiLatencyMeterCompact,
};
export type { AiLatencyMeterProps, LatencyLevel };
