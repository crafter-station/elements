"use client";

import { type ReactNode, useState } from "react";

import { track } from "@vercel/analytics";

import {
  findRegistryItemMatch,
  getRegistryItemUrl,
} from "@/lib/registry-utils";
import { cn } from "@/lib/utils";

import { FileTreeViewer } from "@/components/file-tree-viewer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CopyIcon } from "@/components/icons/copy";
import { EyeIcon } from "@/components/icons/eye";
import { EyeClosedIcon } from "@/components/icons/eye-closed";
import { InstallCommand } from "@/components/install-command";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { RegistryVisualizer } from "@/components/registry-visualizer";
import { ScrambleText } from "@/components/scramble-text";
import {
  ThemeAwareBrandText,
  ThemeAwarePattern,
} from "@/components/theme-aware-brand";
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

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

interface TechnicalDetail {
  icon: ReactNode;
  title: string;
  description: string;
}

interface CodeExample {
  title: string;
  code: string;
  language?: string;
}

interface ComponentWithLayout {
  component: ReactNode;
  colSpan?: 1 | 2 | 3 | 4 | "full";
  className?: string;
  installUrl?: string;
}

interface Layout {
  type: "auto" | "custom";
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

interface ComponentPageTemplateProps {
  brandColor: string;
  darkBrandColor?: string;
  category: string;
  name: string;
  description: string;
  icon: ReactNode;
  features: Feature[];
  technicalDetails: TechnicalDetail[];
  installCommand: string;
  usageExample: string;
  additionalExamples?: CodeExample[];
  components?: Record<string, ReactNode | ComponentWithLayout>;
  componentInstallUrls?: Record<string, string>;
  layout?: Layout;
  children?: ReactNode;
  showRegistryVisualizer?: boolean;
}

export function ComponentPageTemplate({
  brandColor,
  darkBrandColor,
  category,
  name,
  description,
  icon,
  features,
  installCommand,
  components,
  componentInstallUrls = {},
  layout = { type: "auto", columns: 4, gap: "lg" },
  children,
  showRegistryVisualizer = false,
}: ComponentPageTemplateProps) {
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(
    new Set(),
  );
  const [packageManager, setPackageManager] = useState("bunx");
  const [copied, setCopied] = useState(false);
  const [activeTreeViewer, setActiveTreeViewer] = useState<string | null>(null);

  // Get relevant registry items for this component
  const relevantRegistryItems = registryData.items.filter(
    (item: { name: string }) => {
      const itemName = item.name.toLowerCase();
      const searchName = name.toLowerCase().replace(/\s+/g, "-"); // Convert spaces to hyphens
      const searchCategory = category.toLowerCase();

      // Check if item name contains the search name (with space-to-hyphen conversion)
      if (itemName.includes(searchName)) return true;

      // Check if item name starts with the search name
      if (itemName.startsWith(searchName)) return true;

      // Check if category matches (less strict)
      if (
        searchCategory.includes(itemName) ||
        itemName.includes(searchCategory)
      )
        return true;

      // Check for common words/parts
      const nameParts = searchName
        .split("-")
        .filter((part: string) => part.length > 2);
      const itemParts = itemName
        .split("-")
        .filter((part: string) => part.length > 2);
      const commonParts = nameParts.filter((part) => itemParts.includes(part));

      // If at least one meaningful part matches
      if (commonParts.length > 0) return true;

      return false;
    },
  );

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
      source: "component_page_template",
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
      source: "component_page_install_dock",
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
        source: "component_page_install_dock",
      });
      console.error("Failed to copy command:", err);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="flex-1 w-full max-w-screen-xl border-border border-dotted sm:border-x mx-auto">
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <ThemeAwarePattern
            brandColor={brandColor}
            darkBrandColor={darkBrandColor}
          />

          <div className="relative z-10 w-full py-8 md:py-12 px-4 sm:px-6 md:px-8">
            {/* Centered Hero */}
            <div className="text-center max-w-3xl mx-auto space-y-4 md:space-y-6">
              <div className="space-y-3 md:space-y-4">
                <ThemeAwareBrandText
                  brandColor={brandColor}
                  darkBrandColor={darkBrandColor}
                >
                  <span className="font-mono text-xs sm:text-sm">
                    [ {category} ]
                  </span>
                </ThemeAwareBrandText>
                <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
                    {icon}
                  </div>
                  <h1 className="font-dotted font-black text-2xl sm:text-3xl md:text-4xl leading-tight">
                    <ScrambleText text={name} />
                  </h1>
                </div>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {description}
                </p>
              </div>

              {/* CTA */}
              <div className="flex justify-center">
                <InstallCommand
                  url={installCommand.replace(/^bunx shadcn@latest add /, "")}
                  brandColor={brandColor}
                  source="component_page_hero"
                  componentName={name}
                  category={category}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Components Grid */}
        {components && (
          <div className="border-t border-border border-dotted">
            <div className="space-y-6 md:space-y-8">
              <ComponentGrid
                components={components}
                layout={layout}
                installUrls={componentInstallUrls}
                selectedComponents={selectedComponents}
                onComponentToggle={handleComponentToggle}
                activeTreeViewer={activeTreeViewer}
                setActiveTreeViewer={setActiveTreeViewer}
                relevantRegistryItems={relevantRegistryItems}
                category={category}
                name={name}
              />
            </div>
          </div>
        )}

        {children}

        {/* Registry Visualizer Section */}
        {showRegistryVisualizer && relevantRegistryItems.length > 0 && (
          <div className="border-t border-border border-dotted">
            <div className="px-4 sm:px-6 md:px-8 lg:px-16 py-12">
              <div className="max-w-6xl mx-auto">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">Registry Structure</h3>
                    <p className="text-muted-foreground mt-2">
                      Explore the component structure, dependencies, and
                      installation details
                    </p>
                  </div>
                  <RegistryVisualizer
                    registryItems={relevantRegistryItems}
                    selectedItem={name}
                    className="h-[600px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features & Technical Details - Combined and simplified */}
        <div className="border-t border-border border-dotted px-4 sm:px-6 md:px-8 lg:px-16 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  What's Included
                </h3>
                <div className="space-y-3">
                  {features.map((feature) => (
                    <div key={feature.title} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center bg-primary/20 mt-0.5 flex-shrink-0">
                        <div className="w-2.5 h-2.5 text-primary">
                          {feature.icon}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{feature.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Installation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Quick Start
                </h3>
                <p className="text-muted-foreground text-sm">
                  Get the complete suite with one command
                </p>
                <InstallCommand
                  url={installCommand.replace(/^bunx shadcn@latest add /, "")}
                  source="component_page_quickstart"
                  componentName={name}
                  category={category}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dock-style Install Command */}
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
                    source: "component_page_install_dock",
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

      <Footer />
    </div>
  );
}

function ComponentGrid({
  components,
  layout,
  installUrls = {},
  selectedComponents,
  onComponentToggle,
  activeTreeViewer,
  setActiveTreeViewer,
  relevantRegistryItems,
  category,
  name,
}: {
  components: Record<string, ReactNode | ComponentWithLayout>;
  layout: Layout;
  installUrls?: Record<string, string>;
  selectedComponents: Set<string>;
  onComponentToggle: (componentKey: string) => void;
  activeTreeViewer: string | null;
  setActiveTreeViewer: (key: string | null) => void;
  relevantRegistryItems: Array<{ name: string; [key: string]: unknown }>;
  category: string;
  name: string;
}) {
  // Determine grid layout
  const isCustomLayout = layout.type === "custom";

  let _gridClasses = "";
  let gapClasses = "";

  // Gap classes
  switch (layout.gap) {
    case "sm":
      gapClasses = "gap-4";
      break;
    case "md":
      gapClasses = "gap-6";
      break;
    default:
      gapClasses = "gap-8";
      break;
  }

  if (isCustomLayout) {
    // For custom layout, we'll use a flexible grid that components can span
    _gridClasses = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gapClasses}`;
  } else {
    // Auto layout based on columns prop
    const colsClass = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    }[layout.columns || 4];

    _gridClasses = `grid ${colsClass} ${gapClasses}`;
  }

  // Helper function to get col-span classes
  const _getColSpanClass = (colSpan: ComponentWithLayout["colSpan"]) => {
    if (!colSpan || colSpan === 1) return "";
    if (colSpan === "full") return "col-span-full";

    // Generate proper responsive col-span classes
    switch (colSpan) {
      case 2:
        return "col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2";
      case 3:
        return "col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-3";
      case 4:
        return "col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-0">
      {Object.entries(components).map(([key, item]) => {
        // Check if item is a ComponentWithLayout or just a ReactNode
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
            {/* Component Header - Outside bordered area */}
            <div
              className={cn(
                "px-4 sm:px-6 py-4 transition-all duration-200",
                isSelected
                  ? "bg-primary/10"
                  : "bg-background hover:bg-accent/50",
              )}
            >
              <div className="space-y-3">
                {/* Desktop: Single Row Layout */}
                <div className="hidden mb-0 sm:flex sm:items-center sm:justify-between">
                  {/* Component Label */}
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onComponentToggle(key)}
                      className="shrink-0"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-sm md:text-base font-medium text-foreground capitalize cursor-pointer hover:text-primary transition-colors"
                        onClick={() => onComponentToggle(key)}
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

                  {/* All Actions - Desktop */}
                  <div className="flex items-center gap-2">
                    {/* Open in v0 Button */}
                    {(() => {
                      const componentRegistryItem = findRegistryItemMatch(
                        key,
                        relevantRegistryItems,
                      );
                      return componentRegistryItem ? (
                        <OpenInV0Button
                          url={getRegistryItemUrl(componentRegistryItem.name)}
                          componentKey={key}
                          source="component_page_desktop"
                        />
                      ) : null;
                    })()}

                    {/* Show Tree Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const componentRegistryItem = findRegistryItemMatch(
                          key,
                          relevantRegistryItems,
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
                            source: "component_page_tree_viewer",
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

                    {/* Install Command - Desktop */}
                    {(installUrls[key] ||
                      (isComponentWithLayout &&
                        (item as ComponentWithLayout).installUrl)) && (
                      <InstallCommand
                        className="!max-w-lg"
                        url={
                          installUrls[key] ||
                          (item as ComponentWithLayout).installUrl
                        }
                        source="component_page_component_individual_desktop"
                        componentName={key}
                        category={category}
                      />
                    )}
                  </div>
                </div>

                {/* Mobile: Two Row Layout */}
                <div className="sm:hidden space-y-3">
                  {/* First Row: Component Label + Action Buttons */}
                  <div className="flex items-center justify-between">
                    {/* Component Label */}
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onComponentToggle(key)}
                        className="shrink-0"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="text-sm font-medium text-foreground capitalize cursor-pointer hover:text-primary transition-colors"
                          onClick={() => onComponentToggle(key)}
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

                    {/* Action Buttons - Mobile */}
                    <div className="flex items-center gap-2">
                      {/* Open in v0 Button */}
                      {(() => {
                        const componentRegistryItem = findRegistryItemMatch(
                          key,
                          relevantRegistryItems,
                        );
                        return componentRegistryItem ? (
                          <OpenInV0Button
                            url={getRegistryItemUrl(componentRegistryItem.name)}
                            componentKey={key}
                            source="component_page_mobile"
                          />
                        ) : null;
                      })()}

                      {/* Show Tree Button - Hidden on Mobile */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const componentRegistryItem = findRegistryItemMatch(
                            key,
                            relevantRegistryItems,
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

                  {/* Second Row: Install Command - Mobile only */}
                  {(installUrls[key] ||
                    (isComponentWithLayout &&
                      (item as ComponentWithLayout).installUrl)) && (
                    <div className="w-full">
                      <InstallCommand
                        className="!max-w-full"
                        url={
                          installUrls[key] ||
                          (item as ComponentWithLayout).installUrl
                        }
                        source="component_page_component_individual_mobile"
                        componentName={key}
                        category={category}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Component Display Area - Bordered */}
            <div className="bg-card/30 border-t border-dotted border-border w-full">
              {activeTreeViewer === key ? (
                // Tree view mode - replaces component content
                <div className="h-[600px]">
                  {(() => {
                    const componentRegistryItem = findRegistryItemMatch(
                      key,
                      relevantRegistryItems,
                    );
                    return (
                      <FileTreeViewer
                        files={(componentRegistryItem?.files as any) || []}
                        registryItem={componentRegistryItem || undefined}
                        onClose={() => setActiveTreeViewer(null)}
                        className="relative h-full bg-transparent"
                        componentKey={key}
                        source="component_page_file_tree"
                      />
                    );
                  })()}
                </div>
              ) : (
                // Normal view mode
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
    </div>
  );
}
