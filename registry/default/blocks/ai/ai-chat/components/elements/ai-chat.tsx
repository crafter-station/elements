"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface AiChatContextValue {
  status: "ready" | "submitted" | "streaming" | "error";
}

const AiChatContext = React.createContext<AiChatContextValue | null>(null);

function useChatContext() {
  const context = React.useContext(AiChatContext);
  if (!context) {
    throw new Error("AiChat components must be used within <AiChat>");
  }
  return context;
}

interface AiChatProps {
  status?: "ready" | "submitted" | "streaming" | "error";
  children?: React.ReactNode;
  className?: string;
}

function AiChat({ status = "ready", children, className }: AiChatProps) {
  const contextValue = React.useMemo(() => ({ status }), [status]);

  return (
    <AiChatContext.Provider value={contextValue}>
      <div
        data-slot="ai-chat"
        className={cn("flex h-dvh flex-col bg-background font-mono", className)}
      >
        {children}
      </div>
    </AiChatContext.Provider>
  );
}

interface AiChatHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

function AiChatHeader({ children, className }: AiChatHeaderProps) {
  return (
    <div
      data-slot="ai-chat-header"
      className={cn(
        "flex items-center justify-between border-b px-4 py-3",
        className
      )}
    >
      {children}
    </div>
  );
}

interface AiChatBodyProps {
  children?: React.ReactNode;
  className?: string;
}

function AiChatBody({ children, className }: AiChatBodyProps) {
  return (
    <div
      data-slot="ai-chat-body"
      className={cn("relative flex-1 overflow-hidden", className)}
    >
      {children}
    </div>
  );
}

interface AiChatFooterProps {
  children?: React.ReactNode;
  className?: string;
}

function AiChatFooter({ children, className }: AiChatFooterProps) {
  return (
    <div
      data-slot="ai-chat-footer"
      className={cn("border-t bg-background px-4 py-3", className)}
    >
      {children}
    </div>
  );
}

export { AiChat, AiChatHeader, AiChatBody, AiChatFooter, useChatContext };
export type { AiChatProps };
