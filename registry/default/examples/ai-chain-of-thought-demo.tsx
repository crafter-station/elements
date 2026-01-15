"use client";

import {
  AiChainOfThought,
  AiChainOfThoughtContent,
  AiChainOfThoughtHeader,
  AiChainOfThoughtImage,
  AiChainOfThoughtSearchResults,
  AiChainOfThoughtStep,
} from "@/registry/default/blocks/ai/ai-chain-of-thought/components/elements/ai-chain-of-thought";

export default function AiChainOfThoughtDemo() {
  const searchResults = [
    { title: "Clerk Documentation", url: "https://clerk.com/docs" },
    { title: "Next.js Auth Guide", url: "https://nextjs.org/docs/auth" },
    { title: "React Best Practices", url: "https://react.dev/learn" },
  ];

  return (
    <div className="w-full max-w-xl space-y-4 p-4">
      <AiChainOfThought defaultOpen>
        <AiChainOfThoughtHeader>Research and Planning</AiChainOfThoughtHeader>
        <AiChainOfThoughtContent>
          <AiChainOfThoughtStep title="Step 1" status="complete">
            Analyzing the current project structure and dependencies
          </AiChainOfThoughtStep>
          <AiChainOfThoughtStep title="Step 2" status="complete">
            Searching for authentication best practices
            <AiChainOfThoughtSearchResults results={searchResults} />
          </AiChainOfThoughtStep>
          <AiChainOfThoughtStep title="Step 3" status="active">
            Reviewing architecture diagram
            <AiChainOfThoughtImage
              src="https://placehold.co/400x200/1a1a2e/ffffff?text=Architecture+Diagram"
              alt="System architecture diagram"
              caption="Current system architecture"
            />
          </AiChainOfThoughtStep>
          <AiChainOfThoughtStep title="Step 4" status="pending">
            Generating implementation plan
          </AiChainOfThoughtStep>
        </AiChainOfThoughtContent>
      </AiChainOfThought>

      <AiChainOfThought>
        <AiChainOfThoughtHeader>Quick Analysis</AiChainOfThoughtHeader>
        <AiChainOfThoughtContent>
          <AiChainOfThoughtStep title="Review" status="complete">
            Code review completed
          </AiChainOfThoughtStep>
          <AiChainOfThoughtStep title="Security" status="complete">
            No security issues found
          </AiChainOfThoughtStep>
        </AiChainOfThoughtContent>
      </AiChainOfThought>
    </div>
  );
}
