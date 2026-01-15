"use client";

import * as React from "react";

import { Bot, ChevronRight, Clock, Info } from "lucide-react";

import { cn } from "@/lib/utils";

interface Handoff {
  id: string;
  fromAgent: string;
  toAgent: string;
  reason?: string;
  timestamp: Date;
  isActive?: boolean;
}

interface AiHandoffChainContextValue {
  handoffs: Handoff[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const AiHandoffChainContext =
  React.createContext<AiHandoffChainContextValue | null>(null);

function useHandoffChainContext() {
  const context = React.useContext(AiHandoffChainContext);
  if (!context) {
    throw new Error(
      "AiHandoffChain components must be used within <AiHandoffChain>",
    );
  }
  return context;
}

interface AiHandoffChainProps {
  handoffs: Handoff[];
  onSelect?: (handoff: Handoff | null) => void;
  children?: React.ReactNode;
  className?: string;
}

function AiHandoffChain({
  handoffs,
  onSelect,
  children,
  className,
}: AiHandoffChainProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleSelect = React.useCallback(
    (id: string | null) => {
      setSelectedId(id);
      const handoff = id ? (handoffs.find((h) => h.id === id) ?? null) : null;
      onSelect?.(handoff);
    },
    [handoffs, onSelect],
  );

  const contextValue = React.useMemo(
    () => ({ handoffs, selectedId, onSelect: handleSelect }),
    [handoffs, selectedId, handleSelect],
  );

  const agents = React.useMemo(() => {
    if (handoffs.length === 0) return [];

    const agentNames = [handoffs[0].fromAgent];
    for (const handoff of handoffs) {
      agentNames.push(handoff.toAgent);
    }
    return agentNames.map((name, index) => ({
      name,
      isActive:
        index === agentNames.length - 1 &&
        handoffs[handoffs.length - 1]?.isActive,
      handoffIndex: index > 0 ? index - 1 : null,
    }));
  }, [handoffs]);

  return (
    <AiHandoffChainContext.Provider value={contextValue}>
      <div
        data-slot="ai-handoff-chain"
        className={cn("flex flex-col gap-2", className)}
      >
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {agents.map((agent, index) => (
            <React.Fragment key={`${agent.name}-${index}`}>
              <AiHandoffChainNode
                name={agent.name}
                isActive={agent.isActive}
                handoffId={
                  agent.handoffIndex !== null
                    ? handoffs[agent.handoffIndex]?.id
                    : undefined
                }
              />
              {index < agents.length - 1 && (
                <AiHandoffChainArrow
                  handoffId={handoffs[index]?.id}
                  hasReason={!!handoffs[index]?.reason}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        {children}
      </div>
    </AiHandoffChainContext.Provider>
  );
}

interface AiHandoffChainNodeProps {
  name: string;
  isActive?: boolean;
  handoffId?: string;
  icon?: React.ReactNode;
  className?: string;
}

function AiHandoffChainNode({
  name,
  isActive,
  handoffId,
  icon,
  className,
}: AiHandoffChainNodeProps) {
  const { selectedId, onSelect } = useHandoffChainContext();

  const isSelected = handoffId !== undefined && selectedId === handoffId;

  const handleClick = React.useCallback(() => {
    if (handoffId !== undefined) {
      onSelect(isSelected ? null : handoffId);
    }
  }, [handoffId, isSelected, onSelect]);

  return (
    <button
      type="button"
      data-slot="ai-handoff-chain-node"
      data-active={isActive}
      data-selected={isSelected}
      onClick={handleClick}
      disabled={handoffId === undefined}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
        "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive &&
          "border-green-300 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
        !isActive && "border-border bg-card text-card-foreground",
        isSelected &&
          "ring-2 ring-primary ring-offset-2 ring-offset-background",
        handoffId === undefined && "cursor-default hover:bg-transparent",
        className,
      )}
    >
      <span className="relative flex size-4 items-center justify-center">
        {icon ?? <Bot className="size-4" />}
        {isActive && (
          <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-green-500 animate-pulse" />
        )}
      </span>
      <span>{name}</span>
    </button>
  );
}

interface AiHandoffChainArrowProps {
  handoffId?: string;
  hasReason?: boolean;
  className?: string;
}

function AiHandoffChainArrow({
  handoffId,
  hasReason,
  className,
}: AiHandoffChainArrowProps) {
  const { selectedId, onSelect, handoffs } = useHandoffChainContext();

  const handoff = handoffId
    ? handoffs.find((h) => h.id === handoffId)
    : undefined;
  const isSelected = handoffId !== undefined && selectedId === handoffId;

  const handleClick = React.useCallback(() => {
    if (handoffId !== undefined) {
      onSelect(isSelected ? null : handoffId);
    }
  }, [handoffId, isSelected, onSelect]);

  return (
    <button
      type="button"
      data-slot="ai-handoff-chain-arrow"
      onClick={handleClick}
      disabled={!hasReason}
      title={handoff?.reason}
      className={cn(
        "group relative flex shrink-0 items-center px-1 transition-colors",
        hasReason &&
          "cursor-pointer hover:text-primary focus-visible:outline-none focus-visible:text-primary",
        !hasReason && "cursor-default text-muted-foreground",
        className,
      )}
    >
      <ChevronRight className="size-4" />
      {hasReason && (
        <Info className="absolute -top-1 -right-1 size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  );
}

interface AiHandoffChainDetailProps {
  className?: string;
}

function AiHandoffChainDetail({ className }: AiHandoffChainDetailProps) {
  const { selectedId, handoffs } = useHandoffChainContext();

  const selectedHandoff = selectedId
    ? handoffs.find((h) => h.id === selectedId)
    : null;

  if (!selectedHandoff) {
    return null;
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  return (
    <div
      data-slot="ai-handoff-chain-detail"
      className={cn(
        "rounded-lg border border-border bg-muted/30 p-3 text-sm animate-in fade-in slide-in-from-top-2",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="font-medium">
              {selectedHandoff.fromAgent}{" "}
              <span className="text-muted-foreground">to</span>{" "}
              {selectedHandoff.toAgent}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {formatTime(selectedHandoff.timestamp)}
            </div>
          </div>
          {selectedHandoff.reason && (
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedHandoff.reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface AiHandoffChainTimelineProps {
  className?: string;
}

function AiHandoffChainTimeline({ className }: AiHandoffChainTimelineProps) {
  const { handoffs, selectedId, onSelect } = useHandoffChainContext();

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (handoffs.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="ai-handoff-chain-timeline"
      className={cn("space-y-2", className)}
    >
      {handoffs.map((handoff, index) => {
        const isSelected = selectedId === handoff.id;
        const isLast = index === handoffs.length - 1;

        return (
          <button
            key={handoff.id}
            type="button"
            onClick={() => onSelect(isSelected ? null : handoff.id)}
            className={cn(
              "relative flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all",
              "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected && "border-primary bg-muted/30",
              !isSelected && "border-border",
            )}
          >
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border-2",
                  handoff.isActive
                    ? "border-green-500 bg-green-100 dark:bg-green-950"
                    : "border-muted-foreground/30 bg-muted",
                )}
              >
                <span className="text-xs font-medium">{index + 1}</span>
              </div>
              {!isLast && (
                <div className="mt-1 h-4 w-0.5 rounded-full bg-muted" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <span>{handoff.fromAgent}</span>
                  <ChevronRight className="size-3 text-muted-foreground" />
                  <span>{handoff.toAgent}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTime(handoff.timestamp)}
                </span>
              </div>
              {handoff.reason && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {handoff.reason}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export {
  AiHandoffChain,
  AiHandoffChainNode,
  AiHandoffChainArrow,
  AiHandoffChainDetail,
  AiHandoffChainTimeline,
};
export type { AiHandoffChainProps, Handoff };
