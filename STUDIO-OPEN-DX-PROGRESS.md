# Registry Studio Open DX - Progress

## Context

Registry Studio is the visual IDE for shadcn-compatible component registries. The "Open DX" initiative adds three capabilities so users own their registry without vendor lock-in:

1. **Phase 1: GitHub Scaffold Export** - One-click export to a working GitHub repo with auto-deploy
2. **Phase 2: Sandboxed Live Preview** - Sandpack-powered live component rendering in the explorer
3. **Phase 3: Bidirectional GitHub Sync** - Import from GitHub, edit in Studio, push back (NOT STARTED)

Plan file: `~/.claude/plans/foamy-tumbling-whale.md`

---

## Phase 1: GitHub Scaffold Export (COMPLETE)

### What it does

User clicks "Export to GitHub" in the builder -> creates a fully working GitHub repo with:
- `registry.json` (shadcn-compatible index)
- `registry/{item-name}/` source files
- `package.json` with `"build": "npx shadcn@latest registry:build"`
- `.github/workflows/deploy.yml` for GitHub Pages auto-deploy
- `README.md` with namespace config + install instructions
- `.gitignore`

After push, GitHub Actions builds and deploys to Pages. Users install via `npx shadcn add`.

### Files created

| File | Purpose |
|------|---------|
| `src/lib/studio/github.ts` | GitHub API operations: `getGitHubToken()` (via Clerk OAuth), `getGitHubUser()`, `createRepo()`, `pushFiles()` (Trees API atomic commit), `enableGitHubPages()` |
| `src/lib/studio/scaffold-templates.ts` | Generates scaffold files: `generateScaffoldFiles()`, `generatePackageJson()`, `generateDeployWorkflow()`, `generateReadme()`, `generateGitignore()`. Reuses `buildRegistryIndex()` from `registry-builder.ts` |
| `src/app/api/studio/registries/[registryId]/export/route.ts` | POST endpoint: auth check -> GitHub token -> fetch items -> create repo -> push files -> enable Pages -> save export record -> update `github_repo_url` |
| `src/app/studio/builder/components/export-dialog.tsx` | Dialog UI with 3 states: form (repo name + private toggle), exporting (loading), done (success with links). When `githubRepoUrl` already set, renders as GitHub link badge |

### Files modified

| File | Change |
|------|--------|
| `src/lib/studio/types.ts` | Added `githubRepoUrl: string \| null` to `StudioRegistry`, added `GithubExport`, `ExportResult`, `ScaffoldFile` interfaces, added `githubRepoUrl` to `UpdateRegistryInput` |
| `src/lib/studio/db.ts` | Added `github_repo_url TEXT` column to registries, new `registry_github_exports` table, `mapGithubExportRow()`, `getGithubExport()`, `createGithubExport()`, `updateGithubExport()` |
| `src/app/studio/stores/builder-store.ts` | Added `githubRepoUrl?: string \| null` to `BuilderRegistry` interface |
| `src/app/studio/builder/[registryId]/page.tsx` | Wired `ExportDialog` component, added `githubRepoUrl` to fetch data mapping |
| `src/app/studio/builder/components/build-output.tsx` | Added missing `githubRepoUrl: null` to `StudioRegistry` object literal |

### Auth prerequisite

GitHub OAuth must be enabled in Clerk Dashboard with `repo` + `workflow` scopes. Token retrieved server-side via:
```typescript
const client = await clerkClient();
const tokens = await client.users.getUserOauthAccessToken(userId, "github");
```

No custom GitHub App needed.

### Key technical decisions

- **GitHub Trees API** for atomic single-commit push (blobs -> tree -> commit -> ref update)
- **SHA256 sync snapshot** stored per file for future diff-based sync (Phase 3)
- **Clerk OAuth** instead of custom GitHub App (simpler, no app registration)

---

## Phase 2: Sandboxed Live Preview + Explorer Redesign (COMPLETE)

### What it does

1. **Registry Directory**: Explore page shows all 127+ official shadcn registries from `ui.shadcn.com/r/registries.json` as default content instead of empty state
2. **Content Fetching**: Clicking an item fetches full item JSON (`{baseUrl}/{name}.json`) to get inline file content
3. **IDE-like Component Viewer**: File tree sidebar + code viewer with line numbers + Sandpack live preview
4. **Filter Chips**: Type filters as toggle pills with counts instead of confusing disconnected Tabs

### Files created

| File | Purpose |
|------|---------|
| `src/app/api/studio/explore/registries/route.ts` | GET endpoint that fetches + caches (1h TTL) the official shadcn `registries.json` (127+ registries) |
| `src/app/studio/explore/components/registry-directory.tsx` | Grid of all registries with search/filter. Clicking a card derives `registry.json` URL from the `url` pattern (strips `/{name}.json`, appends `/registry.json`) |
| `src/app/studio/explore/components/sandpack-preview-panel.tsx` | Lazy-loaded Sandpack renderer: `SandpackProvider` + `SandpackPreview` with Tailwind CDN, isolated from main bundle |
| `src/lib/studio/sandpack-setup.ts` | `buildSandpackFiles()`: builds Sandpack file map from registry items. Includes `cn()` utility, shadcn CSS vars, `@/` path resolution. `canPreview()`: returns false for server components |

