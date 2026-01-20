"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface UploadThingAvatarProps {
  value?: string;
  onChange?: (url: string) => void;
  onUpload?: (file: File) => Promise<string>;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
  className?: string;
  disabled?: boolean;
}

const SIZE_CLASSES = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-40 h-40",
};

const ICON_SIZES = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-10 h-10",
};

function CameraIcon({ className }: { className?: string }) {
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
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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

export function UploadThingAvatar({
  value,
  onChange,
  onUpload,
  size = "lg",
  fallback,
  className,
  disabled = false,
}: UploadThingAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      setError(null);
      setPreviewUrl(URL.createObjectURL(file));

      if (onUpload) {
        try {
          setIsUploading(true);
          const url = await onUpload(file);
          onChange?.(url);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Upload failed");
          setPreviewUrl(null);
        } finally {
          setIsUploading(false);
        }
      }

      e.target.value = "";
    },
    [onChange, onUpload]
  );

  const displayUrl = previewUrl || value;

  return (
    <div
      data-slot="uploadthing-avatar"
      className={cn("relative inline-block", className)}
    >
      <div
        className={cn(
          "relative rounded-full overflow-hidden bg-muted border-2 border-border",
          "transition-all duration-200",
          !disabled && "hover:border-primary/50 cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          SIZE_CLASSES[size]
        )}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            {fallback ? (
              <span className="text-2xl font-medium text-muted-foreground">
                {fallback}
              </span>
            ) : (
              <UserIcon
                className={cn("text-muted-foreground", ICON_SIZES[size])}
              />
            )}
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <LoadingSpinner className={ICON_SIZES[size]} />
          </div>
        )}

        {!disabled && !isUploading && (
          <div
            className={cn(
              "absolute inset-0 bg-black/50 flex items-center justify-center",
              "opacity-0 hover:opacity-100 transition-opacity"
            )}
          >
            <CameraIcon className={cn("text-white", ICON_SIZES[size])} />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Upload avatar"
        />
      </div>

      {error && (
        <p className="mt-2 text-xs text-destructive text-center">{error}</p>
      )}
    </div>
  );
}
