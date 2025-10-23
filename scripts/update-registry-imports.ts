#!/usr/bin/env bun

/**
 * Update imports in registry files to use @/registry pattern
 *
 * This script updates all imports in the registry files to follow shadcn conventions:
 * - @/components/ui/button -> @/registry/default/blocks/...
 * - @/components/clerk-logo -> @/registry/default/blocks/logos/clerk-logo
 * - Relative imports -> @/registry/default/blocks/...
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const REGISTRY_DIR = join(process.cwd(), 'registry/default/blocks');

interface ImportMapping {
  from: RegExp;
  to: (match: string, ...groups: string[]) => string;
  description: string;
}

// Define import mappings
const importMappings: ImportMapping[] = [
  // Logo imports: @/components/ui/logos/apple -> @/registry/default/blocks/logos/apple-logo/components/apple
  {
    from: /@\/components\/ui\/logos\/([a-z-]+)/g,
    to: (match, logoName) => {
      // Map logo file names to component names
      const logoMapping: Record<string, string> = {
        apple: 'apple-logo',
        linear: 'linear-logo',
        microsoft: 'microsoft-logo',
        github: 'github-logo',
        spotify: 'spotify-logo',
        slack: 'slack-logo',
        twitch: 'twitch-logo',
        twitter: 'twitter-logo',
        gitlab: 'gitlab-logo',
        discord: 'discord-logo',
        notion: 'notion-logo',
        google: 'google-logo',
        qwen: 'qwen-logo',
        moonshot: 'moonshot-ai-logo',
        cohere: 'cohere-logo',
        openai: 'openai-logo',
        anthropic: 'anthropic-logo',
        deepseek: 'deepseek-logo',
        hugging: 'hugging-face-logo',
        groq: 'groq-logo',
        grok: 'grok-logo',
        gemini: 'gemini-logo',
        lovable: 'lovable-logo',
        perplexity: 'perplexity-logo',
        xai: 'xai-logo',
        v0: 'v0-logo',
        claude: 'claude-logo',
        mistral: 'mistral-logo',
        meta: 'meta-logo',
        aws: 'aws-logo',
        kimi: 'kimi-logo',
        supabase: 'supabase-logo',
        stripe: 'stripe-logo',
        resend: 'resend-logo',
        'better-auth': 'better-auth-logo',
        upstash: 'upstash-logo',
        vercel: 'vercel-logo',
        'crafter-station': 'crafter-station-logo',
        kebo: 'kebo-logo',
        polar: 'polar-logo',
        tinte: 'tinte-logo',
      };

      const componentName = logoMapping[logoName] || `${logoName}-logo`;
      return `@/registry/default/blocks/logos/${componentName}/components/${logoName}`;
    },
    description: 'Update logo imports',
  },
  // Special case: ClerkLogo
  {
    from: /@\/components\/clerk-logo/g,
    to: () => '@/registry/default/blocks/logos/clerk-logo/components/clerk-logo',
    description: 'Update Clerk logo import',
  },
  // UI component imports remain unchanged - these reference shadcn/ui components
  // We don't change @/components/ui/button etc. because those are external dependencies
];

function findAllTypeScriptFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentPath: string) {
    const entries = readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function updateImportsInFile(filePath: string): boolean {
  let content = readFileSync(filePath, 'utf-8');
  let hasChanges = false;

  for (const mapping of importMappings) {
    const before = content;
    content = content.replace(mapping.from, (...args) => {
      hasChanges = true;
      return mapping.to(...args);
    });

    if (content !== before) {
      console.log(`   → ${mapping.description}`);
    }
  }

  if (hasChanges) {
    writeFileSync(filePath, content);
  }

  return hasChanges;
}

function main() {
  console.log('🔄 Updating imports in registry files to use @/registry pattern...\n');

  const files = findAllTypeScriptFiles(REGISTRY_DIR);
  console.log(`📋 Found ${files.length} TypeScript files\n`);

  let updatedCount = 0;

  for (const file of files) {
    const relativePath = relative(process.cwd(), file);

    const hasChanges = updateImportsInFile(file);

    if (hasChanges) {
      updatedCount++;
      console.log(`✓ ${relativePath}`);
    }
  }

  console.log(`\n✨ Updated ${updatedCount} files`);

  if (updatedCount === 0) {
    console.log('   No changes needed - all imports are already correct!');
  }
}

main();
