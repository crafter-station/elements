import { auth } from "@clerk/nextjs/server";
import { generateObject } from "ai";
import { z } from "zod";

const suggestedComponentsSchema = z.object({
  registryName: z.string().describe("Kebab-case registry name"),
  description: z.string().describe("One-sentence registry description"),
  components: z.array(
    z.object({
      name: z.string().describe("Kebab-case component name"),
      type: z
        .enum([
          "registry:lib",
          "registry:block",
          "registry:component",
          "registry:ui",
          "registry:hook",
          "registry:page",
        ])
        .describe("Component type"),
    }),
  ),
});

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { description } = await req.json();

    if (!description || typeof description !== "string") {
      return Response.json(
        { error: "Description is required" },
        { status: 400 },
      );
    }

    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: suggestedComponentsSchema,
      system: `You are a shadcn/ui registry architect. Given a user's description of what they want to build, suggest a registry name and a list of components.

Rules:
- Registry name: kebab-case, concise (e.g. "saas-form-kit", "dashboard-charts", "auth-components")
- Component names: kebab-case, specific and descriptive (e.g. "metric-card", "date-range-picker", "animated-counter")
- Types: use registry:ui for base primitives (button, input), registry:component for reusable components, registry:block for composite sections (hero, footer), registry:hook for React hooks (use- prefix), registry:lib for utilities
- Suggest 3-8 components that make sense together
- Be creative but practical - suggest components a developer would actually need
- If the description is vague, infer a reasonable set of components based on the domain`,
      prompt: description,
    });

    return Response.json(object);
  } catch (error) {
    console.error("Suggest components error:", error);
    return Response.json(
      { error: "Failed to suggest components" },
      { status: 500 },
    );
  }
}
