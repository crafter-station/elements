"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface ImageItem {
  id: string;
  url: string;
  name?: string;
}

interface UploadThingImageGridProps {
  value?: ImageItem[];
  onChange?: (images: ImageItem[]) => void;
  onUpload?: (files: File[]) => Promise<ImageItem[]>;
  onRemove?: (id: string) => void;
  maxImages?: number;
  columns?: 2 | 3 | 4;
  className?: string;
  disabled?: boolean;
}

function PlusIcon({ className }: { className?: string }) {
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
      <path d="M12 5v14M5 12h14" />
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
      <path d="M18 6 6 18M6 6l12 12" />
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

const GRID_COLS = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

export type { ImageItem };

export function UploadThingImageGrid({
  value = [],
  onChange,
  onUpload,
  onRemove,
  maxImages = 9,
  columns = 3,
  className,
  disabled = false,
}: UploadThingImageGridProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingPreviews, setUploadingPreviews] = useState<string[]>([]);

  const canAddMore = value.length < maxImages;

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const imageFiles = files.filter((f) => f.type.startsWith("image/"));
      const allowedCount = Math.min(imageFiles.length, maxImages - value.length);
      const filesToUpload = imageFiles.slice(0, allowedCount);

      const previews = filesToUpload.map((f) => URL.createObjectURL(f));
      setUploadingPreviews(previews);

      if (onUpload) {
        try {
          setIsUploading(true);
          const newImages = await onUpload(filesToUpload);
          onChange?.([...value, ...newImages]);
        } catch (err) {
          console.error("Upload failed:", err);
        } finally {
          setIsUploading(false);
          setUploadingPreviews([]);
          previews.forEach((p) => URL.revokeObjectURL(p));
        }
      }

      e.target.value = "";
    },
    [value, onChange, onUpload, maxImages]
  );

  const handleRemove = useCallback(
    (id: string) => {
      onRemove?.(id);
      onChange?.(value.filter((img) => img.id !== id));
    },
    [value, onChange, onRemove]
  );

  return (
    <div
      data-slot="uploadthing-image-grid"
      className={cn("w-full", className)}
    >
      <div className={cn("grid gap-3", GRID_COLS[columns])}>
        {value.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border group"
          >
            <img
              src={image.url}
              alt={image.name || "Uploaded image"}
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemove(image.id)}
                className={cn(
                  "absolute top-2 right-2 p-1.5 rounded-full",
                  "bg-black/50 text-white hover:bg-black/70",
                  "opacity-0 group-hover:opacity-100 transition-opacity"
                )}
                aria-label={`Remove ${image.name || "image"}`}
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {uploadingPreviews.map((preview, index) => (
          <div
            key={`uploading-${index}`}
            className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border"
          >
            <img
              src={preview}
              alt="Uploading"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner className="w-8 h-8 text-primary" />
            </div>
          </div>
        ))}

        {canAddMore && !isUploading && !disabled && (
          <label
            className={cn(
              "relative aspect-square rounded-lg border-2 border-dashed border-border",
              "flex flex-col items-center justify-center gap-2 cursor-pointer",
              "hover:border-primary/50 hover:bg-accent/50 transition-colors"
            )}
          >
            <PlusIcon className="w-8 h-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {value.length}/{maxImages}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Add images"
            />
          </label>
        )}
      </div>

      {value.length === 0 && !isUploading && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          Click the + button to add images
        </p>
      )}
    </div>
  );
}
