"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const CHARSETS = {
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?/~",
  binary: "01",
  hex: "0123456789ABCDEF",
};

type DisplayChar = {
  char: string;
  resolved: boolean;
};

export type LoaderTerminalDecodeProps = {
  text?: string;
  speed?: number;
  charset?: "symbols" | "binary" | "hex";
  loop?: boolean;
  className?: string;
};

export function LoaderTerminalDecode({
  text = "LOADING",
  speed = 30,
  charset = "symbols",
  loop = true,
  className,
}: LoaderTerminalDecodeProps) {
  const [displayChars, setDisplayChars] = useState<DisplayChar[]>([]);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastResolveTimeRef = useRef<number>(0);
  const resolvedCountRef = useRef<number>(0);
  const isWaitingRef = useRef<boolean>(false);
  const waitStartRef = useRef<number>(0);

  const chars = CHARSETS[charset];

  const getRandomChar = useCallback(
    () => chars[Math.floor(Math.random() * chars.length)],
    [chars],
  );

  const reset = useCallback(() => {
    setDisplayChars(
      text.split("").map((char) => ({
        char: char === " " ? " " : getRandomChar(),
        resolved: char === " ",
      })),
    );
    resolvedCountRef.current = text.split("").filter((c) => c === " ").length;
    lastResolveTimeRef.current = 0;
    isWaitingRef.current = false;
  }, [text, getRandomChar]);

  useEffect(() => {
    reset();
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;

      if (isWaitingRef.current) {
        if (currentTime - waitStartRef.current >= 1500) {
          reset();
          startTimeRef.current = currentTime;
          lastResolveTimeRef.current = 0;
        }
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const shouldResolveNext =
        resolvedCountRef.current < text.length &&
        elapsed - lastResolveTimeRef.current >= speed;

      setDisplayChars((prev) =>
        prev.map((item, index) => {
          if (item.resolved) {
            return item;
          }

          if (text[index] === " ") {
            return { char: " ", resolved: true };
          }

          if (shouldResolveNext && index === resolvedCountRef.current) {
            lastResolveTimeRef.current = elapsed;
            resolvedCountRef.current++;
            return { char: text[index], resolved: true };
          }

          return { char: getRandomChar(), resolved: false };
        }),
      );

      if (resolvedCountRef.current >= text.length) {
        if (loop) {
          isWaitingRef.current = true;
          waitStartRef.current = currentTime;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [text, speed, loop, reset, getRandomChar]);

  return (
    <output
      data-slot="loader-terminal-decode"
      aria-live="polite"
      aria-label={text}
      className={cn("inline-flex font-mono", className)}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex">
        {displayChars.map((item, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: stable list derived from fixed text length
            key={i}
            className={cn(
              "inline-block w-[1ch] text-center transition-colors duration-150",
              item.resolved ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {item.char}
          </span>
        ))}
      </span>
    </output>
  );
}
