"use client";

import { WebhookTester } from "@/registry/default/blocks/devtools/webhook-tester/components/elements/webhook-tester";

export default function WebhookTesterDemo() {
  return (
    <div className="w-full max-w-2xl p-4">
      <WebhookTester
        defaultUrl="https://httpbin.org/post"
        defaultMethod="POST"
        defaultHeaders={{ "Content-Type": "application/json" }}
        defaultBody={JSON.stringify({ message: "Hello, World!" }, null, 2)}
      />
    </div>
  );
}
