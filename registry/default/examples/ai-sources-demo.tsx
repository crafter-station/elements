"use client";

import {
  AiSources,
  AiSourcesContent,
  AiSourcesTrigger,
} from "@/registry/default/blocks/ai/ai-sources/components/elements/ai-sources";

const sources = [
  {
    url: "https://clerk.com/docs/quickstarts/nextjs",
    title: "Next.js Quickstart - Clerk",
    snippet:
      "Learn how to add authentication to your Next.js application with Clerk.",
  },
  {
    url: "https://nextjs.org/docs/app/building-your-application/authentication",
    title: "Authentication - Next.js",
    snippet: "Learn how to implement authentication in Next.js applications.",
  },
  {
    url: "https://react.dev/learn/managing-state",
    title: "Managing State - React",
    snippet: "Learn how to manage state effectively in React applications.",
  },
  {
    url: "https://github.com/clerk/javascript",
    title: "clerk/javascript - GitHub",
    snippet:
      "Official Clerk JavaScript SDK monorepo with React, Next.js, and more.",
  },
];

export default function AiSourcesDemo() {
  return (
    <div className="w-full max-w-xl space-y-4 p-4">
      <AiSources sources={sources} defaultOpen>
        <AiSourcesTrigger>Referenced Sources</AiSourcesTrigger>
        <AiSourcesContent />
      </AiSources>

      <AiSources
        sources={[
          {
            url: "https://docs.anthropic.com",
            title: "Anthropic Documentation",
          },
          { url: "https://openai.com/api", title: "OpenAI API Reference" },
        ]}
      >
        <AiSourcesTrigger>API References</AiSourcesTrigger>
        <AiSourcesContent />
      </AiSources>
    </div>
  );
}
