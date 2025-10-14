import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type ChatContainerProps = HTMLAttributes<HTMLDivElement>;

export const ChatContainer = ({
  className,
  children,
  ...props
}: ChatContainerProps) => (
  <div
    className={cn(
      "flex-1 overflow-y-auto p-4 space-y-2 bg-muted/20 rounded-md border",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
