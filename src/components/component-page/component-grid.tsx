"use client";

import type { ReactNode } from "react";

import { ComponentGridItem } from "./grid-item";
import type { ComponentWithLayout, Layout, RegistryItem } from "./types";

interface ComponentGridProps {
  components: Record<string, ReactNode | ComponentWithLayout>;
  layout: Layout;
  installUrls?: Record<string, string>;
  selectedComponents: Set<string>;
  onComponentToggle: (componentKey: string) => void;
  activeTreeViewer: string | null;
  onToggleTree: (key: string | null) => void;
  relevantRegistryItems: RegistryItem[];
  category: string;
  name: string;
}

export function ComponentGrid({
  components,
  installUrls = {},
  selectedComponents,
  onComponentToggle,
  activeTreeViewer,
  onToggleTree,
  relevantRegistryItems,
  category,
  name,
}: ComponentGridProps) {
  return (
    <div className="space-y-0">
      {Object.entries(components).map(([key, item]) => (
        <ComponentGridItem
          key={key}
          componentKey={key}
          item={item}
          installUrl={installUrls[key]}
          isSelected={selectedComponents.has(key)}
          onToggle={() => onComponentToggle(key)}
          activeTreeViewer={activeTreeViewer}
          onToggleTree={onToggleTree}
          relevantRegistryItems={relevantRegistryItems}
          category={category}
          name={name}
        />
      ))}
    </div>
  );
}
