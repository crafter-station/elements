"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSignUpSignal } from "@clerk/clerk-react/experimental";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpSignals({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signUp, errors, fetchStatus } = useSignUpSignal();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) return;

    const { error } = await signUp.password({
      emailAddress: email,
      password: password,
    });

    if (error) return; // Errors are handled by the global errors object

    // Check if email verification is needed
    if (signUp.unverifiedFields?.includes("email_address")) {
      // Email verification needed - send code automatically
      await signUp.verifications.sendEmailCode();
      // Error handled by global errors object
    }

    // Check if sign-up is complete after password submission
    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: () => {
          router.push("/protected");
        },
      });
    }
  };

  const handleVerification = async (formData: FormData) => {
    const code = formData.get("code") as string;

    if (!code) return;

    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) return;

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: () => {
          router.push("/protected");
        },
      });
    }
  };

  const handleResendCode = async () => {
    const { error } = await signUp.verifications.sendEmailCode();
    // Error handled by global errors object
    if (!error) {
      setVerificationCode("");
    }
  };

  // Verification step
  if (signUp.unverifiedFields?.includes("email_address")) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Verify your email</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleVerification}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="000000"
                    required
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                  {errors.fields.code && (
                    <p className="text-sm text-destructive">
                      {errors.fields.code.message}
                    </p>
                  )}
                </div>

                {errors.global && errors.global.length > 0 && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {String(errors.global[0])}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    fetchStatus === "fetching" || verificationCode.length < 6
                  }
                >
                  {fetchStatus === "fetching" ? (
                    <>
                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>

                <div className="text-center text-sm">
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground underline underline-offset-4"
                    onClick={handleResendCode}
                    disabled={fetchStatus === "fetching"}
                  >
                    Resend code
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                  {errors.fields.emailAddress && (
                    <p className="text-sm text-destructive">
                      {errors.fields.emailAddress.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      required
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
                  {errors.fields.password && (
                    <p className="text-sm text-destructive">
                      {errors.fields.password.message}
                    </p>
                  )}
                </div>

                {errors.global && errors.global.length > 0 && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {String(errors.global[0])}
                    </AlertDescription>
                  </Alert>
                )}

                {/* CAPTCHA div - required for bot protection */}
                <div id="clerk-captcha"></div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={fetchStatus === "fetching"}
                >
                  {fetchStatus === "fetching" ? (
                    <>
                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/sign-in" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
