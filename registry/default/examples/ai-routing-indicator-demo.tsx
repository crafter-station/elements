"use client";

import {
  AiRoutingIndicator,
  AiRoutingIndicatorContent,
  AiRoutingIndicatorHeader,
} from "@/registry/default/blocks/ai/ai-routing-indicator/components/elements/ai-routing-indicator";

export default function AiRoutingIndicatorDemo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <AiRoutingIndicator
        input="Help me write a React component for user authentication"
        matchedPattern="write|React|authentication"
        targetAgent="Code Agent"
        confidence={0.92}
      >
        <AiRoutingIndicatorHeader>Agent Routing</AiRoutingIndicatorHeader>
        <AiRoutingIndicatorContent
          input="Help me write a React component for user authentication"
          matchedPattern="write|React|authentication"
          targetAgent="Code Agent"
          confidence={0.92}
        />
      </AiRoutingIndicator>

      <AiRoutingIndicator input="What is the weather like today?" isRouting>
        <AiRoutingIndicatorHeader isRouting>
          Agent Routing
        </AiRoutingIndicatorHeader>
        <AiRoutingIndicatorContent
          input="What is the weather like today?"
          isRouting
        />
      </AiRoutingIndicator>
    </div>
  );
}
