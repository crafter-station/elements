# Development Workflow - Instructions for Claude

This document provides instructions for Claude (AI assistant) to help developers manage the Elements registry efficiently.

## Overview

When a developer creates a new component and moves it to a package using `bun run move-component`, Claude should help by automatically updating the package's `registry.json` file.

---

## Component Preview System

### Automated Convention-Based Previews

The Elements project uses an **automated, convention-based system** for component previews. Components are automatically detected and previewed on provider pages (`/l/{provider}`) based on their registry metadata.

#### Preview Conventions

**Previewable Components:**

- `type: "registry:ui"` → Always previewable (standalone UI components)
- `type: "registry:block"` with `registry:component` files → Previewable (feature blocks)

**Non-Previewable:**

- `type: "registry:lib"` → Library/utility code (middleware, API routes, helpers)
- `type: "registry:hook"` → React hooks
- `type: "registry:page"` → Page files (have app-specific imports)

#### How It Works

1. **Automatic Detection**: Script scans all `registry.json` files
2. **Component Mapping**: Generates static imports based on conventions
3. **Preview Display**: Provider pages automatically show previewable components
4. **Zero Manual Work**: No manual component mapping needed!

#### Important: Components That Need Props

If your component requires props (like Polar's `SponsorTiers`), you **must** create a preview wrapper:

**Example: `sponsor-tiers-preview.tsx`**

```tsx
"use client";

import { useState } from "react";
import { SponsorTiers } from "./sponsor-tiers";

// Demo data for preview
const mockTiers = [
  { name: "Supporter", price: 10, description: "...", perks: [...] },
  // ... more tiers
];

export function SponsorTiersPreview() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  return (
    <SponsorTiers
      tiers={mockTiers}
      onSponsor={(tier) => console.log("Selected:", tier)}
      selectedTier={selectedTier}
      onTierSelect={setSelectedTier}
      isPending={false}
    />
  );
}
```

**Then in registry.json:**

```json
{
  "files": [
    {
      "path": "registry/default/{provider}/{name}-preview.tsx",
      "type": "registry:component",
      "target": "app/elements/{provider}/{name}-preview.tsx"
    },
    {
      "path": "registry/default/{provider}/{name}.tsx",
      "type": "registry:lib",
      "target": "app/elements/{provider}/{name}.tsx"
    }
  ]
}
```

#### Regenerating Preview Map

After adding/updating components:

```bash
# Automatically runs during build
npm run build

# Or manually trigger
npm run preview:generate
```

This generates `apps/web/lib/component-preview-map.generated.tsx` with all component imports.

**⚠️ DO NOT EDIT** the generated file manually - it will be overwritten!

---

## When User Says: "add {component-name} to {provider} registry"

### Step 1: Confirm Details

Ask the user to confirm:

- **Provider**: Which package (clerk, polar, uploadthing, theme, logos)
- **Component name**: The filename without extension
- **Component type**:
  - `registry:component` - Reusable UI component (for preview wrappers or actual components)
  - `registry:ui` - Standalone UI element (logos, buttons, theme switchers)
  - `registry:block` - Complete feature block (auth flow, checkout, etc)
  - `registry:page` - Full page component (test pages, not for preview)
  - `registry:lib` - Utility/helper functions (middleware, API routes, base components)
- **Does it need props for preview?** If yes, create preview wrapper

### Step 2: Read the Component File

Location pattern: `packages/{provider}/registry/{provider}/{component-name}.tsx`

**Analyze the file for:**

1. **Import statements** → Detect dependencies
2. **@registry/\* imports** → Detect registry dependencies
3. **Component exports** → Verify component structure
4. **Props/interfaces** → Check if component needs demo data for preview
5. **Function signature** → Determine if it requires props

### Step 3: Generate Registry Entry

**Template for UI Components (logos, buttons, etc):**

```json
{
  "name": "component-name",
  "type": "registry:ui",
  "title": "Display Title",
  "description": "Brief description of what it does",
  "registryDependencies": [],
  "dependencies": [],
  "files": [
    {
      "path": "registry/default/{provider}/{component-name}.tsx",
      "type": "registry:component",
      "target": "components/ui/{provider}/{component-name}.tsx"
    }
  ],
  "categories": ["category1", "category2"],
  "docs": "Usage documentation and notes"
}
```

**Template for Components That Need Props:**

```json
{
  "name": "component-name",
  "type": "registry:block",
  "title": "Display Title",
  "description": "Complete feature description",
  "registryDependencies": ["button", "card"],
  "dependencies": ["@some/package"],
  "files": [
    {
      "path": "registry/default/{provider}/{component-name}-preview.tsx",
      "type": "registry:component",
      "target": "app/elements/{provider}/{component-name}-preview.tsx"
    },
    {
      "path": "registry/default/{provider}/{component-name}.tsx",
      "type": "registry:lib",
      "target": "app/elements/{provider}/{component-name}.tsx"
    },
    {
      "path": "registry/default/{provider}/{component-name}/page.tsx",
      "type": "registry:page",
      "target": "app/elements/{provider}/{component-name}/page.tsx"
    }
  ],
  "envVars": {
    "API_KEY": "key_..."
  },
  "docs": "Setup and usage instructions"
}
```

**Template for Complex Blocks (multi-file):**

```json
{
  "name": "component-name",
  "type": "registry:block",
  "title": "Display Title",
  "description": "Complete feature description",
  "registryDependencies": ["button", "card", "@elements/some-logo"],
  "dependencies": ["@clerk/nextjs"],
  "files": [
    {
      "path": "registry/default/{provider}/{component-name}/main.tsx",
      "type": "registry:component",
      "target": "app/elements/{provider}/{component-name}/main.tsx"
    },
    {
      "path": "registry/default/{provider}/{component-name}/actions.ts",
      "type": "registry:lib",
      "target": "app/elements/{provider}/{component-name}/actions.ts"
    },
    {
      "path": "registry/default/{provider}/{component-name}/page.tsx",
      "type": "registry:page",
      "target": "app/elements/{provider}/{component-name}/page.tsx"
    }
  ],
  "envVars": {
    "API_KEY": "key_..."
  },
  "docs": "Detailed setup and usage instructions"
}
```

### Step 4: Auto-Detect Dependencies

**From import statements:**

- `import X from "package-name"` → Add to `dependencies`
- `import X from "@registry/provider/name"` → Add `@elements/name` to `registryDependencies`
- `import { Button } from "@/components/ui/button"` → Add `"button"` to `registryDependencies`

**Common patterns:**

- `@clerk/*` packages → Clerk integration
- `@polar-sh/*` → Polar integration
- `uploadthing` → UploadThing integration
- `next-themes` → Theme switching
- `motion` or `framer-motion` → Animations

### Step 5: Determine File Paths and Types

**IMPORTANT: File Type Guidelines**

- `registry:component` → Use for **preview wrappers** or **standalone components**
  - Examples: `sponsor-tiers-preview.tsx`, `theme-switcher.tsx`, `apple-logo.tsx`
  - These files are imported by the preview system
  - Must be self-contained (no app-specific imports like `@/app/...`)

- `registry:lib` → Use for **base components that need props**, **utilities**, **middleware**
  - Examples: `sponsor-tiers.tsx` (base component), `middleware.ts`, `checkout-route.ts`
  - Not directly previewed
  - Can have complex prop requirements

- `registry:page` → Use for **test pages** and **usage examples**
  - Examples: `page.tsx`, `success-page.tsx`
  - Not used for preview (have app-specific imports)
  - Show full implementation examples

**Path format:** `registry/default/{provider}/{component-name}.tsx`

**For multi-file components:**

```typescript
// Directory structure
packages/{provider}/registry/{provider}/{component-name}/
  ├── {component-name}-preview.tsx   # Preview wrapper (registry:component)
  ├── {component-name}.tsx           # Base component (registry:lib)
  ├── actions.ts                     # Server actions (registry:lib)
  └── page.tsx                       # Test page (registry:page)

// Registry paths:
"files": [
  {
    "path": "registry/default/{provider}/{component-name}/{component-name}-preview.tsx",
    "type": "registry:component",
    "target": "app/elements/{provider}/{component-name}/{component-name}-preview.tsx"
  },
  {
    "path": "registry/default/{provider}/{component-name}/{component-name}.tsx",
    "type": "registry:lib",
    "target": "app/elements/{provider}/{component-name}/{component-name}.tsx"
  },
  {
    "path": "registry/default/{provider}/{component-name}/actions.ts",
    "type": "registry:lib",
    "target": "app/elements/{provider}/{component-name}/actions.ts"
  },
  {
    "path": "registry/default/{provider}/{component-name}/page.tsx",
    "type": "registry:page",
    "target": "app/elements/{provider}/{component-name}/page.tsx"
  }
]
```

### Step 6: Create Preview Wrapper (If Needed)

If component requires props, create a preview wrapper:

```tsx
"use client";

import { useState } from "react";
import { BaseComponent } from "./base-component";

// Mock data for preview
const mockData = [
  // ... demo data
];

export function BaseComponentPreview() {
  const [state, setState] = useState(null);

  const handleAction = (data: string) => {
    console.log("Preview action:", data);
    // Demo implementation
  };

  return (
    <BaseComponent
      data={mockData}
      onAction={handleAction}
      selectedItem={state}
      onSelect={setState}
    />
  );
}
```

### Step 7: Update Registry File

**Location:** `packages/{provider}/registry.json`

**Process:**

1. Read the current `registry.json`
2. Add the new entry to the `items` array
3. Maintain alphabetical order (optional but clean)
4. Validate JSON structure
5. Write the updated file

### Step 8: Regenerate Preview Map

After updating registry:

```bash
bun run scripts/generate-preview-map.ts
```

This updates the preview map with the new component.

### Step 9: Confirm with User

Show the generated entry and ask:

```
✅ Generated registry entry for "{component-name}":

{
  "name": "component-name",
  ...
}

✅ Created preview wrapper: {component-name}-preview.tsx
✅ Added to packages/{provider}/registry.json
✅ Regenerated preview map

Test the preview at: /docs/{provider}
```

---

## Example Interactions

### Example 1: Simple Logo Component

**User:** "add anthropic-logo to logos registry"

**Claude Response:**

```
✓ Reading: packages/logos/registry/logos/anthropic.tsx
✓ Type: registry:ui (no props needed)
✓ Dependencies: None
✓ Files: 1 file
✓ Preview: Will auto-preview (standalone component)

Generated entry:
{
  "name": "anthropic-logo",
  "type": "registry:ui",
  "title": "Anthropic Logo",
  "description": "Anthropic logo component with theme-adaptive colors",
  "registryDependencies": [],
  "dependencies": [],
  "files": [
    {
      "path": "registry/default/logos/anthropic.tsx",
      "type": "registry:component",
      "target": "components/ui/logos/anthropic.tsx"
    }
  ],
  "categories": ["logo", "brand"],
  "docs": "Anthropic logo component that adapts to your theme. Uses currentColor to match your design system."
}

Add to packages/logos/registry.json? (Y/n)
```

### Example 2: Component That Needs Props

**User:** "add checkout-form to polar registry"

**Claude Response:**

```
✓ Reading: packages/polar/registry/polar/checkout-form/checkout-form.tsx
✓ Type: registry:block (requires props: products, onCheckout)
✓ Dependencies: ["@polar-sh/nextjs"]
✓ Registry deps: ["button", "card", "badge"]
✓ Files: 3 files
⚠️  Component needs props - creating preview wrapper

Creating preview wrapper:
✓ Created: checkout-form-preview.tsx with mock data

Generated entry:
{
  "name": "checkout-form",
  "type": "registry:block",
  "title": "Polar Checkout Form",
  "description": "Complete checkout form with product selection and Polar integration",
  "registryDependencies": ["button", "card", "badge", "@elements/polar-logo"],
  "dependencies": ["@polar-sh/nextjs"],
  "files": [
    {
      "path": "registry/default/polar/checkout-form/checkout-form-preview.tsx",
      "type": "registry:component",
      "target": "app/elements/polar/checkout-form/checkout-form-preview.tsx"
    },
    {
      "path": "registry/default/polar/checkout-form/checkout-form.tsx",
      "type": "registry:lib",
      "target": "app/elements/polar/checkout-form/checkout-form.tsx"
    },
    {
      "path": "registry/default/polar/checkout-form/page.tsx",
      "type": "registry:page",
      "target": "app/elements/polar/checkout-form/page.tsx"
    }
  ],
  "envVars": {
    "POLAR_ACCESS_TOKEN": "polar_oat_..."
  },
  "docs": "Polar checkout form with product selection. Requires Polar account and API token."
}

Add to packages/polar/registry.json? (Y/n)
```

---

## Common Patterns by Provider

### Clerk Components

- **Type**: Usually `registry:block` for auth flows, `registry:ui` for UI components
- **Dependencies**: `["@clerk/nextjs", "@clerk/types"]` (sometimes `@clerk/backend`)
- **Registry Deps**: Often includes `button`, `input`, `label`, `card`, `alert`
- **Env Vars**: Always include `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **Middleware**: Include `@elements/clerk-middleware` if needed
- **Preview**: Many auth components work without props (self-contained forms)

### Polar Components

- **Type**: Usually `registry:block`
- **Dependencies**: `["@polar-sh/nextjs"]`
- **Registry Deps**: `button`, `badge`, `card`, `@elements/polar-logo`
- **Env Vars**: `POLAR_ACCESS_TOKEN`, `POLAR_SUCCESS_URL`, `POLAR_BASE_URL`
- **Preview**: Often need preview wrappers (require product data, callbacks)

### UploadThing Components

- **Type**: `registry:block` or `registry:ui`
- **Dependencies**: `["uploadthing", "@uploadthing/react"]`
- **Registry Deps**: `button`, `card` (for dropzone)
- **Env Vars**: `UPLOADTHING_TOKEN`
- **Preview**: Usually self-contained, may need simple callbacks

### Theme Components

- **Type**: `registry:ui`
- **Dependencies**: `["next-themes"]`
- **Registry Deps**: `switch`, `button`, `dropdown-menu` (depending on variant)
- **Special**: Always needs ThemeProvider setup note in docs
- **Preview**: Self-contained, no preview wrappers needed

### Logo Components

- **Type**: Always `registry:ui`
- **Dependencies**: Usually none (pure SVG components)
- **Categories**: `["logo", "brand"]`
- **Docs**: Brief description + "Uses currentColor" or specific brand colors
- **Preview**: Always self-contained, no wrappers needed

---

## Validation Checklist

Before updating registry.json, verify:

- [ ] `name` matches component filename (without extension)
- [ ] `type` is appropriate (ui/block for previewable, lib for utilities)
- [ ] `title` is human-readable and descriptive
- [ ] `description` clearly explains what it does
- [ ] `dependencies` includes all npm packages imported
- [ ] `registryDependencies` includes all `@elements/*` and `@/components/ui/*` imports
- [ ] `files[].path` follows pattern: `registry/default/{provider}/{name}.tsx`
- [ ] `files[].type` is correct:
  - `registry:component` for preview wrappers and standalone components
  - `registry:lib` for base components, utilities, middleware
  - `registry:page` for test pages
- [ ] Preview wrapper created if component needs props
- [ ] `envVars` includes all required environment variables (if any)
- [ ] `docs` provides setup instructions and important notes
- [ ] Preview map regenerated after changes

---

## Preview System Troubleshooting

**Component not showing in preview:**

1. Check if it's marked as `registry:ui` or `registry:block` with `registry:component` file
2. Verify the component file type is `registry:component` (not `registry:page` or `registry:lib`)
3. Regenerate preview map: `bun run scripts/generate-preview-map.ts`
4. Check console for import errors

**Component preview shows error:**

1. Does it require props? → Create preview wrapper
2. Does it have app-specific imports (`@/app/...`)? → Move to `registry:lib`, create preview wrapper
3. Missing dependencies? → Check all imports are in registry

**How to check what's previewable:**

```bash
bun run scripts/generate-preview-map.ts
```

This shows which components are detected and which are skipped.

---

## Build System Integration

The preview system is fully integrated into the build pipeline:

**Build Process:**

1. `npm run build` triggers turbo tasks
2. `//#registry:merge` → Merges all registry files
3. `//#preview:generate` → Generates component preview map
4. `@elements/web#build` → Builds Next.js app with previews

**Scripts:**

- `npm run preview:generate` - Manually regenerate preview map
- `npm run registry:merge` - Manually merge registries
- `npm run build` - Full build (includes both)

**Generated Files:**

- `apps/web/registry.json` - Merged registry (all providers)
- `apps/web/lib/component-preview-map.generated.tsx` - Preview imports

**⚠️ Never edit generated files manually!**

---

## Error Handling

**If component file doesn't exist:**

```
❌ Component not found at packages/{provider}/registry/{provider}/{name}.tsx

Did you run `bun run move-component` first?
```

**If registry.json is malformed:**

```
❌ Invalid JSON in packages/{provider}/registry.json

Please fix the syntax errors first.
```

**If dependencies can't be auto-detected:**

```
⚠️  Could not auto-detect all dependencies.
Please review and add manually if needed:
- Check imports in the component file
- Verify all npm packages are listed
```

**If component needs props but no wrapper:**

```
⚠️  Component requires props but no preview wrapper found.

Create {name}-preview.tsx with demo data, or component won't show in preview.
```

---

## Tips for Claude

1. **Always read the actual component file** - Don't assume structure
2. **Check if props are required** - Look at function signature
3. **Create preview wrappers proactively** - If component needs props, create wrapper
4. **Use appropriate file types**:
   - `registry:component` for preview-ready files
   - `registry:lib` for components that need wrappers
   - `registry:page` for test pages only
5. **Regenerate preview map** - Always run after registry changes
6. **Test the preview** - Suggest user visits `/l/{provider}` to verify
7. **Be conservative with dependencies** - Only include what's actually imported
8. **Include helpful docs** - Setup instructions, gotchas, prerequisites
9. **Maintain consistency** - Look at existing entries for patterns

---

## Quick Reference

**Commands:**

```bash
bun run move-component           # Move component to package
bun run preview:generate         # Regenerate preview map
bun run registry:merge           # Merge all registries
bun run build                    # Full build (merges + preview + build)
```

**Registry file locations:**

- `packages/clerk/registry.json`
- `packages/polar/registry.json`
- `packages/uploadthing/registry.json`
- `packages/theme/registry.json`
- `packages/logos/registry.json`

**Component file locations:**

- `packages/{provider}/registry/{provider}/{name}.tsx`
- `packages/{provider}/registry/{provider}/{name}/{name}.tsx` (multi-file)
- `packages/{provider}/registry/{provider}/{name}/{name}-preview.tsx` (preview wrapper)

**Path patterns:**

- Single file: `registry/default/{provider}/{name}.tsx`
- Multi-file: `registry/default/{provider}/{name}/{file}.tsx`
- Preview wrapper: `registry/default/{provider}/{name}/{name}-preview.tsx`
- Logos special case: `registry/default/logos/{name}.tsx`

**File types:**

- `registry:component` → Preview-ready (standalone or wrapper)
- `registry:ui` → Standalone UI (always previewable)
- `registry:block` → Feature block (previewable if has component file)
- `registry:lib` → Utilities, base components (not previewed)
- `registry:page` → Test pages (not previewed)

**Preview conventions:**

- ✅ `registry:ui` → Auto-preview
- ✅ `registry:block` + `registry:component` file → Auto-preview
- ❌ `registry:lib` → Not previewed
- ❌ `registry:page` → Not previewed
- ❌ Components with app-specific imports → Need wrapper

---

## Documentation

**For more details, see:**

- `scripts/README.md` - Preview system architecture and conventions
- `CLAUDE.md` - Project structure and technologies
- `scripts/generate-preview-map.ts` - Preview map generation logic

---

## Creating a New Element (Provider Package)

### Overview

When creating a completely new Element (like Tinte, Polar, Clerk, etc.), you need to:

1. Create the package structure
2. Set up the registry system
3. Build the component(s)
4. Create documentation page
5. Integrate with the main site

### Step-by-Step: Creating a New Element

#### 1. Create Package Directory Structure

```bash
packages/{provider}/
├── package.json              # Package metadata
├── tsconfig.json            # TypeScript config
├── registry.json            # Registry configuration
├── registry/                # Registry files directory
│   └── {provider}/         # Provider-specific components
│       ├── component.tsx   # Component files
│       └── ...
└── src/                    # Source files (optional)
    └── components/         # Source components
```

**Example package.json:**

```json
{
  "name": "@elements/{provider}",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "echo 'No build script for {provider} package'"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

**Example tsconfig.json:**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./registry/*"],
      "@/registry/*": ["./registry/*"]
    }
  },
  "include": ["registry/**/*", "src/**/*"],
  "exclude": ["node_modules"]
}
```

#### 2. Create Initial Registry File

Create `packages/{provider}/registry.json`:

```json
{
  "name": "{provider}",
  "type": "registry:ui",
  "items": []
}
```

This will be populated as you add components.

#### 3. Build Your Component(s)

Create components in `packages/{provider}/registry/{provider}/`:

**For components that DON'T need props (standalone):**

- Create single file: `component-name.tsx`
- Export as default or named export
- Use `registry:ui` type in registry

**For components that NEED props:**

- Create base component: `component-name.tsx`
- Create preview wrapper: `component-name-preview.tsx`
- Use `registry:block` type in registry
- Mark base as `registry:lib`, preview as `registry:component`

**Important: Avoid File Path Conflicts**

- Components in `registry/{provider}/` are for the registry system
- Components in `src/` are for local development/testing
- If you have both, use symlinks or copy files carefully
- The registry system looks in `registry/{provider}/` ONLY

#### 4. Add Components to Registry

For each component, add entry to `registry.json`:

```json
{
  "items": [
    {
      "name": "component-name",
      "type": "registry:ui",
      "title": "Component Display Name",
      "description": "AI-powered component that does X with Y in Z color space",
      "registryDependencies": ["button", "dialog"],
      "dependencies": ["@uiw/react-color-wheel", "culori"],
      "files": [
        {
          "path": "registry/{provider}/component-name.tsx",
          "type": "registry:component",
          "target": "components/{provider}/component-name.tsx"
        }
      ],
      "categories": ["theme", "editor"],
      "docs": "Usage instructions and setup notes"
    }
  ]
}
```

#### 5. Create Documentation Page

Create docs page at `apps/web/content/docs/{provider}.mdx`:

**Template structure:**

````mdx
---
title: {Provider} - Full Stack Components
description: AI-powered components for {provider} integration with semantic patterns
---

import { TintePreview } from "@/components/elements/tinte-preview";

# {Provider}

<Callout>
  AI-powered components for {Provider} with [key feature] in [color
  space/technology]
</Callout>

## Overview

Brief description of what this Element provides.

## Components

### Component Name

<TintePreview />

Description of the component and what it does.

**Features:**

- Feature 1
- Feature 2
- Feature 3

## Installation

```bash
npx shadcn@latest add https://elements.crafter.so/r/{provider}/component-name
```
````

## Usage

```tsx
import { ComponentName } from "@/components/{provider}/component-name";

