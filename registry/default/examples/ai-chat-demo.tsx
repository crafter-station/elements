"use client";

import {
  AiChat,
  AiChatBody,
  AiChatFooter,
  AiChatHeader,
} from "@/registry/default/blocks/ai/ai-chat/components/elements/ai-chat";

export default function AiChatDemo() {
  return (
    <div className="h-[400px] w-full overflow-hidden rounded-lg border">
      <AiChat status="ready" className="h-full">
        <AiChatHeader>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">Ready</span>
          </div>
        </AiChatHeader>
        <AiChatBody>
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Messages go here
          </div>
        </AiChatBody>
        <AiChatFooter>
          <div className="text-xs text-muted-foreground">
            Input controls go here
          </div>
        </AiChatFooter>
      </AiChat>
    </div>
  );
}
