"use client";

import { type ReactNode, useState } from "react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RegistryVisualizer } from "@/components/registry-visualizer";

import registryData from "@/registry";
import { ComponentGrid } from "./component-page/component-grid";
import { ComponentPageHero } from "./component-page/hero";
import { ComponentInstallDock } from "./component-page/install-dock";
import { QuickStartSection } from "./component-page/quick-start-section";
import { filterRegistryItems } from "./component-page/registry-filter";
import type {
  ComponentWithLayout,
  Feature,
  Layout,
} from "./component-page/types";
import { useComponentSelection } from "./component-page/use-component-selection";

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
  technicalDetails?: Array<{
    icon: ReactNode;
    title: string;
    description: string;
  }>;
  usageExample?: string;
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
  const { selectedComponents, handleToggle } = useComponentSelection(
    category,
    name,
  );
  const [activeTreeViewer, setActiveTreeViewer] = useState<string | null>(null);

  const relevantRegistryItems = filterRegistryItems(
    registryData.items as any[],
    name,
    category,
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 w-full border-border border-dotted sm:border-x mx-auto">
        <ComponentPageHero
          brandColor={brandColor}
          darkBrandColor={darkBrandColor}
          category={category}
          name={name}
          description={description}
          icon={icon}
          installCommand={installCommand}
        />

        {components && (
          <div className="border-t border-border border-dotted">
            <ComponentGrid
              components={components}
              layout={layout}
              installUrls={componentInstallUrls}
              selectedComponents={selectedComponents}
              onComponentToggle={handleToggle}
              activeTreeViewer={activeTreeViewer}
              onToggleTree={setActiveTreeViewer}
              relevantRegistryItems={relevantRegistryItems}
              category={category}
              name={name}
            />
          </div>
        )}

        {children}

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

        <QuickStartSection
          features={features}
          installCommand={installCommand}
          name={name}
          category={category}
        />
      </div>

      <ComponentInstallDock
        selectedComponents={selectedComponents}
        components={components}
        componentInstallUrls={componentInstallUrls}
        category={category}
        name={name}
      />

      <Footer />
    </div>
  );
}
