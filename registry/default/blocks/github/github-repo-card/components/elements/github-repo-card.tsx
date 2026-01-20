"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GitHubRepoCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  owner: string;
  repo: string;
  staticData?: {
    name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
  };
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Scala: "#c22d40",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Lua: "#000080",
  R: "#198CE7",
  Julia: "#a270ba",
  Clojure: "#db5855",
  Zig: "#ec915c",
};

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  );
}

function ForkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
    </svg>
  );
}

function RepoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
    </svg>
  );
}

export function GitHubRepoCard({
  owner,
  repo,
  staticData,
  className,
  ...props
}: GitHubRepoCardProps) {
  const [data, setData] = useState(staticData || null);
  const [loading, setLoading] = useState(!staticData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (staticData) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch repository");
        }

        const repoData = await response.json();
        setData({
          name: repoData.name,
          description: repoData.description,
          stargazers_count: repoData.stargazers_count,
          forks_count: repoData.forks_count,
          language: repoData.language,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [owner, repo, staticData]);

  if (loading) {
    return (
      <div
        data-slot="github-repo-card"
        className={cn(
          "flex flex-col gap-3 p-4 border border-border rounded-lg bg-card",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted rounded animate-pulse" />
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="flex items-center gap-4">
          <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          <div className="h-4 w-12 bg-muted rounded animate-pulse" />
          <div className="h-4 w-12 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        data-slot="github-repo-card"
        className={cn(
          "flex flex-col gap-3 p-4 border border-destructive/50 rounded-lg bg-destructive/10",
          className
        )}
      >
        <p className="text-sm text-destructive">{error || "No data"}</p>
      </div>
    );
  }

  const languageColor = data.language
    ? LANGUAGE_COLORS[data.language] || "#8b8b8b"
    : null;

  return (
    <a
      data-slot="github-repo-card"
      href={`https://github.com/${owner}/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex flex-col gap-3 p-4 border border-border rounded-lg bg-card",
        "transition-colors hover:border-foreground/20 hover:bg-accent/50",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <RepoIcon className="w-4 h-4 text-muted-foreground" />
        <span className="font-semibold text-sm text-foreground truncate">
          {owner}/{data.name}
        </span>
      </div>

      {data.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {data.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {languageColor && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: languageColor }}
            />
            {data.language}
          </span>
        )}

        <span className="flex items-center gap-1">
          <StarIcon className="w-4 h-4" />
          {formatNumber(data.stargazers_count)}
        </span>

        <span className="flex items-center gap-1">
          <ForkIcon className="w-4 h-4" />
          {formatNumber(data.forks_count)}
        </span>
      </div>
    </a>
  );
}
