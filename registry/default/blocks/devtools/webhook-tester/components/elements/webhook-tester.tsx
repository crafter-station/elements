"use client";

import * as React from "react";

import { Loader2, Plus, Send, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface WebhookResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  timing: number;
}

interface WebhookTesterProps {
  defaultUrl?: string;
  defaultMethod?: HttpMethod;
  defaultHeaders?: Record<string, string>;
  defaultBody?: string;
  onSend?: (request: {
    url: string;
    method: HttpMethod;
    headers: Record<string, string>;
    body?: string;
  }) => Promise<WebhookResponse>;
  className?: string;
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  POST: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  PUT: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  PATCH:
    "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function WebhookTester({
  defaultUrl = "",
  defaultMethod = "POST",
  defaultHeaders = { "Content-Type": "application/json" },
  defaultBody = "{}",
  onSend,
  className,
}: WebhookTesterProps) {
  const [url, setUrl] = React.useState(defaultUrl);
  const [method, setMethod] = React.useState<HttpMethod>(defaultMethod);
  const [headers, setHeaders] = React.useState<
    { key: string; value: string }[]
  >(Object.entries(defaultHeaders).map(([key, value]) => ({ key, value })));
  const [body, setBody] = React.useState(defaultBody);
  const [response, setResponse] = React.useState<WebhookResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleAddHeader = React.useCallback(() => {
    setHeaders((prev) => [...prev, { key: "", value: "" }]);
  }, []);

  const handleRemoveHeader = React.useCallback((index: number) => {
    setHeaders((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleHeaderChange = React.useCallback(
    (index: number, field: "key" | "value", value: string) => {
      setHeaders((prev) =>
        prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)),
      );
    },
    [],
  );

  const handleSend = React.useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    const headersObj = headers.reduce(
      (acc, { key, value }) => {
        if (key) acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

    try {
      if (onSend) {
        const res = await onSend({
          url,
          method,
          headers: headersObj,
          body: method !== "GET" ? body : undefined,
        });
        setResponse(res);
      } else {
        const start = performance.now();
        const res = await fetch(url, {
          method,
          headers: headersObj,
          body: method !== "GET" ? body : undefined,
        });
        const timing = performance.now() - start;

        const responseHeaders: Record<string, string> = {};
        res.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        let responseBody: unknown;
        const contentType = res.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          responseBody = await res.json();
        } else {
          responseBody = await res.text();
        }

        setResponse({
          status: res.status,
          statusText: res.statusText,
          headers: responseHeaders,
          body: responseBody,
          timing: Math.round(timing),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, [url, method, headers, body, onSend]);

  const getStatusColor = React.useCallback((status: number) => {
    if (status >= 200 && status < 300) return "text-green-600";
    if (status >= 300 && status < 400) return "text-yellow-600";
    if (status >= 400 && status < 500) return "text-orange-600";
    return "text-red-600";
  }, []);

  return (
    <div
      data-slot="webhook-tester"
      aria-busy={loading}
      aria-label="Webhook tester"
      className={cn(
        "border border-border rounded-lg overflow-hidden",
        className,
      )}
    >
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            aria-label="HTTP method"
            className={cn(
              "px-3 py-2 rounded font-mono text-sm font-medium border-none",
              METHOD_COLORS[method],
            )}
          >
            {(["GET", "POST", "PUT", "PATCH", "DELETE"] as HttpMethod[]).map(
              (m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ),
            )}
          </select>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/webhook"
            aria-label="Webhook URL"
            className="flex-1 px-3 py-2 border border-border rounded bg-background font-mono text-sm"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || !url}
            aria-label={loading ? "Sending request" : "Send request"}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded font-medium text-sm hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Headers</label>
            <button
              type="button"
              onClick={handleAddHeader}
              aria-label="Add header"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          </div>
          <div className="space-y-1">
            {headers.map((header, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) =>
                    handleHeaderChange(index, "key", e.target.value)
                  }
                  placeholder="Header name"
                  aria-label="Header name"
                  className="flex-1 px-2 py-1 border border-border rounded bg-background font-mono text-sm"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) =>
                    handleHeaderChange(index, "value", e.target.value)
                  }
                  placeholder="Header value"
                  aria-label={`Value for ${header.key || "header"}`}
                  className="flex-[2] px-2 py-1 border border-border rounded bg-background font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveHeader(index)}
                  aria-label={`Remove ${header.key || "header"}`}
                  className="p-1 text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {method !== "GET" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{"key": "value"}'
              aria-label="Request body"
              className="w-full h-32 px-3 py-2 border border-border rounded bg-background font-mono text-sm resize-none"
            />
          </div>
        )}
      </div>

      {(response || error) && (
        <div className="border-t border-border">
          <div className="px-4 py-2 bg-muted/50 text-sm font-medium flex items-center justify-between">
            <span>Response</span>
            {response && (
              <div className="flex items-center gap-3 text-xs">
                <span
                  className={cn(
                    "font-mono font-bold",
                    getStatusColor(response.status),
                  )}
                >
                  {response.status} {response.statusText}
                </span>
                <span className="text-muted-foreground">
                  {response.timing}ms
                </span>
              </div>
            )}
          </div>
          <div className="p-4 overflow-auto max-h-64">
            {error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : response ? (
              <pre className="font-mono text-xs whitespace-pre-wrap">
                {typeof response.body === "string"
                  ? response.body
                  : JSON.stringify(response.body, null, 2)}
              </pre>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export type { WebhookTesterProps, WebhookResponse, HttpMethod };
