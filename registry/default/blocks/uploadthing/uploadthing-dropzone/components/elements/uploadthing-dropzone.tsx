"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface UploadThingDropzoneProps {
  onUpload?: (files: File[]) => Promise<UploadedFile[]>;
  onSelect?: (files: File[]) => void;
  onProgress?: (progress: number) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
}

function UploadCloudIcon({ className }: { className?: string }) {
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
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
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
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function UploadThingDropzone({
  onUpload,
  onSelect,
  onProgress,
  accept = "image/*",
  maxFiles = 4,
  maxSize = 4 * 1024 * 1024,
  disabled = false,
  className,
}: UploadThingDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const validFiles = files.slice(0, maxFiles);
      setError(null);

      for (const file of validFiles) {
        if (file.size > maxSize) {
          setError(`File too large. Max size: ${formatFileSize(maxSize)}`);
          return;
        }
      }

      onSelect?.(validFiles);

      if (onUpload) {
        try {
          setIsUploading(true);
          setProgress(0);

          const interval = setInterval(() => {
            setProgress((prev) => {
              const next = Math.min(prev + 10, 90);
              onProgress?.(next);
              return next;
            });
          }, 200);

          const results = await onUpload(validFiles);
          clearInterval(interval);
          setProgress(100);
          onProgress?.(100);
          setUploadedFiles((prev) => [...prev, ...results]);

          setTimeout(() => {
            setProgress(0);
          }, 1000);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
          setIsUploading(false);
        }
      }
    },
    [maxFiles, maxSize, onSelect, onUpload, onProgress]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled || isUploading) return;

      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [disabled, isUploading, handleFiles]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      handleFiles(files);
      e.target.value = "";
    },
    [handleFiles]
  );

  const handleClick = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div data-slot="uploadthing-dropzone" className={cn("w-full space-y-4", className)}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8",
          "flex flex-col items-center justify-center gap-4",
          "transition-all duration-200 cursor-pointer",
          "hover:border-primary/50 hover:bg-muted/30",
          isDragOver && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent",
          isUploading && "pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <UploadCloudIcon className={cn(
            "w-10 h-10 text-muted-foreground transition-colors",
            isDragOver && "text-primary"
          )} />
          
          {isUploading ? (
            <div className="w-48 space-y-2">
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{progress}% uploading...</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium">
                {isDragOver ? "Drop files here" : "Drop files here or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground">
                Max {maxFiles} files, up to {formatFileSize(maxSize)} each
              </p>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="sr-only"
          aria-label="Upload files"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Uploaded Files</h4>
            <button
              type="button"
              onClick={() => setUploadedFiles([])}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="grid gap-2 max-h-48 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <FileIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.type || "unknown"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => copyUrl(file.url)}
                    className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy URL"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </button>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Open file"
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
