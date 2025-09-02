"use client";

import { ThemeSwitcherDropdown } from "./dropdown";

export default function ThemeSwitcherDropdownPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Theme Switcher Dropdown</h1>
            <p className="text-muted-foreground">
              A dropdown theme switcher with system, light, and dark options.
            </p>
          </div>

          <div className="flex justify-center">
            <ThemeSwitcherDropdown />
          </div>

          <div className="bg-card border rounded-lg p-6 text-left space-y-4">
            <h2 className="text-lg font-semibold">Features</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Three theme options: System, Light, Dark</li>
              <li>• ShadCN dropdown menu integration</li>
              <li>• Icon indicators for each theme</li>
              <li>• Current theme highlighting</li>
              <li>• Loading state with skeleton</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
