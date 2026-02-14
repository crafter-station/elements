import {
  REGISTRY_SCHEMA_URL,
  REGISTRY_ITEM_SCHEMA_URL,
} from "./constants";
import type {
  StudioRegistry,
  StudioRegistryItem,
  ShadcnRegistryJson,
  ShadcnRegistryItemJson,
} from "./types";

function buildItemJson(
  item: StudioRegistryItem,
  registrySlug: string,
): ShadcnRegistryItemJson {
  const json: ShadcnRegistryItemJson = {
    $schema: REGISTRY_ITEM_SCHEMA_URL,
    name: item.name,
    type: item.type,
    files: item.files.map((f) => ({
      path: f.path,
      type: f.type,
      content: f.content,
      ...(f.target ? { target: f.target } : {}),
    })),
  };

  if (item.title) json.title = item.title;
  if (item.description) json.description = item.description;
  if (item.docs) json.docs = item.docs;
  if (item.dependencies.length > 0) json.dependencies = item.dependencies;
  if (item.devDependencies.length > 0)
    json.devDependencies = item.devDependencies;
  if (item.registryDependencies.length > 0) {
    json.registryDependencies = item.registryDependencies;
  }
  if (
    item.cssVars &&
    (item.cssVars.theme || item.cssVars.light || item.cssVars.dark)
  ) {
    json.cssVars = item.cssVars;
  }
  if (item.css) json.css = item.css;
  if (Object.keys(item.envVars).length > 0) json.envVars = item.envVars;
  if (item.categories.length > 0) json.categories = item.categories;
  if (Object.keys(item.meta).length > 0) json.meta = item.meta;

  return json;
}

export function buildRegistryIndex(
  registry: StudioRegistry,
  items: StudioRegistryItem[],
): ShadcnRegistryJson {
  return {
    $schema: REGISTRY_SCHEMA_URL,
    name: registry.name,
    homepage:
      registry.homepage || "",
    items: items.map((item) => {
      const json = buildItemJson(item, registry.slug);
      const { $schema: _, files: __, ...indexItem } = json;
      return { ...indexItem, files: [] } as ShadcnRegistryItemJson;
    }),
  };
}

export function buildRegistryItemJson(
  item: StudioRegistryItem,
  registrySlug: string,
): ShadcnRegistryItemJson {
  return buildItemJson(item, registrySlug);
}
