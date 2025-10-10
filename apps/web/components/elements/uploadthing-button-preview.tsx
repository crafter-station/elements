"use client";

export function UploadButtonPreview() {
  return (
    <div className="flex items-center justify-center p-8">
      <button
        type="button"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
      >
        Choose File
      </button>
    </div>
  );
}
