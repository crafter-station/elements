"use client";

import { useCallback, useState } from "react";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface PolarLicenseKeyProps {
  licenseKey: string;
  productName?: string;
  status?: "active" | "expired" | "revoked" | "pending";
  activations?: { current: number; limit: number };
  expiresAt?: Date | string;
  masked?: boolean;
  showCopyButton?: boolean;
  showStatus?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onCopy?: (key: string) => void;
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  active: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    dot: "bg-green-500",
  },
  expired: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  revoked: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
    dot: "bg-red-500",
  },
  pending: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-300",
    dot: "bg-gray-400",
  },
};

const SIZE_CLASSES = {
  sm: {
    container: "p-3",
    key: "text-xs",
    icon: "h-3.5 w-3.5",
    button: "h-6 w-6",
  },
  md: {
    container: "p-4",
    key: "text-sm",
    icon: "h-4 w-4",
    button: "h-7 w-7",
  },
  lg: {
    container: "p-5",
    key: "text-base",
    icon: "h-5 w-5",
    button: "h-8 w-8",
  },
};

export function PolarLicenseKey({
  licenseKey,
  productName,
  status = "active",
  activations,
  expiresAt,
  masked: initialMasked = true,
  showCopyButton = true,
  showStatus = true,
  size = "md",
  className,
  onCopy,
}: PolarLicenseKeyProps) {
  const [copied, setCopied] = useState(false);
  const [masked, setMasked] = useState(initialMasked);
  const sizes = SIZE_CLASSES[size];
  const statusStyle = STATUS_STYLES[status];

  const displayKey = masked
    ? licenseKey.replace(/(.{4})(.*)(.{4})/, "$1-****-****-$3")
    : licenseKey;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      onCopy?.(licenseKey);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [licenseKey, onCopy]);

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      data-slot="polar-license-key"
      className={cn(
        "rounded-xl border border-border bg-card",
        sizes.container,
        className
      )}
    >
      {(productName || showStatus) && (
        <div className="flex items-center justify-between mb-3">
          {productName && (
            <div className="flex items-center gap-2">
              <KeyIcon className={cn("text-muted-foreground", sizes.icon)} />
              <span className="font-medium text-foreground text-sm">
                {productName}
              </span>
            </div>
          )}
          {showStatus && (
            <span
              data-slot="status"
              className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
                statusStyle.bg,
                statusStyle.text
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", statusStyle.dot)} />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          )}
        </div>
      )}

      <div
        data-slot="key-display"
        className="flex items-center gap-2 rounded-lg bg-muted/50 p-2"
      >
        <code
          data-slot="key-value"
          className={cn(
            "flex-1 font-mono text-foreground select-all",
            sizes.key
          )}
        >
          {displayKey}
        </code>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMasked(!masked)}
            className={cn(
              "inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
              sizes.button
            )}
            title={masked ? "Show license key" : "Hide license key"}
          >
            {masked ? (
              <EyeIcon className={sizes.icon} />
            ) : (
              <EyeOffIcon className={sizes.icon} />
            )}
          </button>
          {showCopyButton && (
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "inline-flex items-center justify-center rounded-md transition-colors",
                sizes.button,
                copied
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              title={copied ? "Copied!" : "Copy license key"}
            >
              {copied ? (
                <CheckIcon className={sizes.icon} />
              ) : (
                <CopyIcon className={sizes.icon} />
              )}
            </button>
          )}
        </div>
      </div>

      {(activations || expiresAt) && (
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          {activations && (
            <span data-slot="activations">
              Activations: {activations.current}/{activations.limit}
            </span>
          )}
          {expiresAt && (
            <span data-slot="expires">
              Expires: {formatDate(expiresAt)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
