"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

export type LoaderHelixProps = {
  dots?: number;
  speed?: number;
  variant?: "dna" | "ribbon" | "minimal";
  className?: string;
};

export function LoaderHelix({
  dots = 12,
  speed = 2,
  variant = "dna",
  className,
}: LoaderHelixProps) {
  const maxDisplacement = 12;
  const dotSpacing = 6;
  const containerHeight = dots * dotSpacing;

  const dotPairs = useMemo(() => {
    return Array.from({ length: dots }, (_, i) => ({
      index: i,
      delayA: (i / dots) * speed,
      delayB: (i / dots) * speed + speed / 2,
    }));
  }, [dots, speed]);

  return (
    <>
      <style>{`
        @keyframes helix-strand-a {
          0% {
            transform: translateX(0px) scale(0.6);
            opacity: 0.3;
          }
          25% {
            transform: translateX(${maxDisplacement}px) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateX(0px) scale(0.6);
            opacity: 0.3;
          }
          75% {
            transform: translateX(-${maxDisplacement}px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(0px) scale(0.6);
            opacity: 0.3;
          }
        }

        @keyframes helix-rung-fade {
          0%, 50%, 100% { opacity: 0.1; }
          25%, 75% { opacity: 0.3; }
        }

        @keyframes helix-ribbon-gradient {
          0% {
            transform: translateX(0px) scale(0.6);
            opacity: 0.2;
          }
          25% {
            transform: translateX(${maxDisplacement}px) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateX(0px) scale(0.6);
            opacity: 0.4;
          }
          75% {
            transform: translateX(-${maxDisplacement}px) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateX(0px) scale(0.6);
            opacity: 0.2;
          }
        }
      `}</style>
      <output
        data-slot="loader-helix"
        aria-live="polite"
        aria-label="Loading"
        className={cn("relative inline-flex flex-col items-center", className)}
        style={{
          width: 80,
          height: containerHeight,
          gap: dotSpacing,
        }}
      >
        <span className="sr-only">Loading</span>

        {variant === "ribbon" ? (
          <div className="relative w-full h-full flex flex-col justify-around items-center">
            {dotPairs.map((pair) => {
              const gradientOpacity = 0.3 + (pair.index / dots) * 0.7;
              return (
                <div
                  key={pair.index}
                  className="absolute left-1/2 rounded-full bg-foreground will-change-transform"
                  style={{
                    width: 5,
                    height: 5,
                    top: pair.index * dotSpacing,
                    animation: `helix-ribbon-gradient ${speed}s ease-in-out infinite`,
                    animationDelay: `${pair.delayA}s`,
                    opacity: gradientOpacity,
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="relative w-full h-full flex flex-col justify-around">
            {dotPairs.map((pair) => (
              <div
                key={pair.index}
                className="relative w-full flex items-center justify-center"
                style={{ height: dotSpacing }}
              >
                <div
                  className="absolute rounded-full bg-foreground will-change-transform"
                  style={{
                    width: 5,
                    height: 5,
                    left: "calc(50% - 12px)",
                    animation: `helix-strand-a ${speed}s ease-in-out infinite`,
                    animationDelay: `${pair.delayA}s`,
                  }}
                />

                <div
                  className="absolute rounded-full bg-foreground will-change-transform"
                  style={{
                    width: 5,
                    height: 5,
                    left: "calc(50% - 12px)",
                    animation: `helix-strand-a ${speed}s ease-in-out infinite`,
                    animationDelay: `${pair.delayB}s`,
                  }}
                />

                {variant === "dna" && (
                  <span
                    className="absolute h-px bg-foreground/20 will-change-transform"
                    style={{
                      width: maxDisplacement * 2,
                      animation: `helix-rung-fade ${speed}s ease-in-out infinite`,
                      animationDelay: `${pair.delayA}s`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </output>
    </>
  );
}

export type { LoaderHelixProps as LoaderHelixPropsType };
