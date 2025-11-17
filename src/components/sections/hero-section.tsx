"use client";

import { GitHubStars } from "@/components/github-stars";
import { ArrowRightIcon } from "@/components/icons/arrow-right";
import { ShadcnIcon } from "@/components/shadcn-icon";
import { Button } from "@/components/ui/button";
import { LinkWithAnalytics } from "@/components/ui/link-with-analytics";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-16 md:py-20 px-4 text-center">
      {/* Hero Content */}
      <div className="flex flex-col gap-6 max-w-3xl">
        {/* Title */}
        <h1 className="font-dotted font-black text-4xl md:text-5xl lg:text-6xl leading-tight">
          Full-Stack
          <br />
          <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
            <ShadcnIcon className="size-8 md:size-10 lg:size-12" />
            shadcn/ui blocks
          </span>
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Elements gives you production-ready auth, payments, AI and more...{" "}
          built for Next.js, TypeScript, and the agentic era.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="font-medium" asChild>
            <LinkWithAnalytics
              href="/docs"
              trackingEvent="Explore Gallery Click"
              trackingProperties={{
                source: "hero_cta",
                action: "navigate_to_docs",
              }}
            >
              Explore Gallery <ArrowRightIcon />
            </LinkWithAnalytics>
          </Button>
          <div className="flex items-stretch border rounded-md overflow-hidden">
            <LinkWithAnalytics
              href="https://github.com/crafter-station/elements"
              target="_blank"
              rel="noopener noreferrer"
              trackingEvent="GitHub Click"
              trackingProperties={{
                source: "hero_cta",
                action: "external_link_github",
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 h-11 bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
            >
              GitHub
            </LinkWithAnalytics>
            <LinkWithAnalytics
              href="https://github.com/crafter-station/elements"
              target="_blank"
              rel="noopener noreferrer"
              trackingEvent="GitHub Star Click"
              trackingProperties={{
                source: "hero_cta",
                action: "external_link_github_star",
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 h-11 bg-background hover:bg-accent hover:text-accent-foreground transition-colors border-l text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
                aria-hidden="true"
              >
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
              </svg>
              <GitHubStars />
            </LinkWithAnalytics>
          </div>
        </div>
      </div>
    </section>
  );
}
