"use client";

import { useEffect, useState } from "react";

import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import { useTheme } from "next-themes";
import type {
  BundledLanguage,
  Highlighter,
  ThemeInput,
} from "shiki/bundle/web";
import { createHighlighter } from "shiki/bundle/web";

import vesperDark from "@/data/vesper-dark.json";
import vesperLight from "@/data/vesper-light.json";

interface CodeBlockProps {
  code: string;
  lang: BundledLanguage;
  className?: string;
}

// Global highlighter instance with pre-loaded themes
let highlighter: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

// Pre-initialize highlighter
if (typeof window !== "undefined" && !highlighterPromise) {
  highlighterPromise = createHighlighter({
    themes: [
      { ...vesperLight, name: "vesper-light" } as ThemeInput,
      { ...vesperDark, name: "vesper-dark" } as ThemeInput,
    ],
    langs: ["javascript", "typescript", "json", "bash", "shell"],
  }).then((h) => {
    highlighter = h;
    return h;
  });
}

export function CodeBlock({ code, lang, className = "" }: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const highlight = async () => {
      try {
        // Wait for highlighter to be ready
        const h = highlighter || (await highlighterPromise);
        if (!h) return;

        // Use resolved theme directly
        const themeToUse =
          resolvedTheme === "dark" ? "vesper-dark" : "vesper-light";

        // Highlight - keep inline styles for colors, we'll override background
        const highlightedCode = h.codeToHtml(code, {
          lang,
          theme: themeToUse,
          transformers: [
            transformerNotationDiff({
              matchAlgorithm: "v3",
            }),
            transformerNotationHighlight({
              matchAlgorithm: "v3",
            }),
            transformerNotationFocus({
              matchAlgorithm: "v3",
            }),
            transformerNotationErrorLevel(),
          ],
        });

        setHtml(highlightedCode);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        setHtml(
          `<pre class="bg-muted/30 p-4 rounded border border-border/50"><code>${code}</code></pre>`,
        );
      }
    };

    highlight();
  }, [code, lang, resolvedTheme]);

  // Show themed skeleton while loading - matches Vesper theme colors
  if (!html) {
    return (
      <pre
        className={`shiki vesper-light dark:vesper-dark bg-muted/30 rounded border border-border/50 p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words text-foreground ${className}`}
      >
        <code className="whitespace-pre-wrap break-words">{code}</code>
      </pre>
    );
  }

  // Override Shiki's background with our bg-muted, but keep syntax colors
  return (
    <div
      className={`[&_pre]:bg-muted/30 [&_pre]:rounded [&_pre]:border [&_pre]:border-border/50 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-relaxed [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-hidden [&_code]:whitespace-pre-wrap [&_code]:break-words ${className}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: html is safe
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
