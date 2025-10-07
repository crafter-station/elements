/**
 * Component Loader - Server-side component loader
 * Maps registry item names to actual component imports
 */

import type { ComponentType } from "react";

/**
 * Get component import path from registry item name
 * Returns the path to import the component from
 */
export function getComponentImportPath(itemName: string): string | null {
  const provider = getProviderFromItemName(itemName);
  const componentPath = getComponentPath(itemName, provider);

  switch (provider) {
    case "logos": {
      // Logo components: apple-logo -> @registry/logos/apple
      const logoName = itemName.replace("-logo", "");
      return `@registry/logos/${logoName}`;
    }

    case "clerk":
      // Skip layouts and other non-component files
      if (itemName.includes("middleware")) return null;
      return `@registry/clerk/${componentPath}`;

    case "theme":
      // Theme components - skip layouts
      if (componentPath.includes("layout")) return null;
      return `@registry/theme/${componentPath}`;

    case "polar":
      return `@registry/polar/${componentPath}`;

    case "uploadthing":
      // Skip core and route files
      if (componentPath.includes("core") || componentPath.includes("route"))
        return null;
      return `@registry/uploadthing/${componentPath}`;

    default:
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
 * Get export name from component name (for logos)
 */
export function getLogoExportName(name: string): string {
  // Convert kebab-case to PascalCase
  const logoName = name.replace("-logo", "");
  const pascalCase = logoName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  return `${pascalCase}Logo`;
}

/**
 * Check if a component can be previewed
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

/**
 * Dynamically load a logo component (client-side only)
 */
export async function loadLogoComponent(
  itemName: string,
): Promise<ComponentType<{ className?: string }> | null> {
  try {
    const logoName = itemName.replace("-logo", "");
    const module = await import(`@registry/logos/${logoName}`);
    return module[getLogoExportName(itemName)] || module.default || null;
  } catch (error) {
    console.error(`Failed to load logo: ${itemName}`, error);
    return null;
  }
}
