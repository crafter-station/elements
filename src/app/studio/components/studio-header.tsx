"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AiModelSelector } from "@/registry/default/blocks/ai/ai-model-selector/components/elements/ai-model-selector";

interface StudioHeaderProps {
  model: string;
  onModelChange: (model: string) => void;
  onClear: () => void;
  hasMessages: boolean;
}

export function StudioHeader({
  model,
  onModelChange,
  onClear,
  hasMessages,
}: StudioHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <h2 className="text-sm font-semibold">Elements Studio</h2>

      <div className="flex items-center gap-2">
        <AiModelSelector
          value={model}
          onValueChange={onModelChange}
          className="w-[200px] h-9"
        />

        {hasMessages && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2"
            onClick={onClear}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
