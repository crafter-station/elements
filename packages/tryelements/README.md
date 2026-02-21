# @tryelements/cli

Install SVG logos from [tryelements.dev](https://tryelements.dev) into any project. No React or shadcn required.

## Usage

```bash
bunx @tryelements/cli add-logo clerk astro github
```

SVGs are written to `public/` by default:

```
public/
  clerk-logo.svg
  astro-logo.svg
  github-logo.svg
```

## Commands

### `add-logo <logos...>`

Install logo SVGs to your project.

```bash
# Install to default directory (public/)
bunx @tryelements/cli add-logo apple clerk astro

# Custom output directory
bunx @tryelements/cli add-logo github --output-dir=src/assets

# Overwrite existing files
bunx @tryelements/cli add-logo clerk --overwrite
```

Both short and full names work: `clerk` and `clerk-logo` resolve to the same file.

### `list`

List all available logos.

```bash
bunx @tryelements/cli list

# JSON output
bunx @tryelements/cli list --json
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-o, --output-dir` | Output directory | `public/` |
| `--overwrite` | Overwrite existing files | `false` |
| `--json` | Output list as JSON | `false` |
| `-h, --help` | Show help | |
| `-v, --version` | Show version | |

## Examples

```bash
# Auth stack
bunx @tryelements/cli add-logo clerk better-auth

# AI providers
bunx @tryelements/cli add-logo openai anthropic claude

# Social footer
bunx @tryelements/cli add-logo twitter github discord

# Tech stack
bunx @tryelements/cli add-logo vercel supabase stripe
```

Then use in any framework:

```html
<img src="/clerk-logo.svg" alt="Clerk" />
```

```astro
<img src="/clerk-logo.svg" alt="Clerk" width="32" />
```

```vue
<img src="/clerk-logo.svg" alt="Clerk" class="h-8 w-auto" />
```

## React Projects

For React/shadcn projects, install as components instead:

```bash
npx shadcn@latest add @elements/clerk-logo
```

See [tryelements.dev](https://tryelements.dev) for the full component registry.

## License

MIT
