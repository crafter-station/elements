---
name: logo-with-variants
description: Create logo components with multiple variants (icon, wordmark, logo) and light/dark modes. Use when the user provides logo SVG files and wants to create a variant-based logo component following the Clerk pattern in the Elements project.
---

# Logo with Variants Creator

Creates logo components with variant support following the established pattern in Elements codebase.

## When to use this Skill

- User provides multiple SVG files for a logo (icon, wordmark, logo variants)
- User mentions "variants", "light/dark modes", or references Clerk-style logos
- User wants to add a new logo to the collection with multiple variants
- User has SVG files in `public/test/` or provides paths to logo files

## Process

### 1. Analyze provided SVGs

- Identify variant types (icon, logo, wordmark)
- Detect light/dark mode versions (files ending in `-dark.svg` or `-light.svg`)
- Extract viewBox, colors, and dimensions from each SVG
- Note the brand guidelines if provided

### 2. Create component file

**Location**: `src/components/ui/logos/{name}.tsx`

**Props interface**:
```typescript
{
  className?: string;
  variant?: "icon" | "logo" | "wordmark";
  mode?: "dark" | "light";
}
```

**Structure**:
- Use conditional rendering based on `variant` prop
- Configure colors for light/dark modes using a COLORS object pattern
- Default to `variant="wordmark"` (primary logo)
- Support theme-aware mode prop
- Add proper TypeScript types

**Reference implementation**: Check `src/components/ui/logos/clerk.tsx` for the exact pattern to follow.

### 3. Convert SVG to JSX

For each SVG file:
- Read the SVG file content
- Convert SVG attributes to JSX (e.g., `fill-rule` → `fillRule`, `stroke-width` → `strokeWidth`)
- Replace hardcoded colors with variables from COLORS object
- Preserve viewBox and dimensions
- Add title tag for accessibility

### 4. Create registry structure

**Location**: `registry/default/blocks/logos/{name}-logo/`

**Files to create**:
1. `registry-item.json`:
```json
{
  "name": "{name}-logo",
  "type": "registry:block",
  "title": "{DisplayName} Logo",
  "description": "{Brand description}",
  "categories": ["logos"],
  "meta": {
    "hasVariants": true,
    "variants": [
      "icon-dark",
      "icon-light",
      "logo-dark",
      "logo-light",
      "wordmark-dark",
      "wordmark-light"
    ],
    "variantTypes": {
      "base": ["icon", "logo", "wordmark"],
      "modes": ["dark", "light"]
    }
  },
  "files": [
    {
      "path": "components/logos/{name}.tsx",
      "type": "registry:component"
    }
  ],
  "docs": "{Brand} logo with 3 base variants (icon, logo, wordmark) and 2 modes (dark, light) = 6 total combinations. Theme-aware: automatically adapts colors when you switch themes."
}
```

**CRITICAL**: The `variants` array MUST list ALL combinations explicitly in `{base}-{mode}` format (e.g., "icon-dark", "logo-light"). This is what makes the variant count badge (e.g., "6") appear correctly in the UI. Do NOT just list base names like ["icon", "logo", "wordmark"].

2. Copy component to: `components/logos/{name}.tsx`

### 5. Update registry/index.ts

**CRITICAL STEP**: The `registry/index.ts` file is the SOURCE OF TRUTH for the build process. You MUST add/update the logo entry in this file with the EXACT same metadata structure as the `registry-item.json`.

**Location**: `registry/index.ts`

Find the array of registry items and add your logo entry with the complete `meta` field:
```typescript
{
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "{name}-logo",
  type: "registry:block",
  title: "{DisplayName} Logo",
  description: "{Brand description}",
  registryDependencies: [],
  dependencies: [],
  categories: ["logos"],
  meta: {
    hasVariants: true,
    variants: [
      "icon-dark",
      "icon-light",
      "logo-dark",
      "logo-light",
      "wordmark-dark",
      "wordmark-light",
    ],
    variantTypes: {
      base: ["icon", "logo", "wordmark"],
      modes: ["dark", "light"],
    },
  },
  files: [
    {
      path: "registry/default/blocks/logos/{name}-logo/components/logos/{name}.tsx",
      type: "registry:component",
    },
  ],
  docs: "{Brand} logo with 3 base variants (icon, logo, wordmark) and 2 modes (dark, light) = 6 total combinations. Theme-aware: automatically adapts colors when you switch themes.",
}
```

**If updating an existing logo**: Search for the logo name in `registry/index.ts` and replace the entire entry with the new metadata including the `meta` field.

### 6. Update logos collection

Add to `registry/default/blocks/logos/logos/registry-item.json`:
- Add new logo to the list
- Ensure it's in the correct category (tech-giants, ai-services, etc.)

### 7. Build registry

Run:
```bash
bun run build:registry
```

This generates the public registry files.

## Component Template Pattern

```typescript
interface LogoProps {
  className?: string;
  variant?: "icon" | "logo" | "wordmark";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: "#HEX_VALUE",
  light: "#HEX_VALUE",
};

export function BrandLogo({
  className,
  variant = "wordmark",
  mode = "dark",
}: LogoProps) {
  const color = COLORS[mode];

  if (variant === "icon") {
    return (
      <svg className={className} viewBox="...">
        {/* Icon SVG content */}
      </svg>
    );
  }

  if (variant === "logo") {
    return (
      <svg className={className} viewBox="...">
        {/* Logo SVG content */}
      </svg>
    );
  }

  // Default: wordmark
  return (
    <svg className={className} viewBox="...">
      {/* Wordmark SVG content */}
    </svg>
  );
}
```

## Expected outcome

After completion:
1. Component is available at `@/components/ui/logos/{name}`
2. Logo appears in the logos page with variant badge
3. Context menu shows "View X Variants" option
4. Variants dialog displays all combinations (variants × modes)
5. All copy/download functions work for each variant
6. Can be installed via `npx shadcn@latest add @elements/{name}-logo`

## Brand Guidelines Integration

If brand guidelines are provided:
- Use exact brand colors specified
- Follow naming conventions (e.g., Linear uses "Linear" not "linear")
- Respect hierarchy (wordmark primary, logomark for tight layouts, icon for social)
- Include usage notes in component comments

## Files to reference

- **Template**: `src/components/ui/logos/clerk.tsx`
- **Registry example**: `registry/default/blocks/logos/clerk-logo/`
- **Variants dialog**: `src/app/docs/logos/logo-variants-dialog.tsx`
- **Logos collection**: `registry/default/blocks/logos/logos/registry-item.json`

## Common pitfalls to avoid

- Don't forget to copy component to both `src/` and `registry/` locations
- Ensure `hasVariants: true` is set in registry metadata
- Don't hardcode colors - use COLORS object for theme support
- Remember to run `build:registry` after making changes
- Test all variant combinations before committing
