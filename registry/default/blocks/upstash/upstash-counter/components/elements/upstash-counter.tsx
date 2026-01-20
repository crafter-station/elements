"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface UpstashCounterProps {
  value: number;
  label?: string;
  format?: "full" | "compact";
  showControls?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function PlusIcon({ className }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
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
      <path d="M5 12h14" />
    </svg>
  );
}

function formatNumber(value: number, format: "full" | "compact"): string {
  if (format === "compact") {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

const SIZE_CLASSES = {
  sm: { value: "text-2xl", label: "text-xs", button: "p-1", icon: "w-3 h-3" },
  md: { value: "text-4xl", label: "text-sm", button: "p-1.5", icon: "w-4 h-4" },
  lg: { value: "text-6xl", label: "text-base", button: "p-2", icon: "w-5 h-5" },
};

export function UpstashCounter({
  value,
  label,
  format = "full",
  showControls = false,
  onIncrement,
  onDecrement,
  animated = true,
  size = "md",
  className,
}: UpstashCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isPulsing, setIsPulsing] = useState(false);
  const prevValue = useRef(value);
  const sizes = SIZE_CLASSES[size];

  useEffect(() => {
    if (!animated) {
      setDisplayValue(value);
      return;
    }

    if (prevValue.current !== value) {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 300);

      const diff = value - prevValue.current;
      const steps = Math.min(Math.abs(diff), 20);
      const stepValue = diff / steps;
      let current = prevValue.current;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        if (step >= steps) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          current += stepValue;
          setDisplayValue(Math.round(current));
        }
      }, 30);

      prevValue.current = value;
      return () => clearInterval(interval);
    }
  }, [value, animated]);

  return (
    <div
      data-slot="upstash-counter"
      className={cn(
        "flex flex-col items-center gap-2",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {showControls && (
          <button
            type="button"
            onClick={onDecrement}
            disabled={!onDecrement}
            className={cn(
              "rounded-full border border-border bg-muted/50",
              "hover:bg-muted transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              sizes.button
            )}
          >
            <MinusIcon className={sizes.icon} />
          </button>
        )}

        <span
          className={cn(
            "font-mono font-bold tabular-nums transition-transform",
            sizes.value,
            isPulsing && "scale-110 text-primary"
          )}
        >
          {formatNumber(displayValue, format)}
        </span>

        {showControls && (
          <button
            type="button"
            onClick={onIncrement}
            disabled={!onIncrement}
            className={cn(
              "rounded-full border border-border bg-muted/50",
              "hover:bg-muted transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              sizes.button
            )}
          >
            <PlusIcon className={sizes.icon} />
          </button>
        )}
      </div>

      {label && (
        <span className={cn("text-muted-foreground", sizes.label)}>
          {label}
        </span>
      )}
    </div>
  );
}
