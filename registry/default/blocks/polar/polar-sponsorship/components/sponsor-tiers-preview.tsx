"use client";

import { useState } from "react";

import { SponsorTiers } from "./sponsor-tiers";

// Demo data for preview
const mockTiers = [
  {
    name: "Supporter",
    price: 10,
    description: "Help keep the project alive",
    perks: ["Early access to updates", "Discord community access"],
  },
  {
    name: "Sponsor",
    price: 50,
    description: "Help shape the project direction",
    perks: ["Feature voting rights", "Priority support", "Logo in README"],
    popular: true,
  },
  {
    name: "Partner",
    price: 200,
    description: "Become a key partner",
    perks: [
      "Direct feature requests",
      "Monthly 1:1 calls",
      "Custom components",
    ],
    isHighlight: true,
  },
];

export function SponsorTiersPreview() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleSponsor = (tierName: string) => {
    console.log("Selected tier:", tierName);
    // In preview mode, just log - no actual checkout
  };

  return (
    <SponsorTiers
      tiers={mockTiers}
      onSponsor={handleSponsor}
      selectedTier={selectedTier}
      onTierSelect={setSelectedTier}
      isPending={false}
    />
  );
}
