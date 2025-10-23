/**
 * Component Loader - Dynamic logo component loader
 */

import type { ComponentType } from "react";

/**
 * Get export name from component name (for logos)
 * Converts kebab-case to PascalCase (e.g., "apple-logo" -> "AppleLogo")
 */
function getLogoExportName(name: string): string {
  const logoName = name.replace("-logo", "");
  const pascalCase = logoName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  return `${pascalCase}Logo`;
}

/**
 * Dynamically load a logo component (client-side only)
 */
export async function loadLogoComponent(
  itemName: string,
): Promise<ComponentType<{ className?: string }> | null> {
  try {
    const logoName = itemName.replace("-logo", "");
    const module = await import(
      `@/registry/default/blocks/logos/${itemName}/components/logos/${logoName}`
    );
    return module[getLogoExportName(itemName)] || module.default || null;
  } catch (error) {
    console.error(`Failed to load logo: ${itemName}`, error);
    return null;
  }
}
