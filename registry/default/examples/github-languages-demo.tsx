"use client";

import { GitHubLanguages } from "@/registry/default/blocks/github/github-languages/components/elements/github-languages";

export default function GitHubLanguagesDemo() {
  return (
    <div className="flex items-center justify-center p-4 w-full max-w-md">
      <GitHubLanguages
        owner="vercel"
        repo="next.js"
        staticData={[
          { name: "TypeScript", percentage: 68.2, color: "#3178c6" },
          { name: "JavaScript", percentage: 18.5, color: "#f1e05a" },
          { name: "Rust", percentage: 8.1, color: "#dea584" },
          { name: "CSS", percentage: 3.2, color: "#563d7c" },
          { name: "MDX", percentage: 1.5, color: "#fcb32c" },
          { name: "Shell", percentage: 0.5, color: "#89e051" },
        ]}
      />
    </div>
  );
}
