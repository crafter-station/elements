"use client";

import { AiAgentContext } from "@/registry/default/blocks/ai/ai-agent-context/components/elements/ai-agent-context";

const DEMO_CONTEXT = {
  user: {
    name: "Hunter",
    role: "AI Software Engineer",
    company: "Clerk",
  },
  project: {
    name: "elements",
    framework: "Next.js 15",
    language: "TypeScript",
  },
  preferences: {
    style: "Concise, no emojis",
    packageManager: "Bun",
  },
};

export default function AiAgentContextDemo() {
  return (
    <AiAgentContext
      context={DEMO_CONTEXT}
      title="Session Context"
      className="w-full max-w-md"
    />
  );
}
