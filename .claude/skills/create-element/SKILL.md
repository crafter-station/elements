---
name: create-element
description: |
  Create new UI elements for tryelements.dev registry. Use when: (1) Adding new UI components (buttons, inputs, cards), (2) Building integration components (Clerk, Stripe, Uploadthing), (3) Creating theme-related elements, (4) Any shadcn-style registry component. IMPORTANT: For logo components with variants (icon/wordmark/logo + dark/light), use the logo-with-variants skill instead. This skill includes scaffolding, registry schema, and component patterns. ALWAYS use Context7 MCP to fetch latest dependency docs before implementing.
---

# Create Element

Creates new elements for the Elements registry (tryelements.dev).

## Quick Start

```
Step 1: Scaffold
bun run .claude/skills/create-element/scripts/scaffold-element.ts <category> <name>

Step 2: Implement
Edit component following patterns in references/component-patterns.md

Step 3: Register
bun run build:registry && bun run dev
```

## Context7 Integration (CRITICAL)

**Before implementing any component with external dependencies**, fetch the latest documentation:

### Step 1: Resolve Library ID

```
mcp__context7__resolve-library-id
  libraryName: "radix-ui"
  query: "dialog component accessibility patterns"
```

### Step 2: Query Specific Docs

```
mcp__context7__query-docs
  libraryId: "/radix-ui/primitives"
  query: "Dialog API controlled vs uncontrolled portal usage"
```

### Common Libraries

| Library | Query For |
|---------|-----------|
| `radix-ui` | Primitives (Dialog, Dropdown, Tabs, Select) |
| `next-themes` | Theme provider, useTheme hook, hydration |
| `cmdk` | Command palette patterns |
| `class-variance-authority` | CVA variant patterns |
| `embla-carousel-react` | Carousel implementation |
| `lucide-react` | Icon usage patterns |

## Element Types

| Type | Example | When to Use |
|------|---------|-------------|
| `registry:ui` | button, card, input | Base UI primitives |
| `registry:block` | theme-switcher, polar-checkout | Feature-complete blocks |
| `registry:example` | button-demo | Usage examples |

## References

Read these based on what you're doing:

- **[references/registry-schema.md](references/registry-schema.md)** - When creating/editing registry-item.json
- **[references/component-patterns.md](references/component-patterns.md)** - When writing component code (CVA, cn(), data-slot)
- **[references/documentation.md](references/documentation.md)** - When creating MDX documentation

## Directory Structure

```
registry/default/blocks/{category}/{component-name}/
├── registry-item.json          # Metadata
├── components/
│   └── elements/
│       └── {component}.tsx     # Main component
└── routes/                     # Optional demo routes
    ├── layout.tsx
    └── page.tsx
```

## Workflow Example: Theme Switcher Tabs

### 1. Scaffold

```bash
bun run .claude/skills/create-element/scripts/scaffold-element.ts theme theme-switcher-tabs
```

### 2. Fetch Docs

```
mcp__context7__resolve-library-id
  libraryName: "next-themes"
  query: "useTheme hook theme switching"

mcp__context7__query-docs
  libraryId: "/pacocoursey/next-themes"
  query: "useTheme setTheme resolvedTheme hydration"
```

### 3. Implement

Edit `registry/default/blocks/theme/theme-switcher-tabs/components/elements/theme-switcher-tabs.tsx`:

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeSwitcherTabs({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="h-8 w-24 animate-pulse bg-muted rounded" />;

  return (
    <div data-slot="theme-switcher-tabs" className={cn("...", className)}>
      {/* Implementation */}
    </div>
  );
}
```

### 4. Update registry-item.json

```json
{
  "name": "theme-switcher-tabs",
  "type": "registry:ui",
  "title": "Theme Switcher Tabs",
  "description": "Tab-based theme switcher with Light/Dark/System options",
  "registryDependencies": [],
  "dependencies": ["next-themes"],
  "files": [...],
  "docs": "Requires ThemeProvider. Tab-style theme switcher with system support."
}
```

### 5. Build & Test

```bash
bun run build:registry
bun run dev
```

## Verification Checklist

- [ ] registry-item.json has all required fields ($schema, name, type, title, description, files)
- [ ] Component exports PascalCase function (e.g., `export function ThemeSwitcherTabs`)
- [ ] Uses `cn()` for className merging
- [ ] Has `data-slot` attribute on root element
- [ ] Client components have `"use client"` directive
- [ ] Hydration-safe if using theme/client state
- [ ] `bun run build:registry` succeeds
- [ ] Component renders correctly in dev
- [ ] **If new category**: Provider grouping configured (see "Creating New Categories" section)

## Commands

```bash
# Scaffold new element
bun run .claude/skills/create-element/scripts/scaffold-element.ts <category> <name>

# Build registry
bun run build:registry

# Development server
bun run dev

# Lint/format
bun run lint
bun run format
```

## Common Patterns

### Simple Component (No Dependencies)

```tsx
import { cn } from "@/lib/utils";

interface BadgeProps extends React.ComponentProps<"span"> {}

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}
      {...props}
    />
  );
}
```

### With CVA Variants

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      destructive: "bg-destructive text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}

export { badgeVariants };
```

