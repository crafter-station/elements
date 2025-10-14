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

const REGISTRY_DIR = join(process.cwd(), "src/registry");
const OUTPUT_FILE = join(process.cwd(), "registry.json");

function main() {
  console.log("🔍 Scanning registry for provider files...\n");

  const allItems: RegistryItem[] = [];
  const providers = readdirSync(REGISTRY_DIR);

  for (const provider of providers) {
    const registryPath = join(REGISTRY_DIR, provider, "registry.json");

    if (existsSync(registryPath)) {
      console.log(`📦 Found registry in: ${provider}`);
      const registry: Registry = JSON.parse(
        readFileSync(registryPath, "utf-8"),
      );

      if (registry.items && Array.isArray(registry.items)) {
        console.log(`   ✓ ${registry.items.length} items`);
        allItems.push(...registry.items);
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
