"use client";

import React, { type JSX, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type TypewriterSegment =
  | string
  | {
      text: string;
      className?: string;
      delay?: number;
      speed?: number;
    };

export type TypewriterProps = {
  text: TypewriterSegment | TypewriterSegment[];
  as?: React.ElementType;
  className?: string;
  speed?: number;
  delay?: number;
  startOnView?: boolean;
  loop?: boolean;
  loopDelay?: number;
  cursor?: boolean;
  cursorCharacter?: string;
  cursorClassName?: string;
  onComplete?: () => void;
};

const DEFAULT_SPEED = 30;

function normalize(text: TypewriterProps["text"]) {
  const segments = Array.isArray(text) ? text : [text];
  return segments.map((segment) =>
    typeof segment === "string" ? { text: segment } : segment,
  );
}

function TypewriterBase({
  text,
  as: Component = "span",
  className,
  speed = DEFAULT_SPEED,
  delay = 0,
  startOnView = false,
  loop = false,
  loopDelay = 1500,
  cursor = true,
  cursorCharacter = "|",
  cursorClassName,
  onComplete,
}: TypewriterProps) {
  const segments = useMemo(() => normalize(text), [text]);
  const containerRef = useRef<HTMLElement | null>(null);
  const [started, setStarted] = useState(!startOnView);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!startOnView || started || !containerRef.current) return;
    const node = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [startOnView, started]);

  useEffect(() => {
    if (!started) return;
    if (segmentIndex >= segments.length) {
      setDone(true);
      onComplete?.();
      if (loop) {
        const resetTimer = window.setTimeout(() => {
          setDone(false);
          setSegmentIndex(0);
          setCharIndex(0);
        }, loopDelay);
        return () => window.clearTimeout(resetTimer);
      }
      return;
    }

    const current = segments[segmentIndex];
    if (!current) return;
    const currentSpeed = current.speed ?? speed;
    const segmentDelay = current.delay ?? 0;
    const isFirstChar = charIndex === 0;
    const leadingDelay = isFirstChar
      ? segmentIndex === 0
        ? delay + segmentDelay
        : segmentDelay
      : 0;

    if (charIndex < current.text.length) {
      const wait = isFirstChar ? leadingDelay + currentSpeed : currentSpeed;
      const timer = window.setTimeout(() => {
        setCharIndex((idx) => idx + 1);
      }, wait);
      return () => window.clearTimeout(timer);
    }

    setSegmentIndex((idx) => idx + 1);
    setCharIndex(0);
    return;
  }, [
    started,
    segmentIndex,
    charIndex,
    segments,
    speed,
    delay,
    loop,
    loopDelay,
    onComplete,
  ]);

  const MotionComponent = Component as keyof JSX.IntrinsicElements;

  const segmentsWithKeys = useMemo(
    () =>
      segments.map((segment, idx) => ({
        ...segment,
        key: `${idx}-${segment.text.slice(0, 24)}`,
      })),
    [segments],
  );

  const renderedSegments = segmentsWithKeys.map((segment, idx) => {
    if (idx > segmentIndex) return null;
    const value =
      idx < segmentIndex ? segment.text : segment.text.slice(0, charIndex);
    if (!value) return null;
    return (
      <span key={segment.key} className={cn(segment.className)}>
        {value}
      </span>
    );
  });

  return React.createElement(
    MotionComponent,
    {
      ref: containerRef as React.RefObject<HTMLElement>,
      "data-slot": "typewriter",
      className: cn("inline-block whitespace-pre-wrap", className),
      "aria-live": "polite",
    },
    <>
      {renderedSegments}
      {cursor && (
        <span
          aria-hidden="true"
          className={cn(
            "inline-block translate-y-[0.05em] animate-[typewriter-blink_1s_steps(1)_infinite]",
            done && !loop && "opacity-0",
            cursorClassName,
          )}
          style={{
            marginLeft: done ? 0 : "0.05em",
          }}
        >
          {cursorCharacter}
        </span>
      )}
      <style>{`
        @keyframes typewriter-blink {
          50% { opacity: 0; }
        }
      `}</style>
    </>,
  );
}

export const Typewriter = React.memo(TypewriterBase);
