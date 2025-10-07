"use client";

import { ThemeSwitcherButton } from "./button";

export default function ThemeSwitcherButtonPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Theme Switcher Button</h1>
            <p className="text-muted-foreground">
              A button-based theme switcher with rotating sun/moon icons and
              smooth transitions.
            </p>
          </div>

          <div className="flex justify-center">
            <ThemeSwitcherButton />
          </div>

          <div className="bg-card border rounded-lg p-6 text-left space-y-4">
            <h2 className="text-lg font-semibold">Features</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Animated sun/moon icon transitions</li>
              <li>• Smooth rotation and scaling effects</li>
              <li>• Loading state with skeleton</li>
              <li>• Accessible with screen reader support</li>
              <li>• Toggle between light and dark themes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
