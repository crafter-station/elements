#!/usr/bin/env bun

/**
 * Migration script to restructure registry to shadcn conventions
 *
 * This script:
 * 1. Reads existing registry items from src/registry/[provider]/registry.json
 * 2. Creates new structure: registry/default/blocks/[provider]/[component]/
 * 3. Moves component files and organizes them properly
 * 4. Creates registry-item.json for each component
 * 5. Updates imports to use @/registry pattern
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync, readdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
}

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  registryDependencies?: string[];
  dependencies?: string[];
  files?: RegistryFile[];
  envVars?: Record<string, string>;
  docs?: string;
  categories?: string[];
}

interface ProviderRegistry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

const SRC_REGISTRY_DIR = join(process.cwd(), 'src/registry');
const NEW_REGISTRY_DIR = join(process.cwd(), 'registry');
const DEFAULT_STYLE = 'default';

function ensureDir(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function getComponentName(itemName: string): string {
  // Remove @elements/ prefix if present
  return itemName.replace('@elements/', '');
}

function getProviderFromPath(filePath: string): string | null {
  const match = filePath.match(/src\/registry\/([^/]+)\//);
  return match ? match[1] : null;
}

function organizeFileByType(file: RegistryFile, componentDir: string, provider: string, componentName: string) {
  const originalPath = join(process.cwd(), file.path);

  if (!existsSync(originalPath)) {
    console.warn(`⚠️  File not found: ${file.path}`);
    return null;
  }

  // Determine subdirectory based on file type and path
  let subdir = '';
  const fileName = file.path.split('/').pop() || '';

  if (file.path.includes('/components/')) {
    subdir = 'components';
  } else if (file.path.includes('/hooks/')) {
    subdir = 'hooks';
  } else if (file.path.includes('/lib/')) {
    subdir = 'lib';
  } else if (file.path.includes('/api/')) {
    subdir = 'api';
  } else if (fileName.endsWith('.tsx') && !fileName.includes('page')) {
    subdir = 'components';
  } else if (fileName.endsWith('.ts') && !fileName.includes('route') && !fileName.includes('actions')) {
    subdir = 'lib';
  }

  const targetDir = subdir ? join(componentDir, subdir) : componentDir;
  ensureDir(targetDir);

  const targetPath = join(targetDir, fileName);

  try {
    cpSync(originalPath, targetPath, { force: true });

    // Return the new path relative to project root
    const newPath = relative(process.cwd(), targetPath);
    return newPath;
  } catch (error) {
    console.error(`Error copying ${file.path}:`, error);
    return null;
  }
}

function createRegistryItemJson(
  item: RegistryItem,
  componentDir: string,
  provider: string
): void {
  const registryItemPath = join(componentDir, 'registry-item.json');

  // Create the registry-item.json with updated file paths
  const registryItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: item.name,
    type: item.type,
    ...(item.title && { title: item.title }),
    ...(item.description && { description: item.description }),
    ...(item.registryDependencies && { registryDependencies: item.registryDependencies }),
    ...(item.dependencies && { dependencies: item.dependencies }),
    ...(item.files && { files: item.files }),
    ...(item.envVars && { envVars: item.envVars }),
    ...(item.docs && { docs: item.docs }),
    ...(item.categories && { categories: item.categories }),
  };

  writeFileSync(registryItemPath, JSON.stringify(registryItem, null, 2) + '\n');
  console.log(`   ✓ Created registry-item.json`);
}

function updateImportsInFile(filePath: string, provider: string, componentName: string) {
  if (!existsSync(filePath)) return;

  try {
    let content = readFileSync(filePath, 'utf-8');
    let hasChanges = false;

    // Update imports from @/components/ui/ to @/registry/default/blocks/
    // This is a placeholder - we'll need to be smart about this
    // For now, just add a comment

    if (content.includes('import') && content.includes('@/components/ui/')) {
      // TODO: Update imports - this needs careful handling
      console.log(`   ℹ️  Note: ${filePath} has imports that may need updating`);
    }

    if (hasChanges) {
      writeFileSync(filePath, content);
    }
  } catch (error) {
    console.error(`Error updating imports in ${filePath}:`, error);
  }
}

function migrateProvider(provider: string) {
  console.log(`\n📦 Migrating provider: ${provider}`);

  const providerRegistryPath = join(SRC_REGISTRY_DIR, provider, 'registry.json');

  if (!existsSync(providerRegistryPath)) {
    console.log(`   ⊘ No registry.json found, skipping`);
    return [];
  }

  const providerRegistry: ProviderRegistry = JSON.parse(
    readFileSync(providerRegistryPath, 'utf-8')
  );

  const migratedItems: RegistryItem[] = [];

  for (const item of providerRegistry.items) {
    const componentName = getComponentName(item.name);
    console.log(`\n   → ${item.name} (${componentName})`);

    // Create component directory: registry/default/blocks/[provider]/[component]
    const componentDir = join(
      NEW_REGISTRY_DIR,
      DEFAULT_STYLE,
      'blocks',
      provider,
      componentName
    );

    ensureDir(componentDir);

    // Copy and organize files
    const updatedFiles: RegistryFile[] = [];

    if (item.files) {
      for (const file of item.files) {
        const newPath = organizeFileByType(file, componentDir, provider, componentName);

        if (newPath) {
          updatedFiles.push({
            path: newPath,
            type: file.type,
            ...(file.target && { target: file.target }),
          });

          // Update imports in the copied file
          updateImportsInFile(join(process.cwd(), newPath), provider, componentName);
        }
      }
    }

    // Create updated item with new paths
    const updatedItem: RegistryItem = {
      ...item,
      files: updatedFiles,
    };

    // Create registry-item.json
    createRegistryItemJson(updatedItem, componentDir, provider);

    migratedItems.push(updatedItem);
    console.log(`   ✓ Migrated to ${relative(process.cwd(), componentDir)}`);
  }

  return migratedItems;
}

function main() {
  console.log('🚀 Starting registry migration to shadcn structure...\n');
  console.log('This will:');
  console.log('  1. Create new registry/default/blocks/[provider]/[component] structure');
  console.log('  2. Copy and organize files (components/, lib/, hooks/, api/)');
  console.log('  3. Create registry-item.json for each component');
  console.log('  4. Keep original files in src/registry for reference\n');

  // Ensure base registry structure exists
  ensureDir(join(NEW_REGISTRY_DIR, DEFAULT_STYLE, 'blocks'));

  // Get all providers
  const providers = readdirSync(SRC_REGISTRY_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`📋 Found ${providers.length} providers: ${providers.join(', ')}\n`);

  const allMigratedItems: RegistryItem[] = [];

  // Migrate each provider
  for (const provider of providers) {
    const items = migrateProvider(provider);
    allMigratedItems.push(...items);
  }

  console.log(`\n✨ Migration complete!`);
  console.log(`   ${allMigratedItems.length} components migrated`);
  console.log(`\nNext steps:`);
  console.log(`  1. Review the new registry/ directory structure`);
  console.log(`  2. Create registry/index.ts to export all items`);
  console.log(`  3. Update imports in component files to use @/registry pattern`);
  console.log(`  4. Run 'bun run build:registry' to generate distribution files`);
  console.log(`\nNote: Original files remain in src/registry for reference`);
}

main();
