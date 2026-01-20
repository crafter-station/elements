"use client";

import { useMemo } from "react";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "incomplete";

export interface PolarSubscriptionBadgeProps {
  tier: string;
  status?: SubscriptionStatus;
  showStatus?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "solid";
  className?: string;
}

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  free: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-300 dark:border-slate-600",
  },
  starter: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-700",
  },
  pro: {
    bg: "bg-violet-100 dark:bg-violet-900/30",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-300 dark:border-violet-700",
  },
  business: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-700",
  },
  enterprise: {
    bg: "bg-gradient-to-r from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-300 dark:border-violet-700",
  },
};

const STATUS_INDICATORS: Record<SubscriptionStatus, { color: string; label: string }> = {
  active: { color: "bg-green-500", label: "Active" },
  trialing: { color: "bg-blue-500", label: "Trial" },
  past_due: { color: "bg-amber-500", label: "Past Due" },
  canceled: { color: "bg-red-500", label: "Canceled" },
  incomplete: { color: "bg-gray-400", label: "Incomplete" },
};

const SIZE_CLASSES = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-2.5 py-1 text-sm gap-1.5",
  lg: "px-3 py-1.5 text-base gap-2",
};

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M2.5 19h19v2h-19zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-2.29-6.87a1.5 1.5 0 0 0-2.83-.04L7.37 9.93l-5.2-1.48a1.5 1.5 0 0 0-1.77 2.05L4 18h16l3.57-7.02c.28-.55.27-1.14.5-1.34z" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function PolarSubscriptionBadge({
  tier,
  status = "active",
  showStatus = false,
  size = "md",
  variant = "default",
  className,
}: PolarSubscriptionBadgeProps) {
  const tierKey = tier.toLowerCase();
  const colors = TIER_COLORS[tierKey] || TIER_COLORS.starter;
  const statusInfo = STATUS_INDICATORS[status];

  const isPremium = useMemo(() => {
    const premiumTiers = ["pro", "business", "enterprise"];
    return premiumTiers.includes(tierKey);
  }, [tierKey]);

  const Icon = tierKey === "enterprise" ? CrownIcon : isPremium ? StarIcon : null;

  return (
    <span
      data-slot="polar-subscription-badge"
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors",
        SIZE_CLASSES[size],
        variant === "outline" && cn("border", colors.border, colors.text, "bg-transparent"),
        variant === "solid" && cn(colors.bg, colors.text),
        variant === "default" && cn(colors.bg, colors.text),
        className
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            size === "sm" && "h-3 w-3",
            size === "md" && "h-3.5 w-3.5",
            size === "lg" && "h-4 w-4"
          )}
        />
      )}
      <span data-slot="tier-name">{tier}</span>
      {showStatus && (
        <span
          data-slot="status-indicator"
          className="flex items-center gap-1"
          title={statusInfo.label}
        >
          <span
            className={cn(
              "rounded-full",
              statusInfo.color,
              size === "sm" && "h-1.5 w-1.5",
              size === "md" && "h-2 w-2",
              size === "lg" && "h-2.5 w-2.5"
            )}
          />
        </span>
      )}
    </span>
  );
}
