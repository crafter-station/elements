"use client";

import { useState, useTransition } from "react";

import { CurrentSponsors } from "./current-sponsors";
import { SponsorTiers } from "./sponsor-tiers";

interface SponsorTier {
  name: string;
  price: number;
  description: string;
  perks: string[];
  popular?: boolean;
  isHighlight?: boolean;
  isFlexible?: boolean;
  isOneTime?: boolean;
}

interface Sponsor {
  name: string;
  tier: string;
  url: string;
  logo: React.ReactNode;
}

interface SponsorshipPageProps {
  title?: string;
  subtitle?: string;
  tiers: SponsorTier[];
  sponsors: Sponsor[];
  onSponsor: (tierName: string) => Promise<void> | void;
  className?: string;
  children?: React.ReactNode;
}

export function SponsorshipPage({
  title = "Sponsor This Project",
  subtitle = "Support open source development",
  tiers,
  sponsors,
  onSponsor,
  className,
  children,
}: SponsorshipPageProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChooseYourTier = () => {
    const sponsorTiersSection = document.getElementById("sponsor-tiers");
    if (sponsorTiersSection) {
      sponsorTiersSection.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    // Select the popular tier by default
    const popularTier = tiers.find((tier) => tier.popular);
    if (popularTier) {
      setSelectedTier(popularTier.name);
    }
  };

  const handleSponsor = (tierName: string) => {
    startTransition(async () => {
      try {
        await onSponsor(tierName);
      } catch (error) {
        console.error("Failed to create checkout:", error);
        alert("Failed to create checkout. Please try again.");
      }
    });
  };

  return (
    <div className={className}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="w-full pt-12 px-8 lg:px-16">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <div className="text-lg uppercase tracking-[0.2em] font-mono text-primary/70">
                [SUPPORT US]
              </div>
              <h1 className="font-dotted font-black text-5xl lg:text-7xl leading-tight tracking-tight">
                {title}
              </h1>
              <p className="text-muted-foreground text-md lg:text-lg leading-relaxed max-w-2xl mx-auto">
                {subtitle}
              </p>
            </div>

            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="size-2 bg-primary" />
                <span>Backed by {sponsors.length} sponsors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 bg-primary" />
                <span>Reaching 10K+ developers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom content */}
      {children}

      {/* Sponsor Tiers */}
      <div
        id="sponsor-tiers"
        className="w-full border-border border-dotted px-8 py-12"
      >
        <SponsorTiers
          tiers={tiers}
          onSponsor={handleSponsor}
          selectedTier={selectedTier}
          onTierSelect={setSelectedTier}
          isPending={isPending}
        />
      </div>

      {/* Current Sponsors */}
      <div className="w-full border-t border-border border-dotted">
        <CurrentSponsors
          sponsors={sponsors}
          onChooseTier={handleChooseYourTier}
        />
      </div>

      {/* Benefits Section */}
      <div className="w-full border-t border-border border-dotted px-8 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="font-dotted font-black text-4xl lg:text-6xl">
            Why Sponsor?
          </h2>

          <div className="grid gap-8 md:gap-12 md:grid-cols-3">
            <div className="space-y-4">
              <div className="mx-auto flex size-12 items-center justify-center bg-primary/10">
                <svg
                  className="size-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-label="Code brackets icon"
                  role="img"
                >
                  <polyline points="16,18 22,12 16,6" />
                  <polyline points="8,6 2,12 8,18" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Keep Development Active</h3>
              <p className="text-muted-foreground text-sm">
                More time building features, less time worrying about
                sustainability.
              </p>
            </div>

            <div className="space-y-4">
              <div className="mx-auto flex size-12 items-center justify-center bg-primary/10">
                <svg
                  className="size-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-label="Target icon"
                  role="img"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Vote on Features</h3>
              <p className="text-muted-foreground text-sm">
                Help prioritize features and improvements that matter to you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="mx-auto flex size-12 items-center justify-center bg-primary/10">
                <svg
                  className="size-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-label="Checkmark icon"
                  role="img"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Good Vibes</h3>
              <p className="text-muted-foreground text-sm">
                Support open source and feel good about making development
                easier.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
