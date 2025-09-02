"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { BullseyeArrowIcon } from "@/components/icons/bullseye-arrow";
import { HumanHandsupIcon } from "@/components/icons/human-handsup";
import { PixelatedHeartIcon } from "@/components/pixelated-heart-icon";
import { ScrambleText } from "@/components/scramble-text";
import { Button } from "@/components/ui/button";

function SponsorSuccessContent() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 w-full max-w-screen-xl border-border border-dotted border-x mx-auto">
        <div className="relative overflow-hidden">
          <div className="w-full py-24 px-8 lg:px-16">
            <div className="text-center max-w-4xl mx-auto space-y-12">
              <div className="space-y-8">
                <div className="flex justify-center">
                  <PixelatedHeartIcon className="size-24 text-red-500 animate-pulse" />
                </div>

                <div className="space-y-6">
                  <div className="text-lg uppercase tracking-[0.2em] font-mono text-primary/70">
                    [THANK YOU!]
                  </div>
                  <h1 className="font-dotted font-black text-5xl lg:text-7xl leading-tight tracking-tight">
                    <ScrambleText text="You're Amazing!" />
                  </h1>
                  <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
                    Your sponsorship means the world to me. You're now part of
                    the Elements journey!
                  </p>

                  {checkoutId && (
                    <div className="bg-card/30 border border-border p-4 rounded text-sm max-w-lg mx-auto">
                      <p className="text-muted-foreground">
                        Checkout ID:{" "}
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          {checkoutId}
                        </code>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-8 md:gap-12 md:grid-cols-3 max-w-3xl mx-auto">
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex size-16 items-center justify-center bg-primary/10">
                    <HumanHandsupIcon className="size-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">What's Next?</h3>
                  <p className="text-muted-foreground text-sm">
                    You'll receive a confirmation email with all the details
                    about your sponsorship benefits.
                  </p>
                </div>

                <div className="space-y-4 text-center">
                  <div className="mx-auto flex size-16 items-center justify-center bg-primary/10">
                    <PixelatedHeartIcon className="size-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Stay Connected</h3>
                  <p className="text-muted-foreground text-sm">
                    Follow progress updates and be the first to try new
                    components as they're released.
                  </p>
                </div>

                <div className="space-y-4 text-center">
                  <div className="mx-auto flex size-16 items-center justify-center bg-primary/10">
                    <BullseyeArrowIcon className="size-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Build Together</h3>
                  <p className="text-muted-foreground text-sm">
                    Your feedback shapes what gets built next. Elements grows
                    with your input.
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-lg">
                  <Link href="/">Back to Elements</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg"
                >
                  <Link href="/docs">Explore Docs</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SponsorSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin">
            <PixelatedHeartIcon className="h-8 w-8" />
          </div>
        </div>
      }
    >
      <SponsorSuccessContent />
    </Suspense>
  );
}