### With External Dependency (Radix)

```tsx
"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export function Dialog({ children, ...props }: DialogPrimitive.DialogProps) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

export function DialogTrigger({ className, ...props }: DialogPrimitive.DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" className={cn("", className)} {...props} />;
}
```

## Pitfalls to Avoid

- Don't forget `"use client"` for components using hooks
- Don't hardcode colors - use CSS variables (`text-foreground`, `bg-background`)
- Don't skip hydration handling for theme-dependent components
- Don't use `any` types - properly type props
- Don't forget to run `build:registry` after changes

## Creating New Categories (Provider Grouping)

When creating a **new category of components** (not just a new component in an existing category), you must configure the provider system for proper landing page display. Otherwise, each component will appear as a separate "Coming Soon" card.

### When This Applies

- Creating a new integration (e.g., `charts/`, `payments/`, `analytics/`)
- Adding multiple related components that should be grouped together
- The category doesn't exist in the current provider list

### Two-File Setup Required

#### 1. `src/lib/registry-loader.ts`

**Add grouping logic** in `getProviderFromName()` (~line 53):

```typescript
// Special case: chart components go to "charts" provider
if (
  name === "area-chart" ||
  name === "bar-chart-vertical" ||
  name === "heatmap-grid" ||
  name === "growth-stats"
) {
  return "charts";
}
```

**Add provider metadata** in `getProviderMetadata()` (~line 156):

```typescript
charts: {
  displayName: "Charts",
  description: "Data visualization primitives - area charts, heatmaps, bar charts",
  category: "DATA VIZ",
  brandColor: "#14B8A6",
},
```

#### 2. `src/lib/providers.tsx`

**Add provider config** in `providerConfig` (~line 46):

```typescript
charts: {
  isEnabled: true,
  displayName: "Charts",
  description: "Data visualization primitives - area charts, heatmaps, bar charts",
  category: "Data Viz",
},
```

**Add provider icon** in `ProviderIcon()` (~line 196):

```typescript
charts: <ChartIcon className="w-10 h-10" />,
```

Create the icon at `src/components/icons/{provider}.tsx` if needed.

### Provider Metadata Fields

| Field | Example | Purpose |
|-------|---------|---------|
| `displayName` | "Charts" | Landing page card title |
| `description` | "Data visualization..." | Card description |
| `category` | "DATA VIZ" | Badge shown on card |
| `brandColor` | "#14B8A6" | Diagonal hatch pattern color |

### Existing Providers (Reference)

| Provider Key | Display Name | Category |
|--------------|--------------|----------|
| `clerk` | Clerk | USER MGMT |
| `polar` | Polar | MONETIZATION |
| `theme` | Theme Switcher | UI |
| `logos` | Brand Logos | BRAND |
| `uploadthing` | UploadThing | FILES |
| `tinte` | Tinte | THEMING |
| `charts` | Charts | DATA VIZ |

### Naming Convention

The default extraction uses the first part before hyphen:
- `clerk-sign-in` → `clerk`
- `polar-checkout` → `polar`

Add special cases when:
- Components share a category but have different prefixes (e.g., `area-chart`, `heatmap-grid`)
- You want a custom provider name (e.g., `theme-switcher-*` → `theme`)

### MDX Documentation Setup

New categories also need MDX documentation files for the docs pages to render properly:

#### 1. Create Demo Components

For each component, create a demo in `/registry/default/examples/{component}-demo.tsx`:

```tsx
"use client";

import { MyComponent } from "@/registry/default/blocks/{category}/{component}/components/elements/{component}";

export default function MyComponentDemo() {
  return (
    <div className="flex items-center justify-center p-4">
      <MyComponent />
    </div>
  );
}
```

#### 2. Register in MDX Components

Add imports and mappings in `/src/mdx-components.tsx`:

```tsx
// Add import
import MyComponentDemo from "@/registry/default/examples/my-component-demo";

// Add to getMDXComponents return object
MyComponent: MyComponentDemo,
```

#### 3. Create Provider MDX

Create `/src/content/providers/{provider}.mdx`:

```mdx
---
title: My Provider
description: Description of the category
category: CATEGORY TAG
brandColor: "#hexcolor"
---

## Overview

Brief description.

## Components

### Component Name

<ComponentPreviewItem
  componentKey="component-name"
  installUrl="@elements/component-name"
  category="Category"
  name="Component Name"
>
  <ComponentName />
</ComponentPreviewItem>
```

#### 4. Create Component MDX Files

Create `/src/content/components/{provider}/{component}.mdx` for each component:

```mdx
---
title: Component Name
description: Brief description
---

<ComponentPreviewItem
  componentKey="component-name"
  installUrl="@elements/component-name"
  category="Category"
  name="Component Name"
>
  <ComponentName />
</ComponentPreviewItem>

## Overview

## Installation

## Usage

## Props

## Features
```
