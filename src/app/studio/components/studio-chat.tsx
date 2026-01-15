"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Loader2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { extractCodeBlocks, type ParsedCodeBlock } from "../lib/code-parser";
import { useStudioStore } from "../stores/studio-store";
import { StudioHeader } from "./studio-header";
import { StudioMessage } from "./studio-message";

interface StudioChatProps {
  className?: string;
}

function getMessageContent(message: {
  content?: string;
  parts?: Array<{ type: string; text?: string }>;
}): string {
  if (typeof message.content === "string") {
    return message.content;
  }
  if (message.parts) {
    return message.parts
      .filter((part) => part.type === "text" && part.text)
      .map((part) => part.text)
      .join("");
  }
  return "";
}

export function StudioChat({ className }: StudioChatProps) {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("openai/gpt-4o");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { addPendingElement, commitPendingElements, clearPendingElements } =
    useStudioStore();

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/studio/generate",
        body: { model },
      }),
    [model],
  );

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport,
    onFinish: ({ message }) => {
      const content = getMessageContent(message);
      const blocks = extractCodeBlocks(content);
      if (blocks.length > 0) {
        clearPendingElements();
        for (const block of blocks) {
          addPendingElement({
            code: block.code,
            imports: block.imports,
            position: { x: 200, y: 200 },
          });
        }
      }
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input, adjustTextareaHeight]);

  const handleApplyCode = useCallback(
    (block: ParsedCodeBlock) => {
      clearPendingElements();
      addPendingElement({
        code: block.code,
        imports: block.imports,
        position: { x: 200, y: 200 },
      });
      commitPendingElements();
    },
    [addPendingElement, commitPendingElements, clearPendingElements],
  );

  const handleClear = useCallback(() => {
    setMessages([]);
    clearPendingElements();
  }, [setMessages, clearPendingElements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput("");
    await sendMessage({ text: message });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <StudioHeader
        model={model}
        onModelChange={setModel}
        onClear={handleClear}
        hasMessages={messages.length > 0}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Generate UI with AI</h3>
            <p className="text-sm text-muted-foreground max-w-[280px]">
              Describe the UI you want to create using Elements AI components
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <StudioMessage
              key={message.id}
              role={message.role as "user" | "assistant"}
              content={getMessageContent(message)}
              isStreaming={
                isLoading &&
                index === messages.length - 1 &&
                message.role === "assistant"
              }
              onApplyCode={handleApplyCode}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the UI you want to create..."
              className="w-full resize-none rounded-lg border bg-background px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[48px] max-h-[150px]"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 shrink-0"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground text-center">
          Press ⌘ + Enter to send
        </p>
      </form>
    </div>
  );
}