export default function Page() {
  return <ComponentName />;
}
```

## Configuration

Environment variables, setup steps, etc.

## API Reference

Props, methods, events, etc.

````

#### 6. Create Preview Component (if needed)

Create preview wrapper at `apps/web/components/elements/{provider}-preview.tsx`:

```tsx
"use client";

import ThemeEditor from "@/../../packages/{provider}/src/components/theme-editor";

export function TintePreview() {
  return (
    <div className="relative w-full min-h-[300px] rounded-lg border bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 p-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">
          Live Component Demo
        </h3>
        <p className="text-sm text-muted-foreground">
          Interactive demo showing the component in action
        </p>

        {/* Demo UI elements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {/* Example color tokens, buttons, etc */}
        </div>
      </div>

      {/* Actual component */}
      <ThemeEditor />
    </div>
  );
}
````

**Key points for preview components:**

- Always `"use client"` directive
- Import from package source (`@/../../packages/{provider}/...`)
- Provide visual context (background, demo elements)
- Show real functionality, not mocks
- Self-contained (no external dependencies)

#### 7. Update Navigation (if needed)

If this is a major Element, add to main navigation in `apps/web/lib/layout.shared.tsx`:

```tsx
const links = [
  { title: "Home", href: "/" },
  { title: "Docs", href: "/docs" },
  { title: "{Provider}", href: "/docs/{provider}" }, // Add here
];
```

