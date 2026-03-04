"use client";

import { ClerkSSOCallback } from "@/registry/default/blocks/clerk/clerk-sso-callback/components/elements/clerk-sso-callback";

export default function ClerkSSOCallbackDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center text-sm text-muted-foreground">
        <p className="mb-2 font-medium text-foreground">SSO Callback Handler</p>
        <p>
          Place this component on your{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            /sso-callback
          </code>{" "}
          page to handle OAuth redirects.
        </p>
      </div>
    </div>
  );
}
