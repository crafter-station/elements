import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { getGitHubToken, getGitHubUser, listUserOrgs } from "@/lib/studio/github";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await getGitHubToken(userId);

    const [user, orgs] = await Promise.all([
      getGitHubUser(token),
      listUserOrgs(token),
    ]);

    return NextResponse.json({
      connected: true,
      user: { login: user.login },
      orgs: orgs.map((o) => ({
        login: o.login,
        avatar_url: o.avatar_url,
      })),
    });
  } catch {
    return NextResponse.json({ connected: false });
  }
}
