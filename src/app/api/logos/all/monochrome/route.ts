import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { NextResponse } from "next/server";

const SVG_DIR = join(process.cwd(), "public/r/svg");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
};

/**
 * Only the logos that carry no hardcoded colors, so a consumer can recolor them
 * through `currentColor`.
 *
 * Built at registry-build time. The CDN-direct equivalent is
 * /r/svg/all-monochrome.json.
 */
export async function GET() {
  const body = await readFile(join(SVG_DIR, "all-monochrome.json"), "utf-8");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
      ...CACHE_HEADERS,
    },
  });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
