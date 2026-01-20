"use client";

import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  avatar?: string;
  highlight?: boolean;
}

interface UpstashLeaderboardProps {
  entries: LeaderboardEntry[];
  title?: string;
  showRank?: boolean;
  maxEntries?: number;
  scoreLabel?: string;
  scoreFormat?: (score: number) => string;
  className?: string;
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </svg>
  );
}

const RANK_COLORS: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-amber-600",
};

const RANK_BG: Record<number, string> = {
  1: "bg-yellow-500/10",
  2: "bg-gray-400/10",
  3: "bg-amber-600/10",
};

function defaultScoreFormat(score: number): string {
  return score.toLocaleString();
}

export function UpstashLeaderboard({
  entries,
  title = "Leaderboard",
  showRank = true,
  maxEntries = 10,
  scoreLabel = "Score",
  scoreFormat = defaultScoreFormat,
  className,
}: UpstashLeaderboardProps) {
  const displayEntries = entries.slice(0, maxEntries);

  return (
    <div
      data-slot="upstash-leaderboard"
      className={cn(
        "rounded-lg border border-border bg-card overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <TrophyIcon className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <span className="text-xs text-muted-foreground">{scoreLabel}</span>
      </div>

      <div className="divide-y divide-border">
        {displayEntries.map((entry, index) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;

          return (
            <div
              key={entry.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 transition-colors",
                entry.highlight && "bg-primary/5",
                !entry.highlight && "hover:bg-muted/30"
              )}
            >
              {showRank && (
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    isTopThree ? RANK_BG[rank] : "bg-muted",
                    isTopThree ? RANK_COLORS[rank] : "text-muted-foreground"
                  )}
                >
                  {rank === 1 ? (
                    <CrownIcon className="w-4 h-4" />
                  ) : (
                    rank
                  )}
                </div>
              )}

              {entry.avatar ? (
                <img
                  src={entry.avatar}
                  alt={entry.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {entry.name.charAt(0).toUpperCase()}
                </div>
              )}

              <span className={cn(
                "flex-1 font-medium truncate",
                entry.highlight && "text-primary"
              )}>
                {entry.name}
              </span>

              <span className={cn(
                "font-mono text-sm tabular-nums",
                isTopThree ? RANK_COLORS[rank] : "text-muted-foreground"
              )}>
                {scoreFormat(entry.score)}
              </span>
            </div>
          );
        })}
      </div>

      {entries.length > maxEntries && (
        <div className="px-4 py-2 text-center text-xs text-muted-foreground border-t border-border">
          +{entries.length - maxEntries} more entries
        </div>
      )}
    </div>
  );
}
