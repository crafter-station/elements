import type { ReactNode } from "react";

interface ElementWrapperProps {
  children: ReactNode;
  logo?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function ElementWrapper({
  children,
  logo,
  icon,
  className = "",
}: ElementWrapperProps) {
  return (
    <div className={`w-full max-w-md space-y-4 ${className}`}>
      <div className="bg-background relative border-dotted border-2 border-foreground/50 p-6 rounded-lg shadow-sm">
        {(logo || icon) && (
          <div className="size-8 flex items-center justify-center absolute -top-3 -right-3 bg-background border border-border/30 rounded-full shadow-sm">
            {icon || logo}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
