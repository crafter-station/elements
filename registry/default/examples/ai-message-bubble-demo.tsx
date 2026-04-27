"use client";

import { AiMessageBubble } from "@/registry/default/blocks/ai/ai-message-bubble/components/elements/ai-message-bubble";

export default function AiMessageBubbleDemo() {
  const userMessage = { role: "user" as const };
  const assistantMessage = { role: "assistant" as const };

  return (
    <div className="w-full max-w-xl space-y-4 p-4">
      <AiMessageBubble
        {...userMessage}
        content="How do I implement authentication with Clerk?"
      />
      <AiMessageBubble
        {...assistantMessage}
        content="To implement authentication with Clerk, you'll need to install the SDK, wrap your app with ClerkProvider, and use the SignIn/SignUp components."
      />
    </div>
  );
}
