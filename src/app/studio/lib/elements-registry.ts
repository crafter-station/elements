export interface ElementComponent {
  name: string;
  import: string;
  description: string;
  props: string;
}

export const AI_ELEMENTS: ElementComponent[] = [
  {
    name: "AiChatInput",
    import:
      "@/registry/default/blocks/ai/ai-chat-input/components/elements/ai-chat-input",
    description:
      "Chat input with submit button, optional file attachments, auto-resize textarea",
    props:
      "onSubmit?: (message: string, attachments?: File[]) => void; placeholder?: string; disabled?: boolean; loading?: boolean; allowAttachments?: boolean; maxRows?: number;",
  },
  {
    name: "AiMessageBubble",
    import:
      "@/registry/default/blocks/ai/ai-message-bubble/components/elements/ai-message-bubble",
    description:
      "Chat message bubble with avatar, copy button, streaming indicator",
    props:
      "role: 'user' | 'assistant'; content: string; timestamp?: Date; avatar?: ReactNode; isStreaming?: boolean;",
  },
  {
    name: "AiStreamingText",
    import:
      "@/registry/default/blocks/ai/ai-streaming-text/components/elements/ai-streaming-text",
    description:
      "Text that reveals character by character with cursor animation",
    props: "text: string; speed?: number; onComplete?: () => void;",
  },
  {
    name: "AiThinkingIndicator",
    import:
      "@/registry/default/blocks/ai/ai-thinking-indicator/components/elements/ai-thinking-indicator",
    description: "Loading indicator with variants: dots, pulse, sparkles",
    props: "variant?: 'dots' | 'pulse' | 'sparkles'; message?: string;",
  },
  {
    name: "AiReasoning",
    import:
      "@/registry/default/blocks/ai/ai-reasoning/components/elements/ai-reasoning",
    description:
      "Collapsible reasoning/thinking section with streaming support",
    props:
      "isStreaming?: boolean; defaultOpen?: boolean; thinkingDuration?: number; children: ReactNode;",
  },
  {
    name: "AiChainOfThought",
    import:
      "@/registry/default/blocks/ai/ai-chain-of-thought/components/elements/ai-chain-of-thought",
    description: "Step-by-step reasoning visualization with numbered steps",
    props:
      "children: ReactNode; (use AiChainOfThoughtStep with title, status: 'pending' | 'active' | 'complete', children)",
  },
  {
    name: "AiToolCall",
    import:
      "@/registry/default/blocks/ai/ai-tool-call/components/elements/ai-tool-call",
    description: "Display tool/function call with name, arguments, result",
    props:
      "name: string; status?: 'pending' | 'running' | 'complete' | 'error'; arguments?: Record<string, unknown>; result?: unknown;",
  },
  {
    name: "AiModelSelector",
    import:
      "@/registry/default/blocks/ai/ai-model-selector/components/elements/ai-model-selector",
    description: "Dropdown to select AI model with provider icons",
    props:
      "models: Array<{id, name, provider, description?}>; value?: string; onValueChange?: (value: string) => void;",
  },
  {
    name: "AiTemperatureSlider",
    import:
      "@/registry/default/blocks/ai/ai-temperature-slider/components/elements/ai-temperature-slider",
    description:
      "Slider for AI temperature with presets (precise, balanced, creative)",
    props:
      "value?: number; onValueChange?: (value: number) => void; min?: number; max?: number; step?: number;",
  },
  {
    name: "AiTokenCounter",
    import:
      "@/registry/default/blocks/ai/ai-token-counter/components/elements/ai-token-counter",
    description: "Token usage display with progress bar",
    props: "current: number; max: number; label?: string;",
  },
  {
    name: "AiSources",
    import:
      "@/registry/default/blocks/ai/ai-sources/components/elements/ai-sources",
    description: "Display cited sources with links and favicons",
    props: "sources: Array<{title, url, snippet?}>; maxVisible?: number;",
  },
  {
    name: "AiConfirmation",
    import:
      "@/registry/default/blocks/ai/ai-confirmation/components/elements/ai-confirmation",
    description: "Confirmation dialog for AI actions",
    props:
      "title: string; description?: string; variant?: 'default' | 'approve' | 'reject'; onConfirm?: () => void; onCancel?: () => void;",
  },
  {
    name: "AiResponseActions",
    import:
      "@/registry/default/blocks/ai/ai-response-actions/components/elements/ai-response-actions",
    description: "Action buttons for AI responses (copy, regenerate, feedback)",
    props:
      "onCopy?: () => void; onRegenerate?: () => void; onFeedback?: (positive: boolean) => void;",
  },
  {
    name: "AiArtifact",
    import:
      "@/registry/default/blocks/ai/ai-artifact/components/elements/ai-artifact",
    description: "Display generated artifacts (code, documents) with preview",
    props:
      "title: string; type?: 'code' | 'document' | 'image'; language?: string; children: ReactNode;",
  },
  {
    name: "AiPlan",
    import: "@/registry/default/blocks/ai/ai-plan/components/elements/ai-plan",
    description: "Display execution plan with steps",
    props:
      "title?: string; children: ReactNode; (use AiPlanStep with title, status, children)",
  },
  {
    name: "AiTaskList",
    import:
      "@/registry/default/blocks/ai/ai-task-list/components/elements/ai-task-list",
    description: "Task list with progress tracking",
    props:
      "children: ReactNode; (use AiTaskListItem with status: 'pending' | 'running' | 'complete' | 'error', filename?, children)",
  },
];

export function generateSystemPrompt(): string {
  const componentDocs = AI_ELEMENTS.map(
    (el) => `### ${el.name}
Import: \`import { ${el.name} } from "${el.import}";\`
Description: ${el.description}
Props: ${el.props}`,
  ).join("\n\n");

  return `You are an expert UI developer specializing in React and the Elements component library.

Your task is to generate React components based on user prompts. You MUST use components from the Elements AI library when appropriate.

## Available Components

${componentDocs}

## Code Generation Rules

1. Always use "use client" directive for interactive components
2. Import components from their exact paths as shown above
3. Use Tailwind CSS for styling
4. Generate complete, working React components
5. Wrap your code in a single default export function
6. Use TypeScript syntax

## Response Format

When generating UI, respond with a code block containing the React component:

\`\`\`tsx
"use client";

import { ComponentName } from "@/registry/default/blocks/ai/...";

export default function GeneratedComponent() {
  return (
    // Your JSX here
  );
}
\`\`\`

Be creative but practical. Generate beautiful, functional UI that demonstrates the power of the Elements library.`;
}
