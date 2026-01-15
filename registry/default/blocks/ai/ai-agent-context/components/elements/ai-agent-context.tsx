"use client";

import * as React from "react";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import {
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  Database,
  Hash,
  List,
  Pencil,
  ToggleLeft,
  Type,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ValueType = "string" | "number" | "boolean" | "object" | "array" | "null";

interface AiAgentContextContextValue {
  editable: boolean;
  onChange?: (key: string, value: unknown) => void;
}

const AiAgentContextContext =
  React.createContext<AiAgentContextContextValue | null>(null);

function useAgentContextContext() {
  const context = React.useContext(AiAgentContextContext);
  if (!context) {
    throw new Error(
      "AiAgentContext components must be used within <AiAgentContext>",
    );
  }
  return context;
}

function getValueType(value: unknown): ValueType {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value as ValueType;
}

interface AiAgentContextProps {
  context: Record<string, unknown>;
  title?: string;
  editable?: boolean;
  onChange?: (key: string, value: unknown) => void;
  children?: React.ReactNode;
  className?: string;
}

function AiAgentContext({
  context,
  title,
  editable = false,
  onChange,
  children,
  className,
}: AiAgentContextProps) {
  const contextValue = React.useMemo(
    () => ({ editable, onChange }),
    [editable, onChange],
  );

  return (
    <AiAgentContextContext.Provider value={contextValue}>
      <div
        data-slot="ai-agent-context"
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground",
          className,
        )}
      >
        {children || (
          <>
            <AiAgentContextHeader>{title}</AiAgentContextHeader>
            <AiAgentContextContent context={context} />
          </>
        )}
      </div>
    </AiAgentContextContext.Provider>
  );
}

interface AiAgentContextHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

