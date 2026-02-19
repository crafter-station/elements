"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

const R = 14;
const CIRCUMFERENCE = 2 * Math.PI * R;

interface SfxCardPlayerProps {
  name: string;
  title: string;
  href: string;
  src: string;
  duration: number;
  category: string;
}

export function SfxCardPlayer({
  name,
  title,
  href,
  src,
  duration,
  category,
}: SfxCardPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [offset, setOffset] = useState(CIRCUMFERENCE);

  const sync = useCallback(() => {
    const a = audioRef.current;
    if (!a || a.paused) return;
    setOffset(CIRCUMFERENCE * (1 - a.currentTime / a.duration));
    rafRef.current = requestAnimationFrame(sync);
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        setOffset(CIRCUMFERENCE);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      });
    }

    const a = audioRef.current;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } else {
      a.currentTime = 0;
      setOffset(CIRCUMFERENCE);
      a.play();
      setIsPlaying(true);
      rafRef.current = requestAnimationFrame(sync);
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-md border bg-card p-3 outline-none transition-colors hover:bg-accent group">
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "relative flex shrink-0 items-center justify-center w-8 h-8 rounded-full border transition-colors",
          isPlaying
            ? "border-amber-500 bg-amber-500/10 text-amber-500"
            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
        )}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5" />
        ) : (
          <Play className="w-3.5 h-3.5 ml-0.5" />
        )}
        <svg
          role="img"
          aria-label="Playback progress"
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox="0 0 32 32"
        >
          <circle
            cx="16"
            cy="16"
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(
              "transition-opacity duration-200",
              isPlaying ? "text-amber-500 opacity-100" : "opacity-0",
            )}
          />
        </svg>
      </button>

      <Link
        href={href}
        className="flex flex-1 min-w-0 items-center justify-between gap-2"
      >
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{title}</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{name}</span>
            <span className="text-border">·</span>
            <span>{duration.toFixed(2)}s</span>
            <span className="text-border">·</span>
            <span className="uppercase tracking-wider">{category}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
