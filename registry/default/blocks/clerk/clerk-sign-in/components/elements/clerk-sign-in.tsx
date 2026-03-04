"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { useSignIn } from "@clerk/nextjs";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
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

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
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
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
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
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
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

export interface ClerkSignInProps {
  className?: string;
  showOAuth?: boolean;
  showSeparator?: boolean;
  heading?: string;
  subheading?: string;
  redirectUrl?: string;
  signUpUrl?: string;
  afterSSOUrl?: string;
}

export function ClerkSignIn({
  className,
  showOAuth = true,
  showSeparator = true,
  heading = "Sign in",
  subheading = "Welcome back",
  redirectUrl = "/",
  signUpUrl = "/sign-up",
  afterSSOUrl = "/sso-callback",
}: ClerkSignInProps) {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  const isLoading = fetchStatus === "fetching";

  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleOAuth = useCallback(
    async (strategy: "oauth_google" | "oauth_github" | "oauth_apple") => {
      setError(null);
      const { error } = await signIn.sso({
        strategy,
        redirectUrl,
        redirectCallbackUrl: afterSSOUrl,
      });
      if (error) {
        setError(error.message ?? "OAuth sign in failed.");
      }
    },
    [signIn, afterSSOUrl, redirectUrl],
  );

  const handleEmailSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      setError(null);
      setDirection("forward");
      setStep("password");
      setTimeout(() => passwordInputRef.current?.focus(), 150);
    },
    [email],
  );

  const handlePasswordSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!password.trim()) return;
      setError(null);
      const { error } = await signIn.password({ identifier: email, password });
      if (error) {
        setError(error.message ?? "Sign in failed. Please try again.");
      } else {
        router.push(redirectUrl);
      }
    },
    [email, password, signIn, router, redirectUrl],
  );

  const handleBack = useCallback(() => {
    setDirection("backward");
    setStep("email");
    setPassword("");
    setShowPassword(false);
    setError(null);
  }, []);

  return (
    <div
      data-slot="clerk-sign-in"
      className={cn(
        "w-full max-w-sm rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div data-slot="header" className="px-8 pt-8 pb-2">
        <h1
          data-slot="heading"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          {heading}
        </h1>
        <p
          data-slot="subheading"
          className="mt-1 text-sm text-muted-foreground"
        >
          {subheading}
        </p>
      </div>

      <div data-slot="body" className="px-8 pb-8 pt-4">
        {showOAuth && step === "email" && (
          <div data-slot="oauth-providers" className="flex flex-col gap-2">
            <button
              type="button"
              data-slot="oauth-button"
              onClick={() => handleOAuth("oauth_google")}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <GoogleIcon className="h-4 w-4" />
              Continue with Google
            </button>
            <button
              type="button"
              data-slot="oauth-button"
              onClick={() => handleOAuth("oauth_github")}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <GitHubIcon className="h-4 w-4" />
              Continue with GitHub
            </button>
            <button
              type="button"
              data-slot="oauth-button"
              onClick={() => handleOAuth("oauth_apple")}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <AppleIcon className="h-4 w-4" />
              Continue with Apple
            </button>
          </div>
        )}

        {showOAuth && showSeparator && step === "email" && (
          <div data-slot="separator" className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              or
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
        )}

        {error && (
          <div
            data-slot="error"
            className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <div data-slot="form-container" className="relative overflow-hidden">
          <div
            data-slot="step-email"
            className={cn(
              "transition-all duration-200 ease-in-out",
              step === "email"
                ? "translate-x-0 opacity-100"
                : direction === "forward"
                  ? "-translate-x-full opacity-0 pointer-events-none absolute inset-0"
                  : "translate-x-full opacity-0 pointer-events-none absolute inset-0",
            )}
          >
            <form onSubmit={handleEmailSubmit}>
              <div data-slot="field" className="flex flex-col gap-1.5">
                <label
                  htmlFor="clerk-sign-in-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="clerk-sign-in-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 pl-9 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                </div>
              </div>

              <button
                type="submit"
                data-slot="continue-button"
                disabled={!email.trim()}
                className={cn(
                  "mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors",
                  email.trim()
                    ? "hover:bg-primary/90"
                    : "cursor-not-allowed opacity-50",
                )}
              >
                Continue
              </button>
            </form>
          </div>

          <div
            data-slot="step-password"
            className={cn(
              "transition-all duration-200 ease-in-out",
              step === "password"
                ? "translate-x-0 opacity-100"
                : direction === "forward"
                  ? "translate-x-full opacity-0 pointer-events-none absolute inset-0"
                  : "-translate-x-full opacity-0 pointer-events-none absolute inset-0",
            )}
          >
            <form onSubmit={handlePasswordSubmit}>
              <button
                type="button"
                onClick={handleBack}
                data-slot="back-button"
                className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeftIcon className="h-3.5 w-3.5" />
                Back
              </button>

              <div
                data-slot="user-preview"
                className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-accent/50 px-3 py-2"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {email.charAt(0).toUpperCase()}
                </div>
                <span className="truncate text-sm text-foreground">
                  {email}
                </span>
              </div>

              <div data-slot="field" className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="clerk-sign-in-password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    data-slot="forgot-password"
                    className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    ref={passwordInputRef}
                    id="clerk-sign-in-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-9 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    data-slot="toggle-password"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                data-slot="submit-button"
                disabled={!password.trim() || isLoading}
                className={cn(
                  "mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors",
                  password.trim() && !isLoading
                    ? "hover:bg-primary/90"
                    : "cursor-not-allowed opacity-50",
                )}
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="h-4 w-4" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div data-slot="footer" className="border-t border-border px-8 py-4">
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a
            href={signUpUrl}
            data-slot="sign-up-link"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
