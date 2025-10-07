import { CrafterStationLogo } from "@/components/ui/logos/crafter-station";
import { KeboLogo } from "@/components/ui/logos/kebo";

export interface Sponsor {
  name: string;
  tier: string;
  url: string;
  logo: React.ReactNode;
}

export const currentSponsors: Sponsor[] = [
  {
    name: "Crafter Station",
    tier: "Sponsor",
    logo: <CrafterStationLogo className="h-8 w-8" />,
    url: "https://crafterstation.com",
  },
  {
    name: "Kebo",
    tier: "Supporter",
    logo: <KeboLogo className="h-8 w-8" />,
    url: "https://kebo.app",
  },
];

// Default sponsor tiers - customize as needed
export interface SponsorTier {
  name: string;
  price: number;
  description: string;
  perks: string[];
  popular?: boolean;
  isHighlight?: boolean;
  isFlexible?: boolean;
  isOneTime?: boolean;
}

export const sponsorTiers: SponsorTier[] = [
  {
    name: "Tip Jar",
    price: 3,
    description: "One-time thank you",
    perks: ["Good karma", "My eternal gratitude", "Warm fuzzy feeling"],
    popular: false,
    isFlexible: true,
    isOneTime: true,
  },
  {
    name: "Supporter",
    price: 15,
    description: "Monthly support",
    perks: ["Name in credits", "Progress updates", "Feel good vibes"],
    popular: true,
    isFlexible: true,
  },
  {
    name: "Sponsor",
    price: 75,
    description: "Serious support",
    perks: [
      "Logo on sponsor wall",
      "Priority feature requests",
      "Direct feedback line",
    ],
    popular: false,
    isFlexible: true,
  },
  {
    name: "Backer",
    price: 300,
    description:
      "Break my piggy bank and make me work full-time on open source",
    perks: [
      "Everything above",
      "Custom components",
      "Monthly calls",
      "I'll probably cry (happy tears)",
    ],
    popular: false,
    isHighlight: true,
    isFlexible: true,
  },
];
