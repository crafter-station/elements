# Elements - Full Stack Components

A custom documentation system for Elements, providing comprehensive provider documentation and component demos in a maintainable, in-house built solution.

![Elements Cover](elements-cover.webp)

## 🚀 Features

- **Custom MDX Documentation System** - Built from scratch without fumadocs dependency
- **Command+K Search** - Fast search functionality across all docs and components
- **Smart Table of Contents** - Automatic TOC generation with scroll tracking
- **Provider-Focused Structure** - Organized by provider (Clerk, Stripe, AI SDK, etc.)
- **Responsive Design** - Mobile-first approach with beautiful UI
- **Legacy Component Support** - Backwards compatible with existing `/t` routes

## 📁 Project Structure

```
src/
├── app/
│   ├── t/[[...slug]]/page.tsx     # Main documentation routing system
│   ├── globals.css                # Global styles and theme configuration
│   └── page.tsx                   # Main landing page
├── components/
│   ├── command-search.tsx         # Command+K search functionality
│   ├── table-of-contents.tsx      # Auto-generating TOC with scroll tracking
│   ├── component-page-template.tsx # Reusable component page template
│   └── ui/                        # shadcn/ui components
├── content/                       # MDX documentation files
│   ├── ai-sdk.mdx                # AI SDK provider documentation
│   ├── stripe.mdx                # Stripe provider documentation
│   └── [provider].mdx            # Additional provider docs
└── registry/                      # Component registry
```

## 🛠 Technology Stack

- **Next.js 15** - React framework with App Router
- **MDX** - Markdown with JSX components (`@next/mdx`, `next-mdx-remote`)
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Styling with custom design system
- **Remark/Rehype** - Markdown processing with plugins
- **CMDK** - Command palette functionality
- **Gray Matter** - Frontmatter parsing

## 📝 Writing Documentation

### Creating Provider Pages

Create MDX files in `src/content/` for each provider:

```mdx
---
title: "Provider Name"
description: "Brief description of the provider and its components"
category: "CATEGORY NAME"
brandColor: "#000000"
darkBrandColor: "#ffffff"
icon: "🎯"
installCommand: "bunx shadcn@latest add @elements/provider"
showRegistryVisualizer: true
layout:
  type: "auto"
  columns: 2
  gap: "lg"
features:
  - icon: "✨"
    title: "Feature Name"
    description: "Feature description"
---

# Provider Documentation

Your comprehensive provider documentation goes here...

## Installation

```bash
npm install provider-package
```

## Components

### Component Name

Description and usage examples...

## Examples

Real-world usage examples...
```

### Frontmatter Options

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Provider/component name |
| `description` | `string` | Brief description |
| `category` | `string` | Category for organization |
| `brandColor` | `string` | Primary brand color (hex) |
| `darkBrandColor` | `string` | Dark mode brand color (optional) |
| `icon` | `string` | Emoji or icon identifier |
| `installCommand` | `string` | Installation command |
| `showRegistryVisualizer` | `boolean` | Show component registry visualization |
| `layout.type` | `"auto" \| "custom"` | Layout type |
| `layout.columns` | `1 \| 2 \| 3 \| 4` | Number of columns |
| `layout.gap` | `"sm" \| "md" \| "lg"` | Grid gap size |
| `features` | `array` | List of key features |

## 🔍 Search Functionality

The Command+K search provides:

- **Global Search** - Search across all documentation
- **Categorized Results** - Organized by providers, components, and pages
- **Keyboard Navigation** - Full keyboard support
- **Smart Filtering** - Searches titles, descriptions, and categories

### Adding Search Items

Update `src/components/command-search.tsx` to include new documentation:

```typescript
const SEARCH_DATA: SearchItem[] = [
  {
    id: "new-provider",
    title: "New Provider",
    description: "Description of the new provider",
    url: "/t/new-provider",
    type: "provider",
    category: "Integration",
  },
  // ... more items
];
```

## 🧭 Table of Contents

The TOC component automatically:

- **Scans Headings** - Finds all h1-h6 elements with IDs
- **Creates Navigation** - Generates clickable navigation links
- **Tracks Scroll** - Highlights current section
- **Smooth Scrolling** - Smooth navigation to sections

Headings are automatically enhanced with anchor links via `rehype-slug` and `rehype-autolink-headings`.

## 🎨 Styling & Theming

### Custom Design System

The project uses a custom OKLCH color system:

