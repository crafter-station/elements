---
name: ai-elements
description: Install AI UI components from the Elements registry. Use when user needs chat interfaces, agentic UIs (tool calls, reasoning, plans), multi-agent dashboards, or AI devtools. Triggers on "AI component", "chat UI", "agent UI", "tool call component", "streaming text", "agentic", "multi-agent", "AI SDK", "chat input", "message bubble", "thinking indicator".
---

# AI Elements

35 AI UI components across 4 subcategories. Built for Vercel AI SDK patterns.

## Install Pattern

```bash
npx shadcn@latest add @elements/ai-{name}
```

## Chat (11 components)

Conversational UI primitives.

| Component | Install |
|-----------|---------|
| Chat (full) | `@elements/ai-chat` |
| Chat Input | `@elements/ai-chat-input` |
| Message Bubble | `@elements/ai-message-bubble` |
| Messages | `@elements/ai-messages` |
| Model Selector | `@elements/ai-model-selector` |
| Response Actions | `@elements/ai-response-actions` |
| Streaming Text | `@elements/ai-streaming-text` |
| Suggested Actions | `@elements/ai-suggested-actions` |
| Temperature Slider | `@elements/ai-temperature-slider` |
| Thinking Indicator | `@elements/ai-thinking-indicator` |
| Token Counter | `@elements/ai-token-counter` |

## Agentic (8 components)

Tool use, reasoning, and planning UI.

| Component | Install |
|-----------|---------|
| Artifact | `@elements/ai-artifact` |
| Chain of Thought | `@elements/ai-chain-of-thought` |
| Confirmation | `@elements/ai-confirmation` |
| Plan | `@elements/ai-plan` |
| Reasoning | `@elements/ai-reasoning` |
| Sources | `@elements/ai-sources` |
| Task List | `@elements/ai-task-list` |
| Tool Call | `@elements/ai-tool-call` |

## Multi-Agent (8 components)

Agent orchestration and monitoring.

| Component | Install |
|-----------|---------|
| Agent Context | `@elements/ai-agent-context` |
| Agent Roster | `@elements/ai-agent-roster` |
| Agent Status | `@elements/ai-agent-status` |
| Guardrails | `@elements/ai-guardrails` |
| Handoff Chain | `@elements/ai-handoff-chain` |
| Memory Viewer | `@elements/ai-memory-viewer` |
| Pipeline | `@elements/ai-pipeline` |
| Routing Indicator | `@elements/ai-routing-indicator` |

## Devtools (8 components)

AI debugging and inspection.

| Component | Install |
|-----------|---------|
| Conversation Tree | `@elements/ai-conversation-tree` |
| Latency Meter | `@elements/ai-latency-meter` |
| Model Info | `@elements/ai-model-info` |
| Prompt Diff | `@elements/ai-prompt-diff` |
| Request Inspector | `@elements/ai-request-inspector` |
| Stream Debugger | `@elements/ai-stream-debugger` |
| Token Viewer | `@elements/ai-token-viewer` |
| Tool Inspector | `@elements/ai-tool-inspector` |

## Quick Patterns

```bash
# Chat interface
npx shadcn@latest add @elements/ai-chat @elements/ai-chat-input @elements/ai-message-bubble @elements/ai-messages @elements/ai-streaming-text

# Agentic UI
npx shadcn@latest add @elements/ai-tool-call @elements/ai-reasoning @elements/ai-plan @elements/ai-confirmation

# Multi-agent dashboard
npx shadcn@latest add @elements/ai-agent-roster @elements/ai-agent-status @elements/ai-pipeline @elements/ai-handoff-chain

# AI debugging
npx shadcn@latest add @elements/ai-request-inspector @elements/ai-stream-debugger @elements/ai-token-viewer
```

## Discovery

Browse https://tryelements.dev/docs/ai-elements

## Component Not Found?

Generate a pre-filled GitHub issue:
```
https://github.com/crafter-station/elements/issues/new?title=[Component%20Request]%20Add%20AI%20{Name}&labels=enhancement,ai-elements
```
