"use client";

import {
  AiRequestInspector,
  AiRequestInspectorHeader,
  AiRequestInspectorRequest,
  AiRequestInspectorResponse,
} from "@/registry/default/blocks/ai/ai-request-inspector/components/elements/ai-request-inspector";

const request = {
  url: "https://api.openai.com/v1/chat/completions",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer sk-...",
  },
  body: {
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: "Explain quantum computing in simple terms.",
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  },
};

const response = {
  status: 200,
  headers: {
    "Content-Type": "application/json",
    "x-request-id": "req_abc123",
  },
  body: {
    id: "chatcmpl-abc123",
    object: "chat.completion",
    model: "gpt-4o-2024-08-06",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content:
            "Quantum computing uses quantum bits (qubits) that can exist in multiple states simultaneously...",
        },
        finish_reason: "stop",
      },
    ],
    usage: { prompt_tokens: 28, completion_tokens: 156, total_tokens: 184 },
  },
};

export default function AiRequestInspectorDemo() {
  return (
    <AiRequestInspector
      request={request}
      response={response}
      timestamp={new Date()}
      duration={1250}
      className="w-full max-w-2xl"
    >
      <AiRequestInspectorHeader />
      <AiRequestInspectorRequest />
      <AiRequestInspectorResponse />
    </AiRequestInspector>
  );
}
