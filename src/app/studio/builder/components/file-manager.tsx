"use client";

import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus, Trash2, ChevronDown, FileCode } from "lucide-react";
import { REGISTRY_FILE_TYPES, type RegistryItemType } from "@/lib/studio/types";

interface FileData {
  id: string;
  path: string;
  type: string;
  target: string | null;
  content: string;
}

interface FileManagerProps {
  files: FileData[];
  itemType: RegistryItemType;
  showTarget: boolean;
  onAddFile: (file: Omit<FileData, "id">) => void;
  onUpdateFile: (fileId: string, updates: Partial<FileData>) => void;
  onRemoveFile: (fileId: string) => void;
}

const FILE_TYPE_OPTIONS = REGISTRY_FILE_TYPES.map((t) => ({
  value: t,
  label: t.replace("registry:", ""),
}));

export function FileManager({
  files,
  itemType,
  showTarget,
  onAddFile,
  onUpdateFile,
  onRemoveFile,
}: FileManagerProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(
    new Set(files.map((f) => f.id)),
  );

  function toggleFile(fileId: string) {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  }

  function handleAddFile() {
    const defaultType = itemType.startsWith("registry:")
      ? itemType
      : "registry:component";
    onAddFile({
      path: "",
      type: defaultType,
      target: null,
      content: "",
    });
  }

  function handlePaste(fileId: string) {
    navigator.clipboard.readText().then((text) => {
      onUpdateFile(fileId, { content: text });
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Files ({files.length})</CardTitle>
        <Button size="sm" variant="outline" onClick={handleAddFile}>
          <Plus className="mr-1.5 size-3.5" />
          Add File
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {files.length === 0 && (
          <div className="flex min-h-[100px] items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <FileCode className="mx-auto size-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                No files yet. Add your first file.
              </p>
            </div>
          </div>
        )}

        {files.map((file) => (
          <Collapsible
            key={file.id}
            open={expandedFiles.has(file.id)}
            onOpenChange={() => toggleFile(file.id)}
          >
            <div className="rounded-lg border">
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="size-4 text-muted-foreground" />
                    <span className="font-mono text-sm">
                      {file.path || "untitled"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {file.type.replace("registry:", "")}
                    </span>
                  </div>
                  <ChevronDown className="size-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="space-y-3 border-t px-4 py-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Path</Label>
                      <Input
                        value={file.path}
                        onChange={(e) =>
                          onUpdateFile(file.id, { path: e.target.value })
                        }
                        placeholder="components/my-component.tsx"
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={file.type}
                        onValueChange={(value) =>
                          onUpdateFile(file.id, { type: value })
                        }
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FILE_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {showTarget && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Target Path</Label>
                      <Input
                        value={file.target || ""}
                        onChange={(e) =>
                          onUpdateFile(file.id, {
                            target: e.target.value || null,
                          })
                        }
                        placeholder="app/page.tsx"
                        className="font-mono text-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Content</Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs"
                        onClick={() => handlePaste(file.id)}
                      >
                        Paste from clipboard
                      </Button>
                    </div>
                    <Textarea
                      value={file.content}
                      onChange={(e) =>
                        onUpdateFile(file.id, { content: e.target.value })
                      }
                      placeholder="Paste or type your file content here..."
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onRemoveFile(file.id)}
                    >
                      <Trash2 className="mr-1.5 size-3.5" />
                      Remove File
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
}
