"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

export type LoaderDotMatrixProps = {
  rows?: number;
  cols?: number;
  pattern?: "ripple" | "wave" | "rain";
  speed?: number;
  dotSize?: number;
  className?: string;
};

export function LoaderDotMatrix({
  rows = 5,
  cols = 7,
  pattern = "ripple",
  speed = 1.5,
  dotSize = 3,
  className,
}: LoaderDotMatrixProps) {
  const dots = useMemo(() => {
    const result = [];
    const centerX = (cols - 1) / 2;
    const centerY = (rows - 1) / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let delay = 0;

        if (pattern === "ripple") {
          const distance = Math.sqrt(
            (col - centerX) ** 2 + (row - centerY) ** 2,
          );
          delay = (distance / maxDist) * speed;
        } else if (pattern === "wave") {
          delay = ((row + col) / (rows + cols - 2)) * speed;
        } else if (pattern === "rain") {
          delay = row * 0.1 + (col / cols) * speed;
        }

        result.push({ row, col, delay });
      }
    }

    return result;
  }, [rows, cols, pattern, speed]);

  const gap = dotSize * 1.5;

  return (
    <output
      data-slot="loader-dot-matrix"
      aria-live="polite"
      aria-label="Loading"
      className={cn("inline-flex", className)}
    >
      <style>
        {`
          @keyframes dot-matrix-pulse {
            0%, 100% { opacity: 0.15; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
      <span className="sr-only">Loading</span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        {dots.map(({ delay }, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: stable list derived from fixed grid dimensions
            key={index}
            className="rounded-full bg-foreground will-change-transform"
            style={{
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              animation: `dot-matrix-pulse ${speed}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>
    </output>
  );
}
