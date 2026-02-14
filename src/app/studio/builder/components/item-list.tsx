"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCode, Trash2, Code, Upload, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ITEM_TYPE_LABELS } from "@/lib/studio/constants";
import type { RegistryItemType } from "@/lib/studio/types";

interface ItemSummary {
  id: string;
  name: string;
  type: string;
  title: string | null;
  description: string | null;
  files: Array<{ id: string }>;
}

interface ItemListProps {
  items: ItemSummary[];
  selectedItemId: string | null;
  onSelectItem: (itemId: string) => void;
  onAddItemFromCode: (code: string, filename?: string) => void;
  onRemoveItem: (itemId: string) => void;
}

export function ItemList({
  items,
  selectedItemId,
  onSelectItem,
  onAddItemFromCode,
  onRemoveItem,
}: ItemListProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showPasteZone, setShowPasteZone] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      dragCounter.current = 0;

      const files = Array.from(e.dataTransfer.files);
      for (const file of files) {
        if (
          file.name.match(/\.(tsx?|jsx?|css)$/) &&
          file.size < 512 * 1024
        ) {
          const content = await file.text();
          onAddItemFromCode(content, file.name);
        }
      }

      const text = e.dataTransfer.getData("text/plain");
      if (text && text.trim().length > 10 && files.length === 0) {
        onAddItemFromCode(text);
      }
    },
    [onAddItemFromCode],
  );

  const handlePasteSubmit = useCallback(() => {
    const code = textareaRef.current?.value?.trim();
    if (!code) return;
    onAddItemFromCode(code);
    if (textareaRef.current) textareaRef.current.value = "";
    setShowPasteZone(false);
  }, [onAddItemFromCode]);

  const handlePasteKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && e.metaKey) {
        e.preventDefault();
        handlePasteSubmit();
      }
      if (e.key === "Escape") {
        setShowPasteZone(false);
      }
    },
    [handlePasteSubmit],
  );

  return (
    <Card
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "transition-colors",
        isDragging && "border-primary/50 bg-primary/5",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Items ({items.length})</CardTitle>
        <Button
          size="sm"
          onClick={() => setShowPasteZone(!showPasteZone)}
          className="gap-1.5 text-xs"
        >
          <Code className="size-3" />
          Paste Code
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {showPasteZone && (
          <div className="space-y-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
            <textarea
              ref={textareaRef}
              placeholder="Paste your component code here..."
              rows={6}
              className="w-full resize-none rounded-md border border-border/50 bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              onKeyDown={handlePasteKeyDown}
              autoFocus
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                Cmd+Enter to add
              </span>
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => setShowPasteZone(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handlePasteSubmit}
                >
                  <Sparkles className="mr-1 size-3" />
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        )}

        {isDragging && (
          <div className="flex min-h-[80px] items-center justify-center rounded-lg border-2 border-dashed border-primary/40 bg-primary/10">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Upload className="size-4" />
              Drop .tsx, .ts, .jsx files
            </div>
          </div>
        )}

        {items.length === 0 && !showPasteZone && !isDragging ? (
          <div className="flex min-h-[120px] flex-col items-center justify-center rounded-lg border border-dashed border-border/50">
            <Code className="size-6 text-muted-foreground/30" />
            <p className="mt-2 text-xs text-muted-foreground">
              Paste code or drop files to add items
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground/60">
              Name, type, and deps are auto-detected
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectItem(item.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left transition-colors",
                  selectedItemId === item.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted/50",
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileCode className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm font-medium">
                      {item.name || "untitled"}
                    </p>
                    {item.title && (
                      <p className="truncate text-xs text-muted-foreground">
                        {item.title}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {ITEM_TYPE_LABELS[item.type as RegistryItemType] ||
                      item.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {item.files.length}f
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-7 p-0"
                    aria-label={`Remove ${item.name || "untitled"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.id);
                    }}
                  >
                    <Trash2 className="size-3.5 text-muted-foreground" />
                  </Button>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
