"use client";

import { AiAgentStatus } from "@/registry/default/blocks/ai/ai-agent-status/components/elements/ai-agent-status";

export default function AiAgentStatusDemo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-wrap gap-2">
        <AiAgentStatus agent={{ name: "Planner" }} status="idle" />
        <AiAgentStatus agent={{ name: "Researcher" }} status="thinking" />
        <AiAgentStatus agent={{ name: "Coder" }} status="acting" />
        <AiAgentStatus agent={{ name: "Reviewer" }} status="waiting" />
        <AiAgentStatus agent={{ name: "Summarizer" }} status="done" />
        <AiAgentStatus
          agent={{ name: "Router" }}
          status="handoff"
          handoffTo="Specialist"
        />
      </div>

      <AiAgentStatus
        agent={{
          name: "Research Agent",
          description:
            "Analyzing search results and extracting relevant information...",
        }}
        status="thinking"
        variant="card"
      />

      <AiAgentStatus
        agent={{
          name: "Code Agent",
          description: "Writing implementation for auth middleware",
        }}
        status="acting"
        variant="card"
      />
    </div>
  );
}
