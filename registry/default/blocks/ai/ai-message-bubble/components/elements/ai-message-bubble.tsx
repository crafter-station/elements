"use client";

import * as React from "react";

import { Check, Copy, User } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type MessageRole = "user" | "assistant";

interface AiMessageBubbleProps {
  role: MessageRole;
  content: string;
  timestamp?: Date;
  avatar?: React.ReactNode;
  isStreaming?: boolean;
  className?: string;
}

export function AiMessageBubble({
  role,
  content,
  timestamp,
  avatar,
  isStreaming = false,
  className,
}: AiMessageBubbleProps) {
  const [copied, setCopied] = React.useState(false);

  const isUser = role === "user";

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  const defaultAvatar = isUser ? (
    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
      <User className="size-4" />
    </div>
  ) : (
    <div className="flex size-8 items-center justify-center rounded-full bg-muted">
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>AI</title>
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
        <path d="M7.5 13a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" />
        <path d="M13.5 13a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" />
        <path d="M8 17h8" />
      </svg>
    </div>
  );

  return (
    <div
      data-slot="ai-message-bubble"
      role="article"
      aria-label={isUser ? "Your message" : "AI response"}
      className={cn(
        "group flex gap-3",
        isUser && "flex-row-reverse",
        className,
      )}
    >
      <div className="shrink-0">{avatar || defaultAvatar}</div>

      <div
        className={cn(
          "relative max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          aria-live={isStreaming ? "polite" : undefined}
        >
          <p className="m-0 whitespace-pre-wrap">{content}</p>
          {isStreaming && (
            <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-current will-change-[opacity]" />
          )}
        </div>

        {timestamp && (
          <time className="mt-1 block text-[10px] opacity-60">
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        )}

        {!isUser && !isStreaming && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-10 top-1 size-7 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="size-3.5 text-green-500" />
            ) : (
              <Copy className="size-3.5" />
            )}
            <span className="sr-only">Copy message</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export type { AiMessageBubbleProps, MessageRole };
