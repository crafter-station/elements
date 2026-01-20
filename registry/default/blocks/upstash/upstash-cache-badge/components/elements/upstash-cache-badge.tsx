"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CacheStatus = "hit" | "miss" | "stale" | "expired";

interface UpstashCacheBadgeProps {
  status: CacheStatus;
  ttl?: number;
  showTtl?: boolean;
  onRefresh?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function CloudOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 2 20 20" />
      <path d="M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193" />
      <path d="M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7 7 0 0 0 8 5.789" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
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

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

const STATUS_CONFIG: Record<CacheStatus, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; label: string }> = {
  hit: { icon: ZapIcon, color: "text-green-500", bg: "bg-green-500/10 border-green-500/20", label: "HIT" },
  miss: { icon: CloudOffIcon, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20", label: "MISS" },
  stale: { icon: ClockIcon, color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20", label: "STALE" },
  expired: { icon: AlertIcon, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", label: "EXPIRED" },
};

const SIZE_CLASSES = {
  sm: { badge: "px-2 h-6 text-xs gap-1", icon: "w-3 h-3", ttl: "text-[10px]" },
  md: { badge: "px-2.5 h-8 text-sm gap-1.5", icon: "w-3.5 h-3.5", ttl: "text-xs" },
  lg: { badge: "px-3 h-10 text-base gap-2", icon: "w-4 h-4", ttl: "text-sm" },
};

function formatTtl(seconds: number): string {
  if (seconds <= 0) return "0s";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

export function UpstashCacheBadge({
  status,
  ttl,
  showTtl = true,
  onRefresh,
  size = "md",
  className,
}: UpstashCacheBadgeProps) {
  const [remainingTtl, setRemainingTtl] = useState(ttl);
  const config = STATUS_CONFIG[status];
  const sizes = SIZE_CLASSES[size];
  const StatusIcon = config.icon;

  useEffect(() => {
    if (!ttl || !showTtl || status !== "hit") return;

    setRemainingTtl(ttl);
    const interval = setInterval(() => {
      setRemainingTtl((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ttl, showTtl, status]);

  return (
    <div
      data-slot="upstash-cache-badge"
      className={cn("inline-flex items-center", className)}
    >
      <div
        className={cn(
          "inline-flex items-center rounded-l-md border font-mono font-medium",
          sizes.badge,
          config.bg,
          config.color
        )}
      >
        <StatusIcon className={sizes.icon} />
        <span>{config.label}</span>
      </div>

      {showTtl && remainingTtl !== undefined && remainingTtl > 0 && status === "hit" && (
        <div
          className={cn(
            "inline-flex items-center border border-l-0 rounded-r-md bg-muted/50 text-muted-foreground font-mono",
            sizes.badge
          )}
        >
          <span className={sizes.ttl}>TTL: {formatTtl(remainingTtl)}</span>
        </div>
      )}

      {onRefresh && (status === "miss" || status === "stale" || status === "expired") && (
        <button
          type="button"
          onClick={onRefresh}
          className={cn(
            "inline-flex items-center border border-l-0 rounded-r-md",
            "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            sizes.badge
          )}
        >
          <RefreshIcon className={sizes.icon} />
        </button>
      )}
    </div>
  );
}
