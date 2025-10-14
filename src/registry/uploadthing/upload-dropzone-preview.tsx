"use client";

export function UploadDropzonePreview() {
  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="w-8 h-8 text-muted-foreground"
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
          <div>
            <p className="text-foreground font-medium">
              Drop files here or click to browse
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Allowed file types: image/png, image/jpeg
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
