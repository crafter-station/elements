"use client";

import {
  AiToolInspector,
  AiToolInspectorHeader,
  AiToolInspectorList,
  type ToolExecution,
} from "@/registry/default/blocks/ai/ai-tool-inspector/components/elements/ai-tool-inspector";

const tools: ToolExecution[] = [
  {
    id: "1",
    name: "search_web",
    description: "Searches the web for relevant information",
    status: "success",
    input: { query: "latest AI news 2024", limit: 5 },
    output: {
      results: [
        { title: "OpenAI announces GPT-5", url: "https://..." },
        { title: "Anthropic releases Claude 4", url: "https://..." },
      ],
    },
    startTime: new Date(Date.now() - 1240),
    endTime: new Date(),
  },
  {
    id: "2",
    name: "get_weather",
    status: "success",
    input: { location: "San Francisco, CA" },
    output: { temp: 68, condition: "Sunny", humidity: 45 },
    startTime: new Date(Date.now() - 320),
    endTime: new Date(),
  },
  {
    id: "3",
    name: "database_query",
    status: "error",
    input: { table: "users", filter: { active: true } },
    error: "PERMISSION_DENIED: Insufficient permissions",
    startTime: new Date(Date.now() - 89),
    endTime: new Date(),
  },
];

export default function AiToolInspectorDemo() {
  return (
    <AiToolInspector
      tools={tools}
      defaultExpandedIds={["1"]}
      className="w-full max-w-xl"
    >
      <AiToolInspectorHeader />
      <AiToolInspectorList />
    </AiToolInspector>
  );
}
