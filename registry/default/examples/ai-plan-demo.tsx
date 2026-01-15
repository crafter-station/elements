"use client";

import * as React from "react";

import {
  AiPlan,
  AiPlanAction,
  AiPlanContent,
  AiPlanDescription,
  AiPlanFooter,
  AiPlanHeader,
  AiPlanStep,
  AiPlanTitle,
} from "@/registry/default/blocks/ai/ai-plan/components/elements/ai-plan";

export default function AiPlanDemo() {
  const [isStreaming, setIsStreaming] = React.useState(false);

  return (
    <div className="w-full max-w-xl space-y-4 p-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsStreaming(!isStreaming)}
          className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md"
        >
          {isStreaming ? "Stop Streaming" : "Simulate Streaming"}
        </button>
      </div>

      <AiPlan isStreaming={isStreaming} defaultOpen>
        <AiPlanHeader>
          <AiPlanTitle>Implementation Plan</AiPlanTitle>
          <AiPlanDescription>Add authentication to your app</AiPlanDescription>
        </AiPlanHeader>
        <AiPlanContent>
          <div className="space-y-3">
            <AiPlanStep number={1}>
              Install the Clerk SDK and configure environment variables
            </AiPlanStep>
            <AiPlanStep number={2}>
              Wrap the application with ClerkProvider in the root layout
            </AiPlanStep>
            <AiPlanStep number={3}>
              Add middleware for route protection
            </AiPlanStep>
            <AiPlanStep number={4}>Create sign-in and sign-up pages</AiPlanStep>
            <AiPlanStep number={5}>
              Add user button component to the header
            </AiPlanStep>
          </div>
        </AiPlanContent>
        <AiPlanFooter>
          <AiPlanAction variant="secondary">Modify Plan</AiPlanAction>
          <AiPlanAction variant="primary">Execute Plan</AiPlanAction>
        </AiPlanFooter>
      </AiPlan>

      <AiPlan defaultOpen>
        <AiPlanHeader>
          <AiPlanTitle>Quick Fix</AiPlanTitle>
          <AiPlanDescription>Fix the type error in utils.ts</AiPlanDescription>
        </AiPlanHeader>
        <AiPlanContent>
          <div className="space-y-3">
            <AiPlanStep number={1}>
              Add proper type annotation to the function parameter
            </AiPlanStep>
            <AiPlanStep number={2}>Run type check to verify the fix</AiPlanStep>
          </div>
        </AiPlanContent>
        <AiPlanFooter>
          <AiPlanAction variant="primary">Apply Fix</AiPlanAction>
        </AiPlanFooter>
      </AiPlan>
    </div>
  );
}
