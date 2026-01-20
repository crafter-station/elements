"use client";

import { GitHubStarButton } from "@/registry/default/blocks/github/github-star-button/components/elements/github-star-button";

export default function GitHubStarButtonDemo() {
  return (
    <div className="flex items-center justify-center gap-4 p-4">
      <GitHubStarButton owner="shadcn-ui" repo="ui" staticCount={104700} />
      <GitHubStarButton
        owner="vercel"
        repo="next.js"
        staticCount={131000}
        variant="outline"
      />
    </div>
  );
}
