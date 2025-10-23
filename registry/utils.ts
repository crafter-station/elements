/**
 * Registry utility functions following shadcn conventions
 */

export interface RegistryFile {
  path: string;
  type: string;
  target?: string;
}

export interface RegistryItem {
  $schema?: string;
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

/**
 * Append multiple registry items to a base item
 * Useful for creating framework-specific variants (e.g., nextjs, react, etc.)
 *
 * @example
 * const baseComponent = { name: 'dropzone', files: [...] }
 * const nextjsClient = { name: 'supabase-client-nextjs', files: [...] }
 * const combined = registryItemAppend(baseComponent, [nextjsClient])
 * // Result: { name: 'dropzone', files: [...baseFiles, ...clientFiles] }
 */
export function registryItemAppend(
  item: RegistryItem,
  items: RegistryItem[]
): RegistryItem {
  return {
    ...item,
    registryDependencies: [
      ...(item.registryDependencies || []),
      ...items.flatMap((i) => i.registryDependencies || []),
    ],
    dependencies: [
      ...(item.dependencies || []),
      ...items.flatMap((i) => i.dependencies || []),
    ],
    files: [...(item.files || []), ...items.flatMap((i) => i.files || [])],
    envVars: {
      ...item.envVars,
      ...items.reduce((acc, i) => ({ ...acc, ...i.envVars }), {} as Record<string, string>),
    },
  };
}

/**
 * Create framework-specific variants for a component
 * Maps a component to multiple client implementations
 *
 * @example
 * const clients = [nextjsClient, reactClient, tanstackClient]
 * const variants = combineWithClients(dropzone, clients)
 * // Result: [dropzone-nextjs, dropzone-react, dropzone-tanstack]
 */
export function combineWithClients(
  component: RegistryItem,
  clients: RegistryItem[]
): RegistryItem[] {
  return clients.map((client) => {
    const clientSuffix = client.name.replace(/^.*-client-/, '');
    return registryItemAppend(
      {
        ...component,
        name: `${component.name}-${clientSuffix}`,
      },
      [client]
    );
  });
}

/**
 * Read and parse a registry-item.json file
 */
export function loadRegistryItem(path: string): RegistryItem {
  const fs = require('node:fs');
  const content = fs.readFileSync(path, 'utf-8');
  return JSON.parse(content) as RegistryItem;
}
