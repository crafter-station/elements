"use client";

import * as React from "react";

import {
  AiArtifact,
  AiArtifactAction,
  AiArtifactActions,
  AiArtifactCode,
  AiArtifactContent,
  AiArtifactDescription,
  AiArtifactHeader,
  AiArtifactPreview,
  AiArtifactTitle,
} from "@/registry/default/blocks/ai/ai-artifact/components/elements/ai-artifact";

const sampleCode = `import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}`;

export default function AiArtifactDemo() {
  const [showPreview, setShowPreview] = React.useState(false);

  return (
    <div className="w-full max-w-2xl space-y-4 p-4">
      <AiArtifact onClose={() => console.log("closed")}>
        <AiArtifactHeader>
          <AiArtifactTitle>layout.tsx</AiArtifactTitle>
          <AiArtifactDescription>
            Root layout with ClerkProvider
          </AiArtifactDescription>
          <AiArtifactActions>
            <AiArtifactAction
              type="copy"
              onClick={() => navigator.clipboard.writeText(sampleCode)}
            />
            <AiArtifactAction type="download" />
            <AiArtifactAction type="regenerate" />
          </AiArtifactActions>
        </AiArtifactHeader>
        <AiArtifactContent>
          <AiArtifactCode code={sampleCode} language="tsx" />
        </AiArtifactContent>
      </AiArtifact>

      <AiArtifact>
        <AiArtifactHeader>
          <AiArtifactTitle>Button Component</AiArtifactTitle>
          <AiArtifactDescription>
            Interactive preview available
          </AiArtifactDescription>
          <AiArtifactActions>
            <AiArtifactAction
              type="run"
              onClick={() => setShowPreview(!showPreview)}
            />
            <AiArtifactAction type="copy" />
            <AiArtifactAction type="share" />
          </AiArtifactActions>
        </AiArtifactHeader>
        <AiArtifactContent>
          {showPreview ? (
            <AiArtifactPreview>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                  Primary
                </button>
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
                  Secondary
                </button>
              </div>
            </AiArtifactPreview>
          ) : (
            <AiArtifactCode
              code={`<Button variant="primary">Primary</Button>\n<Button variant="secondary">Secondary</Button>`}
              language="tsx"
            />
          )}
        </AiArtifactContent>
      </AiArtifact>
    </div>
  );
}
