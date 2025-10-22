"use client";

import type { ReactNode } from "react";
import { useState } from "react";

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

import registryData from "@/data/registry.json";

interface ComponentWithLayout {
  component: ReactNode;
  className?: string;
  installUrl?: string;
}

interface ComponentPreviewItemProps {
  /** The key/name of the component */
  componentKey: string;
  /** The component to preview - can be a ReactNode or an object with component + options */
  children: ReactNode | ComponentWithLayout;
  /** Install URL for the component (e.g., "@elements/clerk-sign-in") */
  installUrl?: string;
  /** Category for analytics */
  category?: string;
  /** Provider/page name for analytics */
  name?: string;
  /** Optional registry items to search for file tree */
  relevantRegistryItems?: Array<{ name: string; [key: string]: unknown }>;
  /** Additional CSS classes */
  className?: string;
}

export function ComponentPreviewItem({
  componentKey,
  children,
  installUrl,
  category = "Component",
  name = "Preview",
  relevantRegistryItems,
  className,
}: ComponentPreviewItemProps) {
  const [showTree, setShowTree] = useState(false);

  // Get relevant registry items if not provided
  const registryItems =
    relevantRegistryItems ||
    registryData.items.filter((item: { name: string }) => {
      const itemName = item.name.toLowerCase();
      const searchKey = componentKey.toLowerCase();
      return (
        itemName.includes(searchKey) ||
        searchKey.includes(itemName) ||
        itemName === searchKey
      );
    });

  const isComponentWithLayout =
    children &&
    typeof children === "object" &&
    "component" in children &&
    children.component !== undefined;

  const componentNode = isComponentWithLayout
    ? (children as ComponentWithLayout).component
    : children;

  const customClassName = isComponentWithLayout
    ? (children as ComponentWithLayout).className
    : "";

  const finalInstallUrl =
    installUrl ||
    (isComponentWithLayout ? (children as ComponentWithLayout).installUrl : "");

  const registryItem = findRegistryItemMatch(componentKey, registryItems);

  const handleTreeToggle = () => {
    if (registryItem) {
      const newState = !showTree;
      setShowTree(newState);

      track("Component Tree Viewer", {
        component_key: componentKey,
        component_category: category,
        page_name: name,
        action: newState ? "show_tree" : "hide_tree",
        source: "component_preview_item_tree_viewer",
      });
    }
  };

  return (
    <div
      className={cn(
        customClassName,
        "border border-border rounded-lg overflow-hidden transition-all duration-200 my-6 bg-card/30",
        className,
      )}
    >
      {/* Compact Header */}
      <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center justify-between gap-3">
        {/* Title Section */}
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-medium text-foreground capitalize truncate">
            {componentKey.replace(/-/g, " ")}
          </h3>
          {componentKey.includes("shadcn") && (
            <Badge
              variant="outline"
              className="border-blue-500 text-blue-500 text-xs shrink-0"
            >
              BETA
            </Badge>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2 shrink-0">
          {finalInstallUrl && (
            <InstallCommand
              className="!max-w-full"
              url={finalInstallUrl}
              source="component_preview_item"
              componentName={componentKey}
              category={category}
            />
          )}
          {registryItem && (
            <>
              <OpenInV0Button
                url={getRegistryItemUrl({
                  registryItemName: registryItem.name,
                  isV0: true,
                })}
                componentKey={componentKey}
                source="component_preview_item"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTreeToggle}
                className="text-xs h-8 gap-1.5 px-2.5"
              >
                {showTree ? (
                  <>
                    <EyeClosedIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hide</span>
                  </>
                ) : (
                  <>
                    <EyeIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Tree</span>
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-background/50 h-[400px] md:h-[600px]">
        {showTree ? (
          <div className="h-full">
            <FileTreeViewer
              files={(registryItem?.files as any) || []}
              registryItem={registryItem || undefined}
              onClose={() => setShowTree(false)}
              className="relative h-full bg-transparent"
              componentKey={componentKey}
              source="component_preview_item_file_tree"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center px-4">
            <div className="w-full max-w-none flex justify-center items-center">
              {componentNode as ReactNode}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
