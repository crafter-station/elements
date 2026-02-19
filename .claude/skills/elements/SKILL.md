---
name: elements
description: Browse and install components from the Elements registry (tryelements.dev). Use when user asks about available components, wants to explore providers, says "elements", "component library", "what components", "install from registry", "tryelements", or needs to find the right component category.
---

# Elements Registry

Install production-ready components from `tryelements.dev`.

## Install Pattern

```bash
npx shadcn@latest add @elements/{name}
```

## Providers

| Provider | Count | Category | Skill | Docs |
|----------|-------|----------|-------|------|
| AI Elements | 35 | AI | `/ai-elements` | tryelements.dev/docs/ai-elements |
| Brand Logos | 94+ | Brand | `/tech-logos` | tryelements.dev/docs/logos |
| SFX | 17 | Audio | `/sfx-elements` | tryelements.dev/docs/sfx |
| Dev Tools | 8 | Dev Tools | `/devtools-elements` | tryelements.dev/docs/devtools |
| UploadThing | 7 | Files | `/uploadthing-elements` | tryelements.dev/docs/uploadthing |
| GitHub | 7 | Integration | `/github-elements` | tryelements.dev/docs/github |
| Theme Switcher | 6 | UI | `/theme-elements` | tryelements.dev/docs/theme |
| Polar | 5 | Monetization | `/polar-elements` | tryelements.dev/docs/polar |
| Upstash | 5 | Database | `/upstash-elements` | tryelements.dev/docs/upstash |

When the user asks about a specific provider, use the corresponding skill above.

## Small Providers (no dedicated skill)

### AI Badges (3 components)
```bash
npx shadcn@latest add @elements/ai-badge @elements/generate-badge @elements/use-ai-avatar
```

### Animations (1 component)
```bash
npx shadcn@latest add @elements/text-shimmer
```

### Tinte (1 component)
```bash
npx shadcn@latest add @elements/tinte-editor
```

## Browse All

https://tryelements.dev/docs
