"use client";

import { ThemeSwitcher } from "@/registry/default/blocks/theme-switcher/theme-switcher-classic/components/elements/theme-switcher-classic";
import { TinteEditor } from "@/registry/default/blocks/tinte/tinte-editor/components/tinte-editor";

export default function TinteEditorDemo() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Tinte Theme Editor
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              AI-powered theme generation for shadcn/ui. Click the Tinte button
              below to start customizing.
            </p>
          </div>

          {/* Theme Switcher */}
          <div className="flex justify-center items-center gap-3 pt-2">
            <span className="text-sm text-muted-foreground">
              Try switching themes
            </span>
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-card border rounded-lg p-5 space-y-2 text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>AI Icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">AI Generation</h3>
              <p className="text-xs text-muted-foreground">
                Generate themes with AI
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border rounded-lg p-5 space-y-2 text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Template Icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Browse Themes</h3>
              <p className="text-xs text-muted-foreground">
                Explore tinte.dev community
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border rounded-lg p-5 space-y-2 text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Edit Icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Manual Editor</h3>
              <p className="text-xs text-muted-foreground">
                Edit colors & CSS directly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tinte Editor - Floating Button */}
      <TinteEditor />
    </div>
  );
}
