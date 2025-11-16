import type { Metadata } from "next";
import Link from "next/link";

import { ArrowUpRightIcon } from "lucide-react";

import { ClerkLogo } from "@/components/clerk-logo";
import { Header } from "@/components/header";
import { ScrambleText } from "@/components/scramble-text";
import {
  ThemeAwareBrandText,
  ThemeAwarePattern,
} from "@/components/theme-aware-brand";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Clerk - User Management Suite",
  description:
    "Complete user management components - Auth, Organizations, Billing & more",
};

const BRAND_COLOR = "#6C47FF";

export default function ClerkPage() {
  return (
    <div className="flex flex-col">
      <Header />

      {/* Hero Section */}
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
                  Complete user management suite - Auth, Organizations, Billing
                  & more
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="border-t border-border border-dotted px-4 sm:px-6 md:px-8 py-8 md:py-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Notice */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-1 h-full rounded-full shrink-0 mt-1"
                  style={{ backgroundColor: BRAND_COLOR }}
                />
                <div className="space-y-3">
                  <h2 className="font-semibold text-lg">Building Components</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A complete suite of authentication, organization management,
                    and billing components built with Clerk's powerful React
                    hooks. Featuring sign-in/up flows, user profiles,
                    organization switchers, and seamless integration with your
                    existing UI.
                  </p>
                </div>
              </div>
            </div>

            {/* In the meantime */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base">In the meantime</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="https://clerk.com/docs/components/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <h4 className="font-medium text-sm group-hover:underline underline-offset-4">
                      Prebuilt Components
                    </h4>
                    <ArrowUpRightIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </Link>

                <Link
                  href="https://clerk.com/docs/react/reference/hooks/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <h4 className="font-medium text-sm group-hover:underline underline-offset-4">
                      React Hooks
                    </h4>
                    <ArrowUpRightIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </Link>

                <Link
                  href="https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <h4 className="font-medium text-sm group-hover:underline underline-offset-4">
                      Appearance Prop
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
