"use client";

import {
  AiTaskList,
  AiTaskListFile,
  AiTaskListItem,
  AiTaskListProgress,
} from "@/registry/default/blocks/ai/ai-task-list/components/elements/ai-task-list";

export default function AiTaskListDemo() {
  return (
    <div className="w-full max-w-xl space-y-4 p-4">
      <AiTaskList title="Implementing authentication" defaultOpen>
        <AiTaskListProgress />
        <AiTaskListItem status="completed">
          Install Clerk SDK
          <AiTaskListFile filename="package.json" language="json" />
        </AiTaskListItem>
        <AiTaskListItem status="completed">
          Configure ClerkProvider
          <AiTaskListFile filename="src/app/layout.tsx" language="tsx" />
        </AiTaskListItem>
        <AiTaskListItem status="completed">
          Add middleware
          <AiTaskListFile filename="src/middleware.ts" language="ts" />
        </AiTaskListItem>
        <AiTaskListItem status="in-progress">
          Create sign-in page
          <AiTaskListFile filename="src/app/sign-in/page.tsx" language="tsx" />
        </AiTaskListItem>
        <AiTaskListItem status="pending">Create sign-up page</AiTaskListItem>
      </AiTaskList>

      <AiTaskList title="Code review" defaultOpen>
        <AiTaskListProgress />
        <AiTaskListItem status="completed">
          Check for security issues
        </AiTaskListItem>
        <AiTaskListItem status="error">Run test suite</AiTaskListItem>
        <AiTaskListItem status="pending">Generate summary</AiTaskListItem>
      </AiTaskList>
    </div>
  );
}
