"use client";

import { AiMessageBubble } from "@/registry/default/blocks/ai/ai-message-bubble/components/elements/ai-message-bubble";

export default function AiMessageBubbleDemo() {
  return (
    <div className="w-full max-w-xl space-y-4 p-4">
      <AiMessageBubble
        role="user"
        content="How do I implement authentication with Clerk?"
      />
      <AiMessageBubble
        role="assistant"
        content="To implement authentication with Clerk, you'll need to install the SDK, wrap your app with ClerkProvider, and use the SignIn/SignUp components."
      />
    </div>
  );
}
