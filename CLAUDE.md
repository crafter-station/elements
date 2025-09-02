# Elements Documentation

A comprehensive guide to using Elements - Full Stack Components by Crafter Station

## Project Structure

```
src/
├── app/
│   ├── docs/                 # Documentation pages
│   │   └── layout.tsx       # Docs layout configuration
│   ├── globals.css          # Global styles and theme configuration
│   └── page.tsx            # Main landing page
├── components/
│   ├── elements-logo.tsx    # Elements brand logo component
│   ├── component-card.tsx   # Component showcase cards
│   └── quickstart-card.tsx  # Quick start guide cards
├── lib/
│   ├── layout.shared.tsx    # Shared layout configuration for fumadocs
│   ├── source.ts           # Documentation source configuration
│   └── utils.ts            # Utility functions
└── content/
    └── docs/               # MDX documentation content
```

## Key Technologies

- **Next.js 15** - React framework
- **Fumadocs** - Documentation framework with custom Vesper theme
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom OKLCH color system
- **MDX** - Markdown with JSX components

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## Documentation Configuration

The documentation uses Fumadocs with custom configuration:

- **Theme**: Custom Vesper theme (light/dark variants)
- **Layout**: Custom sidebar with Elements logo
- **Code Highlighting**: Vesper theme for syntax highlighting
- **Sidebar**: Non-collapsible with custom positioning

## Styling System

Uses OKLCH color space for consistent color management across light/dark themes:
- Custom CSS variables for theme-aware colors
- Tailwind configuration with custom color tokens
- Fumadocs integration with shadcn/ui components

## Custom Components

- `ElementsLogo`: SVG logo component with current color fill
- `ComponentCard`: Showcase cards for component library
- `QuickstartCard`: Interactive cards for getting started guides

## Notes

- Sidebar toggle positioned to far left via custom CSS overrides
- Custom code block styling with Vesper theme integration
- Logo integrated into navigation and sidebar banner