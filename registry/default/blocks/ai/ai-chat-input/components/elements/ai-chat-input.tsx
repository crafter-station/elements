"use client";

import * as React from "react";

import { Loader2, Paperclip } from "lucide-react";

import { cn } from "@/lib/utils";

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
    const minHeight = 72;
    const maxHeight = lineHeight * maxRows;
    const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight));
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
      textareaRef.current.style.height = "72px";
    }
  }, [value, attachments, canSubmit, onSubmit]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setAttachments((prev) => [...prev, ...files]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    []
  );

  const removeAttachment = React.useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div
      data-slot="ai-chat-input"
      className={cn("w-full font-mono", className)}
    >
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-1.5 border bg-muted px-2 py-1 text-xs"
            >
              <Paperclip className="size-3 text-muted-foreground" />
              <span className="max-w-[150px] truncate uppercase tracking-wider">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="ml-1 text-muted-foreground hover:text-foreground"
                disabled={isDisabled}
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-0 border bg-background focus-within:ring-1 focus-within:ring-ring">
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
            <button
              type="button"
              className="flex size-10 shrink-0 items-center justify-center border-r text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              onClick={() => fileInputRef.current?.click()}
              disabled={isDisabled}
            >
              <Paperclip className="size-4" />
              <span className="sr-only">Attach files</span>
            </button>
          </>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled}
          rows={3}
          aria-label="Chat message input"
          className={cn(
            "flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-50",
            "min-h-[72px] px-3 py-2.5"
          )}
        />

        <button
          type="button"
          className="shrink-0 border-l px-4 py-2.5 text-xs uppercase tracking-wider transition-colors hover:bg-muted disabled:opacity-30"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "SEND"}
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </div>
  );
}

export type { AiChatInputProps };
