# Components

Site UI and reusable primitives. Everything that renders on tryelements.dev.

## Purpose

Owns all React components for the documentation site.
Does NOT own: registry component definitions (see `registry/AGENTS.md`), MDX content.

## Structure

```
components/
├── ui/                      # Base shadcn primitives
│   ├── logos/               # Logo components for site use
│   ├── button.tsx           # shadcn button
│   ├── card.tsx             # shadcn card
│   └── ...                  # Other shadcn primitives
├── elements/                # Site-specific composed elements
├── sections/                # Page section components
├── docs/                    # Documentation-specific components
├── component-page/          # Component detail page components
├── icons/                   # Icon components
└── *.tsx                    # Root-level site components
```

## Key Components

| File | Purpose |
|------|---------|
| `header.tsx` | Site navigation header |
| `footer.tsx` | Site footer |
| `component-card.tsx` | Component showcase cards |
| `component-preview.tsx` | Live component preview |
| `install-command.tsx` | Copy-paste install commands |
| `elements-logo.tsx` | Elements brand logo |
| `theme-switcher-element.tsx` | Theme toggle for site |

## Subdirectories

### `ui/` - Base Primitives
shadcn/ui components. Follow shadcn conventions exactly.

### `ui/logos/` - Site Logos
Logo components used in the site UI (different from registry logos).
These are for internal site use, not for CLI installation.

### `elements/` - Composed Elements
Site-specific compositions that combine multiple primitives.

### `sections/` - Page Sections
Hero sections, feature grids, etc. for landing pages.

### `docs/` - Documentation Components
MDX-specific components like code blocks, callouts.

### `component-page/` - Detail Pages
Components for rendering individual component documentation pages.

## Contracts

- All `ui/` components follow shadcn/ui patterns
- Use `cn()` from `lib/utils` for className merging
- OKLCH colors via CSS variables only
- Props interface exported alongside component
- `"use client"` directive when using hooks/interactivity

## Patterns

### Creating a Site Component

```tsx
import { cn } from "@/lib/utils";

interface MyComponentProps {
  className?: string;
  children: React.ReactNode;
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  );
}
```

### Using Theme Colors

```tsx
// Use CSS variables, never hardcoded colors
<div className="bg-background text-foreground" />
<div className="border-border" />
```

## Anti-patterns

- Never import from `registry/` in site components
- Don't duplicate registry components here
- No inline styles or hardcoded colors
- Don't use `React.FC` (use explicit return types)
