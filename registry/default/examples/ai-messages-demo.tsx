"use client";

import { AiMessages } from "@/registry/default/blocks/ai/ai-messages/components/elements/ai-messages";

const sampleMessages = [
  { id: "1", role: "user", content: "Hello, how can you help me today?" },
  {
    id: "2",
    role: "assistant",
    content:
      "Hi! I'm an AI assistant. I can help you with coding questions, writing, analysis, and much more. What would you like to work on?",
  },
  { id: "3", role: "user", content: "Can you explain React hooks?" },
  {
    id: "4",
    role: "assistant",
    content:
      "React hooks are functions that let you use state and other React features in functional components. The most common hooks are useState for managing state, useEffect for side effects, and useContext for accessing context values.",
  },
  { id: "5", role: "user", content: "What about custom hooks?" },
  {
    id: "6",
    role: "assistant",
    content:
      "Custom hooks are functions that start with 'use' and can call other hooks. They let you extract component logic into reusable functions. For example, you could create a useLocalStorage hook to persist state to localStorage.",
  },
];

export default function AiMessagesDemo() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg border">
      <AiMessages>
        {sampleMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </AiMessages>
    </div>
  );
}
