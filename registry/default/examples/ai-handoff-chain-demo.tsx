"use client";

import {
  AiHandoffChain,
  AiHandoffChainDetail,
  AiHandoffChainTimeline,
  type Handoff,
} from "@/registry/default/blocks/ai/ai-handoff-chain/components/elements/ai-handoff-chain";

const handoffs: Handoff[] = [
  {
    id: "1",
    fromAgent: "Router",
    toAgent: "Planner",
    reason: "Task requires code implementation",
    timestamp: new Date(Date.now() - 35000),
  },
  {
    id: "2",
    fromAgent: "Planner",
    toAgent: "Researcher",
    reason: "Breaking down into subtasks",
    timestamp: new Date(Date.now() - 33000),
  },
  {
    id: "3",
    fromAgent: "Researcher",
    toAgent: "Coder",
    reason: "Gathering API documentation",
    timestamp: new Date(Date.now() - 24000),
  },
  {
    id: "4",
    fromAgent: "Coder",
    toAgent: "Reviewer",
    reason: "Implementing solution",
    timestamp: new Date(Date.now() - 1000),
    isActive: true,
  },
];

export default function AiHandoffChainDemo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <AiHandoffChain handoffs={handoffs}>
        <AiHandoffChainDetail />
      </AiHandoffChain>

      <AiHandoffChain handoffs={handoffs}>
        <AiHandoffChainTimeline />
      </AiHandoffChain>
    </div>
  );
}
