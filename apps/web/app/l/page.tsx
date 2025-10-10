import { providers } from "@/lib/providers";

import { ComponentCard } from "@/components/component-card";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrambleText } from "@/components/scramble-text";

const trackingSource = "providers_overview" as const;

export default function ProvidersIndexPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 w-full max-w-screen-xl border-border border-dotted sm:border-x mx-auto">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
          </div>

          <div className="relative z-10 w-full py-12 md:py-16 px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="space-y-4">
                <span className="font-mono text-xs sm:text-sm text-primary">
                  [ COMPONENT LIBRARY ]
                </span>
                <h1 className="font-dotted font-black text-3xl sm:text-4xl md:text-5xl leading-tight">
                  <ScrambleText text="Browse Components" />
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Explore our collection of production-ready components
                  organized by provider
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Providers Grid */}
        <div className="border-t border-border border-dotted px-4 sm:px-6 md:px-8 py-12">
          <div className="grid gap-4 place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <ComponentCard
                key={provider.name}
                name={provider.name}
                description={provider.description}
                icon={provider.icon}
                category={provider.category}
                brandColor={provider.brandColor}
                isEnabled={provider.isEnabled}
                href={provider.href}
                elementsCount={provider.elementsCount}
                providerLink={provider.providerLink}
                trackingSource={trackingSource}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-border border-dotted px-4 sm:px-6 md:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {providers.filter((p) => p.isEnabled).length}
                </div>
                <div className="text-sm text-muted-foreground">Providers</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {providers
                    .filter((p) => p.isEnabled)
                    .reduce((sum, p) => sum + (p.elementsCount || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Components</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {providers.length}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
