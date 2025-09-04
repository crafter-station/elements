"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useClerk, useSignIn, useSignUp, useUser } from "@clerk/nextjs";
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

interface SignUpState {
  isLoading?: boolean;
  error?: string;
  step?: "form" | "verify";
}

export function ClerkSignUpElement() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const { isSignedIn } = useUser();
  const clerk = useClerk();
  const [state, setState] = useState<SignUpState>({ step: "form" });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasSignUpInitialized, setHasSignUpInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(
        () => setState((prev) => ({ ...prev, error: undefined })),
        5000,
      );
      return () => clearTimeout(timer);
    }
  }, [state.error]);

  useEffect(() => {
    if (
      isLoaded &&
      signIn &&
      !signIn.id &&
      !signIn.supportedFirstFactors &&
      !hasInitialized &&
      !isSignedIn
    ) {
      setHasInitialized(true);
      signIn.create({}).catch((err) => {
        // Silently handle initialization errors when already signed in
        if (!err?.errors?.[0]?.message?.includes("already signed in")) {
          console.error("Failed to initialize signIn:", err);
        }
      });
    }
  }, [isLoaded, signIn, hasInitialized, isSignedIn]);

  useEffect(() => {
    if (
      isLoaded &&
      signUp &&
      !signUp.id &&
      (!signUp.requiredFields || signUp.requiredFields.length === 0) &&
      !hasSignUpInitialized &&
      !isSignedIn
    ) {
      setHasSignUpInitialized(true);
      signUp.create({}).catch((err) => {
        // Silently handle initialization errors when already signed in
        if (!err?.errors?.[0]?.message?.includes("already signed in")) {
          console.error("Failed to initialize signUp:", err);
        }
      });
    }
  }, [isLoaded, signUp, hasSignUpInitialized, isSignedIn]);

  const socialProviders = useMemo(() => {
    if (!signIn?.supportedFirstFactors) return [];
    return signIn.supportedFirstFactors.filter((factor) =>
      factor.strategy.startsWith("oauth_"),
    );
  }, [signIn?.supportedFirstFactors]);

  const requiredFields = useMemo(() => {
    if (!signUp?.requiredFields) return [];
    return signUp.requiredFields as string[];
  }, [signUp?.requiredFields]);

  const isFieldRequired = (field: string) => {
    return requiredFields.includes(field);
  };

  const shouldShowPasswordField = () => {
    return isFieldRequired("password") || requiredFields.length === 0;
  };

  const shouldShowUsernameField = () => {
    return isFieldRequired("username");
  };

  const isWaitlistMode = () => {
    // Better waitlist detection: check for specific waitlist indicators
    // Waitlist mode is typically indicated by restricted sign-up access
    // This could be when only email is allowed and other fields are restricted
    return (
      (signUp?.status === "missing_requirements" &&
        requiredFields.length === 1 &&
        requiredFields.includes("email_address") &&
        !signUp?.emailAddress) || // No email captured yet
      // Alternative: detect based on sign-up restrictions or settings
      (signUp?.status === "abandoned" && requiredFields.length === 0)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !signUp) return;

    setState((prev) => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const createParams: {
        firstName?: string;
        lastName?: string;
        emailAddress?: string;
        username?: string;
        password?: string;
      } = {};

      if (isFieldRequired("firstName") || requiredFields.length === 0) {
        createParams.firstName = formData.firstName;
      }
      if (isFieldRequired("lastName") || requiredFields.length === 0) {
        createParams.lastName = formData.lastName;
      }
      if (isFieldRequired("email_address") || requiredFields.length === 0) {
        createParams.emailAddress = formData.email;
      }
      if (isFieldRequired("username")) {
        createParams.username = formData.username;
      }
      if (isFieldRequired("password") || requiredFields.length === 0) {
        createParams.password = formData.password;
      }

      await signUp.create(createParams);

      // Dynamic verification method detection
      // Check what verification methods are available
      if (signUp.unverifiedFields?.includes("email_address")) {
        // Email needs verification - use email code by default
        // You could also detect if email links are preferred based on settings
        try {
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          });
          setState((prev) => ({ ...prev, isLoading: false, step: "verify" }));
        } catch (verifyErr) {
          // Fallback: try email link if code fails
          console.warn(
            "Email code verification failed, trying email link:",
            verifyErr,
          );
          // For email link, you'd redirect to a different flow
        }
      } else if (signUp.unverifiedFields?.includes("phone_number")) {
        // Phone verification needed
        await signUp.preparePhoneNumberVerification({ strategy: "phone_code" });
        setState((prev) => ({ ...prev, isLoading: false, step: "verify" }));
      } else {
        // No verification needed, user should be ready
        setState((prev) => ({ ...prev, isLoading: false, step: "verify" }));
      }
    } catch (err) {
      let displayError = "Failed to create account";

      if (isClerkAPIResponseError(err)) {
        const clerkError = err.errors[0];

        // Handle specific error codes
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
              "Failed to create account";
        }
      } else {
        displayError =
          err instanceof Error ? err.message : "Failed to create account";
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: displayError,
      }));
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !signUp) return;

    setState((prev) => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // Note: Session tasks should be checked after setActive completes
        // For now, redirect to dashboard and handle session tasks there

        router.push("/0-dashboard");
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Verification incomplete",
        }));
      }
    } catch (err) {
      let errorMessage = "Invalid verification code";

      if (isClerkAPIResponseError(err)) {
        const clerkError = err.errors[0];
        errorMessage =
          clerkError.longMessage ||
          clerkError.message ||
          "Invalid verification code";
      } else {
        errorMessage =
          err instanceof Error ? err.message : "Invalid verification code";
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialSignUp = async (provider: string) => {
    if (!isLoaded || !signUp) return;

    setState((prev) => ({ ...prev, error: undefined, isLoading: true }));

    try {
      await signUp.authenticateWithRedirect({
        strategy: provider as OAuthStrategy,
        redirectUrl: "/0-sso-callback",
        redirectUrlComplete: "/0-dashboard",
      });
    } catch (err) {
      let errorMessage = `Failed to sign up with ${provider.replace("oauth_", "")}`;

      if (isClerkAPIResponseError(err)) {
        const clerkError = err.errors[0];
        errorMessage =
          clerkError.longMessage || clerkError.message || errorMessage;
      } else {
        errorMessage = err instanceof Error ? err.message : errorMessage;
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
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
              You're currently signed in
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

  if (state.step === "verify") {
    return (
      <div className="w-full max-w-sm mx-auto p-6 border border-border rounded-lg bg-card">
        <div className="space-y-4">
          <div className="text-center">
            <ClerkLogo className="w-8 h-8 mx-auto mb-2" />
            <h2 className="text-lg font-semibold">Verify your email</h2>
            <p className="text-sm text-muted-foreground">
              We sent a code to {formData.email}
            </p>
          </div>

          <form onSubmit={handleVerification} className="space-y-3">
            <div className="space-y-2">
              <Label
                htmlFor="verification-code"
                className="text-sm font-medium"
              >
                Verification code
              </Label>
              <Input
                id="verification-code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                disabled={state.isLoading}
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>

            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={state.isLoading || verificationCode.length !== 6}
            >
              {state.isLoading ? (
                <>
                  <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() =>
                  signUp?.prepareEmailAddressVerification({
                    strategy: "email_code",
                  })
                }
                disabled={state.isLoading}
              >
                Resend code
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full max-w-sm mx-auto p-6 border border-border rounded-lg bg-card relative">
        <div className="space-y-4">
          <div className="text-center">
            <ClerkLogo className="w-8 h-8 mx-auto mb-2" />
            <h2 className="text-lg font-semibold">Create account</h2>
            <p className="text-sm text-muted-foreground">Get started today</p>
          </div>

          {socialProviders.length > 0 && (
            <div className="space-y-3">
              {socialProviders.map((provider) => (
                <Button
                  key={provider.strategy}
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialSignUp(provider.strategy)}
                  disabled={state.isLoading}
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
            {(isFieldRequired("firstName") ||
              isFieldRequired("lastName") ||
              requiredFields.length === 0) && (
              <div className="grid grid-cols-2 gap-2">
                {(isFieldRequired("firstName") ||
                  requiredFields.length === 0) && (
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        updateFormData("firstName", e.target.value)
                      }
                      placeholder="John"
                      required={
                        isFieldRequired("firstName") ||
                        requiredFields.length === 0
                      }
                      disabled={state.isLoading}
                      autoComplete="given-name"
                    />
                  </div>
                )}
                {(isFieldRequired("lastName") ||
                  requiredFields.length === 0) && (
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        updateFormData("lastName", e.target.value)
                      }
                      placeholder="Doe"
                      required={
                        isFieldRequired("lastName") ||
                        requiredFields.length === 0
                      }
                      disabled={state.isLoading}
                      autoComplete="family-name"
                    />
                  </div>
                )}
              </div>
            )}

            {(isFieldRequired("email_address") ||
              requiredFields.length === 0) && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="you@company.com"
                  required={
                    isFieldRequired("email_address") ||
                    requiredFields.length === 0
                  }
                  disabled={state.isLoading}
                  autoComplete="email"
                />
              </div>
            )}

            {shouldShowUsernameField() && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => updateFormData("username", e.target.value)}
                  placeholder="johndoe"
                  required={isFieldRequired("username")}
                  disabled={state.isLoading}
                  autoComplete="username"
                />
              </div>
            )}

            {shouldShowPasswordField() && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    placeholder="••••••••"
                    required={
                      isFieldRequired("password") || requiredFields.length === 0
                    }
                    disabled={state.isLoading}
                    autoComplete="new-password"
                    className="pr-10"
                    minLength={8}
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
            )}

            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {/* CAPTCHA Widget - Required for Smart CAPTCHA */}
            <div id="clerk-captcha"></div>

            <Button type="submit" className="w-full" disabled={state.isLoading}>
              {state.isLoading ? (
                <>
                  <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </div>

        {/* Waitlist Backdrop Overlay */}
        {isWaitlistMode() && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
            <div className="text-center px-4">
              <p className="font-medium text-foreground">
                Waitlist mode is enabled
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Change the config in Clerk if you want to use it
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
