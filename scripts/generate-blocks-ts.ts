#!/usr/bin/env bun

/**
 * Generate registry/blocks.ts from all registry-item.json files
 * Following Supabase UI Library pattern
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BLOCKS_DIR = join(process.cwd(), "registry/default/blocks");
const OUTPUT_FILE = join(process.cwd(), "registry/blocks.ts");

interface RegistryItem {
  name: string;
  type: string;
  [key: string]: any;
}

function main() {
  console.log("📝 Generating registry/blocks.ts...\n");

  // Get all component directories
  const components = readdirSync(BLOCKS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort();

  console.log(`Found ${components.length} components\n`);

  // Read all registry-item.json files to categorize
  const componentData: Array<{
    name: string;
    varName: string;
    item: RegistryItem;
  }> = [];

  for (const component of components) {
    const registryItemPath = join(BLOCKS_DIR, component, "registry-item.json");
    try {
      const content = readFileSync(registryItemPath, "utf-8");
      const item = JSON.parse(content) as RegistryItem;

      // Convert component name to valid variable name
      const varName = component.replace(/-/g, "_");

      componentData.push({ name: component, varName, item });
    } catch (_error) {
      console.warn(`⚠ Skipping ${component}: No registry-item.json`);
    }
  }

  // Generate imports
  const imports = componentData
    .map(({ varName, name }) => {
      return `import ${varName} from './default/blocks/${name}/registry-item.json' with { type: 'json' }`;
    })
    .join("\n");

  // Generate exports array
  const exports = componentData
    .map(({ varName }) => {
      return `  ${varName} as RegistryItem,`;
    })
    .join("\n");

  // Generate the file content
  const fileContent = `import { type RegistryItem } from 'shadcn/schema'

// Auto-generated imports from registry/default/blocks
${imports}

export const blocks = [
${exports}
] as RegistryItem[]
`;

  writeFileSync(OUTPUT_FILE, fileContent);

  console.log(`✅ Generated ${OUTPUT_FILE}`);
  console.log(`   ${componentData.length} components exported`);
  console.log("\nGenerated blocks.ts with all component imports");
}

main();
