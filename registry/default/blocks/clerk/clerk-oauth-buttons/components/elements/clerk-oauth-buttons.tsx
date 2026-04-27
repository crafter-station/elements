"use client";

import type * as React from "react";
import { useState } from "react";

import { useClerk, useSignIn } from "@clerk/nextjs";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function LoaderIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022" />
      <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00" />
      <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
      <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" />
    </svg>
  );
}

type Provider = "google" | "github" | "apple" | "microsoft";
type Variant = "default" | "outline" | "icon";
type Size = "sm" | "default" | "lg";

const providerConfig: Record<
  Provider,
  { label: string; icon: (props: { className?: string }) => React.ReactNode }
> = {
  google: { label: "Google", icon: GoogleLogo },
  github: { label: "GitHub", icon: GitHubLogo },
  apple: { label: "Apple", icon: AppleLogo },
  microsoft: { label: "Microsoft", icon: MicrosoftLogo },
};

const oauthStrategyMap = {
  google: "oauth_google",
  github: "oauth_github",
  apple: "oauth_apple",
  microsoft: "oauth_microsoft",
} as const;

const sizeClasses: Record<
  Size,
  { button: string; icon: string; iconOnly: string }
> = {
  sm: { button: "h-9 px-3 text-sm gap-2", icon: "size-4", iconOnly: "size-9" },
  default: {
    button: "h-10 px-4 text-sm gap-2.5",
    icon: "size-5",
    iconOnly: "size-10",
  },
  lg: {
    button: "h-11 px-5 text-base gap-3",
    icon: "size-5",
    iconOnly: "size-11",
  },
};

export interface ClerkOauthButtonsProps {
  className?: string;
  providers?: Provider[];
  variant?: Variant;
  layout?: "horizontal" | "vertical";
  size?: Size;
  redirectUrl?: string;
  afterSSOUrl?: string;
}

export function ClerkOauthButtons({
  className,
  providers = ["google", "github", "apple", "microsoft"],
  variant = "default",
  layout = "vertical",
  size = "default",
  redirectUrl = "/",
  afterSSOUrl = "/sso-callback",
}: ClerkOauthButtonsProps) {
  const { signIn } = useSignIn();
  const clerk = useClerk();
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const sizeConfig = sizeClasses[size];

  // biome-ignore lint/suspicious/noExplicitAny: accessing clerk environment internals for social provider detection
  const socialStrategies: string[] | undefined = (clerk as any).clerkjs
    ?.environment?.userSettings?.socialProviderStrategies;
  const enabledProviders = socialStrategies
    ? providers.filter((provider) =>
        socialStrategies.includes(oauthStrategyMap[provider]),
      )
    : undefined;

  const handleOAuth = async (provider: Provider) => {
    setLoadingProvider(provider);
    const strategy = oauthStrategyMap[provider];
    const { error } = await signIn.sso({
      strategy,
      redirectUrl,
      redirectCallbackUrl: afterSSOUrl,
    });
    if (error) {
      setLoadingProvider(null);
    }
  };

  if (!enabledProviders) {
    return (
      <div
        data-slot="clerk-oauth-buttons"
        className={cn(
          "flex w-full gap-2",
          layout === "vertical" && "flex-col",
          layout === "horizontal" &&
            variant === "icon" &&
            "flex-row justify-center",
          layout === "horizontal" &&
            variant !== "icon" &&
            "flex-col sm:flex-row",
          className,
        )}
      >
        {providers.map((provider) => (
          <div
            key={provider}
            className={cn(
              "animate-pulse rounded-lg bg-muted",
              variant === "icon" ? sizeConfig.iconOnly : "h-10 w-full",
            )}
          />
        ))}
      </div>
    );
  }

  if (enabledProviders.length === 0) return null;

  return (
    <div
      data-slot="clerk-oauth-buttons"
      className={cn(
        "flex w-full gap-2",
        layout === "vertical" && "flex-col",
        layout === "horizontal" &&
          variant === "icon" &&
          "flex-row justify-center",
        layout === "horizontal" && variant !== "icon" && "flex-col sm:flex-row",
        className,
      )}
    >
      {enabledProviders.map((provider) => {
        const config = providerConfig[provider];
        const Icon = config.icon;
        const isLoading = loadingProvider === provider;
        const isDisabled = loadingProvider !== null && !isLoading;

        if (variant === "icon") {
          return (
            <button
              key={provider}
              data-slot="clerk-oauth-button"
              data-provider={provider}
              type="button"
              disabled={isDisabled}
              onClick={() => handleOAuth(provider)}
              className={cn(
                "inline-flex items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                sizeConfig.iconOnly,
              )}
            >
              {isLoading ? (
                <LoaderIcon className={sizeConfig.icon} />
              ) : (
                <Icon className={sizeConfig.icon} />
              )}
            </button>
          );
        }

        return (
          <button
            key={provider}
            data-slot="clerk-oauth-button"
            data-provider={provider}
            type="button"
            disabled={isDisabled}
            onClick={() => handleOAuth(provider)}
            className={cn(
              "inline-flex w-full items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              sizeConfig.button,
              variant === "default" &&
                "border border-border bg-card text-foreground hover:bg-accent",
              variant === "outline" &&
                "border-2 border-border bg-transparent text-foreground hover:bg-accent",
            )}
          >
            {isLoading ? (
              <LoaderIcon className={sizeConfig.icon} />
            ) : (
              <Icon className={sizeConfig.icon} />
            )}
            Continue with {config.label}
          </button>
        );
      })}
    </div>
  );
}
