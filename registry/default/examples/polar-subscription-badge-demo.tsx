"use client";

import { PolarSubscriptionBadge } from "@/registry/default/blocks/polar/polar-subscription-badge/components/elements/polar-subscription-badge";

export default function PolarSubscriptionBadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <PolarSubscriptionBadge tier="Free" />
      <PolarSubscriptionBadge tier="Starter" />
      <PolarSubscriptionBadge tier="Pro" showStatus status="active" />
      <PolarSubscriptionBadge tier="Business" showStatus status="trialing" />
      <PolarSubscriptionBadge tier="Enterprise" size="lg" />
      <PolarSubscriptionBadge tier="Pro" variant="outline" showStatus status="past_due" />
    </div>
  );
}
