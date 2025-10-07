# Elements Monorepo Structure

This project is now organized as a **Turborepo monorepo** for better organization and scalability.

## Structure

```
elements/
├── apps/
│   └── web/                    # Main Next.js application
│       ├── app/                # Next.js app directory
│       ├── components/         # React components
│       ├── lib/                # Utilities and helpers
│       └── package.json        # Web app dependencies
├── packages/
│   ├── clerk/                  # Clerk authentication components
│   │   ├── registry/           # Component registry files
│   │   │   └── clerk/          # Clerk component implementations
│   │   ├── registry.json       # Clerk registry schema
│   │   └── package.json
│   ├── uploadthing/            # UploadThing file upload components
│   │   ├── registry/
│   │   │   └── uploadthing/
│   │   ├── registry.json
│   │   └── package.json
│   ├── polar/                  # Polar sponsorship components
│   │   ├── registry/
│   │   │   └── polar/
│   │   ├── registry.json
│   │   └── package.json
│   ├── logos/                  # Logo components library
│   │   ├── registry/
│   │   │   └── logos/
│   │   ├── registry.json
│   │   └── package.json
│   └── theme/                  # Theme switcher components
│       ├── registry/
│       │   └── theme-switcher/
│       ├── registry.json
│       └── package.json
├── scripts/
│   ├── merge-registry.ts       # Merges all package registries into one
│   └── split-registry.ts       # Splits main registry into packages
├── turbo.json                  # Turborepo configuration
├── registry.json               # Merged registry (auto-generated)
└── package.json                # Root workspace configuration
```

## Key Features

### Provider-Based Organization
Each provider (clerk, uploadthing, polar, etc.) has its own package with:
- Isolated registry files
- Component implementations
- Independent versioning capability
- Dedicated package.json

### Registry Management

#### Merging Registries
The main `registry.json` at the root is auto-generated from all package registries:

```bash
bun run registry:merge
```

This script:
1. Scans all packages for `registry.json` files
2. Combines all items into one registry
3. Writes to root `registry.json`

#### Splitting Registry (One-time use)
The `split-registry.ts` script was used to split the original monolithic registry:

```bash
bun run scripts/split-registry.ts
```

## Development Workflow

### Running the dev server
```bash
bun run dev
```

This runs the Next.js dev server for the web app using Turborepo.

### Building
```bash
bun run build
```

Builds all packages in the correct order based on dependencies.

### Linting
```bash
bun run lint
```

Runs linting across all packages.

## Package Details

### @elements/clerk
**12 components**
- Waitlist forms
- Sign-in/Sign-up forms (ShadCN & Signals versions)
- Middleware
- Dashboard examples
- SSO callback handlers

### @elements/uploadthing
**2 components**
- Upload button
- Upload dropzone

### @elements/polar
**2 components**
- Sponsorship tiers
- Checkout flow

### @elements/logos
**40 components**
- AI providers (OpenAI, Claude, Gemini, etc.)
- Tech companies (Apple, Microsoft, Google, etc.)
- Developer tools (GitHub, GitLab, Discord, etc.)

### @elements/theme
**6 components**
- Button switcher
- Dropdown switcher
- Multi-button switcher
- Toggle switcher
- Switch component
- Theme switcher component

## Benefits of This Structure

1. **Lower Cognitive Effort**: Each provider's components are isolated in their own package
2. **High Predictability**: Clear separation of concerns
3. **Good Code Quality**: Isolated testing and development per provider
4. **Simplicity by Design**: Each package can be developed independently
5. **Scalability**: Easy to add new provider packages
6. **Parallel Development**: Teams can work on different providers simultaneously

## Adding a New Provider Package

1. Create a new directory in `packages/`:
   ```bash
   mkdir packages/my-provider
   ```

2. Add `package.json`:
   ```json
   {
     "name": "@elements/my-provider",
     "version": "0.1.0",
     "private": true,
     "description": "My provider components",
     "scripts": {
       "dev": "echo 'No dev script'",
       "build": "echo 'No build script'",
       "lint": "biome check ."
     }
   }
   ```

3. Create `registry.json`:
   ```json
   {
     "$schema": "https://ui.shadcn.com/schema/registry.json",
     "name": "elements-my-provider",
     "homepage": "https://tryelements.dev",
     "items": []
   }
   ```

4. Add your component files in `registry/my-provider/`

5. Run `bun run registry:merge` to update the main registry

## Turborepo Configuration

The `turbo.json` defines task pipelines:

- **build**: Builds packages with caching, respects dependency order
- **dev**: Runs dev servers (persistent, no caching)
- **lint**: Lints all packages
- **registry:merge**: Merges package registries (no caching)

## Notes

- The root `package.json` has minimal dependencies (only dev tools)
- All application dependencies are in `apps/web/package.json`
- Package registries are the source of truth
- The root `registry.json` is auto-generated - don't edit it manually