#### 8. Test the Integration

```bash
# Build everything
bun run build

# Start dev server
bun run dev

# Visit pages:
# - Main docs: http://localhost:3000/docs/{provider}
# - Component preview: Should show inline in docs
# - Registry: http://localhost:3000/r/{provider}/component-name
```

### Common Patterns for Different Types

#### UI-Only Elements (like Logos, Theme Switchers)

- Simple `registry:ui` type
- No preview wrappers needed
- Single file components
- Minimal dependencies

**Example: Logo Element**

```
packages/logos/
├── registry.json
└── registry/logos/
    ├── anthropic.tsx
    ├── openai.tsx
    └── ...
```

#### Service Integration Elements (like Clerk, Polar, UploadThing)

- Mix of `registry:block` and `registry:ui`
- Often need preview wrappers
- Multiple files (components, actions, middleware)
- External dependencies

**Example: Service Element**

```
packages/clerk/
├── registry.json
└── registry/clerk/
    ├── sign-in/
    │   ├── sign-in.tsx          # Base (registry:lib)
    │   ├── sign-in-preview.tsx  # Preview (registry:component)
    │   └── page.tsx             # Test page (registry:page)
    ├── middleware.ts            # Middleware (registry:lib)
    └── ...
```

#### Editor/Tool Elements (like Tinte)

