"use client";

import { ClerkUserButton } from "@/registry/default/blocks/clerk/clerk-user-button/components/elements/clerk-user-button";

export default function ClerkUserButtonDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <ClerkUserButton name="Railly Hugo" email="railly@crafterstation.com" />
    </div>
  );
}
