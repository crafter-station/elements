"use client";

import type { RosterAgent } from "@/registry/default/blocks/ai/ai-agent-roster/components/elements/ai-agent-roster";
import { AiAgentRoster } from "@/registry/default/blocks/ai/ai-agent-roster/components/elements/ai-agent-roster";

const DEMO_AGENTS: RosterAgent[] = [
  {
    id: "research",
    name: "Research Agent",
    description:
      "Searches the web, reads documentation, and gathers information",
    status: "active",
    matchOn: ["Web Search", "Document Reading", "Summarization"],
  },
  {
    id: "code",
    name: "Code Agent",
    description:
      "Writes, reviews, and refactors code across multiple languages",
    status: "busy",
    model: "claude-sonnet-4-20250514",
    matchOn: ["Code Generation", "Debugging", "Refactoring"],
  },
  {
    id: "planning",
    name: "Planning Agent",
    description: "Breaks down complex tasks and creates execution plans",
    status: "active",
    matchOn: ["Task Decomposition", "Scheduling", "Prioritization"],
  },
  {
    id: "review",
    name: "Review Agent",
    description: "Reviews code, content, and plans for quality assurance",
    status: "idle",
    matchOn: ["Code Review", "Content Review", "Security Audit"],
  },
  {
    id: "data",
    name: "Data Agent",
    description:
      "Analyzes data, generates insights, and creates visualizations",
    status: "offline",
    matchOn: ["Data Analysis", "Visualization", "Reporting"],
  },
];

export default function AiAgentRosterDemo() {
  return (
    <AiAgentRoster
      agents={DEMO_AGENTS}
      layout="grid"
      className="w-full max-w-2xl"
    />
  );
}
