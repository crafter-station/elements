# Documentation Reference

## MDX Frontmatter

Provider documentation in `src/content/providers/{name}.mdx`:

```yaml
---
title: Provider Name
description: Brief description of the provider
category: Category Name
brandColor: "#000000"
darkBrandColor: "#ffffff"  # Optional, for dark mode
---
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Display name |
| `description` | Yes | Short description |
| `category` | Yes | Grouping category |
| `brandColor` | Yes | Primary brand color (light mode) |
| `darkBrandColor` | No | Brand color for dark mode |

## ComponentPreviewItem

Display a single component with preview and install command:

```mdx
<ComponentPreviewItem
  componentKey="theme-switcher"
  installUrl="@elements/theme-switcher"
  category="Theme"
  name="Theme Switcher"
>
  <ThemeSwitcher />
</ComponentPreviewItem>
```

| Prop | Required | Description |
|------|----------|-------------|
| `componentKey` | Yes | Registry name for file tree lookup |
| `installUrl` | Yes | shadcn install URL |
| `category` | Yes | Category badge |
| `name` | Yes | Display name |
| children | Yes | Live component demo |

## Documentation Structure

### Provider Page (Multiple Components)

```mdx
---
title: Theme
description: Theme switching components
category: Theme
brandColor: "#000000"
---

## Overview

Brief description of what this provider offers.

## Components

### Component A

Description.

<ComponentPreviewItem ...>
  <ComponentA />
</ComponentPreviewItem>

### Component B

Description.

<ComponentPreviewItem ...>
  <ComponentB />
</ComponentPreviewItem>

## Installation

\`\`\`bash
bunx shadcn@latest add @elements/component-a
\`\`\`

## Setup

### 1. Install Dependencies

\`\`\`bash
bun add required-package
\`\`\`

### 2. Configure Provider

\`\`\`tsx
// Example setup code
\`\`\`

## Usage

\`\`\`tsx
import { Component } from "@/components/elements/component";

export function Example() {
  return <Component />;
}
\`\`\`

## Troubleshooting

**Common issue?** Solution here.
```

### Component Page (Single Component)

For simple components, create `src/content/components/{provider}/{component}.mdx`:

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
  <ComponentDemo />
</ComponentPreviewItem>

## Overview

What this component does.

## Installation

\`\`\`bash
bunx shadcn@latest add @elements/component-name
\`\`\`

## Usage

\`\`\`tsx
import { Component } from "@/components/elements/component";

export function Example() {
  return <Component prop="value" />;
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "outline"` | `"default"` | Style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |

## Features

- Feature 1
- Feature 2
```

## Demo Components

Create demo components in `registry/default/examples/`:

```tsx
// registry/default/examples/theme-switcher-demo.tsx
"use client";

import { ThemeSwitcher } from "@/registry/default/blocks/theme-switcher/...";

export default function ThemeSwitcherDemo() {
  return (
    <div className="flex items-center justify-center p-4">
      <ThemeSwitcher />
    </div>
  );
}
```

Import in `src/mdx-components.tsx` to use in MDX.

## Common Sections

| Section | When to Include |
|---------|-----------------|
| Overview | Always |
| Installation | Always |
| Setup | If requires configuration (providers, env vars) |
| Usage | Always |
| Props | If component has props beyond className |
| Features | If multiple notable features |
| Advanced | If complex usage patterns |
| Troubleshooting | If common issues exist |

## Code Highlighting

Use code focus/highlight annotations:

```mdx
\`\`\`tsx
const value = "normal";
const highlighted = "this line"; // [!code highlight]
const focused = "focus here"; // [!code focus]
\`\`\`
```

## Tables

For comparison tables:

```mdx
| Variant | System Support | Best For |
|---------|----------------|----------|
| Switch | No | Headers |
| **Dropdown** | **Yes** | Settings |
```

Bold rows to indicate recommended options.
