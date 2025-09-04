"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useClerk, useSignIn, useUser } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import type { OAuthStrategy } from "@clerk/types";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";

import { ClerkLogo } from "@/components/clerk-logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppleLogo } from "@/components/ui/logos/apple";
import { DiscordLogo } from "@/components/ui/logos/discord";
import { GitHubLogo } from "@/components/ui/logos/github";
import { GitLabLogo } from "@/components/ui/logos/gitlab";
import { GoogleLogo } from "@/components/ui/logos/google";
import { LinearLogo } from "@/components/ui/logos/linear";
import { MicrosoftLogo } from "@/components/ui/logos/microsoft";
import { NotionLogo } from "@/components/ui/logos/notion";
import { SlackLogo } from "@/components/ui/logos/slack";
import { SpotifyLogo } from "@/components/ui/logos/spotify";
import { TwitchLogo } from "@/components/ui/logos/twitch";
import { TwitterLogo } from "@/components/ui/logos/twitter";

interface SignInState {
  step: "form" | "mfa";
  mfaFactors?: { strategy: "phone_code" | "totp" | "backup_code" }[];
}

export function ClerkSignInElement() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useUser();
  const clerk = useClerk();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [state, setState] = useState<SignInState>({ step: "form" });
  const [mfaCode, setMfaCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (isLoaded && signIn && !signIn.id && !hasInitialized && !isSignedIn) {
      setHasInitialized(true);
      signIn.create({}).catch((err) => {
        // Silently handle initialization errors when already signed in
        if (!err?.errors?.[0]?.message?.includes("already signed in")) {
          console.error("Failed to initialize signIn:", err);
        }
      });
    }
  }, [isLoaded, signIn, hasInitialized, isSignedIn]);

  const socialProviders = useMemo(() => {
    if (!signIn?.supportedFirstFactors) return [];
    return signIn.supportedFirstFactors.filter((factor) =>
      factor.strategy.startsWith("oauth_"),
    );
  }, [signIn?.supportedFirstFactors]);

  const supportedIdentifiers = useMemo(() => {
    if (!signIn?.supportedIdentifiers) return [];
    return signIn.supportedIdentifiers;
  }, [signIn?.supportedIdentifiers]);

  const getIdentifierType = () => {
    if (
      supportedIdentifiers.includes("email_address") &&
      supportedIdentifiers.includes("username")
    ) {
      return "email_or_username";
    }
    if (supportedIdentifiers.includes("email_address")) {
      return "email";
    }
    if (supportedIdentifiers.includes("username")) {
      return "username";
    }
    return "email";
  };

  const getIdentifierLabel = () => {
    const type = getIdentifierType();
    switch (type) {
      case "email_or_username":
        return "Email or username";
      case "username":
        return "Username";
      default:
        return "Email";
    }
  };

  const getIdentifierPlaceholder = () => {
    const type = getIdentifierType();
    switch (type) {
      case "email_or_username":
        return "you@company.com or username";
      case "username":
        return "username";
      default:
        return "you@company.com";
    }
  };

  const getIdentifierInputType = () => {
    const type = getIdentifierType();
    return type === "email" ? "email" : "text";
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn || !mfaCode) return;

    setIsLoading(true);
    setError("");

    try {
      // Use the first available MFA factor (could be TOTP, SMS, etc.)
      const mfaFactor = state.mfaFactors?.[0];
      if (!mfaFactor) {
        setError("No MFA factors available");
        return;
      }

      const result = await signIn.attemptSecondFactor({
        strategy: mfaFactor.strategy,
        code: mfaCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/0-dashboard");
      } else {
        setError(`MFA verification incomplete: ${result.status}`);
      }
    } catch (err) {
      let displayError = "Invalid MFA code";
      if (isClerkAPIResponseError(err)) {
        const clerkError = err.errors[0];
        displayError =
          clerkError.longMessage || clerkError.message || "Invalid MFA code";
      }
      setError(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: identifier,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // Note: Session tasks should be checked after setActive completes
        // For now, we redirect to dashboard and let the app handle session tasks
        router.push("/0-dashboard");
      } else if (result.status === "needs_second_factor") {
        setState({
          step: "mfa",
          mfaFactors: result.supportedSecondFactors || [],
        });
        setIsLoading(false);
        return;
      } else {
        // Handle other incomplete statuses
        setError(`Sign-in incomplete: ${result.status}`);
      }
    } catch (err) {
      let displayError = "Failed to sign in";

      if (isClerkAPIResponseError(err)) {
        const clerkError = err.errors[0];

        switch (clerkError.code) {
          case "user_locked": {
            const lockoutSeconds =
              (clerkError.meta as Record<string, number>)
                .lockout_expires_in_seconds || 1800;
            const unlockTime = new Date(Date.now() + lockoutSeconds * 1000);
            displayError = `Account locked. Try again at ${unlockTime.toLocaleTimeString()}`;
            break;
          }
          case "too_many_requests":
            displayError =
              "Too many attempts. Please wait a moment and try again.";
            break;
          default:
            displayError =
              clerkError.longMessage ||
              clerkError.message ||
              "Failed to sign in";
        }
      } else {
        displayError = err instanceof Error ? err.message : "Failed to sign in";
      }

      setError(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    if (!isLoaded || !signIn) return;

    setError("");
    setIsLoading(true);

    try {
      await signIn.authenticateWithRedirect({
        strategy: provider as OAuthStrategy,
        redirectUrl: "/0-sso-callback",
        redirectUrlComplete: "/0-dashboard",
      });
    } catch (err) {
      let errorMessage = `Failed to sign in with ${provider.replace("oauth_", "")}`;

      if (isClerkAPIResponseError(err)) {
        const clerkError = err.errors[0];
        errorMessage =
          clerkError.longMessage || clerkError.message || errorMessage;
      } else {
        errorMessage = err instanceof Error ? err.message : errorMessage;
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const getSocialIcon = (provider: string) => {
    switch (provider) {
      case "oauth_github":
        return <GitHubLogo className="w-4 h-4" />;
      case "oauth_google":
        return <GoogleLogo className="w-4 h-4" />;
      case "oauth_apple":
        return <AppleLogo className="w-4 h-4" />;
      case "oauth_linear":
        return <LinearLogo className="w-4 h-4" />;
      case "oauth_microsoft":
        return <MicrosoftLogo className="w-4 h-4" />;
      case "oauth_spotify":
        return <SpotifyLogo className="w-4 h-4" />;
      case "oauth_slack":
        return <SlackLogo className="w-4 h-4" />;
      case "oauth_twitch":
        return <TwitchLogo className="w-4 h-4" />;
      case "oauth_twitter":
      case "oauth_x":
        return <TwitterLogo className="w-4 h-4" />;
      case "oauth_gitlab":
        return <GitLabLogo className="w-4 h-4" />;
      case "oauth_discord":
        return <DiscordLogo className="w-4 h-4" />;
      case "oauth_notion":
        return <NotionLogo className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getProviderLabel = (provider: string) => {
    return (
      provider.replace("oauth_", "").charAt(0).toUpperCase() +
      provider.replace("oauth_", "").slice(1)
    );
  };

  // Show message if already signed in (for showcase purposes)
  if (isLoaded && isSignedIn) {
    return (
      <div className="w-full max-w-sm mx-auto p-6 border border-border rounded-lg bg-card">
        <div className="space-y-4">
          <div className="text-center">
            <ClerkLogo className="w-8 h-8 mx-auto mb-2" />
            <h2 className="text-lg font-semibold">Already Signed In</h2>
            <p className="text-sm text-muted-foreground">
              You're currently signed in as {identifier || "a user"}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => router.push("/0-dashboard")}
              className="flex-1"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await clerk.signOut();
                window.location.reload();
              }}
              className="flex-1"
            >
              Sign Out & Try
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full max-w-sm mx-auto p-6 border border-border rounded-lg bg-card">
        <div className="flex items-center justify-center py-8">
          <LoaderIcon className="w-6 h-6 animate-spin" />
        </div>
      </div>
    );
  }

  // MFA Step
  if (state.step === "mfa") {
    return (
      <div className="w-full max-w-sm mx-auto p-6 border border-border rounded-lg bg-card">
        <div className="space-y-4">
          <div className="text-center">
            <ClerkLogo className="w-8 h-8 mx-auto mb-2" />
            <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
            <p className="text-sm text-muted-foreground">
              Enter your authentication code
            </p>
          </div>

          <form onSubmit={handleMfaSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="mfa-code" className="text-sm font-medium">
                Authentication Code
              </Label>
              <Input
                id="mfa-code"
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="000000"
                required
                disabled={isLoading}
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || mfaCode.length < 6}
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                setState({ step: "form" });
                setMfaCode("");
                setError("");
              }}
              disabled={isLoading}
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full max-w-sm mx-auto p-6 border border-border rounded-lg bg-card">
        <div className="space-y-4">
          <div className="text-center">
            <ClerkLogo className="w-8 h-8 mx-auto mb-2" />
            <h2 className="text-lg font-semibold">Sign in</h2>
            <p className="text-sm text-muted-foreground">Welcome back</p>
          </div>

          {socialProviders.length > 0 && (
            <div className="space-y-3">
              {socialProviders.map((provider) => (
                <Button
                  key={provider.strategy}
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialSignIn(provider.strategy)}
                  disabled={isLoading}
                >
                  {getSocialIcon(provider.strategy)}
                  <span className="ml-2">
                    Continue with {getProviderLabel(provider.strategy)}
                  </span>
                </Button>
              ))}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-sm font-medium">
                {getIdentifierLabel()}
              </Label>
              <Input
                id="identifier"
                type={getIdentifierInputType()}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={getIdentifierPlaceholder()}
                required
                disabled={isLoading}
                autoComplete={
                  getIdentifierType() === "email" ? "email" : "username"
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <EyeIcon className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() =>
                signIn?.create({
                  strategy: "reset_password_email_code",
                  identifier: identifier,
                })
              }
              disabled={!identifier || isLoading}
            >
              Forgot your password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
