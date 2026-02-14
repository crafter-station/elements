import { REGISTRY_ITEM_TYPES, type RegistryItemType } from "./types";

export { REGISTRY_ITEM_TYPES };

export const REGISTRY_SCHEMA_URL = "https://ui.shadcn.com/schema/registry.json";
export const REGISTRY_ITEM_SCHEMA_URL =
  "https://ui.shadcn.com/schema/registry-item.json";

export const ITEM_TYPE_LABELS: Record<RegistryItemType, string> = {
  "registry:lib": "Library",
  "registry:block": "Block",
  "registry:component": "Component",
  "registry:ui": "UI Primitive",
  "registry:hook": "Hook",
  "registry:page": "Page",
  "registry:file": "File",
  "registry:theme": "Theme",
  "registry:style": "Style",
  "registry:item": "Generic Item",
  "registry:example": "Example",
};

export const ITEM_TYPE_DESCRIPTIONS: Record<RegistryItemType, string> = {
  "registry:lib": "Utility or library files (installed to lib/)",
  "registry:block": "Block-level composite component",
  "registry:component": "Standard component (installed to components/)",
  "registry:ui": "Base UI primitive (installed to components/ui/)",
  "registry:hook": "React hook (installed to hooks/)",
  "registry:page": "Full page with routing target",
  "registry:file": "Arbitrary file with explicit target",
  "registry:theme": "Theme configuration with CSS variables",
  "registry:style": "Style variant extending shadcn defaults",
  "registry:item": "Generic registry item",
  "registry:example": "Internal example (not published)",
};

export const ITEM_TYPE_OPTIONS = REGISTRY_ITEM_TYPES.map((type) => ({
  value: type,
  label: ITEM_TYPE_LABELS[type],
  description: ITEM_TYPE_DESCRIPTIONS[type],
}));

export const TARGET_REQUIRED_TYPES: RegistryItemType[] = [
  "registry:page",
  "registry:file",
];

export const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
export const ITEM_NAME_REGEX = /^[a-z0-9][a-z0-9-]*$/;

export const MAX_FILE_SIZE_BYTES = 512 * 1024; // 512KB per file
export const MAX_FILES_PER_ITEM = 20;
export const MAX_ITEMS_PER_REGISTRY = 500;
