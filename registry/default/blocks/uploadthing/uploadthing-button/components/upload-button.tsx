"use client";

import { generateUploadButton } from "@uploadthing/react";
import { track } from "@vercel/analytics";

import type { OurFileRouter } from "../lib/core";

const UploadButton = generateUploadButton<OurFileRouter>();

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  ufsUrl: string;
  key: string;
}

interface UploadThingButtonProps {
  endpoint?: keyof OurFileRouter;
  onUploadComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
}

export function UploadThingButton({
  endpoint = "imageUploader",
  onUploadComplete,
  onUploadError,
}: UploadThingButtonProps) {
  return (
    <UploadButton
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res) {
          const files = res.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            ufsUrl: file.ufsUrl,
            key: file.key,
          }));

          // Analytics tracking
          track("UploadThing Upload Complete", {
            endpoint,
            files_count: files.length,
            total_size: files.reduce((acc, file) => acc + file.size, 0),
            file_types: [...new Set(files.map((f) => f.type))].join(","),
            source: "uploadthing_button",
            action: "upload_success",
          });

          onUploadComplete?.(files);
        }
      }}
      onUploadError={(error: Error) => {
        console.error("Upload error:", error);

        // Analytics tracking for errors
        track("UploadThing Upload Error", {
          endpoint,
          error_message: error.message,
          source: "uploadthing_button",
          action: "upload_error",
        });

        onUploadError?.(error);
      }}
    />
  );
}
