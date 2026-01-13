"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

interface GitHubContributionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  owner: string;
  repo: string;
  staticContributions?: number;
  staticData?: number[][];
}

function generateRandomGrid(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random()),
  );
}

interface HeatmapGridProps {
  data: number[][];
  className?: string;
}

const HEATMAP_ROWS = 7;
const HEATMAP_COLS = 12;
const HEATMAP_CELL_SIZE = 14;
const HEATMAP_GAP = 4;
const HEATMAP_VIEWBOX_WIDTH =
  HEATMAP_COLS * HEATMAP_CELL_SIZE + (HEATMAP_COLS - 1) * HEATMAP_GAP;
const HEATMAP_VIEWBOX_HEIGHT =
  HEATMAP_ROWS * HEATMAP_CELL_SIZE + (HEATMAP_ROWS - 1) * HEATMAP_GAP;

function HeatmapGrid({ data, className }: HeatmapGridProps) {
  const gridData = useMemo(() => {
    if (!data || data.length === 0) {
      return generateRandomGrid(HEATMAP_ROWS, HEATMAP_COLS);
    }
    return data;
  }, [data]);

  const rows = gridData.length;
  const cols = gridData[0]?.length || 0;

  const cells = useMemo(() => {
    const result: Array<{
      x: number;
      y: number;
      opacity: number;
      key: string;
    }> = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const value = gridData[row]?.[col] ?? 0;
        result.push({
          x: col * (HEATMAP_CELL_SIZE + HEATMAP_GAP),
          y: row * (HEATMAP_CELL_SIZE + HEATMAP_GAP),
          opacity: Math.max(0.05, Math.min(1, value)),
          key: `${row}-${col}`,
        });
      }
    }

    return result;
  }, [gridData, rows, cols]);

  return (
    <svg
      viewBox={`0 0 ${HEATMAP_VIEWBOX_WIDTH} ${HEATMAP_VIEWBOX_HEIGHT}`}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={cn("w-full h-auto text-muted-foreground", className)}
      aria-hidden="true"
    >
      <g opacity={0.5}>
        {cells.map((cell) => (
          <rect
            key={cell.key}
            x={cell.x}
            y={cell.y}
            width={HEATMAP_CELL_SIZE}
            height={HEATMAP_CELL_SIZE}
            fill="currentColor"
            opacity={cell.opacity}
          />
        ))}
      </g>
    </svg>
  );
}

export function GitHubContributions({
  owner,
  repo,
  staticContributions,
  staticData,
  className,
  ...props
}: GitHubContributionsProps) {
  const [data, setData] = useState<number[][]>(staticData || []);
  const [contributors, setContributors] = useState<number | null>(
    staticContributions ?? null,
  );
  const [loading, setLoading] = useState(!staticData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (staticData && staticContributions !== undefined) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const activityResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
        );

        if (activityResponse.status === 202) {
          setTimeout(() => fetchData(), 1000);
          return;
        }

        if (!activityResponse.ok) {
          throw new Error("Failed to fetch contribution data");
        }

        const activityData = await activityResponse.json();

        if (!activityData || !Array.isArray(activityData)) {
          setData(
            Array(7)
              .fill(null)
              .map(() => Array(12).fill(0.1)),
          );
        } else {
          const weeks = activityData.slice(-12);
          const allCounts = weeks.flatMap((w: { days: number[] }) => w.days);
          const maxCount = Math.max(...allCounts, 1);

          const grid: number[][] = [];
          for (let day = 0; day < 7; day++) {
            const row: number[] = [];
            for (const week of weeks) {
              const count = week.days[day] || 0;
              row.push(count / maxCount);
            }
            grid.push(row);
          }
          setData(grid);
        }

        const contributorsResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=1`,
        );

        if (contributorsResponse.ok) {
          const linkHeader = contributorsResponse.headers.get("link");
          if (linkHeader) {
            const match = linkHeader.match(/page=(\d+)>; rel="last"/);
            if (match) {
              setContributors(parseInt(match[1], 10));
            }
          } else {
            const contributorData = await contributorsResponse.json();
            setContributors(contributorData.length);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [owner, repo, staticContributions, staticData]);

  if (loading) {
    return (
      <div
        data-slot="github-contributions"
        className={cn(
          "flex flex-col gap-4 p-6 border border-border rounded-lg bg-card",
          className,
        )}
        {...props}
      >
        <div className="flex flex-col gap-1">
          <div className="h-10 w-16 bg-muted rounded animate-pulse" />
          <div className="h-4 w-44 bg-muted rounded animate-pulse" />
        </div>
        <svg
          viewBox={`0 0 ${HEATMAP_VIEWBOX_WIDTH} ${HEATMAP_VIEWBOX_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto text-muted"
          aria-hidden="true"
        >
          <rect
            width={HEATMAP_VIEWBOX_WIDTH}
            height={HEATMAP_VIEWBOX_HEIGHT}
            rx={4}
            fill="currentColor"
            className="animate-pulse"
          />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-slot="github-contributions"
        className={cn(
          "flex flex-col gap-4 p-6 border border-destructive/50 rounded-lg bg-destructive/10",
          className,
        )}
        {...props}
      >
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div
      data-slot="github-contributions"
      className={cn(
        "flex flex-col gap-4 p-6 border border-border rounded-lg bg-card",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-1">
        <span className="text-4xl font-bold tracking-tight">
          {contributors !== null ? contributors.toLocaleString() : "—"}
        </span>
        <span className="text-sm text-muted-foreground">
          Contributors to {owner}/{repo}
        </span>
        <span className="text-xs text-muted-foreground/60">Last 12 weeks</span>
      </div>
      <HeatmapGrid
        data={data}
        className="text-neutral-500 dark:text-neutral-400"
      />
    </div>
  );
}
