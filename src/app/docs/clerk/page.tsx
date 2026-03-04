import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRight, ArrowUpRightIcon } from "lucide-react";

import { getComponentsByProvider } from "@/lib/registry-loader";

import { ClerkLogo } from "@/components/clerk-logo";
import { Header } from "@/components/header";
import { ScrambleText } from "@/components/scramble-text";
import {
  ThemeAwareBrandText,
  ThemeAwarePattern,
} from "@/components/theme-aware-brand";

export const metadata: Metadata = {
  title: "Clerk - User Management Suite",
  description:
    "Authentication and user management components built for Clerk Core 3",
};

const BRAND_COLOR = "#6C47FF";

const COMPONENT_DESCRIPTIONS: Record<string, string> = {
  "clerk-sign-in":
    "Multi-step sign-in form with email/password and social OAuth buttons",
  "clerk-sign-up": "Sign-up form with email verification via 6-digit OTP input",
  "clerk-waitlist":
    "Waitlist signup with animated success state and queue position",
  "clerk-oauth-buttons":
    "Social login buttons with Google, GitHub, Apple, Microsoft",
  "clerk-user-button":
    "User avatar dropdown with profile, settings, and sign-out",
  "clerk-org-switcher":
    "Organization switcher with role badges and personal account",
};

export default function ClerkPage() {
  const components = getComponentsByProvider("clerk");

  return (
    <div className="flex flex-col">
      <Header />

      <div className="w-full border-border border-dotted sm:border-x mx-auto">
        <div className="relative overflow-hidden">
          <ThemeAwarePattern brandColor={BRAND_COLOR} />

          <div className="relative z-10 w-full py-8 md:py-12 px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 md:space-y-6">
              <div className="space-y-3 md:space-y-4">
                <ThemeAwareBrandText brandColor={BRAND_COLOR}>
                  <span className="font-mono text-xs sm:text-sm">
                    [ USER MGMT ]
                  </span>
                </ThemeAwareBrandText>
                <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
                    <ClerkLogo className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h1 className="font-dotted font-black text-2xl sm:text-3xl md:text-4xl leading-tight">
                    <ScrambleText text="Clerk" />
                  </h1>
                </div>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Authentication and user management components built for Clerk
                  Core 3
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border border-dotted px-4 sm:px-6 md:px-8 py-8 md:py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">
                Components ({components.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {components.map((component) => (
                  <Link
                    key={component.name}
                    href={`/docs/clerk/${component.name}`}
                    className="group rounded-lg border border-border bg-card p-4 hover:bg-accent/50 hover:border-primary/30 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">
                          {component.title}
                        </h3>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {COMPONENT_DESCRIPTIONS[component.name] ||
                          component.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-base">Resources</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="https://clerk.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <h4 className="font-medium text-sm group-hover:underline underline-offset-4">
                      Documentation
                    </h4>
                    <ArrowUpRightIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </Link>

                <Link
                  href="https://clerk.com/docs/guides/development/custom-flows/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <h4 className="font-medium text-sm group-hover:underline underline-offset-4">
                      Custom Flows
                    </h4>
                    <ArrowUpRightIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </Link>

                <Link
                  href="https://dashboard.clerk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <h4 className="font-medium text-sm group-hover:underline underline-offset-4">
                      Dashboard
                    </h4>
                    <ArrowUpRightIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
