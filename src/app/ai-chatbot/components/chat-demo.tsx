"use client";

import * as React from "react";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Settings, Square } from "lucide-react";
import { Streamdown } from "streamdown";

import {
  AiChat,
  AiChatBody,
  AiChatFooter,
  AiChatHeader,
} from "@/registry/default/blocks/ai/ai-chat/components/elements/ai-chat";
import { AiChatInput } from "@/registry/default/blocks/ai/ai-chat-input/components/elements/ai-chat-input";
import {
  AiLatencyMeter,
  AiLatencyMeterCompact,
} from "@/registry/default/blocks/ai/ai-latency-meter/components/elements/ai-latency-meter";
import {
  AiMessageBubble,
  type Provider,
} from "@/registry/default/blocks/ai/ai-message-bubble/components/elements/ai-message-bubble";
import { AiMessages } from "@/registry/default/blocks/ai/ai-messages/components/elements/ai-messages";
import {
  AiModelSelector,
  type Model,
} from "@/registry/default/blocks/ai/ai-model-selector/components/elements/ai-model-selector";
import {
  AiReasoning,
  AiReasoningContent,
  AiReasoningText,
  AiReasoningTrigger,
} from "@/registry/default/blocks/ai/ai-reasoning/components/elements/ai-reasoning";
import { AiSuggestedActions } from "@/registry/default/blocks/ai/ai-suggested-actions/components/elements/ai-suggested-actions";
import { AiTemperatureSlider } from "@/registry/default/blocks/ai/ai-temperature-slider/components/elements/ai-temperature-slider";
import { AiTokenCounter } from "@/registry/default/blocks/ai/ai-token-counter/components/elements/ai-token-counter";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DEMO_MODELS: Model[] = [
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Multimodal flagship",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Fast and affordable",
  },
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "anthropic",
    description: "Fast and capable",
  },
  {
    id: "anthropic/claude-3.5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "anthropic",
    description: "Fast and efficient",
  },
  {
    id: "google/gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    description: "Fast multimodal",
  },
  {
    id: "xai/grok-3-mini",
    name: "Grok 3 Mini",
    provider: "xai",
    description: "Fast reasoning",
  },
];

const SUGGESTIONS = [
  { label: "Write a haiku about code", prompt: "Write a haiku about code" },
  { label: "Explain recursion simply", prompt: "Explain recursion simply" },
  { label: "Debug a React hook", prompt: "Debug a React hook" },
  { label: "Create a SQL query", prompt: "Create a SQL query" },
];

function extractTextContent(message: UIMessage): string {
  if (!message.parts || message.parts.length === 0) return "";
  return message.parts
    .filter(
      (part): part is { type: "text"; text: string } => part.type === "text"
    )
    .map((part) => part.text)
    .join("");
}

function extractReasoningContent(message: UIMessage): string | null {
  if (!message.parts || message.parts.length === 0) return null;
  const reasoningParts = message.parts.filter(
    (part): part is { type: "reasoning"; text: string } =>
      part.type === "reasoning"
  );
  if (reasoningParts.length === 0) return null;
  return reasoningParts.map((part) => part.text).join("\n");
}

