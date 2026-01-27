"use client";

import { TextShimmer } from "@/components/elements/text-shimmer";

export default function TextShimmerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Text Shimmer</h1>
            <p className="text-muted-foreground">
              Animated shimmer effect for text with customizable timing and
              spread.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <TextShimmer className="text-4xl font-bold" duration={1.5}>
              Cooking...
            </TextShimmer>

            <TextShimmer as="h2" className="text-2xl" duration={2}>
              Loading your content
            </TextShimmer>

            <TextShimmer
              className="text-lg text-muted-foreground"
              duration={2.5}
            >
              Please wait while we prepare everything
            </TextShimmer>
          </div>

          <div className="bg-card border rounded-lg p-6 text-left space-y-4">
            <h2 className="text-lg font-semibold">Features</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Polymorphic component (render as any HTML element)</li>
              <li>• Smooth CSS gradient animation</li>
              <li>• Light and dark mode support</li>
              <li>• Customizable duration, spread, and delay</li>
              <li>• Memoized for performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
