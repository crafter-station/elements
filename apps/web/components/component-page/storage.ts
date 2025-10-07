import type { DensityMode, SortOption, ViewMode } from "./view-modes";

const STORAGE_KEYS = {
  VIEW_MODE: "elements:component-page:view-mode",
  DENSITY_MODE: "elements:component-page:density-mode",
  SIDEBAR_COLLAPSED: "elements:component-page:sidebar-collapsed",
  SORT_OPTION: "elements:component-page:sort-option",
} as const;

export function saveViewMode(mode: ViewMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
}

export function loadViewMode(): ViewMode | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as ViewMode | null;
}

export function saveDensityMode(mode: DensityMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.DENSITY_MODE, mode);
}

export function loadDensityMode(): DensityMode | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.DENSITY_MODE) as DensityMode | null;
}

export function saveSidebarCollapsed(collapsed: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(collapsed));
}

export function loadSidebarCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === "true";
}

export function saveSortOption(option: SortOption): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SORT_OPTION, option);
}

export function loadSortOption(): SortOption | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.SORT_OPTION) as SortOption | null;
}
