"use client";

import * as React from "react";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  FileCode,
  ListTodo,
  Loader2,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

type TaskStatus = "pending" | "in-progress" | "completed" | "error";

interface TaskItem {
  id: string;
  title: string;
  status: TaskStatus;
  description?: string;
}

interface AiTaskListContextValue {
  tasks: TaskItem[];
  completedCount: number;
  totalCount: number;
}

const AiTaskListContext = React.createContext<AiTaskListContextValue | null>(
  null,
);

function useTaskListContext() {
  const context = React.useContext(AiTaskListContext);
  if (!context) {
    throw new Error("AiTaskList components must be used within <AiTaskList>");
  }
  return context;
}

interface AiTaskListProps {
  title?: string;
  tasks?: TaskItem[];
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

function AiTaskList({
  title = "Tasks",
  tasks = [],
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  children,
  className,
}: AiTaskListProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(open);
      }
      onOpenChange?.(open);
    },
    [isControlled, onOpenChange],
  );

  const completedCount = React.useMemo(
    () => tasks.filter((t) => t.status === "completed").length,
    [tasks],
  );

  const contextValue = React.useMemo(
    () => ({
      tasks,
      completedCount,
      totalCount: tasks.length,
    }),
    [tasks, completedCount],
  );

  const hasChildren = React.Children.count(children) > 0;

  return (
    <AiTaskListContext.Provider value={contextValue}>
      <CollapsiblePrimitive.Root
        data-slot="ai-task-list"
        open={isOpen}
        onOpenChange={handleOpenChange}
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground overflow-hidden",
          className,
        )}
      >
        <CollapsiblePrimitive.Trigger
          data-slot="ai-task-list-trigger"
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <ListTodo className="size-4 text-muted-foreground" />
          </div>
          <div className="flex flex-1 items-center gap-2 text-left">
            <span className="font-medium">{title}</span>
            {tasks.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {completedCount}/{tasks.length}
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </CollapsiblePrimitive.Trigger>

        <CollapsiblePrimitive.Content
          data-slot="ai-task-list-content"
          className="border-t border-border data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
        >
          <div className="p-3 space-y-1">
            {hasChildren
              ? children
              : tasks.map((task) => (
                  <AiTaskListItem
                    key={task.id}
                    status={task.status}
                    description={task.description}
                  >
                    {task.title}
                  </AiTaskListItem>
                ))}
          </div>
        </CollapsiblePrimitive.Content>
      </CollapsiblePrimitive.Root>
    </AiTaskListContext.Provider>
  );
}

interface AiTaskListItemProps {
  status: TaskStatus;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function AiTaskListItem({
  status,
  description,
  children,
  className,
}: AiTaskListItemProps) {
  const statusConfig = React.useMemo(() => {
    const configs: Record<
      TaskStatus,
      { icon: React.ReactNode; className: string }
    > = {
      pending: {
        icon: <Circle className="size-4" />,
        className: "text-muted-foreground",
      },
      "in-progress": {
        icon: <Loader2 className="size-4 animate-spin" />,
        className: "text-blue-600 dark:text-blue-400",
      },
      completed: {
        icon: <CheckCircle2 className="size-4" />,
        className: "text-green-600 dark:text-green-400",
      },
      error: {
        icon: <XCircle className="size-4" />,
        className: "text-red-600 dark:text-red-400",
      },
    };
    return configs[status];
  }, [status]);

  return (
    <div
      data-slot="ai-task-list-item"
      data-status={status}
      className={cn(
        "flex items-start gap-3 rounded-md px-3 py-2 transition-colors",
        status === "in-progress" && "bg-blue-50 dark:bg-blue-950/30",
        status === "error" && "bg-red-50 dark:bg-red-950/30",
        className,
      )}
    >
      <div className={cn("mt-0.5 shrink-0", statusConfig.className)}>
        {statusConfig.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-sm font-medium",
            status === "completed" && "text-muted-foreground line-through",
          )}
        >
          {children}
        </div>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

interface AiTaskListFileProps {
  filename: string;
  language?: string;
  className?: string;
}

function AiTaskListFile({
  filename,
  language,
  className,
}: AiTaskListFileProps) {
  return (
    <div
      data-slot="ai-task-list-file"
      className={cn(
        "inline-flex items-center gap-1.5 rounded bg-muted px-2 py-1 text-xs font-mono",
        className,
      )}
    >
      <FileCode className="size-3 text-muted-foreground" />
      <span className="text-foreground">{filename}</span>
      {language && <span className="text-muted-foreground">({language})</span>}
    </div>
  );
}

interface AiTaskListProgressProps {
  className?: string;
}

function AiTaskListProgress({ className }: AiTaskListProgressProps) {
  const { completedCount, totalCount } = useTaskListContext();

  const percentage = React.useMemo(() => {
    if (totalCount === 0) return 0;
    return Math.round((completedCount / totalCount) * 100);
  }, [completedCount, totalCount]);

  return (
    <div
      data-slot="ai-task-list-progress"
      className={cn("space-y-1", className)}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">
          {completedCount} of {totalCount} ({percentage}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export { AiTaskList, AiTaskListItem, AiTaskListFile, AiTaskListProgress };
export type { AiTaskListProps, TaskItem, TaskStatus };
