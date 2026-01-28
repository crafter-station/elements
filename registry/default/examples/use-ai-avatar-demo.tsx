"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { useAiAvatar } from "@/registry/default/blocks/badges/use-ai-avatar/components/elements/use-ai-avatar";

export default function UseAiAvatarDemo() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { generateAvatar, isGenerating, progress, status, avatarUrl, error } =
    useAiAvatar({
      endpoint: "/api/generate-avatar",
      style: "pixel-art",
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      // Generate avatar
      await generateAvatar({ image: file });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 w-full max-w-md mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">AI Avatar Generator</h3>
        <p className="text-sm text-muted-foreground">
          Upload a photo to generate a pixel-art avatar
        </p>
      </div>

      <div className="flex gap-4 items-center justify-center">
        {/* Original image */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden",
              imageUrl && "border-solid border-border",
            )}
          >
            {imageUrl ? (
              // biome-ignore lint/performance/noImgElement: Uses blob URLs from FileReader
              <img
                src={imageUrl}
                alt="Original"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted-foreground">Original</span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">Input</span>
        </div>

        {/* Arrow */}
        <div className="text-muted-foreground">→</div>

        {/* Generated avatar */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden",
              avatarUrl && "border-solid border-primary",
            )}
          >
            {isGenerating ? (
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-muted-foreground">
                  {progress}%
                </span>
              </div>
            ) : avatarUrl ? (
              // biome-ignore lint/performance/noImgElement: Uses dynamic AI-generated URLs
              <img
                src={avatarUrl}
                alt="AI Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted-foreground">AI Avatar</span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">Output</span>
        </div>
      </div>

      {status && <p className="text-sm text-muted-foreground">{status}</p>}

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      <label
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium cursor-pointer",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          isGenerating && "opacity-50 pointer-events-none",
        )}
      >
        {isGenerating ? "Generating..." : "Upload Photo"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isGenerating}
          className="sr-only"
        />
      </label>

      <p className="text-xs text-muted-foreground text-center">
        Note: This demo requires a backend API endpoint at /api/generate-avatar
      </p>
    </div>
  );
}
