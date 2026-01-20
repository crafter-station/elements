"use client";

import { useState } from "react";
import { UpstashCounter } from "@/registry/default/blocks/upstash/upstash-counter/components/elements/upstash-counter";

export default function UpstashCounterDemo() {
  const [count, setCount] = useState(1234);

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <UpstashCounter
        value={count}
        label="Page Views"
        showControls
        onIncrement={() => setCount((c) => c + 1)}
        onDecrement={() => setCount((c) => Math.max(0, c - 1))}
      />
      <div className="flex gap-8">
        <UpstashCounter value={15847} label="Users" format="compact" size="sm" />
        <UpstashCounter value={2456789} label="Requests" format="compact" size="sm" />
      </div>
    </div>
  );
}
