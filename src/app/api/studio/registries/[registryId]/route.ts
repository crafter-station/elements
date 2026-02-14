import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import {
  deleteRegistry,
  getRegistryById,
  updateRegistry,
} from "@/lib/studio/db";

const updateRegistrySchema = z.object({
  name: z.string().min(1).optional(),
  displayName: z.string().optional(),
  homepage: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().min(1).optional(),
  isPublic: z.boolean().optional(),
  themeId: z.string().optional(),
});

export async function GET(
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

  return NextResponse.json(registry);
}

export async function PUT(
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
  const validation = updateRegistrySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.error.flatten() },
      { status: 400 },
    );
  }

  const updated = await updateRegistry(registryId, validation.data);
  return NextResponse.json(updated);
}

export async function DELETE(
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

  await deleteRegistry(registryId);
  return NextResponse.json({ success: true });
}
