"use client";

import * as React from "react";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import {
  ArrowRight,
  ChevronDown,
  Loader2,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import { cn } from "@/lib/utils";

type GuardrailStatus = "blocked" | "modified" | "approved" | "pending";
type GuardrailType = "input" | "output";

interface GuardrailCheck {
  id: string;
  type: GuardrailType;
  status: GuardrailStatus;
  category: string;
  reason?: string;
  originalContent?: string;
  modifiedContent?: string;
  confidence?: number;
}

interface AiGuardrailsContextValue {
  checks: GuardrailCheck[];
  onOverride?: (checkId: string) => void;
}

const AiGuardrailsContext =
  React.createContext<AiGuardrailsContextValue | null>(null);

function useGuardrailsContext() {
  const context = React.useContext(AiGuardrailsContext);
  if (!context) {
    throw new Error(
      "AiGuardrails components must be used within <AiGuardrails>",
    );
  }
  return context;
}

interface AiGuardrailsProps {
  checks: GuardrailCheck[];
  onOverride?: (checkId: string) => void;
  children?: React.ReactNode;
  className?: string;
}

function AiGuardrails({
  checks,
  onOverride,
  children,
  className,
}: AiGuardrailsProps) {
  const contextValue = React.useMemo(
    () => ({ checks, onOverride }),
    [checks, onOverride],
  );

  return (
    <AiGuardrailsContext.Provider value={contextValue}>
      <div
        data-slot="ai-guardrails"
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground",
          className,
        )}
      >
        {children || (
          <>
            <AiGuardrailsHeader />
            <AiGuardrailsContent />
          </>
        )}
      </div>
    </AiGuardrailsContext.Provider>
  );
}

interface AiGuardrailsHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

function AiGuardrailsHeader({ children, className }: AiGuardrailsHeaderProps) {
  const { checks } = useGuardrailsContext();

  const summary = React.useMemo(() => {
    const blocked = checks.filter((c) => c.status === "blocked").length;
    const modified = checks.filter((c) => c.status === "modified").length;
    const approved = checks.filter((c) => c.status === "approved").length;
    const pending = checks.filter((c) => c.status === "pending").length;
    return { blocked, modified, approved, pending };
  }, [checks]);

  const overallStatus = React.useMemo(() => {
    if (summary.blocked > 0) return "blocked";
    if (summary.pending > 0) return "pending";
    if (summary.modified > 0) return "modified";
    return "approved";
  }, [summary]);

  const statusConfig = React.useMemo(() => {
    const configs: Record<
      GuardrailStatus,
      { icon: React.ReactNode; className: string; bgClassName: string }
    > = {
      blocked: {
        icon: <ShieldX className="size-4" />,
        className: "text-red-700 dark:text-red-400",
        bgClassName: "bg-red-100 dark:bg-red-950",
      },
      modified: {
        icon: <ShieldAlert className="size-4" />,
        className: "text-amber-700 dark:text-amber-400",
        bgClassName: "bg-amber-100 dark:bg-amber-950",
      },
      approved: {
        icon: <ShieldCheck className="size-4" />,
        className: "text-green-700 dark:text-green-400",
        bgClassName: "bg-green-100 dark:bg-green-950",
      },
      pending: {
        icon: <Loader2 className="size-4 animate-spin" />,
        className: "text-muted-foreground",
        bgClassName: "bg-muted",
      },
    };
    return configs[overallStatus];
  }, [overallStatus]);

  return (
    <div
      data-slot="ai-guardrails-header"
      className={cn(
        "flex items-center justify-between border-b border-border px-4 py-3",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md",
            statusConfig.bgClassName,
            statusConfig.className,
          )}
        >
          {statusConfig.icon}
        </div>
        <div>
          <h3 className="font-semibold text-sm">
            {children || "Content Guardrails"}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {summary.blocked > 0 && (
              <span className="text-red-600 dark:text-red-400">
                {summary.blocked} blocked
              </span>
            )}
            {summary.modified > 0 && (
              <span className="text-amber-600 dark:text-amber-400">
                {summary.modified} modified
              </span>
            )}
            {summary.approved > 0 && (
              <span className="text-green-600 dark:text-green-400">
                {summary.approved} approved
              </span>
            )}
            {summary.pending > 0 && <span>{summary.pending} pending</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AiGuardrailsContentProps {
  children?: React.ReactNode;
  className?: string;
}

function AiGuardrailsContent({
  children,
  className,
}: AiGuardrailsContentProps) {
  const { checks } = useGuardrailsContext();

  return (
    <div
      data-slot="ai-guardrails-content"
      className={cn("p-4 space-y-2", className)}
    >
      {children ||
        checks.map((check) => (
          <AiGuardrailCheck key={check.id} check={check} />
        ))}
    </div>
  );
}

interface AiGuardrailCheckProps {
  check: GuardrailCheck;
  className?: string;
}

function AiGuardrailCheck({ check, className }: AiGuardrailCheckProps) {
  const { onOverride } = useGuardrailsContext();
  const [isOpen, setIsOpen] = React.useState(check.status === "blocked");

  const statusConfig = React.useMemo(() => {
    const configs: Record<
      GuardrailStatus,
      {
        icon: React.ReactNode;
        label: string;
        className: string;
        borderClassName: string;
        bgClassName: string;
      }
    > = {
      blocked: {
        icon: <ShieldX className="size-3.5" />,
        label: "Blocked",
        className: "text-red-700 dark:text-red-400",
        borderClassName: "border-red-200 dark:border-red-900",
        bgClassName: "bg-red-50 dark:bg-red-950/30",
      },
      modified: {
        icon: <ShieldAlert className="size-3.5" />,
        label: "Modified",
        className: "text-amber-700 dark:text-amber-400",
        borderClassName: "border-amber-200 dark:border-amber-900",
        bgClassName: "bg-amber-50 dark:bg-amber-950/30",
      },
      approved: {
        icon: <ShieldCheck className="size-3.5" />,
        label: "Approved",
        className: "text-green-700 dark:text-green-400",
        borderClassName: "border-green-200 dark:border-green-900",
        bgClassName: "bg-green-50 dark:bg-green-950/30",
      },
      pending: {
        icon: <Loader2 className="size-3.5 animate-spin" />,
        label: "Checking...",
        className: "text-muted-foreground",
        borderClassName: "border-border",
        bgClassName: "bg-muted/30",
      },
    };
    return configs[check.status];
  }, [check.status]);

  const hasDetails =
    check.reason ||
    check.originalContent ||
    check.modifiedContent ||
    check.confidence !== undefined;

  return (
    <CollapsiblePrimitive.Root
      data-slot="ai-guardrail-check"
      data-status={check.status}
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        "rounded-lg border overflow-hidden transition-colors",
        statusConfig.borderClassName,
        statusConfig.bgClassName,
        className,
      )}
    >
      <CollapsiblePrimitive.Trigger
        className={cn(
          "flex w-full items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5",
          !hasDetails && "cursor-default",
        )}
        disabled={!hasDetails}
      >
        <div
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-md",
            statusConfig.bgClassName,
            statusConfig.className,
          )}
        >
          {statusConfig.icon}
        </div>
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <span className="font-medium text-sm capitalize">
            {check.category.replace(/[-_]/g, " ")}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              statusConfig.bgClassName,
              statusConfig.className,
            )}
          >
            {statusConfig.label}
          </span>
          <span className="text-xs text-muted-foreground capitalize">
            ({check.type})
          </span>
        </div>
        {check.confidence !== undefined && (
          <span className="text-xs text-muted-foreground font-mono">
            {Math.round(check.confidence * 100)}%
          </span>
        )}
        {hasDetails && (
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        )}
      </CollapsiblePrimitive.Trigger>

      {hasDetails && (
        <CollapsiblePrimitive.Content className="border-t border-inherit data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="px-3 py-2.5 space-y-3">
            {check.reason && (
              <p className="text-sm text-muted-foreground">{check.reason}</p>
            )}

            {(check.originalContent || check.modifiedContent) && (
              <AiGuardrailDiff
                original={check.originalContent}
                modified={check.modifiedContent}
              />
            )}

            {onOverride && check.status === "blocked" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onOverride(check.id)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-background border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <RotateCcw className="size-3" />
                  Override
                </button>
              </div>
            )}
          </div>
        </CollapsiblePrimitive.Content>
      )}
    </CollapsiblePrimitive.Root>
  );
}

