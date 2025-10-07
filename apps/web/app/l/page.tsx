import Link from "next/link";

import { getProviderMetadata, getProviders } from "@/lib/registry-loader";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrambleText } from "@/components/scramble-text";
import { Badge } from "@/components/ui/badge";

export default function ProvidersIndexPage() {
  // Server-side data loading
  const providers = getProviders();

  // Get metadata for each provider
  const providerData = providers.map((provider) => ({
    provider,
    ...getProviderMetadata(provider),
  }));

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providerData.map(
              ({
                provider,
                displayName,
                description,
                category,
                brandColor,
                componentCount,
              }) => (
                <Link
                  key={provider}
                  href={`/l/${provider}`}
                  className="group relative block"
                >
                  <div className="h-full border border-border rounded-lg p-6 bg-card hover:bg-accent/50 transition-all duration-200 hover:border-primary/50 hover:shadow-md">
                    {/* Category Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <Badge
                        variant="outline"
                        className="text-xs font-mono"
                        style={{
                          borderColor: `${brandColor}40`,
                          color: brandColor,
                        }}
                      >
                        {category}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">
                          {componentCount}
                        </span>
                        <svg
                          className="w-4 h-4 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <title>Components</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Provider Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: brandColor }}
                        />
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {displayName}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      <span>Explore components</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Arrow</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-border border-dotted px-4 sm:px-6 md:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {providerData.length}
                </div>
                <div className="text-sm text-muted-foreground">Providers</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {providerData.reduce((sum, p) => sum + p.componentCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Components</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Automated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
