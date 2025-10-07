export const VIEW_MODES = {
  LIST: "list",
  GRID: "grid",
} as const;

export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES];

export const DENSITY_MODES = {
  COMFORTABLE: "comfortable",
  COMPACT: "compact",
} as const;

export type DensityMode = (typeof DENSITY_MODES)[keyof typeof DENSITY_MODES];

export const PREVIEW_TABS = {
  PREVIEW: "preview",
  CODE: "code",
  TREE: "tree",
  INFO: "info",
} as const;

export type PreviewTab = (typeof PREVIEW_TABS)[keyof typeof PREVIEW_TABS];

export const SORT_OPTIONS = {
  NAME_ASC: "name-asc",
  NAME_DESC: "name-desc",
  RECENT: "recent",
  POPULAR: "popular",
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];
