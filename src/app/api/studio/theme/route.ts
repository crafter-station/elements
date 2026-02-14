import { NextResponse } from "next/server";
import { convertTinteToShadcn } from "@/lib/tinte-to-shadcn";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { light, dark, fonts, radius, shadows } = body;

    if (!light || !dark) {
      return NextResponse.json(
        { error: "light and dark theme blocks are required" },
        { status: 400 },
      );
    }

    const result = convertTinteToShadcn({ light, dark, fonts, radius, shadows });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to convert theme" },
      { status: 500 },
    );
  }
}
