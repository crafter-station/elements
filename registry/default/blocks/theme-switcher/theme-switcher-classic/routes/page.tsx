"use client";

import { ThemeSwitcher } from "./theme-switcher";

export default function ThemeSwitcherPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Theme Switcher</h1>
            <p className="text-muted-foreground">
              A classic theme switcher component with animated sun/moon icons.
            </p>
          </div>

          <div className="flex justify-center">
            <ThemeSwitcher />
          </div>

          <div className="bg-card border rounded-lg p-6 text-left space-y-4">
            <h2 className="text-lg font-semibold">Features</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• ShadCN switch component base</li>
              <li>• Animated sun/moon icon transitions</li>
              <li>• Smooth theme switching</li>
              <li>• Loading state with skeleton</li>
              <li>• Clean and minimal design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
