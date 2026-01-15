"use client";

import {
  AiToolCall,
  AiToolCallContent,
  AiToolCallError,
  AiToolCallHeader,
  AiToolCallInput,
  AiToolCallOutput,
} from "@/registry/default/blocks/ai/ai-tool-call/components/elements/ai-tool-call";

export default function AiToolCallDemo() {
  return (
    <div className="w-full max-w-xl space-y-4 p-4">
      <AiToolCall name="search_web" state="completed" defaultOpen>
        <AiToolCallHeader />
        <AiToolCallContent>
          <AiToolCallInput input={{ query: "React best practices 2025" }} />
          <AiToolCallOutput>
            <div className="text-sm">
              Found 5 relevant articles about React best practices.
            </div>
          </AiToolCallOutput>
        </AiToolCallContent>
      </AiToolCall>

      <AiToolCall name="create_file" state="running">
        <AiToolCallHeader />
      </AiToolCall>

      <AiToolCall name="delete_database" state="awaiting-approval">
        <AiToolCallHeader />
      </AiToolCall>

      <AiToolCall name="api_request" state="error" defaultOpen>
        <AiToolCallHeader />
        <AiToolCallContent>
          <AiToolCallInput input={{ url: "https://api.example.com/data" }} />
          <AiToolCallError error="Connection timeout after 30s" />
        </AiToolCallContent>
      </AiToolCall>
    </div>
  );
}
