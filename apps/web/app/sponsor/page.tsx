"use client";

import { useState, useTransition } from "react";

import { track } from "@vercel/analytics";

import { currentSponsors, sponsorTiers } from "@/lib/sponsors";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CodeIcon } from "@/components/icons/code";
import { HourglassIcon } from "@/components/icons/hourglass";
import { HumanHandsupIcon } from "@/components/icons/human-handsup";
import { MoodHappyIcon } from "@/components/icons/mood-happy";
import { PixelatedHeartIcon } from "@/components/pixelated-heart-icon";
import { ScrambleText } from "@/components/scramble-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const POLAR_PRODUCT_IDS = {
  "Tip Jar": "714b5098-71bd-43a3-b704-b776ab9b57d3",
  Supporter: "a80fbd28-adb3-48e2-9dba-ca7d19919abb",
  Sponsor: "99ba3a23-8056-4532-a0ea-f378d40ac178",
  Backer: "8bf45d94-2972-4bd4-b745-cd34b3bdc629",
};

export default function SponsorPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>("Supporter");
  const [isPending, startTransition] = useTransition();

  const handleChooseYourTier = () => {
    track("Sponsor Tier Navigation", {
      source: "sponsor_page_cta",
      action: "scroll_to_tiers",
      default_tier: "Supporter",
    });

    // Smooth scroll to sponsor tiers section
    const sponsorTiersSection = document.getElementById("sponsor-tiers");
    if (sponsorTiersSection) {
      sponsorTiersSection.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    // Select Supporter tier
    setSelectedTier("Supporter");
  };

  const handleSponsor = () => {
    if (!selectedTier) return;

    track("Sponsor Checkout Initiated", {
      tier_selected: selectedTier,
      source: "sponsor_page_checkout",
      action: "checkout_start",
    });

    startTransition(() => {
      try {
        const productId =
          POLAR_PRODUCT_IDS[selectedTier as keyof typeof POLAR_PRODUCT_IDS];
        if (!productId) {
          track("Sponsor Checkout Error", {
            tier_selected: selectedTier,
            error: "unknown_tier",
            source: "sponsor_page_checkout",
          });
          throw new Error(`Unknown tier: ${selectedTier}`);
        }

        // Use the Polar NextJS adapter checkout route
        const checkoutUrl = `/api/checkout?products=${productId}`;
        window.location.href = checkoutUrl;
      } catch (error) {
        track("Sponsor Checkout Error", {
          tier_selected: selectedTier,
          error: "checkout_failed",
          source: "sponsor_page_checkout",
        });
        console.error("Failed to create checkout:", error);
        alert("Failed to create checkout. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 w-full max-w-screen-xl border-border border-dotted border-x mx-auto pb-20 md:pb-0">
        {/* Hero Section - Basement Style */}
        <div className="relative overflow-hidden">
          <div className="w-full pt-12 px-8 lg:px-16">
            <div className="text-center max-w-4xl mx-auto space-y-8">
              <div className="space-y-6">
                <div className="text-lg uppercase tracking-[0.2em] font-mono text-primary/70">
                  [SUPPORT US]
                </div>
                <h1 className="font-dotted font-black text-5xl lg:text-7xl leading-tight tracking-tight">
                  <ScrambleText text="Sponsor Elements" />
                </h1>
                <p className="text-muted-foreground text-md lg:text-lg leading-relaxed max-w-2xl mx-auto">
                  Fuel the future of full-stack development. Elements grows with
                  your support.
                </p>
              </div>

              <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-primary" />
                  <span>Backed by {currentSponsors.length} sponsors</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-primary" />
                  <span>Reaching 10K+ developers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sponsor Tiers - Component Card Style */}
        <div
          id="sponsor-tiers"
          className="w-full border-border border-dotted px-8 py-12"
        >
          <div className="space-y-8">
            <div className="grid gap-4 place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {sponsorTiers.map((tier) => (
                <button
                  key={tier.name}
                  type="button"
                  className={`relative flex h-full w-full flex-col justify-between border border-border p-6 text-sm hover:border-foreground/20 transition-all duration-200 group cursor-pointer ${
                    selectedTier === tier.name
                      ? "bg-primary/5 border-primary"
                      : tier.isHighlight
                        ? "bg-red-500/5 border-red-500/20"
                        : "bg-card/30"
                  }`}
                  onClick={() => {
                    track("Sponsor Tier Selected", {
                      tier_name: tier.name,
                      tier_price: tier.price,
                      is_popular: tier.popular || false,
                      is_highlight: tier.isHighlight || false,
                      source: "sponsor_page_tiers",
                    });
                    setSelectedTier(tier.name);
                  }}
                  aria-label={`Select ${tier.name} sponsorship tier`}
                >
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-2 h-2 bg-border"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-border"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 bg-border"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-border"></div>

                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  {tier.isHighlight && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white flex items-center gap-1">
                      <HumanHandsupIcon className="size-3" /> Dream Tier
                    </Badge>
                  )}

                  <div className="space-y-4 text-center">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-center w-10 h-10 bg-muted group-hover:bg-muted/80 transition-colors">
                        <PixelatedHeartIcon className="size-5" />
                      </div>
                      <Badge
                        variant={tier.popular ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {tier.name}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="text-2xl font-bold">
                        <span className="text-base">
                          ${tier.price}+{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            {tier.isOneTime ? "minimum/once" : "minimum/mo"}
                          </span>
                        </span>
                      </div>
                      <p className="text-xs w-full text-center text-muted-foreground leading-relaxed">
                        {tier.description}
                      </p>
                    </div>

                    <ul className="space-y-2 text-xs text-left">
                      {tier.perks.map((perk, index) => (
                        <li
                          key={`${tier.name}-perk-${index}`}
                          className="flex items-start gap-2"
                        >
                          <div className="size-1 bg-primary flex-shrink-0 mt-1.5" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <div className="my-2 h-[1px] w-full bg-border"></div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {tier.isOneTime ? "Donation" : "Sponsorship"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {tier.isOneTime ? "One-time" : "Monthly"}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center space-y-4 hidden md:block">
              <Button
                size="lg"
                className="h-14 px-8 text-lg gap-2"
                disabled={!selectedTier || isPending}
                onClick={handleSponsor}
              >
                <PixelatedHeartIcon className="size-5" />
                {isPending
                  ? "Creating checkout..."
                  : selectedTier
                    ? `Sponsor with ${selectedTier}`
                    : "Select a tier"}
              </Button>
              <p className="text-sm text-muted-foreground">
                Need a custom tier?{" "}
                <a
                  href="mailto:railly@crafterstation.com?subject=Custom Elements Sponsorship"
                  onClick={() =>
                    track("Custom Tier Contact", {
                      source: "sponsor_page_custom_tier",
                      action: "email_click",
                    })
                  }
                  className="underline hover:text-foreground"
                >
                  Contact us
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Current Sponsors - Same style as homepage */}
        <div className="w-full border-t border-border border-dotted">
          <div className="space-y-0">
            <div className="px-8 py-16 text-center space-y-8">
              <div className="space-y-2">
                <h2>
                  <ScrambleText
                    text="Current Sponsors"
                    className="font-dotted font-black text-4xl lg:text-6xl"
                  />
                </h2>
                <p className="text-muted-foreground text-lg">
                  Join these companies building with Elements - ready-to-use
                  components that scale
                </p>
              </div>
            </div>

            {/* Three Column Grid - Matching homepage */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              {currentSponsors.map((sponsor) => (
                <a
                  key={`${sponsor.name}-${sponsor.tier}`}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center border-t border-r md:border-r border-border border-dotted bg-card/30 hover:bg-accent/20 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center justify-center min-h-[200px] px-6 py-12 space-y-4">
                    <div className="opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      {sponsor.logo}
                    </div>
                    <div className="text-center space-y-1">
                      <h4 className="text-2xl uppercase font-black font-dotted text-foreground group-hover:text-primary transition-colors">
                        {sponsor.name}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {sponsor.tier}
                      </Badge>
                    </div>
                  </div>
                </a>
              ))}

              {/* "It Can Be You" slot - Same as homepage */}
              <div className="flex items-center justify-center border-t border-l md:border-l-0 border-border border-dotted bg-card/30 ">
                <div className="flex flex-col items-center justify-center min-h-[200px] px-6 py-12 space-y-4">
                  <PixelatedHeartIcon className="h-12 w-12 text-red-500 opacity-80" />
                  <div className="text-center space-y-2">
                    <h4 className="text-sm font-medium text-foreground">
                      It Can Be You
                    </h4>
                    <div className="space-y-3 text-xs text-muted-foreground">
                      <p>Ready to sponsor Elements?</p>
                      <Button
                        size="sm"
                        onClick={handleChooseYourTier}
                        className="text-xs font-medium"
                      >
                        Choose Your Tier
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section - Personal */}
        <div className="w-full border-t border-border border-dotted px-8 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2>
              <ScrambleText
                text="Why Sponsor?"
                className="font-dotted font-black text-4xl lg:text-6xl"
              />
            </h2>

            <div className="grid gap-8 md:gap-12 md:grid-cols-3">
              <div className="space-y-4">
                <div className="mx-auto flex size-12 items-center justify-center bg-primary/10">
                  <CodeIcon className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Keep Me Coding</h3>
                <p className="text-muted-foreground text-sm">
                  More time building components, less time worrying about rent.
                </p>
              </div>

              <div className="space-y-4">
                <div className="mx-auto flex size-12 items-center justify-center bg-primary/10">
                  <HourglassIcon className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Vote on Features</h3>
                <p className="text-muted-foreground text-sm">
                  Tell me what components you actually need. I'll listen.
                </p>
              </div>

              <div className="space-y-4">
                <div className="mx-auto flex size-12 items-center justify-center bg-primary/10">
                  <MoodHappyIcon className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Good Vibes</h3>
                <p className="text-muted-foreground text-sm">
                  Support open source and feel good about making the web easier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Mobile Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border p-4">
        <div className="max-w-screen-xl mx-auto">
          <Button
            size="lg"
            className="w-full h-14 text-lg gap-2"
            disabled={!selectedTier || isPending}
            onClick={handleSponsor}
          >
            <PixelatedHeartIcon className="size-5" />
            {isPending
              ? "Creating checkout..."
              : selectedTier
                ? `Sponsor with ${selectedTier}`
                : "Select a tier"}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