interface AiGuardrailDiffProps {
  original?: string;
  modified?: string;
  className?: string;
}

function AiGuardrailDiff({
  original,
  modified,
  className,
}: AiGuardrailDiffProps) {
  if (!original && !modified) return null;

  return (
    <div data-slot="ai-guardrail-diff" className={cn("space-y-2", className)}>
      {original && modified ? (
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
              Original
            </span>
            <div className="rounded-md bg-red-100/50 dark:bg-red-950/50 p-2 text-xs font-mono text-foreground line-through opacity-70">
              {original}
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground shrink-0 mt-6" />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
              Modified
            </span>
            <div className="rounded-md bg-green-100/50 dark:bg-green-950/50 p-2 text-xs font-mono text-foreground">
              {modified}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
            {original ? "Blocked Content" : "Modified Content"}
          </span>
          <div
            className={cn(
              "rounded-md p-2 text-xs font-mono text-foreground",
              original
                ? "bg-red-100/50 dark:bg-red-950/50 line-through opacity-70"
                : "bg-green-100/50 dark:bg-green-950/50",
            )}
          >
            {original || modified}
          </div>
        </div>
      )}
    </div>
  );
}

interface AiGuardrailsEmptyProps {
  children?: React.ReactNode;
  className?: string;
}

function AiGuardrailsEmpty({ children, className }: AiGuardrailsEmptyProps) {
  return (
    <div
      data-slot="ai-guardrails-empty"
      className={cn(
        "flex flex-col items-center justify-center py-8 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950 mb-3">
        <Shield className="size-6 text-green-600 dark:text-green-400" />
      </div>
      <p className="text-sm text-muted-foreground">
        {children || "All content checks passed"}
      </p>
    </div>
  );
}

export {
  AiGuardrails,
  AiGuardrailsHeader,
  AiGuardrailsContent,
  AiGuardrailCheck,
  AiGuardrailDiff,
  AiGuardrailsEmpty,
};
export type {
  AiGuardrailsProps,
  GuardrailCheck,
  GuardrailStatus,
  GuardrailType,
};
