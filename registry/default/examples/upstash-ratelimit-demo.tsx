"use client";

import { UpstashRatelimit } from "@/registry/default/blocks/upstash/upstash-ratelimit/components/elements/upstash-ratelimit";

export default function UpstashRatelimitDemo() {
  const resetTime = Date.now() + 45000;

  return (
    <div className="w-full max-w-sm space-y-4 p-4">
      <UpstashRatelimit
        limit={100}
        remaining={73}
        reset={resetTime}
        success={true}
      />
      <UpstashRatelimit
        limit={100}
        remaining={15}
        reset={resetTime}
        success={true}
        size="sm"
      />
      <UpstashRatelimit
        limit={100}
        remaining={0}
        reset={resetTime}
        success={false}
        size="sm"
      />
    </div>
  );
}
