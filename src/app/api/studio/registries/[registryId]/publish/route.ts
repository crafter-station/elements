import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { getRegistryById, updateRegistry } from "@/lib/studio/db";

export async function POST(
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

  const updatedRegistry = await updateRegistry(registryId, {
    isPublic: true,
  });

  return NextResponse.json(updatedRegistry);
}
