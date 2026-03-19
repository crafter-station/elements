"use client";

import { cn } from "@/lib/utils";

import { hookPreviewData } from "./hook-preview-data";

const lineStyles = {
  command: "text-emerald-400",
  output: "text-zinc-400",
  error: "text-red-400",
  success: "text-emerald-400",
  info: "text-blue-400",
  blocked: "text-amber-400 font-semibold",
};

const linePrefix = {
  command: "$ ",
  output: "  ",
  error: "  ",
  success: "  ",
  info: "  ",
  blocked: "  ",
};

export function HookPreview({
  hook,
  className,
}: {
  hook: string;
  className?: string;
}) {
  const data = hookPreviewData[hook];
  if (!data) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-border overflow-hidden bg-zinc-950 my-6",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-zinc-500 font-mono ml-2">
          {data.title}
        </span>
      </div>
      <div className="p-4 font-mono text-sm leading-6 overflow-x-auto">
        {data.lines.map((line) => (
          <div
            key={`${line.type}-${line.text}`}
            className={lineStyles[line.type]}
          >
            <span className="text-zinc-600 select-none">
              {linePrefix[line.type]}
            </span>
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}
