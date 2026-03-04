"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { useSignUp } from "@clerk/nextjs";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.56-2.77.01-.54z"
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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
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

export interface ClerkSignUpProps {
  className?: string;
  showOAuth?: boolean;
  heading?: string;
  subheading?: string;
  redirectUrl?: string;
  signInUrl?: string;
  afterSSOUrl?: string;
}

type PasswordRequirement = {
  label: string;
  met: boolean;
};

function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Number", met: /\d/.test(password) },
  ];
}

export function ClerkSignUp({
  className,
  showOAuth = true,
  heading = "Create your account",
  subheading = "Welcome! Please fill in the details to get started.",
  redirectUrl = "/",
  signInUrl = "/sign-in",
  afterSSOUrl = "/sso-callback",
}: ClerkSignUpProps) {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<"form" | "verify">("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const requirements = getPasswordRequirements(password);
  const allRequirementsMet = requirements.every((r) => r.met);
  const canContinue =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    allRequirementsMet;

  const isFetching = fetchStatus === "fetching";

  const handleOAuthGoogle = useCallback(async () => {
    setError(null);
    const { error: ssoError } = await signUp.sso({
      strategy: "oauth_google",
      redirectUrl,
      redirectCallbackUrl: afterSSOUrl,
    });
    if (ssoError) {
      setError(ssoError.message ?? "OAuth failed. Please try again.");
    }
  }, [signUp, afterSSOUrl, redirectUrl]);

  const handleOAuthGitHub = useCallback(async () => {
    setError(null);
    const { error: ssoError } = await signUp.sso({
      strategy: "oauth_github",
      redirectUrl,
      redirectCallbackUrl: afterSSOUrl,
    });
    if (ssoError) {
      setError(ssoError.message ?? "OAuth failed. Please try again.");
    }
  }, [signUp, afterSSOUrl, redirectUrl]);

  const handleContinue = useCallback(async () => {
    if (!canContinue) return;
    setError(null);
    const { error: pwError } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });
    if (pwError) {
      setError(pwError.message ?? "Sign up failed.");
      return;
    }
    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setError(sendError.message ?? "Failed to send verification code.");
      return;
    }
    setStep("verify");
  }, [canContinue, signUp, email, password, firstName, lastName]);

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) {
        const chars = value.slice(0, 6).split("");
        const next = [...otp];
        chars.forEach((char, i) => {
          if (index + i < 6) next[index + i] = char;
        });
        setOtp(next);
        const focusIndex = Math.min(index + chars.length, 5);
        otpRefs.current[focusIndex]?.focus();
        return;
      }

      if (!/^\d*$/.test(value)) return;

      const next = [...otp];
      next[index] = value;
      setOtp(next);

      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const otpCode = otp.join("");
  const canVerify = otpCode.length === 6;

  const handleVerify = useCallback(async () => {
    if (!canVerify) return;
    setError(null);
    const { error: verifyError } = await signUp.verifications.verifyEmailCode({
      code: otpCode,
    });
    if (verifyError) {
      setError(verifyError.message ?? "Verification failed.");
      return;
    }
    const { error: finalizeError } = await signUp.finalize();
    if (finalizeError) {
      setError(finalizeError.message ?? "Failed to complete sign up.");
      return;
    }
    router.push(redirectUrl);
  }, [canVerify, signUp, otpCode, router, redirectUrl]);

  const handleResend = useCallback(async () => {
    setOtp(Array(6).fill(""));
    otpRefs.current[0]?.focus();
    await signUp.verifications.sendEmailCode();
  }, [signUp]);

  return (
    <div
      data-slot="clerk-sign-up"
      className={cn(
        "w-full max-w-[400px] rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div data-slot="header" className="px-8 pt-8 pb-6 text-center">
        {step === "verify" && (
          <button
            type="button"
            data-slot="back-button"
            onClick={() => {
              setStep("form");
              setError(null);
            }}
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>
        )}
        <h1
          data-slot="heading"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          {step === "form" ? heading : "Verify your email"}
        </h1>
        <p
          data-slot="subheading"
          className="mt-1.5 text-sm text-muted-foreground"
        >
          {step === "form"
            ? subheading
            : `Enter the verification code sent to ${email}`}
        </p>
      </div>

      {step === "form" && (
        <div data-slot="form-body" className="px-8 pb-8">
          {showOAuth && (
            <>
              <div data-slot="oauth-buttons" className="flex gap-2">
                <button
                  type="button"
                  data-slot="oauth-google"
                  onClick={handleOAuthGoogle}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <GoogleIcon />
                  Google
                </button>
                <button
                  type="button"
                  data-slot="oauth-github"
                  onClick={handleOAuthGitHub}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <GitHubIcon />
                  GitHub
                </button>
              </div>

              <div data-slot="divider" className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase text-muted-foreground">
                  or
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
            </>
          )}

          <div data-slot="fields" className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 space-y-1.5">
                <label
                  data-slot="label"
                  htmlFor="clerk-signup-first-name"
                  className="block text-sm font-medium text-foreground"
                >
                  First name
                </label>
                <input
                  id="clerk-signup-first-name"
                  data-slot="input"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <label
                  data-slot="label"
                  htmlFor="clerk-signup-last-name"
                  className="block text-sm font-medium text-foreground"
                >
                  Last name
                </label>
                <input
                  id="clerk-signup-last-name"
                  data-slot="input"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                data-slot="label"
                htmlFor="clerk-signup-email"
                className="block text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <input
                id="clerk-signup-email"
                data-slot="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label
                data-slot="label"
                htmlFor="clerk-signup-password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="clerk-signup-password"
                  data-slot="input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  data-slot="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>

              {password.length > 0 && (
                <ul
                  data-slot="password-requirements"
                  className="mt-2 space-y-1"
                >
                  {requirements.map((req) => (
                    <li
                      key={req.label}
                      className={cn(
                        "flex items-center gap-1.5 text-xs transition-colors",
                        req.met ? "text-emerald-500" : "text-muted-foreground",
                      )}
                    >
                      <CheckIcon
                        className={cn(
                          "h-3.5 w-3.5 shrink-0",
                          req.met
                            ? "text-emerald-500"
                            : "text-muted-foreground/40",
                        )}
                      />
                      {req.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div id="clerk-captcha" />

          {error && (
            <p
              data-slot="error"
              className="mt-3 text-center text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            data-slot="continue-button"
            disabled={!canContinue || isFetching}
            onClick={handleContinue}
            className={cn(
              "mt-6 h-9 w-full rounded-lg text-sm font-medium transition-colors",
              canContinue && !isFetching
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "cursor-not-allowed bg-primary/50 text-primary-foreground/70",
            )}
          >
            {isFetching ? "Creating account..." : "Continue"}
          </button>

          <p
            data-slot="footer"
            className="mt-4 text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push(signInUrl)}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      )}

      {step === "verify" && (
        <div data-slot="verify-body" className="px-8 pb-8">
          <div data-slot="otp-group" className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                // biome-ignore lint/suspicious/noArrayIndexKey: OTP digit positions are stable
                key={index}
                ref={(el) => {
                  otpRefs.current[index] = el;
                }}
                data-slot="otp-input"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onFocus={(e) => e.target.select()}
                className={cn(
                  "h-11 w-10 rounded-lg border bg-background text-center text-lg font-medium text-foreground outline-none transition-colors",
                  digit
                    ? "border-primary"
                    : "border-border focus:border-primary focus:ring-1 focus:ring-primary",
                )}
              />
            ))}
          </div>

          {error && (
            <p
              data-slot="error"
              className="mt-3 text-center text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            data-slot="verify-button"
            disabled={!canVerify || isFetching}
            onClick={handleVerify}
            className={cn(
              "mt-6 h-9 w-full rounded-lg text-sm font-medium transition-colors",
              canVerify && !isFetching
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "cursor-not-allowed bg-primary/50 text-primary-foreground/70",
            )}
          >
            {isFetching ? "Verifying..." : "Verify"}
          </button>

          <p
            data-slot="resend"
            className="mt-4 text-center text-sm text-muted-foreground"
          >
            Didn&apos;t receive a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Resend
            </button>
          </p>
        </div>
      )}

      <div
        data-slot="branding"
        className="flex items-center justify-center border-t border-border px-8 py-4"
      >
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          Secured by
          <span className="font-semibold text-foreground">clerk</span>
        </span>
      </div>
    </div>
  );
}
