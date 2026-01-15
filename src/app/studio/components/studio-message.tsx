"use client";

import { useMemo, useState } from "react";

import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { extractCodeBlocks, type ParsedCodeBlock } from "../lib/code-parser";

interface StudioMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  onApplyCode?: (code: ParsedCodeBlock) => void;
}

export function StudioMessage({
  role,
  content,
  isStreaming = false,
  onApplyCode,
}: StudioMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const codeBlocks = useMemo(() => extractCodeBlocks(content), [content]);

  const textContent = useMemo(() => {
    let text = content;
    for (const block of codeBlocks) {
      text = text.replace(/```\w*\n[\s\S]*?```/, "").trim();
    }
    return text;
  }, [content, codeBlocks]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("group flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {isUser ? (
          <span className="text-xs font-medium">U</span>
        ) : (
          <span className="text-xs font-medium">AI</span>
        )}
      </div>

      <div
        className={cn("flex-1 space-y-3", isUser && "flex flex-col items-end")}
      >
        {textContent && (
          <div
            className={cn(
              "relative max-w-[85%] rounded-2xl px-4 py-3",
              isUser ? "bg-primary text-primary-foreground" : "bg-muted",
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{textContent}</p>
            {isStreaming && (
              <span className="inline-block w-1 h-4 ml-1 bg-current animate-pulse" />
            )}
          </div>
        )}

        {codeBlocks.map((block, index) => (
          <div
            key={index}
            className="w-full rounded-lg border bg-muted/50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/80">
              <span className="text-xs font-medium text-muted-foreground uppercase">
                {block.language}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
                {onApplyCode && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => onApplyCode(block)}
                  >
                    Apply
                  </Button>
                )}
              </div>
            </div>
            <pre className="p-3 text-xs overflow-x-auto">
              <code>{block.code}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
