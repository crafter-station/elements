"use client";

import { ThemeSwitcherToggle } from "./toggle";

export default function ThemeSwitcherTogglePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Theme Switcher Toggle</h1>
            <p className="text-muted-foreground">
              A custom toggle theme switcher with sliding animation and smooth
              transitions.
            </p>
          </div>

          <div className="flex justify-center">
            <ThemeSwitcherToggle />
          </div>

          <div className="bg-card border rounded-lg p-6 text-left space-y-4">
            <h2 className="text-lg font-semibold">Features</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Custom built toggle component</li>
              <li>• Smooth sliding animation</li>
              <li>• Sun/moon icon transitions</li>
              <li>• No external dependencies</li>
              <li>• Loading state with skeleton</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
