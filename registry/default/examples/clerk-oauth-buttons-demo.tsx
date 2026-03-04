"use client";

import { ClerkOauthButtons } from "@/registry/default/blocks/clerk/clerk-oauth-buttons/components/elements/clerk-oauth-buttons";

export default function ClerkOauthButtonsDemo() {
  return (
    <div className="flex items-center justify-center gap-8 p-4">
      <ClerkOauthButtons variant="default" />
      <ClerkOauthButtons variant="icon" layout="horizontal" />
    </div>
  );
}
