import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import {
  getRegistryById,
  getItemsByRegistry,
  createGithubExport,
  updateRegistry,
} from "@/lib/studio/db";
import {
  getGitHubToken,
  getGitHubUser,
  createRepo,
  pushFiles,
  enableGitHubPages,
} from "@/lib/studio/github";
import { generateScaffoldFiles } from "@/lib/studio/scaffold-templates";
import { createHash } from "node:crypto";

const exportSchema = z.object({
  repoName: z.string().min(1).max(100),
  isPrivate: z.boolean().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ registryId: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { registryId } = await params;
  const registry = await getRegistryById(registryId);

  if (!registry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (registry.clerkUserId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const validation = exportSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.error.flatten() },
      { status: 400 },
    );
  }

  const { repoName, isPrivate } = validation.data;

  try {
    const token = await getGitHubToken(userId);
    const user = await getGitHubUser(token);
    const items = await getItemsByRegistry(registryId);

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Registry has no items to export" },
        { status: 400 },
      );
    }

    const repoData = await createRepo(token, {
      name: repoName,
      description: registry.description || `${registry.name} - shadcn/ui component registry`,
      isPrivate,
      homepage: registry.homepage || undefined,
    });

    const pagesUrl = `https://${user.login}.github.io/${repoName}`;
    const scaffoldFiles = generateScaffoldFiles(registry, items, pagesUrl);

    const commitSha = await pushFiles(
      token,
      user.login,
      repoName,
      scaffoldFiles,
      "Initial registry scaffold from Elements Studio",
    );

    let actualPagesUrl = pagesUrl;
    try {
      actualPagesUrl = await enableGitHubPages(token, user.login, repoName);
    } catch {
      // Pages may not be available immediately, URL is still predictable
    }

    const snapshot: Record<string, string> = {};
    for (const file of scaffoldFiles) {
      snapshot[file.path] = createHash("sha256")
        .update(file.content)
        .digest("hex");
    }

    await createGithubExport({
      registryId,
      githubRepoUrl: repoData.html_url,
      githubPagesUrl: actualPagesUrl,
      githubRepoOwner: user.login,
      githubRepoName: repoName,
      lastCommitSha: commitSha,
      syncSnapshot: snapshot,
    });

    await updateRegistry(registryId, {
      githubRepoUrl: repoData.html_url,
    });

    return NextResponse.json({
      repoUrl: repoData.html_url,
      pagesUrl: actualPagesUrl,
      owner: user.login,
      repo: repoName,
      commitSha,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
