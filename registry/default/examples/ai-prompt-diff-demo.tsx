"use client";

import {
  AiPromptDiff,
  AiPromptDiffContent,
  AiPromptDiffCopyButton,
  AiPromptDiffHeader,
  AiPromptDiffViewToggle,
} from "@/registry/default/blocks/ai/ai-prompt-diff/components/elements/ai-prompt-diff";

const beforePrompt = `You are a helpful assistant.
Answer questions concisely.
Be friendly and professional.`;

const afterPrompt = `You are a senior software engineer assistant.
Answer questions with code examples when relevant.
Be friendly, professional, and thorough.
Always explain your reasoning.`;

export default function AiPromptDiffDemo() {
  return (
    <AiPromptDiff
      before={beforePrompt}
      after={afterPrompt}
      className="w-full max-w-2xl"
    >
      <AiPromptDiffHeader title="Prompt Changes" />
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <AiPromptDiffViewToggle />
        <AiPromptDiffCopyButton variant="after" />
      </div>
      <AiPromptDiffContent />
    </AiPromptDiff>
  );
}
