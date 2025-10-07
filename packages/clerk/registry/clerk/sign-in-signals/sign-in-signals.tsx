"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSignInSignal } from "@clerk/clerk-react/experimental";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInSignals({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn, errors, fetchStatus } = useSignInSignal();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) return;

    const { error } = await signIn.password({
      identifier: email,
      password: password,
    });

    if (error) return; // Errors are handled by the global errors object

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: () => {
          router.push("/protected");
        },
      });
    }
  };

  const handleForgotPassword = async () => {
    const email = document.getElementById("email") as HTMLInputElement;
    if (!email?.value) return;

    const { error } = await signIn.resetPasswordEmailCode.sendCode();
    if (error) return;

    setResetMode(true);
  };

  const handleResetPassword = async (formData: FormData) => {
    const code = formData.get("code") as string;

    if (!code) return;

    const { error: verifyError } =
      await signIn.resetPasswordEmailCode.verifyCode({ code });
    if (verifyError) return;

    if (signIn.status === "needs_new_password") {
      const { error: passwordError } =
        await signIn.resetPasswordEmailCode.submitPassword({
          password: newPassword,
        });

      if (passwordError) return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: () => {
          router.push("/protected");
        },
      });
    }
  };

  // Reset password flow
  if (resetMode) {
    if (signIn.status === "needs_new_password") {
      return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Set new password</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={handleResetPassword}>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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
                  </div>

                  {errors.fields.password && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {errors.fields.password.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={fetchStatus === "fetching" || !newPassword}
                  >
                    {fetchStatus === "fetching" ? (
                      <>
                        <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
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
            <CardTitle className="text-xl">Check your email</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleResetPassword}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    placeholder="000000"
                    required
                    maxLength={6}
                  />
                </div>

                {errors.fields.code && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {errors.fields.code.message}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={fetchStatus === "fetching"}
                >
                  {fetchStatus === "fetching" ? (
                    <>
                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                <div className="text-center text-sm">
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground underline underline-offset-4"
                    onClick={() => setResetMode(false)}
                  >
                    Back to sign in
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
          <CardTitle className="text-xl">Welcome back</CardTitle>
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
                  {errors.fields.identifier && (
                    <p className="text-sm text-destructive">
                      {errors.fields.identifier.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                      onClick={handleForgotPassword}
                    >
                      Forgot your password?
                    </button>
                  </div>
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

                <Button
                  type="submit"
                  className="w-full"
                  disabled={fetchStatus === "fetching"}
                >
                  {fetchStatus === "fetching" ? (
                    <>
                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
