import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createHash } from "node:crypto";

import {
  createRegistry,
  createItem,
  upsertFile,
  createGithubExport,
  updateRegistry,
} from "@/lib/studio/db";
import type { StudioRegistry, RegistryItemType } from "@/lib/studio/types";
import {
  getGitHubToken,
  getGitHubUser,
  createRepo,
  pushFiles,
  enableGitHubPages,
} from "@/lib/studio/github";
import { generateScaffoldFiles } from "@/lib/studio/scaffold-templates";

const itemSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-z0-9][a-z0-9-]*$/),
  type: z.string().default("registry:component"),
});

const createSchema = z.object({
  name: z.string().min(1).max(100),
  displayName: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
  repoName: z.string().min(1).max(100),
  org: z.string().max(100).optional(),
  items: z.array(itemSchema).max(50).default([]),
});

function generatePlaceholderContent(name: string, type: string): string {
  const pascal = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

  if (type === "registry:hook") {
    return `export function ${pascal.startsWith("Use") ? pascal : `use${pascal}`}() {
  // TODO: implement hook
  return {};
}
`;
  }

  if (type === "registry:lib") {
    return `// TODO: implement ${name}
export function ${pascal.charAt(0).toLowerCase() + pascal.slice(1)}() {
  return {};
}
`;
  }

  return `import * as React from "react";

export function ${pascal}() {
  return (
    <div>
      {/* TODO: implement ${name} */}
      <p>${pascal} component</p>
    </div>
  );
}
`;
}

function getFilePath(name: string, type: string): string {
  switch (type) {
    case "registry:ui":
      return `components/ui/${name}.tsx`;
    case "registry:hook":
      return `hooks/${name}.ts`;
    case "registry:lib":
      return `lib/${name}.ts`;
    case "registry:page":
      return `app/${name}/page.tsx`;
    case "registry:block":
      return `components/blocks/${name}.tsx`;
    default:
      return `components/${name}.tsx`;
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validation = createSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.error.flatten() },
      { status: 400 },
    );
  }

  const { name, displayName, description, isPublic, repoName, org, items } =
    validation.data;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  try {
    const token = await getGitHubToken(userId);
    const user = await getGitHubUser(token);
    const owner = org || user.login;

    const repoData = await createRepo(token, {
      name: repoName,
      description:
        description || `${name} - shadcn/ui component registry`,
      isPrivate: !(isPublic ?? true),
      org,
    });

    const pagesUrl = `https://${owner}.github.io/${repoName}`;

    const stubItems = items.map((item) => ({
      id: "stub",
      registryId: "stub",
      name: item.name,
      type: item.type as RegistryItemType,
      title: null,
      description: null,
      docs: null,
      dependencies: [],
      registryDependencies: [],
      devDependencies: [],
      cssVars: {},
      css: null,
      envVars: {},
      categories: [],
      meta: {},
      sortOrder: 0,
      files: [
        {
          id: "stub",
          itemId: "stub",
          path: getFilePath(item.name, item.type),
          type: (item.type.startsWith("registry:") ? item.type : "registry:component") as any,
          target: null,
          content: generatePlaceholderContent(item.name, item.type),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const tempRegistry: StudioRegistry = {
      id: "pending",
      clerkUserId: userId,
      name,
      slug,
      displayName: displayName || null,
      description: description || null,
      isPublic: isPublic ?? false,
      homepage: null,
      themeId: null,
      githubRepoUrl: repoData.html_url,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const scaffoldFiles = generateScaffoldFiles(tempRegistry, stubItems, pagesUrl);

    const commitSha = await pushFiles(
      token,
      owner,
      repoName,
      scaffoldFiles,
      "Initial registry scaffold from Elements Studio",
    );

    let actualPagesUrl = pagesUrl;
    try {
      actualPagesUrl = await enableGitHubPages(token, owner, repoName);
    } catch {}

    const registry = await createRegistry({
      clerkUserId: userId,
      name,
      slug,
      displayName: displayName || undefined,
      description: description || undefined,
    });

    for (let i = 0; i < items.length; i++) {
      const itemDef = items[i];
      const dbItem = await createItem({
        registryId: registry.id,
        name: itemDef.name,
        type: itemDef.type as RegistryItemType,
      });

      const filePath = getFilePath(itemDef.name, itemDef.type);
      const fileType = itemDef.type.startsWith("registry:")
        ? itemDef.type
        : "registry:component";

      await upsertFile({
        itemId: dbItem.id,
        path: filePath,
        type: fileType as any,
        content: generatePlaceholderContent(itemDef.name, itemDef.type),
      });
    }

    const snapshot: Record<string, string> = {};
    for (const file of scaffoldFiles) {
      snapshot[file.path] = createHash("sha256")
        .update(file.content)
        .digest("hex");
    }

    await createGithubExport({
      registryId: registry.id,
      githubRepoUrl: repoData.html_url,
      githubPagesUrl: actualPagesUrl,
      githubRepoOwner: owner,
      githubRepoName: repoName,
      lastCommitSha: commitSha,
      syncSnapshot: snapshot,
    });

    await updateRegistry(registry.id, {
      githubRepoUrl: repoData.html_url,
    });

    return NextResponse.json({
      id: registry.id,
      repoUrl: repoData.html_url,
      pagesUrl: actualPagesUrl,
      itemCount: items.length,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create registry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
