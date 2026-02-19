"use client";

import { useState } from "react";

import { Check, Copy, Terminal } from "lucide-react";

export function SkillBadge({ skill }: { skill?: string }) {
  const [copied, setCopied] = useState(false);
  const command = skill
    ? `npx skills add crafter-station/elements --skill ${skill}`
    : "npx skills add crafter-station/elements";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group relative inline-flex items-center gap-3 bg-foreground/[0.03] hover:bg-foreground/[0.06] border border-border hover:border-foreground/20 transition-all duration-200 pr-2"
    >
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-foreground/30 group-hover:border-foreground/60 transition-colors" />
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-foreground/30 group-hover:border-foreground/60 transition-colors" />
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-foreground/30 group-hover:border-foreground/60 transition-colors" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-foreground/30 group-hover:border-foreground/60 transition-colors" />

      <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-r border-border bg-foreground/[0.03]">
        <Terminal className="size-3 text-muted-foreground" />
        <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-widest">
          skill
        </span>
      </div>

      <code className="text-[11px] text-foreground/70 group-hover:text-foreground font-mono transition-colors py-1.5">
        {command}
      </code>

      <div className="flex items-center justify-center size-5 text-muted-foreground group-hover:text-foreground transition-colors">
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      </div>
    </button>
  );
}
