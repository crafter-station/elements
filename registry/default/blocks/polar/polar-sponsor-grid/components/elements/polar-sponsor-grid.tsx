"use client";

import { useMemo } from "react";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface Sponsor {
  id: string;
  name: string;
  avatarUrl?: string;
  profileUrl?: string;
  tier?: string;
  amount?: number;
}

export interface SponsorTier {
  name: string;
  minAmount: number;
  color?: string;
}

export interface PolarSponsorGridProps {
  sponsors: Sponsor[];
  tiers?: SponsorTier[];
  showTierLabels?: boolean;
  avatarSize?: "sm" | "md" | "lg";
  maxDisplay?: number;
  className?: string;
}

const DEFAULT_TIERS: SponsorTier[] = [
  { name: "Platinum", minAmount: 100, color: "#E5E4E2" },
  { name: "Gold", minAmount: 50, color: "#FFD700" },
  { name: "Silver", minAmount: 25, color: "#C0C0C0" },
  { name: "Bronze", minAmount: 10, color: "#CD7F32" },
  { name: "Supporter", minAmount: 0, color: "#94a3b8" },
];

const AVATAR_SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

const TIER_AVATAR_SIZES = {
  Platinum: "h-14 w-14 text-lg",
  Gold: "h-12 w-12 text-base",
  Silver: "h-10 w-10 text-sm",
  Bronze: "h-9 w-9 text-xs",
  Supporter: "h-8 w-8 text-xs",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 45%)`;
}

export function PolarSponsorGrid({
  sponsors,
  tiers = DEFAULT_TIERS,
  showTierLabels = true,
  avatarSize,
  maxDisplay,
  className,
}: PolarSponsorGridProps) {
  const groupedSponsors = useMemo(() => {
    const sorted = [...sponsors].sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0));
    const limited = maxDisplay ? sorted.slice(0, maxDisplay) : sorted;

    const groups: Record<string, Sponsor[]> = {};

    for (const sponsor of limited) {
      const tier = tiers.find(
        (t) => (sponsor.amount ?? 0) >= t.minAmount
      ) ?? tiers[tiers.length - 1];
      const tierName = sponsor.tier || tier.name;

      if (!groups[tierName]) {
        groups[tierName] = [];
      }
      groups[tierName].push(sponsor);
    }

    return groups;
  }, [sponsors, tiers, maxDisplay]);

  const orderedTiers = tiers.filter((t) => groupedSponsors[t.name]?.length > 0);

  if (sponsors.length === 0) {
    return (
      <div
        data-slot="polar-sponsor-grid"
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center",
          className
        )}
      >
        <p className="text-sm text-muted-foreground">No sponsors yet</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Be the first to support this project!
        </p>
      </div>
    );
  }

  return (
    <div
      data-slot="polar-sponsor-grid"
      className={cn("space-y-6", className)}
    >
      {orderedTiers.map((tier) => (
        <div key={tier.name} data-slot="tier-group">
          {showTierLabels && (
            <div
              data-slot="tier-label"
              className="mb-3 flex items-center gap-2"
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: tier.color }}
              />
              <span className="text-sm font-medium text-muted-foreground">
                {tier.name}
              </span>
              <span className="text-xs text-muted-foreground/70">
                ({groupedSponsors[tier.name].length})
              </span>
            </div>
          )}
          <div
            data-slot="sponsor-list"
            className="flex flex-wrap gap-2"
          >
            {groupedSponsors[tier.name].map((sponsor) => {
              const size = avatarSize
                ? AVATAR_SIZES[avatarSize]
                : TIER_AVATAR_SIZES[tier.name as keyof typeof TIER_AVATAR_SIZES] ||
                  AVATAR_SIZES.md;

              const avatar = (
                <div
                  data-slot="sponsor-avatar"
                  className={cn(
                    "relative rounded-full ring-2 ring-offset-2 ring-offset-background transition-transform hover:scale-110",
                    size
                  )}
                  style={{ "--tw-ring-color": tier.color } as React.CSSProperties}
                  title={`${sponsor.name}${sponsor.amount ? ` - $${sponsor.amount}/mo` : ""}`}
                >
                  {sponsor.avatarUrl ? (
                    <img
                      src={sponsor.avatarUrl}
                      alt={sponsor.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center rounded-full font-medium text-white"
                      style={{ backgroundColor: stringToColor(sponsor.name) }}
                    >
                      {getInitials(sponsor.name)}
                    </div>
                  )}
                </div>
              );

              if (sponsor.profileUrl) {
                return (
                  <a
                    key={sponsor.id}
                    href={sponsor.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
                  >
                    {avatar}
                  </a>
                );
              }

              return <div key={sponsor.id}>{avatar}</div>;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
