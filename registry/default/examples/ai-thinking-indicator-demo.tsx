"use client";

import { AiThinkingIndicator } from "@/registry/default/blocks/ai/ai-thinking-indicator/components/elements/ai-thinking-indicator";

export default function AiThinkingIndicatorDemo() {
  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <AiThinkingIndicator variant="dots" message="Thinking" />
      <AiThinkingIndicator variant="pulse" message="Processing" />
      <AiThinkingIndicator variant="sparkles" message="Generating" />
    </div>
  );
}
