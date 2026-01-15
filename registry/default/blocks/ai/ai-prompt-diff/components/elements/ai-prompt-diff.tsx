"use client";

import * as React from "react";

import {
  AlignJustify,
  CheckCheck,
  Copy,
  FileText,
  SplitSquareHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";

type DiffView = "side-by-side" | "unified";

interface DiffLine {
  type: "unchanged" | "added" | "removed";
  content: string;
  lineNumber: { before?: number; after?: number };
}

interface AiPromptDiffContextValue {
  before: string;
  after: string;
  view: DiffView;
  setView: (view: DiffView) => void;
  diffLines: DiffLine[];
}

const AiPromptDiffContext =
  React.createContext<AiPromptDiffContextValue | null>(null);

function usePromptDiffContext() {
  const context = React.useContext(AiPromptDiffContext);
  if (!context) {
    throw new Error(
      "AiPromptDiff components must be used within <AiPromptDiff>",
    );
  }
  return context;
}

function computeDiff(before: string, after: string): DiffLine[] {
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  const result: DiffLine[] = [];

  const lcs = computeLCS(beforeLines, afterLines);
  let beforeIdx = 0;
  let afterIdx = 0;
  let lcsIdx = 0;

  while (beforeIdx < beforeLines.length || afterIdx < afterLines.length) {
    if (
      lcsIdx < lcs.length &&
      beforeIdx < beforeLines.length &&
      afterIdx < afterLines.length &&
      beforeLines[beforeIdx] === lcs[lcsIdx] &&
      afterLines[afterIdx] === lcs[lcsIdx]
    ) {
      result.push({
        type: "unchanged",
        content: beforeLines[beforeIdx],
        lineNumber: { before: beforeIdx + 1, after: afterIdx + 1 },
      });
      beforeIdx++;
      afterIdx++;
      lcsIdx++;
    } else if (
      beforeIdx < beforeLines.length &&
      (lcsIdx >= lcs.length || beforeLines[beforeIdx] !== lcs[lcsIdx])
    ) {
      result.push({
        type: "removed",
        content: beforeLines[beforeIdx],
        lineNumber: { before: beforeIdx + 1 },
      });
      beforeIdx++;
    } else if (
      afterIdx < afterLines.length &&
      (lcsIdx >= lcs.length || afterLines[afterIdx] !== lcs[lcsIdx])
    ) {
      result.push({
        type: "added",
        content: afterLines[afterIdx],
        lineNumber: { after: afterIdx + 1 },
      });
      afterIdx++;
    }
  }

  return result;
}

function computeLCS(a: string[], b: string[]): string[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return result;
}

interface AiPromptDiffProps {
  before: string;
  after: string;
  title?: string;
  view?: DiffView;
  onViewChange?: (view: DiffView) => void;
  className?: string;
  children?: React.ReactNode;
}

function AiPromptDiff({
  before,
  after,
  view: controlledView,
  onViewChange,
  className,
  children,
}: AiPromptDiffProps) {
  const [uncontrolledView, setUncontrolledView] =
    React.useState<DiffView>("unified");

  const isControlled = controlledView !== undefined;
  const view = isControlled ? controlledView : uncontrolledView;

  const setView = React.useCallback(
    (newView: DiffView) => {
      if (!isControlled) {
        setUncontrolledView(newView);
      }
      onViewChange?.(newView);
    },
    [isControlled, onViewChange],
  );

  const diffLines = React.useMemo(
    () => computeDiff(before, after),
    [before, after],
  );

  const contextValue = React.useMemo(
    () => ({ before, after, view, setView, diffLines }),
    [before, after, view, setView, diffLines],
  );

  return (
    <AiPromptDiffContext.Provider value={contextValue}>
      <div
        data-slot="ai-prompt-diff"
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground overflow-hidden",
          className,
        )}
      >
        {children}
      </div>
    </AiPromptDiffContext.Provider>
  );
}

interface AiPromptDiffHeaderProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

