"use client";

import { useState } from "react";

import { track } from "@vercel/analytics";

export function useComponentSelection(category: string, name: string) {
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(
    new Set(),
  );

  const handleToggle = (componentKey: string) => {
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

    setSelectedComponents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(componentKey)) {
        newSet.delete(componentKey);
      } else {
        newSet.add(componentKey);
      }
      return newSet;
    });
  };

  return {
    selectedComponents,
    handleToggle,
  };
}
