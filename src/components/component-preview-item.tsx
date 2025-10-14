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
import { Checkbox } from "@/components/ui/checkbox";

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
  const [isSelected, setIsSelected] = useState(false);
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

  const handleToggle = () => {
    const newState = !isSelected;
    setIsSelected(newState);

    track("Component Selection", {
      component_key: componentKey,
      component_category: category,
      page_name: name,
      action: newState ? "select" : "deselect",
      source: "component_preview_item",
    });
  };

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
        "border border-dotted transition-all duration-200 my-6",
        isSelected ? "border-primary/50" : "border-border",
        className,
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
                onCheckedChange={handleToggle}
                className="shrink-0"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-sm md:text-base font-medium text-foreground capitalize cursor-pointer hover:text-primary transition-colors"
                  onClick={handleToggle}
                >
                  {componentKey.replace(/-/g, " ")}
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
                  source="component_preview_item_desktop"
                />
              )}

              {registryItem && (
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
              )}

              {finalInstallUrl && (
                <InstallCommand
                  className="!max-w-lg"
                  url={finalInstallUrl}
                  source="component_preview_item_desktop"
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
                  onCheckedChange={handleToggle}
                  className="shrink-0"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-sm font-medium text-foreground capitalize cursor-pointer hover:text-primary transition-colors"
                    onClick={handleToggle}
                  >
                    {componentKey.replace(/-/g, " ")}
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
                    source="component_preview_item_mobile"
                  />
                )}
              </div>
            </div>

            {finalInstallUrl && (
              <InstallCommand
                className="!max-w-full"
                url={finalInstallUrl}
                source="component_preview_item_mobile"
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
              onClose={() => setShowTree(false)}
              className="relative h-full bg-transparent"
              componentKey={componentKey}
              source="component_preview_item_file_tree"
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
