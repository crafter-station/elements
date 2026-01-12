#!/usr/bin/env bun
/**
 * Scaffold a new element for the Elements registry
 *
 * Usage:
 *   bun run .claude/skills/create-element/scripts/scaffold-element.ts <category> <component-name>
 *
 * Examples:
 *   bun run .claude/skills/create-element/scripts/scaffold-element.ts ui dropdown-menu
 *   bun run .claude/skills/create-element/scripts/scaffold-element.ts theme theme-switcher-tabs
 *   bun run .claude/skills/create-element/scripts/scaffold-element.ts clerk clerk-user-button
 */

import { exists, mkdir, writeFile } from "fs/promises";
import { join } from "path";

const [category, name] = Bun.argv.slice(2);

if (!category || !name) {
  console.error(
    "Usage: bun run scaffold-element.ts <category> <component-name>",
  );
  console.error("Example: bun run scaffold-element.ts ui dropdown-menu");
  process.exit(1);
}

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

const basePath = `registry/default/blocks/${category}/${name}`;
const componentPath = join(basePath, "components/elements");
const componentFile = join(componentPath, `${name}.tsx`);

if (await exists(basePath)) {
  console.error(`Error: ${basePath} already exists`);
  process.exit(1);
}

await mkdir(componentPath, { recursive: true });

const pascalName = toPascalCase(name);

const registryItem = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name,
  type: "registry:ui",
  title: pascalName.replace(/([A-Z])/g, " $1").trim(),
  description: "TODO: Add description",
  registryDependencies: [],
  dependencies: [],
  files: [
    {
      path: componentFile,
      type: "registry:component",
    },
  ],
  docs: "TODO: Add documentation",
  categories: [category],
};

await writeFile(
  join(basePath, "registry-item.json"),
  JSON.stringify(registryItem, null, 2) + "\n",
);

const componentTemplate = `import { cn } from "@/lib/utils";

interface ${pascalName}Props extends React.ComponentProps<"div"> {}

export function ${pascalName}({ className, ...props }: ${pascalName}Props) {
  return (
    <div
      data-slot="${name}"
      className={cn("", className)}
      {...props}
    >
      {/* TODO: Implement ${pascalName} */}
    </div>
  );
}
`;

await writeFile(componentFile, componentTemplate);

console.log(`
Scaffolded ${name} at ${basePath}

Files created:
  ${basePath}/registry-item.json
  ${componentFile}

Next steps:
  1. Edit the component implementation
  2. Update registry-item.json (description, dependencies)
  3. Run: bun run build:registry
  4. Test: bun run dev
`);
