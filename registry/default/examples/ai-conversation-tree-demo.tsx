"use client";

import type { ConversationNode } from "@/registry/default/blocks/ai/ai-conversation-tree/components/elements/ai-conversation-tree";
import { AiConversationTree } from "@/registry/default/blocks/ai/ai-conversation-tree/components/elements/ai-conversation-tree";

const DEMO_NODES: ConversationNode[] = [
  {
    id: "1",
    type: "user",
    content: "How do I implement auth?",
    isActive: true,
    children: [
      {
        id: "2",
        type: "assistant",
        content:
          "There are several approaches to implementing authentication. You could use OAuth, JWT, or session-based auth...",
        isActive: true,
        children: [
          {
            id: "3",
            type: "user",
            content: "What about OAuth?",
          },
          {
            id: "4",
            type: "user",
            content: "Tell me about JWT",
            isActive: true,
            children: [
              {
                id: "5",
                type: "assistant",
                content:
                  "JWT (JSON Web Tokens) are a compact, URL-safe means of representing claims between two parties...",
                isActive: true,
              },
            ],
          },
          {
            id: "6",
            type: "user",
            content: "Session-based auth?",
          },
        ],
      },
    ],
  },
];

export default function AiConversationTreeDemo() {
  return (
    <AiConversationTree
      nodes={DEMO_NODES}
      activeNodeId="5"
      defaultExpandAll
      className="w-full max-w-lg"
    />
  );
}
