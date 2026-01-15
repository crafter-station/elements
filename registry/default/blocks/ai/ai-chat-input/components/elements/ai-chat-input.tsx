"use client";

import * as React from "react";

import { ArrowUp, Loader2, Paperclip } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface AiChatInputProps {
  onSubmit?: (message: string, attachments?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  allowAttachments?: boolean;
  maxRows?: number;
  className?: string;
}

export function AiChatInput({
  onSubmit,
  placeholder = "Type a message...",
  disabled = false,
  loading = false,
  allowAttachments = false,
  maxRows = 6,
  className,
}: AiChatInputProps) {
  const [value, setValue] = React.useState("");
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isDisabled = disabled || loading;
  const canSubmit = value.trim().length > 0 && !isDisabled;

  const adjustHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const lineHeight = 24;
    const maxHeight = lineHeight * maxRows;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [maxRows]);

  React.useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  const handleSubmit = React.useCallback(() => {
    if (!canSubmit) return;

    onSubmit?.(value.trim(), attachments.length > 0 ? attachments : undefined);
    setValue("");
    setAttachments([]);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, attachments, canSubmit, onSubmit]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setAttachments((prev) => [...prev, ...files]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [],
  );

  const removeAttachment = React.useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const isMac = React.useMemo(
    () =>
      typeof navigator !== "undefined" &&
      /Mac|iPod|iPhone|iPad/.test(navigator.platform),
    [],
  );

  return (
    <div data-slot="ai-chat-input" className={cn("w-full", className)}>
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-sm"
            >
              <Paperclip className="size-3.5 text-muted-foreground" />
              <span className="max-w-[150px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="text-muted-foreground hover:text-foreground ml-1"
                disabled={isDisabled}
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-end gap-2 rounded-xl border bg-background p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {allowAttachments && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={isDisabled}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={isDisabled}
            >
              <Paperclip className="size-4" />
              <span className="sr-only">Attach files</span>
            </Button>
          </>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled}
          rows={1}
          aria-label="Chat message input"
          className={cn(
            "flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            "min-h-[24px] py-1.5 px-2",
          )}
        />

        <Button
          type="button"
          size="icon"
          className="size-8 shrink-0 rounded-lg"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowUp className="size-4" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </div>

      <p className="mt-1.5 text-xs text-muted-foreground text-center">
        Press{" "}
        <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px] font-mono">
          {isMac ? "⌘" : "Ctrl"}
        </kbd>{" "}
        +{" "}
        <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px] font-mono">
          Enter
        </kbd>{" "}
        to send
      </p>
    </div>
  );
}

export type { AiChatInputProps };
