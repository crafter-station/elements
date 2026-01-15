"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

import { OgImageCard } from "./og-image-card";

interface OgRoute {
  path: string;
  title?: string;
  ogImageUrl: string;
  category?: string;
}

interface OgCategorySectionProps {
  category: string;
  routes: OgRoute[];
  maxItems?: number;
  showPath?: boolean;
  showTitle?: boolean;
  className?: string;
}

export function OgCategorySection({
  category,
  routes,
  maxItems = 8,
  showPath = true,
  showTitle = true,
  className,
}: OgCategorySectionProps) {
  const [expanded, setExpanded] = useState(false);

  const hasMore = routes.length > maxItems;
  const visibleRoutes = expanded ? routes : routes.slice(0, maxItems);
  const hiddenCount = routes.length - maxItems;

  const formatCategoryName = (cat: string) => {
    if (cat === "root") return "Root";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <section
      data-slot="og-category-section"
      className={cn("flex flex-col gap-4", className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">
            {formatCategoryName(category)}
          </h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {routes.length}
          </span>
        </div>

        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "flex items-center gap-1 text-sm text-muted-foreground transition-colors",
              "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1",
            )}
          >
            {expanded ? (
              <>
                View less
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                View {hiddenCount} more
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visibleRoutes.map((route) => (
          <OgImageCard
            key={route.path}
            path={route.path}
            title={route.title}
            ogImageUrl={route.ogImageUrl}
            showPath={showPath}
            showTitle={showTitle}
          />
        ))}
      </div>
    </section>
  );
}
