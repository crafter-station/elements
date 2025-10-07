"use client";

import type { ReactNode } from "react";

import { track } from "@vercel/analytics";
import { ExternalLink } from "lucide-react";

import {
  findRegistryItemMatch,
  getRegistryItemUrl,
} from "@/lib/registry-utils";
import { cn } from "@/lib/utils";

import { InstallCommand } from "@/components/install-command";
import { PixelatedCheckIcon } from "@/components/pixelated-check-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { ComponentWithLayout, RegistryItem } from "./types";

interface ComponentGridViewProps {
  components: Record<string, ReactNode | ComponentWithLayout>;
  installUrls: Record<string, string>;
  selectedComponents: Set<string>;
  onComponentToggle: (key: string) => void;
  onComponentClick: (key: string) => void;
  relevantRegistryItems: RegistryItem[];
  category: string;
  pageName: string;
  className?: string;
}

export function ComponentGridView({
  components,
  installUrls,
  selectedComponents,
  onComponentToggle,
  onComponentClick,
  relevantRegistryItems,
  category,
  pageName,
  className,
}: ComponentGridViewProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6",
        className,
      )}
    >
      {Object.entries(components).map(([key, item]) => {
        const isComponentWithLayout =
          item && typeof item === "object" && "component" in item;

        const componentNode = isComponentWithLayout
          ? (item as ComponentWithLayout).component
          : item;

        const finalInstallUrl =
          installUrls[key] ||
          (isComponentWithLayout
            ? (item as ComponentWithLayout).installUrl
            : "");

        const isSelected = selectedComponents.has(key);
        const registryItem = findRegistryItemMatch(
          key,
          relevantRegistryItems as any,
        );

        return (
          <div
            key={key}
            className={cn(
              "group relative rounded-lg border transition-all duration-200 overflow-hidden",
              "hover:shadow-md hover:scale-[1.02]",
              isSelected
                ? "bg-primary/10 border-primary ring-2 ring-primary/20"
                : "bg-card hover:bg-accent/50 border-border",
            )}
          >
            {/* Selection Indicator */}
            <button
              type="button"
              onClick={() => {
                track("Component Grid Selection", {
                  component_key: key,
                  action: isSelected ? "deselect" : "select",
                  category,
                  page_name: pageName,
                  source: "component_grid_view",
                });
                onComponentToggle(key);
              }}
              className={cn(
                "absolute top-3 right-3 z-10 w-5 h-5 rounded-full border-2 transition-all duration-200",
                isSelected
                  ? "bg-primary border-primary"
                  : "border-muted-foreground/30 group-hover:border-primary/50 bg-background/80",
              )}
            >
              {isSelected && (
                <PixelatedCheckIcon className="w-2.5 h-2.5 text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              )}
            </button>

            {/* Preview Area */}
            <button
              type="button"
              onClick={() => {
                track("Component Grid Click", {
                  component_key: key,
                  category,
                  page_name: pageName,
                  source: "component_grid_view",
                });
                onComponentClick(key);
              }}
              className="w-full p-6 min-h-[180px] flex items-center justify-center bg-card/30"
            >
              <div className="w-full scale-75 transform transition-transform group-hover:scale-80">
                {componentNode as ReactNode}
              </div>
            </button>

            {/* Info Footer */}
            <div className="p-3 border-t border-dotted space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm capitalize truncate">
                  {key.replace(/-/g, " ")}
                </h3>
                {key.includes("beta") && (
                  <Badge
                    variant="outline"
                    className="border-blue-500 text-blue-500 text-[10px] shrink-0"
                  >
                    BETA
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {finalInstallUrl && (
                  <InstallCommand
                    url={finalInstallUrl}
                    source="component_grid_view"
                    componentName={key}
                    category={category}
                    className="flex-1 text-xs h-8"
                  />
                )}
                {registryItem && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      track("Component Grid Open V0", {
                        component_key: key,
                        category,
                        page_name: pageName,
                        source: "component_grid_view",
                      });
                      window.open(
                        getRegistryItemUrl({
                          registryItemName: registryItem.name,
                          isV0: true,
                        }),
                        "_blank",
                      );
                    }}
                    className="h-8 w-8 p-0 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
