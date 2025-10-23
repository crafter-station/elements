#!/usr/bin/env bun

/**
 * Generate registry/index.ts from all registry-item.json files
 *
 * This script:
 * 1. Scans registry/default/blocks for all registry-item.json files
 * 2. Reads each file and collects all registry items
 * 3. Generates registry/index.ts that exports all items
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REGISTRY_DIR = join(process.cwd(), "registry/default/blocks");
const OUTPUT_FILE = join(process.cwd(), "registry/index.ts");

interface RegistryItem {
  name: string;
  type: string;
  [key: string]: any;
}

interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

function findAllRegistryItems(dir: string): RegistryItem[] {
  const items: RegistryItem[] = [];

  function traverse(currentPath: string) {
    const entries = readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name === "registry-item.json") {
        try {
          const content = readFileSync(fullPath, "utf-8");
          const item = JSON.parse(content) as RegistryItem;
          items.push(item);
          console.log(`   ✓ ${item.name}`);
        } catch (error) {
          console.error(`   ✗ Error reading ${fullPath}:`, error);
        }
      }
    }
  }

  traverse(dir);
  return items;
}

function generateIndex(items: RegistryItem[]): string {
  // Sort items by name for consistency
  const sortedItems = items.sort((a, b) => a.name.localeCompare(b.name));

  const registry: Registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "elements",
    homepage: "https://tryelements.dev",
    items: sortedItems,
  };

  // Generate TypeScript code
  const code = `/**
 * Elements Registry
 * Auto-generated from registry-item.json files
 * Do not edit manually - run 'bun run scripts/generate-registry-index.ts' to regenerate
 */

import type { RegistryItem } from './utils';

export const registry = ${JSON.stringify(registry, null, 2)} as const;

export default registry;
`;

  return code;
}

function main() {
  console.log("🔍 Scanning for registry items...\n");

  const items = findAllRegistryItems(REGISTRY_DIR);

  console.log(`\n✨ Found ${items.length} registry items`);

  const code = generateIndex(items);

  writeFileSync(OUTPUT_FILE, code);

  console.log(`\n✅ Generated ${OUTPUT_FILE}`);
  console.log(`   Contains ${items.length} components`);
}

main();
