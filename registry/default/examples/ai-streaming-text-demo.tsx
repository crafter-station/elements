"use client";

import { AiStreamingText } from "@/registry/default/blocks/ai/ai-streaming-text/components/elements/ai-streaming-text";

export default function AiStreamingTextDemo() {
  return (
    <div className="w-full max-w-xl p-4">
      <AiStreamingText
        text="This text will stream in character by character, simulating an AI response being generated in real-time."
        speed={30}
        showCursor
      />
    </div>
  );
}
