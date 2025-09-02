import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Sponsor {
  name: string;
  tier: string;
  url: string;
  logo: React.ReactNode;
}

interface CurrentSponsorsProps {
  sponsors: Sponsor[];
  onChooseTier?: () => void;
  className?: string;
}

export function CurrentSponsors({
  sponsors,
  onChooseTier,
  className,
}: CurrentSponsorsProps) {
  return (
    <div className={className}>
      <div className="space-y-0">
        <div className="px-8 py-16 text-center space-y-8">
          <div className="space-y-2">
            <h2 className="font-dotted font-black text-4xl lg:text-6xl">
              Current Sponsors
            </h2>
            <p className="text-muted-foreground text-lg">
              Join these amazing sponsors supporting open source development
            </p>
          </div>
        </div>

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {sponsors.map((sponsor) => (
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

          {/* "It Can Be You" slot */}
          <div className="flex items-center justify-center border-t border-l md:border-l-0 border-border border-dotted bg-card/30">
            <div className="flex flex-col items-center justify-center min-h-[200px] px-6 py-12 space-y-4">
              <svg
                className="h-12 w-12 text-red-500 opacity-80"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-label="Heart icon"
                role="img"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <div className="text-center space-y-2">
                <h4 className="text-sm font-medium text-foreground">
                  It Can Be You
                </h4>
                <div className="space-y-3 text-xs text-muted-foreground">
                  <p>Ready to sponsor this project?</p>
                  {onChooseTier && (
                    <Button
                      size="sm"
                      onClick={onChooseTier}
                      className="text-xs font-medium"
                    >
                      Choose Your Tier
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
