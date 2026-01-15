"use client";

import * as React from "react";

import {
  Activity,
  AlertCircle,
  CheckCircle,
  Flag,
  MessageSquare,
  Pause,
  Play,
  Trash2,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ChunkType = "text" | "tool_call" | "tool_result" | "error" | "finish";

interface StreamChunk {
  id: string;
  type: ChunkType;
  content: string;
  timestamp: Date;
}

interface AiStreamDebuggerContextValue {
  chunks: StreamChunk[];
  isStreaming: boolean;
  isPaused: boolean;
  autoScroll: boolean;
  setIsPaused: (paused: boolean) => void;
  clearChunks?: () => void;
}

const AiStreamDebuggerContext =
  React.createContext<AiStreamDebuggerContextValue | null>(null);

function useStreamDebuggerContext() {
  const context = React.useContext(AiStreamDebuggerContext);
  if (!context) {
    throw new Error(
      "AiStreamDebugger components must be used within <AiStreamDebugger>",
    );
  }
  return context;
}

interface AiStreamDebuggerProps {
  chunks: StreamChunk[];
  isStreaming?: boolean;
  autoScroll?: boolean;
  maxChunks?: number;
  onClear?: () => void;
  children?: React.ReactNode;
  className?: string;
}

function AiStreamDebugger({
  chunks,
  isStreaming = false,
  autoScroll = true,
  maxChunks = 100,
  onClear,
  children,
  className,
}: AiStreamDebuggerProps) {
  const [isPaused, setIsPaused] = React.useState(false);

  const displayedChunks = React.useMemo(() => {
    const sliced = chunks.slice(-maxChunks);
    return sliced;
  }, [chunks, maxChunks]);

  const contextValue = React.useMemo(
    () => ({
      chunks: displayedChunks,
      isStreaming,
      isPaused,
      autoScroll,
      setIsPaused,
      clearChunks: onClear,
    }),
    [displayedChunks, isStreaming, isPaused, autoScroll, onClear],
  );

  return (
    <AiStreamDebuggerContext.Provider value={contextValue}>
      <div
        data-slot="ai-stream-debugger"
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground overflow-hidden flex flex-col",
          className,
        )}
      >
        {children}
      </div>
    </AiStreamDebuggerContext.Provider>
  );
}

interface AiStreamDebuggerHeaderProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

function AiStreamDebuggerHeader({
  title = "Stream Debugger",
  children,
  className,
}: AiStreamDebuggerHeaderProps) {
  const { chunks, isStreaming, isPaused, setIsPaused, clearChunks } =
    useStreamDebuggerContext();

  return (
    <div
      data-slot="ai-stream-debugger-header"
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30",
        className,
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Activity
          className={cn(
            "size-4",
            isStreaming && !isPaused
              ? "text-green-500 animate-pulse"
              : "text-muted-foreground",
          )}
        />
      </div>
      <div className="flex flex-1 items-center gap-2">
        <span className="font-medium text-sm">{title}</span>
        {isStreaming && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              isPaused
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
            )}
          >
            <span className="relative flex size-2">
              {!isPaused && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
              )}
              <span
                className={cn(
                  "relative inline-flex size-2 rounded-full",
                  isPaused ? "bg-yellow-500" : "bg-green-500",
                )}
              />
            </span>
            {isPaused ? "Paused" : "Live"}
          </span>
        )}
        <span className="text-xs text-muted-foreground">
          {chunks.length} chunks
        </span>
      </div>
      <div className="flex items-center gap-1">
        {isStreaming && (
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="inline-flex items-center justify-center size-8 rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? (
              <Play className="size-4 text-muted-foreground" />
            ) : (
              <Pause className="size-4 text-muted-foreground" />
            )}
          </button>
        )}
        {clearChunks && (
          <button
            type="button"
            onClick={clearChunks}
            className="inline-flex items-center justify-center size-8 rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title="Clear"
          >
            <Trash2 className="size-4 text-muted-foreground" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

interface AiStreamDebuggerContentProps {
  className?: string;
}

function AiStreamDebuggerContent({ className }: AiStreamDebuggerContentProps) {
  const { chunks, isPaused, autoScroll } = useStreamDebuggerContext();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const shouldAutoScroll = autoScroll && !isPaused;

  React.useEffect(() => {
    if (shouldAutoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [shouldAutoScroll]);

  if (chunks.length === 0) {
    return (
      <div
        data-slot="ai-stream-debugger-content"
        className={cn(
          "flex-1 flex items-center justify-center p-8 text-muted-foreground",
          className,
        )}
      >
        <div className="text-center">
          <Activity className="mx-auto size-8 opacity-50" />
          <p className="mt-2 text-sm">Waiting for stream data...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-slot="ai-stream-debugger-content"
      className={cn("flex-1 overflow-y-auto min-h-0 max-h-80", className)}
    >
      <div className="divide-y divide-border">
        {chunks.map((chunk) => (
          <AiStreamDebuggerChunk key={chunk.id} chunk={chunk} />
        ))}
      </div>
    </div>
  );
}

interface AiStreamDebuggerChunkProps {
  chunk: StreamChunk;
  className?: string;
}

function AiStreamDebuggerChunk({
  chunk,
  className,
}: AiStreamDebuggerChunkProps) {
  const typeConfig = React.useMemo(() => {
    const configs: Record<
      ChunkType,
      { icon: React.ReactNode; label: string; className: string }
    > = {
      text: {
        icon: <MessageSquare className="size-3.5" />,
        label: "text",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      },
      tool_call: {
        icon: <Wrench className="size-3.5" />,
        label: "tool_call",
        className:
          "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
      },
      tool_result: {
        icon: <CheckCircle className="size-3.5" />,
        label: "tool_result",
        className:
          "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
      },
      error: {
        icon: <AlertCircle className="size-3.5" />,
        label: "error",
        className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      },
      finish: {
        icon: <Flag className="size-3.5" />,
        label: "finish",
        className: "bg-muted text-muted-foreground",
      },
    };
    return configs[chunk.type];
  }, [chunk.type]);

  const formattedTime = React.useMemo(() => {
    return chunk.timestamp.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  }, [chunk.timestamp]);

  return (
    <div
      data-slot="ai-stream-debugger-chunk"
      data-type={chunk.type}
      className={cn(
        "flex items-start gap-3 px-4 py-2 text-sm",
        chunk.type === "error" && "bg-red-50/50 dark:bg-red-950/20",
        className,
      )}
    >
      <span className="shrink-0 text-xs font-mono text-muted-foreground pt-0.5">
        {formattedTime}
      </span>
      <span
        className={cn(
          "inline-flex items-center gap-1 shrink-0 rounded px-1.5 py-0.5 text-xs font-medium",
          typeConfig.className,
        )}
      >
        {typeConfig.icon}
        {typeConfig.label}
      </span>
      <span className="flex-1 font-mono text-xs text-foreground whitespace-pre-wrap break-all">
        {chunk.content}
      </span>
    </div>
  );
}

export {
  AiStreamDebugger,
  AiStreamDebuggerHeader,
  AiStreamDebuggerContent,
  AiStreamDebuggerChunk,
};
export type { AiStreamDebuggerProps, StreamChunk, ChunkType };
