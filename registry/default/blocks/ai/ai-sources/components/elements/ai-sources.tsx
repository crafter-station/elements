"use client";

import * as React from "react";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown, ExternalLink, FileText } from "lucide-react";

import { cn } from "@/lib/utils";

interface Source {
  url: string;
  title: string;
  favicon?: string;
  snippet?: string;
}

interface AiSourcesContextValue {
  sources: Source[];
}

const AiSourcesContext = React.createContext<AiSourcesContextValue | null>(
  null,
);

function useSourcesContext() {
  const context = React.useContext(AiSourcesContext);
  if (!context) {
    throw new Error("AiSources components must be used within <AiSources>");
  }
  return context;
}

interface AiSourcesProps {
  sources?: Source[];
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

function AiSources({
  sources = [],
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  children,
  className,
}: AiSourcesProps) {
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

  const contextValue = React.useMemo(() => ({ sources }), [sources]);

  return (
    <AiSourcesContext.Provider value={contextValue}>
      <CollapsiblePrimitive.Root
        data-slot="ai-sources"
        open={isOpen}
        onOpenChange={handleOpenChange}
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground overflow-hidden",
          className,
        )}
      >
        {children}
      </CollapsiblePrimitive.Root>
    </AiSourcesContext.Provider>
  );
}

interface AiSourcesTriggerProps {
  children?: React.ReactNode;
  className?: string;
}

function AiSourcesTrigger({ children, className }: AiSourcesTriggerProps) {
  const { sources } = useSourcesContext();

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="ai-sources-trigger"
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <FileText className="size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-1 items-center gap-2 text-left">
        {children || "Sources"}
        <span className="inline-flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {sources.length}
        </span>
      </div>
      <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
    </CollapsiblePrimitive.Trigger>
  );
}

interface AiSourcesContentProps {
  children?: React.ReactNode;
  className?: string;
}

function AiSourcesContent({ children, className }: AiSourcesContentProps) {
  const { sources } = useSourcesContext();

  return (
    <CollapsiblePrimitive.Content
      data-slot="ai-sources-content"
      className={cn(
        "border-t border-border data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
        className,
      )}
    >
      <div className="p-4">
        {children || (
          <div className="grid gap-2 sm:grid-cols-2">
            {sources.map((source, index) => (
              <AiSource key={index} source={source} />
            ))}
          </div>
        )}
      </div>
    </CollapsiblePrimitive.Content>
  );
}

interface AiSourceProps {
  source: Source;
  className?: string;
}

function AiSource({ source, className }: AiSourceProps) {
  const [faviconError, setFaviconError] = React.useState(false);

  const hostname = React.useMemo(() => {
    try {
      return new URL(source.url).hostname.replace("www.", "");
    } catch {
      return source.url;
    }
  }, [source.url]);

  const faviconUrl = React.useMemo(() => {
    if (source.favicon) return source.favicon;
    try {
      const url = new URL(source.url);
      return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`;
    } catch {
      return null;
    }
  }, [source.url, source.favicon]);

  const handleFaviconError = React.useCallback(() => {
    setFaviconError(true);
  }, []);

  const showFavicon = faviconUrl && !faviconError;

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      data-slot="ai-source"
      className={cn(
        "group flex items-start gap-3 rounded-md border border-border bg-background p-3 transition-colors hover:bg-muted/50",
        className,
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        {showFavicon ? (
          <img
            src={faviconUrl}
            alt=""
            aria-hidden="true"
            className="size-4 rounded-sm"
            onError={handleFaviconError}
          />
        ) : (
          <FileText className="size-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sm truncate">{source.title}</span>
          <ExternalLink className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <span className="text-xs text-muted-foreground truncate block">
          {hostname}
        </span>
        {source.snippet && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {source.snippet}
          </p>
        )}
      </div>
    </a>
  );
}

interface AiSourcesListProps {
  children?: React.ReactNode;
  className?: string;
}

function AiSourcesList({ children, className }: AiSourcesListProps) {
  return (
    <div
      data-slot="ai-sources-list"
      className={cn("grid gap-2 sm:grid-cols-2", className)}
    >
      {children}
    </div>
  );
}

export {
  AiSources,
  AiSourcesTrigger,
  AiSourcesContent,
  AiSource,
  AiSourcesList,
};
export type { AiSourcesProps, Source };
