"use client";

import { GitHubContributions } from "@/registry/default/blocks/github/github-contributions/components/elements/github-contributions";

const DEMO_DATA = [
  [0.2, 0.4, 0.1, 0.8, 0.3, 0.6, 0.2, 0.5, 0.7, 0.3, 0.4, 0.9],
  [0.5, 0.1, 0.6, 0.3, 0.8, 0.2, 0.7, 0.4, 0.1, 0.6, 0.3, 0.5],
  [0.3, 0.7, 0.2, 0.5, 0.1, 0.9, 0.4, 0.6, 0.8, 0.2, 0.7, 0.1],
  [0.8, 0.2, 0.5, 0.1, 0.6, 0.3, 0.9, 0.2, 0.4, 0.8, 0.1, 0.6],
  [0.1, 0.6, 0.9, 0.4, 0.2, 0.7, 0.1, 0.8, 0.3, 0.5, 0.9, 0.2],
  [0.6, 0.3, 0.1, 0.7, 0.5, 0.1, 0.6, 0.3, 0.9, 0.1, 0.5, 0.8],
  [0.4, 0.8, 0.3, 0.6, 0.9, 0.4, 0.2, 0.7, 0.1, 0.6, 0.2, 0.4],
];

export default function GitHubContributionsDemo() {
  return (
    <div className="flex items-center justify-center p-4">
      <GitHubContributions
        owner="shadcn-ui"
        repo="ui"
        staticContributions={2847}
        staticData={DEMO_DATA}
      />
    </div>
  );
}
