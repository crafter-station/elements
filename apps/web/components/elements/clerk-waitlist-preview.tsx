"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ClerkWaitlistPreview() {
  return (
    <div className="rounded-xl h-[5.5rem] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="space-y-2">
          <form
            className="flex flex-col sm:flex-row gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Label htmlFor="email" className="sr-only">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@domain.com"
              disabled
            />
            <Button
              type="submit"
              disabled
              className="px-4 whitespace-nowrap bg-foreground text-background hover:bg-foreground/90"
            >
              Join Waitlist
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