function AiPromptDiffHeader({
  title = "Prompt Diff",
  children,
  className,
}: AiPromptDiffHeaderProps) {
  const { diffLines } = usePromptDiffContext();

  const stats = React.useMemo(() => {
    const added = diffLines.filter((l) => l.type === "added").length;
    const removed = diffLines.filter((l) => l.type === "removed").length;
    return { added, removed };
  }, [diffLines]);

  return (
    <div
      data-slot="ai-prompt-diff-header"
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-border",
        className,
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-orange-100 dark:bg-orange-950">
        <FileText className="size-4 text-orange-600 dark:text-orange-400" />
      </div>
      <div className="flex flex-1 items-center gap-2">
        <span className="font-medium text-sm">{title}</span>
        <div className="flex items-center gap-1.5 text-xs">
          {stats.added > 0 && (
            <span className="text-green-600 dark:text-green-400">
              +{stats.added}
            </span>
          )}
          {stats.removed > 0 && (
            <span className="text-red-600 dark:text-red-400">
              -{stats.removed}
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

interface AiPromptDiffViewToggleProps {
  className?: string;
}

function AiPromptDiffViewToggle({ className }: AiPromptDiffViewToggleProps) {
  const { view, setView } = usePromptDiffContext();

  return (
    <div
      data-slot="ai-prompt-diff-view-toggle"
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-muted/50 p-0.5",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setView("unified")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors",
          view === "unified"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <AlignJustify className="size-3.5" />
        Unified
      </button>
      <button
        type="button"
        onClick={() => setView("side-by-side")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors",
          view === "side-by-side"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <SplitSquareHorizontal className="size-3.5" />
        Split
      </button>
    </div>
  );
}

interface AiPromptDiffContentProps {
  className?: string;
}

function AiPromptDiffContent({ className }: AiPromptDiffContentProps) {
  const { view, diffLines, before, after } = usePromptDiffContext();

  if (view === "side-by-side") {
    return (
      <AiPromptDiffSideBySide
        before={before}
        after={after}
        className={className}
      />
    );
  }

  return (
    <div
      data-slot="ai-prompt-diff-content"
      className={cn("overflow-x-auto", className)}
    >
      <table className="w-full text-xs font-mono">
        <tbody>
          {diffLines.map((line, idx) => (
            <tr
              key={idx}
              className={cn(
                line.type === "added" && "bg-green-50 dark:bg-green-950/30",
                line.type === "removed" && "bg-red-50 dark:bg-red-950/30",
              )}
            >
              <td className="w-10 select-none px-2 py-0.5 text-right text-muted-foreground border-r border-border">
                {line.lineNumber.before ?? ""}
              </td>
              <td className="w-10 select-none px-2 py-0.5 text-right text-muted-foreground border-r border-border">
                {line.lineNumber.after ?? ""}
              </td>
              <td className="w-6 select-none px-2 py-0.5 text-center">
                {line.type === "added" && (
                  <span className="text-green-600 dark:text-green-400">+</span>
                )}
                {line.type === "removed" && (
                  <span className="text-red-600 dark:text-red-400">-</span>
                )}
              </td>
              <td className="px-3 py-0.5 whitespace-pre">
                <span
                  className={cn(
                    line.type === "added" &&
                      "text-green-700 dark:text-green-300",
                    line.type === "removed" && "text-red-700 dark:text-red-300",
                  )}
                >
                  {line.content}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface AiPromptDiffSideBySideProps {
  before: string;
  after: string;
  className?: string;
}

function AiPromptDiffSideBySide({
  before,
  after,
  className,
}: AiPromptDiffSideBySideProps) {
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  const maxLines = Math.max(beforeLines.length, afterLines.length);

  return (
    <div
      data-slot="ai-prompt-diff-side-by-side"
      className={cn("grid grid-cols-2 divide-x divide-border", className)}
    >
      <div className="overflow-x-auto">
        <div className="px-3 py-2 bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground">
          Before
        </div>
        <table className="w-full text-xs font-mono">
          <tbody>
            {Array.from({ length: maxLines }).map((_, idx) => {
              const line = beforeLines[idx];
              const afterLine = afterLines[idx];
              const isRemoved = line !== afterLine && line !== undefined;
              return (
                <tr
                  key={idx}
                  className={cn(isRemoved && "bg-red-50 dark:bg-red-950/30")}
                >
                  <td className="w-10 select-none px-2 py-0.5 text-right text-muted-foreground border-r border-border">
                    {line !== undefined ? idx + 1 : ""}
                  </td>
                  <td className="px-3 py-0.5 whitespace-pre">
                    <span
                      className={cn(
                        isRemoved && "text-red-700 dark:text-red-300",
                      )}
                    >
                      {line ?? ""}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto">
        <div className="px-3 py-2 bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground">
          After
        </div>
        <table className="w-full text-xs font-mono">
          <tbody>
            {Array.from({ length: maxLines }).map((_, idx) => {
              const line = afterLines[idx];
              const beforeLine = beforeLines[idx];
              const isAdded = line !== beforeLine && line !== undefined;
              return (
                <tr
                  key={idx}
                  className={cn(isAdded && "bg-green-50 dark:bg-green-950/30")}
                >
                  <td className="w-10 select-none px-2 py-0.5 text-right text-muted-foreground border-r border-border">
                    {line !== undefined ? idx + 1 : ""}
                  </td>
                  <td className="px-3 py-0.5 whitespace-pre">
                    <span
                      className={cn(
                        isAdded && "text-green-700 dark:text-green-300",
                      )}
                    >
                      {line ?? ""}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface AiPromptDiffCopyButtonProps {
  variant: "before" | "after";
  className?: string;
}

function AiPromptDiffCopyButton({
  variant,
  className,
}: AiPromptDiffCopyButtonProps) {
  const { before, after } = usePromptDiffContext();
  const [copied, setCopied] = React.useState(false);

  const content = variant === "before" ? before : after;

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  return (
    <button
      type="button"
      data-slot="ai-prompt-diff-copy-button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
        className,
      )}
    >
      {copied ? (
        <>
          <CheckCheck className="size-3" />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-3" />
          Copy {variant}
        </>
      )}
    </button>
  );
}

export {
  AiPromptDiff,
  AiPromptDiffHeader,
  AiPromptDiffViewToggle,
  AiPromptDiffContent,
  AiPromptDiffSideBySide,
  AiPromptDiffCopyButton,
};
export type { AiPromptDiffProps, DiffView, DiffLine };
