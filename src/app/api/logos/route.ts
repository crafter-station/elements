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

async function readLogoIndex(): Promise<string[]> {
  const raw = await readFile(join(SVG_DIR, "index.json"), "utf-8");
  const entries = JSON.parse(raw) as LogoIndexEntry[];
  return entries.map((entry) => entry.name);
}

async function readLogoSvg(slug: string): Promise<string | null> {
  // Guard against path traversal: slugs are flat, lowercase identifiers.
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) return null;

  try {
    return await readFile(join(SVG_DIR, `${slug}.svg`), "utf-8");
  } catch {
    return null;
  }
}

function extractViewBox(svg: string): string | null {
  return svg.match(/viewBox="([^"]+)"/)?.[1] ?? null;
}

function extractPaths(svg: string): string[] {
  return [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((match) => match[1]);
}

/**
 * A logo is monochrome when it carries no hardcoded colors, meaning it inherits
 * `currentColor` and can be recolored by the consumer.
 */
function isMonochrome(svg: string): boolean {
  return !/(?:fill|stroke|stop-color)="(?!none|currentColor)[^"]+"/.test(svg);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const name = searchParams.get("name");
  const format = searchParams.get("format") ?? (name ? "svg" : "json");

  // No name: return the catalog.
  if (!name) {
    const names = await readLogoIndex();
    return NextResponse.json(
      { count: names.length, logos: names },
      { headers: { ...CORS_HEADERS, ...CACHE_HEADERS } },
    );
  }

  const slug = name.replace(/-logo$/, "");
  const svg = await readLogoSvg(slug);

  if (!svg) {
    return NextResponse.json(
      { error: `Logo "${name}" not found` },
      { status: 404, headers: CORS_HEADERS },
    );
  }

  if (format === "svg") {
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        ...CORS_HEADERS,
        ...CACHE_HEADERS,
      },
    });
  }

  if (format === "json") {
    return NextResponse.json(
      {
        name: slug,
        viewBox: extractViewBox(svg),
        paths: extractPaths(svg),
        monochrome: isMonochrome(svg),
        svg,
      },
      { headers: { ...CORS_HEADERS, ...CACHE_HEADERS } },
    );
  }

  if (format === "dataurl") {
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
    return new NextResponse(dataUrl, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        ...CORS_HEADERS,
        ...CACHE_HEADERS,
      },
    });
  }

  return NextResponse.json(
    { error: `Unsupported format "${format}". Use svg, json, or dataurl.` },
    { status: 400, headers: CORS_HEADERS },
  );
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
