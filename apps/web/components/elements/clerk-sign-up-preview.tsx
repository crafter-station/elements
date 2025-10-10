"use client";

import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { ClerkLogo } from "@/components/clerk-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitHubLogo } from "@/components/ui/logos/github";
import { GoogleLogo } from "@/components/ui/logos/google";

export function ClerkSignUpPreview() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto p-6 border border-border rounded-lg bg-card">
      <div className="space-y-4">
        <div className="text-center">
          <ClerkLogo className="w-8 h-8 mx-auto mb-2" />
          <h2 className="text-lg font-semibold">Create account</h2>
          <p className="text-sm text-muted-foreground">Get started today</p>
        </div>

        <div className="space-y-3">
          <Button type="button" variant="outline" className="w-full" disabled>
            <GoogleLogo className="w-4 h-4" />
            <span className="ml-2">Continue with Google</span>
          </Button>
          <Button type="button" variant="outline" className="w-full" disabled>
            <GitHubLogo className="w-4 h-4" />
            <span className="ml-2">Continue with GitHub</span>
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>
        </div>

        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First name
              </Label>
              <Input id="firstName" type="text" placeholder="John" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last name
              </Label>
              <Input id="lastName" type="text" placeholder="Doe" disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              disabled
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
                placeholder="••••••••"
                disabled
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

          <Button type="submit" className="w-full" disabled>
            Create account
          </Button>
        </form>
      </div>
    </div>
  );
}
