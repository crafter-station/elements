"use client";

import { GitHubStars } from "@/registry/default/blocks/github/github-stars/components/elements/github-stars";

const DEMO_DATA = [
  0, 12, 28, 35, 52, 71, 89, 112, 134, 158, 175, 201, 228, 245, 267, 298, 325,
  351, 378, 402, 435, 461, 489, 512, 548, 579, 612, 645, 678, 715,
];

export default function GitHubStarsDemo() {
  return (
    <div className="flex items-center justify-center p-4">
      <GitHubStars
        owner="shadcn-ui"
        repo="ui"
        staticStars={104700}
        staticData={DEMO_DATA}
      />
    </div>
  );
}
