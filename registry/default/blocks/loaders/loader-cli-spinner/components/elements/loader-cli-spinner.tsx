"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { CLI_SPINNERS, type CliSpinnerVariant } from "./cli-spinner-data";

export type LoaderCliSpinnerProps = {
  variant?: CliSpinnerVariant;
  speed?: number;
  size?: number | string;
  paused?: boolean;
  ariaLabel?: string;
  className?: string;
};

export function LoaderCliSpinner({
  variant = "braille-spin",
  speed = 1,
  size = "1em",
  paused = false,
  ariaLabel = "Loading",
  className,
}: LoaderCliSpinnerProps) {
  const spinner = CLI_SPINNERS[variant] ?? CLI_SPINNERS["braille-spin"];
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setIndex(0);
    if (paused || speed <= 0) return;
    const delay = Math.max(16, spinner.interval / speed);
    const id = window.setInterval(() => {
      indexRef.current = (indexRef.current + 1) % spinner.frames.length;
      setIndex(indexRef.current);
    }, delay);
    return () => window.clearInterval(id);
  }, [spinner, speed, paused]);

  const fontSize = typeof size === "number" ? `${size}px` : size;

  return (
    <output
      aria-label={ariaLabel}
      aria-live="polite"
      className={cn(
        "inline-flex items-center justify-center font-mono leading-none tabular-nums",
        className,
      )}
      style={{ fontSize, minWidth: "1ch" }}
    >
      <span aria-hidden="true">{spinner.frames[index]}</span>
    </output>
  );
}

export type { CliSpinnerVariant } from "./cli-spinner-data";
export { CLI_SPINNER_VARIANTS } from "./cli-spinner-data";
