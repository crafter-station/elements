import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import {
  deleteFile,
  getItemById,
  getRegistryById,
  upsertFile,
} from "@/lib/studio/db";
import { REGISTRY_FILE_TYPES } from "@/lib/studio/types";

const upsertFileSchema = z.object({
  path: z.string().min(1),
  type: z.enum(REGISTRY_FILE_TYPES),
  target: z.string().optional(),
  content: z.string(),
});

const deleteFileSchema = z.object({
  fileId: z.string(),
});

async function verifyItemOwnership(userId: string, itemId: string) {
  const item = await getItemById(itemId);

  if (!item) {
    return { error: "Not found", status: 404 };
  }

  const registry = await getRegistryById(item.registryId);

  if (!registry) {
    return { error: "Not found", status: 404 };
  }

  if (registry.clerkUserId !== userId) {
    return { error: "Forbidden", status: 403 };
  }

  return { item, registry };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemId } = await params;
  const result = await verifyItemOwnership(userId, itemId);

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  const body = await request.json();
  const validation = upsertFileSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.error.flatten() },
      { status: 400 },
    );
  }

  const file = await upsertFile({
    itemId,
    ...validation.data,
  });

  return NextResponse.json(file, { status: 201 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemId } = await params;
  const result = await verifyItemOwnership(userId, itemId);

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  const body = await request.json();
  const validation = deleteFileSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.error.flatten() },
      { status: 400 },
    );
  }

  await deleteFile(validation.data.fileId);
  return NextResponse.json({ success: true });
}
