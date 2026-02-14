import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createHash } from "node:crypto";

import {
  createRegistry,
  createGithubExport,
  updateRegistry,
} from "@/lib/studio/db";
import type { StudioRegistry } from "@/lib/studio/types";
import {
  getGitHubToken,
  getGitHubUser,
  createRepo,
  pushFiles,
  enableGitHubPages,
} from "@/lib/studio/github";
import { generateScaffoldFiles } from "@/lib/studio/scaffold-templates";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  displayName: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
  repoName: z.string().min(1).max(100),
  org: z.string().max(100).optional(),
});

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

  const { name, displayName, description, isPublic, repoName, org } =
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

    const scaffoldFiles = generateScaffoldFiles(tempRegistry, [], pagesUrl);

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
    } catch {
    }

    const registry = await createRegistry({
      clerkUserId: userId,
      name,
      slug,
      displayName: displayName || undefined,
      description: description || undefined,
    });

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
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create registry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
