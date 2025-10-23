"use client";

import { TinteEditor } from "@/registry/default/blocks/tinte/tinte-editor/components/tinte-editor";

export default function TinteEditorDemo() {
  return (
    <>
      <div className="flex items-center justify-center min-h-[400px] relative">
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <span className="text-sm font-medium [&>p]:!m-0">
              Check the bottom right corner
            </span>
            <svg
              className="w-4 h-4 -rotate-45 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Arrow</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
      <TinteEditor />
    </>
  );
}
