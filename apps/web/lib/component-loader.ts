/**
 * Component Loader - Dynamically imports components for preview
 * Maps registry item names to actual component imports
 */

import type { ComponentType } from "react";

/**
 * Dynamically import a component based on registry item name
 * Maps: clerk-sign-in -> @registry/clerk/sign-in
 */
export async function loadComponent(
  itemName: string,
): Promise<ComponentType<{ className?: string }> | null> {
  try {
    // Extract provider and component name
    const provider = getProviderFromItemName(itemName);
    const componentPath = getComponentPath(itemName, provider);

    // Dynamic import based on provider
    switch (provider) {
      case "logos": {
        // Logo components: apple-logo -> @registry/logos/apple
        const logoName = itemName.replace("-logo", "");
        const module = await import(`@registry/logos/${logoName}`);
        return module[getExportName(logoName)] || module.default || null;
      }

      case "clerk": {
        // Clerk components are in their own structure
        const module = await import(`@registry/clerk/${componentPath}`);
        return module.default || null;
      }

      case "theme": {
        // Theme switcher components
        const module = await import(`@registry/theme/${componentPath}`);
        return module.default || null;
      }

      case "polar": {
        // Polar components
        const module = await import(`@registry/polar/${componentPath}`);
        return module.default || null;
      }

      case "uploadthing": {
        // UploadThing components
        const module = await import(`@registry/uploadthing/${componentPath}`);
        return module.default || null;
      }

      default:
        console.warn(`Unknown provider for component: ${itemName}`);
        return null;
    }
  } catch (error) {
    console.error(`Failed to load component: ${itemName}`, error);
    return null;
  }
}

/**
 * Get provider from item name
 */
function getProviderFromItemName(name: string): string {
  if (name.endsWith("-logo")) return "logos";
  if (name.startsWith("theme-switcher")) return "theme";
  if (name.startsWith("clerk")) return "clerk";
  if (name.startsWith("polar")) return "polar";
  if (name.startsWith("uploadthing")) return "uploadthing";
  if (name.startsWith("trigger")) return "trigger";

  const parts = name.split("-");
  return parts[0] || name;
}

/**
 * Get component path from item name
 * clerk-sign-in -> sign-in
 * theme-switcher-dropdown -> switcher-dropdown
 */
function getComponentPath(name: string, provider: string): string {
  // Remove provider prefix
  let path = name.replace(new RegExp(`^${provider}-`), "");

  // Special cases
  if (provider === "theme" && name.startsWith("theme-switcher")) {
    path = name.replace("theme-switcher-", "");
  }

  return path;
}

/**
 * Get export name from component name
 * apple -> AppleLogo
 * github -> GitHubLogo
 */
function getExportName(name: string): string {
  // Convert kebab-case to PascalCase
  const pascalCase = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  return `${pascalCase}Logo`;
}

/**
 * Load multiple components in parallel
 */
export async function loadComponents(
  itemNames: string[],
): Promise<Map<string, ComponentType<{ className?: string }>>> {
  const componentMap = new Map<string, ComponentType<{ className?: string }>>();

  const results = await Promise.allSettled(
    itemNames.map(async (name) => {
      const component = await loadComponent(name);
      return { name, component };
    }),
  );

  for (const result of results) {
    if (result.status === "fulfilled" && result.value.component) {
      componentMap.set(result.value.name, result.value.component);
    }
  }

  return componentMap;
}

/**
 * Check if a component can be previewed
 * Some components (like middleware) don't have visual previews
 */
export function canPreviewComponent(itemName: string): boolean {
  // Components that can't be previewed
  const nonPreviewable = [
    "clerk-middleware",
    "uploadthing-core",
    "uploadthing-route",
  ];

  return !nonPreviewable.includes(itemName);
}
