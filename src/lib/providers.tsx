/**
 * Auto-generated provider data from registry
 * Replaces hardcoded provider definitions
 */

import { Sparkles } from "lucide-react";

import { getProviderMetadata, getProviders } from "@/lib/registry-loader";

import { ClerkLogo } from "@/components/clerk-logo";
// Import pixelart icons
import { GitHubIcon } from "@/components/icons/github";
import { GroupIcon } from "@/components/icons/group";
import { MoonIcon } from "@/components/icons/moon";
import { TriggerIcon } from "@/components/icons/trigger";
import { UploadThingLogo } from "@/components/icons/upload-thing";
import TinteLogo from "@/components/tinte-logo";
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
  status?: "building" | "ready" | "beta";
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
      status?: "building" | "ready" | "beta";
    }
  > = {
    clerk: {
      providerLink: "https://clerk.com",
      isEnabled: true,
      status: "building" as const,
      displayName: "Clerk",
      description:
        "Complete user management suite with auth, organizations, and billing components",
      category: "User Management",
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
    tinte: {
      isEnabled: true,
      description:
        "AI-powered theme generator for VS Code, shadcn/ui, terminals and more",
      category: "Theming",
    },
    github: {
      providerLink: "https://github.com",
      isEnabled: true,
      displayName: "GitHub",
      description: "Display GitHub repository statistics with visual charts",
      category: "Integration",
    },
    devtools: {
      isEnabled: true,
      displayName: "Dev Tools",
      description: "Developer utilities for auditing and debugging your app",
      category: "Dev Tools",
      status: "beta",
    },
    "ai-elements": {
      isEnabled: true,
      displayName: "AI Elements",
      description:
        "Building blocks for AI-powered applications with Vercel AI SDK",
      category: "AI",
      status: "beta",
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
      name: config.displayName || metadata.displayName,
      description: config.description || metadata.description,
      icon: <ProviderIcon provider={providerName} />,
      category: config.category || metadata.category,
      brandColor: metadata.brandColor,
      isEnabled: config.isEnabled,
      href: `/docs/${providerName}`,
      elementsCount: metadata.componentCount,
      providerLink: config.providerLink,
      status: config.status,
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
    clerk: <ClerkLogo className="w-10 h-10" />,
    polar: <PolarLogo className="w-10 h-10" />,
    uploadthing: <UploadThingLogo className="w-10 h-10" />,
    vercel: <VercelLogo className="w-10 h-10" />,
    trigger: <TriggerIcon className="w-10 h-10" />,
    upstash: <UpstashLogo className="w-10 h-10" />,
    supabase: <SupabaseLogo className="w-10 h-10" />,
    stripe: <StripeLogo className="w-10 h-10" />,
    resend: <ResendLogo className="w-10 h-10" />,
    "better-auth": <BetterAuthLogo className="w-10 h-10" />,

    // Pixelart icons for special categories
    logos: <GroupIcon className="w-10 h-10" />,
    theme: <MoonIcon className="w-10 h-10" />,
    tinte: <TinteLogo size={40} />,
    github: <GitHubIcon className="w-10 h-10" />,
    "ai-elements": <Sparkles className="w-10 h-10" />,
    devtools: (
      <svg
        className="w-10 h-10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Dev Tools</title>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
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
