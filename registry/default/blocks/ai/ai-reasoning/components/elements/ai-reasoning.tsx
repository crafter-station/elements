"use client";

import * as React from "react";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface AiReasoningContextValue {
  isStreaming: boolean;
  isOpen: boolean;
  thinkingDuration: number | null;
}

const AiReasoningContext = React.createContext<AiReasoningContextValue | null>(
  null
);

function useReasoningContext() {
  const context = React.useContext(AiReasoningContext);
  if (!context) {
    throw new Error("AiReasoning components must be used within <AiReasoning>");
  }
  return context;
}

interface AiReasoningProps {
  isStreaming?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  thinkingDuration?: number | null;
  children?: React.ReactNode;
  className?: string;
}

function AiReasoning({
  isStreaming = false,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  thinkingDuration = null,
  children,
  className,
}: AiReasoningProps) {
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
    [isControlled, onOpenChange]
  );

  React.useEffect(() => {
    if (isStreaming) {
      handleOpenChange(true);
    }
  }, [isStreaming, handleOpenChange]);

  const contextValue = React.useMemo(
    () => ({ isStreaming, isOpen, thinkingDuration }),
    [isStreaming, isOpen, thinkingDuration]
  );

  return (
    <AiReasoningContext.Provider value={contextValue}>
      <CollapsiblePrimitive.Root
        data-slot="ai-reasoning"
        data-streaming={isStreaming}
        open={isOpen}
        onOpenChange={handleOpenChange}
        className={cn(
          "border bg-background font-mono text-foreground transition-colors",
          className
        )}
      >
        {children}
      </CollapsiblePrimitive.Root>
    </AiReasoningContext.Provider>
  );
}

interface AiReasoningTriggerProps {
  children?: React.ReactNode;
  className?: string;
}

function AiReasoningTrigger({ children, className }: AiReasoningTriggerProps) {
  const { isStreaming, isOpen, thinkingDuration } = useReasoningContext();

  const formattedDuration = React.useMemo(() => {
    if (thinkingDuration === null) return null;
    if (thinkingDuration < 1000) return `${thinkingDuration}ms`;
    return `${(thinkingDuration / 1000).toFixed(1)}s`;
  }, [thinkingDuration]);

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="ai-reasoning-trigger"
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
    >
      <div className="flex flex-1 items-center gap-2 text-left">
        <span>{isStreaming ? "THINKING..." : "REASONING"}</span>
        {isStreaming && (
          <span className="inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] tracking-widest">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping bg-foreground opacity-75" />
              <span className="relative inline-flex size-1.5 bg-foreground" />
            </span>
            STREAMING
          </span>
        )}
        {!isStreaming && formattedDuration && (
          <span className="text-[10px] text-muted-foreground">
            {formattedDuration}
          </span>
        )}
      </div>
      {children}
      <ChevronDown
        className={cn(
          "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </CollapsiblePrimitive.Trigger>
  );
}

interface AiReasoningContentProps {
  children?: React.ReactNode;
  className?: string;
}

function AiReasoningContent({ children, className }: AiReasoningContentProps) {
  const { isStreaming } = useReasoningContext();

  return (
    <CollapsiblePrimitive.Content
      data-slot="ai-reasoning-content"
      className={cn(
        "border-t data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
        className
      )}
    >
      <div
        className={cn(
          "p-4 text-xs text-muted-foreground",
          isStreaming && "animate-pulse"
        )}
      >
        {children}
        {isStreaming && (
          <span className="ml-1 inline-block h-3 w-[2px] animate-pulse bg-foreground" />
        )}
      </div>
    </CollapsiblePrimitive.Content>
  );
}

interface AiReasoningTextProps {
  children?: React.ReactNode;
  className?: string;
}

function AiReasoningText({ children, className }: AiReasoningTextProps) {
  return (
    <div
      data-slot="ai-reasoning-text"
      className={cn("whitespace-pre-wrap text-xs leading-relaxed", className)}
    >
      {children}
    </div>
  );
}

export { AiReasoning, AiReasoningTrigger, AiReasoningContent, AiReasoningText };
export type { AiReasoningProps };
