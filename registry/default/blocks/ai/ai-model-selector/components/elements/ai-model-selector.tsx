"use client";

import * as React from "react";

import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { AnthropicLogo } from "@/components/ui/logos/anthropic";
import { CohereLogo } from "@/components/ui/logos/cohere";
import { DeepSeekLogo } from "@/components/ui/logos/deepseek";
import { GeminiLogo } from "@/components/ui/logos/gemini";
import { GroqLogo } from "@/components/ui/logos/groq";
import { MetaLogo } from "@/components/ui/logos/meta";
import { MistralLogo } from "@/components/ui/logos/mistral";
import { OpenAILogo } from "@/components/ui/logos/openai";
import { XAILogo } from "@/components/ui/logos/xai";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Provider =
  | "openai"
  | "anthropic"
  | "google"
  | "xai"
  | "deepseek"
  | "mistral"
  | "groq"
  | "cohere"
  | "meta";

interface Model {
  id: string;
  name: string;
  provider: Provider;
  description?: string;
}

const PROVIDERS: Record<
  Provider,
  { name: string; logo: React.ComponentType<{ className?: string }> }
> = {
  openai: { name: "OPENAI", logo: OpenAILogo },
  anthropic: { name: "ANTHROPIC", logo: AnthropicLogo },
  google: { name: "GOOGLE", logo: GeminiLogo },
  xai: { name: "XAI", logo: XAILogo },
  deepseek: { name: "DEEPSEEK", logo: DeepSeekLogo },
  mistral: { name: "MISTRAL", logo: MistralLogo },
  groq: { name: "GROQ", logo: GroqLogo },
  cohere: { name: "COHERE", logo: CohereLogo },
  meta: { name: "META", logo: MetaLogo },
};

const DEFAULT_MODELS: Model[] = [
  {
    id: "openai/gpt-5.2",
    name: "GPT-5.2",
    provider: "openai",
    description: "Latest flagship model",
  },
  {
    id: "openai/gpt-5",
    name: "GPT-5",
    provider: "openai",
    description: "Previous flagship",
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Multimodal, fast",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Fast and affordable",
  },
  {
    id: "openai/gpt-5-codex",
    name: "GPT-5 Codex",
    provider: "openai",
    description: "Optimized for code",
  },
  {
    id: "anthropic/claude-opus-4.5",
    name: "Claude Opus 4.5",
    provider: "anthropic",
    description: "Most capable",
  },
  {
    id: "anthropic/claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    description: "Balanced performance",
  },
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "anthropic",
    description: "Fast and capable",
  },
  {
    id: "anthropic/claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    description: "Fast and efficient",
  },
  {
    id: "google/gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "google",
    description: "Most capable",
  },
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    description: "Fast and efficient",
  },
  {
    id: "google/gemini-3-flash",
    name: "Gemini 3 Flash",
    provider: "google",
    description: "Latest flash model",
  },
  {
    id: "xai/grok-4.1-fast-reasoning",
    name: "Grok 4.1 Reasoning",
    provider: "xai",
    description: "Advanced reasoning",
  },
  {
    id: "xai/grok-code-fast-1",
    name: "Grok Code Fast",
    provider: "xai",
    description: "Optimized for code",
  },
  {
    id: "deepseek/deepseek-v3.2",
    name: "DeepSeek V3.2",
    provider: "deepseek",
    description: "Latest version",
  },
  {
    id: "deepseek/deepseek-v3.2-thinking",
    name: "DeepSeek V3.2 Thinking",
    provider: "deepseek",
    description: "With reasoning",
  },
  {
    id: "mistral/devstral-2",
    name: "Devstral 2",
    provider: "mistral",
    description: "Code-focused",
  },
  {
    id: "mistral/devstral-small-2",
    name: "Devstral Small 2",
    provider: "mistral",
    description: "Lightweight code model",
  },
  {
    id: "groq/llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "groq",
    description: "Fast inference",
  },
  {
    id: "groq/mixtral-8x7b",
    name: "Mixtral 8x7B",
    provider: "groq",
    description: "MoE architecture",
  },
  {
    id: "cohere/command-r-plus",
    name: "Command R+",
    provider: "cohere",
    description: "Enterprise RAG",
  },
  {
    id: "meta/llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "meta",
    description: "Open source flagship",
  },
];

