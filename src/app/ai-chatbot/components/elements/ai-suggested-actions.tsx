"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

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
      className={cn("grid gap-2 sm:grid-cols-2", className)}
    >
      {suggestions.map((suggestion, index) => (
        <Button
          key={suggestion.prompt}
          variant="outline"
          onClick={() => onSelect?.(suggestion.prompt)}
          className={cn(
            "h-auto whitespace-normal p-3 text-left justify-start",
            "hover:bg-muted transition-colors"
          )}
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <span className="text-sm">{suggestion.label}</span>
        </Button>
      ))}
    </div>
  );
}

export { AiSuggestedActions };
export type { AiSuggestedActionsProps, Suggestion };
