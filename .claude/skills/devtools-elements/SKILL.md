---
name: devtools-elements
description: Install developer tool components from the Elements registry. Use when user needs JSON viewers, API response displays, code diff viewers, CLI output renderers, env editors, error boundaries, webhook testers, or schema viewers. Triggers on "devtools", "json viewer", "API response", "webhook tester", "env editor", "code diff", "schema viewer", "error boundary", "CLI output".
---

# Dev Tools Elements

8 developer utility components. Zero external dependencies.

## Install Pattern

```bash
npx shadcn@latest add @elements/{name}
```

## Components

| Component | Install | Description |
|-----------|---------|-------------|
| JSON Viewer | `@elements/json-viewer` | Collapsible JSON tree with search |
| API Response Viewer | `@elements/api-response-viewer` | HTTP response with status, headers, body |
| Code Diff Viewer | `@elements/code-diff-viewer` | Side-by-side or inline diff |
| CLI Output | `@elements/cli-output` | Terminal-like output renderer |
| Env Editor | `@elements/env-editor` | Environment variable editor |
| Error Boundary UI | `@elements/error-boundary-ui` | Error boundary with stack trace |
| Webhook Tester | `@elements/webhook-tester` | Webhook request/response tester |
| Schema Viewer | `@elements/schema-viewer` | JSON Schema / OpenAPI renderer |

## Quick Patterns

```bash
# API debugging
npx shadcn@latest add @elements/api-response-viewer @elements/json-viewer

# Dev dashboard
npx shadcn@latest add @elements/env-editor @elements/webhook-tester @elements/cli-output

# Error handling
npx shadcn@latest add @elements/error-boundary-ui

# All dev tools
npx shadcn@latest add @elements/json-viewer @elements/api-response-viewer @elements/code-diff-viewer @elements/cli-output @elements/env-editor @elements/error-boundary-ui @elements/webhook-tester @elements/schema-viewer
```

## Discovery

Browse https://tryelements.dev/docs/devtools
