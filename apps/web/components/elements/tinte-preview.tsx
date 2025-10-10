"use client";

import { useState } from "react";

import { Palette, Sparkles } from "lucide-react";

export function TintePreview() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      className="relative w-full h-48 rounded-lg border bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 p-6 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating ball (theme editor trigger) */}
      <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 shadow-lg transition-transform hover:scale-110">
        <Palette className="h-6 w-6 text-white" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h3 className="font-semibold text-foreground">AI Theme Editor</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Generate beautiful themes with OKLCH color space
        </p>

        {/* Color tokens preview */}
        <div className="flex gap-2 mt-4">
          <div
            className="h-8 w-8 rounded border bg-background"
            title="Background"
          />
          <div className="h-8 w-8 rounded border bg-primary" title="Primary" />
          <div
            className="h-8 w-8 rounded border bg-secondary"
            title="Secondary"
          />
          <div className="h-8 w-8 rounded border bg-accent" title="Accent" />
          <div className="h-8 w-8 rounded border bg-muted" title="Muted" />
        </div>

        {/* Animated hint */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-sm font-medium">
                <Palette className="h-4 w-4" />
                Click to open theme editor
              </div>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