export function ChatDemo() {
  const [model, setModel] = React.useState("openai/gpt-4o-mini");
  const [temperature, setTemperature] = React.useState(0.7);
  const messageProvidersRef = React.useRef<Map<string, Provider>>(new Map());

  const [latency, setLatency] = React.useState<{
    ttfb?: number;
    total?: number;
  }>({});
  const requestStartRef = React.useRef<number | null>(null);
  const ttfbRecordedRef = React.useRef(false);

  const provider = model.split("/")[0] as Provider;

  const transport = React.useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
      }),
    []
  );

  const { messages, sendMessage, status, stop } = useChat({ transport });

  const isStreaming = status === "streaming";
  const isLoading = status === "submitted" || isStreaming;

  React.useEffect(() => {
    if (status === "streaming" && !ttfbRecordedRef.current && requestStartRef.current) {
      const ttfb = Date.now() - requestStartRef.current;
      setLatency((prev) => ({ ...prev, ttfb }));
      ttfbRecordedRef.current = true;
    }
    if (status === "ready" && requestStartRef.current) {
      const total = Date.now() - requestStartRef.current;
      setLatency((prev) => ({ ...prev, total }));
      requestStartRef.current = null;
      ttfbRecordedRef.current = false;
    }
  }, [status]);

  React.useEffect(() => {
    for (const message of messages) {
      if (
        message.role === "assistant" &&
        !messageProvidersRef.current.has(message.id)
      ) {
        messageProvidersRef.current.set(message.id, provider);
      }
    }
  }, [messages, provider]);

  const handleSubmit = (message: string) => {
    if (!message.trim() || isLoading) return;
    console.log("[ChatDemo] Sending with model:", model, "temperature:", temperature);
    requestStartRef.current = Date.now();
    ttfbRecordedRef.current = false;
    setLatency({});
    sendMessage({ text: message }, { body: { model, temperature } });
  };

  const totalTokens = React.useMemo(() => {
    return messages.reduce((acc, msg) => {
      const text = extractTextContent(msg);
      return acc + Math.ceil(text.length / 4);
    }, 0);
  }, [messages]);

  const getMessageProvider = (messageId: string): Provider | undefined => {
    return messageProvidersRef.current.get(messageId);
  };

  return (
    <AiChat status={status}>
      <AiChatHeader className="py-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            AI CHAT
          </span>
          <span className="text-[9px] text-muted-foreground/60">
            / ELEMENTS
          </span>
        </div>

        <div className="flex items-center gap-2">
          {(latency.ttfb || latency.total || isLoading) && (
            <AiLatencyMeter
              ttfb={latency.ttfb}
              totalDuration={latency.total}
              isLoading={isLoading}
              variant="compact"
              className="h-7"
            >
              <AiLatencyMeterCompact />
            </AiLatencyMeter>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex size-7 items-center justify-center border bg-background transition-colors hover:bg-muted"
                disabled={isLoading}
              >
                <Settings className="size-3.5" />
                <span className="sr-only">Settings</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <AiTemperatureSlider
                value={temperature}
                onValueChange={setTemperature}
              />
            </PopoverContent>
          </Popover>

          <AiModelSelector
            value={model}
            onValueChange={setModel}
            models={DEMO_MODELS}
            disabled={isLoading}
            size="compact"
          />
        </div>
      </AiChatHeader>

      <AiChatBody>
        <AiMessages>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-8 pt-20">
              <div className="text-center">
                <h1 className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  START A CONVERSATION
                </h1>
              </div>

              <AiSuggestedActions
                suggestions={SUGGESTIONS}
                onSelect={handleSubmit}
                className="max-w-md"
              />
            </div>
          ) : (
            <>
              {messages.map((message) => {
                const textContent = extractTextContent(message);
                const reasoningContent = extractReasoningContent(message);
                const isUser = message.role === "user";
                const isCurrentStreaming =
                  isStreaming &&
                  message.id === messages[messages.length - 1]?.id;

                return (
                  <div key={message.id} className="space-y-2">
                    {reasoningContent && (
                      <AiReasoning
                        isStreaming={isCurrentStreaming && !textContent}
                        defaultOpen={isCurrentStreaming}
                      >
                        <AiReasoningTrigger />
                        <AiReasoningContent>
                          <AiReasoningText>{reasoningContent}</AiReasoningText>
                        </AiReasoningContent>
                      </AiReasoning>
                    )}

                    {textContent && (
                      <AiMessageBubble
                        role={isUser ? "user" : "assistant"}
                        content={isUser ? textContent : undefined}
                        provider={isUser ? undefined : getMessageProvider(message.id)}
                        isStreaming={isCurrentStreaming && !reasoningContent}
                      >
                        {!isUser && (
                          <Streamdown
                            isAnimating={isCurrentStreaming && !reasoningContent}
                          >
                            {textContent}
                          </Streamdown>
                        )}
                      </AiMessageBubble>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </AiMessages>
      </AiChatBody>

      <AiChatFooter>
        <div className="mx-auto max-w-2xl">
          {messages.length > 0 && (
            <div className="mb-3 flex items-center justify-between text-xs">
              <div className="w-40">
                <AiTokenCounter
                  tokens={totalTokens}
                  maxTokens={128000}
                  showProgress={true}
                />
              </div>
              {isStreaming && (
                <button
                  type="button"
                  onClick={stop}
                  className="flex items-center gap-2 border px-3 py-1 text-xs uppercase tracking-wider transition-colors hover:bg-muted"
                >
                  <Square className="size-2.5 fill-current" />
                  STOP
                </button>
              )}
            </div>
          )}

          <AiChatInput
            onSubmit={handleSubmit}
            disabled={isLoading}
            loading={isLoading}
          />
        </div>
      </AiChatFooter>
    </AiChat>
  );
}
