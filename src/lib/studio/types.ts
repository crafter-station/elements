export const REGISTRY_ITEM_TYPES = [
  "registry:lib",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:hook",
  "registry:page",
  "registry:file",
  "registry:theme",
  "registry:style",
  "registry:item",
  "registry:example",
] as const;

export type RegistryItemType = (typeof REGISTRY_ITEM_TYPES)[number];

export const REGISTRY_FILE_TYPES = [
  "registry:lib",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:hook",
  "registry:page",
  "registry:file",
] as const;

export type RegistryFileType = (typeof REGISTRY_FILE_TYPES)[number];

export interface StudioRegistry {
  id: string;
  clerkUserId: string;
  name: string;
  displayName: string | null;
  homepage: string | null;
  description: string | null;
  slug: string;
  isPublic: boolean;
  themeId: string | null;
  githubRepoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudioRegistryItem {
  id: string;
  registryId: string;
  name: string;
  type: RegistryItemType;
  title: string | null;
  description: string | null;
  docs: string | null;
  dependencies: string[];
  registryDependencies: string[];
  devDependencies: string[];
  cssVars: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  css: Record<string, unknown> | null;
  envVars: Record<string, string>;
  categories: string[];
  meta: Record<string, unknown>;
  sortOrder: number;
  files: StudioRegistryFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StudioRegistryFile {
  id: string;
  itemId: string;
  path: string;
  type: RegistryFileType;
  target: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistryBuild {
  id: string;
  registryId: string;
  status: "pending" | "building" | "success" | "error";
  outputUrl: string | null;
  errorMessage: string | null;
  builtAt: Date;
}

export interface RegistryAnalyticsEvent {
  id: string;
  registryId: string;
  itemName: string | null;
  eventType: "install" | "view" | "fetch";
  userAgent: string | null;
  ipHash: string | null;
  createdAt: Date;
}

export interface AnalyticsSummary {
  totalInstalls: number;
  totalViews: number;
  totalFetches: number;
  topItems: Array<{ name: string; count: number }>;
  dailyCounts: Array<{ date: string; installs: number; views: number }>;
}

export type CreateRegistryInput = Pick<StudioRegistry, "clerkUserId" | "name" | "slug"> &
  Partial<Pick<StudioRegistry, "displayName" | "homepage" | "description">>;

export type UpdateRegistryInput = Partial<
  Pick<
    StudioRegistry,
    | "name"
    | "displayName"
    | "homepage"
    | "description"
    | "slug"
    | "isPublic"
    | "themeId"
    | "githubRepoUrl"
  >
>;

export type CreateItemInput = Pick<StudioRegistryItem, "registryId" | "name" | "type"> &
  Partial<
    Pick<
      StudioRegistryItem,
      | "title"
      | "description"
      | "docs"
      | "dependencies"
      | "registryDependencies"
      | "devDependencies"
      | "cssVars"
      | "css"
      | "envVars"
      | "categories"
      | "meta"
    >
  >;

export type UpdateItemInput = Partial<
  Pick<
    StudioRegistryItem,
    | "name"
    | "type"
    | "title"
    | "description"
    | "docs"
    | "dependencies"
    | "registryDependencies"
    | "devDependencies"
    | "cssVars"
    | "css"
    | "envVars"
    | "categories"
    | "meta"
    | "sortOrder"
  >
>;

export type UpsertFileInput = {
  itemId: string;
  path: string;
  type: RegistryFileType;
  target?: string | null;
  content: string;
};

export interface GithubExport {
  id: string;
  registryId: string;
  githubRepoUrl: string;
  githubPagesUrl: string | null;
  githubRepoOwner: string;
  githubRepoName: string;
  lastCommitSha: string | null;
  syncSnapshot: Record<string, string> | null;
  exportedAt: Date;
  lastSyncedAt: Date | null;
}

export interface ExportResult {
  repoUrl: string;
  pagesUrl: string;
  owner: string;
  repo: string;
  commitSha: string;
}

export interface ScaffoldFile {
  path: string;
  content: string;
}

export interface SyncStatus {
  hasRemoteChanges: boolean;
  localCommitSha: string | null;
  remoteCommitSha: string;
  lastSyncedAt: Date | null;
}

export interface ImportResult {
  registryId: string;
  itemCount: number;
  fileCount: number;
  githubRepoUrl: string;
}

export interface ShadcnRegistryJson {
  $schema?: string;
  name: string;
  homepage: string;
  items: ShadcnRegistryItemJson[];
}

export interface ShadcnRegistryItemJson {
  $schema?: string;
  name: string;
  type: RegistryItemType;
  title?: string;
  description?: string;
  docs?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: Array<{
    path: string;
    type: string;
    target?: string;
    content?: string;
  }>;
  cssVars?: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  css?: Record<string, unknown>;
  envVars?: Record<string, string>;
  categories?: string[];
  meta?: Record<string, unknown>;
}
