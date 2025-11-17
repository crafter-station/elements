import type { ReactNode } from "react";

import { LLMCopyButton, ViewOptions } from "@/components/docs/llm-actions";
import { ScrambleText } from "@/components/scramble-text";
import {
  ThemeAwareBrandText,
  ThemeAwarePattern,
} from "@/components/theme-aware-brand";

interface ComponentPageHeroProps {
  brandColor: string;
  darkBrandColor?: string;
  category: string;
  name: string;
  description: string;
  icon: ReactNode;
  installCommand: string;
  provider?: string;
  mdxContent?: string;
}

export function ComponentPageHero({
  brandColor,
  darkBrandColor,
  category,
  name,
  description,
  icon,
  provider,
  mdxContent,
}: ComponentPageHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-border border-dotted">
      <ThemeAwarePattern
        brandColor={brandColor}
        darkBrandColor={darkBrandColor}
      />

      <div className="relative z-10 py-4 md:py-5 px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Category + Actions Row */}
          <div className="flex items-center justify-between mb-3">
            <ThemeAwareBrandText
              brandColor={brandColor}
              darkBrandColor={darkBrandColor}
            >
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {category}
              </span>
            </ThemeAwareBrandText>

            {provider && mdxContent && (
              <div className="flex items-center gap-2">
                <LLMCopyButton mdxContent={mdxContent} />
                <ViewOptions
                  markdownUrl={`/docs/${provider}`}
                  githubUrl={`https://github.com/crafter-station/elements/blob/main/apps/web/content/providers/${provider}.mdx`}
                />
              </div>
            )}
          </div>

          {/* Icon, Title & Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <h1>
                <ScrambleText
                  text={name}
                  className="font-dotted font-black text-2xl md:text-3xl leading-tight"
                />
              </h1>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
