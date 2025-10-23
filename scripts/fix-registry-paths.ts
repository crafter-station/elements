#!/usr/bin/env bun

/**
 * Fix file paths in registry-item.json files
 * Update src/registry/... paths to registry/default/blocks/...
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REGISTRY_DIR = join(process.cwd(), "registry/default/blocks");

function findAllRegistryItemFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentPath: string) {
    const entries = readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name === "registry-item.json") {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function main() {
  console.log("🔧 Fixing file paths in registry-item.json files...\n");

  const files = findAllRegistryItemFiles(REGISTRY_DIR);
  let fixedCount = 0;

  for (const file of files) {
    let content = readFileSync(file, "utf-8");
    const original = content;

    // Replace src/registry/[provider]/[component]/ with registry/default/blocks/[provider]/[component]/
    content = content.replace(
      /"path":\s*"src\/registry\/([^"]+)"/g,
      (_match, path) => {
        const provider = path.split("/")[0];
        const rest = path.split("/").slice(1).join("/");
        return `"path": "registry/default/blocks/${provider}/${rest}"`;
      },
    );

    if (content !== original) {
      writeFileSync(file, content);
      fixedCount++;

      // Extract component name from path
      const componentName = JSON.parse(content).name;
      console.log(`   ✓ ${componentName}`);
    }
  }

  console.log(`\n✨ Fixed ${fixedCount} registry-item.json files`);
}

main();
