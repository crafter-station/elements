"use client";

import { PolarPricingCard } from "@/registry/default/blocks/polar/polar-pricing-card/components/elements/polar-pricing-card";

export default function PolarPricingCardDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-3 max-w-4xl">
      <PolarPricingCard
        name="Free"
        description="For hobbyists and side projects"
        price={0}
        features={[
          "Up to 3 projects",
          "Basic analytics",
          "Community support",
          { text: "Custom domain", included: false },
          { text: "Priority support", included: false },
        ]}
        ctaText="Get Started"
      />
      <PolarPricingCard
        name="Pro"
        description="For professionals and growing teams"
        price={29}
        interval="month"
        features={[
          "Unlimited projects",
          "Advanced analytics",
          "Priority support",
          "Custom domain",
          "API access",
        ]}
        popular
        highlighted
        ctaText="Start Free Trial"
      />
      <PolarPricingCard
        name="Enterprise"
        description="For large organizations"
        price={99}
        interval="month"
        features={[
          "Everything in Pro",
          "SSO & SAML",
          "Dedicated support",
          "Custom integrations",
          "SLA guarantee",
        ]}
        ctaText="Contact Sales"
      />
    </div>
  );
}
