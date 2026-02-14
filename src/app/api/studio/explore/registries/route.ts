import { NextResponse } from "next/server";

export interface ShadcnRegistryEntry {
  name: string;
  homepage: string;
  url: string;
  description: string;
}

let cachedRegistries: ShadcnRegistryEntry[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 1000 * 60 * 60;

export async function GET() {
  try {
    const now = Date.now();
    if (cachedRegistries && now - cacheTimestamp < CACHE_TTL) {
      return NextResponse.json(cachedRegistries);
    }

    const response = await fetch(
      "https://ui.shadcn.com/r/registries.json",
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Elements Registry Studio/1.0",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: `Failed to fetch registries: ${response.status}` },
        { status: 502 },
      );
    }

    const data: ShadcnRegistryEntry[] = await response.json();
    cachedRegistries = data;
    cacheTimestamp = now;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Registries fetch error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch registries",
      },
      { status: 502 },
    );
  }
}
