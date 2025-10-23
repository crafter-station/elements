#!/usr/bin/env bun

/**
 * Generate registry/blocks.ts from all registry-item.json files
 * Supports nested directory structure organized by provider
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BLOCKS_DIR = join(process.cwd(), "registry/default/blocks");
const OUTPUT_FILE = join(process.cwd(), "registry/blocks.ts");

interface RegistryItem {
  name: string;
  type: string;
  [key: string]: any;
}

/**
 * Recursively find all registry-item.json files
 */
function findRegistryItems(
  dir: string,
  basePath = "",
): Array<{ path: string; relativePath: string }> {
  const results: Array<{ path: string; relativePath: string }> = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      // Check if this directory has a registry-item.json
      const registryItemPath = join(fullPath, "registry-item.json");
      try {
        statSync(registryItemPath);
        results.push({ path: fullPath, relativePath });
      } catch {
        // No registry-item.json in this directory, recurse into subdirectories
        results.push(...findRegistryItems(fullPath, relativePath));
      }
    }
  }

  return results;
}

function main() {
  console.log("📝 Generating registry/blocks.ts...\n");

  // Find all registry-item.json files recursively
  const componentPaths = findRegistryItems(BLOCKS_DIR).sort((a, b) =>
    a.relativePath.localeCompare(b.relativePath),
  );

  console.log(`Found ${componentPaths.length} components\n`);

  // Read all registry-item.json files
  const componentData: Array<{
    name: string;
    varName: string;
    relativePath: string;
    item: RegistryItem;
  }> = [];

  for (const { path: fullPath, relativePath } of componentPaths) {
    const registryItemPath = join(fullPath, "registry-item.json");
    try {
      const content = readFileSync(registryItemPath, "utf-8");
      const item = JSON.parse(content) as RegistryItem;

      // Convert component name to valid variable name
      const varName = relativePath.replace(/[/-]/g, "_");

      componentData.push({
        name: item.name,
        varName,
        relativePath,
        item,
      });
    } catch (_error) {
      console.warn(`⚠ Skipping ${relativePath}: Invalid registry-item.json`);
    }
  }

  // Generate imports
  const imports = componentData
    .map(({ varName, relativePath }) => {
      return `import ${varName} from './default/blocks/${relativePath}/registry-item.json' with { type: 'json' }`;
    })
    .join("\n");

  // Generate exports array
  const exports = componentData
    .map(({ varName }) => {
      return `  ${varName} as RegistryItem,`;
    })
    .join("\n");

  // Generate the file content
  const fileContent = `import type { RegistryItem } from "shadcn/registry";

// Auto-generated imports from registry/default/blocks (supports nested structure)
${imports}

export const blocks = [
${exports}
] as RegistryItem[]
`;

  writeFileSync(OUTPUT_FILE, fileContent);

  console.log(`✅ Generated ${OUTPUT_FILE}`);
  console.log(`   ${componentData.length} components exported`);

  // Log provider breakdown
  const providerCounts = new Map<string, number>();
  for (const { relativePath } of componentData) {
    const provider = relativePath.split("/")[0];
    providerCounts.set(provider, (providerCounts.get(provider) || 0) + 1);
  }

  console.log("\n📊 Components by provider:");
  for (const [provider, count] of Array.from(providerCounts.entries()).sort()) {
    console.log(`   ${provider}: ${count} components`);
  }
}

main();
