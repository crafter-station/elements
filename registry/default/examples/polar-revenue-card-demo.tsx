"use client";

import { PolarRevenueCard } from "@/registry/default/blocks/polar/polar-revenue-card/components/elements/polar-revenue-card";

export default function PolarRevenueCardDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
      <PolarRevenueCard
        value={12450}
        previousValue={11200}
        interval="mrr"
        trend={[8200, 9100, 9800, 10500, 11200, 12450]}
      />
      <PolarRevenueCard
        value={149400}
        previousValue={134400}
        interval="arr"
        trend={[98400, 109200, 117600, 126000, 134400, 149400]}
      />
      <PolarRevenueCard
        title="New Customers"
        value={847}
        previousValue={923}
        currency=""
        showChange
        trend={[120, 145, 132, 156, 148, 146]}
      />
      <PolarRevenueCard
        title="Churn Rate"
        value={2.4}
        previousValue={3.1}
        currency=""
        showChange
        size="sm"
      />
    </div>
  );
}
