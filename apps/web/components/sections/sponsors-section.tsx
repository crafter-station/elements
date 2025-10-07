"use client";

import Link from "next/link";

import { track } from "@vercel/analytics";

import { currentSponsors } from "@/lib/sponsors";

import { PixelatedHeartIcon } from "@/components/pixelated-heart-icon";
import { ScrambleText } from "@/components/scramble-text";
import { Badge } from "@/components/ui/badge";

export function SponsorsSection() {
  const handleSponsorClick = (sponsor: (typeof currentSponsors)[0]) => {
    track("Sponsor Click", {
      sponsor_name: sponsor.name,
      sponsor_tier: sponsor.tier,
      source: "homepage_sponsors",
      action: "external_link",
    });
  };

  const handleBecomeSponsorClick = () => {
    track("Become Sponsor Click", {
      source: "homepage_sponsors",
      action: "cta_click",
    });
  };

  return (
    <div className="w-full border-t border-border border-dotted">
      <div className="space-y-0">
        <div className="px-8 py-12 text-center space-y-8">
          <div className="space-y-2">
            <h2>
              <ScrambleText
                text="Sponsors"
                className="font-dotted font-black text-4xl lg:text-5xl"
              />
            </h2>
            <p className="text-muted-foreground text-lg">
              Join these companies building with Elements - ready-to-use
              components that scale
            </p>
          </div>
        </div>

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {currentSponsors.map((sponsor, index) => (
            <a
              key={`${sponsor.name}-${sponsor.tier}`}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSponsorClick(sponsor)}
              className={`flex items-center justify-center border-t ${
                index === 0
                  ? "border-r md:border-r"
                  : index === 1
                    ? "border-l md:border-l-0 border-r md:border-r"
                    : ""
              } border-border border-dotted bg-card/30 hover:bg-accent/20 transition-all duration-300 group`}
            >
              <div className="flex flex-col items-center justify-center min-h-[200px] px-6 py-12 space-y-4">
                <div className="opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  {sponsor.logo}
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-2xl uppercase font-black font-dotted text-foreground group-hover:text-primary transition-colors">
                    {sponsor.name}
                  </h4>
                  <div className="space-y-1">
                    <Badge variant="secondary" className="text-xs">
                      {sponsor.tier}
                    </Badge>
                  </div>
                </div>
              </div>
            </a>
          ))}
          <div className="flex items-center justify-center border-t border-l md:border-l-0 border-border border-dotted bg-card/30">
            <div className="flex flex-col items-center justify-center min-h-[200px] px-6 py-12 space-y-4">
              <PixelatedHeartIcon className="h-12 w-12 text-red-500 opacity-80" />
              <div className="text-center space-y-2">
                <h4 className="text-sm font-medium text-foreground">
                  It Can Be You
                </h4>
                <div className="space-y-3 text-xs text-muted-foreground">
                  <p>Need custom components for your company?</p>
                  <Link
                    href="/sponsor"
                    onClick={handleBecomeSponsorClick}
                    className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 text-sm font-medium"
                  >
                    Become a Sponsor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
