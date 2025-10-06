"use client";

import { type ReactNode, useState } from "react";

import { track } from "@vercel/analytics";

import {
  findRegistryItemMatch,
  getRegistryItemUrl,
} from "@/lib/registry-utils";
import { cn } from "@/lib/utils";

import { FileTreeViewer } from "@/components/file-tree-viewer";
import { CopyIcon } from "@/components/icons/copy";
import { EyeIcon } from "@/components/icons/eye";
import { EyeClosedIcon } from "@/components/icons/eye-closed";
import { InstallCommand } from "@/components/install-command";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// @ts-expect-error
import registryData from "@/registry";

interface ComponentWithLayout {
  component: ReactNode;
  colSpan?: 1 | 2 | 3 | 4 | "full";
  className?: string;
  installUrl?: string;
}

interface ComponentPreviewProps {
  components: Record<string, ReactNode | ComponentWithLayout>;
  componentInstallUrls?: Record<string, string>;
  category: string;
  name: string;
  relevantRegistryItems?: Array<{ name: string; [key: string]: unknown }>;
  className?: string;
}

export function ComponentPreview({
  components,
  componentInstallUrls = {},
  category,
  name,
  relevantRegistryItems,
  className,
}: ComponentPreviewProps) {
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(
    new Set(),
  );
  const [packageManager, setPackageManager] = useState("bunx");
  const [copied, setCopied] = useState(false);
  const [activeTreeViewer, setActiveTreeViewer] = useState<string | null>(null);

  // Get relevant registry items if not provided
  const registryItems =
    relevantRegistryItems ||
    registryData.items.filter((item: { name: string }) => {
      const itemName = item.name.toLowerCase();
      const searchName = name.toLowerCase().replace(/\s+/g, "-");
      const searchCategory = category.toLowerCase();

      if (itemName.includes(searchName)) return true;
      if (itemName.startsWith(searchName)) return true;
      if (
        searchCategory.includes(itemName) ||
        itemName.includes(searchCategory)
      )
        return true;

      const nameParts = searchName
        .split("-")
        .filter((part: string) => part.length > 2);
      const itemParts = itemName
        .split("-")
        .filter((part: string) => part.length > 2);
      const commonParts = nameParts.filter((part) => itemParts.includes(part));

      if (commonParts.length > 0) return true;

      return false;
    });

  const handleComponentToggle = (componentKey: string) => {
    const isCurrentlySelected = selectedComponents.has(componentKey);

    track("Component Selection", {
      component_key: componentKey,
      component_category: category,
      page_name: name || "unknown",
      action: isCurrentlySelected ? "deselect" : "select",
      total_selected_after: isCurrentlySelected
        ? selectedComponents.size - 1
        : selectedComponents.size + 1,
      source: "component_preview",
    });

    const newSelected = new Set(selectedComponents);
    if (newSelected.has(componentKey)) {
      newSelected.delete(componentKey);
    } else {
      newSelected.add(componentKey);
    }
    setSelectedComponents(newSelected);
  };

  const getInstallCommand = (pm: string) => {
    if (selectedComponents.size === 0) return "";

    const selectedUrls = Array.from(selectedComponents)
      .map((key) => {
        const component = components?.[key];
        const isComponentWithLayout =
          component &&
          typeof component === "object" &&
          "component" in component;
        return isComponentWithLayout
          ? (component as ComponentWithLayout).installUrl
          : componentInstallUrls[key];
      })
      .filter(Boolean)
      .join(" ");

    const commands = {
      bunx: `bunx shadcn@latest add ${selectedUrls}`,
      npx: `npx shadcn@latest add ${selectedUrls}`,
      pnpm: `pnpm dlx shadcn@latest add ${selectedUrls}`,
      yarn: `yarn dlx shadcn@latest add ${selectedUrls}`,
    };
    return commands[pm as keyof typeof commands] || "";
  };

  const copyCommand = async () => {
    if (selectedComponents.size === 0) return;

    track("Component Install Command Copy", {
      component_category: category,
      page_name: name || "unknown",
      package_manager: packageManager,
      selected_components: Array.from(selectedComponents).join(","),
      selected_count: selectedComponents.size,
      source: "component_preview_install_dock",
    });

    const command = getInstallCommand(packageManager);
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      track("Component Install Command Copy Error", {
        component_category: category,
        page_name: name || "unknown",
        package_manager: packageManager,
        selected_count: selectedComponents.size,
        source: "component_preview_install_dock",
      });
      console.error("Failed to copy command:", err);
    }
  };

  return (
    <div className={cn("space-y-0", className)}>
      {Object.entries(components).map(([key, item]) => {
        const isComponentWithLayout =
          item &&
          typeof item === "object" &&
          "component" in item &&
          item.component !== undefined;

        const componentNode = isComponentWithLayout
          ? (item as ComponentWithLayout).component
          : item;

        const customClassName = isComponentWithLayout
          ? (item as ComponentWithLayout).className
          : "";

        const isSelected = selectedComponents.has(key);

        return (
          <div
            key={key}
            className={cn(
              customClassName,
              "border-t border-l border-r border-b border-dotted transition-all duration-200",
              isSelected ? "border-primary/50" : "border-border",
            )}
          >
            <div
              className={cn(
                "px-4 sm:px-6 py-4 transition-all duration-200",
                isSelected
                  ? "bg-primary/10"
                  : "bg-background hover:bg-accent/50",
              )}
            >
              <div className="space-y-3">
                <div className="hidden mb-0 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleComponentToggle(key)}
                      className="shrink-0"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-sm md:text-base font-medium text-foreground capitalize cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleComponentToggle(key)}
                      >
                        {key.replace("-", " ")}
                      </button>
                      {key.includes("shadcn") && (
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
                    {(() => {
                      const componentRegistryItem = findRegistryItemMatch(
                        key,
                        registryItems,
                      );
                      return componentRegistryItem ? (
                        <OpenInV0Button
                          url={getRegistryItemUrl({
                            registryItemName: componentRegistryItem.name,
                            isV0: true,
                          })}
                          componentKey={key}
                          source="component_preview_desktop"
                        />
                      ) : null;
                    })()}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const componentRegistryItem = findRegistryItemMatch(
                          key,
                          registryItems,
                        );
                        if (componentRegistryItem) {
                          const isCurrentlyActive = activeTreeViewer === key;
                          track("Component Tree Viewer", {
                            component_key: key,
                            component_category: category,
                            page_name: name || "unknown",
                            action: isCurrentlyActive
                              ? "hide_tree"
                              : "show_tree",
                            source: "component_preview_tree_viewer",
                          });
                          setActiveTreeViewer(
                            activeTreeViewer === key ? null : key,
                          );
                        }
                      }}
                      className="text-xs h-9 gap-2"
                    >
                      {activeTreeViewer === key ? (
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

                    {(componentInstallUrls[key] ||
                      (isComponentWithLayout &&
                        (item as ComponentWithLayout).installUrl)) && (
                      <InstallCommand
                        className="!max-w-lg"
                        url={
                          componentInstallUrls[key] ||
                          (item as ComponentWithLayout).installUrl
                        }
                        source="component_preview_individual_desktop"
                        componentName={key}
                        category={category}
                      />
                    )}
                  </div>
                </div>

                <div className="sm:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleComponentToggle(key)}
                        className="shrink-0"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="text-sm font-medium text-foreground capitalize cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleComponentToggle(key)}
                        >
                          {key.replace("-", " ")}
                        </button>
                        {key.includes("shadcn") && (
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
                      {(() => {
                        const componentRegistryItem = findRegistryItemMatch(
                          key,
                          registryItems,
                        );
                        return componentRegistryItem ? (
                          <OpenInV0Button
                            url={getRegistryItemUrl({
                              registryItemName: componentRegistryItem.name,
                              isV0: true,
                            })}
                            componentKey={key}
                            source="component_preview_mobile"
                          />
                        ) : null;
                      })()}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const componentRegistryItem = findRegistryItemMatch(
                            key,
                            registryItems,
                          );
                          if (componentRegistryItem) {
                            setActiveTreeViewer(
                              activeTreeViewer === key ? null : key,
                            );
                          }
                        }}
                        className="text-xs h-9 gap-2 hidden sm:flex"
                      >
                        {activeTreeViewer === key ? (
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
                    </div>
                  </div>

                  {(componentInstallUrls[key] ||
                    (isComponentWithLayout &&
                      (item as ComponentWithLayout).installUrl)) && (
                    <div className="w-full">
                      <InstallCommand
                        className="!max-w-full"
                        url={
                          componentInstallUrls[key] ||
                          (item as ComponentWithLayout).installUrl
                        }
                        source="component_preview_individual_mobile"
                        componentName={key}
                        category={category}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-card/30 border-t border-dotted border-border w-full">
              {activeTreeViewer === key ? (
                <div className="h-[600px]">
                  {(() => {
                    const componentRegistryItem = findRegistryItemMatch(
                      key,
                      registryItems,
                    );
                    return (
                      <FileTreeViewer
                        files={(componentRegistryItem?.files as any) || []}
                        registryItem={componentRegistryItem || undefined}
                        onClose={() => setActiveTreeViewer(null)}
                        className="relative h-full bg-transparent"
                        componentKey={key}
                        source="component_preview_file_tree"
                      />
                    );
                  })()}
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
      })}

      {selectedComponents.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-card border rounded-lg shadow-lg max-w-lg w-full mx-4">
            <div className="flex rounded-md">
              <Select
                value={packageManager}
                onValueChange={(value) => {
                  track("Component Package Manager Changed", {
                    component_category: category,
                    page_name: name || "unknown",
                    from: packageManager,
                    to: value,
                    selected_components_count: selectedComponents.size,
                    source: "component_preview_install_dock",
                  });
                  setPackageManager(value);
                }}
              >
                <SelectTrigger className="text-muted-foreground hover:text-foreground w-20 sm:w-20 rounded-e-none border-0 border-r shadow-none text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bunx">bunx</SelectItem>
                  <SelectItem value="npx">npx</SelectItem>
                  <SelectItem value="pnpm">pnpm</SelectItem>
                  <SelectItem value="yarn">yarn</SelectItem>
                </SelectContent>
              </Select>
              <Input
                readOnly
                value={`shadcn@latest add ${Array.from(selectedComponents)
                  .map((key) => {
                    const component = components?.[key];
                    const isComponentWithLayout =
                      component &&
                      typeof component === "object" &&
                      "component" in component;
                    return isComponentWithLayout
                      ? (component as ComponentWithLayout).installUrl
                      : componentInstallUrls[key];
                  })
                  .filter(Boolean)
                  .join(" ")}`}
                className="-ms-px flex-1 rounded-none border-0 shadow-none font-mono text-xs sm:text-sm focus-visible:ring-0"
              />
              <Button
                onClick={copyCommand}
                size="sm"
                variant="outline"
                className="-ms-px rounded-s-none border-0 border-l shadow-none text-teal-600 hover:text-teal-500 h-9 w-12 sm:w-auto px-0 sm:px-3"
              >
                {copied ? (
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                  >
                    <title>Copy Icon</title>
                    <path
                      d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <>
                    <CopyIcon className="w-4 h-4 sm:hidden" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
