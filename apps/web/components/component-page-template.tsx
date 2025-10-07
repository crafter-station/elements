"use client";

import { type ReactNode, useMemo } from "react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RegistryVisualizer } from "@/components/registry-visualizer";

import registryData from "@/registry";
import { ComponentGridView } from "./component-page/grid-view";
import { ComponentPageHero } from "./component-page/hero";
import { ComponentPreviewPane } from "./component-page/preview-pane";
import { QuickInstallPanel } from "./component-page/quick-install-panel";
import { QuickSearch, useQuickSearch } from "./component-page/quick-search";
import { filterRegistryItems } from "./component-page/registry-filter";
import { ComponentSidebar } from "./component-page/sidebar";
import type {
  ComponentWithLayout,
  Feature,
  Layout,
} from "./component-page/types";
import { useComponentPageState } from "./component-page/use-component-page-state";
import { VIEW_MODES } from "./component-page/view-modes";

interface ComponentPageTemplateProps {
  brandColor: string;
  darkBrandColor?: string;
  category: string;
  name: string;
  description: string;
  icon: ReactNode;
  features: Feature[];
  installCommand: string;
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
  const componentKeys = useMemo(
    () => (components ? Object.keys(components) : []),
    [components],
  );

  const pageState = useComponentPageState(componentKeys, category, name);
  const { open: searchOpen, setOpen: setSearchOpen } = useQuickSearch();

  const relevantRegistryItems = filterRegistryItems(
    registryData.items as any[],
    name,
    category,
  );

  // Get active component data
  const activeComponentData = pageState.activeComponent
    ? components?.[pageState.activeComponent]
    : null;

  const isComponentWithLayout =
    activeComponentData &&
    typeof activeComponentData === "object" &&
    "component" in activeComponentData;

  const activeComponentNode = isComponentWithLayout
    ? (activeComponentData as ComponentWithLayout).component
    : activeComponentData;

  const activeRegistryItem = pageState.activeComponent
    ? relevantRegistryItems.find((item) =>
        item.name.includes(pageState.activeComponent!),
      )
    : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 w-full border-border border-dotted sm:border-x mx-auto flex flex-col">
        {/* Compact Hero */}
        <ComponentPageHero
          brandColor={brandColor}
          darkBrandColor={darkBrandColor}
          category={category}
          name={name}
          description={description}
          icon={icon}
          installCommand={installCommand}
        />

        {/* Main Content Area - Sidebar + Content */}
        {components && pageState.viewMode === VIEW_MODES.LIST && (
          <div className="flex-1 flex border-t border-border border-dotted">
            {/* Sidebar */}
            <ComponentSidebar
              components={pageState.filteredComponents}
              selectedComponents={pageState.selectedComponents}
              activeComponent={pageState.activeComponent}
              onComponentToggle={pageState.toggleComponent}
              onComponentClick={pageState.setActiveComponent}
              searchTerm={pageState.searchTerm}
              onSearchChange={pageState.setSearchTerm}
              viewMode={pageState.viewMode}
              onViewModeChange={pageState.setViewMode}
              collapsed={pageState.sidebarCollapsed}
              onCollapsedChange={pageState.setSidebarCollapsed}
              focusedIndex={pageState.focusedIndex}
            />

            {/* Preview Pane */}
            <ComponentPreviewPane
              componentKey={pageState.activeComponent}
              component={activeComponentNode as ReactNode}
              registryItem={activeRegistryItem}
              activeTab={pageState.activePreviewTab}
              onTabChange={pageState.setActivePreviewTab}
              showTree={false}
              onToggleTree={() => {}}
              category={category}
              pageName={name}
              className="flex-1"
            />
          </div>
        )}

        {/* Grid View */}
        {components && pageState.viewMode === VIEW_MODES.GRID && (
          <div className="border-t border-border border-dotted">
            <ComponentGridView
              components={components}
              installUrls={componentInstallUrls}
              selectedComponents={pageState.selectedComponents}
              onComponentToggle={pageState.toggleComponent}
              onComponentClick={pageState.setActiveComponent}
              relevantRegistryItems={relevantRegistryItems}
              category={category}
              pageName={name}
            />
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
                    registryItems={relevantRegistryItems as any}
                    selectedItem={name}
                    className="h-[600px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section - Now Inline */}
        <div className="border-t border-border border-dotted px-4 sm:px-6 md:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">What's Included</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
        </div>
      </div>

      {/* Quick Install Panel (replaces old dock) */}
      <QuickInstallPanel
        selectedComponents={pageState.selectedComponents}
        components={components}
        componentInstallUrls={componentInstallUrls}
        category={category}
        name={name}
      />

      {/* Quick Search (Cmd+K) */}
      <QuickSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        components={componentKeys}
        onSelectComponent={(key) => {
          pageState.setActiveComponent(key);
          pageState.setViewMode(VIEW_MODES.LIST);
        }}
        category={category}
        pageName={name}
      />

      <Footer />
    </div>
  );
}
