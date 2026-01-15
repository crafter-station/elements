"use client";

import {
  AiTokenViewer,
  AiTokenViewerBreakdown,
  AiTokenViewerCost,
  AiTokenViewerHeader,
  AiTokenViewerStats,
  type Token,
} from "@/registry/default/blocks/ai/ai-token-viewer/components/elements/ai-token-viewer";

const tokens: Token[] = [
  { text: "You", type: "text" },
  { text: " are", type: "text" },
  { text: " a", type: "text" },
  { text: " helpful", type: "text" },
  { text: " assistant", type: "text" },
  { text: ".", type: "text" },
  { text: "\n", type: "control" },
  { text: "<|system|>", type: "special" },
  { text: " Answer", type: "text" },
  { text: " questions", type: "text" },
  { text: " concisely", type: "text" },
  { text: ".", type: "text" },
];

export default function AiTokenViewerDemo() {
  return (
    <AiTokenViewer
      tokens={tokens}
      inputTokens={1250}
      outputTokens={3840}
      model="gpt-4o"
      showCost
      className="w-full max-w-md"
    >
      <AiTokenViewerHeader />
      <AiTokenViewerStats />
      <AiTokenViewerCost />
      <AiTokenViewerBreakdown />
    </AiTokenViewer>
  );
}
