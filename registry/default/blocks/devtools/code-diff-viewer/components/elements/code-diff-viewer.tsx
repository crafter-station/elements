"use client";

import * as React from "react";

import { codeToHtml } from "shiki";

import { cn } from "@/lib/utils";

type DiffMode = "unified" | "split";

interface CodeDiffViewerProps {
  oldCode: string;
  newCode: string;
  language?: string;
  mode?: DiffMode;
  showLineNumbers?: boolean;
  className?: string;
}

interface DiffLine {
  type: "unchanged" | "added" | "removed";
  content: string;
  oldLineNum?: number;
  newLineNum?: number;
}

function computeDiff(oldCode: string, newCode: string): DiffLine[] {
  const oldLines = oldCode.split("\n");
  const newLines = newCode.split("\n");
  const result: DiffLine[] = [];

  let oldIdx = 0;
  let newIdx = 0;
  let oldLineNum = 1;
  let newLineNum = 1;

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    const oldLine = oldLines[oldIdx];
    const newLine = newLines[newIdx];

    if (oldIdx >= oldLines.length) {
      result.push({
        type: "added",
        content: newLine,
        newLineNum: newLineNum++,
      });
      newIdx++;
    } else if (newIdx >= newLines.length) {
      result.push({
        type: "removed",
        content: oldLine,
        oldLineNum: oldLineNum++,
      });
      oldIdx++;
    } else if (oldLine === newLine) {
      result.push({
        type: "unchanged",
        content: oldLine,
        oldLineNum: oldLineNum++,
        newLineNum: newLineNum++,
      });
      oldIdx++;
      newIdx++;
    } else {
      const oldRemaining = oldLines.slice(oldIdx);
      const newRemaining = newLines.slice(newIdx);
      const newLineInOld = oldRemaining.indexOf(newLine);
      const oldLineInNew = newRemaining.indexOf(oldLine);

      if (newLineInOld === -1 && oldLineInNew === -1) {
        result.push({
          type: "removed",
          content: oldLine,
          oldLineNum: oldLineNum++,
        });
        result.push({
          type: "added",
          content: newLine,
          newLineNum: newLineNum++,
        });
        oldIdx++;
        newIdx++;
      } else if (
        newLineInOld !== -1 &&
        (oldLineInNew === -1 || newLineInOld <= oldLineInNew)
      ) {
        result.push({
          type: "removed",
          content: oldLine,
          oldLineNum: oldLineNum++,
        });
        oldIdx++;
      } else {
        result.push({
          type: "added",
          content: newLine,
          newLineNum: newLineNum++,
        });
        newIdx++;
      }
    }
  }

  return result;
}

