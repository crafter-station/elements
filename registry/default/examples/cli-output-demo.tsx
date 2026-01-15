"use client";

import { CliOutput } from "@/registry/default/blocks/devtools/cli-output/components/elements/cli-output";

const sampleOutput = [
  "\x1b[32m✓\x1b[0m Compiled successfully in 1.2s",
  "\x1b[33m⚠\x1b[0m Warning: React version 18.2.0 detected",
  "\x1b[34mℹ\x1b[0m Starting development server...",
  "\x1b[32m✓\x1b[0m Ready on http://localhost:3000",
  "\x1b[31m✗\x1b[0m Error: Module not found: '@/lib/utils'",
];

export default function CliOutputDemo() {
  return (
    <div className="w-full max-w-2xl p-4">
      <CliOutput output={sampleOutput} prompt="$" autoScroll />
    </div>
  );
}
