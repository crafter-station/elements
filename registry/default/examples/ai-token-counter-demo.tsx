"use client";

import { AiTokenCounter } from "@/registry/default/blocks/ai/ai-token-counter/components/elements/ai-token-counter";

export default function AiTokenCounterDemo() {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <AiTokenCounter
        tokens={2500}
        maxTokens={4096}
        model="gpt-4"
        showProgress
      />
      <AiTokenCounter
        tokens={3800}
        maxTokens={4096}
        model="gpt-4"
        showProgress
      />
      <AiTokenCounter
        tokens={4000}
        maxTokens={4096}
        model="gpt-4"
        showProgress
      />
    </div>
  );
}
