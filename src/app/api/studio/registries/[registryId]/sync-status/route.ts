import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRegistryById, getGithubExport } from "@/lib/studio/db";
import { getGitHubToken } from "@/lib/studio/github";
import { getRemoteCommitSha } from "@/lib/studio/github-sync";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ registryId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { registryId } = await params;

    const registry = await getRegistryById(registryId);
    if (!registry) {
      return NextResponse.json(
        { error: "Registry not found" },
        { status: 404 }
      );
    }

    if (registry.clerkUserId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: not registry owner" },
        { status: 403 }
      );
    }

    const githubExport = await getGithubExport(registryId);
    if (!githubExport) {
      return NextResponse.json(
        { error: "Not connected to GitHub" },
        { status: 404 }
      );
    }

    const token = await getGitHubToken(userId);
    const remoteCommitSha = await getRemoteCommitSha(
      token,
      githubExport.githubRepoOwner,
      githubExport.githubRepoName
    );

    return NextResponse.json({
      hasRemoteChanges: remoteCommitSha !== githubExport.lastCommitSha,
      localCommitSha: githubExport.lastCommitSha,
      remoteCommitSha,
      lastSyncedAt: githubExport.lastSyncedAt,
    });
  } catch (error) {
    console.error("Error checking sync status:", error);
    return NextResponse.json(
      { error: "Failed to check sync status" },
      { status: 500 }
    );
  }
}
