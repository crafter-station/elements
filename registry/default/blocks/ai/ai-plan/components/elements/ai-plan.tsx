"use client";

import * as React from "react";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown, ClipboardList, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface AiPlanContextValue {
  isStreaming: boolean;
  isOpen: boolean;
}

const AiPlanContext = React.createContext<AiPlanContextValue | null>(null);

function usePlanContext() {
  const context = React.useContext(AiPlanContext);
  if (!context) {
    throw new Error("AiPlan components must be used within <AiPlan>");
  }
  return context;
}

interface AiPlanProps {
  isStreaming?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

function AiPlan({
  isStreaming = false,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  children,
  className,
}: AiPlanProps) {
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

  React.useEffect(() => {
    if (isStreaming) {
      handleOpenChange(true);
    }
  }, [isStreaming, handleOpenChange]);

  const contextValue = React.useMemo(
    () => ({ isStreaming, isOpen }),
    [isStreaming, isOpen],
  );

  return (
    <AiPlanContext.Provider value={contextValue}>
      <CollapsiblePrimitive.Root
        data-slot="ai-plan"
        data-streaming={isStreaming}
        open={isOpen}
        onOpenChange={handleOpenChange}
        className={cn(
          "rounded-lg border bg-card text-card-foreground overflow-hidden transition-all",
          isStreaming
            ? "border-indigo-300 dark:border-indigo-800 shadow-lg shadow-indigo-100 dark:shadow-indigo-950/50"
            : "border-border",
          className,
        )}
      >
        {children}
      </CollapsiblePrimitive.Root>
    </AiPlanContext.Provider>
  );
}

interface AiPlanHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

function AiPlanHeader({ children, className }: AiPlanHeaderProps) {
  const { isStreaming, isOpen } = usePlanContext();

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="ai-plan-header"
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
          isStreaming ? "bg-indigo-100 dark:bg-indigo-950" : "bg-muted",
        )}
      >
        {isStreaming ? (
          <Sparkles className="size-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
        ) : (
          <ClipboardList className="size-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex flex-1 items-center text-left">{children}</div>
      <ChevronDown
        className={cn(
          "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180",
        )}
      />
    </CollapsiblePrimitive.Trigger>
  );
}

interface AiPlanTitleProps {
  children?: React.ReactNode;
  className?: string;
}

function AiPlanTitle({ children, className }: AiPlanTitleProps) {
  const { isStreaming } = usePlanContext();

  return (
    <h3
      data-slot="ai-plan-title"
      className={cn(
        "font-semibold",
        isStreaming && "text-indigo-700 dark:text-indigo-300",
        className,
      )}
    >
      {children}
      {isStreaming && (
        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
          Generating...
        </span>
      )}
    </h3>
  );
}

interface AiPlanDescriptionProps {
  children?: React.ReactNode;
  className?: string;
}

function AiPlanDescription({ children, className }: AiPlanDescriptionProps) {
  return (
    <p
      data-slot="ai-plan-description"
      className={cn("text-xs text-muted-foreground mt-0.5", className)}
    >
      {children}
    </p>
  );
}

interface AiPlanContentProps {
  children?: React.ReactNode;
  className?: string;
}

function AiPlanContent({ children, className }: AiPlanContentProps) {
  const { isStreaming } = usePlanContext();

  return (
    <CollapsiblePrimitive.Content
      data-slot="ai-plan-content"
      className={cn(
        "border-t data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
        isStreaming
          ? "border-indigo-200 dark:border-indigo-900"
          : "border-border",
        className,
      )}
    >
      <div className={cn("p-4", isStreaming && "relative overflow-hidden")}>
        {isStreaming && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/50 dark:via-indigo-900/30 to-transparent animate-shimmer" />
        )}
        {children}
      </div>
    </CollapsiblePrimitive.Content>
  );
}

interface AiPlanFooterProps {
  children?: React.ReactNode;
  className?: string;
}

function AiPlanFooter({ children, className }: AiPlanFooterProps) {
  const { isStreaming } = usePlanContext();

  return (
    <div
      data-slot="ai-plan-footer"
      className={cn(
        "flex items-center justify-end gap-2 border-t px-4 py-3",
        isStreaming
          ? "border-indigo-200 dark:border-indigo-900"
          : "border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface AiPlanActionProps {
  variant?: "primary" | "secondary" | "destructive";
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

function AiPlanAction({
  variant = "secondary",
  disabled = false,
  onClick,
  children,
  className,
}: AiPlanActionProps) {
  const { isStreaming } = usePlanContext();

  const variantStyles = React.useMemo(() => {
    const styles: Record<string, string> = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50",
      secondary:
        "bg-muted text-foreground hover:bg-muted/80 disabled:bg-muted/50",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/50",
    };
    return styles[variant];
  }, [variant]);

  return (
    <button
      type="button"
      data-slot="ai-plan-action"
      data-variant={variant}
      disabled={disabled || isStreaming}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles,
        className,
      )}
    >
      {children}
    </button>
  );
}

interface AiPlanStepProps {
  number: number;
  children?: React.ReactNode;
  className?: string;
}

function AiPlanStep({ number, children, className }: AiPlanStepProps) {
  return (
    <div
      data-slot="ai-plan-step"
      className={cn("flex gap-3 items-start", className)}
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
        {number}
      </span>
      <div className="flex-1 text-sm">{children}</div>
    </div>
  );
}

export {
  AiPlan,
  AiPlanHeader,
  AiPlanTitle,
  AiPlanDescription,
  AiPlanContent,
  AiPlanFooter,
  AiPlanAction,
  AiPlanStep,
};
export type { AiPlanProps };
