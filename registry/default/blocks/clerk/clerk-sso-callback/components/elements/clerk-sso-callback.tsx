"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export interface ClerkSSOCallbackProps {
  signInFallbackRedirectUrl?: string;
  signUpFallbackRedirectUrl?: string;
}

export function ClerkSSOCallback({
  signInFallbackRedirectUrl = "/",
  signUpFallbackRedirectUrl = "/",
}: ClerkSSOCallbackProps) {
  return (
    <AuthenticateWithRedirectCallback
      signInFallbackRedirectUrl={signInFallbackRedirectUrl}
      signUpFallbackRedirectUrl={signUpFallbackRedirectUrl}
    />
  );
}
