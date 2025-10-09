import type { ReactNode } from "react";

import { InstallCommand } from "@/components/install-command";
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
}

export function ComponentPageHero({
  brandColor,
  darkBrandColor,
  category,
  name,
  description,
  icon,
  installCommand,
}: ComponentPageHeroProps) {
  return (
    <div className="relative overflow-hidden">
      <ThemeAwarePattern
        brandColor={brandColor}
        darkBrandColor={darkBrandColor}
      />

      <div className="relative z-10 w-full py-8 md:py-12 px-4 sm:px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="space-y-3 md:space-y-4">
            <ThemeAwareBrandText
              brandColor={brandColor}
              darkBrandColor={darkBrandColor}
            >
              <span className="font-mono text-xs sm:text-sm">
                [ {category} ]
              </span>
            </ThemeAwareBrandText>
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <h1 className="font-dotted font-black text-2xl sm:text-3xl md:text-4xl leading-tight">
                <ScrambleText text={name} />
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex justify-center">
            <InstallCommand
              url={installCommand.replace(/^bunx shadcn@latest add /, "")}
              brandColor={brandColor}
              source="component_page_hero"
              componentName={name}
              category={category}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
