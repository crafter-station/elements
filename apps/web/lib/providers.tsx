/**
 * Auto-generated provider data from registry
 * Replaces hardcoded provider definitions
 */

import { getProviderMetadata, getProviders } from "@/lib/registry-loader";

// Import pixelart icons
import { ClerkLogo } from "@/components/clerk-logo";
import { GroupIcon } from "@/components/icons/group";
import { MoonIcon } from "@/components/icons/moon";
import { TriggerIcon } from "@/components/icons/trigger";
import { UploadThingLogo } from "@/components/icons/upload-thing";
// Import logo components from registry
import { BetterAuthLogo } from "@/components/ui/logos/better-auth";
import { PolarLogo } from "@/components/ui/logos/polar";
import { ResendLogo } from "@/components/ui/logos/resend";
import { StripeLogo } from "@/components/ui/logos/stripe";
import { SupabaseLogo } from "@/components/ui/logos/supabase";
import { UpstashLogo } from "@/components/ui/logos/upstash";
import { VercelLogo } from "@/components/ui/logos/vercel";

export interface Provider {
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  brandColor: string;
  isEnabled: boolean;
  href: string;
  elementsCount: number;
  providerLink?: string;
}

/**
 * Get all providers with their metadata
 * This is auto-generated from the registry + manual coming soon providers
 */
export function getProvidersData(): Provider[] {
  const registryProviderNames = getProviders();

  // Provider-specific configuration including coming soon providers
  const providerConfig: Record<
    string,
    {
      providerLink?: string;
      isEnabled: boolean;
      displayName?: string;
      description?: string;
      category?: string;
      brandColor?: string;
    }
  > = {
    clerk: {
      providerLink: "https://clerk.com",
      isEnabled: true,
    },
    polar: {
      providerLink: "https://polar.sh",
      isEnabled: true,
    },
    uploadthing: {
      providerLink: "https://uploadthing.com",
      isEnabled: true,
    },
    logos: {
      isEnabled: true,
    },
    theme: {
      isEnabled: true,
    },
    vercel: {
      providerLink: "https://vercel.com/ai",
      isEnabled: false,
      displayName: "Vercel AI",
      description:
        "AI-powered components and templates for modern web applications",
      category: "AI & Infrastructure",
      brandColor: "#000000",
    },
    trigger: {
      providerLink: "https://trigger.dev",
      isEnabled: false,
      displayName: "Trigger.dev",
      description:
        "Background jobs and scheduled tasks with a developer-first API",
      category: "Jobs & Tasks",
      brandColor: "#6366f1",
    },
    upstash: {
      providerLink: "https://upstash.com",
      isEnabled: false,
      displayName: "Upstash",
      description: "Serverless Redis, Kafka, and QStash for edge computing",
      category: "Database & Cache",
      brandColor: "#00e9a3",
    },
    supabase: {
      providerLink: "https://supabase.com",
      isEnabled: false,
      displayName: "Supabase",
      description: "Open source Firebase alternative with Postgres database",
      category: "Database & Backend",
      brandColor: "#3ecf8e",
    },
    "better-auth": {
      providerLink: "https://better-auth.com",
      isEnabled: false,
      displayName: "Better Auth",
      description: "Modern authentication library for web applications",
      category: "Authentication",
      brandColor: "#f59e0b",
    },
    resend: {
      providerLink: "https://resend.com",
      isEnabled: false,
      displayName: "Resend",
      description: "Email API for developers with modern DX",
      category: "Communication",
      brandColor: "#000000",
    },
    stripe: {
      providerLink: "https://stripe.com",
      isEnabled: false,
      displayName: "Stripe",
      description: "Payment processing and subscription management",
      category: "Payments",
      brandColor: "#635bff",
    },
  };

  // Get all provider names (registry + coming soon)
  const allProviderNames = [
    ...new Set([...registryProviderNames, ...Object.keys(providerConfig)]),
  ];

  return allProviderNames.map((providerName) => {
    const config = providerConfig[providerName] || { isEnabled: false };

    // Get metadata from registry if available, otherwise use manual config
    const metadata = registryProviderNames.includes(providerName)
      ? getProviderMetadata(providerName)
      : {
          displayName: config.displayName || providerName,
          description: config.description || "Coming soon",
          category: config.category || "Other",
          brandColor: config.brandColor || "#6366f1",
          componentCount: 0,
          name: providerName,
        };

    return {
      name: metadata.displayName,
      description: metadata.description,
      icon: <ProviderIcon provider={providerName} />,
      category: metadata.category,
      brandColor: metadata.brandColor,
      isEnabled: config.isEnabled,
      href: `/docs/${providerName}`,
      elementsCount: metadata.componentCount,
      providerLink: config.providerLink,
    };
  });
}

// Legacy export for backward compatibility
export const providers = getProvidersData();

/**
 * Provider icon component
 * Uses real logo components from the registry
 */
export function ProviderIcon({ provider }: { provider: string }) {
  const icons: Record<string, React.ReactNode> = {
    // Real logos from registry
    clerk: <ClerkLogo className="w-6 h-6" />,
    polar: <PolarLogo className="w-6 h-6" />,
    uploadthing: <UploadThingLogo className="w-6 h-6" />,
    vercel: <VercelLogo className="w-6 h-6" />,
    trigger: <TriggerIcon className="w-6 h-6" />,
    upstash: <UpstashLogo className="w-6 h-6" />,
    supabase: <SupabaseLogo className="w-6 h-6" />,
    stripe: <StripeLogo className="w-6 h-6" />,
    resend: <ResendLogo className="w-6 h-6" />,
    "better-auth": <BetterAuthLogo className="w-6 h-6" />,

    // Pixelart icons for special categories
    logos: <GroupIcon className="w-6 h-6" />,
    theme: <MoonIcon className="w-6 h-6" />,
  };

  return (
    icons[provider] || (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <title>Default Icon</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    )
  );
}
