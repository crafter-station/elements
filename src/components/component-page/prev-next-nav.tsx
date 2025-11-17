"use client";

import Link from "next/link";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface PrevNextNavProps {
  previous?: {
    title: string;
    href: string;
  };
  next?: {
    title: string;
    href: string;
  };
  className?: string;
}

export function PrevNextNav({ previous, next, className }: PrevNextNavProps) {
  if (!previous && !next) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-stretch gap-2 border-t border-dotted border-border pt-8 mt-12",
        className,
      )}
    >
      {previous ? (
        <Link
          href={previous.href}
          className="flex items-center gap-3 flex-1 px-4 py-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
        >
          <div className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground mb-0.5">Previous</div>
            <div className="text-sm font-medium truncate">{previous.title}</div>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {previous && next && (
        <div className="w-px bg-border shrink-0" aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={next.href}
          className="flex items-center gap-3 flex-1 px-4 py-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
        >
          <div className="flex-1 min-w-0 text-right">
            <div className="text-xs text-muted-foreground mb-0.5">Next</div>
            <div className="text-sm font-medium truncate">{next.title}</div>
          </div>
          <div className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
