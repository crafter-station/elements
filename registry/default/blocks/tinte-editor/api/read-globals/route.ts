import { readFile } from "fs/promises";

import { NextResponse } from "next/server";

import { getCssPath } from "@/registry/default/blocks/tinte-editor/lib/get-css-path";

export async function GET() {
  try {
    const globalsPath = await getCssPath();
    const content = await readFile(globalsPath, "utf-8");

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Error reading globals.css:", error);
    return NextResponse.json(
      { success: false, error: "Failed to read globals.css" },
      { status: 500 },
    );
  }
}
