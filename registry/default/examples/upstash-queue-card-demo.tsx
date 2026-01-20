"use client";

import { UpstashQueueCard } from "@/registry/default/blocks/upstash/upstash-queue-card/components/elements/upstash-queue-card";

export default function UpstashQueueCardDemo() {
  return (
    <div className="w-full max-w-md space-y-4 p-4">
      <UpstashQueueCard
        id="msg_abc123def456"
        status="processing"
        payload='{"userId": "user_123", "action": "send_email"}'
        scheduledAt={new Date()}
        retries={1}
        maxRetries={3}
      />
      <UpstashQueueCard
        id="msg_xyz789ghi012"
        status="completed"
        payload='{"report": "daily_analytics"}'
        scheduledAt={new Date(Date.now() - 3600000)}
        completedAt={new Date()}
      />
      <UpstashQueueCard
        id="msg_fail456err"
        status="failed"
        payload='{"webhook": "https://api.example.com"}'
        retries={3}
        maxRetries={3}
        error="Connection timeout after 30s"
      />
    </div>
  );
}
