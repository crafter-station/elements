# Elements Registry - Quick Start Guide

## 🎯 Common Commands

### Development
```bash
# Start dev server
bun dev

# Build registry (generates all JSON files)
bun run build:registry

# Regenerate registry index only
bun run registry:index

# Build entire project (includes registry build)
bun run build
```

### Testing Components
```bash
# Test a specific component locally
npx shadcn add http://localhost:3000/r/clerk-sign-in-shadcn.json

# Or from production
npx shadcn add https://tryelements.dev/r/clerk-sign-in-shadcn.json
```

## 📁 Adding a New Component

### 1. Create Component Directory
```bash
mkdir -p registry/default/blocks/[provider]/[component-name]
```

### 2. Add Component Files
```
registry/default/blocks/[provider]/[component-name]/
├── registry-item.json          # Required: Component manifest
├── components/                 # React components
│   └── my-component.tsx
├── lib/                       # Utilities
│   └── utils.ts
├── hooks/                     # Custom hooks (optional)
│   └── use-my-feature.ts
└── api/                       # API routes (optional)
    └── route.ts
```

### 3. Create registry-item.json
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "my-component",
  "type": "registry:block",
  "title": "My Component",
  "description": "A description of what this does",
  "registryDependencies": [
    "button",
    "card"
  ],
  "dependencies": [
    "some-npm-package@^1.0.0"
  ],
  "files": [
    {
      "path": "registry/default/blocks/[provider]/[component-name]/components/my-component.tsx",
      "type": "registry:component"
    }
  ],
  "envVars": {
    "MY_API_KEY": ""
  },
  "docs": "Additional usage notes"
}
```

### 4. Build Registry
```bash
bun run build:registry
```

Your component is now available at `public/r/my-component.json`!

## 🔧 Component Types

| Type | Use Case | Target Path |
|------|----------|-------------|
| `registry:block` | Complex multi-file components | `components/blocks/` |
| `registry:component` | Simple components | `components/` |
| `registry:ui` | UI primitives | `components/ui/` |
| `registry:hook` | Custom hooks | `hooks/` |
| `registry:lib` | Utilities | `lib/` |
| `registry:page` | Full pages | Specified by `target` |
| `registry:file` | Generic files | Specified by `target` |

## 📦 Registry Dependencies

### Internal (your components)
```json
{
  "registryDependencies": [
    "@elements/clerk-middleware",
    "@elements/apple-logo"
  ]
}
```

### External (shadcn/ui)
```json
{
  "registryDependencies": [
    "button",
    "card",
    "input"
  ]
}
```

### NPM packages
```json
{
  "dependencies": [
    "@clerk/nextjs@^6.0.0",
    "motion@^12.0.0"
  ]
}
```

## 🎨 Import Patterns

### In Registry Components
```tsx
// ✅ Use @/registry for internal components
import { MyUtil } from "@/registry/default/blocks/provider/component/lib/utils"

// ✅ Use @/ for external dependencies
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ❌ Don't use relative imports
import { MyUtil } from "../lib/utils"  // Wrong!
```

## 🏗️ Project Structure

```
elements/
├── registry/                         # New shadcn structure
│   ├── index.ts                     # Auto-generated
│   ├── utils.ts                     # Helper functions
│   └── default/
│       └── blocks/
│           ├── clerk/
│           ├── tinte/
│           ├── polar/
│           └── ...
│
├── src/registry/                     # Old structure (kept for reference)
│   └── ...
│
├── public/r/                         # Build output
│   ├── registry.json                # Main index
│   └── *.json                       # Component files
│
└── scripts/
    ├── build-registry.ts            # Main build script
    ├── generate-registry-index.ts   # Index generator
    └── ...
```

## 🚨 Common Issues

### Build fails
```bash
# Make sure all dependencies are installed
bun install

# Clean and rebuild
rm -rf public/r/*
bun run build:registry
```

### Component not found
```bash
# Regenerate the registry index
bun run registry:index

# Then rebuild
bun run build:registry
```

### Wrong paths in output
Check that your `registry-item.json` uses correct paths:
```json
{
  "files": [
    {
      "path": "registry/default/blocks/provider/component/file.tsx"
    }
  ]
}
```

## 📊 Registry Stats

Current registry size:
- **64** total components
- **6** provider categories
- **41** logo components
- **12** authentication components
- **6** theme components
- **5** other components

## 🔗 URLs

### Local Development
- Registry index: `http://localhost:3000/r/registry.json`
- Component: `http://localhost:3000/r/[name].json`

### Production
- Registry index: `https://tryelements.dev/r/registry.json`
- Component: `https://tryelements.dev/r/[name].json`

## 💡 Pro Tips

1. **Auto-rebuild on changes**: Run `bun run build:registry` after modifying any registry-item.json
2. **Test locally first**: Always test component installation locally before deploying
3. **Use namespaces**: Prefix your components with `@elements/` for brand recognition
4. **Document everything**: Add clear `docs` field to each registry-item.json
5. **Version your deps**: Always specify versions for npm dependencies

## 📚 Learn More

- Full migration details: See `REGISTRY_MIGRATION_SUMMARY.md`
- Complete guide: See the document at the top of this chat
- shadcn docs: https://ui.shadcn.com/docs/registry

---

**Happy building!** 🚀
