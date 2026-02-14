import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import {
  createItem,
  getItemsByRegistry,
  getRegistryById,
} from "@/lib/studio/db";
import { REGISTRY_ITEM_TYPES } from "@/lib/studio/types";

const createItemSchema = z.object({
  name: z.string().min(1),
  type: z.enum(REGISTRY_ITEM_TYPES),
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

  const items = await getItemsByRegistry(registryId);
  return NextResponse.json(items);
}

export async function POST(
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
  const validation = createItemSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.error.flatten() },
      { status: 400 },
    );
  }

  const item = await createItem({
    registryId,
    ...validation.data,
  });

  return NextResponse.json(item, { status: 201 });
}
