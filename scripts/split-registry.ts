#!/usr/bin/env bun

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  registryDependencies?: string[];
  dependencies?: string | string[];
  files?: Array<{
    path: string;
    type: string;
    target: string;
  }>;
  envVars?: Record<string, string>;
  categories?: string[];
  docs?: string;
}

interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

const REGISTRY_FILE = join(process.cwd(), "registry.json");
const PACKAGES_DIR = join(process.cwd(), "packages");

function getPackageForItem(item: RegistryItem): string {
  const name = item.name.toLowerCase();

  // Clerk components
  if (name.includes("clerk")) return "clerk";

  // UploadThing components
  if (name.includes("uploadthing")) return "uploadthing";

  // Polar components
  if (name.includes("polar")) return "polar";

  // Logo components
  if (name.includes("logo")) return "logos";

  // Theme components
  if (name.includes("theme")) return "theme";

  // Default to logos for now (will need manual review)
  console.warn(
    `⚠️  Unknown package for item: ${item.name} - defaulting to 'logos'`,
  );
  return "logos";
}

function main() {
  console.log("📖 Reading main registry...\n");

  const mainRegistry: Registry = JSON.parse(
    readFileSync(REGISTRY_FILE, "utf-8"),
  );

  const packageRegistries: Record<string, RegistryItem[]> = {
    clerk: [],
    uploadthing: [],
    polar: [],
    logos: [],
    theme: [],
  };

  console.log(`Found ${mainRegistry.items.length} total items\n`);

  for (const item of mainRegistry.items) {
    const pkg = getPackageForItem(item);
    packageRegistries[pkg].push(item);
  }

  // Write individual package registries
  for (const [pkg, items] of Object.entries(packageRegistries)) {
    if (items.length === 0) {
      console.log(`📦 @elements/${pkg}: 0 items (skipping)`);
      continue;
    }

    const registry: Registry = {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: `elements-${pkg}`,
      homepage: "https://tryelements.dev",
      items,
    };

    const outputPath = join(PACKAGES_DIR, pkg, "registry.json");
    writeFileSync(outputPath, JSON.stringify(registry, null, 2));
    console.log(`📦 @elements/${pkg}: ${items.length} items → ${outputPath}`);
  }

  console.log("\n✅ Registry split complete!");
  console.log("\n💡 Next steps:");
  console.log("   1. Review the split registries in each package");
  console.log(
    "   2. Run 'bun run registry:merge' to regenerate the main registry",
  );
}

main();
