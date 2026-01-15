"use client";

import * as React from "react";

import { ArrowDown, ArrowUp, DollarSign, Hash } from "lucide-react";

import { cn } from "@/lib/utils";

type TokenType = "text" | "special" | "control";

interface Token {
  text: string;
  id?: number;
  type?: TokenType;
}

interface ModelPricing {
  inputCostPer1k: number;
  outputCostPer1k: number;
}

const MODEL_PRICING: Record<string, ModelPricing> = {
  "gpt-4": { inputCostPer1k: 0.03, outputCostPer1k: 0.06 },
  "gpt-4-turbo": { inputCostPer1k: 0.01, outputCostPer1k: 0.03 },
  "gpt-4o": { inputCostPer1k: 0.005, outputCostPer1k: 0.015 },
  "gpt-4o-mini": { inputCostPer1k: 0.00015, outputCostPer1k: 0.0006 },
  "gpt-3.5-turbo": { inputCostPer1k: 0.0005, outputCostPer1k: 0.0015 },
  "claude-3-opus": { inputCostPer1k: 0.015, outputCostPer1k: 0.075 },
  "claude-3-sonnet": { inputCostPer1k: 0.003, outputCostPer1k: 0.015 },
  "claude-3-haiku": { inputCostPer1k: 0.00025, outputCostPer1k: 0.00125 },
  "claude-3.5-sonnet": { inputCostPer1k: 0.003, outputCostPer1k: 0.015 },
  "claude-opus-4": { inputCostPer1k: 0.015, outputCostPer1k: 0.075 },
  "claude-sonnet-4": { inputCostPer1k: 0.003, outputCostPer1k: 0.015 },
};

interface AiTokenViewerContextValue {
  tokens?: Token[];
  inputTokens?: number;
  outputTokens?: number;
  model?: string;
  showCost: boolean;
}

const AiTokenViewerContext =
  React.createContext<AiTokenViewerContextValue | null>(null);

function useTokenViewerContext() {
  const context = React.useContext(AiTokenViewerContext);
  if (!context) {
    throw new Error(
      "AiTokenViewer components must be used within <AiTokenViewer>",
    );
  }
  return context;
}

interface AiTokenViewerProps {
  tokens?: Token[];
  inputTokens?: number;
  outputTokens?: number;
  model?: string;
  showCost?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function AiTokenViewer({
  tokens,
  inputTokens,
  outputTokens,
  model,
  showCost = false,
  children,
  className,
}: AiTokenViewerProps) {
  const contextValue = React.useMemo(
    () => ({ tokens, inputTokens, outputTokens, model, showCost }),
    [tokens, inputTokens, outputTokens, model, showCost],
  );

  return (
    <AiTokenViewerContext.Provider value={contextValue}>
      <div
        data-slot="ai-token-viewer"
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground overflow-hidden",
          className,
        )}
      >
        {children}
      </div>
    </AiTokenViewerContext.Provider>
  );
}

interface AiTokenViewerHeaderProps {
  title?: string;
  className?: string;
}

function AiTokenViewerHeader({
  title = "Token Usage",
  className,
}: AiTokenViewerHeaderProps) {
  const { inputTokens = 0, outputTokens = 0, model } = useTokenViewerContext();
  const totalTokens = inputTokens + outputTokens;

  return (
    <div
      data-slot="ai-token-viewer-header"
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30",
        className,
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Hash className="size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-1 items-center gap-2">
        <span className="font-medium text-sm">{title}</span>
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground font-mono">
          {totalTokens.toLocaleString()}
        </span>
        {model && (
          <span className="text-xs text-muted-foreground">{model}</span>
        )}
      </div>
    </div>
  );
}

interface AiTokenViewerStatsProps {
  className?: string;
}

