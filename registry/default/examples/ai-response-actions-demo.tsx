"use client";

import { AiResponseActions } from "@/registry/default/blocks/ai/ai-response-actions/components/elements/ai-response-actions";

export default function AiResponseActionsDemo() {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <AiResponseActions
        content="This is an AI-generated response that can be copied, regenerated, or rated."
        onRegenerate={() => console.log("Regenerate clicked")}
        onFeedback={(type) => console.log("Feedback:", type)}
      />
      <AiResponseActions
        content="Compact version"
        compact
        onRegenerate={() => console.log("Regenerate clicked")}
      />
    </div>
  );
}
