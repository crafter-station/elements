"use client";

import { track } from "@vercel/analytics";

import { ArrowRightIcon } from "@/components/icons/arrow-right";
import { QuickstartCard } from "@/components/quickstart-card";
import { ShadcnIcon } from "@/components/shadcn-icon";
import { Button } from "@/components/ui/button";
import { LinkWithAnalytics } from "@/components/ui/link-with-analytics";
import { GitHubLogo } from "@/components/ui/logos/github";

export function HeroSection() {
  const scrollToGallery = () => {
    track("Gallery Navigation", {
      source: "hero_cta",
      action: "scroll_to_gallery",
    });

    const gallerySection = document.getElementById("gallery");
    if (gallerySection) {
      gallerySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 lg:gap-16 items-center w-full min-h-[90vh] py-16 px-8 lg:px-16">
      <div className="lg:col-span-4 space-y-8">
        {/* Narrative Block */}
        <section className="space-y-6">
          <div className="text-lg uppercase tracking-[0.2em] font-mono text-primary/70">
            [ELEMENTS]
          </div>
          <h1 className="font-dotted font-black text-5xl lg:text-7xl leading-tight tracking-tight">
            Full-Stack
            <br />
            <ShadcnIcon className="size-8 md:size-12 lg:size-16 inline-block" />{" "}
            shadcn/ui
            <br />
            components
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            Elements gives you production-ready auth, payments, AI and more...{" "}
            <br /> built for Next.js, TypeScript, and the agentic era.
          </p>
        </section>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          <Button size="lg" className="font-medium" onClick={scrollToGallery}>
            Explore Gallery <ArrowRightIcon />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="font-medium hover:underline"
            asChild
          >
            <LinkWithAnalytics
              href="https://github.com/crafter-station/elements"
              target="_blank"
              rel="noopener noreferrer"
              trackingEvent="GitHub Star Click"
              trackingProperties={{
                source: "hero_cta",
                action: "external_link_github",
              }}
            >
              Star us on GitHub <GitHubLogo />
            </LinkWithAnalytics>
          </Button>
        </div>
      </div>

      {/* Quickstart Card */}
      <div className="lg:col-span-3 w-full">
        <QuickstartCard />
      </div>
    </div>
  );
}
