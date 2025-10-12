import type { NextRequest } from "next/server";

export const maxDuration = 30;

/**
 * Proxy route to fetch public themes from tinte.dev
 * GET /api/tinte/themes?limit=20&page=1
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") || "20";
    const page = searchParams.get("page") || "1";

    // Fetch from Tinte production API
    const response = await fetch(
      `https://tinte.dev/api/themes/public?limit=${limit}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Cache for 5 minutes
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      throw new Error(`Tinte API error: ${response.status}`);
    }

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching Tinte themes:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch themes",
        themes: [],
        pagination: { page: 1, limit: 20, total: 0, hasMore: false },
      },
      { status: 500 },
    );
  }
}
