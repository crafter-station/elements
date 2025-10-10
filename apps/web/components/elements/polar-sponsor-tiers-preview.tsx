"use client";

import { useState } from "react";

// Mock tier data for preview
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

  return (
    <div className="grid gap-4 md:grid-cols-3 p-4">
      {mockTiers.map((tier) => (
        <div
          key={tier.name}
          className={`relative rounded-lg border p-6 transition-all ${
            tier.isHighlight
              ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/50"
              : selectedTier === tier.name
                ? "border-primary ring-2 ring-primary"
                : "border-border hover:border-primary/50"
          }`}
        >
          {tier.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
              Most Popular
            </div>
          )}
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
            <div className="text-3xl font-bold mb-2">
              ${tier.price}
              <span className="text-sm text-muted-foreground font-normal">
                /month
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{tier.description}</p>
          </div>
          <ul className="space-y-2 mb-4">
            {tier.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {perk}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setSelectedTier(tier.name)}
            className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-colors ${
              selectedTier === tier.name
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {selectedTier === tier.name ? "Selected" : "Select"}
          </button>
        </div>
      ))}
    </div>
  );
}
