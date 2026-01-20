"use client";

import { cn } from "@/lib/utils";

type QueueStatus = "pending" | "processing" | "completed" | "failed" | "scheduled";

interface UpstashQueueCardProps {
  id: string;
  status: QueueStatus;
  payload?: string;
  scheduledAt?: Date | string;
  completedAt?: Date | string;
  retries?: number;
  maxRetries?: number;
  error?: string;
  className?: string;
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LoaderIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

const STATUS_CONFIG: Record<QueueStatus, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; label: string }> = {
  pending: { icon: ClockIcon, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Pending" },
  processing: { icon: LoaderIcon, color: "text-blue-500", bg: "bg-blue-500/10", label: "Processing" },
  completed: { icon: CheckIcon, color: "text-green-500", bg: "bg-green-500/10", label: "Completed" },
  failed: { icon: XIcon, color: "text-destructive", bg: "bg-destructive/10", label: "Failed" },
  scheduled: { icon: CalendarIcon, color: "text-purple-500", bg: "bg-purple-500/10", label: "Scheduled" },
};

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UpstashQueueCard({
  id,
  status,
  payload,
  scheduledAt,
  completedAt,
  retries = 0,
  maxRetries = 3,
  error,
  className,
}: UpstashQueueCardProps) {
  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon;

  return (
    <div
      data-slot="upstash-queue-card"
      className={cn(
        "rounded-lg border border-border bg-card p-4",
        "flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-md", config.bg)}>
            <StatusIcon className={cn("w-4 h-4", config.color)} />
          </div>
          <span className={cn("text-sm font-medium", config.color)}>
            {config.label}
          </span>
        </div>
        <code className="text-xs text-muted-foreground font-mono">
          {id.slice(0, 8)}...
        </code>
      </div>

      {payload && (
        <div className="rounded-md bg-muted/50 p-2">
          <pre className="text-xs text-muted-foreground overflow-x-auto">
            {payload.length > 100 ? `${payload.slice(0, 100)}...` : payload}
          </pre>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {scheduledAt && (
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            <span>{formatDate(scheduledAt)}</span>
          </div>
        )}
        {completedAt && status === "completed" && (
          <div className="flex items-center gap-1">
            <CheckIcon className="w-3 h-3" />
            <span>{formatDate(completedAt)}</span>
          </div>
        )}
        {retries > 0 && (
          <div className="flex items-center gap-1">
            <RefreshIcon className="w-3 h-3" />
            <span>{retries}/{maxRetries} retries</span>
          </div>
        )}
      </div>

      {error && status === "failed" && (
        <div className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
