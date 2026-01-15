"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface JsonViewerProps {
  data: JsonValue;
  collapsed?: boolean | number;
  searchable?: boolean;
  copyPath?: boolean;
  maxDepth?: number;
  className?: string;
}

interface JsonNodeProps {
  keyName?: string;
  value: JsonValue;
  depth: number;
  path: string;
  defaultCollapsed: boolean | number;
  maxDepth: number;
  copyPath: boolean;
  searchQuery: string;
}

function getValueType(value: JsonValue): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function getPreview(value: JsonValue): string {
  if (Array.isArray(value)) return `Array(${value.length})`;
  if (typeof value === "object" && value !== null) {
    const keys = Object.keys(value);
    return `{${keys.length > 0 ? keys.slice(0, 3).join(", ") + (keys.length > 3 ? "..." : "") : ""}}`;
  }
  return String(value);
}

function matchesSearch(value: JsonValue, query: string): boolean {
  if (!query) return true;
  const lowerQuery = query.toLowerCase();

  if (typeof value === "string")
    return value.toLowerCase().includes(lowerQuery);
  if (typeof value === "number") return String(value).includes(lowerQuery);
  if (typeof value === "boolean") return String(value).includes(lowerQuery);
  if (value === null) return "null".includes(lowerQuery);
  if (Array.isArray(value)) return value.some((v) => matchesSearch(v, query));
  if (typeof value === "object") {
    return Object.entries(value).some(
      ([k, v]) =>
        k.toLowerCase().includes(lowerQuery) || matchesSearch(v, query),
    );
  }
  return false;
}

function JsonNode({
  keyName,
  value,
  depth,
  path,
  defaultCollapsed,
  maxDepth,
  copyPath,
  searchQuery,
}: JsonNodeProps) {
  const shouldDefaultCollapse =
    typeof defaultCollapsed === "number"
      ? depth >= defaultCollapsed
      : defaultCollapsed;

  const [isCollapsed, setIsCollapsed] = React.useState(shouldDefaultCollapse);
  const [copied, setCopied] = React.useState(false);

  const type = getValueType(value);
  const isExpandable = type === "object" || type === "array";
  const isVisible =
    matchesSearch(value, searchQuery) ||
    (keyName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

  React.useEffect(() => {
    if (searchQuery && isExpandable && matchesSearch(value, searchQuery)) {
      setIsCollapsed(false);
    }
  }, [searchQuery, isExpandable, value]);

  const handleToggle = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggle();
      } else if (e.key === "ArrowRight" && isCollapsed) {
        e.preventDefault();
        setIsCollapsed(false);
      } else if (e.key === "ArrowLeft" && !isCollapsed) {
        e.preventDefault();
        setIsCollapsed(true);
      }
    },
    [handleToggle, isCollapsed],
  );

  const handleCopyPath = React.useCallback(async () => {
    await navigator.clipboard.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [path]);

  if (!isVisible && searchQuery) return null;

  const renderValue = () => {
    if (type === "null") {
      return <span className="text-muted-foreground italic">null</span>;
    }
    if (type === "boolean") {
      return <span className="text-amber-500">{String(value)}</span>;
    }
    if (type === "number") {
      return <span className="text-blue-500">{value as number}</span>;
    }
    if (type === "string") {
      return (
        <span className="text-green-600 dark:text-green-400">
          "{value as string}"
        </span>
      );
    }
    return null;
  };

  if (!isExpandable) {
    return (
      <div className="group flex items-center gap-1 py-0.5" role="treeitem">
        {keyName !== undefined && (
          <>
            <span className="text-foreground">{keyName}</span>
            <span className="text-muted-foreground">:</span>
          </>
        )}
        {renderValue()}
        {copyPath && (
          <button
            type="button"
            onClick={handleCopyPath}
            aria-label={`Copy path ${path}`}
            className="ml-1 opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:text-foreground transition-opacity"
          >
            {copied ? "✓" : "⎘"}
          </button>
        )}
      </div>
    );
  }

  if (depth >= maxDepth) {
    return (
      <div className="flex items-center gap-1 py-0.5">
        {keyName !== undefined && (
          <>
            <span className="text-foreground">{keyName}</span>
            <span className="text-muted-foreground">:</span>
          </>
        )}
        <span className="text-muted-foreground italic">
          {getPreview(value)}
        </span>
      </div>
    );
  }

  const entries =
    type === "array"
      ? (value as JsonValue[]).map(
          (v, i) => [String(i), v] as [string, JsonValue],
        )
      : Object.entries(value as Record<string, JsonValue>);

  const brackets = type === "array" ? ["[", "]"] : ["{", "}"];

  return (
    <div className="py-0.5" role="treeitem" aria-expanded={!isCollapsed}>
      <div className="group flex items-center gap-1">
        <button
          type="button"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-label={isCollapsed ? "Expand" : "Collapse"}
          className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? "▶" : "▼"}
        </button>
        {keyName !== undefined && (
          <>
            <span className="text-foreground">{keyName}</span>
            <span className="text-muted-foreground">:</span>
          </>
        )}
        <span className="text-muted-foreground">
          {brackets[0]}
          {isCollapsed && (
            <>
              <span className="italic text-xs mx-1">{getPreview(value)}</span>
              {brackets[1]}
            </>
          )}
        </span>
        {copyPath && (
          <button
            type="button"
            onClick={handleCopyPath}
            aria-label={`Copy path ${path}`}
            className="ml-1 opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:text-foreground transition-opacity"
          >
            {copied ? "✓" : "⎘"}
          </button>
        )}
      </div>
      {!isCollapsed && (
        <div className="ml-4 border-l border-border pl-2" role="group">
          {entries.map(([k, v]) => (
            <JsonNode
              key={k}
              keyName={k}
              value={v}
              depth={depth + 1}
              path={type === "array" ? `${path}[${k}]` : `${path}.${k}`}
              defaultCollapsed={defaultCollapsed}
              maxDepth={maxDepth}
              copyPath={copyPath}
              searchQuery={searchQuery}
            />
          ))}
          <div className="text-muted-foreground">{brackets[1]}</div>
        </div>
      )}
    </div>
  );
}

export function JsonViewer({
  data,
  collapsed = false,
  searchable = false,
  copyPath = true,
  maxDepth = 10,
  className,
}: JsonViewerProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div
      data-slot="json-viewer"
      role="tree"
      aria-label="JSON data"
      className={cn("font-mono text-sm", className)}
    >
      {searchable && (
        <div className="mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
          />
        </div>
      )}
      <div className="overflow-auto">
        <JsonNode
          value={data}
          depth={0}
          path="$"
          defaultCollapsed={collapsed}
          maxDepth={maxDepth}
          copyPath={copyPath}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}

export type { JsonViewerProps, JsonValue };
