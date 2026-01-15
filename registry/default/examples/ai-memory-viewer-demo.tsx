"use client";

import {
  AiMemoryViewer,
  AiMemoryViewerCompact,
  AiMemoryViewerContent,
  AiMemoryViewerHeader,
  AiMemoryViewerSearch,
  type MemoryItem,
} from "@/registry/default/blocks/ai/ai-memory-viewer/components/elements/ai-memory-viewer";

const workingMemory: MemoryItem[] = [
  {
    id: "1",
    content: "User prefers TypeScript over JavaScript",
    type: "working",
    source: "conversation",
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "2",
    content: "Current project uses Next.js 15 with App Router",
    type: "working",
    source: "system",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
];

const conversationHistory: MemoryItem[] = [
  {
    id: "3",
    content: "User is a senior developer at Clerk",
    type: "history",
    source: "user",
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: "4",
    content: "Prefers Tailwind CSS for styling",
    type: "history",
    source: "conversation",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    content: "Uses Bun as package manager",
    type: "history",
    source: "system",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

export default function AiMemoryViewerDemo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <AiMemoryViewer
        workingMemory={workingMemory}
        conversationHistory={conversationHistory}
        onRemove={(id) => console.log("Remove:", id)}
        onAdd={(content, type) => console.log("Add:", content, type)}
      >
        <AiMemoryViewerHeader title="Agent Memory" />
        <AiMemoryViewerSearch placeholder="Search memories..." />
        <AiMemoryViewerContent />
      </AiMemoryViewer>

      <AiMemoryViewerCompact
        workingMemory={workingMemory}
        conversationHistory={conversationHistory}
      />
    </div>
  );
}
