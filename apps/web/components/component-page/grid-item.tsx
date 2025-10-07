"use client";

import type { ReactNode } from "react";

import { track } from "@vercel/analytics";

import {
  findRegistryItemMatch,
  getRegistryItemUrl,
} from "@/lib/registry-utils";
import { cn } from "@/lib/utils";

import { FileTreeViewer } from "@/components/file-tree-viewer";
import { EyeIcon } from "@/components/icons/eye";
import { EyeClosedIcon } from "@/components/icons/eye-closed";
import { InstallCommand } from "@/components/install-command";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import type { ComponentWithLayout, RegistryItem } from "./types";

interface ComponentGridItemProps {
  componentKey: string;
  item: ReactNode | ComponentWithLayout;
  installUrl?: string;
  isSelected: boolean;
  onToggle: () => void;
  activeTreeViewer: string | null;
  onToggleTree: (key: string | null) => void;
  relevantRegistryItems: RegistryItem[];
  category: string;
  name: string;
}

export function ComponentGridItem({
  componentKey,
  item,
  installUrl,
  isSelected,
  onToggle,
  activeTreeViewer,
  onToggleTree,
  relevantRegistryItems,
  category,
  name,
}: ComponentGridItemProps) {
  const isComponentWithLayout =
    item && typeof item === "object" && "component" in item;

  const componentNode = isComponentWithLayout
    ? (item as ComponentWithLayout).component
    : item;

  const customClassName = isComponentWithLayout
    ? (item as ComponentWithLayout).className
    : "";

  const finalInstallUrl =
    installUrl ||
    (isComponentWithLayout ? (item as ComponentWithLayout).installUrl : "");

  const registryItem = findRegistryItemMatch(
    componentKey,
    relevantRegistryItems as any,
  );
  const showTree = activeTreeViewer === componentKey;

  const handleTreeToggle = () => {
    if (registryItem) {
      const isCurrentlyActive = showTree;
      track("Component Tree Viewer", {
        component_key: componentKey,
        component_category: category,
        page_name: name || "unknown",
        action: isCurrentlyActive ? "hide_tree" : "show_tree",
        source: "component_page_tree_viewer",
      });
      onToggleTree(showTree ? null : componentKey);
    }
  };

  return (
    <div
      className={cn(
        customClassName,
        "border-t border-l border-r border-b border-dotted transition-all duration-200",
        isSelected ? "border-primary/50" : "border-border",
      )}
    >
      <div
        className={cn(
          "px-4 sm:px-6 py-4 transition-all duration-200",
          isSelected ? "bg-primary/10" : "bg-background hover:bg-accent/50",
        )}
      >
        <div className="space-y-3">
          {/* Desktop Layout */}
          <div className="hidden mb-0 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={isSelected}
                onCheckedChange={onToggle}
                className="shrink-0"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-sm md:text-base font-medium text-foreground capitalize cursor-pointer hover:text-primary transition-colors"
                  onClick={onToggle}
                >
                  {componentKey.replace("-", " ")}
                </button>
                {componentKey.includes("shadcn") && (
                  <Badge
                    variant="outline"
                    className="border-blue-500 text-blue-500 text-xs"
                  >
                    BETA
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {registryItem && (
                <OpenInV0Button
                  url={getRegistryItemUrl({
                    registryItemName: registryItem.name,
                    isV0: true,
                  })}
                  componentKey={componentKey}
                  source="component_page_desktop"
                />
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleTreeToggle}
                className="text-xs h-9 gap-2"
              >
                {showTree ? (
                  <>
                    <EyeClosedIcon className="w-4 h-4" />
                    Hide Tree
                  </>
                ) : (
                  <>
                    <EyeIcon className="w-4 h-4" />
                    Show Tree
                  </>
                )}
              </Button>

              {finalInstallUrl && (
                <InstallCommand
                  className="!max-w-lg"
                  url={finalInstallUrl}
                  source="component_page_component_individual_desktop"
                  componentName={componentKey}
                  category={category}
                />
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={onToggle}
                  className="shrink-0"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-sm font-medium text-foreground capitalize cursor-pointer hover:text-primary transition-colors"
                    onClick={onToggle}
                  >
                    {componentKey.replace("-", " ")}
                  </button>
                  {componentKey.includes("shadcn") && (
                    <Badge
                      variant="outline"
                      className="border-blue-500 text-blue-500 text-xs"
                    >
                      BETA
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {registryItem && (
                  <OpenInV0Button
                    url={getRegistryItemUrl({
                      registryItemName: registryItem.name,
                      isV0: true,
                    })}
                    componentKey={componentKey}
                    source="component_page_mobile"
                  />
                )}
              </div>
            </div>

            {finalInstallUrl && (
              <InstallCommand
                className="!max-w-full"
                url={finalInstallUrl}
                source="component_page_component_individual_mobile"
                componentName={componentKey}
                category={category}
              />
            )}
          </div>
        </div>
      </div>

      <div className="bg-card/30 border-t border-dotted border-border w-full">
        {showTree ? (
          <div className="h-[600px]">
            <FileTreeViewer
              files={(registryItem?.files as any) || []}
              registryItem={registryItem || undefined}
              onClose={() => onToggleTree(null)}
              className="relative h-full bg-transparent"
              componentKey={componentKey}
              source="component_page_file_tree"
            />
          </div>
        ) : (
          <div className="w-full min-h-[350px] md:min-h-[400px] flex items-center justify-center px-4 py-14">
            <div className="w-full max-w-none flex justify-center items-center">
              {componentNode as ReactNode}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