### Files rewritten

| File | What changed |
|------|--------------|
| `src/app/studio/explore/page.tsx` | Default view is now the registry directory. When clicking a registry card, loads its `registry.json` into `RegistryBrowser`. "Back to directory" button for navigation. URL input still works for custom registries |
| `src/app/studio/explore/components/registry-browser.tsx` | Removed Tabs-as-filters, replaced with toggle filter chips showing type + count. Clicking an item now fetches full item JSON to get file content. Cleaner card design with monospace details |
| `src/app/studio/explore/components/component-viewer.tsx` | Full redesign: IDE-like layout with (1) file tree sidebar with collapsible folders + color-coded icons, (2) Preview tab with lazy-loaded Sandpack, (3) Code tab with line numbers on dark bg, (4) dependencies as collapsible sections in sidebar, (5) compact header with install button |

### Files deleted

| File | Why |
|------|-----|
| `src/app/studio/explore/components/live-preview.tsx` | Replaced by `sandpack-preview-panel.tsx` + integrated into `component-viewer.tsx` |

### URL derivation logic

`registries.json` entries have URL patterns like:
```
https://magicui.design/r/{name}
```

The `deriveRegistryJsonUrl()` function strips `/{name}(.json)?` and appends `/registry.json`:
```
https://magicui.design/r/{name} -> https://magicui.design/r/registry.json
```

### Sandpack setup details

- Template: `react-ts`
- External resources: `https://cdn.tailwindcss.com`
- Auto-included: `cn()` utility, `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `@radix-ui/react-slot`
- Path rewriting: `@/lib/utils` -> `/src/lib/utils`, `@/components/` -> `/src/components/`
- Auto-generated `App.tsx` entry point that imports and renders the main component
- `canPreview()` skips items containing `"use server"` or `"server-only"`

### New dependency

```
@codesandbox/sandpack-react@2.20.0
```

---

## Phase 3: Bidirectional GitHub Sync (NOT STARTED)

### Planned features

1. **Import from GitHub**: Paste repo URL -> parse `registry.json` + source files -> create Studio registry
2. **Push to GitHub**: Edit in Studio -> compute diff via SHA256 snapshot -> push changed files via Trees API
3. **Conflict detection**: Poll-on-open, compare commit SHA, "last write wins" with warning

### Planned files

| File | Purpose |
|------|---------|
| `src/lib/studio/github-sync.ts` | Import from GitHub, diff computation, push changes |
| `src/app/api/studio/registries/[registryId]/import-github/route.ts` | POST: import from GitHub URL |
| `src/app/api/studio/registries/[registryId]/push-github/route.ts` | POST: push Studio changes |
| `src/app/api/studio/registries/[registryId]/sync-status/route.ts` | GET: check for newer commits |
| `src/app/studio/builder/components/github-sync-bar.tsx` | Sync status indicator + pull/push buttons |
| `src/app/studio/builder/components/import-github-dialog.tsx` | Modal: paste GitHub URL, preview import |
| `src/app/studio/builder/components/conflict-dialog.tsx` | Modal: conflict resolution options |

### DB already prepared

The `registry_github_exports` table already has `last_commit_sha`, `sync_snapshot` (JSONB), and `last_synced_at` columns ready for Phase 3.

---

## Architecture Reference

### Database (Neon Postgres)

Key tables in `src/lib/studio/db.ts`:
- `registries` - User registries with `github_repo_url`
- `registry_items` - Components/blocks within a registry
- `registry_item_files` - Source files for each item
- `registry_github_exports` - GitHub export tracking with sync state
- `registry_analytics` - Usage tracking
- `registry_builds` - Build history

### State Management (Zustand)

- `builder-store.ts` - Registry editing state: items, files, selection, dirty tracking
- `chat-store.ts` - AI chat conversation
- `studio-store.ts` - Global studio state

### Key shared modules

- `registry-builder.ts` - `buildRegistryIndex()` and `buildRegistryItemJson()` convert DB data to shadcn-compatible JSON
- `schema-validation.ts` - Validates items against shadcn registry schema
- `quality-scorer.ts` - Scores registry items on completeness (description, docs, categories, naming, etc.)
- `constants.ts` - `ITEM_TYPE_LABELS`, `REGISTRY_ITEM_TYPES`

### Proxy pattern for CORS

The explore API route (`/api/studio/explore`) acts as a server-side proxy to fetch external registries, avoiding CORS issues. All external fetches go through this route.

---

## How to continue

### To implement Phase 3

1. Read the plan at `~/.claude/plans/foamy-tumbling-whale.md` (Phase 3 section)
2. The DB schema is ready (`registry_github_exports` table)
3. `github.ts` already has `getGitHubToken()`, `pushFiles()` - reuse for sync
4. Start with import (easier), then push, then conflict detection

### To improve Sandpack previews

Current limitations:
- No resolution of `registryDependencies` (e.g., if component uses `button` from same registry, it won't resolve)
- No custom theme injection from `cssVars` into Sandpack
- Error boundary needed around Sandpack (bad code can freeze the panel)

### Build verification

```bash
cd ~/Programming/crafter-station/elements && bun run build
```

Last verified: builds clean, zero errors, all 153 components + studio pages generated.
