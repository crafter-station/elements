"use client";

import * as React from "react";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { Brain, ChevronDown, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface AiReasoningContextValue {
  isStreaming: boolean;
  isOpen: boolean;
  thinkingDuration: number | null;
}

const AiReasoningContext = React.createContext<AiReasoningContextValue | null>(
  null,
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
    [isControlled, onOpenChange],
  );

  React.useEffect(() => {
    if (isStreaming) {
      handleOpenChange(true);
    }
  }, [isStreaming, handleOpenChange]);

  const contextValue = React.useMemo(
    () => ({ isStreaming, isOpen, thinkingDuration }),
    [isStreaming, isOpen, thinkingDuration],
  );

  return (
    <AiReasoningContext.Provider value={contextValue}>
      <CollapsiblePrimitive.Root
        data-slot="ai-reasoning"
        data-streaming={isStreaming}
        open={isOpen}
        onOpenChange={handleOpenChange}
        className={cn(
          "rounded-lg border bg-card text-card-foreground overflow-hidden transition-colors",
          isStreaming
            ? "border-purple-300 dark:border-purple-800"
            : "border-border",
          className,
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
        "flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md",
          isStreaming
            ? "bg-purple-100 dark:bg-purple-950 animate-pulse"
            : "bg-muted",
        )}
      >
        {isStreaming ? (
          <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
        ) : (
          <Brain className="size-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex flex-1 items-center gap-2 text-left">
        <span className="font-medium">
          {isStreaming ? "Thinking..." : "Reasoning"}
        </span>
        {isStreaming && (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-950 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-purple-500" />
            </span>
            Streaming
          </span>
        )}
        {!isStreaming && formattedDuration && (
          <span className="text-xs text-muted-foreground">
            {formattedDuration}
          </span>
        )}
      </div>
      {children}
      <ChevronDown
        className={cn(
          "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180",
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
        isStreaming
          ? "border-purple-200 dark:border-purple-900"
          : "border-border",
        className,
      )}
    >
      <div
        className={cn(
          "p-4 text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none",
          isStreaming && "animate-pulse",
        )}
      >
        {children}
        {isStreaming && (
          <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-purple-500" />
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
      className={cn(
        "whitespace-pre-wrap font-mono text-xs leading-relaxed",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { AiReasoning, AiReasoningTrigger, AiReasoningContent, AiReasoningText };
export type { AiReasoningProps };
