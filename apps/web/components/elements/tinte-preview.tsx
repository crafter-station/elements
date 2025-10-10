"use client";

import ThemeEditor from "@/../../packages/tinte/src/components/theme-editor";

export function TintePreview() {
  return (
    <div className="relative w-full min-h-[300px] rounded-lg border bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">
            Live Theme Editor Demo
          </h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Click the floating purple ball in the bottom-right corner to open the
          AI-powered theme editor
        </p>

        {/* Color tokens showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="space-y-2">
            <div className="h-12 rounded border bg-primary" />
            <p className="text-xs text-muted-foreground">Primary</p>
          </div>
          <div className="space-y-2">
            <div className="h-12 rounded border bg-secondary" />
            <p className="text-xs text-muted-foreground">Secondary</p>
          </div>
          <div className="space-y-2">
            <div className="h-12 rounded border bg-accent" />
            <p className="text-xs text-muted-foreground">Accent</p>
          </div>
          <div className="space-y-2">
            <div className="h-12 rounded border bg-muted" />
            <p className="text-xs text-muted-foreground">Muted</p>
          </div>
        </div>
      </div>

      {/* Real ThemeEditor component */}
      <ThemeEditor />
    </div>
  );
}
