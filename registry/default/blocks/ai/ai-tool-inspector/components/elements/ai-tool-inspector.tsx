"use client";

import * as React from "react";

import {
  Check,
  CheckCheck,
  ChevronDown,
  Clock,
  Copy,
  Loader2,
  Timer,
  Wrench,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ToolExecutionStatus = "pending" | "running" | "success" | "error";

interface ToolExecution {
  id: string;
  name: string;
  description?: string;
  input: unknown;
  output?: unknown;
  status: ToolExecutionStatus;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

interface AiToolInspectorContextValue {
  tools: ToolExecution[];
  expandedIds: Set<string>;
  toggleExpanded: (id: string) => void;
}

const AiToolInspectorContext =
  React.createContext<AiToolInspectorContextValue | null>(null);

function useToolInspectorContext() {
  const context = React.useContext(AiToolInspectorContext);
  if (!context) {
    throw new Error(
      "AiToolInspector components must be used within <AiToolInspector>",
    );
  }
  return context;
}

interface AiToolInspectorProps {
  tools: ToolExecution[];
  defaultExpandedIds?: string[];
  className?: string;
  children?: React.ReactNode;
}

function AiToolInspector({
  tools,
  defaultExpandedIds = [],
  className,
  children,
}: AiToolInspectorProps) {
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(
    () => new Set(defaultExpandedIds),
  );

  const toggleExpanded = React.useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const contextValue = React.useMemo(
    () => ({ tools, expandedIds, toggleExpanded }),
    [tools, expandedIds, toggleExpanded],
  );

  return (
    <AiToolInspectorContext.Provider value={contextValue}>
      <div
        data-slot="ai-tool-inspector"
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground",
          className,
        )}
      >
        {children}
      </div>
    </AiToolInspectorContext.Provider>
  );
}

interface AiToolInspectorHeaderProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

function AiToolInspectorHeader({
  title = "Tool Executions",
  children,
  className,
}: AiToolInspectorHeaderProps) {
  const { tools } = useToolInspectorContext();

  const stats = React.useMemo(() => {
    const running = tools.filter((t) => t.status === "running").length;
    const success = tools.filter((t) => t.status === "success").length;
    const error = tools.filter((t) => t.status === "error").length;
    return { running, success, error, total: tools.length };
  }, [tools]);

  return (
    <div
      data-slot="ai-tool-inspector-header"
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-border",
        className,
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-violet-100 dark:bg-violet-950">
        <Wrench className="size-4 text-violet-600 dark:text-violet-400" />
      </div>
      <div className="flex flex-1 items-center gap-2">
        <span className="font-medium text-sm">{title}</span>
        <div className="flex items-center gap-1.5">
          {stats.running > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
              <Loader2 className="size-3 animate-spin" />
              {stats.running}
            </span>
          )}
          {stats.success > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-950 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
              <Check className="size-3" />
              {stats.success}
            </span>
          )}
          {stats.error > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-950 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
              <X className="size-3" />
              {stats.error}
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

interface AiToolInspectorListProps {
  children?: React.ReactNode;
  className?: string;
}

function AiToolInspectorList({
  children,
  className,
}: AiToolInspectorListProps) {
  const { tools } = useToolInspectorContext();

  return (
    <div
      data-slot="ai-tool-inspector-list"
      className={cn("divide-y divide-border", className)}
    >
      {children ||
        tools.map((tool) => <AiToolInspectorItem key={tool.id} tool={tool} />)}
    </div>
  );
}

interface AiToolInspectorItemProps {
  tool: ToolExecution;
  className?: string;
}

function AiToolInspectorItem({ tool, className }: AiToolInspectorItemProps) {
  const { expandedIds, toggleExpanded } = useToolInspectorContext();
  const isExpanded = expandedIds.has(tool.id);

  const statusConfig = React.useMemo(() => {
    const configs: Record<
      ToolExecutionStatus,
      { icon: React.ReactNode; label: string; className: string }
    > = {
      pending: {
        icon: <Clock className="size-3.5" />,
        label: "Pending",
        className: "bg-muted text-muted-foreground",
      },
      running: {
        icon: <Loader2 className="size-3.5 animate-spin" />,
        label: "Running",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      },
      success: {
        icon: <Check className="size-3.5" />,
        label: "Success",
        className:
          "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
      },
      error: {
        icon: <X className="size-3.5" />,
        label: "Error",
        className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      },
    };
    return configs[tool.status];
  }, [tool.status]);

  const executionTime = React.useMemo(() => {
    if (!tool.startTime) return null;
    const end = tool.endTime || new Date();
    const ms = end.getTime() - tool.startTime.getTime();
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }, [tool.startTime, tool.endTime]);

  return (
    <div
      data-slot="ai-tool-inspector-item"
      data-status={tool.status}
      className={cn("", className)}
    >
      <button
        type="button"
        onClick={() => toggleExpanded(tool.id)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <span className="font-mono text-sm truncate">{tool.name}</span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium shrink-0",
              statusConfig.className,
            )}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </span>
        </div>
        {executionTime && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Timer className="size-3" />
            {executionTime}
          </span>
        )}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180",
          )}
        />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {tool.description && (
            <p className="text-sm text-muted-foreground">{tool.description}</p>
          )}
          <AiToolInspectorJson label="Input" data={tool.input} />
          {tool.output !== undefined && (
            <AiToolInspectorJson label="Output" data={tool.output} />
          )}
          {tool.error && (
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider">
                Error
              </span>
              <div className="rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-300 font-mono">
                {tool.error}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface AiToolInspectorJsonProps {
  label: string;
  data: unknown;
  className?: string;
}

function AiToolInspectorJson({
  label,
  data,
  className,
}: AiToolInspectorJsonProps) {
  const [copied, setCopied] = React.useState(false);

  const formattedJson = React.useMemo(
    () => JSON.stringify(data, null, 2),
    [data],
  );

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [formattedJson]);

  return (
    <div
      data-slot="ai-tool-inspector-json"
      className={cn("space-y-1.5", className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? (
            <>
              <CheckCheck className="size-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="rounded-md bg-muted/50 p-3 overflow-x-auto text-xs font-mono text-foreground">
        {formattedJson}
      </pre>
    </div>
  );
}

export {
  AiToolInspector,
  AiToolInspectorHeader,
  AiToolInspectorList,
  AiToolInspectorItem,
  AiToolInspectorJson,
};
export type { AiToolInspectorProps, ToolExecution, ToolExecutionStatus };
