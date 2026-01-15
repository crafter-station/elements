"use client";

import * as React from "react";

import {
  AiReasoning,
  AiReasoningContent,
  AiReasoningText,
  AiReasoningTrigger,
} from "@/registry/default/blocks/ai/ai-reasoning/components/elements/ai-reasoning";

export default function AiReasoningDemo() {
  const [isStreaming, setIsStreaming] = React.useState(false);

  return (
    <div className="w-full max-w-xl space-y-4 p-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsStreaming(!isStreaming)}
          className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md"
        >
          {isStreaming ? "Stop Streaming" : "Start Streaming"}
        </button>
      </div>

      <AiReasoning
        isStreaming={isStreaming}
        thinkingDuration={isStreaming ? undefined : 4.2}
      >
        <AiReasoningTrigger />
        <AiReasoningContent>
          <AiReasoningText>
            Let me analyze this step by step. First, I need to understand the
            current authentication flow. The user wants to add Clerk to their
            Next.js application. I should consider: 1. The existing routing
            structure 2. Protected vs public routes 3. Session management needs
            Based on this, I'll recommend using the middleware approach for
            protecting routes, which provides the best balance of security and
            developer experience.
          </AiReasoningText>
        </AiReasoningContent>
      </AiReasoning>

      <AiReasoning thinkingDuration={2.8} defaultOpen>
        <AiReasoningTrigger />
        <AiReasoningContent>
          <AiReasoningText>
            Quick analysis: This is a simple refactoring task. The function can
            be simplified by using Array.reduce instead of the for loop.
          </AiReasoningText>
        </AiReasoningContent>
      </AiReasoning>
    </div>
  );
}
