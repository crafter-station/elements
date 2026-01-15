"use client";

import * as React from "react";

import { Copy, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface CliOutputLine {
  id: string;
  text: string;
  timestamp?: Date;
}

interface CliOutputProps {
  output: CliOutputLine[] | string[];
  prompt?: string;
  autoScroll?: boolean;
  maxLines?: number;
  showTimestamps?: boolean;
  showControls?: boolean;
  onClear?: () => void;
  className?: string;
}

const ANSI_COLORS: Record<string, string> = {
  "30": "text-gray-900 dark:text-gray-100",
  "31": "text-red-500",
  "32": "text-green-500",
  "33": "text-yellow-500",
  "34": "text-blue-500",
  "35": "text-purple-500",
  "36": "text-cyan-500",
  "37": "text-gray-300",
  "90": "text-gray-500",
  "91": "text-red-400",
  "92": "text-green-400",
  "93": "text-yellow-400",
  "94": "text-blue-400",
  "95": "text-purple-400",
  "96": "text-cyan-400",
  "97": "text-white",
};

const ANSI_BG_COLORS: Record<string, string> = {
  "40": "bg-gray-900",
  "41": "bg-red-500",
  "42": "bg-green-500",
  "43": "bg-yellow-500",
  "44": "bg-blue-500",
  "45": "bg-purple-500",
  "46": "bg-cyan-500",
  "47": "bg-gray-300",
};

const ANSI_STYLES: Record<string, string> = {
  "1": "font-bold",
  "2": "opacity-50",
  "3": "italic",
  "4": "underline",
  "9": "line-through",
};

function parseAnsi(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\x1b\[([0-9;]*)m/g;
  let lastIndex = 0;
  let currentClasses: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const segment = text.slice(lastIndex, match.index);
      if (segment) {
        parts.push(
          <span key={lastIndex} className={currentClasses.join(" ")}>
            {segment}
          </span>,
        );
      }
    }

    const codes = match[1].split(";");
    for (const code of codes) {
      if (code === "0" || code === "") {
        currentClasses = [];
      } else if (ANSI_COLORS[code]) {
        currentClasses = currentClasses.filter((c) => !c.startsWith("text-"));
        currentClasses.push(ANSI_COLORS[code]);
      } else if (ANSI_BG_COLORS[code]) {
        currentClasses = currentClasses.filter((c) => !c.startsWith("bg-"));
        currentClasses.push(ANSI_BG_COLORS[code]);
      } else if (ANSI_STYLES[code]) {
        currentClasses.push(ANSI_STYLES[code]);
      }
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex);
    if (remaining) {
      parts.push(
        <span key={lastIndex} className={currentClasses.join(" ")}>
          {remaining}
        </span>,
      );
    }
  }

  return parts.length > 0 ? parts : [text];
}

export function CliOutput({
  output,
  prompt = "$",
  autoScroll = true,
  maxLines,
  showTimestamps = false,
  showControls = true,
  onClear,
  className,
}: CliOutputProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  const lines: CliOutputLine[] = React.useMemo(() => {
    const normalized = output.map((item, idx) => {
      if (typeof item === "string") {
        return { id: `line-${idx}`, text: item };
      }
      return item;
    });
    if (maxLines && normalized.length > maxLines) {
      return normalized.slice(-maxLines);
    }
    return normalized;
  }, [output, maxLines]);

  React.useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, autoScroll]);

  const handleCopy = React.useCallback(async () => {
    const text = lines
      .map((l) => l.text.replace(/\x1b\[[0-9;]*m/g, ""))
      .join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [lines]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div
      data-slot="cli-output"
      className={cn(
        "flex flex-col rounded-lg border border-border bg-gray-950 text-gray-100 overflow-hidden",
        className,
      )}
    >
      {showControls && (
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-gray-900">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              aria-label={copied ? "Copied" : "Copy output"}
            >
              <Copy className="w-3.5 h-3.5" />
              {copied && (
                <span
                  className="absolute text-xs text-green-400 -mt-4 -ml-2"
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
            </button>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                aria-label="Clear output"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        className="flex-1 overflow-auto p-3 font-mono text-sm"
      >
        {lines.map((line) => (
          <div key={line.id} className="flex gap-2 leading-relaxed">
            {showTimestamps && line.timestamp && (
              <span className="text-gray-600 shrink-0">
                [{formatTime(line.timestamp)}]
              </span>
            )}
            <span className="text-green-400 shrink-0">{prompt}</span>
            <span className="flex-1 whitespace-pre-wrap break-all">
              {parseAnsi(line.text)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { CliOutputProps, CliOutputLine };
