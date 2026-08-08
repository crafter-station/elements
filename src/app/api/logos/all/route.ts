import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { type NextRequest, NextResponse } from "next/server";

const SVG_DIR = join(process.cwd(), "public/r/svg");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
};

interface LogoIndexEntry {
  name: string;
  file: string;
}

function extractViewBox(svg: string): string | null {
  return svg.match(/viewBox="([^"]+)"/)?.[1] ?? null;
}

function extractPaths(svg: string): string[] {
  return [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((match) => match[1]);
}

function isMonochrome(svg: string): boolean {
  return !/(?:fill|stroke|stop-color)="(?!none|currentColor)[^"]+"/.test(svg);
}

/**
 * Every logo in one response, so a client can hydrate a whole catalog with a
 * single request instead of one per logo.
 *
 * `?monochrome=true` narrows the set to logos that inherit `currentColor`.
 */
export async function GET(request: NextRequest) {
  const raw = await readFile(join(SVG_DIR, "index.json"), "utf-8");
  const entries = JSON.parse(raw) as LogoIndexEntry[];

  const monochromeOnly =
    request.nextUrl.searchParams.get("monochrome") === "true";

  const logos = await Promise.all(
    entries.map(async (entry) => {
      const svg = await readFile(join(SVG_DIR, entry.file), "utf-8");
      return {
        name: entry.name,
        viewBox: extractViewBox(svg),
        paths: extractPaths(svg),
        monochrome: isMonochrome(svg),
        svg,
      };
    }),
  );

  const filtered = monochromeOnly
    ? logos.filter((logo) => logo.monochrome)
    : logos;

  return NextResponse.json(
    { count: filtered.length, logos: filtered },
    { headers: { ...CORS_HEADERS, ...CACHE_HEADERS } },
  );
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
