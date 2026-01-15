"use client";

import * as React from "react";

import {
  ArrowRight,
  Bot,
  Brain,
  Check,
  Clock,
  Loader2,
  Pause,
} from "lucide-react";

import { cn } from "@/lib/utils";

type AgentStatus =
  | "idle"
  | "thinking"
  | "acting"
  | "waiting"
  | "done"
  | "handoff";

interface AgentInfo {
  name: string;
  icon?: React.ReactNode;
  description?: string;
}

interface AiAgentStatusContextValue {
  agent: AgentInfo;
  status: AgentStatus;
  handoffTo?: string;
  variant: "badge" | "card";
}

const AiAgentStatusContext =
  React.createContext<AiAgentStatusContextValue | null>(null);

function useAgentStatusContext() {
  const context = React.useContext(AiAgentStatusContext);
  if (!context) {
    throw new Error(
      "AiAgentStatus components must be used within <AiAgentStatus>",
    );
  }
  return context;
}

interface AiAgentStatusProps {
  agent: AgentInfo;
  status: AgentStatus;
  handoffTo?: string;
  variant?: "badge" | "card";
  children?: React.ReactNode;
  className?: string;
}

function AiAgentStatus({
  agent,
  status,
  handoffTo,
  variant = "badge",
  children,
  className,
}: AiAgentStatusProps) {
  const contextValue = React.useMemo(
    () => ({ agent, status, handoffTo, variant }),
    [agent, status, handoffTo, variant],
  );

  if (variant === "badge") {
    return (
      <AiAgentStatusContext.Provider value={contextValue}>
        <AiAgentStatusBadge className={className}>
          {children}
        </AiAgentStatusBadge>
      </AiAgentStatusContext.Provider>
    );
  }

  return (
    <AiAgentStatusContext.Provider value={contextValue}>
      <AiAgentStatusCard className={className}>{children}</AiAgentStatusCard>
    </AiAgentStatusContext.Provider>
  );
}

interface AiAgentStatusBadgeProps {
  children?: React.ReactNode;
  className?: string;
}

function AiAgentStatusBadge({ children, className }: AiAgentStatusBadgeProps) {
  const { agent, status, handoffTo } = useAgentStatusContext();

  const statusConfig = React.useMemo(() => {
    const configs: Record<
      AgentStatus,
      { icon: React.ReactNode; label: string; className: string }
    > = {
      idle: {
        icon: <Clock className="size-3" />,
        label: "Idle",
        className: "bg-muted text-muted-foreground",
      },
      thinking: {
        icon: <Brain className="size-3 animate-pulse" />,
        label: "Thinking",
        className:
          "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
      },
      acting: {
        icon: <Loader2 className="size-3 animate-spin" />,
        label: "Acting",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      },
      waiting: {
        icon: <Pause className="size-3" />,
        label: "Waiting",
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      },
      done: {
        icon: <Check className="size-3" />,
        label: "Done",
        className:
          "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
      },
      handoff: {
        icon: <ArrowRight className="size-3 animate-pulse" />,
        label: "Handing off",
        className:
          "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
      },
    };
    return configs[status];
  }, [status]);

  const isActive = status === "thinking" || status === "acting";

  return (
    <div
      data-slot="ai-agent-status"
      data-status={status}
      data-variant="badge"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
        isActive && "ring-2 ring-offset-2 ring-offset-background",
        status === "thinking" && "ring-purple-500/50",
        status === "acting" && "ring-blue-500/50",
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="relative flex size-5 shrink-0 items-center justify-center">
          {agent.icon ?? <Bot className="size-4" />}
          {isActive && (
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </span>
        <span className="font-medium">{agent.name}</span>
      </div>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
          statusConfig.className,
        )}
      >
        {statusConfig.icon}
        {statusConfig.label}
      </span>
      {status === "handoff" && handoffTo && (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ArrowRight className="size-3" />
          <span>{handoffTo}</span>
        </span>
      )}
      {children}
    </div>
  );
}

interface AiAgentStatusCardProps {
  children?: React.ReactNode;
  className?: string;
}

function AiAgentStatusCard({ children, className }: AiAgentStatusCardProps) {
  const { agent, status, handoffTo } = useAgentStatusContext();

  const statusConfig = React.useMemo(() => {
    const configs: Record<
      AgentStatus,
      {
        icon: React.ReactNode;
        label: string;
        className: string;
        borderClassName: string;
      }
    > = {
      idle: {
        icon: <Clock className="size-4" />,
        label: "Idle",
        className: "bg-muted text-muted-foreground",
        borderClassName: "border-border",
      },
      thinking: {
        icon: <Brain className="size-4 animate-pulse" />,
        label: "Thinking",
        className:
          "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
        borderClassName: "border-purple-300 dark:border-purple-800",
      },
      acting: {
        icon: <Loader2 className="size-4 animate-spin" />,
        label: "Acting",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
        borderClassName: "border-blue-300 dark:border-blue-800",
      },
      waiting: {
        icon: <Pause className="size-4" />,
        label: "Waiting",
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        borderClassName: "border-amber-300 dark:border-amber-800",
      },
      done: {
        icon: <Check className="size-4" />,
        label: "Done",
        className:
          "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
        borderClassName: "border-green-300 dark:border-green-800",
      },
      handoff: {
        icon: <ArrowRight className="size-4 animate-pulse" />,
        label: "Handing off",
        className:
          "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
        borderClassName: "border-orange-300 dark:border-orange-800",
      },
    };
    return configs[status];
  }, [status]);

  const isActive = status === "thinking" || status === "acting";

  return (
    <div
      data-slot="ai-agent-status"
      data-status={status}
      data-variant="card"
      className={cn(
        "rounded-lg border bg-card p-4 text-card-foreground transition-colors",
        statusConfig.borderClassName,
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          {agent.icon ?? <Bot className="size-5 text-muted-foreground" />}
          {isActive && (
            <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-background bg-green-500 animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">{agent.name}</h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                statusConfig.className,
              )}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </span>
          </div>
          {agent.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {agent.description}
            </p>
          )}
          {status === "handoff" && handoffTo && (
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowRight className="size-3" />
              <span>
                Transferring to <span className="font-medium">{handoffTo}</span>
              </span>
            </div>
          )}
        </div>
      </div>
      {children && <div className="mt-3 border-t pt-3">{children}</div>}
    </div>
  );
}

interface AiAgentStatusActionsProps {
  children?: React.ReactNode;
  className?: string;
}

function AiAgentStatusActions({
  children,
  className,
}: AiAgentStatusActionsProps) {
  return (
    <div
      data-slot="ai-agent-status-actions"
      className={cn("flex items-center gap-2", className)}
    >
      {children}
    </div>
  );
}

export {
  AiAgentStatus,
  AiAgentStatusBadge,
  AiAgentStatusCard,
  AiAgentStatusActions,
};
export type { AiAgentStatusProps, AgentInfo, AgentStatus };
