import type * as React from "react";

import { cn } from "@/lib/utils";

interface PixelatedSharpCornerIconProps extends React.SVGProps<SVGSVGElement> {}

export function PixelatedSharpCornerIcon({
  className,
  ...props
}: PixelatedSharpCornerIconProps) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn("size-4", className)}
      {...props}
    >
      <title>Pixelated Sharp Corner Icon</title>
      <path
        d="M3 3h2v2H3V3zm0 4h2v2H3V7zm2 4H3v2h2v-2zm-2 4h2v2H3v-2zm2 4H3v2h2v-2zm2 0h2v2H7v-2zm6 0h-2v2h2v-2zm2 0h2v2h-2v-2zm6 0h-2v2h2v-2zm-2-4h2v2h-2v-2zm2-2V3H11v2h8v8h2zM7 3h2v2H7V3z"
        fill="currentColor"
      />
    </svg>
  );
}
