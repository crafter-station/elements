# Registry

Component source of truth. All installable components live here.

## Purpose

Owns the shadcn/ui registry schema and component implementations.
Does NOT own: site UI, documentation content, or app routes.

## Structure

```
registry/
├── default/blocks/          # Component implementations by category
│   ├── ai/                  # AI/LLM interface components (35+ components)
│   ├── devtools/            # Developer tool components
│   ├── github/              # GitHub data components
│   ├── logos/               # Brand SVG logos (40+ brands)
│   ├── theme-switcher/      # Theme toggle variants
│   ├── uploadthing/         # File upload components
│   ├── upstash/             # Rate limiting components
│   ├── polar/               # Payment components
│   ├── tinte/               # Theme editor
│   └── _bundles/            # Logo bundle collections
├── blocks.ts                # Auto-generated imports from blocks/
├── examples.ts              # Example registry items
├── index.ts                 # Main registry export (auto-generated)
└── utils.ts                 # Registry utilities
```

## Component Structure

Each component follows this pattern:

```
{category}/{component-name}/
├── registry-item.json       # REQUIRED: Schema definition
└── components/elements/
    └── {component}.tsx      # Implementation
```

### registry-item.json Schema

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "component-name",
  "type": "registry:ui",
  "title": "Human Title",
  "description": "What it does",
  "registryDependencies": ["button", "other-component"],
  "dependencies": ["external-package"],
  "files": [{ "path": "...", "type": "registry:component" }],
  "categories": ["ai", "form"]
}
```

## Contracts

- `registry-item.json` must be valid against shadcn schema
- `registryDependencies` reference other Elements components
- `dependencies` are npm packages
- File paths relative to registry root
- Component names kebab-case, title case for display

## Categories

| Category | Description | Examples |
|----------|-------------|----------|
| `ai` | LLM/agent interfaces | ai-chat, ai-model-selector, ai-tool-call |
| `devtools` | Developer debugging | json-viewer, cli-output, env-editor |
| `github` | GitHub data display | github-stars, github-contributions |
| `logos` | Brand SVG icons | clerk-logo, vercel-logo, anthropic-logo |
| `theme-switcher` | Theme toggles | theme-switcher-button, theme-switcher-dropdown |
| `_bundles` | Logo collections | ai-services, tech-giants |

## Patterns

### Adding a New Component

1. Create directory: `default/blocks/{category}/{name}/`
2. Add `registry-item.json` with schema
3. Add implementation in `components/elements/{name}.tsx`
4. Run `bun generate` to update `blocks.ts` and `index.ts`

### Adding a New Logo

Use `/create-element` skill with `logo-with-variants` for logos that need icon/wordmark/full variants.

For simple logos:
1. Create `default/blocks/logos/{brand}-logo/`
2. Add `registry-item.json` with `type: "registry:ui"`
3. Add SVG component in `components/elements/{brand}-logo.tsx`

## Anti-patterns

- Never modify `blocks.ts` or `index.ts` manually (auto-generated)
- Don't put business logic in components (presentation only)
- Don't hardcode colors (use CSS variables)
- Never use hex/hsl colors (use OKLCH)

## Regenerating Registry

```bash
bun generate
```

This updates `blocks.ts` and `index.ts` from the `default/blocks/` directory structure.