- Interactive components
- May need both `src/` and `registry/` directories
- Complex state management
- Custom preview components

**Example: Tool Element**

```
packages/tinte/
├── package.json
├── registry.json
├── src/
│   └── components/          # Source files for development
│       ├── theme-editor.tsx
│       ├── color-input.tsx
│       └── logo.tsx
└── registry/tinte/          # Registry files (copied from src)
    ├── theme-editor.tsx
    ├── color-input.tsx
    └── logo.tsx
```

### File Corruption Prevention

**IMPORTANT: When writing component files, prevent corruption by:**

1. **Delete before rewrite** if file exists and may be corrupted:

   ```bash
   rm /path/to/file.tsx
   # Then write fresh file
   ```

2. **Verify file after write** by reading first 20 lines:

   ```bash
   head -20 /path/to/file.tsx
   ```

3. **Check for common corruption patterns:**
   - Malformed imports: `} from "package"import {` (missing newline)
   - Duplicate code blocks
   - Truncated function definitions
   - Missing closing braces

4. **If corruption detected:**
   - Don't try to edit corrupted file
   - Delete completely
   - Rewrite from scratch
   - Copy to registry after verification

**Common corruption causes:**

- Concurrent writes to same file
- Incomplete buffer flush
- Editing instead of replacing corrupted files

