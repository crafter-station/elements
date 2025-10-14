import type * as React from "react";

import { cn } from "@/lib/utils";

interface PixelatedHeartIconProps extends React.SVGProps<SVGSVGElement> {}

export function PixelatedHeartIcon({
  className,
  ...props
}: PixelatedHeartIconProps) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn("size-4", className)}
      {...props}
    >
      <title>Pixelated Heart Icon</title>
      <path
        d="M9 2H5v2H3v2H1v6h2v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h2V6h-2V4h-2V2h-4v2h-2v2h-2V4H9V2zm0 2v2h2v2h2V6h2V4h4v2h2v6h-2v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2H3V6h2V4h4z"
        fill="currentColor"
      />
    </svg>
  );
}
