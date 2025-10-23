"use client";

import { useState } from "react";

import { generateUploadDropzone } from "@uploadthing/react";
import { track } from "@vercel/analytics";

import type { OurFileRouter } from "../lib/core";

const UploadDropzone = generateUploadDropzone<OurFileRouter>();

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  ufsUrl: string;
  key: string;
}

interface UploadThingDropzoneProps {
  endpoint?: keyof OurFileRouter;
  onUploadComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (error: Error) => void;
  maxFiles?: number;
  className?: string;
}

export function UploadThingDropzone({
  endpoint = "imageUploader",
  onUploadComplete,
  onUploadError,
  maxFiles = 4,
  className,
}: UploadThingDropzoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [_isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  return (
    <div className={`w-full space-y-4 ${className || ""}`}>
      <div className="border-2 border-dashed border-border rounded-lg p-8 transition-colors hover:border-primary/50">
        <UploadDropzone
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

              setUploadedFiles((prev) => [...prev, ...files]);

              // Analytics tracking
              track("UploadThing Upload Complete", {
                endpoint,
                files_count: files.length,
                total_size: files.reduce((acc, file) => acc + file.size, 0),
                file_types: [...new Set(files.map((f) => f.type))].join(","),
                source: "uploadthing_dropzone",
                action: "upload_success",
              });

              onUploadComplete?.(files);
            }
            setIsUploading(false);
            setUploadProgress(0);
          }}
          onUploadError={(error: Error) => {
            console.error("Upload error:", error);

            // Analytics tracking for errors
            track("UploadThing Upload Error", {
              endpoint,
              error_message: error.message,
              source: "uploadthing_dropzone",
              action: "upload_error",
            });

            onUploadError?.(error);
            setIsUploading(false);
            setUploadProgress(0);
          }}
          onUploadBegin={(file) => {
            setIsUploading(true);
            setUploadProgress(0);

            // Analytics tracking for upload start
            track("UploadThing Upload Begin", {
              endpoint,
              file_name: file,
              source: "uploadthing_dropzone",
              action: "upload_begin",
            });
          }}
          onUploadProgress={(progress) => {
            setUploadProgress(progress);
          }}
          onChange={(acceptedFiles) => {
            if (acceptedFiles && acceptedFiles.length > maxFiles) {
              return;
            }

            if (acceptedFiles && acceptedFiles.length > 0) {
              // Analytics tracking for file selection
              track("UploadThing Files Selected", {
                endpoint,
                files_count: acceptedFiles.length,
                file_types: [...new Set(acceptedFiles.map((f) => f.type))].join(
                  ",",
                ),
                source: "uploadthing_dropzone",
                action: "files_selected",
              });
            }
          }}
          appearance={{
            container: "border-none bg-transparent p-0",
            uploadIcon: "text-muted-foreground",
            label:
              "text-foreground hover:text-primary transition-colors cursor-pointer",
            allowedContent: "text-muted-foreground text-sm",
          }}
          content={{
            uploadIcon: ({ isUploading }) => {
              if (isUploading) {
                return (
                  <div className="w-24 space-y-2">
                    <div className="w-8 h-8 mx-auto">
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <div className="text-xs text-center text-muted-foreground">
                      {uploadProgress}%
                    </div>
                  </div>
                );
              }
              return (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              );
            },
            label: ({ ready, isUploading }) => {
              // Debug: log the actual values
              console.log("UploadThing state:", { ready, isUploading });

              if (isUploading) return "Uploading...";
              if (ready) return "Drop files here or click to browse";
              return "Getting ready...";
            },
            allowedContent: ({ ready, fileTypes, isUploading }) => {
              if (isUploading) return "Please wait while files are uploading";
              if (!ready) return "Checking what you can upload";
              return `Allowed file types: ${fileTypes?.join(", ") || "any"}`;
            },
          }}
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Uploaded Files</h4>
          <div className="grid gap-2 max-h-48 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div
                key={`${file.key}-${index}`}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>{file.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(file.ufsUrl);

                      // Analytics tracking for URL copy
                      track("UploadThing URL Copy", {
                        endpoint,
                        file_name: file.name,
                        source: "uploadthing_dropzone",
                        action: "copy_url",
                      });
                    }}
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy URL"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <a
                    href={file.ufsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Open file"
                    aria-label={`Open ${file.name} in new tab`}
                    onClick={() => {
                      // Analytics tracking for file view
                      track("UploadThing File View", {
                        endpoint,
                        file_name: file.name,
                        source: "uploadthing_dropzone",
                        action: "view_file",
                      });
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <span className="sr-only">Open file</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFiles((prev) =>
                        prev.filter((_, i) => i !== index),
                      );

                      // Analytics tracking for file removal
                      track("UploadThing File Remove", {
                        endpoint,
                        file_name: file.name,
                        source: "uploadthing_dropzone",
                        action: "remove_file",
                      });
                    }}
                    className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove from list"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setUploadedFiles([]);

              // Analytics tracking for clear all
              track("UploadThing Clear All Files", {
                endpoint,
                files_count: uploadedFiles.length,
                source: "uploadthing_dropzone",
                action: "clear_all",
              });
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all files
          </button>
        </div>
      )}
    </div>
  );
}
