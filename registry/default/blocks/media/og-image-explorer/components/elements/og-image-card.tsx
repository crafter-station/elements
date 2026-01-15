"use client";

import { useState } from "react";

import { ExternalLink, ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

type ImageStatus = "loading" | "loaded" | "error";

interface OgImageCardProps {
  path: string;
  title?: string;
  ogImageUrl: string;
  showPath?: boolean;
  showTitle?: boolean;
  className?: string;
}

export function OgImageCard({
  path,
  title,
  ogImageUrl,
  showPath = true,
  showTitle = true,
  className,
}: OgImageCardProps) {
  const [status, setStatus] = useState<ImageStatus>("loading");

  const handleClick = () => {
    window.open(ogImageUrl, "_blank", "noopener,noreferrer");
  };

  const statusBorderColor = {
    loading: "border-muted-foreground/30",
    loaded: "border-green-500/50",
    error: "border-red-500/50",
  };

  return (
    <div
      data-slot="og-image-card"
      className={cn("group flex flex-col gap-2", className)}
    >
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "relative aspect-[1.91/1] w-full overflow-hidden rounded-lg border-2 transition-all duration-200",
          "hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "bg-muted",
          statusBorderColor[status],
        )}
      >
        {status === "loading" && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}

        {status === "error" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="h-8 w-8" />
            <span className="text-xs">Failed to load</span>
          </div>
        ) : (
          <img
            src={ogImageUrl}
            alt={title || path}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-200",
              status === "loading" ? "opacity-0" : "opacity-100",
            )}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
          />
        )}

        <div className="absolute bottom-2 right-2 rounded-md bg-background/80 p-1.5 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <ExternalLink className="h-3.5 w-3.5 text-foreground" />
        </div>
      </button>

      <div className="flex flex-col gap-0.5 px-1">
        {showTitle && title && (
          <span className="truncate text-sm font-medium text-foreground">
            {title}
          </span>
        )}
        {showPath && (
          <span className="truncate text-xs text-muted-foreground font-mono">
            {path}
          </span>
        )}
      </div>
    </div>
  );
}
