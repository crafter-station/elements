#!/usr/bin/env bun

/**
 * Flatten registry structure from provider/component to flat component structure
 * Following Supabase UI Library pattern
 */

import { readdirSync, statSync, renameSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BLOCKS_DIR = join(process.cwd(), 'registry/default/blocks');
const TEMP_DIR = join(process.cwd(), 'registry/default/blocks_temp');

function main() {
  console.log('🔄 Flattening registry structure...\n');
  console.log('Current structure: registry/default/blocks/[provider]/[component]/');
  console.log('Target structure:  registry/default/blocks/[component]/\n');

  // Create temp directory
  if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR, { recursive: true });
  }

  // Get all provider directories
  const providers = readdirSync(BLOCKS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'blocks_temp')
    .map(dirent => dirent.name);

  console.log(`📦 Found ${providers.length} provider directories:\n   ${providers.join(', ')}\n`);

  let movedCount = 0;

  // Move each component from provider/component to temp/component
  for (const provider of providers) {
    const providerPath = join(BLOCKS_DIR, provider);
    const components = readdirSync(providerPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`\n📁 ${provider}/ (${components.length} components)`);

    for (const component of components) {
      const sourcePath = join(providerPath, component);
      const targetPath = join(TEMP_DIR, component);

      try {
        renameSync(sourcePath, targetPath);
        console.log(`   ✓ Moved ${component}`);
        movedCount++;
      } catch (error) {
        console.error(`   ✗ Failed to move ${component}:`, error);
      }
    }
  }

  // Remove empty provider directories
  console.log('\n🗑️  Removing empty provider directories...');
  for (const provider of providers) {
    const providerPath = join(BLOCKS_DIR, provider);
    try {
      const remaining = readdirSync(providerPath);
      if (remaining.length === 0) {
        // Use rmdir for empty directories
        require('node:fs').rmdirSync(providerPath);
        console.log(`   ✓ Removed ${provider}/`);
      } else {
        console.log(`   ⚠ ${provider}/ not empty, skipping`);
      }
    } catch (error) {
      console.error(`   ✗ Failed to remove ${provider}/:`, error);
    }
  }

  // Move everything from temp back to blocks
  console.log('\n📦 Moving components to flat structure...');
  const tempComponents = readdirSync(TEMP_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const component of tempComponents) {
    const sourcePath = join(TEMP_DIR, component);
    const targetPath = join(BLOCKS_DIR, component);

    try {
      renameSync(sourcePath, targetPath);
      console.log(`   ✓ ${component}`);
    } catch (error) {
      console.error(`   ✗ Failed to move ${component}:`, error);
    }
  }

  // Remove temp directory
  try {
    require('node:fs').rmdirSync(TEMP_DIR);
    console.log('\n✓ Removed temp directory');
  } catch (error) {
    console.log('\n⚠ Could not remove temp directory (may not be empty)');
  }

  console.log(`\n✨ Flattening complete!`);
  console.log(`   ${movedCount} components moved to flat structure`);
  console.log('\nNew structure:');
  console.log('   registry/default/blocks/');
  console.log('   ├── clerk-sign-in-shadcn/');
  console.log('   ├── tinte-editor/');
  console.log('   ├── apple-logo/');
  console.log('   └── ...');
}

main();
