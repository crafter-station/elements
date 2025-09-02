import type * as React from "react";

import { cn } from "@/lib/utils";

interface HourglassIconProps extends React.SVGProps<SVGSVGElement> {}

export function HourglassIcon({ className, ...props }: HourglassIconProps) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn("size-4", className)}
      {...props}
    >
      <title>Hourglass Icon</title>
      <path
        d="M18 2H6v6h2v2h2v4H8v2H6v6h12v-6h-2v-2h-2v-4h2V8h2V2zm-2 6h-2v2h-4V8H8V4h8v4zm-2 6v2h2v4H8v-4h2v-2h4z"
        fill="currentColor"
      />
    </svg>
  );
}
