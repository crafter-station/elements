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
 * Every logo in one response, so a client can hydrate a whole catalog with a
 * single request instead of one per logo.
 *
 * The payload is built at registry-build time; this reads one prepared file
 * rather than re-reading every logo per request. Clients that can hit the CDN
 * directly should prefer /r/svg/all.json, which never invokes a function.
 *
 * For only the recolorable subset, use /api/logos/all/monochrome.
 */
export async function GET() {
  const body = await readFile(join(SVG_DIR, "all.json"), "utf-8");

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