function AiTokenViewerStats({ className }: AiTokenViewerStatsProps) {
  const {
    inputTokens = 0,
    outputTokens = 0,
    model,
    showCost,
  } = useTokenViewerContext();
  const totalTokens = inputTokens + outputTokens;

  const cost = React.useMemo(() => {
    if (!showCost || !model) return null;
    const pricing = MODEL_PRICING[model];
    if (!pricing) return null;

    const inputCost = (inputTokens / 1000) * pricing.inputCostPer1k;
    const outputCost = (outputTokens / 1000) * pricing.outputCostPer1k;
    return {
      input: inputCost,
      output: outputCost,
      total: inputCost + outputCost,
    };
  }, [showCost, model, inputTokens, outputTokens]);

  const formatCost = React.useCallback((value: number) => {
    if (value < 0.01) return `$${value.toFixed(4)}`;
    return `$${value.toFixed(2)}`;
  }, []);

  return (
    <div data-slot="ai-token-viewer-stats" className={cn("p-4", className)}>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <ArrowUp className="size-3" />
            Input
          </div>
          <p className="text-lg font-semibold font-mono">
            {inputTokens.toLocaleString()}
          </p>
          {cost && (
            <p className="text-xs text-muted-foreground">
              {formatCost(cost.input)}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <ArrowDown className="size-3" />
            Output
          </div>
          <p className="text-lg font-semibold font-mono">
            {outputTokens.toLocaleString()}
          </p>
          {cost && (
            <p className="text-xs text-muted-foreground">
              {formatCost(cost.output)}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Hash className="size-3" />
            Total
          </div>
          <p className="text-lg font-semibold font-mono">
            {totalTokens.toLocaleString()}
          </p>
          {cost && (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              {formatCost(cost.total)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface AiTokenViewerCostProps {
  className?: string;
}

function AiTokenViewerCost({ className }: AiTokenViewerCostProps) {
  const { inputTokens = 0, outputTokens = 0, model } = useTokenViewerContext();

  const cost = React.useMemo(() => {
    if (!model) return null;
    const pricing = MODEL_PRICING[model];
    if (!pricing) return null;

    const inputCost = (inputTokens / 1000) * pricing.inputCostPer1k;
    const outputCost = (outputTokens / 1000) * pricing.outputCostPer1k;
    return {
      input: inputCost,
      output: outputCost,
      total: inputCost + outputCost,
    };
  }, [model, inputTokens, outputTokens]);

  if (!cost) {
    return (
      <div
        data-slot="ai-token-viewer-cost"
        className={cn(
          "px-4 py-3 border-t border-border text-sm text-muted-foreground",
          className,
        )}
      >
        Cost estimation unavailable for this model
      </div>
    );
  }

  return (
    <div
      data-slot="ai-token-viewer-cost"
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-t border-border bg-muted/20",
        className,
      )}
    >
      <DollarSign className="size-4 text-green-500" />
      <span className="text-sm text-muted-foreground">Estimated cost:</span>
      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
        ${cost.total.toFixed(4)}
      </span>
    </div>
  );
}

interface AiTokenViewerBreakdownProps {
  className?: string;
}

function AiTokenViewerBreakdown({ className }: AiTokenViewerBreakdownProps) {
  const { tokens } = useTokenViewerContext();

  if (!tokens || tokens.length === 0) {
    return (
      <div
        data-slot="ai-token-viewer-breakdown"
        className={cn(
          "p-4 border-t border-border text-sm text-muted-foreground text-center",
          className,
        )}
      >
        No token breakdown available
      </div>
    );
  }

  return (
    <div
      data-slot="ai-token-viewer-breakdown"
      className={cn("p-4 border-t border-border", className)}
    >
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
        Token Breakdown
      </span>
      <div className="flex flex-wrap gap-0.5 font-mono text-xs">
        {tokens.map((token, index) => (
          <AiTokenViewerToken key={index} token={token} index={index} />
        ))}
      </div>
    </div>
  );
}

interface AiTokenViewerTokenProps {
  token: Token;
  index: number;
  className?: string;
}

function AiTokenViewerToken({
  token,
  index,
  className,
}: AiTokenViewerTokenProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const typeConfig = React.useMemo(() => {
    const type = token.type ?? "text";
    const configs: Record<TokenType, { bg: string; border: string }> = {
      text: {
        bg: "bg-blue-50 dark:bg-blue-950/50",
        border: "border-blue-200 dark:border-blue-800",
      },
      special: {
        bg: "bg-purple-50 dark:bg-purple-950/50",
        border: "border-purple-200 dark:border-purple-800",
      },
      control: {
        bg: "bg-orange-50 dark:bg-orange-950/50",
        border: "border-orange-200 dark:border-orange-800",
      },
    };
    return configs[type];
  }, [token.type]);

  const displayText = React.useMemo(() => {
    return token.text
      .replace(/\n/g, "\\n")
      .replace(/\t/g, "\\t")
      .replace(/\r/g, "\\r");
  }, [token.text]);

  return (
    <span
      data-slot="ai-token-viewer-token"
      data-type={token.type ?? "text"}
      className={cn(
        "relative inline-flex items-center px-1 py-0.5 rounded border transition-colors cursor-default",
        typeConfig.bg,
        typeConfig.border,
        isHovered && "ring-2 ring-primary ring-offset-1",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="whitespace-pre">{displayText}</span>
      {isHovered && (token.id !== undefined || token.type) && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-foreground text-background text-[10px] whitespace-nowrap z-10">
          {token.id !== undefined && `#${token.id}`}
          {token.id !== undefined && token.type && " - "}
          {token.type}
        </span>
      )}
    </span>
  );
}

export {
  AiTokenViewer,
  AiTokenViewerHeader,
  AiTokenViewerStats,
  AiTokenViewerCost,
  AiTokenViewerBreakdown,
  AiTokenViewerToken,
};
export type { AiTokenViewerProps, Token, TokenType };
