"use client";

import {
  AiGuardrails,
  AiGuardrailsContent,
  AiGuardrailsHeader,
  type GuardrailCheck,
} from "@/registry/default/blocks/ai/ai-guardrails/components/elements/ai-guardrails";

const checks: GuardrailCheck[] = [
  {
    id: "pii-detection",
    type: "output",
    status: "approved",
    category: "PII Detection",
    reason: "No personally identifiable information found",
    confidence: 0.98,
  },
  {
    id: "toxicity-filter",
    type: "output",
    status: "approved",
    category: "Toxicity Filter",
    reason: "Content is appropriate and non-toxic",
    confidence: 0.95,
  },
  {
    id: "factual-accuracy",
    type: "output",
    status: "modified",
    category: "Factual Accuracy",
    reason:
      "Some claims could not be verified - 2 statements require source verification",
    confidence: 0.72,
  },
  {
    id: "prompt-injection",
    type: "input",
    status: "approved",
    category: "Prompt Injection",
    reason: "No injection attempts detected",
    confidence: 0.99,
  },
  {
    id: "output-length",
    type: "output",
    status: "approved",
    category: "Output Length",
    reason: "Response within token limits",
    confidence: 1.0,
  },
  {
    id: "pii-redaction",
    type: "output",
    status: "modified",
    category: "PII Redaction",
    reason: "Sensitive information was automatically redacted",
    originalContent:
      "The CEO's email is john@company.com and his SSN is 123-45-6789",
    modifiedContent: "The CEO's email is [REDACTED] and his SSN is [REDACTED]",
    confidence: 0.97,
  },
];

export default function AiGuardrailsDemo() {
  return (
    <AiGuardrails checks={checks} className="w-full max-w-xl">
      <AiGuardrailsHeader>Content Safety</AiGuardrailsHeader>
      <AiGuardrailsContent />
    </AiGuardrails>
  );
}
