import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getGitHubToken } from "@/lib/studio/github";
import { importFromGitHub } from "@/lib/studio/github-sync";

const importSchema = z.object({
  githubUrl: z.string().url(),
});

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = importSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { githubUrl } = parsed.data;

    const urlPattern =
      /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/)?$/;
    const match = githubUrl.match(urlPattern);

    if (!match) {
      return NextResponse.json(
        {
          error: "Invalid GitHub URL format. Expected: https://github.com/owner/repo",
        },
        { status: 400 },
      );
    }

    const [, owner, repo] = match;

    const token = await getGitHubToken(userId);
    const result = await importFromGitHub(token, owner, repo, userId);

    return NextResponse.json({
      registryId: result.registryId,
      itemCount: result.itemCount,
      fileCount: result.fileCount,
      redirectUrl: `/studio/builder/${result.registryId}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
