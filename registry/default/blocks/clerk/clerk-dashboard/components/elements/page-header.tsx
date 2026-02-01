"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn("flex items-center gap-4", className)}
    >
      {Icon && (
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-lg">
          <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 p-3 shadow-inner">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      )}
      <div className="flex-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