### Import/Export Consistency

**Named exports vs default exports:**

```tsx
// Component file (color-input.tsx)
export function ColorInput({ value, onChange }: Props) {
  // ...
}

// Importing file (theme-editor.tsx)
import { ColorInput } from "./color-input"; // ✅ Correct

// NOT:
import ColorInput from "./color-input"; // ❌ Wrong - expects default export
```

**Always ensure:**

- Component exports match imports
- Preview files import from correct paths
- Registry files mirror src files (if using both)

### Dependencies and Path Aliases

**When using external packages:**

```json
{
  "dependencies": {
    "@uiw/react-color-wheel": "^2.1.0",
    "@uiw/color-convert": "^2.1.0",
    "culori": "^4.0.1"
  }
}
```

**Path aliases in tsconfig.json:**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./registry/*"],
      "@/components/ui/*": ["../../apps/web/components/ui/*"]
    }
  }
}
```

**In components, use:**

- `@/components/ui/button` for shadcn components
- `@uiw/react-color-wheel` for npm packages
- `./color-input` for local imports

### Checklist for New Element

- [ ] Package directory created with correct structure
- [ ] `package.json` with proper name and dependencies
- [ ] `tsconfig.json` with path aliases
- [ ] `registry.json` initialized and populated
- [ ] Components built and tested locally
- [ ] Registry entries added for all components
- [ ] Preview component created (if needed)
- [ ] Documentation MDX page created
- [ ] Preview wrapper added to docs page
- [ ] Build passes without errors
- [ ] Component shows in docs preview
- [ ] Registry endpoint works (`/r/{provider}/component`)
- [ ] No file path conflicts between src/ and registry/
- [ ] Imports use correct format (named vs default)
- [ ] Files verified not corrupted

### Example: Complete Tinte Element Creation

**1. Created package structure:**

```
packages/tinte/
├── package.json              # Added culori, @uiw/* dependencies
├── tsconfig.json            # Path aliases configured
├── registry.json            # Registry with theme-editor entry
├── src/components/          # Source components
│   ├── theme-editor.tsx    # Main editor component
│   ├── color-input.tsx     # Color input with format cycling
│   └── logo.tsx            # Tinte branding logo
└── registry/tinte/          # Copied from src for registry
    ├── theme-editor.tsx
    ├── color-input.tsx
    └── logo.tsx
```

**2. Created docs page:**

```
apps/web/content/docs/tinte.mdx
```

**3. Created preview:**

```tsx
// apps/web/components/elements/tinte-preview.tsx
"use client";
import ThemeEditor from "@/../../packages/tinte/src/components/theme-editor";

export function TintePreview() {
  return (
    <div className="...">
      <ThemeEditor />
    </div>
  );
}
```

**4. Added to docs page:**

```mdx
import { TintePreview } from "@/components/elements/tinte-preview";

# Tinte

<TintePreview />
```

**5. Built and verified:**

```bash
bun run build  # ✅ Build successful
# Visited /docs/tinte - preview showing
```

## Final Notes

- **Be helpful and thorough** - This is a critical step in the development workflow
- **Ask questions if unsure** - Better to clarify than make assumptions
- **Show the entry before applying** - Let users review and confirm
- **Keep consistency** - Follow existing patterns in each provider's registry
- **Think about preview** - Always consider if component needs a preview wrapper
- **Regenerate automatically** - Always regenerate preview map after registry changes
- **Test the result** - Suggest user tests at `/l/{provider}`
- **Watch for file corruption** - Verify files after writes, delete before rewrite if needed
- **Check import/export consistency** - Named exports must match named imports
- **Avoid path conflicts** - Keep src/ and registry/ clearly separated

The goal is to make adding components to the registry **fast, accurate, and effortless** for developers. The automated preview system means components automatically show up on provider pages with zero manual configuration! 🚀
