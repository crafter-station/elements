import { InstallCommand } from "@/components/install-command";

import type { Feature } from "./types";

interface QuickStartSectionProps {
  features: Feature[];
  installCommand: string;
  name: string;
  category: string;
}

export function QuickStartSection({
  features,
  installCommand,
  name,
  category,
}: QuickStartSectionProps) {
  return (
    <div className="border-t border-border border-dotted px-4 sm:px-6 md:px-8 lg:px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              What's Included
            </h3>
            <div className="space-y-3">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-primary/20 mt-0.5 flex-shrink-0">
                    <div className="w-2.5 h-2.5 text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Quick Start
            </h3>
            <p className="text-muted-foreground text-sm">
              Get the complete suite with one command
            </p>
            <InstallCommand
              url={installCommand.replace(/^bunx shadcn@latest add /, "")}
              source="component_page_quickstart"
              componentName={name}
              category={category}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
