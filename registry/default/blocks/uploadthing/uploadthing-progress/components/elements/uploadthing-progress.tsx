"use client";

import { cn } from "@/lib/utils";

interface UploadThingProgressProps {
  progress: number;
  variant?: "bar" | "ring" | "minimal";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: {
    bar: "h-1",
    ring: "w-8 h-8",
    text: "text-xs",
  },
  md: {
    bar: "h-2",
    ring: "w-12 h-12",
    text: "text-sm",
  },
  lg: {
    bar: "h-3",
    ring: "w-16 h-16",
    text: "text-base",
  },
};

function ProgressBar({
  progress,
  size,
  showLabel,
}: {
  progress: number;
  size: "sm" | "md" | "lg";
  showLabel: boolean;
}) {
  return (
    <div className="w-full space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className={cn("text-muted-foreground", SIZE_CLASSES[size].text)}>
            Uploading...
          </span>
          <span className={cn("font-medium tabular-nums", SIZE_CLASSES[size].text)}>
            {Math.round(progress)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-muted rounded-full overflow-hidden",
          SIZE_CLASSES[size].bar
        )}
      >
        <div
          className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ProgressRing({
  progress,
  size,
  showLabel,
}: {
  progress: number;
  size: "sm" | "md" | "lg";
  showLabel: boolean;
}) {
  const strokeWidth = size === "sm" ? 3 : size === "md" ? 4 : 5;
  const radius = size === "sm" ? 12 : size === "md" ? 20 : 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const svgSize = radius * 2 + strokeWidth * 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className={cn("-rotate-90", SIZE_CLASSES[size].ring)}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
      >
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-300 ease-out"
        />
      </svg>
      {showLabel && (
        <span
          className={cn(
            "absolute font-medium tabular-nums",
            SIZE_CLASSES[size].text
          )}
        >
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}

function ProgressMinimal({
  progress,
  size,
}: {
  progress: number;
  size: "sm" | "md" | "lg";
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex-1 bg-muted rounded-full overflow-hidden",
          SIZE_CLASSES[size].bar
        )}
      >
        <div
          className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span
        className={cn(
          "font-medium tabular-nums text-muted-foreground min-w-[3ch]",
          SIZE_CLASSES[size].text
        )}
      >
        {Math.round(progress)}%
      </span>
    </div>
  );
}

export function UploadThingProgress({
  progress,
  variant = "bar",
  size = "md",
  showLabel = true,
  className,
}: UploadThingProgressProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div
      data-slot="uploadthing-progress"
      className={cn(
        variant === "ring" && "inline-flex",
        variant !== "ring" && "w-full",
        className
      )}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {variant === "bar" && (
        <ProgressBar progress={clampedProgress} size={size} showLabel={showLabel} />
      )}
      {variant === "ring" && (
        <ProgressRing progress={clampedProgress} size={size} showLabel={showLabel} />
      )}
      {variant === "minimal" && (
        <ProgressMinimal progress={clampedProgress} size={size} />
      )}
    </div>
  );
}
