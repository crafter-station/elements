import { streamText } from "ai";

import { generateSystemPrompt } from "@/app/studio/lib/elements-registry";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, model = "openai/gpt-4o" } = await req.json();

  const result = streamText({
    model,
    system: generateSystemPrompt(),
    messages,
  });

  return result.toUIMessageStreamResponse();
}
