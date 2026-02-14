import { auth } from "@clerk/nextjs/server";
import { generateObject } from "ai";
import { z } from "zod";
import { extractImports } from "@/app/studio/lib/code-parser";

const registryMetadataSchema = z.object({
  name: z.string().describe("Kebab-case component name"),
  type: z
    .enum([
      "registry:lib",
      "registry:block",
      "registry:component",
      "registry:ui",
      "registry:hook",
      "registry:page",
      "registry:file",
    ])
    .describe("Component type based on its nature"),
  title: z.string().describe("Human-readable title"),
  description: z.string().describe("Concise description of the component"),
  docs: z.string().describe("Markdown usage documentation"),
  dependencies: z.array(z.string()).describe("NPM package dependencies"),
  registryDependencies: z
    .array(z.string())
    .describe("Shadcn/ui component dependencies"),
  categories: z.array(z.string()).describe("Relevant category tags"),
});

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code, fileName, suggestedType } = await req.json();

    if (!code || typeof code !== "string") {
      return Response.json({ error: "Invalid code provided" }, { status: 400 });
    }

    const extractedImports = extractImports(code);

    const systemPrompt = `You are a shadcn/ui registry metadata generator. Analyze React/TypeScript component code and generate appropriate registry metadata.

Your task:
1. Detect component type (ui: base primitives, component: reusable components, block: composite UI sections, hook: React hooks, lib: utilities, page: full pages, file: arbitrary files)
2. Suggest a kebab-case name based on the component name or file name
3. Write a concise 1-2 sentence description
4. Generate markdown usage documentation with import examples and basic usage
5. Identify NPM dependencies from imports (exclude React, Next.js built-ins, and local imports)
6. Identify shadcn/ui registry dependencies (common ones: button, card, input, label, select, dialog, etc.)
7. Suggest 2-4 relevant categories (e.g., "forms", "navigation", "data-display", "feedback", "layout")

Be precise and practical. Focus on what developers need to use this component effectively.`;

    const userPrompt = `Analyze this ${fileName ? `component from ${fileName}` : "component"}:

\`\`\`tsx
${code}
\`\`\`

Detected imports: ${extractedImports.join(", ") || "none"}
${suggestedType ? `Suggested type: ${suggestedType}` : ""}`;

    const { object } = await generateObject({
      model: "anthropic/claude-sonnet-4.5",
      schema: registryMetadataSchema,
      system: systemPrompt,
      prompt: userPrompt,
    });

    return Response.json(object);
  } catch (error) {
    console.error("Generation error:", error);
    return Response.json(
      { error: "Failed to generate metadata" },
      { status: 500 },
    );
  }
}
