"use client";

import { Brain, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type ThinkingVariant = "dots" | "pulse" | "brain" | "sparkles";

interface AiThinkingIndicatorProps {
  variant?: ThinkingVariant;
  message?: string;
  showLabel?: boolean;
  className?: string;
}

export function AiThinkingIndicator({
  variant = "dots",
  message = "Thinking",
  showLabel = true,
  className,
}: AiThinkingIndicatorProps) {
  const renderIndicator = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex items-center gap-1">
            <span className="size-2 animate-bounce rounded-full bg-current will-change-transform [animation-delay:-0.3s]" />
            <span className="size-2 animate-bounce rounded-full bg-current will-change-transform [animation-delay:-0.15s]" />
            <span className="size-2 animate-bounce rounded-full bg-current will-change-transform" />
          </div>
        );

      case "pulse":
        return (
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 animate-pulse rounded-full bg-current will-change-[opacity]" />
            <span className="size-2.5 animate-pulse rounded-full bg-current will-change-[opacity] [animation-delay:150ms]" />
            <span className="size-2.5 animate-pulse rounded-full bg-current will-change-[opacity] [animation-delay:300ms]" />
          </div>
        );

      case "brain":
        return <Brain className="size-5 animate-pulse will-change-[opacity]" />;

      case "sparkles":
        return (
          <Sparkles className="size-5 animate-pulse will-change-[opacity]" />
        );

      default:
        return null;
    }
  };

  return (
    <div
      data-slot="ai-thinking-indicator"
      role="status"
      aria-live="polite"
      aria-label={message}
      className={cn(
        "inline-flex items-center gap-2 text-muted-foreground",
        className,
      )}
    >
      {renderIndicator()}
      {showLabel && (
        <span className="text-sm" aria-hidden="true">
          {message}
          <span className="animate-pulse will-change-[opacity]">...</span>
        </span>
      )}
    </div>
  );
}

export type { AiThinkingIndicatorProps, ThinkingVariant };
