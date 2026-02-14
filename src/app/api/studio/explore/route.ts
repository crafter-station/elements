import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { message: "URL is required and must be a string" },
        { status: 400 },
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { message: "Invalid URL format" },
        { status: 400 },
      );
    }

    if (parsedUrl.protocol !== "https:") {
      return NextResponse.json(
        { message: "Only HTTPS URLs are allowed" },
        { status: 400 },
      );
    }

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Elements Registry Studio/1.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          message: `Failed to fetch: ${response.status} ${response.statusText}`,
        },
        { status: 502 },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Registry fetch error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to fetch registry",
      },
      { status: 502 },
    );
  }
}
