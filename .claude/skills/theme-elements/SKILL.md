---
name: theme-elements
description: Install theme switcher components from the Elements registry. Use when user needs dark mode toggles, theme switchers, light/dark buttons, or theme dropdowns. Triggers on "theme switcher", "dark mode", "light mode", "theme toggle", "theme button", "switch theme", "dark mode toggle".
---

# Theme Switcher Elements

6 theme switcher variants. Requires `next-themes` (auto-installed).

## Install Pattern

```bash
npx shadcn@latest add @elements/theme-switcher-{variant}
```

## Variants

| Variant | Install | Description |
|---------|---------|-------------|
| Button | `@elements/theme-switcher-button` | Simple icon button |
| Classic | `@elements/theme-switcher-classic` | Classic toggle with label |
| Dropdown | `@elements/theme-switcher-dropdown` | Dropdown menu with options |
| Multi-Button | `@elements/theme-switcher-multi-button` | Button group (Light/Dark/System) |
| Switch | `@elements/theme-switcher-switch` | Toggle switch |
| Toggle | `@elements/theme-switcher-toggle` | Animated toggle |

## Quick Patterns

```bash
# Minimal (navbar icon)
npx shadcn@latest add @elements/theme-switcher-button

# Full control
npx shadcn@latest add @elements/theme-switcher-dropdown

# Settings page
npx shadcn@latest add @elements/theme-switcher-multi-button
```

## Setup

Requires `ThemeProvider` from `next-themes` wrapping your app in the root layout:

```tsx
import { ThemeProvider } from "next-themes";

export default function Layout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
```

All variants are hydration-safe by default.

## Discovery

Browse https://tryelements.dev/docs/theme