```css
/* Custom CSS variables in globals.css */
:root {
  --primary: oklch(0.7 0.15 270);
  --background: oklch(1 0 0);
  /* ... more variables */
}
```

### Component Styling

All components support custom styling:

```tsx
<TableOfContents className="custom-toc-styles" />
<CommandSearch appearance={{ theme: 'custom' }} />
```

## 🔄 Migration Guide

### From Fumadocs

We've completely removed fumadocs dependencies and built a custom system:

1. **Removed Dependencies:**
   - `fumadocs-core`
   - `fumadocs-mdx`
   - `fumadocs-ui`

2. **Added Dependencies:**
   - `@next/mdx`
   - `next-mdx-remote`
   - `gray-matter`
   - `remark-gfm`
   - `rehype-slug`
   - `rehype-autolink-headings`

3. **File Changes:**
   - Removed `src/app/docs/` directory
   - Removed `content/docs/` directory
   - Updated `next.config.ts` to use `@next/mdx`
   - Created custom routing in `src/app/t/[[...slug]]/page.tsx`

### Legacy Support

The system maintains backwards compatibility with existing `/t` routes:

- `/t/clerk` → Uses legacy component
- `/t/new-provider` → Uses new MDX system
- Automatic fallback to legacy routes when MDX not found

## 🚀 Development

### Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Run linting
bun run lint

# Run type checking
bun run typecheck
```

### Adding New Providers

1. **Create MDX File:**
   ```bash
   touch src/content/my-provider.mdx
   ```

2. **Add Frontmatter and Content:**
   Follow the frontmatter schema and write comprehensive documentation.

3. **Update Search Index:**
   Add the new provider to `SEARCH_DATA` in `command-search.tsx`.

4. **Test Routes:**
   Visit `/t/my-provider` to see your documentation.

### Component Integration

For interactive components, you can import them directly in MDX:

```mdx
import { MyComponent } from '@/components/my-component';

# My Provider

<MyComponent prop="value" />
```

## 🔧 Configuration

### Next.js Config

The MDX configuration in `next.config.ts`:

```typescript
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
});
```

### Search Configuration

Customize search behavior in `command-search.tsx`:

```typescript
// Modify search logic, add new item types, or change categorization
const getIcon = (type: SearchItem["type"]) => {
  // Custom icon logic
};
```

## 🎯 Best Practices

### Documentation Writing

1. **Clear Structure** - Use consistent heading hierarchy
2. **Code Examples** - Include practical, runnable examples  
3. **Installation Steps** - Always provide clear installation instructions
4. **Error Handling** - Document common issues and solutions
5. **Props Documentation** - Use tables for component props

### Component Organization

1. **Provider Focus** - Organize by provider/service
2. **Logical Grouping** - Group related components together
3. **Consistent Naming** - Use kebab-case for file names
4. **Comprehensive Examples** - Show real-world usage patterns

### Performance

1. **Static Generation** - MDX files are statically generated
2. **Code Splitting** - Components are lazy-loaded when needed
3. **Search Optimization** - Search data is optimized for fast filtering
4. **Image Optimization** - Use Next.js Image component for assets

## 📊 Monitoring & Analytics

The system includes Vercel Analytics integration for tracking:

- Page views and navigation patterns
- Search usage and popular queries
- Component installation tracking
- User engagement metrics

## 🤝 Contributing

1. **Fork the Repository**
2. **Create Feature Branch:** `git checkout -b feature/amazing-feature`
3. **Write Documentation:** Add comprehensive MDX documentation
4. **Update Search:** Add new items to search index
5. **Test Thoroughly:** Ensure all routes work correctly
6. **Submit Pull Request:** Include screenshots and descriptions

## Quick Start (Legacy)

1. Add Elements registry to your `components.json` file:

```json
{
  "registries": {
    "@elements": "https://tryelements.dev/r/{name}.json"
  }
}
```

2. Install any element you want using the `bunx shadcn@latest add` command.

```bash
bunx shadcn@latest add @elements/logos
```

## Available Components

### Clerk Auth

Complete authentication flows with sign-in, sign-up, and waitlist components.

![Clerk Elements](clerk-elements.webp)

### Tech Logos

Popular brand logos collection with shopping cart functionality.

![Logos Elements](logos-elements.webp)

### Theme Switcher

Dark/light mode toggles with multiple variants.

**More coming soon...**

## Registry

Visit [tryelements.dev](https://tryelements.dev) to browse all components.

---

Built with ❤️ by the Crafter Station team for the Elements ecosystem.
