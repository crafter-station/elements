"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ChevronDown,
  FileCode,
  Plus,
  Upload,
  Settings2,
  Sparkles,
} from "lucide-react";
import {
  ITEM_TYPE_OPTIONS,
  TARGET_REQUIRED_TYPES,
} from "@/lib/studio/constants";
import type { RegistryItemType, RegistryFileType } from "@/lib/studio/types";
import { inferFromCode } from "@/lib/studio/code-inference";

interface ItemFile {
  id: string;
  path: string;
  type: RegistryFileType;
  target: string | null;
  content: string;
}

interface ItemData {
  id: string;
  name: string;
  type: RegistryItemType;
  title: string | null;
  description: string | null;
  docs: string | null;
  dependencies: string[];
  registryDependencies: string[];
  devDependencies: string[];
  cssVars: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  css: Record<string, unknown> | null;
  envVars: Record<string, string>;
  categories: string[];
  meta: Record<string, unknown>;
  sortOrder: number;
  files: ItemFile[];
}

interface ItemEditorProps {
  item: ItemData;
  onUpdate: (updates: Partial<ItemData>) => void;
  onAddFile: (file: Omit<ItemFile, "id">) => void;
  onUpdateFile: (fileId: string, updates: Partial<ItemFile>) => void;
  onRemoveFile: (fileId: string) => void;
}

