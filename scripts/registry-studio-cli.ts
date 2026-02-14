#!/usr/bin/env bun

interface CliArgs {
  command: string;
  name?: string;
  registry?: string;
  path?: string;
  baseUrl?: string;
}

const BASE_URL = process.env.ELEMENTS_BASE_URL || 'https://tryelements.dev';
const API_KEY = process.env.ELEMENTS_API_KEY;

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const parsed: CliArgs = { command: args[0] || 'help' };

  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1];
      if (key === 'name') parsed.name = value;
      if (key === 'registry') parsed.registry = value;
      if (key === 'base-url') parsed.baseUrl = value;
      i++;
    } else if (!parsed.path) {
      parsed.path = args[i];
    }
  }

  return parsed;
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}/api/studio${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

async function createRegistry(name: string) {
  console.log(`Creating registry: ${name}`);
  const result = await apiRequest('/registries', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  console.log('Registry created:', result);
  return result;
}

async function addComponent(path: string, registrySlug: string) {
  console.log(`Adding component from ${path} to registry ${registrySlug}`);

  const file = Bun.file(path);
  if (!(await file.exists())) {
    throw new Error(`File not found: ${path}`);
  }

  const content = await file.text();
  const name = path.split('/').pop()?.replace(/\.(tsx|ts|jsx|js)$/, '') || 'component';

  const result = await apiRequest(`/registries/${registrySlug}/items`, {
    method: 'POST',
    body: JSON.stringify({ name, code: content, path }),
  });

  console.log('Component added:', result);
  return result;
}

async function validateRegistry(registrySlug: string) {
  console.log(`Validating registry: ${registrySlug}`);
  const result = await apiRequest(`/registries/${registrySlug}/validate`);

  if (result.valid) {
    console.log('✓ Registry is valid');
  } else {
    console.log('✗ Validation failed:');
    for (const error of result.errors || []) {
      console.log(`  - ${error}`);
    }
  }

  return result;
}

async function buildRegistry(registrySlug: string) {
  console.log(`Building registry: ${registrySlug}`);
  const result = await apiRequest(`/registries/${registrySlug}/build`, {
    method: 'POST',
  });
  console.log('Registry built successfully');
  console.log(JSON.stringify(result, null, 2));
  return result;
}

async function publishRegistry(registrySlug: string) {
  console.log(`Publishing registry: ${registrySlug}`);
  const result = await apiRequest(`/registries/${registrySlug}/publish`, {
    method: 'POST',
  });
  console.log('✓ Registry published');
  return result;
}

async function scanDirectory(dirPath: string, registrySlug: string) {
  console.log(`Scanning directory: ${dirPath}`);

  const glob = new Bun.Glob('**/*.{tsx,ts,jsx,js}');
  const files = Array.from(glob.scanSync(dirPath));

  console.log(`Found ${files.length} files`);

  let added = 0;
  let failed = 0;

  for (const file of files) {
    try {
      await addComponent(`${dirPath}/${file}`, registrySlug);
      added++;
    } catch (error) {
      console.error(`Failed to add ${file}:`, (error as Error).message);
      failed++;
    }
  }

  console.log(`\nSummary: ${added} added, ${failed} failed`);
}

function showHelp() {
  console.log(`
Registry Studio CLI

Usage:
  registry-studio-cli <command> [options]

Commands:
  create --name "my-registry"                    Create a new registry
  add <path> --registry <slug>                   Add a component to a registry
  validate --registry <slug>                     Validate a registry
  build --registry <slug>                        Build registry JSON output
  publish --registry <slug>                      Publish a registry
  scan <directory> --registry <slug>             Scan directory for components

Options:
  --base-url <url>                               API base URL (default: https://tryelements.dev)

Environment:
  ELEMENTS_API_KEY                               API key for authentication
  ELEMENTS_BASE_URL                              Override default base URL

Examples:
  registry-studio-cli create --name "my-components"
  registry-studio-cli add ./Button.tsx --registry my-components
  registry-studio-cli scan ./components --registry my-components
  registry-studio-cli build --registry my-components
  registry-studio-cli publish --registry my-components
  `);
}

async function main() {
  try {
    const args = parseArgs();

    if (args.baseUrl) {
      process.env.ELEMENTS_BASE_URL = args.baseUrl;
    }

    if (!API_KEY && args.command !== 'help') {
      console.error('Error: ELEMENTS_API_KEY environment variable is required');
      process.exit(1);
    }

    switch (args.command) {
      case 'create':
        if (!args.name) {
          console.error('Error: --name is required');
          process.exit(1);
        }
        await createRegistry(args.name);
        break;

      case 'add':
        if (!args.path || !args.registry) {
          console.error('Error: path and --registry are required');
          process.exit(1);
        }
        await addComponent(args.path, args.registry);
        break;

      case 'validate':
        if (!args.registry) {
          console.error('Error: --registry is required');
          process.exit(1);
        }
        await validateRegistry(args.registry);
        break;

      case 'build':
        if (!args.registry) {
          console.error('Error: --registry is required');
          process.exit(1);
        }
        await buildRegistry(args.registry);
        break;

      case 'publish':
        if (!args.registry) {
          console.error('Error: --registry is required');
          process.exit(1);
        }
        await publishRegistry(args.registry);
        break;

      case 'scan':
        if (!args.path || !args.registry) {
          console.error('Error: directory path and --registry are required');
          process.exit(1);
        }
        await scanDirectory(args.path, args.registry);
        break;

      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

main();
