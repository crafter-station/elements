import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import {
  deleteItem,
  getItemById,
  getRegistryById,
  updateItem,
} from "@/lib/studio/db";
import { REGISTRY_ITEM_TYPES } from "@/lib/studio/types";

const updateItemSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(REGISTRY_ITEM_TYPES).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  docs: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  cssVars: z
    .object({
      theme: z.record(z.string(), z.string()).optional(),
      light: z.record(z.string(), z.string()).optional(),
      dark: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
  css: z.record(z.string(), z.unknown()).optional(),
  envVars: z.record(z.string(), z.string()).optional(),
  categories: z.array(z.string()).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
  sortOrder: z.number().optional(),
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

export async function GET(
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

  return NextResponse.json(result.item);
}

export async function PUT(
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
  const validation = updateItemSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.error.flatten() },
      { status: 400 },
    );
  }

  const updated = await updateItem(itemId, validation.data);
  return NextResponse.json(updated);
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

  await deleteItem(itemId);
  return NextResponse.json({ success: true });
}
