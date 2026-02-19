"use client";

import { useState } from "react";

import { Check, Copy, Sparkles } from "lucide-react";

export function SkillBadge({ skill }: { skill: string }) {
  const [copied, setCopied] = useState(false);
  const command = `npx add-skill crafter-station/elements --skill ${skill}`;

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
      className="group inline-flex items-center gap-2.5 px-3 py-2 rounded-md border border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all duration-200"
    >
      <Sparkles className="size-3.5 text-primary flex-shrink-0" />
      <span className="text-[11px] font-medium text-primary uppercase tracking-wide">
        AI Skill
      </span>
      <code className="text-[11px] text-muted-foreground font-mono">
        {command}
      </code>
      <div className="flex items-center justify-center size-6 rounded bg-background/80 border border-border/50 text-muted-foreground group-hover:text-primary group-hover:border-primary/50 transition-colors ml-1">
        {copied ? (
          <Check className="size-3 text-primary" />
        ) : (
          <Copy className="size-3" />
        )}
      </div>
    </button>
  );
}
