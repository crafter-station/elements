import { createHash } from "node:crypto";
import {
  createRegistry,
  createItem,
  upsertFile,
  updateRegistry,
  createGithubExport,
} from "@/lib/studio/db";
import type {
  ScaffoldFile,
  ImportResult,
  RegistryFileType,
  RegistryItemType,
  ShadcnRegistryJson,
} from "@/lib/studio/types";

const GITHUB_API_BASE = "https://api.github.com";

interface GitHubFileResponse {
  content: string;
  encoding: "base64";
  sha: string;
}

interface GitHubDirectoryItem {
  name: string;
  path: string;
  type: "file" | "dir";
}

interface SyncDiff {
  added: ScaffoldFile[];
  modified: ScaffoldFile[];
  deleted: string[];
  newSnapshot: Record<string, string>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function computeFileHash(content: string): string {
  return createHash("sha256").update(content, "utf-8").digest("hex");
}

async function githubFetch(
  token: string,
  path: string,
): Promise<Response> {
  const url = `${GITHUB_API_BASE}${path}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
  }

  return response;
}

export async function fetchRepoFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
): Promise<string> {
  const response = await githubFetch(
    token,
    `/repos/${owner}/${repo}/contents/${path}?ref=main`,
  );
  const data = (await response.json()) as GitHubFileResponse;

  if (data.encoding !== "base64") {
    throw new Error(`Unexpected encoding: ${data.encoding}`);
  }

  return Buffer.from(data.content, "base64").toString("utf-8");
}

async function fetchDirectoryListing(
  token: string,
  owner: string,
  repo: string,
  path: string,
): Promise<GitHubDirectoryItem[]> {
  const response = await githubFetch(
    token,
    `/repos/${owner}/${repo}/contents/${path}?ref=main`,
  );
  return (await response.json()) as GitHubDirectoryItem[];
}

export async function getRemoteCommitSha(
  token: string,
  owner: string,
  repo: string,
  branch: string = "main",
): Promise<string> {
  const response = await githubFetch(
    token,
    `/repos/${owner}/${repo}/git/ref/heads/${branch}`,
  );
  const data = (await response.json()) as { object: { sha: string } };
  return data.object.sha;
}

export async function importFromGitHub(
  token: string,
  owner: string,
  repo: string,
  clerkUserId: string,
): Promise<ImportResult> {
  let registryJsonPath = "registry.json";
  let registryContent: string;

  try {
    registryContent = await fetchRepoFile(token, owner, repo, registryJsonPath);
  } catch {
    registryJsonPath = "public/r/registry.json";
    registryContent = await fetchRepoFile(token, owner, repo, registryJsonPath);
  }

  const registryJson: ShadcnRegistryJson = JSON.parse(registryContent);

  const registry = await createRegistry({
    clerkUserId,
    name: registryJson.name,
    slug: slugify(registryJson.name),
    displayName: registryJson.name,
    homepage: registryJson.homepage || null,
    description: null,
  });

  let totalFileCount = 0;

  for (const itemJson of registryJson.items) {
    const item = await createItem({
      registryId: registry.id,
      name: itemJson.name,
      type: itemJson.type as RegistryItemType,
      title: itemJson.title,
      description: itemJson.description,
      docs: itemJson.docs,
      dependencies: itemJson.dependencies || [],
      registryDependencies: itemJson.registryDependencies || [],
      devDependencies: itemJson.devDependencies || [],
      cssVars: itemJson.cssVars || {},
      css: itemJson.css || null,
      envVars: itemJson.envVars || {},
      categories: itemJson.categories || [],
      meta: itemJson.meta || {},
    });

    for (const fileEntry of itemJson.files) {
      let fileContent = fileEntry.content;

      if (!fileContent) {
        const itemDirPath = `registry/${itemJson.name}`;
        const dirListing = await fetchDirectoryListing(
          token,
          owner,
          repo,
          itemDirPath,
        );
        const sourceFile = dirListing.find(
          (f) => f.type === "file" && f.name === fileEntry.path,
        );

        if (!sourceFile) {
          throw new Error(
            `File ${fileEntry.path} not found in ${itemDirPath}`,
          );
        }

        fileContent = await fetchRepoFile(token, owner, repo, sourceFile.path);
      }

      await upsertFile({
        itemId: item.id,
        path: fileEntry.path,
        type: fileEntry.type as RegistryFileType,
        target: fileEntry.target || null,
        content: fileContent,
      });

      totalFileCount++;
    }
  }

  const commitSha = await getRemoteCommitSha(token, owner, repo);

  const allFiles: ScaffoldFile[] = [];
  for (const itemJson of registryJson.items) {
    for (const fileEntry of itemJson.files) {
      let fileContent = fileEntry.content;

      if (!fileContent) {
        const itemDirPath = `registry/${itemJson.name}`;
        const dirListing = await fetchDirectoryListing(
          token,
          owner,
          repo,
          itemDirPath,
        );
        const sourceFile = dirListing.find(
          (f) => f.type === "file" && f.name === fileEntry.path,
        );

        if (sourceFile) {
          fileContent = await fetchRepoFile(
            token,
            owner,
            repo,
            sourceFile.path,
          );
        }
      }

      if (fileContent) {
        allFiles.push({
          path: `${itemJson.name}/${fileEntry.path}`,
          content: fileContent,
        });
      }
    }
  }

  const syncSnapshot: Record<string, string> = {};
  for (const file of allFiles) {
    syncSnapshot[file.path] = computeFileHash(file.content);
  }

  const githubRepoUrl = `https://github.com/${owner}/${repo}`;

  await createGithubExport({
    registryId: registry.id,
    githubRepoUrl,
    githubPagesUrl: null,
    githubRepoOwner: owner,
    githubRepoName: repo,
    lastCommitSha: commitSha,
    syncSnapshot,
  });

  await updateRegistry(registry.id, {
    githubRepoUrl,
  });

  return {
    registryId: registry.id,
    itemCount: registryJson.items.length,
    fileCount: totalFileCount,
    githubRepoUrl,
  };
}

export function computeSyncDiff(
  currentFiles: ScaffoldFile[],
  syncSnapshot: Record<string, string> | null,
): SyncDiff {
  const newSnapshot: Record<string, string> = {};
  const currentPaths = new Set<string>();
  const added: ScaffoldFile[] = [];
  const modified: ScaffoldFile[] = [];

  for (const file of currentFiles) {
    const hash = computeFileHash(file.content);
    newSnapshot[file.path] = hash;
    currentPaths.add(file.path);

    if (!syncSnapshot) {
      added.push(file);
    } else if (!(file.path in syncSnapshot)) {
      added.push(file);
    } else if (syncSnapshot[file.path] !== hash) {
      modified.push(file);
    }
  }

  const deleted: string[] = [];
  if (syncSnapshot) {
    for (const path in syncSnapshot) {
      if (!currentPaths.has(path)) {
        deleted.push(path);
      }
    }
  }

  return {
    added,
    modified,
    deleted,
    newSnapshot,
  };
}
