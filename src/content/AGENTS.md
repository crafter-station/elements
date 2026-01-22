# Content

MDX documentation and provider configurations. Powers the docs site via Fumadocs.

## Purpose

Owns all documentation content and provider category pages.
Does NOT own: component implementations (see `registry/`), site UI (see `components/`).

## Structure

```
content/
├── components/              # Component documentation by category
│   ├── ai-elements/         # AI component docs (nested by subcategory)
│   │   ├── chat/
│   │   ├── agentic/
│   │   ├── devtools/
│   │   └── multi-agent/
│   ├── devtools/            # Developer tool docs
│   ├── github/              # GitHub component docs
│   ├── polar/               # Payment component docs
│   ├── theme/               # Theme component docs
│   ├── tinte/               # Tinte editor docs
│   ├── uploadthing/         # File upload docs
│   └── upstash/             # Rate limiting docs
└── providers/               # Provider overview pages
    ├── ai.mdx               # AI provider overview
    ├── clerk.mdx            # Clerk auth overview
    ├── github.mdx           # GitHub overview
    └── ...                  # Other providers
```

## Provider Page Structure

Each provider page (`providers/*.mdx`) follows this pattern:

```mdx
---
title: Provider Name
description: Short description
category: Category
brandColor: "#hexcolor"
---

## Overview

What this provider offers.

## Components

### Component Name

Description.

<ComponentPreviewItem
  componentKey="component-key"
  installUrl="@elements/component-key"
  category="Category"
  name="Display Name"
>
  <ComponentDemo />
</ComponentPreviewItem>
```

## Component Documentation

Nested under `components/{category}/` with MDX files for individual components or subcategories.

## Contracts

- Frontmatter required: `title`, `description`, `category`, `brandColor`
- Use `<ComponentPreviewItem>` for live demos
- `componentKey` must match registry name
- `installUrl` format: `@elements/{component-name}`

## Patterns

### Adding Provider Documentation

1. Create `providers/{provider}.mdx` with frontmatter
2. Add component previews with `<ComponentPreviewItem>`
3. Create detailed docs in `components/{category}/`

### MDX Components Available

- `<ComponentPreviewItem>` - Live component preview with install button
- `<Callout>` - Info/warning callouts
- `<Steps>` - Numbered step lists
- `<Tabs>` - Tabbed content

## Anti-patterns

- Don't put component logic in MDX (use registry)
- Don't hardcode install commands (use installUrl prop)
- Don't duplicate content between provider and component docs