type SelectorSize = "default" | "compact";

interface AiModelSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  models?: Model[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: SelectorSize;
}

export function AiModelSelector({
  value,
  onValueChange,
  models = DEFAULT_MODELS,
  placeholder = "SELECT MODEL",
  className,
  disabled = false,
  size = "default",
}: AiModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value || "");

  const currentValue = value !== undefined ? value : internalValue;
  const selectedModel = models.find((model) => model.id === currentValue);

  const handleSelect = (modelId: string) => {
    const newValue = modelId === currentValue ? "" : modelId;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
  };

  const modelsByProvider = React.useMemo(() => {
    const grouped = new Map<Provider, Model[]>();
    for (const model of models) {
      const existing = grouped.get(model.provider) || [];
      grouped.set(model.provider, [...existing, model]);
    }
    return grouped;
  }, [models]);

  const SelectedLogo = selectedModel
    ? PROVIDERS[selectedModel.provider]?.logo
    : null;

  const isCompact = size === "compact";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          data-slot="ai-model-selector"
          className={cn(
            "flex items-center justify-between border bg-background font-mono transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            isCompact
              ? "h-8 w-[200px] px-2 text-xs"
              : "w-[280px] px-3 py-2 text-sm",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedModel && SelectedLogo ? (
              <>
                <SelectedLogo className={cn("shrink-0", isCompact ? "size-3.5" : "size-4")} />
                <span className="truncate font-medium">{selectedModel.name}</span>
                <span className={cn(
                  "uppercase tracking-wider text-muted-foreground",
                  isCompact ? "text-[9px]" : "text-[10px]"
                )}>
                  {PROVIDERS[selectedModel.provider].name}
                </span>
              </>
            ) : (
              <span className={cn(
                "uppercase tracking-wider text-muted-foreground",
                isCompact ? "text-[9px]" : "text-xs"
              )}>
                {placeholder}
              </span>
            )}
          </div>
          <ChevronDown className={cn("ml-2 shrink-0 text-muted-foreground", isCompact ? "size-3" : "size-3.5")} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("rounded-none border p-0", isCompact ? "w-[200px]" : "w-[280px]")}
        align="end"
        sideOffset={4}
      >
        <Command className="rounded-none">
          <CommandInput
            placeholder="Search models..."
            className="rounded-none border-none font-mono text-xs"
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty className="py-4 text-center font-mono text-xs uppercase tracking-wider text-muted-foreground">
              No model found.
            </CommandEmpty>
            {Array.from(modelsByProvider.entries()).map(
              ([provider, providerModels]) => {
                const providerInfo = PROVIDERS[provider];
                if (!providerInfo) return null;
                const ProviderLogo = providerInfo.logo;

                return (
                  <CommandGroup
                    key={provider}
                    heading={
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
                        <ProviderLogo className="size-3" />
                        <span>{providerInfo.name}</span>
                      </div>
                    }
                    className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
                  >
                    {providerModels.map((model) => (
                      <CommandItem
                        key={model.id}
                        value={model.id}
                        onSelect={() => handleSelect(model.id)}
                        className="flex cursor-pointer items-center justify-between rounded-none px-3 py-2 font-mono"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm">{model.name}</span>
                          {model.description && (
                            <span className="text-[10px] text-muted-foreground">
                              {model.description}
                            </span>
                          )}
                        </div>
                        <Check
                          className={cn(
                            "size-3.5 shrink-0",
                            currentValue === model.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              }
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { DEFAULT_MODELS, PROVIDERS };
export type { Model, Provider, AiModelSelectorProps, SelectorSize };
