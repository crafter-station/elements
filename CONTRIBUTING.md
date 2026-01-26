# Contributing to Elements

Thank you for your interest in contributing to Elements! This guide will help you get started.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)
- [Node.js](https://nodejs.org/) (v18 or higher)
- Git

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/elements.git
   cd elements
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Start the development server:
   ```bash
   bun dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
elements/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   │   └── ui/                 # shadcn/ui components
│   └── content/                # MDX documentation
├── registry/                   # Component registry
│   └── default/
│       └── blocks/             # Block components
│           └── logos/          # Brand logos
└── public/
    └── r/                      # Built registry JSON files
```

## Adding a New Logo

1. Create a new folder in `registry/default/blocks/logos/`:
   ```
   registry/default/blocks/logos/your-logo/
   ├── components/
   │   └── logos/
   │       └── your-logo.tsx
   └── registry-item.json
   ```

2. Create the logo component (`your-logo.tsx`):
   ```tsx
   interface LogoProps {
     className?: string;
     variant?: "icon" | "wordmark" | "logo";
     mode?: "dark" | "light";
   }

   export function YourLogo({
     className,
     variant = "icon",
     mode = "dark",
   }: LogoProps) {
     // Your SVG implementation
   }
   ```

3. Create the registry item (`registry-item.json`):
   ```json
   {
     "$schema": "https://ui.shadcn.com/schema/registry-item.json",
     "name": "your-logo",
     "type": "registry:block",
     "title": "Your Logo",
     "description": "Your brand logo description",
     "dependencies": [],
     "registryDependencies": [],
     "categories": ["logos"],
     "meta": {
       "hasVariants": true,
       "variants": ["icon-dark", "icon-light"],
       "variantTypes": {
         "base": ["icon"],
         "modes": ["dark", "light"]
       }
     },
     "files": [
       {
         "path": "components/logos/your-logo.tsx",
         "type": "registry:component"
       }
     ]
   }
   ```

4. Copy to src and build:
   ```bash
   cp registry/default/blocks/logos/your-logo/components/logos/your-logo.tsx src/components/ui/logos/
   bun run build:registry
   ```

## Code Style

- We use [Biome](https://biomejs.dev/) for linting and formatting
- Run `biome check --write .` before committing
- Use TypeScript strict mode
- Follow conventional commits: `feat:`, `fix:`, `docs:`, `chore:`

## Pull Request Process

1. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

3. Push to your fork:
   ```bash
   git push origin feat/your-feature
   ```

4. Open a Pull Request against `main`

### PR Checklist

- [ ] Code follows the project style guidelines
- [ ] Changes have been tested locally
- [ ] Registry has been rebuilt (`bun run build:registry`)
- [ ] Commit messages follow conventional commits

## Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Include steps to reproduce for bugs
- Check existing issues before creating new ones

## Questions?

Feel free to open a discussion or reach out to the maintainers.

---

Made with love by [Crafter Station](https://crafterstation.com)