function UnifiedDiff({
  diff,
  language,
  showLineNumbers,
}: {
  diff: DiffLine[];
  language: string;
  showLineNumbers: boolean;
}) {
  const [highlightedLines, setHighlightedLines] = React.useState<
    Map<number, string>
  >(new Map());

  React.useEffect(() => {
    async function highlightAll() {
      const results = new Map<number, string>();
      for (let i = 0; i < diff.length; i++) {
        const line = diff[i];
        if (line.content) {
          const html = await codeToHtml(line.content, {
            lang: language,
            themes: { light: "github-light", dark: "github-dark" },
            defaultColor: false,
          });
          const match = html.match(/<code[^>]*>([\s\S]*?)<\/code>/);
          results.set(i, match ? match[1] : line.content);
        } else {
          results.set(i, "");
        }
      }
      setHighlightedLines(results);
    }
    highlightAll();
  }, [diff, language]);

  return (
    <div className="font-mono text-sm overflow-auto">
      {diff.map((line, idx) => (
        <div
          key={idx}
          className={cn(
            "flex",
            line.type === "added" && "bg-green-100 dark:bg-green-950/50",
            line.type === "removed" && "bg-red-100 dark:bg-red-950/50",
          )}
        >
          {showLineNumbers && (
            <div className="flex shrink-0 text-muted-foreground text-xs">
              <span className="w-10 px-2 text-right border-r border-border">
                {line.oldLineNum ?? ""}
              </span>
              <span className="w-10 px-2 text-right border-r border-border">
                {line.newLineNum ?? ""}
              </span>
            </div>
          )}
          <span
            className={cn(
              "w-6 shrink-0 text-center",
              line.type === "added" && "text-green-600 dark:text-green-400",
              line.type === "removed" && "text-red-600 dark:text-red-400",
            )}
          >
            {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
          </span>
          <span
            className="flex-1 px-2"
            dangerouslySetInnerHTML={{
              __html: highlightedLines.get(idx) ?? line.content ?? "",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function SplitDiff({
  diff,
  language,
  showLineNumbers,
}: {
  diff: DiffLine[];
  language: string;
  showLineNumbers: boolean;
}) {
  const [highlightedLines, setHighlightedLines] = React.useState<
    Map<number, string>
  >(new Map());

  const leftLines: DiffLine[] = [];
  const rightLines: DiffLine[] = [];

  for (const line of diff) {
    if (line.type === "unchanged") {
      leftLines.push(line);
      rightLines.push(line);
    } else if (line.type === "removed") {
      leftLines.push(line);
    } else {
      rightLines.push(line);
    }
  }

  const maxLen = Math.max(leftLines.length, rightLines.length);
  while (leftLines.length < maxLen)
    leftLines.push({ type: "unchanged", content: "" });
  while (rightLines.length < maxLen)
    rightLines.push({ type: "unchanged", content: "" });

  React.useEffect(() => {
    async function highlightAll() {
      const results = new Map<number, string>();
      const allLines = [...leftLines, ...rightLines];
      for (let i = 0; i < allLines.length; i++) {
        const line = allLines[i];
        if (line.content) {
          const html = await codeToHtml(line.content, {
            lang: language,
            themes: { light: "github-light", dark: "github-dark" },
            defaultColor: false,
          });
          const match = html.match(/<code[^>]*>([\s\S]*?)<\/code>/);
          results.set(i, match ? match[1] : line.content);
        } else {
          results.set(i, "");
        }
      }
      setHighlightedLines(results);
    }
    highlightAll();
  }, [diff, language]);

  return (
    <div className="font-mono text-sm overflow-auto flex">
      <div className="flex-1 border-r border-border">
        {leftLines.map((line, idx) => (
          <div
            key={idx}
            className={cn(
              "flex",
              line.type === "removed" && "bg-red-100 dark:bg-red-950/50",
            )}
          >
            {showLineNumbers && (
              <span className="w-10 px-2 text-right text-muted-foreground text-xs border-r border-border shrink-0">
                {line.oldLineNum ?? ""}
              </span>
            )}
            <span
              className={cn(
                "w-6 shrink-0 text-center",
                line.type === "removed" && "text-red-600 dark:text-red-400",
              )}
            >
              {line.type === "removed" ? "-" : " "}
            </span>
            <span
              className="flex-1 px-2"
              dangerouslySetInnerHTML={{
                __html: highlightedLines.get(idx) ?? line.content ?? "",
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex-1">
        {rightLines.map((line, idx) => (
          <div
            key={idx}
            className={cn(
              "flex",
              line.type === "added" && "bg-green-100 dark:bg-green-950/50",
            )}
          >
            {showLineNumbers && (
              <span className="w-10 px-2 text-right text-muted-foreground text-xs border-r border-border shrink-0">
                {line.newLineNum ?? ""}
              </span>
            )}
            <span
              className={cn(
                "w-6 shrink-0 text-center",
                line.type === "added" && "text-green-600 dark:text-green-400",
              )}
            >
              {line.type === "added" ? "+" : " "}
            </span>
            <span
              className="flex-1 px-2"
              dangerouslySetInnerHTML={{
                __html:
                  highlightedLines.get(leftLines.length + idx) ??
                  line.content ??
                  "",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CodeDiffViewer({
  oldCode,
  newCode,
  language = "typescript",
  mode = "unified",
  showLineNumbers = true,
  className,
}: CodeDiffViewerProps) {
  const diff = React.useMemo(
    () => computeDiff(oldCode, newCode),
    [oldCode, newCode],
  );

  return (
    <div
      data-slot="code-diff-viewer"
      role="region"
      aria-label="Code diff"
      className={cn(
        "border border-border rounded-lg overflow-hidden",
        className,
      )}
    >
      {mode === "unified" ? (
        <UnifiedDiff
          diff={diff}
          language={language}
          showLineNumbers={showLineNumbers}
        />
      ) : (
        <SplitDiff
          diff={diff}
          language={language}
          showLineNumbers={showLineNumbers}
        />
      )}
    </div>
  );
}

export type { CodeDiffViewerProps, DiffMode };
