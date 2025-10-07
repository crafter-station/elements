# Development Workflow - Instructions for Claude

This document provides instructions for Claude (AI assistant) to help developers manage the Elements registry efficiently.

## Overview

When a developer creates a new component and moves it to a package using `bun run move-component`, Claude should help by automatically updating the package's `registry.json` file.

---

## When User Says: "add {component-name} to {provider} registry"

### Step 1: Confirm Details

Ask the user to confirm:
- **Provider**: Which package (clerk, polar, uploadthing, theme, logos)
- **Component name**: The filename without extension
- **Component type**:
  - `registry:component` - Reusable UI component
  - `registry:ui` - Standalone UI element (logos, buttons, etc)
  - `registry:block` - Complete feature block (auth flow, checkout, etc)
  - `registry:page` - Full page component
  - `registry:lib` - Utility/helper functions

### Step 2: Read the Component File

Location pattern: `packages/{provider}/registry/{provider}/{component-name}.tsx`

**Analyze the file for:**
1. **Import statements** → Detect dependencies
2. **@registry/* imports** → Detect registry dependencies
3. **Component exports** → Verify component structure
4. **Props/interfaces** → Understand component API

### Step 3: Generate Registry Entry

**Template for different types:**

#### For UI Components (logos, buttons, etc):
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

#### For Complex Blocks (auth flows, checkout, etc):
```json
{
  "name": "component-name",
  "type": "registry:block",
  "title": "Display Title",
  "description": "Complete feature description",
  "registryDependencies": [
    "button",
    "card",
    "@elements/some-logo"
  ],
  "dependencies": ["@clerk/nextjs", "other-npm-packages"],
  "files": [
    {
      "path": "registry/default/{provider}/{component-name}/main.tsx",
      "type": "registry:component",
      "target": "app/elements/{provider}/{component-name}/main.tsx"
    },
    {
      "path": "registry/default/{provider}/{component-name}/page.tsx",
      "type": "registry:page",
      "target": "app/elements/{provider}/{component-name}/page.tsx"
    }
  ],
  "envVars": {
    "API_KEY": "key_...",
    "API_SECRET": "secret_..."
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

### Step 5: Determine File Paths

**Path format:** `registry/default/{provider}/{component-name}.tsx`

**For multi-file components:**
```typescript
// If component has a directory structure
packages/{provider}/registry/{provider}/{component-name}/
  ├── main.tsx
  ├── actions.ts
  └── page.tsx

// Registry paths:
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
]
```

### Step 6: Update Registry File

**Location:** `packages/{provider}/registry.json`

**Process:**
1. Read the current `registry.json`
2. Add the new entry to the `items` array
3. Maintain alphabetical order (optional but clean)
4. Validate JSON structure
5. Write the updated file

### Step 7: Confirm with User

Show the generated entry and ask:
```
✅ Generated registry entry for "{component-name}":

{
  "name": "component-name",
  ...
}

Add this to packages/{provider}/registry.json? (Y/n)
```

---

## Example Interactions

### Example 1: Simple Logo Component

**User:** "add anthropic-logo to logos registry"

**Claude Response:**
```
✓ Reading: packages/logos/registry/logos/anthropic-logo.tsx
✓ Type: registry:ui (detected from structure)
✓ Dependencies: None
✓ Files: 1 file

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

### Example 2: Complex Auth Component

**User:** "add magic-link-auth to clerk registry"

**Claude Response:**
```
✓ Reading: packages/clerk/registry/clerk/magic-link-auth/
✓ Type: registry:block (multi-file component)
✓ Detected dependencies: ["@clerk/nextjs", "@clerk/types"]
✓ Detected registry dependencies: ["button", "input", "label"]
✓ Files: 3 files (main.tsx, actions.ts, page.tsx)

Generated entry:
{
  "name": "magic-link-auth",
  "type": "registry:block",
  "title": "Magic Link Authentication",
  "description": "Passwordless authentication with magic links using Clerk",
  "registryDependencies": ["button", "input", "label", "@elements/clerk-middleware"],
  "dependencies": ["@clerk/nextjs", "@clerk/types"],
  "files": [
    {
      "path": "registry/default/clerk/magic-link-auth/main.tsx",
      "type": "registry:component",
      "target": "app/elements/clerk/magic-link-auth/main.tsx"
    },
    {
      "path": "registry/default/clerk/magic-link-auth/actions.ts",
      "type": "registry:lib",
      "target": "app/elements/clerk/magic-link-auth/actions.ts"
    },
    {
      "path": "registry/default/clerk/magic-link-auth/page.tsx",
      "type": "registry:page",
      "target": "app/elements/clerk/magic-link-auth/page.tsx"
    }
  ],
  "envVars": {
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "pk_test_",
    "CLERK_SECRET_KEY": "sk_test_"
  },
  "docs": "Magic link authentication flow using Clerk. Requires ClerkProvider in root layout and proper email configuration in Clerk dashboard."
}

Add to packages/clerk/registry.json? (Y/n)
```

---

## Common Patterns by Provider

### Clerk Components
- **Type**: Usually `registry:block` for auth flows, `registry:ui` for UI components
- **Dependencies**: `["@clerk/nextjs", "@clerk/types"]` (sometimes `@clerk/backend`)
- **Registry Deps**: Often includes `button`, `input`, `label`, `card`, `alert`
- **Env Vars**: Always include `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **Middleware**: Include `@elements/clerk-middleware` if needed

### Polar Components
- **Type**: Usually `registry:block`
- **Dependencies**: `["@polar-sh/nextjs"]`
- **Registry Deps**: `button`, `badge`, `card`, `@elements/polar-logo`
- **Env Vars**: `POLAR_ACCESS_TOKEN`, `POLAR_SUCCESS_URL`, `POLAR_BASE_URL`

### UploadThing Components
- **Type**: `registry:block` or `registry:ui`
- **Dependencies**: `["uploadthing", "@uploadthing/react"]`
- **Registry Deps**: `button`, `card` (for dropzone)
- **Env Vars**: `UPLOADTHING_TOKEN`

### Theme Components
- **Type**: `registry:ui`
- **Dependencies**: `["next-themes"]`
- **Registry Deps**: `switch`, `button`, `dropdown-menu` (depending on variant)
- **Special**: Always needs ThemeProvider setup note in docs

### Logo Components
- **Type**: Always `registry:ui`
- **Dependencies**: Usually none (pure SVG components)
- **Categories**: `["logo", "brand"]`
- **Docs**: Brief description + "Uses currentColor" or specific brand colors

---

## Validation Checklist

Before updating registry.json, verify:

- [ ] `name` matches component filename (without extension)
- [ ] `type` is appropriate (ui/component/block/page/lib)
- [ ] `title` is human-readable and descriptive
- [ ] `description` clearly explains what it does
- [ ] `dependencies` includes all npm packages imported
- [ ] `registryDependencies` includes all `@elements/*` and `@/components/ui/*` imports
- [ ] `files[].path` follows pattern: `registry/default/{provider}/{name}.tsx`
- [ ] `files[].target` is appropriate for the file type
- [ ] `envVars` includes all required environment variables (if any)
- [ ] `docs` provides setup instructions and important notes

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

---

## Tips for Claude

1. **Always read the actual component file** - Don't assume structure
2. **Be conservative with dependencies** - Only include what's actually imported
3. **Use descriptive titles and descriptions** - Help users understand what it does
4. **Include helpful docs** - Setup instructions, gotchas, prerequisites
5. **Maintain consistency** - Look at existing entries in the registry for patterns
6. **Validate before writing** - Check JSON structure is valid
7. **Alphabetize entries** - Keep the registry organized (optional)

---

## Quick Reference

**Command to move component:**
```bash
bun run move-component
```

**Registry file locations:**
- `packages/clerk/registry.json`
- `packages/polar/registry.json`
- `packages/uploadthing/registry.json`
- `packages/theme/registry.json`
- `packages/logos/registry.json`

**Component file locations:**
- `packages/{provider}/registry/{provider}/{name}.tsx`
- `packages/{provider}/registry/{provider}/{name}/main.tsx` (multi-file)

**Path patterns:**
- Single file: `registry/default/{provider}/{name}.tsx`
- Multi-file: `registry/default/{provider}/{name}/{file}.tsx`
- Logos special case: `registry/default/logos/{name}.tsx`

---

## Final Notes

- **Be helpful and thorough** - This is a critical step in the development workflow
- **Ask questions if unsure** - Better to clarify than make assumptions
- **Show the entry before applying** - Let users review and confirm
- **Keep consistency** - Follow existing patterns in each provider's registry

The goal is to make adding components to the registry **fast, accurate, and effortless** for developers. You're automating the boring part so they can focus on building great components! 🚀