function AiAgentContextHeader({
  children,
  className,
}: AiAgentContextHeaderProps) {
  return (
    <div
      data-slot="ai-agent-context-header"
      className={cn(
        "flex items-center gap-2 border-b border-border px-4 py-3",
        className,
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Database className="size-4 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-sm">{children || "Agent Context"}</h3>
    </div>
  );
}

interface AiAgentContextContentProps {
  context: Record<string, unknown>;
  className?: string;
}

function AiAgentContextContent({
  context,
  className,
}: AiAgentContextContentProps) {
  const entries = React.useMemo(() => Object.entries(context), [context]);

  if (entries.length === 0) {
    return <AiAgentContextEmpty />;
  }

  return (
    <div
      data-slot="ai-agent-context-content"
      className={cn("p-4 space-y-1", className)}
    >
      {entries.map(([key, value]) => (
        <AiAgentContextEntry key={key} path={key} name={key} value={value} />
      ))}
    </div>
  );
}

interface AiAgentContextEntryProps {
  path: string;
  name: string;
  value: unknown;
  depth?: number;
  className?: string;
}

function AiAgentContextEntry({
  path,
  name,
  value,
  depth = 0,
  className,
}: AiAgentContextEntryProps) {
  const { editable, onChange } = useAgentContextContext();
  const [isOpen, setIsOpen] = React.useState(depth < 2);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState("");

  const valueType = getValueType(value);
  const isExpandable = valueType === "object" || valueType === "array";
  const childEntries = React.useMemo(() => {
    if (valueType === "object" && value !== null) {
      return Object.entries(value as Record<string, unknown>);
    }
    if (valueType === "array") {
      return (value as unknown[]).map((v, i) => [String(i), v] as const);
    }
    return [];
  }, [value, valueType]);

  const typeIcon = React.useMemo(() => {
    const icons: Record<ValueType, React.ReactNode> = {
      string: <Type className="size-3" />,
      number: <Hash className="size-3" />,
      boolean: <ToggleLeft className="size-3" />,
      object: <Braces className="size-3" />,
      array: <List className="size-3" />,
      null: <X className="size-3" />,
    };
    return icons[valueType];
  }, [valueType]);

  const typeColor = React.useMemo(() => {
    const colors: Record<ValueType, string> = {
      string: "text-green-600 dark:text-green-400",
      number: "text-blue-600 dark:text-blue-400",
      boolean: "text-amber-600 dark:text-amber-400",
      object: "text-purple-600 dark:text-purple-400",
      array: "text-cyan-600 dark:text-cyan-400",
      null: "text-muted-foreground",
    };
    return colors[valueType];
  }, [valueType]);

  const displayValue = React.useMemo(() => {
    if (valueType === "null") return "null";
    if (valueType === "boolean") return String(value);
    if (valueType === "string") return `"${value}"`;
    if (valueType === "number") return String(value);
    if (valueType === "array") return `Array(${childEntries.length})`;
    if (valueType === "object") return `{${childEntries.length} keys}`;
    return String(value);
  }, [value, valueType, childEntries.length]);

  const handleStartEdit = React.useCallback(() => {
    if (editable && !isExpandable) {
      setEditValue(
        valueType === "string" ? String(value) : JSON.stringify(value),
      );
      setIsEditing(true);
    }
  }, [editable, isExpandable, value, valueType]);

  const handleSaveEdit = React.useCallback(() => {
    if (onChange) {
      let parsedValue: unknown = editValue;
      if (valueType === "number") {
        parsedValue = Number(editValue);
      } else if (valueType === "boolean") {
        parsedValue = editValue === "true";
      }
      onChange(path, parsedValue);
    }
    setIsEditing(false);
  }, [onChange, path, editValue, valueType]);

  const handleCancelEdit = React.useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSaveEdit();
      } else if (e.key === "Escape") {
        handleCancelEdit();
      }
    },
    [handleSaveEdit, handleCancelEdit],
  );

  if (isExpandable) {
    return (
      <CollapsiblePrimitive.Root
        data-slot="ai-agent-context-entry"
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn("", className)}
        style={{ paddingLeft: depth > 0 ? `${depth * 12}px` : undefined }}
      >
        <CollapsiblePrimitive.Trigger className="flex w-full items-center gap-1.5 py-1 text-sm hover:bg-muted/50 rounded px-1 -mx-1 transition-colors">
          <ChevronRight
            className={cn(
              "size-3.5 text-muted-foreground transition-transform",
              isOpen && "rotate-90",
            )}
          />
          <span
            className={cn("size-4 flex items-center justify-center", typeColor)}
          >
            {typeIcon}
          </span>
          <span className="font-mono text-xs font-medium">{name}</span>
          <span className="text-muted-foreground">:</span>
          <span className={cn("text-xs font-mono", typeColor)}>
            {displayValue}
          </span>
        </CollapsiblePrimitive.Trigger>
        <CollapsiblePrimitive.Content className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
          <div className="py-0.5">
            {childEntries.map(([key, val]) => (
              <AiAgentContextEntry
                key={key}
                path={`${path}.${key}`}
                name={key}
                value={val}
                depth={depth + 1}
              />
            ))}
          </div>
        </CollapsiblePrimitive.Content>
      </CollapsiblePrimitive.Root>
    );
  }

  return (
    <div
      data-slot="ai-agent-context-entry"
      className={cn(
        "group flex items-center gap-1.5 py-1 text-sm rounded px-1 -mx-1",
        editable && "hover:bg-muted/50",
        className,
      )}
      style={{ paddingLeft: depth > 0 ? `${depth * 12 + 16}px` : "16px" }}
    >
      <span
        className={cn("size-4 flex items-center justify-center", typeColor)}
      >
        {typeIcon}
      </span>
      <span className="font-mono text-xs font-medium">{name}</span>
      <span className="text-muted-foreground">:</span>
      {isEditing ? (
        <div className="flex items-center gap-1 flex-1">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-0 bg-background border border-border rounded px-1.5 py-0.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={handleSaveEdit}
            className="size-5 flex items-center justify-center rounded hover:bg-green-100 dark:hover:bg-green-950 text-green-600 dark:text-green-400"
          >
            <Check className="size-3" />
          </button>
          <button
            type="button"
            onClick={handleCancelEdit}
            className="size-5 flex items-center justify-center rounded hover:bg-red-100 dark:hover:bg-red-950 text-red-600 dark:text-red-400"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <>
          <span className={cn("text-xs font-mono flex-1", typeColor)}>
            {displayValue}
          </span>
          {editable && (
            <button
              type="button"
              onClick={handleStartEdit}
              className="size-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-muted text-muted-foreground transition-opacity"
            >
              <Pencil className="size-3" />
            </button>
          )}
        </>
      )}
    </div>
  );
}

interface AiAgentContextGroupProps {
  title: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function AiAgentContextGroup({
  title,
  defaultOpen = true,
  children,
  className,
}: AiAgentContextGroupProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <CollapsiblePrimitive.Root
      data-slot="ai-agent-context-group"
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("", className)}
    >
      <CollapsiblePrimitive.Trigger className="flex w-full items-center gap-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
        <ChevronDown
          className={cn("size-3 transition-transform", !isOpen && "-rotate-90")}
        />
        {title}
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
        {children}
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}

interface AiAgentContextEmptyProps {
  children?: React.ReactNode;
  className?: string;
}

function AiAgentContextEmpty({
  children,
  className,
}: AiAgentContextEmptyProps) {
  return (
    <div
      data-slot="ai-agent-context-empty"
      className={cn(
        "flex flex-col items-center justify-center py-8 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
        <Database className="size-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">
        {children || "No context data available"}
      </p>
    </div>
  );
}

export {
  AiAgentContext,
  AiAgentContextHeader,
  AiAgentContextContent,
  AiAgentContextEntry,
  AiAgentContextGroup,
  AiAgentContextEmpty,
};
export type { AiAgentContextProps, ValueType };
