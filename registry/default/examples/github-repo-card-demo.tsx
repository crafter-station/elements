"use client";

import { GitHubRepoCard } from "@/registry/default/blocks/github/github-repo-card/components/elements/github-repo-card";

export default function GitHubRepoCardDemo() {
  return (
    <div className="flex items-center justify-center p-4">
      <GitHubRepoCard
        owner="shadcn-ui"
        repo="ui"
        staticData={{
          name: "ui",
          description:
            "Beautifully designed components that you can copy and paste into your apps.",
          stargazers_count: 104700,
          forks_count: 6200,
          language: "TypeScript",
        }}
      />
    </div>
  );
}
