"use client";

import { useState } from "react";

import { CopyIcon } from "@/components/icons/copy";
import { PixelatedCheckIcon } from "@/components/pixelated-check-icon";

interface CodeBlockCopyButtonProps {
  code: string;
}

export function CodeBlockCopyButton({ code }: CodeBlockCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 rounded-md bg-background/80 hover:bg-background border border-border/50 hover:border-border transition-all duration-200 backdrop-blur-sm"
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? (
        <PixelatedCheckIcon className="size-4 text-green-500" />
      ) : (
        <CopyIcon className="size-4 text-muted-foreground hover:text-foreground transition-colors" />
      )}
    </button>
  );
}
