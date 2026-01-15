"use client";

import * as React from "react";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  ExternalLink,
  Image as ImageIcon,
  Lightbulb,
  Loader2,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";

type StepStatus = "pending" | "active" | "complete";

interface AiChainOfThoughtContextValue {
  isOpen: boolean;
}

const AiChainOfThoughtContext =
  React.createContext<AiChainOfThoughtContextValue | null>(null);

function useChainOfThoughtContext() {
  const context = React.useContext(AiChainOfThoughtContext);
  if (!context) {
    throw new Error(
      "AiChainOfThought components must be used within <AiChainOfThought>",
    );
  }
  return context;
}

interface AiChainOfThoughtProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

function AiChainOfThought({
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  children,
  className,
}: AiChainOfThoughtProps) {
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

  const contextValue = React.useMemo(() => ({ isOpen }), [isOpen]);

  return (
    <AiChainOfThoughtContext.Provider value={contextValue}>
      <CollapsiblePrimitive.Root
        data-slot="ai-chain-of-thought"
        open={isOpen}
        onOpenChange={handleOpenChange}
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground overflow-hidden",
          className,
        )}
      >
        {children}
      </CollapsiblePrimitive.Root>
    </AiChainOfThoughtContext.Provider>
  );
}

interface AiChainOfThoughtHeaderProps {
  title?: string;
  stepCount?: number;
  completedCount?: number;
  children?: React.ReactNode;
  className?: string;
}

function AiChainOfThoughtHeader({
  title = "Chain of Thought",
  stepCount,
  completedCount,
  children,
  className,
}: AiChainOfThoughtHeaderProps) {
  const { isOpen } = useChainOfThoughtContext();

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="ai-chain-of-thought-header"
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-950">
        <Lightbulb className="size-4 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="flex flex-1 items-center gap-2 text-left">
        <span className="font-medium">{title}</span>
        {stepCount !== undefined && (
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {completedCount !== undefined
              ? `${completedCount}/${stepCount}`
              : `${stepCount} steps`}
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

interface AiChainOfThoughtContentProps {
  children?: React.ReactNode;
  className?: string;
}

function AiChainOfThoughtContent({
  children,
  className,
}: AiChainOfThoughtContentProps) {
  return (
    <CollapsiblePrimitive.Content
      data-slot="ai-chain-of-thought-content"
      className={cn(
        "border-t border-border data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
        className,
      )}
    >
      <div className="p-4 space-y-4">{children}</div>
    </CollapsiblePrimitive.Content>
  );
}

interface AiChainOfThoughtStepProps {
  status: StepStatus;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

function AiChainOfThoughtStep({
  status,
  title,
  description,
  children,
  className,
}: AiChainOfThoughtStepProps) {
  const statusConfig = React.useMemo(() => {
    const configs: Record<
      StepStatus,
      { icon: React.ReactNode; className: string; lineClassName: string }
    > = {
      pending: {
        icon: <Circle className="size-4" />,
        className: "text-muted-foreground",
        lineClassName: "bg-muted",
      },
      active: {
        icon: <Loader2 className="size-4 animate-spin" />,
        className: "text-blue-600 dark:text-blue-400",
        lineClassName: "bg-blue-200 dark:bg-blue-900",
      },
      complete: {
        icon: <CheckCircle2 className="size-4" />,
        className: "text-green-600 dark:text-green-400",
        lineClassName: "bg-green-200 dark:bg-green-900",
      },
    };
    return configs[status];
  }, [status]);

  return (
    <div
      data-slot="ai-chain-of-thought-step"
      data-status={status}
      className={cn("relative flex gap-3", className)}
    >
      <div className="flex flex-col items-center">
        <div className={cn("shrink-0", statusConfig.className)}>
          {statusConfig.icon}
        </div>
        <div
          className={cn(
            "mt-2 w-0.5 flex-1 rounded-full",
            statusConfig.lineClassName,
          )}
        />
      </div>
      <div className="flex-1 pb-6 min-w-0">
        <h4
          className={cn(
            "font-medium text-sm",
            status === "pending" && "text-muted-foreground",
          )}
        >
          {title}
        </h4>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}

interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
}

interface AiChainOfThoughtSearchResultsProps {
  results: SearchResult[];
  className?: string;
}

function AiChainOfThoughtSearchResults({
  results,
  className,
}: AiChainOfThoughtSearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <div
      data-slot="ai-chain-of-thought-search-results"
      className={cn("space-y-2", className)}
    >
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Search className="size-3" />
        <span>Found {results.length} results</span>
      </div>
      <div className="space-y-2">
        {results.map((result, index) => (
          <a
            key={index}
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h5 className="truncate text-sm font-medium text-foreground">
                  {result.title}
                </h5>
                {result.snippet && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {result.snippet}
                  </p>
                )}
              </div>
              <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

interface AiChainOfThoughtImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

function AiChainOfThoughtImage({
  src,
  alt,
  caption,
  className,
}: AiChainOfThoughtImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = React.useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  return (
    <figure
      data-slot="ai-chain-of-thought-image"
      className={cn("space-y-2", className)}
    >
      <div className="relative overflow-hidden rounded-md border border-border bg-muted/30">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {hasError ? (
          <div className="flex aspect-video items-center justify-center">
            <div className="text-center">
              <ImageIcon className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-2 text-xs text-muted-foreground">
                Failed to load image
              </p>
            </div>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "w-full object-cover transition-opacity",
              isLoading ? "opacity-0" : "opacity-100",
            )}
          />
        )}
      </div>
      {caption && (
        <figcaption className="text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export {
  AiChainOfThought,
  AiChainOfThoughtHeader,
  AiChainOfThoughtContent,
  AiChainOfThoughtStep,
  AiChainOfThoughtSearchResults,
  AiChainOfThoughtImage,
};
export type { AiChainOfThoughtProps, StepStatus, SearchResult };
