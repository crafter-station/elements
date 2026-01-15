"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ModelPreset =
  | "gpt-4"
  | "gpt-4o"
  | "gpt-5"
  | "claude-opus"
  | "claude-sonnet"
  | "gemini-pro"
  | "custom";

const MODEL_LIMITS: Record<ModelPreset, number> = {
  "gpt-4": 8192,
  "gpt-4o": 128000,
  "gpt-5": 128000,
  "claude-opus": 200000,
  "claude-sonnet": 200000,
  "gemini-pro": 1000000,
  custom: 128000,
};

interface AiTokenCounterProps {
  tokens: number;
  maxTokens?: number;
  model?: ModelPreset;
  showProgress?: boolean;
  className?: string;
}

export function AiTokenCounter({
  tokens,
  maxTokens,
  model = "custom",
  showProgress = true,
  className,
}: AiTokenCounterProps) {
  const limit = maxTokens ?? MODEL_LIMITS[model];

  const { percentage, statusColor, progressColor } = React.useMemo(() => {
    const pct = Math.min((tokens / limit) * 100, 100);
    let status = "text-muted-foreground";
    let progress = "bg-primary";

    if (pct >= 90) {
      status = "text-red-500";
      progress = "bg-red-500";
    } else if (pct >= 75) {
      status = "text-amber-500";
      progress = "bg-amber-500";
    }

    return { percentage: pct, statusColor: status, progressColor: progress };
  }, [tokens, limit]);

  const formatNumber = React.useCallback((num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  }, []);

  return (
    <div
      data-slot="ai-token-counter"
      role="meter"
      aria-label="Token usage"
      aria-valuenow={tokens}
      aria-valuemin={0}
      aria-valuemax={limit}
      className={cn("flex flex-col gap-1.5", className)}
    >
      <div className="flex items-center justify-between text-sm">
        <span className={cn("font-mono tabular-nums", statusColor)}>
          {formatNumber(tokens)}
        </span>
        <span className="text-muted-foreground">
          / {formatNumber(limit)} tokens
        </span>
      </div>

      {showProgress && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full transition-[width] duration-300 ease-out",
              progressColor,
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {percentage >= 90 && (
        <p className="text-xs text-red-500" role="alert">
          Approaching token limit
        </p>
      )}
    </div>
  );
}

export type { AiTokenCounterProps, ModelPreset };
