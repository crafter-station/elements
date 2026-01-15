"use client";

import * as React from "react";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import {
  Bot,
  Check,
  ChevronDown,
  Circle,
  Clock,
  Loader2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

type StageStatus = "pending" | "active" | "completed" | "error";

interface PipelineStage {
  id: string;
  name: string;
  description?: string;
  status: StageStatus;
  agent?: string;
  startTime?: Date;
  endTime?: Date;
}

interface AiPipelineContextValue {
  stages: PipelineStage[];
  orientation: "horizontal" | "vertical";
  expandedStages: Set<string>;
  toggleStage: (id: string) => void;
}

const AiPipelineContext = React.createContext<AiPipelineContextValue | null>(
  null,
);

function usePipelineContext() {
  const context = React.useContext(AiPipelineContext);
  if (!context) {
    throw new Error("AiPipeline components must be used within <AiPipeline>");
  }
  return context;
}

interface AiPipelineProps {
  stages: PipelineStage[];
  orientation?: "horizontal" | "vertical";
  defaultExpanded?: string[];
  children?: React.ReactNode;
  className?: string;
}

function AiPipeline({
  stages,
  orientation = "horizontal",
  defaultExpanded = [],
  children,
  className,
}: AiPipelineProps) {
  const [expandedStages, setExpandedStages] = React.useState<Set<string>>(
    () => new Set(defaultExpanded),
  );

  const toggleStage = React.useCallback((id: string) => {
    setExpandedStages((prev) => {
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
    () => ({ stages, orientation, expandedStages, toggleStage }),
    [stages, orientation, expandedStages, toggleStage],
  );

  const completedCount = stages.filter((s) => s.status === "completed").length;
  const progress =
    stages.length > 0 ? (completedCount / stages.length) * 100 : 0;

  return (
    <AiPipelineContext.Provider value={contextValue}>
      <div
        data-slot="ai-pipeline"
        data-orientation={orientation}
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground overflow-hidden",
          className,
        )}
      >
        {children ?? (
          <>
            <AiPipelineHeader progress={progress} />
            <AiPipelineContent />
          </>
        )}
      </div>
    </AiPipelineContext.Provider>
  );
}

interface AiPipelineHeaderProps {
  title?: string;
  progress?: number;
  children?: React.ReactNode;
  className?: string;
}

function AiPipelineHeader({
  title = "Pipeline",
  progress,
  children,
  className,
}: AiPipelineHeaderProps) {
  const { stages } = usePipelineContext();

  const completedCount = stages.filter((s) => s.status === "completed").length;
  const activeStage = stages.find((s) => s.status === "active");

  return (
    <div
      data-slot="ai-pipeline-header"
      className={cn("px-4 py-3 border-b border-border", className)}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-sm">{title}</h3>
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {completedCount}/{stages.length}
          </span>
        </div>
        {activeStage && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            {activeStage.name}
          </span>
        )}
        {children}
      </div>
      {progress !== undefined && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

interface AiPipelineContentProps {
  className?: string;
}

function AiPipelineContent({ className }: AiPipelineContentProps) {
  const { stages, orientation } = usePipelineContext();

  return (
    <div
      data-slot="ai-pipeline-content"
      className={cn(
        "p-4",
        orientation === "horizontal"
          ? "flex items-start gap-2 overflow-x-auto"
          : "space-y-2",
        className,
      )}
    >
      {stages.map((stage, index) => (
        <React.Fragment key={stage.id}>
          <AiPipelineStage stage={stage} />
          {index < stages.length - 1 && <AiPipelineConnector index={index} />}
        </React.Fragment>
      ))}
    </div>
  );
}

interface AiPipelineStageProps {
  stage: PipelineStage;
  className?: string;
}

function AiPipelineStage({ stage, className }: AiPipelineStageProps) {
  const { orientation, expandedStages, toggleStage } = usePipelineContext();
  const isExpanded = expandedStages.has(stage.id);

  const statusConfig = React.useMemo(() => {
    const configs: Record<
      StageStatus,
      {
        icon: React.ReactNode;
        className: string;
        bgClassName: string;
      }
    > = {
      pending: {
        icon: <Circle className="size-4" />,
        className: "text-muted-foreground",
        bgClassName: "bg-muted",
      },
      active: {
        icon: <Loader2 className="size-4 animate-spin" />,
        className: "text-blue-600 dark:text-blue-400",
        bgClassName: "bg-blue-100 dark:bg-blue-950",
      },
      completed: {
        icon: <Check className="size-4" />,
        className: "text-green-600 dark:text-green-400",
        bgClassName: "bg-green-100 dark:bg-green-950",
      },
      error: {
        icon: <X className="size-4" />,
        className: "text-red-600 dark:text-red-400",
        bgClassName: "bg-red-100 dark:bg-red-950",
      },
    };
    return configs[stage.status];
  }, [stage.status]);

  const formatDuration = React.useCallback((start: Date, end?: Date) => {
    const endTime = end ?? new Date();
    const durationMs = endTime.getTime() - start.getTime();
    const seconds = Math.floor(durationMs / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  }, []);

  if (orientation === "horizontal") {
    return (
      <CollapsiblePrimitive.Root
        open={isExpanded}
        onOpenChange={() => toggleStage(stage.id)}
      >
        <div
          data-slot="ai-pipeline-stage"
          data-status={stage.status}
          className={cn(
            "flex shrink-0 flex-col items-center",
            orientation === "horizontal" && "min-w-[120px]",
            className,
          )}
        >
          <CollapsiblePrimitive.Trigger
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg p-3 transition-colors",
              "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full transition-colors",
                statusConfig.bgClassName,
              )}
            >
              <span className={statusConfig.className}>
                {statusConfig.icon}
              </span>
            </div>
            <div className="text-center">
              <span className="text-sm font-medium">{stage.name}</span>
              {stage.agent && (
                <span className="mt-0.5 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Bot className="size-3" />
                  {stage.agent}
                </span>
              )}
            </div>
          </CollapsiblePrimitive.Trigger>
          <CollapsiblePrimitive.Content className="w-full data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="mt-2 rounded-lg border border-border bg-muted/30 p-3 text-xs">
              {stage.description && (
                <p className="text-muted-foreground">{stage.description}</p>
              )}
              {stage.startTime && (
                <div className="mt-2 flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3" />
                  {formatDuration(stage.startTime, stage.endTime)}
                </div>
              )}
            </div>
          </CollapsiblePrimitive.Content>
        </div>
      </CollapsiblePrimitive.Root>
    );
  }

  return (
    <CollapsiblePrimitive.Root
      open={isExpanded}
      onOpenChange={() => toggleStage(stage.id)}
    >
      <div
        data-slot="ai-pipeline-stage"
        data-status={stage.status}
        className={cn(
          "rounded-lg border border-border overflow-hidden",
          className,
        )}
      >
        <CollapsiblePrimitive.Trigger
          className={cn(
            "flex w-full items-center gap-3 p-3 text-left transition-colors",
            "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full",
              statusConfig.bgClassName,
            )}
          >
            <span className={statusConfig.className}>{statusConfig.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{stage.name}</span>
              {stage.agent && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Bot className="size-3" />
                  {stage.agent}
                </span>
              )}
            </div>
            {stage.startTime && (
              <span className="text-xs text-muted-foreground">
                {formatDuration(stage.startTime, stage.endTime)}
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
          />
        </CollapsiblePrimitive.Trigger>
        <CollapsiblePrimitive.Content className="border-t border-border data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          {stage.description && (
            <div className="p-3">
              <p className="text-sm text-muted-foreground">
                {stage.description}
              </p>
            </div>
          )}
        </CollapsiblePrimitive.Content>
      </div>
    </CollapsiblePrimitive.Root>
  );
}

interface AiPipelineConnectorProps {
  index: number;
  className?: string;
}

function AiPipelineConnector({ index, className }: AiPipelineConnectorProps) {
  const { stages, orientation } = usePipelineContext();

  const currentStage = stages[index];
  const nextStage = stages[index + 1];

  const isCompleted =
    currentStage?.status === "completed" || currentStage?.status === "error";
  const isActive = nextStage?.status === "active";

  if (orientation === "horizontal") {
    return (
      <div
        data-slot="ai-pipeline-connector"
        className={cn("flex h-10 shrink-0 items-center self-center", className)}
      >
        <div
          className={cn(
            "h-0.5 w-8 rounded-full transition-colors",
            isCompleted
              ? "bg-green-500 dark:bg-green-400"
              : isActive
                ? "bg-blue-500 dark:bg-blue-400 animate-pulse"
                : "bg-muted",
          )}
        />
      </div>
    );
  }

  return (
    <div
      data-slot="ai-pipeline-connector"
      className={cn("flex justify-center py-1", className)}
    >
      <div
        className={cn(
          "h-4 w-0.5 rounded-full transition-colors",
          isCompleted
            ? "bg-green-500 dark:bg-green-400"
            : isActive
              ? "bg-blue-500 dark:bg-blue-400 animate-pulse"
              : "bg-muted",
        )}
      />
    </div>
  );
}

interface AiPipelineCompactProps {
  stages: PipelineStage[];
  className?: string;
}

function AiPipelineCompact({ stages, className }: AiPipelineCompactProps) {
  const completedCount = stages.filter((s) => s.status === "completed").length;
  const activeStage = stages.find((s) => s.status === "active");
  const hasError = stages.some((s) => s.status === "error");

  return (
    <div
      data-slot="ai-pipeline-compact"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
        hasError && "border-red-300 dark:border-red-800",
        className,
      )}
    >
      <div className="flex items-center gap-1">
        {stages.map((stage) => (
          <div
            key={stage.id}
            title={stage.name}
            className={cn(
              "size-2 rounded-full transition-colors",
              stage.status === "pending" && "bg-muted",
              stage.status === "active" && "bg-blue-500 animate-pulse",
              stage.status === "completed" && "bg-green-500",
              stage.status === "error" && "bg-red-500",
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {hasError
          ? "Error"
          : activeStage
            ? activeStage.name
            : `${completedCount}/${stages.length}`}
      </span>
    </div>
  );
}

export {
  AiPipeline,
  AiPipelineHeader,
  AiPipelineContent,
  AiPipelineStage,
  AiPipelineConnector,
  AiPipelineCompact,
};
export type { AiPipelineProps, PipelineStage, StageStatus };
