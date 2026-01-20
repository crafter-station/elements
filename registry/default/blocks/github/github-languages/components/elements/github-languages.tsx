"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LanguageData {
  name: string;
  percentage: number;
  color: string;
}

interface GitHubLanguagesProps extends React.HTMLAttributes<HTMLDivElement> {
  owner: string;
  repo: string;
  staticData?: LanguageData[];
  showLabels?: boolean;
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
  MDX: "#fcb32c",
  SCSS: "#c6538c",
  Svelte: "#ff3e00",
  Astro: "#ff5a03",
};

export function GitHubLanguages({
  owner,
  repo,
  staticData,
  showLabels = true,
  className,
  ...props
}: GitHubLanguagesProps) {
  const [data, setData] = useState<LanguageData[]>(staticData || []);
  const [loading, setLoading] = useState(!staticData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (staticData) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/languages`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch languages");
        }

        const languagesData: Record<string, number> = await response.json();
        const total = Object.values(languagesData).reduce((a, b) => a + b, 0);

        const languages: LanguageData[] = Object.entries(languagesData)
          .map(([name, bytes]) => ({
            name,
            percentage: (bytes / total) * 100,
            color: LANGUAGE_COLORS[name] || "#8b8b8b",
          }))
          .sort((a, b) => b.percentage - a.percentage);

        setData(languages);
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
        data-slot="github-languages"
        className={cn("flex flex-col gap-3", className)}
        {...props}
      >
        <div className="h-2 w-full bg-muted rounded-full animate-pulse" />
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-4 w-20 bg-muted rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-slot="github-languages"
        className={cn("text-sm text-destructive", className)}
        {...props}
      >
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        data-slot="github-languages"
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      >
        No languages detected
      </div>
    );
  }

  return (
    <div
      data-slot="github-languages"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        {data.map((lang, index) => (
          <div
            key={lang.name}
            className="h-full transition-all"
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
              marginLeft: index > 0 ? "1px" : 0,
            }}
            title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
          />
        ))}
      </div>

      {showLabels && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {data.slice(0, 6).map((lang) => (
            <span
              key={lang.name}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              <span>{lang.name}</span>
              <span className="text-muted-foreground/60">
                {lang.percentage.toFixed(1)}%
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
