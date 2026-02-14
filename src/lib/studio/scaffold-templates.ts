import { buildRegistryIndex } from "./registry-builder";
import type {
  StudioRegistry,
  StudioRegistryItem,
  ScaffoldFile,
} from "./types";

export function generateScaffoldFiles(
  registry: StudioRegistry,
  items: StudioRegistryItem[],
  pagesUrl: string,
): ScaffoldFile[] {
  const files: ScaffoldFile[] = [];

  files.push({
    path: "registry.json",
    content: JSON.stringify(
      buildRegistryIndex(registry, items),
      null,
      2,
    ),
  });

  for (const item of items) {
    for (const file of item.files) {
      files.push({
        path: `registry/${item.name}/${file.path.split("/").pop() || file.path}`,
        content: file.content,
      });
    }
  }

  files.push({
    path: "package.json",
    content: generatePackageJson(registry.name),
  });

  files.push({
    path: "components.json",
    content: generateComponentsJson(),
  });

  files.push({
    path: "tsconfig.json",
    content: generateTsConfig(),
  });

  files.push({
    path: ".github/workflows/deploy.yml",
    content: generateDeployWorkflow(),
  });

  files.push({
    path: "README.md",
    content: generateReadme(registry, pagesUrl),
  });

  files.push({
    path: ".gitignore",
    content: generateGitignore(),
  });

  return files;
}

function generatePackageJson(registryName: string): string {
  return JSON.stringify(
    {
      name: registryName,
      version: "0.0.1",
      private: true,
      scripts: {
        build: "npx shadcn@latest registry:build",
      },
    },
    null,
    2,
  );
}

function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        baseUrl: ".",
        paths: { "@/*": ["./*"] },
      },
    },
    null,
    2,
  );
}

function generateComponentsJson(): string {
  return JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema.json",
      style: "new-york",
      rsc: true,
      tsx: true,
      tailwind: {
        config: "tailwind.config.ts",
        css: "app/globals.css",
        baseColor: "neutral",
        cssVariables: true,
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
      },
    },
    null,
    2,
  );
}

function generateDeployWorkflow(): string {
  return `name: Build and Deploy Registry

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npx shadcn@latest registry:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
`;
}

function generateReadme(
  registry: StudioRegistry,
  pagesUrl: string,
): string {
  const displayName = registry.displayName || registry.name;
  return `# ${displayName}

${registry.description || "A shadcn/ui component registry."}

## Usage

Add components from this registry using the shadcn CLI:

\`\`\`bash
npx shadcn@latest add "${pagesUrl}/r/{component-name}.json"
\`\`\`

Or configure as a namespace in your \`components.json\`:

\`\`\`json
{
  "registries": {
    "${registry.slug}": {
      "url": "${pagesUrl}/r"
    }
  }
}
\`\`\`

Then install components by name:

\`\`\`bash
npx shadcn@latest add ${registry.slug}/{component-name}
\`\`\`

## Development

Build the registry locally:

\`\`\`bash
npx shadcn@latest registry:build
\`\`\`

Built files will be output to \`public/r/\`.

## Deployment

This registry auto-deploys to GitHub Pages on every push to \`main\`.

Registry URL: ${pagesUrl}

---

Built with [Elements Studio](https://tryelements.dev/studio)
`;
}

function generateGitignore(): string {
  return `node_modules/
public/r/
.next/
dist/
*.log
`;
}
