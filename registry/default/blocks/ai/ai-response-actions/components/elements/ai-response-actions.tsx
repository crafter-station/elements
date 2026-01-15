"use client";

import * as React from "react";

import {
  Check,
  Copy,
  RefreshCw,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FeedbackType = "positive" | "negative" | null;

interface AiResponseActionsProps {
  content?: string;
  onRegenerate?: () => void;
  onFeedback?: (type: FeedbackType) => void;
  onShare?: () => void;
  compact?: boolean;
  className?: string;
}

export function AiResponseActions({
  content,
  onRegenerate,
  onFeedback,
  onShare,
  compact = false,
  className,
}: AiResponseActionsProps) {
  const [copied, setCopied] = React.useState(false);
  const [feedback, setFeedback] = React.useState<FeedbackType>(null);

  const handleCopy = React.useCallback(async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  const handleFeedback = React.useCallback(
    (type: FeedbackType) => {
      const newFeedback = feedback === type ? null : type;
      setFeedback(newFeedback);
      onFeedback?.(newFeedback);
    },
    [feedback, onFeedback],
  );

  const buttonSize = compact ? "size-7" : "size-8";
  const iconSize = compact ? "size-3.5" : "size-4";

  return (
    <TooltipProvider delayDuration={300}>
      <div
        data-slot="ai-response-actions"
        role="toolbar"
        aria-label="Response actions"
        className={cn(
          "inline-flex items-center gap-1 rounded-lg border bg-background p-1",
          className,
        )}
      >
        {content && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={buttonSize}
                onClick={handleCopy}
                aria-label={copied ? "Copied" : "Copy response"}
              >
                {copied ? (
                  <Check className={cn(iconSize, "text-green-500")} />
                ) : (
                  <Copy className={iconSize} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Copied!" : "Copy"}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {onRegenerate && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={buttonSize}
                onClick={onRegenerate}
                aria-label="Regenerate response"
              >
                <RefreshCw className={iconSize} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Regenerate</p>
            </TooltipContent>
          </Tooltip>
        )}

        {onFeedback && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    buttonSize,
                    feedback === "positive" &&
                      "bg-green-100 text-green-600 dark:bg-green-900/30",
                  )}
                  onClick={() => handleFeedback("positive")}
                  aria-label="Rate positive"
                  aria-pressed={feedback === "positive"}
                >
                  <ThumbsUp className={iconSize} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Good response</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    buttonSize,
                    feedback === "negative" &&
                      "bg-red-100 text-red-600 dark:bg-red-900/30",
                  )}
                  onClick={() => handleFeedback("negative")}
                  aria-label="Rate negative"
                  aria-pressed={feedback === "negative"}
                >
                  <ThumbsDown className={iconSize} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bad response</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}

        {onShare && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={buttonSize}
                onClick={onShare}
                aria-label="Share response"
              >
                <Share2 className={iconSize} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

export type { AiResponseActionsProps, FeedbackType };
