"use client";

import { useState } from "react";

import { CopyIcon } from "@/components/icons/copy";
import { PixelatedCheckIcon } from "@/components/pixelated-check-icon";

interface CodeBlockCopyButtonProps {
  code: string;
  size?: "default" | "sm";
}

export function CodeBlockCopyButton({
  code,
  size = "default",
}: CodeBlockCopyButtonProps) {
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

  const sizeClasses =
    size === "sm" ? "top-2 right-2 p-1.5" : "top-3 right-3 p-2";

  const iconSize = size === "sm" ? "size-3.5" : "size-4";

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`absolute ${sizeClasses} rounded-md bg-background/80 hover:bg-background border border-border/50 hover:border-border transition-all duration-200 backdrop-blur-sm`}
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? (
        <PixelatedCheckIcon className={`${iconSize} text-green-500`} />
      ) : (
        <CopyIcon
          className={`${iconSize} text-muted-foreground hover:text-foreground transition-colors`}
        />
      )}
    </button>
  );
}
