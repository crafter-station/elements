"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface SponsorTiersProps {
  tiers: SponsorTier[];
  onSponsor: (tierName: string) => void;
  selectedTier?: string | null;
  onTierSelect: (tierName: string) => void;
  isPending?: boolean;
  className?: string;
}

export function SponsorTiers({
  tiers,
  onSponsor,
  selectedTier,
  onTierSelect,
  isPending = false,
  className,
}: SponsorTiersProps) {
  return (
    <div className={className}>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <button
              key={tier.name}
              type="button"
              className={`relative flex h-full w-full flex-col justify-between rounded-lg border p-6 text-sm hover:border-primary/50 transition-all duration-200 group cursor-pointer ${
                selectedTier === tier.name
                  ? "bg-primary/5 border-primary ring-2 ring-primary/20"
                  : tier.isHighlight
                    ? "bg-gradient-to-br from-primary/5 to-blue-500/5 border-primary/30"
                    : "bg-card hover:bg-card/80 border-border"
              }`}
              onClick={() => onTierSelect(tier.name)}
              aria-label={`Select ${tier.name} sponsorship tier`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground border-0">
                  Most Popular
                </Badge>
              )}
              {tier.isHighlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-blue-500 text-white border-0">
                  Recommended
                </Badge>
              )}

              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{tier.name}</h3>
                </div>

                <div className="space-y-3 text-center">
                  <div className="text-3xl font-bold">
                    ${tier.price}
                    <span className="text-lg font-normal text-muted-foreground">
                      +
                    </span>
                    <div className="text-sm font-normal text-muted-foreground mt-1">
                      {tier.isOneTime ? "minimum/once" : "minimum/mo"}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-3 text-sm">
                  {tier.perks.map((perk, index) => (
                    <li
                      key={`${tier.name}-perk-${index}`}
                      className="flex items-start gap-3"
                    >
                      <svg
                        role="img"
                        aria-label="Checkmark"
                        className="size-4 text-primary mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center space-y-4">
          <Button
            size="lg"
            className="h-12 px-8 gap-2"
            disabled={!selectedTier || isPending}
            onClick={() => selectedTier && onSponsor(selectedTier)}
          >
            {isPending
              ? "Creating checkout..."
              : selectedTier
                ? `Continue with ${selectedTier}`
                : "Select a tier"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Need a custom tier?{" "}
            <a href="#contact" className="underline hover:text-foreground">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
