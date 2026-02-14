import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  getRegistryById,
  getItemsByRegistry,
  getGithubExport,
  updateGithubExport,
} from "@/lib/studio/db";
import { getGitHubToken, pushFilesIncremental } from "@/lib/studio/github";
import { computeSyncDiff, getRemoteCommitSha } from "@/lib/studio/github-sync";
import { generateScaffoldFiles } from "@/lib/studio/scaffold-templates";

const bodySchema = z.object({
  force: z.boolean().optional(),
});

export async function POST(
  _req: Request,
  context: { params: Promise<{ registryId: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { registryId } = await context.params;

  const registry = await getRegistryById(registryId);

  if (!registry) {
    return NextResponse.json({ error: "Registry not found" }, { status: 404 });
  }

  if (registry.clerkUserId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const githubExport = await getGithubExport(registryId);

  if (!githubExport) {
    return NextResponse.json(
      { error: "Not connected to GitHub" },
      { status: 400 },
    );
  }

  const items = await getItemsByRegistry(registryId);

  const scaffoldFiles = generateScaffoldFiles(
    registry,
    items,
    githubExport.githubPagesUrl || "",
  );

  const diff = computeSyncDiff(scaffoldFiles, githubExport.syncSnapshot);

  if (
    diff.added.length === 0 &&
    diff.modified.length === 0 &&
    diff.deleted.length === 0
  ) {
    return NextResponse.json(
      {
        message: "Nothing to push",
        filesChanged: 0,
      },
      { status: 200 },
    );
  }

  const body = await _req.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error },
      { status: 400 },
    );
  }

  const { force = false } = parsed.data;

  const token = await getGitHubToken(userId);

  const remoteSha = await getRemoteCommitSha(
    token,
    githubExport.githubRepoOwner,
    githubExport.githubRepoName,
  );

  if (remoteSha !== githubExport.lastCommitSha && !force) {
    return NextResponse.json(
      {
        hasRemoteChanges: true,
        localCommitSha: githubExport.lastCommitSha,
        remoteCommitSha: remoteSha,
        lastSyncedAt: githubExport.lastSyncedAt,
      },
      { status: 409 },
    );
  }

  const newCommitSha = await pushFilesIncremental(
    token,
    githubExport.githubRepoOwner,
    githubExport.githubRepoName,
    [...diff.added, ...diff.modified],
    diff.deleted,
    remoteSha,
    "Update from Elements Studio",
  );

  await updateGithubExport(githubExport.id, {
    lastCommitSha: newCommitSha,
    syncSnapshot: diff.newSnapshot,
    lastSyncedAt: new Date(),
  });

  return NextResponse.json({
    commitSha: newCommitSha,
    filesChanged: diff.added.length + diff.modified.length + diff.deleted.length,
  });
}
