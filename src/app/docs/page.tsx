import type { Metadata } from "next";

import { providers } from "@/lib/providers";

import { ComponentCard } from "@/components/component-card";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrambleText } from "@/components/scramble-text";
import { SkillBadge } from "@/components/skill-badge";
import { BreadcrumbSchema } from "@/components/structured-data";

const trackingSource = "providers_overview" as const;

export const metadata: Metadata = {
  title: "Browse Elements",
  description:
    "Explore our collection of production-ready React components organized by provider. Built with Next.js, TypeScript, and shadcn/ui.",
  keywords: [
    "React components",
    "Next.js",
    "TypeScript",
    "shadcn/ui",
    "UI components",
    "component library",
    "design system",
  ],
  authors: [{ name: "Railly Hugo", url: "https://github.com/Railly" }],
  creator: "Railly Hugo",
  publisher: "Railly Hugo",
  alternates: {
    canonical: "https://tryelements.dev/docs",
  },
  openGraph: {
    title: "Browse Elements",
    description:
      "Explore our collection of production-ready React components organized by provider. Built with Next.js, TypeScript, and shadcn/ui.",
    type: "website",
    url: "https://tryelements.dev/docs",
    siteName: "Elements",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Components - Elements",
    description:
      "Explore our collection of production-ready React components organized by provider.",
    creator: "@raillyhugo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function ProvidersIndexPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://tryelements.dev" },
          { name: "Docs", url: "https://tryelements.dev/docs" },
        ]}
      />
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex-1 w-full max-w-screen-xl border-border border-dotted sm:border-x mx-auto">
          {/* Hero Section */}
          <div className="relative overflow-hidden border-b border-border border-dotted">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
            </div>

            <div className="relative z-10 py-4 md:py-5 px-4 sm:px-6 md:px-8">
              <div className="max-w-4xl">
                {/* Category Label */}
                <div className="mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                    FULL-STACK COMPONENT LIBRARY
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h1>
                    <ScrambleText
                      text="Browse Elements"
                      className="font-dotted font-black text-2xl md:text-3xl leading-tight"
                    />
                  </h1>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                    Explore our collection of production-ready components
                    organized by provider
                  </p>
                  <SkillBadge />
                </div>
              </div>
            </div>
          </div>

          {/* Providers Grid */}
          <div className="border-t border-border border-dotted p-4 sm:p-6 md:p-8">
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
                  status={provider.status}
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
                  <div className="text-sm text-muted-foreground">
                    Components
                  </div>
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
    </>
  );
}
