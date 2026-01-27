"use client";

import { TextShimmer } from "@/registry/default/blocks/animations/text-shimmer/components/elements/text-shimmer";

export default function TextShimmerDemo() {
  return (
    <div className="flex items-center justify-center p-4">
      <TextShimmer className="text-2xl font-medium" duration={1.5}>
        Cooking...
      </TextShimmer>
    </div>
  );
}
