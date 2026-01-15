"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type StreamingMode = "character" | "word";

interface AiStreamingTextProps {
  text: string;
  speed?: number;
  mode?: StreamingMode;
  showCursor?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function AiStreamingText({
  text,
  speed = 30,
  mode = "character",
  showCursor = true,
  onComplete,
  className,
}: AiStreamingTextProps) {
  const [displayedText, setDisplayedText] = React.useState("");
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);

    if (!text) return;

    const tokens = mode === "word" ? text.split(/(\s+)/) : text.split("");
    let currentIndex = 0;
    let isCancelled = false;
    let lastTime = 0;

    const animate = (time: number) => {
      if (isCancelled) return;

      if (time - lastTime >= speed) {
        lastTime = time;
        const token = tokens[currentIndex];
        if (currentIndex < tokens.length && token !== undefined) {
          setDisplayedText((prev) => prev + token);
          currentIndex++;
        } else {
          if (!isCancelled) {
            setIsComplete(true);
            onComplete?.();
          }
          return;
        }
      }

      requestAnimationFrame(animate);
    };

    const frameId = requestAnimationFrame(animate);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, [text, speed, mode, onComplete]);

  return (
    <div
      data-slot="ai-streaming-text"
      role="status"
      aria-live="polite"
      aria-label="AI response"
      className={cn("relative", className)}
    >
      <span className="whitespace-pre-wrap">{displayedText}</span>
      {showCursor && !isComplete && (
        <span className="ml-0.5 inline-block h-[1.2em] w-[2px] animate-pulse bg-current align-middle will-change-[opacity]" />
      )}
    </div>
  );
}

export type { AiStreamingTextProps, StreamingMode };
