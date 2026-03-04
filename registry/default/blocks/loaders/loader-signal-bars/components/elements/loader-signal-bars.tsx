"use client";

import { cn } from "@/lib/utils";

const sizeConfig = {
  sm: { height: "h-4", width: "w-0.5", gap: "gap-0.5" },
  md: { height: "h-6", width: "w-[3px]", gap: "gap-[3px]" },
  lg: { height: "h-8", width: "w-1", gap: "gap-1" },
};

export interface LoaderSignalBarsProps {
  bars?: number;
  variant?: "equalizer" | "waveform" | "heartbeat";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoaderSignalBars({
  bars = 5,
  variant = "equalizer",
  size = "md",
  className,
}: LoaderSignalBarsProps) {
  const { height, width, gap } = sizeConfig[size];
  const barArray = Array.from({ length: bars }, (_, i) => i);

  const getAnimationStyle = (index: number) => {
    if (variant === "equalizer") {
      const durations = [0.8, 1.1, 0.9, 1.3, 1.0];
      const duration = durations[index % durations.length];
      const delay = index * 0.1;
      return {
        animation: `equalizer ${duration}s ease-in-out ${delay}s infinite`,
      };
    }

    if (variant === "waveform") {
      const delay = index * 0.15;
      return {
        animation: `waveform 1.2s ease-in-out ${delay}s infinite`,
      };
    }

    if (variant === "heartbeat") {
      return {
        animation: `heartbeat 1.5s ease-in-out infinite`,
      };
    }

    return {};
  };

  return (
    <>
      <style>{`
        @keyframes equalizer {
          0%, 100% {
            transform: scaleY(0.3);
          }
          50% {
            transform: scaleY(1);
          }
        }

        @keyframes waveform {
          0%, 100% {
            transform: scaleY(0.4);
          }
          50% {
            transform: scaleY(1);
          }
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scaleY(0.3);
          }
          10% {
            transform: scaleY(1);
          }
          20% {
            transform: scaleY(0.3);
          }
          30% {
            transform: scaleY(0.9);
          }
          40%, 60% {
            transform: scaleY(0.3);
          }
        }
      `}</style>
      <output
        data-slot="loader-signal-bars"
        aria-live="polite"
        aria-label="Loading"
        className={cn("flex items-center justify-center", gap, className)}
      >
        <span className="sr-only">Loading</span>
        {barArray.map((index) => (
          <span
            key={index}
            className={cn(
              "rounded-full bg-foreground origin-center will-change-transform",
              height,
              width,
            )}
            style={getAnimationStyle(index)}
          />
        ))}
      </output>
    </>
  );
}

export type { LoaderSignalBarsProps as LoaderSignalBarsPropsType };
