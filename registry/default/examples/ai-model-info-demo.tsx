"use client";

import {
  AiModelInfo,
  AiModelInfoBadge,
  AiModelInfoCapabilities,
  AiModelInfoHeader,
  AiModelInfoMeta,
  AiModelInfoPricing,
  type ModelInfo,
} from "@/registry/default/blocks/ai/ai-model-info/components/elements/ai-model-info";

const gpt4o: ModelInfo = {
  id: "gpt-4o-2024-08-06",
  name: "GPT-4o",
  provider: "OpenAI",
  contextWindow: 128000,
  capabilities: ["vision", "tools", "streaming", "json", "functions"],
  inputPrice: 2.5,
  outputPrice: 10,
  releaseDate: new Date("2024-08-06"),
};

const claudeSonnet: ModelInfo = {
  id: "claude-sonnet-4-20250514",
  name: "Claude Sonnet 4",
  provider: "Anthropic",
  contextWindow: 200000,
  capabilities: ["vision", "tools", "streaming"],
  inputPrice: 3,
  outputPrice: 15,
};

export default function AiModelInfoDemo() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <AiModelInfo model={gpt4o}>
        <AiModelInfoHeader />
        <AiModelInfoCapabilities />
        <AiModelInfoPricing />
        <AiModelInfoMeta />
      </AiModelInfo>

      <AiModelInfo model={claudeSonnet}>
        <AiModelInfoHeader />
        <AiModelInfoPricing />
      </AiModelInfo>

      <AiModelInfo model={claudeSonnet}>
        <AiModelInfoBadge />
      </AiModelInfo>
    </div>
  );
}
