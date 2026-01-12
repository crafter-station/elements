# Component Patterns Reference

## cn() Utility

Merges class names using clsx + tailwind-merge.

```tsx
import { cn } from "@/lib/utils";

function Component({ className, ...props }) {
  return (
    <div className={cn("base-classes", className)} {...props} />
  );
}
```

## data-slot Attribute

Enables external styling hooks without class names.

```tsx
<div data-slot="card" className={cn("...", className)}>
  <div data-slot="card-header">...</div>
  <div data-slot="card-content">...</div>
</div>
```

Users can target via CSS:
```css
[data-slot="card"]:hover { ... }
```

## Props Typing

Extend native element props:

```tsx
interface CardProps extends React.ComponentProps<"div"> {}

function Card({ className, ...props }: CardProps) {
  return <div className={cn("...", className)} {...props} />;
}
```

With additional props:

```tsx
interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "outline";
  asChild?: boolean;
}
```

## CVA Variants

Use class-variance-authority for variant management:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "base-classes-always-applied",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border bg-background",
        ghost: "hover:bg-accent",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-7 px-3",
        lg: "h-10 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

## Client Components

Add "use client" for hooks/interactivity:

```tsx
"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Skeleton />;

  return ...;
}
```

## Hydration Safety

Handle SSR/CSR mismatch for theme-dependent components:

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return <div className="animate-pulse bg-muted h-8 w-8 rounded" />;
}
```

## Slot Pattern (Radix)

Use Slot for polymorphic components:

```tsx
import { Slot } from "@radix-ui/react-slot";

function Button({ asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp {...props} />;
}

// Usage: renders as anchor
<Button asChild>
  <a href="/link">Click me</a>
</Button>
```

## Export Conventions

Named exports, PascalCase functions:

```tsx
// Single component
export function Card({ ... }) { ... }

// With variants
export { Button, buttonVariants };

// Compound component
export { Card, CardHeader, CardContent, CardFooter };
```

## Complete Example

```tsx
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      padding: {
        default: "p-6",
        compact: "p-4",
        none: "p-0",
      },
    },
    defaultVariants: {
      padding: "default",
    },
  }
);

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({ className, padding, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ padding, className }))}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("font-semibold leading-none", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("text-sm", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardContent, cardVariants };
```
