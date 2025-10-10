import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const globalsPath = join(process.cwd(), "app", "globals.css");
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
