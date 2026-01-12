# Registry Schema Reference

## registry-item.json Schema

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "component-name",
  "type": "registry:ui | registry:block | registry:example",
  "title": "Display Title",
  "description": "Brief description",
  "registryDependencies": ["@elements/button"],
  "dependencies": ["next-themes"],
  "files": [
    {
      "path": "registry/default/blocks/.../component.tsx",
      "type": "registry:component"
    }
  ],
  "docs": "Documentation shown in registry",
  "categories": ["category1", "category2"]
}
```

## Field Descriptions

| Field | Required | Description |
|-------|----------|-------------|
| `$schema` | Yes | Always `https://ui.shadcn.com/schema/registry-item.json` |
| `name` | Yes | kebab-case identifier, used for installation |
| `type` | Yes | `registry:ui` (primitives), `registry:block` (features), `registry:example` (demos) |
| `title` | Yes | Human-readable name |
| `description` | Yes | Short description for registry |
| `registryDependencies` | No | Other Elements components needed (e.g., `["switch"]`) |
| `dependencies` | No | npm packages needed (e.g., `["next-themes"]`) |
| `files` | Yes | Array of file mappings |
| `docs` | No | Extended documentation string |
| `categories` | No | Tags for filtering |

## File Types

| Type | Use For | Target |
|------|---------|--------|
| `registry:component` | Component TSX files | User's `src/components/` |
| `registry:lib` | Utility files | User's `src/lib/` |
| `registry:page` | Route files | Specified by `target` field |

## Examples

### Simple (Logo)

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "npm-logo",
  "type": "registry:ui",
  "title": "npm Logo",
  "description": "npm logo component",
  "registryDependencies": [],
  "dependencies": [],
  "files": [
    {
      "path": "registry/default/blocks/logos/npm-logo/components/logos/npm.tsx",
      "type": "registry:component"
    }
  ],
  "docs": "npm logo component for the Node.js package manager.",
  "categories": ["Package Manager", "logo", "brand"]
}
```

### Medium (Theme Switcher)

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "theme-switcher-classic",
  "type": "registry:ui",
  "title": "Theme Switcher Classic",
  "description": "A classic theme switcher with animated sun/moon icons",
  "registryDependencies": ["switch"],
  "dependencies": ["next-themes"],
  "files": [
    {
      "path": "registry/default/blocks/theme-switcher/theme-switcher-classic/components/elements/theme-switcher-classic.tsx",
      "type": "registry:component"
    }
  ],
  "docs": "Requires ThemeProvider setup. Switch-based theme switcher with animated icons."
}
```

### Complex (With Routes)

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "polar-checkout",
  "type": "registry:block",
  "title": "Polar Checkout",
  "description": "Complete checkout flow with Polar",
  "registryDependencies": ["button", "card"],
  "dependencies": ["@polar-sh/sdk"],
  "files": [
    {
      "path": "registry/default/blocks/polar/polar-checkout/components/elements/checkout.tsx",
      "type": "registry:component"
    },
    {
      "path": "registry/default/blocks/polar/polar-checkout/routes/layout.tsx",
      "type": "registry:page",
      "target": "app/layout.tsx"
    },
    {
      "path": "registry/default/blocks/polar/polar-checkout/routes/page.tsx",
      "type": "registry:page",
      "target": "app/checkout/page.tsx"
    }
  ],
  "docs": "Full Polar checkout integration with success/cancel handling.",
  "categories": ["payments", "checkout"]
}
```

## Directory Structure

```
registry/default/blocks/{category}/{component-name}/
├── registry-item.json
├── components/
│   └── elements/
│       └── {component}.tsx
└── routes/                    # Optional
    ├── layout.tsx
    └── page.tsx
```

## Build Commands

After creating registry-item.json:

```bash
bun run build:registry    # Regenerate registry
bun run dev               # Test locally
```
