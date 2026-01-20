"use client";

import { UpstashLeaderboard } from "@/registry/default/blocks/upstash/upstash-leaderboard/components/elements/upstash-leaderboard";

const DEMO_ENTRIES = [
  { id: "1", name: "Alice Chen", score: 15847, avatar: "https://i.pravatar.cc/150?u=alice" },
  { id: "2", name: "Bob Smith", score: 14523 },
  { id: "3", name: "Carol White", score: 13891, avatar: "https://i.pravatar.cc/150?u=carol" },
  { id: "4", name: "David Brown", score: 12456, highlight: true },
  { id: "5", name: "Eve Johnson", score: 11234, avatar: "https://i.pravatar.cc/150?u=eve" },
  { id: "6", name: "Frank Lee", score: 10567 },
  { id: "7", name: "Grace Kim", score: 9823 },
];

export default function UpstashLeaderboardDemo() {
  return (
    <div className="w-full max-w-sm p-4">
      <UpstashLeaderboard
        entries={DEMO_ENTRIES}
        title="Top Players"
        scoreLabel="Points"
        maxEntries={5}
      />
    </div>
  );
}
