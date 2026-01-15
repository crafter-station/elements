"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type HttpStatus =
  | "info"
  | "success"
  | "redirect"
  | "client-error"
  | "server-error";

interface ApiResponse {
  status: number;
  statusText?: string;
  headers?: Record<string, string>;
  body?: unknown;
  timing?: {
    dns?: number;
    connect?: number;
    ttfb?: number;
    download?: number;
    total: number;
  };
}

interface ApiResponseViewerProps {
  response: ApiResponse;
  defaultTab?: "body" | "headers" | "timing";
  className?: string;
}

function getStatusType(status: number): HttpStatus {
  if (status >= 100 && status < 200) return "info";
  if (status >= 200 && status < 300) return "success";
  if (status >= 300 && status < 400) return "redirect";
  if (status >= 400 && status < 500) return "client-error";
  return "server-error";
}

function StatusBadge({
  status,
  statusText,
}: {
  status: number;
  statusText?: string;
}) {
  const type = getStatusType(status);
  const colors: Record<HttpStatus, string> = {
    info: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    success:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    redirect:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    "client-error":
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    "server-error": "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  };

  return (
    <span
      role="status"
      aria-label={`HTTP status ${status}${statusText ? ` ${statusText}` : ""}`}
      className={cn("px-2 py-0.5 rounded text-sm font-mono", colors[type])}
    >
      {status} {statusText}
    </span>
  );
}

function JsonDisplay({ data }: { data: unknown }) {
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());

  const renderValue = (
    value: unknown,
    path: string,
    depth: number,
  ): React.ReactNode => {
    if (value === null) {
      return <span className="text-muted-foreground italic">null</span>;
    }
    if (typeof value === "boolean") {
      return <span className="text-amber-500">{String(value)}</span>;
    }
    if (typeof value === "number") {
      return <span className="text-blue-500">{value}</span>;
    }
    if (typeof value === "string") {
      return (
        <span className="text-green-600 dark:text-green-400">"{value}"</span>
      );
    }
    if (Array.isArray(value)) {
      const isCollapsed = collapsed.has(path);
      return (
        <span>
          <button
            type="button"
            onClick={() => {
              const next = new Set(collapsed);
              if (isCollapsed) next.delete(path);
              else next.add(path);
              setCollapsed(next);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? "▶" : "▼"}
          </button>
          <span className="text-muted-foreground">[</span>
          {isCollapsed ? (
            <span className="text-muted-foreground italic text-xs mx-1">
              {value.length} items
            </span>
          ) : (
            <div className="ml-4">
              {value.map((item, idx) => (
                <div key={idx}>
                  {renderValue(item, `${path}[${idx}]`, depth + 1)}
                  {idx < value.length - 1 && (
                    <span className="text-muted-foreground">,</span>
                  )}
                </div>
              ))}
            </div>
          )}
          <span className="text-muted-foreground">]</span>
        </span>
      );
    }
    if (typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>);
      const isCollapsed = collapsed.has(path);
      return (
        <span>
          <button
            type="button"
            onClick={() => {
              const next = new Set(collapsed);
              if (isCollapsed) next.delete(path);
              else next.add(path);
              setCollapsed(next);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? "▶" : "▼"}
          </button>
          <span className="text-muted-foreground">{"{"}</span>
          {isCollapsed ? (
            <span className="text-muted-foreground italic text-xs mx-1">
              {entries.length} keys
            </span>
          ) : (
            <div className="ml-4">
              {entries.map(([key, val], idx) => (
                <div key={key}>
                  <span className="text-foreground">{key}</span>
                  <span className="text-muted-foreground">: </span>
                  {renderValue(val, `${path}.${key}`, depth + 1)}
                  {idx < entries.length - 1 && (
                    <span className="text-muted-foreground">,</span>
                  )}
                </div>
              ))}
            </div>
          )}
          <span className="text-muted-foreground">{"}"}</span>
        </span>
      );
    }
    return String(value);
  };

  return (
    <div className="font-mono text-sm overflow-auto">
      {renderValue(data, "$", 0)}
    </div>
  );
}

function HeadersTable({ headers }: { headers: Record<string, string> }) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
              Header
            </th>
            <th className="text-left py-2 font-medium text-muted-foreground">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(headers).map(([key, value]) => (
            <tr key={key} className="border-b border-border last:border-0">
              <td className="py-2 pr-4 font-mono text-foreground">{key}</td>
              <td className="py-2 font-mono text-muted-foreground break-all">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TimingBar({ timing }: { timing: NonNullable<ApiResponse["timing"]> }) {
  const segments = [
    { key: "dns", label: "DNS", color: "bg-purple-500", value: timing.dns },
    {
      key: "connect",
      label: "Connect",
      color: "bg-blue-500",
      value: timing.connect,
    },
    { key: "ttfb", label: "TTFB", color: "bg-green-500", value: timing.ttfb },
    {
      key: "download",
      label: "Download",
      color: "bg-orange-500",
      value: timing.download,
    },
  ].filter((s) => s.value !== undefined);

  return (
    <div className="space-y-4">
      <div className="h-6 flex rounded overflow-hidden">
        {segments.map((seg) => (
          <div
            key={seg.key}
            className={cn(
              "flex items-center justify-center text-xs text-white",
              seg.color,
            )}
            style={{ width: `${((seg.value ?? 0) / timing.total) * 100}%` }}
          >
            {seg.value}ms
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded", seg.color)} />
            <span className="text-muted-foreground">{seg.label}:</span>
            <span className="font-mono">{seg.value}ms</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-500" />
          <span className="text-muted-foreground">Total:</span>
          <span className="font-mono font-semibold">{timing.total}ms</span>
        </div>
      </div>
    </div>
  );
}

export function ApiResponseViewer({
  response,
  defaultTab = "body",
  className,
}: ApiResponseViewerProps) {
  const [activeTab, setActiveTab] = React.useState<
    "body" | "headers" | "timing"
  >(defaultTab);

  const tabs = [
    {
      id: "body" as const,
      label: "Body",
      available: response.body !== undefined,
    },
    { id: "headers" as const, label: "Headers", available: !!response.headers },
    { id: "timing" as const, label: "Timing", available: !!response.timing },
  ].filter((t) => t.available);

  return (
    <div
      data-slot="api-response-viewer"
      className={cn(
        "border border-border rounded-lg overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <StatusBadge
          status={response.status}
          statusText={response.statusText}
        />
        {response.timing && (
          <span className="text-sm text-muted-foreground font-mono">
            {response.timing.total}ms
          </span>
        )}
      </div>

      <div
        className="flex border-b border-border"
        role="tablist"
        aria-label="Response tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="p-4"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-label={`${activeTab} content`}
      >
        {activeTab === "body" && response.body !== undefined && (
          <JsonDisplay data={response.body} />
        )}
        {activeTab === "headers" && response.headers && (
          <HeadersTable headers={response.headers} />
        )}
        {activeTab === "timing" && response.timing && (
          <TimingBar timing={response.timing} />
        )}
      </div>
    </div>
  );
}

export type { ApiResponseViewerProps, ApiResponse };
