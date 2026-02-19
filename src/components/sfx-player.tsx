"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Pause, Play, Volume2 } from "lucide-react";

import { cn } from "@/lib/utils";

const CIRCUMFERENCE = 2 * Math.PI * 46;

interface SfxPlayerProps {
  name: string;
  src: string;
  duration: number | string;
  category: string;
}

export function SfxPlayer({
  name,
  src,
  duration: rawDuration,
  category,
}: SfxPlayerProps) {
  const displayDuration = parseFloat(String(rawDuration)) || 0;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [strokeOffset, setStrokeOffset] = useState(CIRCUMFERENCE);

  const syncProgress = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;

    const ratio = audio.currentTime / audio.duration;
    setStrokeOffset(CIRCUMFERENCE * (1 - ratio));
    rafRef.current = requestAnimationFrame(syncProgress);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        setStrokeOffset(CIRCUMFERENCE);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      });
    }

    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } else {
      audio.currentTime = 0;
      setStrokeOffset(CIRCUMFERENCE);
      audio.play();
      setIsPlaying(true);
      rafRef.current = requestAnimationFrame(syncProgress);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 w-full max-w-xs">
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "relative flex items-center justify-center w-20 h-20 rounded-full border-2 transition-all duration-200",
          isPlaying
            ? "border-amber-500 bg-amber-500/10 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            : "border-border bg-muted/50 text-muted-foreground hover:border-foreground hover:text-foreground",
        )}
      >
        {isPlaying ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8 ml-1" />
        )}
        <svg
          role="img"
          aria-label="Playback progress"
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            className={cn(
              "transition-opacity duration-200",
              isPlaying ? "text-amber-500 opacity-100" : "opacity-0",
            )}
          />
        </svg>
      </button>

      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-sm font-medium">{name}</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Volume2 className="w-3 h-3" />
          <span>{displayDuration.toFixed(2)}s</span>
          <span className="text-border">|</span>
          <span className="uppercase tracking-wider">{category}</span>
        </div>
      </div>
    </div>
  );
}
