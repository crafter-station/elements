"use client";

import { UpstashCacheBadge } from "@/registry/default/blocks/upstash/upstash-cache-badge/components/elements/upstash-cache-badge";

export default function UpstashCacheBadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <UpstashCacheBadge status="hit" ttl={120} />
      <UpstashCacheBadge status="miss" onRefresh={() => console.log("Refreshing...")} />
      <UpstashCacheBadge status="stale" onRefresh={() => console.log("Refreshing...")} />
      <UpstashCacheBadge status="expired" onRefresh={() => console.log("Refreshing...")} />
    </div>
  );
}
