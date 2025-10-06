"use client";

import { useEffect, useState } from "react";

import { useTheme } from "next-themes";
import type {
  BundledLanguage,
  Highlighter,
  ThemeInput,
} from "shiki/bundle/web";
import { createHighlighter } from "shiki/bundle/web";

import vesperDark from "../../../public/vesper-dark.json";
import vesperLight from "../../../public/vesper-light.json";

interface CodeBlockProps {
  code: string;
  lang: BundledLanguage;
  className?: string;
}

// Global highlighter instance with pre-loaded themes
let highlighter: Highlighter | null = null;

export function CodeBlock({ code, lang, className = "" }: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const highlight = async () => {
      try {
        // Create highlighter only once with pre-loaded themes
        if (!highlighter) {
          highlighter = await createHighlighter({
            themes: [
              { ...vesperLight, name: "vesper-light" } as ThemeInput,
              { ...vesperDark, name: "vesper-dark" } as ThemeInput,
            ],
            langs: ["javascript", "typescript", "json", "bash", "shell"],
          });
        }

        // Determine current theme
        const currentTheme = theme === "system" ? systemTheme : theme;
        const themeToUse =
          currentTheme === "dark" ? "vesper-dark" : "vesper-light";

        // Highlight with current theme
        const highlightedCode = highlighter.codeToHtml(code, {
          lang,
          theme: themeToUse,
          transformers: [
            {
              code(node) {
                node.properties.style = "";
              },
              pre(node) {
                node.properties.style = "";
                node.properties.class = `shiki language-${lang} ${className}`;
              },
            },
          ],
        });

        setHtml(highlightedCode);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        setHtml(`<pre><code>${code}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlight();
  }, [code, lang, className, theme, systemTheme]);

  if (isLoading) {
    return (
      <pre
        className={`bg-muted/50 rounded border border-border/50 p-4 font-mono text-sm whitespace-pre-wrap break-words overflow-hidden ${className}`}
      >
        <code className="text-muted-foreground whitespace-pre-wrap break-words">
          {code}
        </code>
      </pre>
    );
  }

  return (
    <div
      className={`[&_pre]:bg-muted/50 [&_pre]:rounded [&_pre]:border [&_pre]:border-border/50 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-hidden ${className}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: html is safe
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
