import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { getAnalytics, getRegistryById } from "@/lib/studio/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ registryId: string }> },
) {
  const { userId } = await auth();
  const { registryId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const registry = await getRegistryById(registryId);

  if (!registry) {
    return NextResponse.json({ error: "Registry not found" }, { status: 404 });
  }

  if (registry.clerkUserId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const days = Number(url.searchParams.get("days")) || 30;

  const analytics = await getAnalytics(registryId, days);

  return NextResponse.json(analytics);
}
