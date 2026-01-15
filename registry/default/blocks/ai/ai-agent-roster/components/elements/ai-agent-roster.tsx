"use client";

import * as React from "react";

import {
  Bot,
  Check,
  ChevronRight,
  Clock,
  Cpu,
  Loader2,
  Power,
} from "lucide-react";

import { cn } from "@/lib/utils";

type AgentStatus = "active" | "idle" | "busy" | "offline";

interface RosterAgent {
  id: string;
  name: string;
  description?: string;
  matchOn?: string[];
  status: AgentStatus;
  icon?: React.ReactNode;
  model?: string;
}

interface AiAgentRosterContextValue {
  agents: RosterAgent[];
  activeAgentId?: string;
  layout: "grid" | "list";
  onSelect?: (agentId: string) => void;
}

const AiAgentRosterContext =
  React.createContext<AiAgentRosterContextValue | null>(null);

function useAgentRosterContext() {
  const context = React.useContext(AiAgentRosterContext);
  if (!context) {
    throw new Error(
      "AiAgentRoster components must be used within <AiAgentRoster>",
    );
  }
  return context;
}

interface AiAgentRosterProps {
  agents: RosterAgent[];
  activeAgentId?: string;
  onSelect?: (agentId: string) => void;
  layout?: "grid" | "list";
  children?: React.ReactNode;
  className?: string;
}

function AiAgentRoster({
  agents,
  activeAgentId,
  onSelect,
  layout = "grid",
  children,
  className,
}: AiAgentRosterProps) {
  const contextValue = React.useMemo(
    () => ({ agents, activeAgentId, layout, onSelect }),
    [agents, activeAgentId, layout, onSelect],
  );

  return (
    <AiAgentRosterContext.Provider value={contextValue}>
      <div
        data-slot="ai-agent-roster"
        data-layout={layout}
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground",
          className,
        )}
      >
        {children || <AiAgentRosterContent />}
      </div>
    </AiAgentRosterContext.Provider>
  );
}

interface AiAgentRosterHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

function AiAgentRosterHeader({
  children,
  className,
}: AiAgentRosterHeaderProps) {
  const { agents } = useAgentRosterContext();

  const activeCount = React.useMemo(
    () =>
      agents.filter((a) => a.status === "active" || a.status === "busy").length,
    [agents],
  );

  return (
    <div
      data-slot="ai-agent-roster-header"
      className={cn(
        "flex items-center justify-between border-b border-border px-4 py-3",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
          <Bot className="size-4 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">
            {children || "Agent Roster"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {activeCount} of {agents.length} active
          </p>
        </div>
      </div>
    </div>
  );
}

interface AiAgentRosterContentProps {
  children?: React.ReactNode;
  className?: string;
}

function AiAgentRosterContent({
  children,
  className,
}: AiAgentRosterContentProps) {
  const { agents, layout } = useAgentRosterContext();

  return (
    <div
      data-slot="ai-agent-roster-content"
      className={cn(
        "p-4",
        layout === "grid" ? "grid gap-3 sm:grid-cols-2" : "flex flex-col gap-2",
        className,
      )}
    >
      {children ||
        agents.map((agent) => <AiAgentCard key={agent.id} agent={agent} />)}
    </div>
  );
}

interface AiAgentCardProps {
  agent: RosterAgent;
  className?: string;
}

function AiAgentCard({ agent, className }: AiAgentCardProps) {
  const { activeAgentId, onSelect } = useAgentRosterContext();

  const isActive = activeAgentId === agent.id;

  const statusConfig = React.useMemo(() => {
    const configs: Record<
      AgentStatus,
      {
        icon: React.ReactNode;
        label: string;
        className: string;
        dotClassName: string;
      }
    > = {
      active: {
        icon: <Check className="size-3" />,
        label: "Active",
        className: "text-green-700 dark:text-green-400",
        dotClassName: "bg-green-500",
      },
      idle: {
        icon: <Clock className="size-3" />,
        label: "Idle",
        className: "text-muted-foreground",
        dotClassName: "bg-muted-foreground",
      },
      busy: {
        icon: <Loader2 className="size-3 animate-spin" />,
        label: "Busy",
        className: "text-blue-700 dark:text-blue-400",
        dotClassName: "bg-blue-500 animate-pulse",
      },
      offline: {
        icon: <Power className="size-3" />,
        label: "Offline",
        className: "text-muted-foreground/50",
        dotClassName: "bg-muted-foreground/50",
      },
    };
    return configs[agent.status];
  }, [agent.status]);

  const handleClick = React.useCallback(() => {
    if (onSelect && agent.status !== "offline") {
      onSelect(agent.id);
    }
  }, [onSelect, agent.id, agent.status]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (
        (e.key === "Enter" || e.key === " ") &&
        onSelect &&
        agent.status !== "offline"
      ) {
        e.preventDefault();
        onSelect(agent.id);
      }
    },
    [onSelect, agent.id, agent.status],
  );

  return (
    <div
      data-slot="ai-agent-card"
      data-status={agent.status}
      data-active={isActive}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect && agent.status !== "offline" ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg border bg-background p-3 transition-all",
        isActive
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-muted-foreground/30",
        onSelect && agent.status !== "offline" && "cursor-pointer",
        agent.status === "offline" && "opacity-60",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {agent.icon || <Cpu className="size-4" />}
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-sm truncate">{agent.name}</h4>
            {agent.model && (
              <p className="text-xs text-muted-foreground font-mono truncate">
                {agent.model}
              </p>
            )}
          </div>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium",
            statusConfig.className,
          )}
        >
          <span
            className={cn("size-2 rounded-full", statusConfig.dotClassName)}
          />
          <span className="hidden sm:inline">{statusConfig.label}</span>
        </div>
      </div>

      {agent.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {agent.description}
        </p>
      )}

      {agent.matchOn && agent.matchOn.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {agent.matchOn.slice(0, 3).map((pattern, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
            >
              {pattern}
            </span>
          ))}
          {agent.matchOn.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              +{agent.matchOn.length - 3}
            </span>
          )}
        </div>
      )}

      {onSelect && agent.status !== "offline" && (
        <ChevronRight
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5",
            isActive && "opacity-100 text-primary",
          )}
        />
      )}
    </div>
  );
}

interface AiAgentRosterEmptyProps {
  children?: React.ReactNode;
  className?: string;
}

function AiAgentRosterEmpty({ children, className }: AiAgentRosterEmptyProps) {
  return (
    <div
      data-slot="ai-agent-roster-empty"
      className={cn(
        "flex flex-col items-center justify-center py-8 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
        <Bot className="size-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">
        {children || "No agents available"}
      </p>
    </div>
  );
}

export {
  AiAgentRoster,
  AiAgentRosterHeader,
  AiAgentRosterContent,
  AiAgentCard,
  AiAgentRosterEmpty,
};
export type { AiAgentRosterProps, RosterAgent, AgentStatus };
