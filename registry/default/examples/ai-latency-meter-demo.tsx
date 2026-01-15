"use client";

import {
  AiLatencyMeter,
  AiLatencyMeterBar,
  AiLatencyMeterCompact,
  AiLatencyMeterHeader,
  AiLatencyMeterStats,
} from "@/registry/default/blocks/ai/ai-latency-meter/components/elements/ai-latency-meter";

export default function AiLatencyMeterDemo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <AiLatencyMeter ttfb={245} totalDuration={1850}>
        <AiLatencyMeterHeader title="GPT-4o Response Time" />
        <AiLatencyMeterBar />
        <AiLatencyMeterStats />
      </AiLatencyMeter>

      <div className="flex gap-4">
        <AiLatencyMeter ttfb={180} totalDuration={920} variant="compact">
          <span className="text-xs text-muted-foreground">Claude</span>
          <AiLatencyMeterCompact />
        </AiLatencyMeter>
        <AiLatencyMeter ttfb={320} totalDuration={2100} variant="compact">
          <span className="text-xs text-muted-foreground">GPT-4</span>
          <AiLatencyMeterCompact />
        </AiLatencyMeter>
        <AiLatencyMeter ttfb={95} totalDuration={450} variant="compact">
          <span className="text-xs text-muted-foreground">Gemini</span>
          <AiLatencyMeterCompact />
        </AiLatencyMeter>
      </div>
    </div>
  );
}
