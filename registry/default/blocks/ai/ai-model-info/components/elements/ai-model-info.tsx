"use client";

import * as React from "react";

import {
  Calendar,
  Cpu,
  DollarSign,
  Eye,
  FileJson,
  FunctionSquare,
  Wrench,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ModelCapability = "vision" | "tools" | "streaming" | "json" | "functions";

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  capabilities: ModelCapability[];
  inputPrice?: number;
  outputPrice?: number;
  releaseDate?: Date;
}

interface AiModelInfoContextValue {
  model: ModelInfo;
  showPricing: boolean;
}

const AiModelInfoContext = React.createContext<AiModelInfoContextValue | null>(
  null,
);

function useModelInfoContext() {
  const context = React.useContext(AiModelInfoContext);
  if (!context) {
    throw new Error("AiModelInfo components must be used within <AiModelInfo>");
  }
  return context;
}

const PROVIDER_CONFIG: Record<
  string,
  { logo: string; color: string; bgClass: string }
> = {
  openai: {
    logo: "OpenAI",
    color: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-100 dark:bg-emerald-950",
  },
  anthropic: {
    logo: "Anthropic",
    color: "text-orange-600 dark:text-orange-400",
    bgClass: "bg-orange-100 dark:bg-orange-950",
  },
  google: {
    logo: "Google",
    color: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-100 dark:bg-blue-950",
  },
  mistral: {
    logo: "Mistral",
    color: "text-indigo-600 dark:text-indigo-400",
    bgClass: "bg-indigo-100 dark:bg-indigo-950",
  },
  cohere: {
    logo: "Cohere",
    color: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-100 dark:bg-purple-950",
  },
  meta: {
    logo: "Meta",
    color: "text-sky-600 dark:text-sky-400",
    bgClass: "bg-sky-100 dark:bg-sky-950",
  },
};

const CAPABILITY_CONFIG: Record<
  ModelCapability,
  { icon: React.ReactNode; label: string; className: string }
> = {
  vision: {
    icon: <Eye className="size-3" />,
    label: "Vision",
    className: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  },
  tools: {
    icon: <Wrench className="size-3" />,
    label: "Tools",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  streaming: {
    icon: <Zap className="size-3" />,
    label: "Streaming",
    className: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  },
  json: {
    icon: <FileJson className="size-3" />,
    label: "JSON Mode",
    className:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
  functions: {
    icon: <FunctionSquare className="size-3" />,
    label: "Functions",
    className: "bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300",
  },
};

function formatContextWindow(tokens: number): string {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`;
  }
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(0)}K`;
  }
  return tokens.toString();
}

function formatPrice(price: number): string {
  if (price < 0.01) {
    return `$${price.toFixed(4)}`;
  }
  return `$${price.toFixed(2)}`;
}

interface AiModelInfoProps {
  model: ModelInfo;
  showPricing?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function AiModelInfo({
  model,
  showPricing = true,
  className,
  children,
}: AiModelInfoProps) {
  const contextValue = React.useMemo(
    () => ({ model, showPricing }),
    [model, showPricing],
  );

  return (
    <AiModelInfoContext.Provider value={contextValue}>
      <div
        data-slot="ai-model-info"
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground",
          className,
        )}
      >
        {children}
      </div>
    </AiModelInfoContext.Provider>
  );
}

interface AiModelInfoHeaderProps {
  className?: string;
}

function AiModelInfoHeader({ className }: AiModelInfoHeaderProps) {
  const { model } = useModelInfoContext();

  const providerConfig = PROVIDER_CONFIG[model.provider.toLowerCase()] || {
    logo: model.provider,
    color: "text-gray-600 dark:text-gray-400",
    bgClass: "bg-gray-100 dark:bg-gray-800",
  };

  return (
    <div
      data-slot="ai-model-info-header"
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-border",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          providerConfig.bgClass,
        )}
      >
        <Cpu className={cn("size-5", providerConfig.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{model.name}</h3>
        <p className={cn("text-xs", providerConfig.color)}>
          {providerConfig.logo}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-mono font-medium">
          {formatContextWindow(model.contextWindow)}
        </p>
        <p className="text-xs text-muted-foreground">context</p>
      </div>
    </div>
  );
}

interface AiModelInfoCapabilitiesProps {
  className?: string;
}

function AiModelInfoCapabilities({ className }: AiModelInfoCapabilitiesProps) {
  const { model } = useModelInfoContext();

  if (model.capabilities.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="ai-model-info-capabilities"
      className={cn("px-4 py-3 border-b border-border", className)}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        Capabilities
      </p>
      <div className="flex flex-wrap gap-1.5">
        {model.capabilities.map((capability) => {
          const config = CAPABILITY_CONFIG[capability];
          return (
            <span
              key={capability}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                config.className,
              )}
            >
              {config.icon}
              {config.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

interface AiModelInfoPricingProps {
  className?: string;
}

function AiModelInfoPricing({ className }: AiModelInfoPricingProps) {
  const { model, showPricing } = useModelInfoContext();

  if (
    !showPricing ||
    (model.inputPrice === undefined && model.outputPrice === undefined)
  ) {
    return null;
  }

  return (
    <div
      data-slot="ai-model-info-pricing"
      className={cn("px-4 py-3 border-b border-border", className)}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        Pricing (per 1M tokens)
      </p>
      <div className="grid grid-cols-2 gap-3">
        {model.inputPrice !== undefined && (
          <div className="flex items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-green-100 dark:bg-green-950">
              <DollarSign className="size-3.5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-mono font-medium">
                {formatPrice(model.inputPrice)}
              </p>
              <p className="text-xs text-muted-foreground">Input</p>
            </div>
          </div>
        )}
        {model.outputPrice !== undefined && (
          <div className="flex items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-blue-100 dark:bg-blue-950">
              <DollarSign className="size-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-mono font-medium">
                {formatPrice(model.outputPrice)}
              </p>
              <p className="text-xs text-muted-foreground">Output</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface AiModelInfoMetaProps {
  className?: string;
}

function AiModelInfoMeta({ className }: AiModelInfoMetaProps) {
  const { model } = useModelInfoContext();

  return (
    <div data-slot="ai-model-info-meta" className={cn("px-4 py-3", className)}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="font-mono">{model.id}</span>
        </div>
        {model.releaseDate && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="size-3" />
            <span>
              {model.releaseDate.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface AiModelInfoBadgeProps {
  className?: string;
}

function AiModelInfoBadge({ className }: AiModelInfoBadgeProps) {
  const { model } = useModelInfoContext();

  const providerConfig = PROVIDER_CONFIG[model.provider.toLowerCase()] || {
    logo: model.provider,
    color: "text-gray-600 dark:text-gray-400",
    bgClass: "bg-gray-100 dark:bg-gray-800",
  };

  return (
    <div
      data-slot="ai-model-info-badge"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full",
          providerConfig.bgClass,
        )}
      >
        <Cpu className={cn("size-3", providerConfig.color)} />
      </div>
      <span className="text-xs font-medium">{model.name}</span>
      <span className="text-xs text-muted-foreground font-mono">
        {formatContextWindow(model.contextWindow)}
      </span>
    </div>
  );
}

export {
  AiModelInfo,
  AiModelInfoHeader,
  AiModelInfoCapabilities,
  AiModelInfoPricing,
  AiModelInfoMeta,
  AiModelInfoBadge,
};
export type { AiModelInfoProps, ModelInfo, ModelCapability };
