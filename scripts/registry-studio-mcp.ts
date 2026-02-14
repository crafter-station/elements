#!/usr/bin/env bun

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const BASE_URL = process.env.ELEMENTS_BASE_URL || 'https://tryelements.dev';
const API_KEY = process.env.ELEMENTS_API_KEY;

interface Registry {
  id: string;
  slug: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
}

interface RegistryItem {
  id: string;
  name: string;
  code: string;
  path?: string;
  metadata?: Record<string, unknown>;
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

const server = new Server(
  {
    name: 'registry-studio',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'registry_list',
        description: 'List all registries for the authenticated user',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'registry_create',
        description: 'Create a new registry',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Registry name',
            },
            description: {
              type: 'string',
              description: 'Registry description',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'registry_get',
        description: 'Get registry details by slug',
        inputSchema: {
          type: 'object',
          properties: {
            slug: {
              type: 'string',
              description: 'Registry slug',
            },
          },
          required: ['slug'],
        },
      },
      {
        name: 'registry_delete',
        description: 'Delete a registry',
        inputSchema: {
          type: 'object',
          properties: {
            slug: {
              type: 'string',
              description: 'Registry slug',
            },
          },
          required: ['slug'],
        },
      },
      {
        name: 'item_list',
        description: 'List all items in a registry',
        inputSchema: {
          type: 'object',
          properties: {
            registry: {
              type: 'string',
              description: 'Registry slug',
            },
          },
          required: ['registry'],
        },
      },
      {
        name: 'item_add',
        description: 'Add an item to a registry',
        inputSchema: {
          type: 'object',
          properties: {
            registry: {
              type: 'string',
              description: 'Registry slug',
            },
            name: {
              type: 'string',
              description: 'Item name',
            },
            code: {
              type: 'string',
              description: 'Component code',
            },
            path: {
              type: 'string',
              description: 'File path (optional)',
            },
          },
          required: ['registry', 'name', 'code'],
        },
      },
      {
        name: 'item_update',
        description: 'Update an item in a registry',
        inputSchema: {
          type: 'object',
          properties: {
            registry: {
              type: 'string',
              description: 'Registry slug',
            },
            itemId: {
              type: 'string',
              description: 'Item ID',
            },
            code: {
              type: 'string',
              description: 'Updated component code',
            },
            path: {
              type: 'string',
              description: 'Updated file path',
            },
          },
          required: ['registry', 'itemId'],
        },
      },
      {
        name: 'item_delete',
        description: 'Delete an item from a registry',
        inputSchema: {
          type: 'object',
          properties: {
            registry: {
              type: 'string',
              description: 'Registry slug',
            },
            itemId: {
              type: 'string',
              description: 'Item ID',
            },
          },
          required: ['registry', 'itemId'],
        },
      },
      {
        name: 'registry_build',
        description: 'Build registry JSON output',
        inputSchema: {
          type: 'object',
          properties: {
            slug: {
              type: 'string',
              description: 'Registry slug',
            },
          },
          required: ['slug'],
        },
      },
      {
        name: 'registry_publish',
        description: 'Publish a registry (set as public)',
        inputSchema: {
          type: 'object',
          properties: {
            slug: {
              type: 'string',
              description: 'Registry slug',
            },
          },
          required: ['slug'],
        },
      },
      {
        name: 'registry_validate',
        description: 'Validate all items in a registry',
        inputSchema: {
          type: 'object',
          properties: {
            slug: {
              type: 'string',
              description: 'Registry slug',
            },
          },
          required: ['slug'],
        },
      },
      {
        name: 'analyze_code',
        description: 'AI-analyze code to extract metadata (dependencies, props, etc)',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Component code to analyze',
            },
          },
          required: ['code'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'registry_list': {
        const registries = await apiRequest('/registries');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(registries, null, 2),
            },
          ],
        };
      }

      case 'registry_create': {
        const { name, description } = args as { name: string; description?: string };
        const registry = await apiRequest('/registries', {
          method: 'POST',
          body: JSON.stringify({ name, description }),
        });
        return {
          content: [
            {
              type: 'text',
              text: `Registry created: ${registry.slug}`,
            },
          ],
        };
      }

      case 'registry_get': {
        const { slug } = args as { slug: string };
        const registry = await apiRequest(`/registries/${slug}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(registry, null, 2),
            },
          ],
        };
      }

      case 'registry_delete': {
        const { slug } = args as { slug: string };
        await apiRequest(`/registries/${slug}`, { method: 'DELETE' });
        return {
          content: [
            {
              type: 'text',
              text: `Registry ${slug} deleted`,
            },
          ],
        };
      }

      case 'item_list': {
        const { registry } = args as { registry: string };
        const items = await apiRequest(`/registries/${registry}/items`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(items, null, 2),
            },
          ],
        };
      }

      case 'item_add': {
        const { registry, name, code, path } = args as {
          registry: string;
          name: string;
          code: string;
          path?: string;
        };
        const item = await apiRequest(`/registries/${registry}/items`, {
          method: 'POST',
          body: JSON.stringify({ name, code, path }),
        });
        return {
          content: [
            {
              type: 'text',
              text: `Item added: ${item.id}`,
            },
          ],
        };
      }

      case 'item_update': {
        const { registry, itemId, code, path } = args as {
          registry: string;
          itemId: string;
          code?: string;
          path?: string;
        };
        const item = await apiRequest(`/registries/${registry}/items/${itemId}`, {
          method: 'PATCH',
          body: JSON.stringify({ code, path }),
        });
        return {
          content: [
            {
              type: 'text',
              text: `Item updated: ${item.id}`,
            },
          ],
        };
      }

      case 'item_delete': {
        const { registry, itemId } = args as { registry: string; itemId: string };
        await apiRequest(`/registries/${registry}/items/${itemId}`, { method: 'DELETE' });
        return {
          content: [
            {
              type: 'text',
              text: `Item ${itemId} deleted`,
            },
          ],
        };
      }

      case 'registry_build': {
        const { slug } = args as { slug: string };
        const result = await apiRequest(`/registries/${slug}/build`, { method: 'POST' });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'registry_publish': {
        const { slug } = args as { slug: string };
        await apiRequest(`/registries/${slug}/publish`, { method: 'POST' });
        return {
          content: [
            {
              type: 'text',
              text: `Registry ${slug} published`,
            },
          ],
        };
      }

      case 'registry_validate': {
        const { slug } = args as { slug: string };
        const result = await apiRequest(`/registries/${slug}/validate`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'analyze_code': {
        const { code } = args as { code: string };
        const result = await apiRequest('/analyze', {
          method: 'POST',
          body: JSON.stringify({ code }),
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${(error as Error).message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
