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
    const expected = getLogoExportName(itemName);
    if (module[expected]) return module[expected];
    if (module.default) return module.default;
    // Fallback: pick first export ending in "Logo" (handles irregular casings
    // like AWSLambdaLogo, AWSEC2Logo, AWSDynamoDBLogo, etc.)
    for (const key of Object.keys(module)) {
      if (key.endsWith("Logo") && typeof module[key] === "function") {
        return module[key];
      }
    }
    return null;
  } catch (error) {
    console.error(`Failed to load logo: ${itemName}`, error);
    return null;
  }
}
