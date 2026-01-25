"use client";

import { AiSuggestedActions } from "@/registry/default/blocks/ai/ai-suggested-actions/components/elements/ai-suggested-actions";

const suggestions = [
  {
    label: "Explain this code",
    prompt: "Can you explain how this code works?",
  },
  {
    label: "Fix the bug",
    prompt: "There's a bug in my code. Can you help fix it?",
  },
  {
    label: "Write tests",
    prompt: "Can you write unit tests for this function?",
  },
  {
    label: "Optimize performance",
    prompt: "How can I optimize this code for better performance?",
  },
];

export default function AiSuggestedActionsDemo() {
  return (
    <div className="w-full max-w-xl p-4">
      <AiSuggestedActions
        suggestions={suggestions}
        onSelect={(prompt) => console.log("Selected:", prompt)}
      />
    </div>
  );
}
