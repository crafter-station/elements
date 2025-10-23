#!/usr/bin/env bun

/**
 * Fix all file paths in registry-item.json files after flattening
 * Updates paths from nested structure to flat structure
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BLOCKS_DIR = join(process.cwd(), "registry/default/blocks");

function fixRegistryItem(componentName: string, registryItemPath: string) {
  const content = readFileSync(registryItemPath, "utf-8");
  const item = JSON.parse(content);

  if (!item.files) return false;

  let hasChanges = false;

  // Fix each file path
  item.files = item.files.map((file: any) => {
    // Old pattern: registry/default/blocks/[provider]/[component]/...
    // New pattern: registry/default/blocks/[component]/...

    const oldPath = file.path;

    // Match pattern: registry/default/blocks/PROVIDER/COMPONENT/rest
    const match = oldPath.match(
      /^registry\/default\/blocks\/([^/]+)\/([^/]+)\/(.+)$/,
    );

    if (match) {
      const [, _provider, _component, rest] = match;

      // New path should be: registry/default/blocks/COMPONENT/rest
      const newPath = `registry/default/blocks/${componentName}/${rest}`;

      if (newPath !== oldPath) {
        console.log(`   ${componentName}: ${rest}`);
        hasChanges = true;
        return { ...file, path: newPath };
      }
    }

    return file;
  });

  if (hasChanges) {
    writeFileSync(registryItemPath, `${JSON.stringify(item, null, 2)}\n`);
  }

  return hasChanges;
}

function main() {
  console.log("🔧 Fixing all registry-item.json file paths...\n");

  const components = readdirSync(BLOCKS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort();

  let fixedCount = 0;

  for (const componentName of components) {
    const registryItemPath = join(
      BLOCKS_DIR,
      componentName,
      "registry-item.json",
    );

    try {
      const hasChanges = fixRegistryItem(componentName, registryItemPath);
      if (hasChanges) {
        fixedCount++;
      }
    } catch (error) {
      console.warn(`⚠ Skipping ${componentName}:`, error);
    }
  }

  console.log(`\n✨ Fixed ${fixedCount} components`);
  console.log("\nAll paths now use flat structure:");
  console.log("   registry/default/blocks/[component]/[subdir]/[file]");
}

main();
