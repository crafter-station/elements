"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface UploadThingButtonProps {
  onUpload?: (files: File[]) => Promise<void>;
  onSelect?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function UploadIcon({ className }: { className?: string }) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
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

export function UploadThingButton({
  onUpload,
  onSelect,
  accept = "image/*",
  multiple = false,
  maxFiles = 1,
  maxSize = 4 * 1024 * 1024,
  disabled = false,
  className,
  children,
}: UploadThingButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (!fileList || fileList.length === 0) return;

      const files = Array.from(fileList).slice(0, maxFiles);
      setError(null);
      setUploadComplete(false);

      for (const file of files) {
        if (file.size > maxSize) {
          setError(`File too large. Max size: ${Math.round(maxSize / 1024 / 1024)}MB`);
          e.target.value = "";
          return;
        }
      }

      onSelect?.(files);

      if (onUpload) {
        try {
          setIsUploading(true);
          await onUpload(files);
          setUploadComplete(true);
          setTimeout(() => setUploadComplete(false), 2000);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
          setIsUploading(false);
        }
      }

      e.target.value = "";
    },
    [maxFiles, maxSize, onSelect, onUpload]
  );

  return (
    <div data-slot="uploadthing-button" className={cn("inline-flex flex-col items-start gap-1", className)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isUploading}
        className={cn(
          "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md",
          "bg-primary text-primary-foreground font-medium text-sm",
          "transition-all duration-200",
          "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          uploadComplete && "bg-green-600 hover:bg-green-600"
        )}
      >
        {isUploading ? (
          <>
            <LoadingSpinner className="w-4 h-4" />
            <span>Uploading...</span>
          </>
        ) : uploadComplete ? (
          <>
            <CheckIcon className="w-4 h-4" />
            <span>Uploaded!</span>
          </>
        ) : (
          <>
            <UploadIcon className="w-4 h-4" />
            <span>{children || "Choose File"}</span>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="sr-only"
        aria-label="Upload file"
      />

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
