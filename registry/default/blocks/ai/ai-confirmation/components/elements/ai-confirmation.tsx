"use client";

import * as React from "react";

import { Check, ShieldCheck, ShieldQuestion, ShieldX, X } from "lucide-react";

import { cn } from "@/lib/utils";

type ConfirmationState =
  | "approval-requested"
  | "approval-responded"
  | "output-available"
  | "output-denied";

interface AiConfirmationContextValue {
  state: ConfirmationState;
  onApprove?: () => void;
  onReject?: () => void;
}

const AiConfirmationContext =
  React.createContext<AiConfirmationContextValue | null>(null);

function useConfirmationContext() {
  const context = React.useContext(AiConfirmationContext);
  if (!context) {
    throw new Error(
      "AiConfirmation components must be used within <AiConfirmation>",
    );
  }
  return context;
}

interface AiConfirmationProps {
  state: ConfirmationState;
  onApprove?: () => void;
  onReject?: () => void;
  children?: React.ReactNode;
  className?: string;
}

function AiConfirmation({
  state,
  onApprove,
  onReject,
  children,
  className,
}: AiConfirmationProps) {
  const contextValue = React.useMemo(
    () => ({ state, onApprove, onReject }),
    [state, onApprove, onReject],
  );

  const stateStyles = React.useMemo(() => {
    const styles: Record<ConfirmationState, string> = {
      "approval-requested":
        "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
      "approval-responded":
        "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30",
      "output-available":
        "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30",
      "output-denied":
        "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
    };
    return styles[state];
  }, [state]);

  return (
    <AiConfirmationContext.Provider value={contextValue}>
      <div
        data-slot="ai-confirmation"
        data-state={state}
        role="alert"
        className={cn("rounded-lg border p-4", stateStyles, className)}
      >
        {children}
      </div>
    </AiConfirmationContext.Provider>
  );
}

interface AiConfirmationRequestProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

function AiConfirmationRequest({
  title = "Approval Required",
  description,
  children,
  className,
}: AiConfirmationRequestProps) {
  const { state } = useConfirmationContext();

  if (state !== "approval-requested") {
    return null;
  }

  return (
    <div
      data-slot="ai-confirmation-request"
      className={cn("flex items-start gap-3", className)}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
        <ShieldQuestion className="size-5 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-semibold text-amber-800 dark:text-amber-200">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

interface AiConfirmationAcceptedProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

function AiConfirmationAccepted({
  title = "Approved",
  description,
  children,
  className,
}: AiConfirmationAcceptedProps) {
  const { state } = useConfirmationContext();

  if (state !== "output-available" && state !== "approval-responded") {
    return null;
  }

  return (
    <div
      data-slot="ai-confirmation-accepted"
      className={cn("flex items-start gap-3", className)}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
        <ShieldCheck className="size-5 text-green-600 dark:text-green-400" />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-semibold text-green-800 dark:text-green-200">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-green-700 dark:text-green-300">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

interface AiConfirmationRejectedProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

function AiConfirmationRejected({
  title = "Denied",
  description,
  children,
  className,
}: AiConfirmationRejectedProps) {
  const { state } = useConfirmationContext();

  if (state !== "output-denied") {
    return null;
  }

  return (
    <div
      data-slot="ai-confirmation-rejected"
      className={cn("flex items-start gap-3", className)}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
        <ShieldX className="size-5 text-red-600 dark:text-red-400" />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-semibold text-red-800 dark:text-red-200">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-red-700 dark:text-red-300">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

interface AiConfirmationActionsProps {
  children?: React.ReactNode;
  className?: string;
}

function AiConfirmationActions({
  children,
  className,
}: AiConfirmationActionsProps) {
  const { state, onApprove, onReject } = useConfirmationContext();

  if (state !== "approval-requested") {
    return null;
  }

  return (
    <div
      data-slot="ai-confirmation-actions"
      className={cn("mt-3 flex items-center gap-2", className)}
    >
      {children || (
        <>
          <button
            type="button"
            onClick={onApprove}
            className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            <Check className="size-4" />
            Approve
          </button>
          <button
            type="button"
            onClick={onReject}
            className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            <X className="size-4" />
            Reject
          </button>
        </>
      )}
    </div>
  );
}

interface AiConfirmationActionProps {
  variant: "approve" | "reject";
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function AiConfirmationAction({
  variant,
  children,
  className,
  onClick,
}: AiConfirmationActionProps) {
  const { onApprove, onReject } = useConfirmationContext();

  const handleClick = React.useCallback(() => {
    onClick?.();
    if (variant === "approve") {
      onApprove?.();
    } else {
      onReject?.();
    }
  }, [variant, onClick, onApprove, onReject]);

  const variantStyles = React.useMemo(() => {
    if (variant === "approve") {
      return "bg-green-600 hover:bg-green-700 focus-visible:ring-green-500";
    }
    return "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500";
  }, [variant]);

  const defaultContent = React.useMemo(() => {
    if (variant === "approve") {
      return (
        <>
          <Check className="size-4" />
          Approve
        </>
      );
    }
    return (
      <>
        <X className="size-4" />
        Reject
      </>
    );
  }, [variant]);

  return (
    <button
      type="button"
      data-slot="ai-confirmation-action"
      data-variant={variant}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variantStyles,
        className,
      )}
    >
      {children || defaultContent}
    </button>
  );
}

export {
  AiConfirmation,
  AiConfirmationRequest,
  AiConfirmationAccepted,
  AiConfirmationRejected,
  AiConfirmationActions,
  AiConfirmationAction,
};
export type { AiConfirmationProps, ConfirmationState };
