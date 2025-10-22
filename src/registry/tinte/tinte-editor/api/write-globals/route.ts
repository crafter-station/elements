import { writeFile } from "fs/promises";

import { NextResponse } from "next/server";

import { getCssPath } from "@/lib/elements/tinte/get-css-path";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (typeof content !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid content" },
        { status: 400 },
      );
    }

    const globalsPath = await getCssPath();
    await writeFile(globalsPath, content, "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing globals.css:", error);
    return NextResponse.json(
      { success: false, error: "Failed to write globals.css" },
      { status: 500 },
    );
  }
}
