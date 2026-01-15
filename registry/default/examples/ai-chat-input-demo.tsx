"use client";

import { AiChatInput } from "@/registry/default/blocks/ai/ai-chat-input/components/elements/ai-chat-input";

export default function AiChatInputDemo() {
  return (
    <div className="w-full max-w-xl p-4">
      <AiChatInput
        onSubmit={(message) => console.log("Submitted:", message)}
        placeholder="Type a message..."
      />
    </div>
  );
}
