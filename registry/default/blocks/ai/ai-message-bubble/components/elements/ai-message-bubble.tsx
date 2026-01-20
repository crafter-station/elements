"use client";

import * as React from "react";

import { Check, Copy, User } from "lucide-react";

import { cn } from "@/lib/utils";

import { AnthropicLogo } from "@/components/ui/logos/anthropic";
import { CohereLogo } from "@/components/ui/logos/cohere";
import { DeepSeekLogo } from "@/components/ui/logos/deepseek";
import { GeminiLogo } from "@/components/ui/logos/gemini";
import { GroqLogo } from "@/components/ui/logos/groq";
import { MetaLogo } from "@/components/ui/logos/meta";
import { MistralLogo } from "@/components/ui/logos/mistral";
import { OpenAILogo } from "@/components/ui/logos/openai";
import { XAILogo } from "@/components/ui/logos/xai";

type MessageRole = "user" | "assistant";

type Provider =
  | "openai"
  | "anthropic"
  | "google"
  | "xai"
  | "deepseek"
  | "mistral"
  | "groq"
  | "cohere"
  | "meta";

const PROVIDER_LOGOS: Record<
  Provider,
  React.ComponentType<{ className?: string }>
> = {
  openai: OpenAILogo,
  anthropic: AnthropicLogo,
  google: GeminiLogo,
  xai: XAILogo,
  deepseek: DeepSeekLogo,
  mistral: MistralLogo,
  groq: GroqLogo,
  cohere: CohereLogo,
  meta: MetaLogo,
};

interface AiMessageBubbleProps {
  role: MessageRole;
  content?: string;
  provider?: Provider;
  timestamp?: Date;
  avatar?: React.ReactNode;
  isStreaming?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function AiMessageBubble({
  role,
  content,
  provider,
  timestamp,
  avatar,
  isStreaming = false,
  className,
  children,
}: AiMessageBubbleProps) {
  const [copied, setCopied] = React.useState(false);

  const isUser = role === "user";

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  const ProviderLogo = provider ? PROVIDER_LOGOS[provider] : null;

  const defaultAvatar = isUser ? (
    <div className="flex size-7 items-center justify-center border bg-foreground text-background">
      <User className="size-3.5" />
    </div>
  ) : ProviderLogo ? (
    <div className="flex size-7 items-center justify-center border bg-background">
      <ProviderLogo className="size-3.5" />
    </div>
  ) : (
    <div className="flex size-7 items-center justify-center border bg-background">
      <svg
        className="size-3.5"
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
        "group flex gap-3 font-mono",
        isUser && "flex-row-reverse",
        className
      )}
    >
      <div className="shrink-0">{avatar || defaultAvatar}</div>

      <div
        className={cn(
          "relative max-w-[80%] px-3 py-2",
          isUser ? "border bg-foreground text-background" : "text-foreground"
        )}
      >
        <div aria-live={isStreaming ? "polite" : undefined}>
          {children ? (
            <div className="prose prose-xs dark:prose-invert max-w-none text-[13px] leading-relaxed [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-[13px] [&_h4]:text-[13px] [&_p]:text-[13px] [&_li]:text-[13px] [&_code]:text-xs [&_pre]:text-xs">
              {children}
            </div>
          ) : (
            <p className="m-0 whitespace-pre-wrap text-[13px] leading-relaxed">
              {content}
            </p>
          )}
          {isStreaming && (
            <span className="ml-1 inline-block h-3.5 w-[2px] animate-pulse bg-current" />
          )}
        </div>

        {timestamp && (
          <time className="mt-2 block text-[10px] uppercase tracking-wider opacity-60">
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        )}

        {!isUser && !isStreaming && (
          <button
            type="button"
            className="absolute -right-8 top-0.5 flex size-6 items-center justify-center border bg-background opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="size-3" />
            ) : (
              <Copy className="size-3" />
            )}
            <span className="sr-only">Copy message</span>
          </button>
        )}
      </div>
    </div>
  );
}

export type { AiMessageBubbleProps, MessageRole, Provider };
