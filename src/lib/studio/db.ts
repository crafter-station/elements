import { neon } from "@neondatabase/serverless";
import type {
  StudioRegistry,
  StudioRegistryItem,
  StudioRegistryFile,
  RegistryBuild,
  RegistryAnalyticsEvent,
  AnalyticsSummary,
  GithubExport,
  CreateRegistryInput,
  UpdateRegistryInput,
  CreateItemInput,
  UpdateItemInput,
  UpsertFileInput,
} from "./types";

const rawSql = neon(process.env.DATABASE_URL!);

let _schemaReady: Promise<void> | null = null;

async function query(
  strings: TemplateStringsArray,
  ...values: unknown[]
) {
  if (!_schemaReady) {
    _schemaReady = runInitSchema().catch((err) => {
      _schemaReady = null;
      throw err;
    });
  }
  await _schemaReady;
  return rawSql(strings, ...values);
}

const sql = query;
export { sql };

async function runInitSchema() {
  await rawSql`
    CREATE TABLE IF NOT EXISTS registries (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      clerk_user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      display_name TEXT,
      homepage TEXT,
      description TEXT,
      slug TEXT NOT NULL,
      is_public BOOLEAN DEFAULT false,
      theme_id TEXT,
      github_repo_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(clerk_user_id, slug)
    )
  `;

  await rawSql`
    CREATE TABLE IF NOT EXISTS registry_items (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      registry_id TEXT NOT NULL REFERENCES registries(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT,
      description TEXT,
      docs TEXT,
      dependencies JSONB DEFAULT '[]',
      registry_dependencies JSONB DEFAULT '[]',
      dev_dependencies JSONB DEFAULT '[]',
      css_vars JSONB DEFAULT '{}',
      css JSONB,
      env_vars JSONB DEFAULT '{}',
      categories JSONB DEFAULT '[]',
      meta JSONB DEFAULT '{}',
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(registry_id, name)
    )
  `;

  await rawSql`
    CREATE TABLE IF NOT EXISTS registry_item_files (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      item_id TEXT NOT NULL REFERENCES registry_items(id) ON DELETE CASCADE,
      path TEXT NOT NULL,
      type TEXT NOT NULL,
      target TEXT,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await rawSql`
    CREATE TABLE IF NOT EXISTS registry_analytics (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      registry_id TEXT NOT NULL REFERENCES registries(id) ON DELETE CASCADE,
      item_name TEXT,
      event_type TEXT NOT NULL,
      user_agent TEXT,
      ip_hash TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await rawSql`
    CREATE TABLE IF NOT EXISTS registry_builds (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      registry_id TEXT NOT NULL REFERENCES registries(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'pending',
      output_url TEXT,
      error_message TEXT,
      built_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await rawSql`
    CREATE TABLE IF NOT EXISTS registry_github_exports (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      registry_id TEXT NOT NULL REFERENCES registries(id) ON DELETE CASCADE,
      github_repo_url TEXT NOT NULL,
      github_pages_url TEXT,
      github_repo_owner TEXT NOT NULL,
      github_repo_name TEXT NOT NULL,
      last_commit_sha TEXT,
      sync_snapshot JSONB,
      exported_at TIMESTAMPTZ DEFAULT NOW(),
      last_synced_at TIMESTAMPTZ
    )
  `;
}

function mapRegistryRow(row: any): StudioRegistry {
  return {
    id: row.id,
    clerkUserId: row.clerk_user_id,
    name: row.name,
    displayName: row.display_name,
    homepage: row.homepage,
    description: row.description,
    slug: row.slug,
    isPublic: row.is_public,
    themeId: row.theme_id,
    githubRepoUrl: row.github_repo_url,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function mapGithubExportRow(row: any): GithubExport {
  return {
    id: row.id,
    registryId: row.registry_id,
    githubRepoUrl: row.github_repo_url,
    githubPagesUrl: row.github_pages_url,
    githubRepoOwner: row.github_repo_owner,
    githubRepoName: row.github_repo_name,
    lastCommitSha: row.last_commit_sha,
    syncSnapshot: row.sync_snapshot,
    exportedAt: new Date(row.exported_at),
    lastSyncedAt: row.last_synced_at ? new Date(row.last_synced_at) : null,
  };
}

function mapItemRow(row: any): Omit<StudioRegistryItem, "files"> {
  return {
    id: row.id,
    registryId: row.registry_id,
    name: row.name,
    type: row.type,
    title: row.title,
    description: row.description,
    docs: row.docs,
    dependencies: row.dependencies || [],
    registryDependencies: row.registry_dependencies || [],
    devDependencies: row.dev_dependencies || [],
    cssVars: row.css_vars || {},
    css: row.css,
    envVars: row.env_vars || {},
    categories: row.categories || [],
    meta: row.meta || {},
    sortOrder: row.sort_order || 0,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function mapFileRow(row: any): StudioRegistryFile {
  return {
    id: row.id,
    itemId: row.item_id,
    path: row.path,
    type: row.type,
    target: row.target,
    content: row.content,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function getRegistriesByUser(
  clerkUserId: string,
): Promise<StudioRegistry[]> {
  const rows = await sql`
    SELECT * FROM registries
    WHERE clerk_user_id = ${clerkUserId}
    ORDER BY created_at DESC
  `;
  return rows.map(mapRegistryRow);
}

export async function getRegistryById(
  id: string,
): Promise<StudioRegistry | null> {
  const rows = await sql`
    SELECT * FROM registries
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows.length > 0 ? mapRegistryRow(rows[0]) : null;
}

export async function getRegistryBySlug(
  slug: string,
): Promise<StudioRegistry | null> {
  const rows = await sql`
    SELECT * FROM registries
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return rows.length > 0 ? mapRegistryRow(rows[0]) : null;
}

export async function createRegistry(
  data: CreateRegistryInput,
): Promise<StudioRegistry> {
  const rows = await sql`
    INSERT INTO registries (clerk_user_id, name, slug, display_name, homepage, description)
    VALUES (${data.clerkUserId}, ${data.name}, ${data.slug}, ${data.displayName || null}, ${data.homepage || null}, ${data.description || null})
    RETURNING *
  `;
  return mapRegistryRow(rows[0]);
}

export async function updateRegistry(
  id: string,
  data: UpdateRegistryInput,
): Promise<StudioRegistry> {
  const rows = await sql`
    UPDATE registries
    SET
      name = COALESCE(${data.name ?? null}, name),
      display_name = CASE WHEN ${data.displayName !== undefined} THEN ${data.displayName ?? null} ELSE display_name END,
      homepage = CASE WHEN ${data.homepage !== undefined} THEN ${data.homepage ?? null} ELSE homepage END,
      description = CASE WHEN ${data.description !== undefined} THEN ${data.description ?? null} ELSE description END,
      slug = COALESCE(${data.slug ?? null}, slug),
      is_public = COALESCE(${data.isPublic ?? null}, is_public),
      theme_id = CASE WHEN ${data.themeId !== undefined} THEN ${data.themeId ?? null} ELSE theme_id END,
      github_repo_url = CASE WHEN ${data.githubRepoUrl !== undefined} THEN ${data.githubRepoUrl ?? null} ELSE github_repo_url END,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return mapRegistryRow(rows[0]);
}

export async function deleteRegistry(id: string): Promise<void> {
  await sql`
    DELETE FROM registries
    WHERE id = ${id}
  `;
}

export async function getItemsByRegistry(
  registryId: string,
): Promise<StudioRegistryItem[]> {
  const itemRows = await sql`
    SELECT * FROM registry_items
    WHERE registry_id = ${registryId}
    ORDER BY sort_order ASC, created_at ASC
  `;

  const items: StudioRegistryItem[] = [];

  for (const itemRow of itemRows) {
    const item = mapItemRow(itemRow);
    const files = await getFilesByItem(item.id);
    items.push({ ...item, files });
  }

  return items;
}

export async function getItemById(
  id: string,
): Promise<StudioRegistryItem | null> {
  const rows = await sql`
    SELECT * FROM registry_items
    WHERE id = ${id}
    LIMIT 1
  `;

  if (rows.length === 0) return null;

  const item = mapItemRow(rows[0]);
  const files = await getFilesByItem(item.id);

  return { ...item, files };
}

export async function createItem(
  data: CreateItemInput,
): Promise<StudioRegistryItem> {
  const rows = await sql`
    INSERT INTO registry_items (
      registry_id, name, type, title, description, docs,
      dependencies, registry_dependencies, dev_dependencies,
      css_vars, css, env_vars, categories, meta
    )
    VALUES (
      ${data.registryId}, ${data.name}, ${data.type}, ${data.title || null},
      ${data.description || null}, ${data.docs || null},
      ${JSON.stringify(data.dependencies || [])}, ${JSON.stringify(data.registryDependencies || [])},
      ${JSON.stringify(data.devDependencies || [])}, ${JSON.stringify(data.cssVars || {})},
      ${data.css ? JSON.stringify(data.css) : null}, ${JSON.stringify(data.envVars || {})},
      ${JSON.stringify(data.categories || [])}, ${JSON.stringify(data.meta || {})}
    )
    RETURNING *
  `;

  const item = mapItemRow(rows[0]);
  return { ...item, files: [] };
}

export async function updateItem(
  id: string,
  data: UpdateItemInput,
): Promise<StudioRegistryItem> {
  const rows = await sql`
    UPDATE registry_items
    SET
      name = COALESCE(${data.name ?? null}, name),
      type = COALESCE(${data.type ?? null}, type),
      title = CASE WHEN ${data.title !== undefined} THEN ${data.title ?? null} ELSE title END,
      description = CASE WHEN ${data.description !== undefined} THEN ${data.description ?? null} ELSE description END,
      docs = CASE WHEN ${data.docs !== undefined} THEN ${data.docs ?? null} ELSE docs END,
      dependencies = COALESCE(${data.dependencies !== undefined ? JSON.stringify(data.dependencies) : null}, dependencies),
      registry_dependencies = COALESCE(${data.registryDependencies !== undefined ? JSON.stringify(data.registryDependencies) : null}, registry_dependencies),
      dev_dependencies = COALESCE(${data.devDependencies !== undefined ? JSON.stringify(data.devDependencies) : null}, dev_dependencies),
      css_vars = COALESCE(${data.cssVars !== undefined ? JSON.stringify(data.cssVars) : null}, css_vars),
      css = CASE WHEN ${data.css !== undefined} THEN ${data.css ? JSON.stringify(data.css) : null} ELSE css END,
      env_vars = COALESCE(${data.envVars !== undefined ? JSON.stringify(data.envVars) : null}, env_vars),
      categories = COALESCE(${data.categories !== undefined ? JSON.stringify(data.categories) : null}, categories),
      meta = COALESCE(${data.meta !== undefined ? JSON.stringify(data.meta) : null}, meta),
      sort_order = COALESCE(${data.sortOrder ?? null}, sort_order),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  const item = mapItemRow(rows[0]);
  const files = await getFilesByItem(item.id);

  return { ...item, files };
}

export async function deleteItem(id: string): Promise<void> {
  await sql`
    DELETE FROM registry_items
    WHERE id = ${id}
  `;
}

export async function getFilesByItem(
  itemId: string,
): Promise<StudioRegistryFile[]> {
  const rows = await sql`
    SELECT * FROM registry_item_files
    WHERE item_id = ${itemId}
    ORDER BY created_at ASC
  `;
  return rows.map(mapFileRow);
}

export async function upsertFile(
  data: UpsertFileInput,
): Promise<StudioRegistryFile> {
  const existing = await sql`
    SELECT id FROM registry_item_files
    WHERE item_id = ${data.itemId} AND path = ${data.path}
    LIMIT 1
  `;

  if (existing.length > 0) {
    const rows = await sql`
      UPDATE registry_item_files
      SET type = ${data.type}, target = ${data.target || null}, content = ${data.content}, updated_at = NOW()
      WHERE id = ${existing[0].id}
      RETURNING *
    `;
    return mapFileRow(rows[0]);
  }

  const rows = await sql`
    INSERT INTO registry_item_files (item_id, path, type, target, content)
    VALUES (${data.itemId}, ${data.path}, ${data.type}, ${data.target || null}, ${data.content})
    RETURNING *
  `;
  return mapFileRow(rows[0]);
}

export async function deleteFile(id: string): Promise<void> {
  await sql`
    DELETE FROM registry_item_files
    WHERE id = ${id}
  `;
}

export async function trackAnalytics(data: {
  registryId: string;
  itemName?: string | null;
  eventType: "install" | "view" | "fetch";
  userAgent?: string | null;
  ipHash?: string | null;
}): Promise<void> {
  await sql`
    INSERT INTO registry_analytics (registry_id, item_name, event_type, user_agent, ip_hash)
    VALUES (${data.registryId}, ${data.itemName || null}, ${data.eventType}, ${data.userAgent || null}, ${data.ipHash || null})
  `;
}

export async function getGithubExport(
  registryId: string,
): Promise<GithubExport | null> {
  const rows = await sql`
    SELECT * FROM registry_github_exports
    WHERE registry_id = ${registryId}
    ORDER BY exported_at DESC
    LIMIT 1
  `;
  return rows.length > 0 ? mapGithubExportRow(rows[0]) : null;
}

export async function createGithubExport(data: {
  registryId: string;
  githubRepoUrl: string;
  githubPagesUrl: string | null;
  githubRepoOwner: string;
  githubRepoName: string;
  lastCommitSha: string | null;
  syncSnapshot: Record<string, string> | null;
}): Promise<GithubExport> {
  const rows = await sql`
    INSERT INTO registry_github_exports (
      registry_id, github_repo_url, github_pages_url,
      github_repo_owner, github_repo_name,
      last_commit_sha, sync_snapshot
    )
    VALUES (
      ${data.registryId}, ${data.githubRepoUrl}, ${data.githubPagesUrl},
      ${data.githubRepoOwner}, ${data.githubRepoName},
      ${data.lastCommitSha}, ${data.syncSnapshot ? JSON.stringify(data.syncSnapshot) : null}
    )
    RETURNING *
  `;
  return mapGithubExportRow(rows[0]);
}

export async function updateGithubExport(
  id: string,
  data: Partial<{
    lastCommitSha: string;
    syncSnapshot: Record<string, string>;
    lastSyncedAt: Date;
    githubPagesUrl: string;
  }>,
): Promise<GithubExport> {
  const rows = await sql`
    UPDATE registry_github_exports
    SET
      last_commit_sha = COALESCE(${data.lastCommitSha ?? null}, last_commit_sha),
      sync_snapshot = COALESCE(${data.syncSnapshot ? JSON.stringify(data.syncSnapshot) : null}, sync_snapshot),
      last_synced_at = COALESCE(${data.lastSyncedAt?.toISOString() ?? null}, last_synced_at),
      github_pages_url = COALESCE(${data.githubPagesUrl ?? null}, github_pages_url)
    WHERE id = ${id}
    RETURNING *
  `;
  return mapGithubExportRow(rows[0]);
}

export async function getAnalytics(
  registryId: string,
  days: number,
): Promise<AnalyticsSummary> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [totalsRows, topItemsRows, dailyRows] = await Promise.all([
    sql`
      SELECT
        COUNT(*) FILTER (WHERE event_type = 'install') as total_installs,
        COUNT(*) FILTER (WHERE event_type = 'view') as total_views,
        COUNT(*) FILTER (WHERE event_type = 'fetch') as total_fetches
      FROM registry_analytics
      WHERE registry_id = ${registryId} AND created_at >= ${since.toISOString()}
    `,
    sql`
      SELECT item_name as name, COUNT(*) as count
      FROM registry_analytics
      WHERE registry_id = ${registryId}
        AND created_at >= ${since.toISOString()}
        AND item_name IS NOT NULL
        AND event_type = 'install'
      GROUP BY item_name
      ORDER BY count DESC
      LIMIT 10
    `,
    sql`
      SELECT
        DATE(created_at) as date,
        COUNT(*) FILTER (WHERE event_type = 'install') as installs,
        COUNT(*) FILTER (WHERE event_type = 'view') as views
      FROM registry_analytics
      WHERE registry_id = ${registryId} AND created_at >= ${since.toISOString()}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
  ]);

  return {
    totalInstalls: Number(totalsRows[0]?.total_installs || 0),
    totalViews: Number(totalsRows[0]?.total_views || 0),
    totalFetches: Number(totalsRows[0]?.total_fetches || 0),
    topItems: topItemsRows.map((row: any) => ({
      name: row.name,
      count: Number(row.count),
    })),
    dailyCounts: dailyRows.map((row: any) => ({
      date: row.date,
      installs: Number(row.installs),
      views: Number(row.views),
    })),
  };
}
