"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface UploadThingPasteProps {
  onPaste?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  accept?: string[];
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function UploadThingPaste({
  onPaste,
  onUpload,
  accept = ["image/*"],
  className,
  disabled = false,
  children,
}: UploadThingPasteProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lastPasted, setLastPasted] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      if (disabled || isUploading) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            const isAccepted = accept.some((pattern) => {
              if (pattern === "*" || pattern === "*/*") return true;
              if (pattern.endsWith("/*")) {
                return file.type.startsWith(pattern.replace("/*", "/"));
              }
              return file.type === pattern;
            });
            if (isAccepted) {
              files.push(file);
            }
          }
        }
      }

      if (files.length === 0) return;

      e.preventDefault();
      onPaste?.(files);

      if (files[0]) {
        setLastPasted(files[0].name);
      }

      if (onUpload) {
        try {
          setIsUploading(true);
          await onUpload(files);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
          console.error("Upload failed:", err);
        } finally {
          setIsUploading(false);
        }
      }
    },
    [accept, disabled, isUploading, onPaste, onUpload]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isFocused) return;

    const handleGlobalPaste = (e: ClipboardEvent) => {
      if (document.activeElement === container || container.contains(document.activeElement)) {
        handlePaste(e);
      }
    };

    document.addEventListener("paste", handleGlobalPaste);
    return () => document.removeEventListener("paste", handleGlobalPaste);
  }, [isFocused, handlePaste]);

  const getStatusContent = () => {
    if (isUploading) {
      return (
        <>
          <LoadingSpinner className="w-8 h-8 text-primary" />
          <span className="text-sm text-muted-foreground">Uploading...</span>
        </>
      );
    }

    if (success) {
      return (
        <>
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckIcon className="w-6 h-6 text-green-500" />
          </div>
          <span className="text-sm text-green-600 dark:text-green-400">
            Uploaded successfully!
          </span>
        </>
      );
    }

    if (lastPasted) {
      return (
        <>
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground truncate max-w-[200px]">
            {lastPasted}
          </span>
        </>
      );
    }

    return (
      <>
        <ClipboardIcon className="w-8 h-8 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {isFocused ? (
            <span>
              Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">⌘V</kbd> to paste
            </span>
          ) : (
            "Click to focus, then paste"
          )}
        </span>
      </>
    );
  };

  if (children) {
    return (
      <div
        ref={containerRef}
        data-slot="uploadthing-paste"
        tabIndex={disabled ? -1 : 0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "outline-none",
          isFocused && "ring-2 ring-primary ring-offset-2 rounded-lg",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-slot="uploadthing-paste"
      tabIndex={disabled ? -1 : 0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-8",
        "border-2 border-dashed rounded-lg transition-all cursor-pointer",
        "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isFocused ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {getStatusContent()}
    </div>
  );
}
