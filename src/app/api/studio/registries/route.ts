import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { createRegistry, getRegistriesByUser } from "@/lib/studio/db";

const createRegistrySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  displayName: z.string().optional(),
  homepage: z.string().optional(),
  description: z.string().optional(),
});

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const registries = await getRegistriesByUser(userId);
  return NextResponse.json(registries);
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validation = createRegistrySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.error.flatten() },
      { status: 400 },
    );
  }

  const registry = await createRegistry({
    clerkUserId: userId,
    ...validation.data,
  });

  return NextResponse.json(registry, { status: 201 });
}
