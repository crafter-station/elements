"use client";

import { GitHubProfileCard } from "@/registry/default/blocks/github/github-profile-card/components/elements/github-profile-card";

export default function GitHubProfileCardDemo() {
  return (
    <div className="flex items-center justify-center p-4">
      <GitHubProfileCard
        username="shadcn"
        staticData={{
          login: "shadcn",
          name: "shadcn",
          avatar_url: "https://avatars.githubusercontent.com/u/124599?v=4",
          bio: "Building @vercel. Creator of shadcn/ui.",
          public_repos: 45,
          followers: 12500,
          following: 89,
          company: "@vercel",
          location: "New York",
          blog: "shadcn.com",
          twitter_username: "shadcn",
        }}
      />
    </div>
  );
}
