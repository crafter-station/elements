"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface Suggestion {
  label: string;
  prompt: string;
}

interface AiSuggestedActionsProps {
  suggestions: Suggestion[];
  onSelect?: (prompt: string) => void;
  className?: string;
}

function AiSuggestedActions({
  suggestions,
  onSelect,
  className,
}: AiSuggestedActionsProps) {
  return (
    <div
      data-slot="ai-suggested-actions"
      className={cn("grid gap-2 font-mono sm:grid-cols-2", className)}
    >
      {suggestions.map((suggestion, index) => (
        <button
          type="button"
          key={suggestion.prompt}
          onClick={() => onSelect?.(suggestion.prompt)}
          className="border bg-background p-3 text-left text-xs transition-colors hover:bg-muted"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          {suggestion.label}
        </button>
      ))}
    </div>
  );
}

export { AiSuggestedActions };
export type { AiSuggestedActionsProps, Suggestion };
