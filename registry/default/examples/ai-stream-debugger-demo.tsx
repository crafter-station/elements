"use client";

import { useEffect, useState } from "react";

import {
  AiStreamDebugger,
  AiStreamDebuggerContent,
  AiStreamDebuggerHeader,
  type StreamChunk,
} from "@/registry/default/blocks/ai/ai-stream-debugger/components/elements/ai-stream-debugger";

const mockChunksData = [
  { content: "Quantum", type: "text" as const },
  { content: " computing", type: "text" as const },
  { content: " uses", type: "text" as const },
  { content: " qubits", type: "text" as const },
  { content: " that", type: "text" as const },
  { content: " can", type: "text" as const },
  { content: " exist", type: "text" as const },
  { content: " in", type: "text" as const },
  { content: " multiple", type: "text" as const },
  { content: " states", type: "text" as const },
  { content: "", type: "finish" as const },
];

export default function AiStreamDebuggerDemo() {
  const [chunks, setChunks] = useState<StreamChunk[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    let index = 0;
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (index < mockChunksData.length) {
        const chunkData = mockChunksData[index];
        setChunks((prev) => [
          ...prev,
          {
            id: String(index),
            type: chunkData.type,
            content: chunkData.content,
            timestamp: new Date(startTime + index * 150),
          },
        ]);
        index++;
      } else {
        setIsStreaming(false);
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <AiStreamDebugger
      chunks={chunks}
      isStreaming={isStreaming}
      autoScroll
      onClear={() => setChunks([])}
      className="w-full max-w-xl"
    >
      <AiStreamDebuggerHeader title="Stream Debugger" />
      <AiStreamDebuggerContent />
    </AiStreamDebugger>
  );
}
