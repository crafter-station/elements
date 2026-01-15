"use client";

import { useMemo } from "react";

import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

import { OgCategorySection } from "./og-category-section";

interface OgRoute {
  path: string;
  title?: string;
  ogImageUrl: string;
  category?: string;
}

interface OgImageExplorerProps {
  routes: OgRoute[];
  maxPerCategory?: number;
  showPath?: boolean;
  showTitle?: boolean;
  className?: string;
}

function getCategoryFromPath(path: string): string {
  const segments = path.split("/").filter(Boolean);
  return segments[0] || "root";
}

export function OgImageExplorer({
  routes,
  maxPerCategory = 8,
  showPath = true,
  showTitle = true,
  className,
}: OgImageExplorerProps) {
  const groupedRoutes = useMemo(() => {
    const groups = new Map<string, OgRoute[]>();

    for (const route of routes) {
      const category = route.category || getCategoryFromPath(route.path);
      const existing = groups.get(category) || [];
      groups.set(category, [...existing, route]);
    }

    const sortedCategories = Array.from(groups.entries()).sort(([a], [b]) => {
      if (a === "root") return -1;
      if (b === "root") return 1;
      return a.localeCompare(b);
    });

    return sortedCategories;
  }, [routes]);

  if (routes.length === 0) {
    return (
      <div
        data-slot="og-image-explorer"
        className={cn(
          "flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center",
          className,
        )}
      >
        <ImageOff className="h-10 w-10 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">
            No routes configured
          </p>
          <p className="text-xs text-muted-foreground">
            Add routes to explore your OG images
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-slot="og-image-explorer"
      className={cn("flex flex-col gap-8", className)}
    >
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-foreground">
            OG Image Explorer
          </h1>
          <p className="text-sm text-muted-foreground">
            {routes.length} route{routes.length !== 1 ? "s" : ""} across{" "}
            {groupedRoutes.length} categor
            {groupedRoutes.length !== 1 ? "ies" : "y"}
          </p>
        </div>
      </div>

      {groupedRoutes.map(([category, categoryRoutes]) => (
        <OgCategorySection
          key={category}
          category={category}
          routes={categoryRoutes}
          maxItems={maxPerCategory}
          showPath={showPath}
          showTitle={showTitle}
        />
      ))}
    </div>
  );
}
