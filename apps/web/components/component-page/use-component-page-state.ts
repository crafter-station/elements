"use client";

import { useCallback, useState } from "react";

import { track } from "@vercel/analytics";

import {
  loadDensityMode,
  loadSidebarCollapsed,
  loadSortOption,
  loadViewMode,
  saveDensityMode,
  saveSidebarCollapsed,
  saveSortOption,
  saveViewMode,
} from "./storage";
import {
  DENSITY_MODES,
  type DensityMode,
  PREVIEW_TABS,
  type PreviewTab,
  SORT_OPTIONS,
  type SortOption,
  VIEW_MODES,
  type ViewMode,
} from "./view-modes";

export function useComponentPageState(
  componentKeys: string[],
  category: string,
  name: string,
) {
  // View preferences
  const [viewMode, setViewModeState] = useState<ViewMode>(
    () => loadViewMode() || VIEW_MODES.LIST,
  );
  const [densityMode, setDensityModeState] = useState<DensityMode>(
    () => loadDensityMode() || DENSITY_MODES.COMFORTABLE,
  );
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(() =>
    loadSidebarCollapsed(),
  );
  const [sortOption, setSortOptionState] = useState<SortOption>(
    () => loadSortOption() || SORT_OPTIONS.NAME_ASC,
  );

  // Search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Component interaction
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(
    new Set(),
  );
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<PreviewTab>(
    PREVIEW_TABS.PREVIEW,
  );
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Command palette
  const [searchOpen, setSearchOpen] = useState(false);

  // Update localStorage when preferences change
  const setViewMode = useCallback(
    (mode: ViewMode) => {
      setViewModeState(mode);
      saveViewMode(mode);
      track("Component Page View Mode", {
        view_mode: mode,
        category,
        page_name: name,
        source: "component_page_state",
      });
    },
    [category, name],
  );

  const setDensityMode = useCallback(
    (mode: DensityMode) => {
      setDensityModeState(mode);
      saveDensityMode(mode);
      track("Component Page Density Mode", {
        density_mode: mode,
        category,
        page_name: name,
        source: "component_page_state",
      });
    },
    [category, name],
  );

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
    saveSidebarCollapsed(collapsed);
  }, []);

  const setSortOption = useCallback(
    (option: SortOption) => {
      setSortOptionState(option);
      saveSortOption(option);
      track("Component Page Sort", {
        sort_option: option,
        category,
        page_name: name,
        source: "component_page_state",
      });
    },
    [category, name],
  );

  // Component selection
  const toggleComponent = useCallback(
    (componentKey: string) => {
      setSelectedComponents((prev) => {
        const next = new Set(prev);
        const isRemoving = next.has(componentKey);

        if (isRemoving) {
          next.delete(componentKey);
        } else {
          next.add(componentKey);
        }

        track("Component Selection", {
          component_key: componentKey,
          action: isRemoving ? "deselect" : "select",
          total_selected: next.size,
          category,
          page_name: name,
          source: "component_page_state",
        });

        return next;
      });
    },
    [category, name],
  );

  // Filtering logic
  const getFilteredComponents = useCallback(() => {
    let filtered = [...componentKeys];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((key) => key.toLowerCase().includes(term));
    }

    // Apply filters
    if (activeFilters.length > 0) {
      // TODO: Implement filter logic based on component metadata
    }

    // Apply sort
    switch (sortOption) {
      case SORT_OPTIONS.NAME_ASC:
        filtered.sort((a, b) => a.localeCompare(b));
        break;
      case SORT_OPTIONS.NAME_DESC:
        filtered.sort((a, b) => b.localeCompare(a));
        break;
      // TODO: Implement RECENT and POPULAR sorts
      default:
        break;
    }

    return filtered;
  }, [componentKeys, searchTerm, activeFilters, sortOption]);

  const selectAll = useCallback(() => {
    const filtered = getFilteredComponents();
    const allSelected = filtered.every((key) => selectedComponents.has(key));

    if (allSelected) {
      setSelectedComponents(new Set());
      track("Component Bulk Deselect", {
        count: filtered.length,
        category,
        page_name: name,
        source: "component_page_state",
      });
    } else {
      setSelectedComponents(new Set(filtered));
      track("Component Bulk Select", {
        count: filtered.length,
        category,
        page_name: name,
        source: "component_page_state",
      });
    }
  }, [selectedComponents, category, name, getFilteredComponents]);

  const clearSelection = useCallback(() => {
    setSelectedComponents(new Set());
  }, []);

  // Keyboard navigation
  const navigateUp = useCallback(() => {
    const filtered = getFilteredComponents();
    setFocusedIndex((prev) => Math.max(0, prev - 1));
    setActiveComponent(filtered[Math.max(0, focusedIndex - 1)] || null);
  }, [focusedIndex, getFilteredComponents]);

  const navigateDown = useCallback(() => {
    const filtered = getFilteredComponents();
    setFocusedIndex((prev) => Math.min(filtered.length - 1, prev + 1));
    setActiveComponent(
      filtered[Math.min(filtered.length - 1, focusedIndex + 1)] || null,
    );
  }, [focusedIndex, getFilteredComponents]);

  const toggleViewMode = useCallback(() => {
    setViewMode(
      viewMode === VIEW_MODES.LIST ? VIEW_MODES.GRID : VIEW_MODES.LIST,
    );
  }, [viewMode, setViewMode]);

  return {
    // View state
    viewMode,
    setViewMode,
    densityMode,
    setDensityMode,
    sidebarCollapsed,
    setSidebarCollapsed,
    sortOption,
    setSortOption,

    // Search and filter
    searchTerm,
    setSearchTerm,
    activeFilters,
    setActiveFilters,
    searchOpen,
    setSearchOpen,

    // Component interaction
    selectedComponents,
    toggleComponent,
    selectAll,
    clearSelection,
    activeComponent,
    setActiveComponent,
    activePreviewTab,
    setActivePreviewTab,
    focusedIndex,
    setFocusedIndex,

    // Derived state
    filteredComponents: getFilteredComponents(),

    // Actions
    navigateUp,
    navigateDown,
    toggleViewMode,
  };
}