function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!values.includes(input.trim())) {
        onChange([...values, input.trim()]);
      }
      setInput("");
    }
    if (e.key === "Backspace" && !input && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  if (values.length === 0 && !input) {
    return (
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-8 text-xs"
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex flex-wrap items-center gap-1 rounded-md border border-border/50 bg-background px-2 py-1.5">
        {values.map((value) => (
          <Badge key={value} variant="secondary" className="gap-0.5 text-[10px]">
            {value}
            <button
              type="button"
              onClick={() => onChange(values.filter((v) => v !== value))}
              aria-label={`Remove ${value}`}
              className="ml-0.5 rounded-full hover:bg-muted"
            >
              <X className="size-2.5" />
            </button>
          </Badge>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 ? placeholder : "+"}
          className="min-w-[60px] flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
  );
}

export function ItemEditor({
  item,
  onUpdate,
  onAddFile,
  onUpdateFile,
  onRemoveFile,
}: ItemEditorProps) {
  const [showMetadata, setShowMetadata] = useState(false);
  const [activeFileId, setActiveFileId] = useState<string | null>(
    item.files[0]?.id || null,
  );

  const activeFile = item.files.find((f) => f.id === activeFileId) || null;

  const handleFileContentChange = useCallback(
    (fileId: string, content: string) => {
      onUpdateFile(fileId, { content });
    },
    [onUpdateFile],
  );

  const handleAddFileFromPaste = useCallback(() => {
    const defaultType = item.type.startsWith("registry:")
      ? (item.type as RegistryFileType)
      : ("registry:component" as RegistryFileType);
    onAddFile({
      path: "",
      type: defaultType,
      target: null,
      content: "",
    });
  }, [item.type, onAddFile]);

  const handleDropOnEditor = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      for (const file of files) {
        if (file.name.match(/\.(tsx?|jsx?|css)$/) && file.size < 512 * 1024) {
          const content = await file.text();
          const inferred = inferFromCode(content, file.name);
          onAddFile({
            path: inferred.filePath,
            type: inferred.fileType,
            target: null,
            content,
          });
        }
      }
    },
    [onAddFile],
  );

  const handleReInfer = useCallback(() => {
    if (!activeFile?.content) return;
    const inferred = inferFromCode(activeFile.content, activeFile.path || undefined);
    onUpdate({
      name: inferred.name,
      type: inferred.type,
      dependencies: [
        ...new Set([...item.dependencies, ...inferred.dependencies]),
      ],
      registryDependencies: [
        ...new Set([
          ...item.registryDependencies,
          ...inferred.registryDependencies,
        ]),
      ],
      description: inferred.description || item.description,
    });
    onUpdateFile(activeFile.id, {
      type: inferred.fileType,
      path: inferred.filePath,
    });
  }, [activeFile, item.dependencies, item.registryDependencies, item.description, onUpdate, onUpdateFile]);

  const showTarget = TARGET_REQUIRED_TYPES.includes(item.type);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="space-y-0.5">
            <input
              value={item.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="component-name"
              className="bg-transparent font-mono text-sm font-medium outline-none placeholder:text-muted-foreground/40"
            />
            <div className="flex items-center gap-2">
              <Select
                value={item.type}
                onValueChange={(v) => onUpdate({ type: v as RegistryItemType })}
              >
                <SelectTrigger className="h-6 w-auto gap-1 border-none bg-transparent px-0 text-[10px] text-muted-foreground shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEM_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {activeFile && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1 text-xs text-muted-foreground"
              onClick={handleReInfer}
            >
              <Sparkles className="size-3" />
              Re-detect
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1 text-xs text-muted-foreground"
            onClick={() => setShowMetadata(!showMetadata)}
          >
            <Settings2 className="size-3" />
            {showMetadata ? "Hide" : "Details"}
            <ChevronDown
              className={`size-3 transition-transform ${showMetadata ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      </div>

      {showMetadata && (
        <div className="space-y-3 rounded-lg border border-border/50 bg-muted/20 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Input
                value={item.title || ""}
                onChange={(e) => onUpdate({ title: e.target.value || null })}
                placeholder="Display title"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Description</Label>
              <Input
                value={item.description || ""}
                onChange={(e) => onUpdate({ description: e.target.value || null })}
                placeholder="Brief description"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <TagInput
            label="npm Dependencies"
            values={item.dependencies}
            onChange={(deps) => onUpdate({ dependencies: deps })}
            placeholder="e.g. zod"
          />
          <TagInput
            label="Registry Dependencies"
            values={item.registryDependencies}
            onChange={(deps) => onUpdate({ registryDependencies: deps })}
            placeholder="e.g. button, card"
          />
          <TagInput
            label="Dev Dependencies"
            values={item.devDependencies}
            onChange={(deps) => onUpdate({ devDependencies: deps })}
            placeholder="e.g. @types/react"
          />
          <TagInput
            label="Categories"
            values={item.categories}
            onChange={(cats) => onUpdate({ categories: cats })}
            placeholder="e.g. forms, layout"
          />

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Documentation (Markdown)</Label>
            <Textarea
              value={item.docs || ""}
              onChange={(e) => onUpdate({ docs: e.target.value || null })}
              placeholder="## Usage..."
              rows={3}
              className="font-mono text-xs"
            />
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border/50">
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-3 py-1.5">
          <div className="flex items-center gap-1">
            {item.files.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => setActiveFileId(file.id)}
                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors ${
                  activeFileId === file.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileCode className="size-3" />
                <span className="max-w-[120px] truncate font-mono">
                  {file.path
                    ? file.path.split("/").pop()
                    : "untitled"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(file.id);
                    if (activeFileId === file.id) {
                      setActiveFileId(
                        item.files.find((f) => f.id !== file.id)?.id || null,
                      );
                    }
                  }}
                  aria-label={`Remove ${file.path || "untitled"} file`}
                  className="rounded-full p-0.5 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100 [button:hover_>_&]:opacity-100"
                >
                  <X className="size-2.5" />
                </button>
              </button>
            ))}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 gap-1 px-2 text-xs text-muted-foreground"
            onClick={handleAddFileFromPaste}
          >
            <Plus className="size-3" />
            File
          </Button>
        </div>

        {activeFile ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnEditor}
          >
            <div className="flex items-center gap-2 border-b border-border/30 bg-muted/10 px-3 py-1.5">
              <Input
                value={activeFile.path}
                onChange={(e) =>
                  onUpdateFile(activeFile.id, { path: e.target.value })
                }
                placeholder="components/my-component.tsx"
                className="h-6 flex-1 border-none bg-transparent px-0 font-mono text-xs shadow-none focus-visible:ring-0"
              />
              <Select
                value={activeFile.type}
                onValueChange={(v) =>
                  onUpdateFile(activeFile.id, { type: v as RegistryFileType })
                }
              >
                <SelectTrigger className="h-6 w-auto gap-1 border-none bg-transparent px-1 text-[10px] text-muted-foreground shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["registry:component", "registry:ui", "registry:hook", "registry:lib", "registry:block", "registry:page", "registry:file"].map(
                    (t) => (
                      <SelectItem key={t} value={t}>
                        {t.replace("registry:", "")}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              {showTarget && (
                <Input
                  value={activeFile.target || ""}
                  onChange={(e) =>
                    onUpdateFile(activeFile.id, {
                      target: e.target.value || null,
                    })
                  }
                  placeholder="target path"
                  className="h-6 w-[140px] border-none bg-transparent px-0 font-mono text-xs shadow-none focus-visible:ring-0"
                />
              )}
            </div>
            <textarea
              value={activeFile.content}
              onChange={(e) =>
                handleFileContentChange(activeFile.id, e.target.value)
              }
              placeholder="Paste your component code here..."
              className="min-h-[400px] w-full resize-y bg-background p-4 font-mono text-xs leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/30"
              spellCheck={false}
            />
          </div>
        ) : (
          <button
            type="button"
            className="flex min-h-[200px] w-full flex-col items-center justify-center gap-2 p-8 text-muted-foreground/50 transition-colors hover:bg-muted/20 hover:text-muted-foreground"
            onClick={handleAddFileFromPaste}
          >
            <Upload className="size-6" />
            <span className="text-xs">
              Add a file to get started
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
