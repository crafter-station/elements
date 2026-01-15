"use client";

import * as React from "react";

import {
  Check,
  Copy,
  Download,
  FileCode,
  Play,
  RefreshCw,
  Share2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface AiArtifactContextValue {
  onClose?: () => void;
}

const AiArtifactContext = React.createContext<AiArtifactContextValue | null>(
  null,
);

function useArtifactContext() {
  const context = React.useContext(AiArtifactContext);
  if (!context) {
    throw new Error("AiArtifact components must be used within <AiArtifact>");
  }
  return context;
}

interface AiArtifactProps {
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}

function AiArtifact({ onClose, children, className }: AiArtifactProps) {
  const contextValue = React.useMemo(() => ({ onClose }), [onClose]);

  return (
    <AiArtifactContext.Provider value={contextValue}>
      <div
        data-slot="ai-artifact"
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground shadow-lg overflow-hidden flex flex-col",
          className,
        )}
      >
        {children}
      </div>
    </AiArtifactContext.Provider>
  );
}

interface AiArtifactHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

function AiArtifactHeader({ children, className }: AiArtifactHeaderProps) {
  return (
    <div
      data-slot="ai-artifact-header"
      className={cn(
        "flex items-center justify-between gap-4 border-b border-border px-4 py-3",
        className,
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
          <FileCode className="size-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

interface AiArtifactTitleProps {
  children?: React.ReactNode;
  className?: string;
}

function AiArtifactTitle({ children, className }: AiArtifactTitleProps) {
  return (
    <h3
      data-slot="ai-artifact-title"
      className={cn("font-semibold text-sm truncate", className)}
    >
      {children}
    </h3>
  );
}

interface AiArtifactDescriptionProps {
  children?: React.ReactNode;
  className?: string;
}

function AiArtifactDescription({
  children,
  className,
}: AiArtifactDescriptionProps) {
  return (
    <p
      data-slot="ai-artifact-description"
      className={cn("text-xs text-muted-foreground truncate", className)}
    >
      {children}
    </p>
  );
}

interface AiArtifactCloseProps {
  className?: string;
}

function AiArtifactClose({ className }: AiArtifactCloseProps) {
  const { onClose } = useArtifactContext();

  if (!onClose) return null;

  return (
    <button
      type="button"
      data-slot="ai-artifact-close"
      onClick={onClose}
      className={cn(
        "shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <X className="size-4" />
      <span className="sr-only">Close artifact</span>
    </button>
  );
}

interface AiArtifactActionsProps {
  children?: React.ReactNode;
  className?: string;
}

function AiArtifactActions({ children, className }: AiArtifactActionsProps) {
  const { onClose } = useArtifactContext();

  return (
    <div
      data-slot="ai-artifact-actions"
      className={cn("flex items-center gap-1", className)}
    >
      {children}
      {onClose && <AiArtifactClose />}
    </div>
  );
}

type ActionType = "run" | "copy" | "regenerate" | "download" | "share";

interface AiArtifactActionProps {
  type: ActionType;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

function AiArtifactAction({
  type,
  onClick,
  disabled = false,
  className,
}: AiArtifactActionProps) {
  const [showCheck, setShowCheck] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = React.useCallback(() => {
    onClick?.();
    if (type === "copy") {
      setShowCheck(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setShowCheck(false), 1500);
    }
  }, [onClick, type]);

  const actionConfig = React.useMemo(() => {
    const configs: Record<
      ActionType,
      { icon: React.ReactNode; label: string }
    > = {
      run: { icon: <Play className="size-4" />, label: "Run" },
      copy: {
        icon: showCheck ? (
          <Check className="size-4 text-green-500" />
        ) : (
          <Copy className="size-4" />
        ),
        label: showCheck ? "Copied!" : "Copy",
      },
      regenerate: {
        icon: <RefreshCw className="size-4" />,
        label: "Regenerate",
      },
      download: { icon: <Download className="size-4" />, label: "Download" },
      share: { icon: <Share2 className="size-4" />, label: "Share" },
    };
    return configs[type];
  }, [type, showCheck]);

  return (
    <button
      type="button"
      data-slot="ai-artifact-action"
      data-action={type}
      onClick={handleClick}
      disabled={disabled}
      title={actionConfig.label}
      className={cn(
        "shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {actionConfig.icon}
      <span className="sr-only">{actionConfig.label}</span>
    </button>
  );
}

interface AiArtifactContentProps {
  children?: React.ReactNode;
  className?: string;
}

function AiArtifactContent({ children, className }: AiArtifactContentProps) {
  return (
    <div
      data-slot="ai-artifact-content"
      className={cn("flex-1 overflow-auto", className)}
    >
      {children}
    </div>
  );
}

interface AiArtifactCodeProps {
  code: string;
  language?: string;
  className?: string;
}

function AiArtifactCode({ code, language, className }: AiArtifactCodeProps) {
  return (
    <div data-slot="ai-artifact-code" className={cn("relative", className)}>
      {language && (
        <div className="absolute top-2 right-2 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {language}
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm font-mono bg-muted/30">
        <code>{code}</code>
      </pre>
    </div>
  );
}

interface AiArtifactPreviewProps {
  children?: React.ReactNode;
  className?: string;
}

function AiArtifactPreview({ children, className }: AiArtifactPreviewProps) {
  return (
    <div
      data-slot="ai-artifact-preview"
      className={cn("p-4 bg-background", className)}
    >
      {children}
    </div>
  );
}

export {
  AiArtifact,
  AiArtifactHeader,
  AiArtifactTitle,
  AiArtifactDescription,
  AiArtifactActions,
  AiArtifactAction,
  AiArtifactClose,
  AiArtifactContent,
  AiArtifactCode,
  AiArtifactPreview,
};
export type { AiArtifactProps, ActionType };
