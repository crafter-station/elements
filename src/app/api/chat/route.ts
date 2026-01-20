import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";

export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    messages,
    model = "openai/gpt-4o-mini",
    temperature = 0.7,
  } = await request.json();

  console.log("[API] Model:", model, "Temperature:", temperature);

  const modelMessages = convertToModelMessages(messages as UIMessage[]);

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const result = streamText({
        model,
        messages: modelMessages,
        temperature,
      });

      writer.merge(result.toUIMessageStream({ sendReasoning: true }));
    },
  });

  return createUIMessageStreamResponse({ stream });
}
