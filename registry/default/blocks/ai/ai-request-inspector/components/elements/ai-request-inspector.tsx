"use client";

import * as React from "react";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Clock,
  Copy,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface AiRequestInspectorContextValue {
  request?: RequestData;
  response?: ResponseData;
  timestamp?: Date;
  duration?: number;
}

interface RequestData {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

interface ResponseData {
  status?: number;
  headers?: Record<string, string>;
  body?: unknown;
}

const AiRequestInspectorContext =
  React.createContext<AiRequestInspectorContextValue | null>(null);

function useRequestInspectorContext() {
  const context = React.useContext(AiRequestInspectorContext);
  if (!context) {
    throw new Error(
      "AiRequestInspector components must be used within <AiRequestInspector>",
    );
  }
  return context;
}

interface AiRequestInspectorProps {
  request?: RequestData;
  response?: ResponseData;
  timestamp?: Date;
  duration?: number;
  children?: React.ReactNode;
  className?: string;
}

function AiRequestInspector({
  request,
  response,
  timestamp,
  duration,
  children,
  className,
}: AiRequestInspectorProps) {
  const contextValue = React.useMemo(
    () => ({ request, response, timestamp, duration }),
    [request, response, timestamp, duration],
  );

  return (
    <AiRequestInspectorContext.Provider value={contextValue}>
      <div
        data-slot="ai-request-inspector"
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground overflow-hidden",
          className,
        )}
      >
        {children}
      </div>
    </AiRequestInspectorContext.Provider>
  );
}

interface AiRequestInspectorHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

function AiRequestInspectorHeader({
  children,
  className,
}: AiRequestInspectorHeaderProps) {
  const { request, response, timestamp, duration } =
    useRequestInspectorContext();

  const statusColor = React.useMemo(() => {
    if (!response?.status) return "bg-muted text-muted-foreground";
    if (response.status >= 200 && response.status < 300) {
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    }
    if (response.status >= 400) {
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    }
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";
  }, [response?.status]);

  const formattedDuration = React.useMemo(() => {
    if (duration === undefined) return null;
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  }, [duration]);

  const formattedTime = React.useMemo(() => {
    if (!timestamp) return null;
    return timestamp.toLocaleTimeString();
  }, [timestamp]);

  return (
    <div
      data-slot="ai-request-inspector-header"
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30",
        className,
      )}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {request?.method && (
          <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary font-mono">
            {request.method}
          </span>
        )}
        {request?.url && (
          <span className="truncate text-sm font-mono text-muted-foreground">
            {request.url}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {response?.status && (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              statusColor,
            )}
          >
            {response.status}
          </span>
        )}
        {formattedDuration && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {formattedDuration}
          </span>
        )}
        {formattedTime && (
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        )}
      </div>
      {children}
    </div>
  );
}

interface AiRequestInspectorSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function AiRequestInspectorSection({
  title,
  icon,
  defaultOpen = false,
  children,
  className,
}: AiRequestInspectorSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <CollapsiblePrimitive.Root
      data-slot="ai-request-inspector-section"
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("border-b border-border last:border-b-0", className)}
    >
      <CollapsiblePrimitive.Trigger className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {icon}
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="px-4 pb-4">{children}</div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}

interface AiRequestInspectorRequestProps {
  defaultOpen?: boolean;
  className?: string;
}

function AiRequestInspectorRequest({
  defaultOpen = true,
  className,
}: AiRequestInspectorRequestProps) {
  const { request } = useRequestInspectorContext();

  if (!request) return null;

  return (
    <AiRequestInspectorSection
      title="Request"
      icon={<ArrowUp className="size-4 text-blue-500" />}
      defaultOpen={defaultOpen}
      className={className}
    >
      <div className="space-y-3">
        {request.headers && Object.keys(request.headers).length > 0 && (
          <AiRequestInspectorJson label="Headers" data={request.headers} />
        )}
        {request.body !== undefined && (
          <AiRequestInspectorJson label="Body" data={request.body} />
        )}
      </div>
    </AiRequestInspectorSection>
  );
}

interface AiRequestInspectorResponseProps {
  defaultOpen?: boolean;
  className?: string;
}

function AiRequestInspectorResponse({
  defaultOpen = true,
  className,
}: AiRequestInspectorResponseProps) {
  const { response } = useRequestInspectorContext();

  if (!response) return null;

  return (
    <AiRequestInspectorSection
      title="Response"
      icon={<ArrowDown className="size-4 text-green-500" />}
      defaultOpen={defaultOpen}
      className={className}
    >
      <div className="space-y-3">
        {response.headers && Object.keys(response.headers).length > 0 && (
          <AiRequestInspectorJson label="Headers" data={response.headers} />
        )}
        {response.body !== undefined && (
          <AiRequestInspectorJson label="Body" data={response.body} />
        )}
      </div>
    </AiRequestInspectorSection>
  );
}

interface AiRequestInspectorJsonProps {
  label: string;
  data: unknown;
  className?: string;
}

function AiRequestInspectorJson({
  label,
  data,
  className,
}: AiRequestInspectorJsonProps) {
  const [copied, setCopied] = React.useState(false);

  const formattedJson = React.useMemo(
    () => JSON.stringify(data, null, 2),
    [data],
  );

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [formattedJson]);

  return (
    <div
      data-slot="ai-request-inspector-json"
      className={cn("space-y-1.5", className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="size-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="rounded-md bg-muted/50 p-3 overflow-x-auto text-xs font-mono text-foreground max-h-80 overflow-y-auto">
        <code>{formattedJson}</code>
      </pre>
    </div>
  );
}

export {
  AiRequestInspector,
  AiRequestInspectorHeader,
  AiRequestInspectorSection,
  AiRequestInspectorRequest,
  AiRequestInspectorResponse,
  AiRequestInspectorJson,
};
export type { AiRequestInspectorProps, RequestData, ResponseData };
