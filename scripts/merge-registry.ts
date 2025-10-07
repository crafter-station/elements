#!/usr/bin/env bun

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
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

const PACKAGES_DIR = join(process.cwd(), "packages");
const OUTPUT_FILE = join(process.cwd(), "apps/web/registry.json");

function fixFilePaths(item: RegistryItem, pkg: string): RegistryItem {
  if (!item.files) return item;

  const updatedFiles = item.files.map((file) => {
    // Replace registry/default/ with ../../packages/{pkg}/registry/
    // This makes the path relative to apps/web/ where shadcn build runs
    const newPath = file.path.replace(
      /^registry\/default\//,
      `../../packages/${pkg}/registry/`,
    );

    return {
      ...file,
      path: newPath,
    };
  });

  return {
    ...item,
    files: updatedFiles,
  };
}

function main() {
  console.log("🔍 Scanning packages for registry files...\n");

  const allItems: RegistryItem[] = [];
  const packages = readdirSync(PACKAGES_DIR);

  for (const pkg of packages) {
    const registryPath = join(PACKAGES_DIR, pkg, "registry.json");

    if (existsSync(registryPath)) {
      console.log(`📦 Found registry in: @elements/${pkg}`);
      const registry: Registry = JSON.parse(
        readFileSync(registryPath, "utf-8"),
      );

      if (registry.items && Array.isArray(registry.items)) {
        console.log(`   ✓ ${registry.items.length} items`);
        // Fix file paths for each item
        const itemsWithFixedPaths = registry.items.map((item) =>
          fixFilePaths(item, pkg),
        );
        allItems.push(...itemsWithFixedPaths);
      }
    }
  }

  console.log(`\n✨ Total items found: ${allItems.length}`);

  const mergedRegistry: Registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "elements",
    homepage: "https://tryelements.dev",
    items: allItems,
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(mergedRegistry, null, 2));
  console.log(`\n✅ Merged registry written to: ${OUTPUT_FILE}`);
}

main();
