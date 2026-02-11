"use client";

import { FileText, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center py-12",
        className,
      )}
    >
      {/* Icon with stacked effect */}
      <div className="relative mb-6">
        {/* Shadow layers */}
        <div className="absolute left-2 top-2 h-16 w-16 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="absolute left-1 top-1 h-16 w-16 rounded-2xl bg-slate-300 dark:bg-slate-600" />

        {/* Main container */}
        <div className="relative h-16 w-16 rounded-2xl bg-slate-900 shadow-xl dark:bg-slate-100">
          <div className="flex h-full w-full items-center justify-center">
            <Icon
              className="h-8 w-8 text-white dark:text-slate-900"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>

      {/* Text content */}
      <div className="space-y-1.5 text-center">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Action button */}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
