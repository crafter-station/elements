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
  subcategory?: string;
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
export function getProviderFromName(name: string): string | null {
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

  // Special case: github components go to "github" provider
  if (name === "github-stars" || name === "github-contributions") {
    return "github";
  }

  // Special case: devtools components
  if (
    name === "og-image-explorer" ||
    name === "json-viewer" ||
    name === "api-response-viewer" ||
    name === "code-diff-viewer" ||
    name === "cli-output" ||
    name === "env-editor" ||
    name === "error-boundary-ui" ||
    name === "webhook-tester" ||
    name === "schema-viewer"
  ) {
    return "devtools";
  }

  // Special case: ai components go to "ai-elements" provider
  // Check by looking up the item to see if it has a subcategory
  const items = getRegistryItems();
  const item = items.find((i) => i.name === name);
  if (item?.subcategory) {
    return "ai-elements";
  }

  // Legacy: ai- prefixed components also go to ai-elements
  if (name.startsWith("ai-")) {
    return "ai-elements";
  }

  // Special case: animation components go to "animations" provider
  if (name === "text-shimmer") {
    return "animations";
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
    if (provider) {
      providers.add(provider);
    }
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
    tinte: {
      displayName: "Tinte",
      description:
        "AI-powered theme generator for VS Code, shadcn/ui, terminals and more",
      category: "THEMING",
      brandColor: "#6E78D5",
    },
    github: {
      displayName: "GitHub",
      description: "Display GitHub repository statistics with visual charts",
      category: "INTEGRATION",
      brandColor: "#24292F",
      darkBrandColor: "#FFFFFF",
    },
    devtools: {
      displayName: "Dev Tools",
      description: "Developer utilities for auditing and debugging your app",
      category: "DEV TOOLS",
      brandColor: "#F97316",
      darkBrandColor: "#FB923C",
    },
    "ai-elements": {
      displayName: "AI Elements",
      description:
        "Building blocks for AI-powered applications with Vercel AI SDK",
      category: "AI",
      brandColor: "#8B5CF6",
      darkBrandColor: "#A78BFA",
    },
    animations: {
      displayName: "Animations",
      description: "Motion primitives and animated text effects",
      category: "UI",
      brandColor: "#EC4899",
      darkBrandColor: "#F472B6",
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

/**
 * Get all bundle items (collections)
 */
export function getBundles(): RegistryItem[] {
  const items = getRegistryItems();

  return items.filter((item) => {
    // Bundles are registry:block items with no files
    return item.type === "registry:block" && item.files?.length === 0;
  });
}

/**
 * Get bundles for logos specifically
 */
export function getLogoBundles(): RegistryItem[] {
  const bundles = getBundles();

  return bundles.filter((bundle) => {
    // Check if bundle has logo-related dependencies
    return bundle.registryDependencies?.some((dep) => dep.includes("-logo"));
  });
}

/**
 * Get sorted providers in the same order as sidebar
 * (enabled with components first, then building, then disabled, alphabetically within each)
 */
export function getSortedProviders(): string[] {
  const allProviders = getProviders();

  return allProviders.sort((a, b) => {
    const aComponents = getComponentsByProvider(a);
    const bComponents = getComponentsByProvider(b);
    const aHasComponents = aComponents.length > 0;
    const bHasComponents = bComponents.length > 0;

    // Providers with components come first
    if (aHasComponents !== bHasComponents) {
      return aHasComponents ? -1 : 1;
    }

    // Alphabetically within each group
    return a.localeCompare(b);
  });
}

/**
 * Get previous and next component for navigation
 * Includes cross-provider navigation when at boundaries
 */
export function getAdjacentComponents(
  currentProvider: string,
  currentComponent: string,
): {
  previous: { provider: string; component: string; title: string } | null;
  next: { provider: string; component: string; title: string } | null;
} {
  const sortedProviders = getSortedProviders();
  const currentComponents = getComponentsByProvider(currentProvider);
  const currentIndex = currentComponents.findIndex(
    (c) => c.name === currentComponent,
  );

  let previous = null;
  let next = null;

  // Check for next component
  if (currentIndex < currentComponents.length - 1) {
    // Next component in same provider
    const nextComp = currentComponents[currentIndex + 1];
    next = {
      provider: currentProvider,
      component: nextComp.name,
      title: nextComp.title,
    };
  } else {
    // Check next provider
    const currentProviderIndex = sortedProviders.indexOf(currentProvider);
    if (currentProviderIndex < sortedProviders.length - 1) {
      const nextProvider = sortedProviders[currentProviderIndex + 1];
      const nextProviderComponents = getComponentsByProvider(nextProvider);
      if (nextProviderComponents.length > 0) {
        const nextComp = nextProviderComponents[0];
        next = {
          provider: nextProvider,
          component: nextComp.name,
          title: nextComp.title,
        };
      }
    }
  }

  // Check for previous component
  if (currentIndex > 0) {
    // Previous component in same provider
    const prevComp = currentComponents[currentIndex - 1];
    previous = {
      provider: currentProvider,
      component: prevComp.name,
      title: prevComp.title,
    };
  } else {
    // Check previous provider
    const currentProviderIndex = sortedProviders.indexOf(currentProvider);
    if (currentProviderIndex > 0) {
      const prevProvider = sortedProviders[currentProviderIndex - 1];
      const prevProviderComponents = getComponentsByProvider(prevProvider);
      if (prevProviderComponents.length > 0) {
        const prevComp =
          prevProviderComponents[prevProviderComponents.length - 1];
        previous = {
          provider: prevProvider,
          component: prevComp.name,
          title: prevComp.title,
        };
      }
    }
  }

  return { previous, next };
}

export const AI_ELEMENTS_SUBCATEGORIES = {
  chat: {
    displayName: "Chat",
    description: "Core conversational UI components",
    order: 1,
    status: null,
  },
  agentic: {
    displayName: "Agentic",
    description: "Tool use and reasoning components",
    order: 2,
    status: null,
  },
  "multi-agent": {
    displayName: "Multi-Agent",
    description: "Agent orchestration components",
    order: 3,
    status: null,
  },
  devtools: {
    displayName: "Devtools",
    description: "Debugging and inspection tools",
    order: 4,
    status: null,
  },
} as const;

export type AIElementsSubcategory = keyof typeof AI_ELEMENTS_SUBCATEGORIES;

export function getAIElementsSubcategories(): AIElementsSubcategory[] {
  return Object.keys(AI_ELEMENTS_SUBCATEGORIES).sort(
    (a, b) =>
      AI_ELEMENTS_SUBCATEGORIES[a as AIElementsSubcategory].order -
      AI_ELEMENTS_SUBCATEGORIES[b as AIElementsSubcategory].order,
  ) as AIElementsSubcategory[];
}

export function getComponentsBySubcategory(
  subcategory: string,
): RegistryItem[] {
  const items = getRegistryItems();
  return items.filter((item) => item.subcategory === subcategory);
}

export function getSubcategoryMetadata(subcategory: string): {
  displayName: string;
  description: string;
  status?: "beta" | null;
} {
  const meta = AI_ELEMENTS_SUBCATEGORIES[subcategory as AIElementsSubcategory];
  return (
    meta || {
      displayName: subcategory.charAt(0).toUpperCase() + subcategory.slice(1),
      description: `${subcategory} components`,
      status: null,
    }
  );
}
