"use client";

import {
  AiPipeline,
  AiPipelineCompact,
  AiPipelineContent,
  AiPipelineHeader,
  type PipelineStage,
} from "@/registry/default/blocks/ai/ai-pipeline/components/elements/ai-pipeline";

const stages: PipelineStage[] = [
  {
    id: "parse",
    name: "Parse",
    description: "Parsing source code files",
    status: "completed",
    startTime: new Date(Date.now() - 5000),
    endTime: new Date(Date.now() - 4550),
  },
  {
    id: "analyze",
    name: "Analyze",
    description: "Analyzing code structure and patterns",
    status: "completed",
    startTime: new Date(Date.now() - 4500),
    endTime: new Date(Date.now() - 2400),
  },
  {
    id: "review",
    name: "Review",
    description: "Reviewing code quality and best practices",
    status: "completed",
    agent: "CodeReviewer",
    startTime: new Date(Date.now() - 2300),
    endTime: new Date(Date.now() - 1100),
  },
  {
    id: "suggest",
    name: "Suggest",
    description: "Generating improvement suggestions",
    status: "active",
    agent: "SuggestionAgent",
    startTime: new Date(Date.now() - 1000),
  },
  {
    id: "report",
    name: "Report",
    description: "Generating final report",
    status: "pending",
  },
];

const compactStages: PipelineStage[] = [
  { id: "input", name: "Input", status: "completed" },
  { id: "process", name: "Process", status: "completed" },
  { id: "transform", name: "Transform", status: "active" },
  { id: "output", name: "Output", status: "pending" },
];

export default function AiPipelineDemo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <AiPipeline stages={stages} className="w-full">
        <AiPipelineHeader title="Code Review Pipeline" />
        <AiPipelineContent />
      </AiPipeline>

      <AiPipelineCompact stages={compactStages} />
    </div>
  );
}
