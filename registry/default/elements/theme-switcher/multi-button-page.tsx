"use client";

import { ThemeSwitcherMultiButton } from "./multi-button";

export default function ThemeSwitcherMultiButtonPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Theme Switcher Multi Button</h1>
            <p className="text-muted-foreground">
              A multi-button theme switcher with system, light, and dark options
              in a button group.
            </p>
          </div>

          <div className="flex justify-center">
            <ThemeSwitcherMultiButton />
          </div>

          <div className="bg-card border rounded-lg p-6 text-left space-y-4">
            <h2 className="text-lg font-semibold">Features</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Three theme buttons: System, Light, Dark</li>
              <li>• Visual active state indication</li>
              <li>• Icon representation for each theme</li>
              <li>• Button group layout</li>
              <li>• Loading state with skeleton</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
