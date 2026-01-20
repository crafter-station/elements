"use client";

import { useMemo } from "react";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface PolarRevenueCardProps {
  title?: string;
  value: number;
  previousValue?: number;
  currency?: string;
  interval?: "mrr" | "arr" | "total";
  trend?: number[];
  showChange?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function TrendingDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  );
}

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const height = 32;
  const width = 80;
  const padding = 2;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const isPositive = data[data.length - 1] >= data[0];

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      preserveAspectRatio="none"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={isPositive ? "#22c55e" : "#ef4444"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SIZE_CLASSES = {
  sm: {
    container: "p-3",
    title: "text-xs",
    value: "text-xl",
    change: "text-xs",
    sparkline: "h-6 w-16",
  },
  md: {
    container: "p-4",
    title: "text-sm",
    value: "text-2xl",
    change: "text-sm",
    sparkline: "h-8 w-20",
  },
  lg: {
    container: "p-5",
    title: "text-base",
    value: "text-3xl",
    change: "text-base",
    sparkline: "h-10 w-24",
  },
};

const INTERVAL_LABELS = {
  mrr: "MRR",
  arr: "ARR",
  total: "Total Revenue",
};

export function PolarRevenueCard({
  title,
  value,
  previousValue,
  currency = "$",
  interval = "mrr",
  trend,
  showChange = true,
  size = "md",
  className,
}: PolarRevenueCardProps) {
  const sizes = SIZE_CLASSES[size];

  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return `${currency}${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `${currency}${(val / 1000).toFixed(1)}K`;
    }
    return `${currency}${val.toLocaleString()}`;
  };

  const changePercent = useMemo(() => {
    if (!previousValue || previousValue === 0) return null;
    return ((value - previousValue) / previousValue) * 100;
  }, [value, previousValue]);

  const isPositive = changePercent !== null && changePercent >= 0;

  return (
    <div
      data-slot="polar-revenue-card"
      className={cn(
        "rounded-xl border border-border bg-card",
        sizes.container,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div data-slot="content" className="flex-1">
          <p
            data-slot="title"
            className={cn("font-medium text-muted-foreground", sizes.title)}
          >
            {title || INTERVAL_LABELS[interval]}
          </p>
          <p
            data-slot="value"
            className={cn("font-bold text-foreground mt-1", sizes.value)}
          >
            {formatValue(value)}
          </p>
          {showChange && changePercent !== null && (
            <div
              data-slot="change"
              className={cn(
                "flex items-center gap-1 mt-1",
                sizes.change,
                isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {isPositive ? (
                <TrendingUpIcon className="h-3.5 w-3.5" />
              ) : (
                <TrendingDownIcon className="h-3.5 w-3.5" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {changePercent.toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        {trend && trend.length > 1 && (
          <div data-slot="sparkline" className={sizes.sparkline}>
            <Sparkline data={trend} className="h-full w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
