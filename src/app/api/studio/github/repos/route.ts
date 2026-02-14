import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import {
  getGitHubToken,
  getGitHubUser,
  listUserRepos,
  listUserOrgs,
} from "@/lib/studio/github";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await getGitHubToken(userId);

    const { searchParams } = new URL(request.url);
    const org = searchParams.get("org") || undefined;

    const [user, orgs, repos] = await Promise.all([
      getGitHubUser(token),
      listUserOrgs(token),
      listUserRepos(token, org),
    ]);

    return NextResponse.json({
      connected: true,
      user: { login: user.login },
      orgs: orgs.map((o) => ({
        login: o.login,
        avatar_url: o.avatar_url,
      })),
      repos: repos.map((r) => ({
        name: r.name,
        full_name: r.full_name,
        description: r.description,
        html_url: r.html_url,
        private: r.private,
        default_branch: r.default_branch,
        owner: r.owner.login,
      })),
    });
  } catch {
    return NextResponse.json({ connected: false });
  }
}
