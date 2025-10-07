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

      <div className="relative z-10 w-full py-4 md:py-6 px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <ThemeAwareBrandText
                brandColor={brandColor}
                darkBrandColor={darkBrandColor}
              >
                <span className="font-mono text-[10px] sm:text-xs">
                  [ {category} ]
                </span>
              </ThemeAwareBrandText>
            </div>
            <div className="flex items-center justify-center gap-2 md:gap-3">
              <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <h1 className="font-dotted font-black text-xl sm:text-2xl md:text-3xl leading-tight">
                <ScrambleText text={name} />
              </h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-snug">
              {description}
            </p>
          </div>

          <div className="flex justify-center pt-1">
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
