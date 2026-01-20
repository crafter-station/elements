"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProfileData {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
}

interface GitHubProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  staticData?: ProfileData;
  showStats?: boolean;
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

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m12.596 11.596-3.535 3.536a1.5 1.5 0 0 1-2.122 0l-3.535-3.536a6.5 6.5 0 1 1 9.192 0ZM8 14.5l3.535-3.535a5.5 5.5 0 1 0-7.07 0L8 14.5Zm0-6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z" />
    </svg>
  );
}

function CompanyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75Zm-.25-1.75c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75Zm4 3A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function GitHubProfileCard({
  username,
  staticData,
  showStats = true,
  className,
  ...props
}: GitHubProfileCardProps) {
  const [data, setData] = useState<ProfileData | null>(staticData || null);
  const [loading, setLoading] = useState(!staticData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (staticData) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.github.com/users/${username}`
        );

        if (!response.ok) {
          throw new Error("User not found");
        }

        const userData = await response.json();
        setData(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username, staticData]);

  if (loading) {
    return (
      <div
        data-slot="github-profile-card"
        className={cn(
          "flex flex-col gap-4 p-6 border border-border rounded-lg bg-card",
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-16 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        data-slot="github-profile-card"
        className={cn(
          "flex flex-col gap-4 p-6 border border-destructive/50 rounded-lg bg-destructive/10",
          className
        )}
        {...props}
      >
        <p className="text-sm text-destructive">{error || "No data"}</p>
      </div>
    );
  }

  const blogUrl = data.blog
    ? data.blog.startsWith("http")
      ? data.blog
      : `https://${data.blog}`
    : null;

  return (
    <div
      data-slot="github-profile-card"
      className={cn(
        "flex flex-col gap-4 p-6 border border-border rounded-lg bg-card",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-4">
        <a
          href={`https://github.com/${data.login}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={data.avatar_url}
            alt={`${data.login}'s avatar`}
            className="w-16 h-16 rounded-full border border-border"
          />
        </a>
        <div className="flex flex-col gap-0.5 min-w-0">
          <a
            href={`https://github.com/${data.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground hover:underline truncate"
          >
            {data.name || data.login}
          </a>
          <span className="text-sm text-muted-foreground">@{data.login}</span>
        </div>
      </div>

      {data.bio && (
        <p className="text-sm text-muted-foreground">{data.bio}</p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {data.company && (
          <span className="flex items-center gap-1.5">
            <CompanyIcon className="w-4 h-4" />
            {data.company}
          </span>
        )}
        {data.location && (
          <span className="flex items-center gap-1.5">
            <LocationIcon className="w-4 h-4" />
            {data.location}
          </span>
        )}
        {blogUrl && (
          <a
            href={blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
            {data.blog?.replace(/^https?:\/\//, "")}
          </a>
        )}
        {data.twitter_username && (
          <a
            href={`https://x.com/${data.twitter_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <XIcon className="w-4 h-4" />
            @{data.twitter_username}
          </a>
        )}
      </div>

      {showStats && (
        <div className="flex gap-4 pt-2 border-t border-border text-sm">
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">
              {formatNumber(data.public_repos)}
            </span>
            <span className="text-muted-foreground">repos</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">
              {formatNumber(data.followers)}
            </span>
            <span className="text-muted-foreground">followers</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">
              {formatNumber(data.following)}
            </span>
            <span className="text-muted-foreground">following</span>
          </span>
        </div>
      )}
    </div>
  );
}
