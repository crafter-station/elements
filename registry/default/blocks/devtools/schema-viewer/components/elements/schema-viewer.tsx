"use client";

import * as React from "react";

import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface JsonSchema {
  type?: string | string[];
  title?: string;
  description?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  enum?: unknown[];
  default?: unknown;
  example?: unknown;
  examples?: unknown[];
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  oneOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  allOf?: JsonSchema[];
  $ref?: string;
}

interface SchemaViewerProps {
  schema: JsonSchema;
  showExamples?: boolean;
  className?: string;
}

interface SchemaNodeProps {
  name?: string;
  schema: JsonSchema;
  required?: boolean;
  depth: number;
  showExamples: boolean;
}

function TypeBadge({ type, format }: { type: string; format?: string }) {
  const colors: Record<string, string> = {
    string: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    number: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    integer: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    boolean:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    object:
      "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    array:
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    null: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <span
      className={cn(
        "px-1.5 py-0.5 rounded text-xs font-mono",
        colors[type] || colors.string,
      )}
    >
      {type}
      {format && <span className="opacity-70">({format})</span>}
    </span>
  );
}

function SchemaNode({
  name,
  schema,
  required,
  depth,
  showExamples,
}: SchemaNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(depth < 2);

  const handleToggle = React.useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const type = Array.isArray(schema.type)
    ? schema.type.join(" | ")
    : schema.type || "any";
  const hasChildren =
    schema.properties ||
    schema.items ||
    schema.oneOf ||
    schema.anyOf ||
    schema.allOf;

  const example = schema.example ?? schema.examples?.[0] ?? schema.default;

  return (
    <div
      className={cn("text-sm", depth > 0 && "ml-4 border-l border-border pl-3")}
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
    >
      <div className="flex items-start gap-2 py-1">
        {hasChildren && (
          <button
            type="button"
            onClick={handleToggle}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            className="mt-0.5 text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-4" aria-hidden="true" />}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {name && (
              <span className="font-medium text-foreground">
                {name}
                {required && <span className="text-red-500 ml-0.5">*</span>}
              </span>
            )}
            <TypeBadge type={type} format={schema.format} />
            {schema.enum && (
              <span className="text-xs text-muted-foreground">
                enum: {schema.enum.map((v) => JSON.stringify(v)).join(" | ")}
              </span>
            )}
          </div>

          {schema.description && (
            <p className="text-muted-foreground text-xs mt-0.5">
              {schema.description}
            </p>
          )}

          {showExamples && example !== undefined && (
            <div className="mt-1 text-xs">
              <span className="text-muted-foreground">Example: </span>
              <code className="font-mono text-foreground bg-muted px-1 rounded">
                {JSON.stringify(example)}
              </code>
            </div>
          )}

          {(schema.minimum !== undefined || schema.maximum !== undefined) && (
            <div className="mt-1 text-xs text-muted-foreground">
              {schema.minimum !== undefined && (
                <span>min: {schema.minimum} </span>
              )}
              {schema.maximum !== undefined && (
                <span>max: {schema.maximum}</span>
              )}
            </div>
          )}

          {(schema.minLength !== undefined ||
            schema.maxLength !== undefined) && (
            <div className="mt-1 text-xs text-muted-foreground">
              {schema.minLength !== undefined && (
                <span>minLength: {schema.minLength} </span>
              )}
              {schema.maxLength !== undefined && (
                <span>maxLength: {schema.maxLength}</span>
              )}
            </div>
          )}

          {schema.pattern && (
            <div className="mt-1 text-xs text-muted-foreground">
              pattern: <code className="font-mono">{schema.pattern}</code>
            </div>
          )}
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="mt-1" role="group">
          {schema.properties &&
            Object.entries(schema.properties).map(([key, propSchema]) => (
              <SchemaNode
                key={key}
                name={key}
                schema={propSchema}
                required={schema.required?.includes(key)}
                depth={depth + 1}
                showExamples={showExamples}
              />
            ))}

          {schema.items && (
            <SchemaNode
              name="[items]"
              schema={schema.items}
              depth={depth + 1}
              showExamples={showExamples}
            />
          )}

          {schema.oneOf && (
            <div className="ml-4 border-l border-border pl-3">
              <span className="text-xs text-muted-foreground font-medium">
                oneOf:
              </span>
              {schema.oneOf.map((s, i) => (
                <SchemaNode
                  key={i}
                  schema={s}
                  depth={depth + 1}
                  showExamples={showExamples}
                />
              ))}
            </div>
          )}

          {schema.anyOf && (
            <div className="ml-4 border-l border-border pl-3">
              <span className="text-xs text-muted-foreground font-medium">
                anyOf:
              </span>
              {schema.anyOf.map((s, i) => (
                <SchemaNode
                  key={i}
                  schema={s}
                  depth={depth + 1}
                  showExamples={showExamples}
                />
              ))}
            </div>
          )}

          {schema.allOf && (
            <div className="ml-4 border-l border-border pl-3">
              <span className="text-xs text-muted-foreground font-medium">
                allOf:
              </span>
              {schema.allOf.map((s, i) => (
                <SchemaNode
                  key={i}
                  schema={s}
                  depth={depth + 1}
                  showExamples={showExamples}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SchemaViewer({
  schema,
  showExamples = true,
  className,
}: SchemaViewerProps) {
  return (
    <div
      data-slot="schema-viewer"
      role="tree"
      aria-label="JSON Schema"
      className={cn(
        "border border-border rounded-lg p-3 overflow-auto",
        className,
      )}
    >
      {schema.title && (
        <div className="mb-3 pb-2 border-b border-border">
          <h3 className="font-semibold text-foreground">{schema.title}</h3>
          {schema.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {schema.description}
            </p>
          )}
        </div>
      )}
      <SchemaNode schema={schema} depth={0} showExamples={showExamples} />
    </div>
  );
}

export type { SchemaViewerProps, JsonSchema };
