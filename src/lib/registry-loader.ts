/**
 * Registry Loader - Reads and groups registry items by provider
 * Source of truth: /public/r/registry.json
 */

import registryData from "@/../public/r/registry.json";

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: Array<{
    path: string;
    type: string;
    target: string;
    content?: string;
  }>;
  docs?: string;
  envVars?: Record<string, string>;
  categories?: string[];
  meta?: {
    hasVariants?: boolean;
    variants?: string[];
    [key: string]: unknown;
  };
}

export interface RegistryData {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

/**
 * Get all registry items
 */
export function getRegistryItems(): RegistryItem[] {
  return (registryData as RegistryData).items;
}

/**
 * Extract provider from component name
 * Examples:
 * - "clerk-sign-in" -> "clerk"
 * - "theme-switcher-dropdown" -> "theme"
 * - "apple-logo" -> "logos"
 * - "polar-sponsorship" -> "polar"
 */
export function getProviderFromName(name: string): string {
  // Special case: all logos go to "logos" provider
  if (name.endsWith("-logo")) {
    return "logos";
  }

  // Special case: theme-switcher variants
  if (name.startsWith("theme-switcher")) {
    return "theme";
  }

  // Special case: theme-editor is tinte
  if (name === "tinte-editor") {
    return "tinte";
  }

  // Special case: clerk-middleware should be under clerk
  if (name === "clerk-middleware") {
    return "clerk";
  }

  // Extract first part of name (before first hyphen)
  const parts = name.split("-");
  return parts[0] || name;
}

/**
 * Get all unique providers
 */
export function getProviders(): string[] {
  const items = getRegistryItems();
  const providers = new Set<string>();

  for (const item of items) {
    // Skip bundle items (they're meta-packages)
    if (item.type === "registry:block" && item.files?.length === 0) {
      continue;
    }

    const provider = getProviderFromName(item.name);
    providers.add(provider);
  }

  return Array.from(providers).sort();
}

/**
 * Get all components for a specific provider
 */
export function getComponentsByProvider(provider: string): RegistryItem[] {
  const items = getRegistryItems();

  return items.filter((item) => {
    // Skip bundle items (they're meta-packages)
    if (item.type === "registry:block" && item.files?.length === 0) {
      return false;
    }

    const itemProvider = getProviderFromName(item.name);
    return itemProvider === provider;
  });
}

/**
 * Get logo components specifically
 */
export function getLogoComponents(): RegistryItem[] {
  return getComponentsByProvider("logos");
}

/**
 * Get a single registry item by name
 */
export function getRegistryItem(name: string): RegistryItem | undefined {
  const items = getRegistryItems();
  return items.find((item) => item.name === name);
}

/**
 * Get provider metadata for display
 */
export function getProviderMetadata(provider: string): {
  name: string;
  displayName: string;
  description: string;
  category: string;
  brandColor: string;
  darkBrandColor?: string;
  componentCount: number;
} {
  const components = getComponentsByProvider(provider);

  // Provider-specific metadata
  const metadata: Record<
    string,
    {
      displayName: string;
      description: string;
      category: string;
      brandColor: string;
      darkBrandColor?: string;
    }
  > = {
    clerk: {
      displayName: "Clerk",
      description:
        "Complete user management suite - Auth, Organizations, Billing & more",
      category: "USER MGMT",
      brandColor: "#6C47FF",
    },
    polar: {
      displayName: "Polar",
      description:
        "Sponsorship and monetization components for open source projects",
      category: "MONETIZATION",
      brandColor: "#0062FF",
    },
    theme: {
      displayName: "Theme Switcher",
      description: "Beautiful theme switcher components with multiple variants",
      category: "UI",
      brandColor: "#FF6B35",
      darkBrandColor: "#FFB84D",
    },
    logos: {
      displayName: "Brand Logos",
      description: "Tech company logos for popular services and platforms",
      category: "BRAND",
      brandColor: "#10B981",
    },
    uploadthing: {
      displayName: "UploadThing",
      description:
        "File upload components with drag & drop and progress tracking",
      category: "FILES",
      brandColor: "#E91515",
    },
    trigger: {
      displayName: "Trigger.dev",
      description: "Background job scheduling and monitoring components",
      category: "BACKGROUND JOBS",
      brandColor: "#8B5CF6",
      darkBrandColor: "#8DFF53",
    },
  };

  const info = metadata[provider] || {
    displayName: provider.charAt(0).toUpperCase() + provider.slice(1),
    description: `${provider} components`,
    category: "COMPONENTS",
    brandColor: "#6366F1",
  };

  return {
    name: provider,
    ...info,
    componentCount: components.length,
  };
}

/**
 * Group components by category (for logos page)
 */
export function groupByCategory(
  items: RegistryItem[],
): Map<string, RegistryItem[]> {
  const groups = new Map<string, RegistryItem[]>();

  for (const item of items) {
    const category = item.categories?.[0] || "Other";

    if (!groups.has(category)) {
      groups.set(category, []);
    }

    groups.get(category)?.push(item);
  }

  return groups;
}
