---
name: tech-logos
description: Install official tech brand logos from the Elements registry. Use when user needs logos for tech companies (Clerk, Vercel, GitHub, etc.), AI providers (OpenAI, Anthropic, Claude), social platforms, or any brand assets. Triggers on "logo", "brand", "icon for [company]", "add [company] logo", placeholder logo detection, or when building landing pages, auth UIs, or integrations showcases.
---

# Tech Logos

Install official, theme-aware brand logos from the Elements registry.

## Install Pattern

```bash
npx shadcn@latest add @elements/{name}-logo
```

Examples: `clerk-logo`, `github-logo`, `openai-logo`, `vercel-logo`

## Discover Available Logos

**Option A**: Scan registry (if in elements repo)
```bash
ls registry/default/blocks/logos/ | sed 's/-logo$//'
```

**Option B**: Browse https://tryelements.dev/docs/logos

## After Install

Logos install to `components/logos/{name}.tsx`:
```tsx
import { ClerkLogo } from "@/components/logos/clerk"

<ClerkLogo className="h-8 w-auto" />
<ClerkLogo variant="wordmark" mode="dark" />
```

## Common Props

- `variant`: `"icon"` | `"wordmark"`
- `mode`: `"light"` | `"dark"` (auto-detects theme)
- `className`: Standard className prop

## Bundles

| Need | Command |
|------|---------|
| All logos | `@elements/logos` |
| AI providers | `@elements/ai-services` |
| Social platforms | `@elements/social-media` |
| Package managers | `@elements/package-managers` |

## Quick Patterns

```bash
# Auth stack
npx shadcn@latest add @elements/clerk-logo @elements/better-auth-logo

# AI models
npx shadcn@latest add @elements/openai-logo @elements/anthropic-logo @elements/claude-logo

# Social footer
npx shadcn@latest add @elements/twitter-logo @elements/github-logo @elements/discord-logo

# Tech stack
npx shadcn@latest add @elements/vercel-logo @elements/supabase-logo @elements/stripe-logo
```
