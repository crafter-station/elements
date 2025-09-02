"use client";

import Link from "next/link";

import { track } from "@vercel/analytics";

import { currentSponsors } from "@/lib/sponsors";

import { ClerkLogo } from "@/components/clerk-logo";
import { ComponentCard } from "@/components/component-card";
import { ElementSuggestionForm } from "@/components/element-suggestion-form";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ArrowRightIcon } from "@/components/icons/arrow-right";
import { GroupIcon } from "@/components/icons/group";
import { MoonIcon } from "@/components/icons/moon";
import { TriggerIcon } from "@/components/icons/trigger";
import { UploadThingIcon } from "@/components/icons/upload-thing";
import { PixelatedHeartIcon } from "@/components/pixelated-heart-icon";
import { QuickstartCard } from "@/components/quickstart-card";
import { ScrambleText } from "@/components/scramble-text";
import { ShadcnIcon } from "@/components/shadcn-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BetterAuthIcon } from "@/components/ui/logos/better-auth";
import { GitHubLogo } from "@/components/ui/logos/github";
import { PolarIcon } from "@/components/ui/logos/polar";
import { ResendIcon } from "@/components/ui/logos/resend";
import { StripeIcon } from "@/components/ui/logos/stripe";
import { SupabaseIcon } from "@/components/ui/logos/supabase";
import { UpstashIcon } from "@/components/ui/logos/upstash";
import { VercelIcon } from "@/components/ui/logos/vercel";

export default function Home() {
  const scrollToGallery = () => {
    track("Gallery Navigation", {
      source: "hero_cta",
      action: "scroll_to_gallery",
    });

    const gallerySection = document.getElementById("gallery");
    if (gallerySection) {
      gallerySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 w-full max-w-screen-xl border-border border-dotted border-x mx-auto">
        {/* Main Hero Section - Basement Style */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 lg:gap-16 items-center w-full min-h-[90vh] py-16 px-8 lg:px-16">
          <div className="lg:col-span-4 space-y-8">
            {/* Narrative Block */}
            <section className="space-y-6">
              <div className="text-lg uppercase tracking-[0.2em] font-mono text-primary/70">
                [ELEMENTS]
              </div>
              <h1 className="font-dotted font-black text-5xl lg:text-7xl leading-tight tracking-tight">
                Full-Stack
                <br />
                <ShadcnIcon className="size-8 md:size-12 lg:size-16 inline-block" />{" "}
                shadcn/ui
                <br />
                components
              </h1>
              <p className="text-muted-foreground text-lg  leading-relaxed max-w-2xl">
                Elements gives you production-ready auth, payments, AI and
                more... <br /> built for Next.js, TypeScript, and the agentic
                era.
              </p>
            </section>

            {/* CTAs */}
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                className="font-medium"
                onClick={scrollToGallery}
              >
                Explore Gallery <ArrowRightIcon />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="font-medium hover:underline"
                asChild
              >
                <Link
                  href="https://github.com/crafter-station/elements"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track("GitHub Star Click", {
                      source: "hero_cta",
                      action: "external_link_github",
                    })
                  }
                >
                  Star us on GitHub <GitHubLogo />{" "}
                </Link>
              </Button>
            </div>
          </div>

          {/* Quickstart Card */}
          <div className="lg:col-span-3 w-full">
            <QuickstartCard />
          </div>
        </div>

        {/* Beta Component Gallery - Full Width */}
        <div
          id="gallery"
          className="w-full py-16 border-t border-border border-dotted px-8"
        >
          <div className="space-y-8">
            <h2 className="w-full flex justify-center mb-16">
              <ScrambleText
                text="Beta Elements Gallery"
                className="font-dotted font-black text-4xl lg:text-6xl"
              />
            </h2>

            <div className="grid gap-4 place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <ComponentCard
                name="Clerk Auth"
                description="Complete authentication flows with Clerk integration"
                icon={<ClerkLogo className="w-6 h-6" />}
                category="Auth"
                brandColor="#654BF6"
                isEnabled={true}
                href="/t/clerk"
                elementsCount={6}
                providerLink="https://clerk.com"
                trackingSource="homepage_gallery"
              />
              <ComponentCard
                name="Polar"
                description="Monetization platform for open source creators"
                icon={<PolarIcon className="w-6 h-6" />}
                category="Monetization"
                brandColor="#0062FF"
                isEnabled={true}
                href="/t/polar"
                elementsCount={1}
                providerLink="https://polar.sh"
                trackingSource="homepage_gallery"
              />
              <ComponentCard
                name="Tech Logos"
                description="Collection of popular tech company logos with shopping cart selection"
                icon={<GroupIcon className="w-6 h-6" />}
                category="Brand"
                isEnabled={true}
                brandColor="#444444"
                href="/t/logos"
                elementsCount={34}
                trackingSource="homepage_gallery"
              />
              <ComponentCard
                name="Theme Switcher"
                description="Dark/light mode toggle with system preference detection"
                icon={<MoonIcon className="w-6 h-6" />}
                category="UI"
                isEnabled={true}
                href="/t/theme-switcher"
                brandColor="#444444"
                elementsCount={6}
                trackingSource="homepage_gallery"
              />
              <ComponentCard
                name="Vercel AI SDK"
                description="AI-powered chat and streaming components with model providers"
                icon={<VercelIcon className="w-6 h-6" />}
                category="AI"
                brandColor="#000000"
                isEnabled={false}
                href="/t/vercel"
                elementsCount={3}
                providerLink="https://vercel.com/ai"
                trackingSource="homepage_gallery"
              />
              <ComponentCard
                name="Trigger.dev"
                description="Background job scheduling and monitoring components"
                icon={<TriggerIcon className="w-6 h-6" />}
                category="Jobs"
                brandColor="#8DFF53"
                isEnabled={false}
                href="/t/trigger"
                elementsCount={4}
                providerLink="https://trigger.dev"
                trackingSource="homepage_gallery"
              />
              <ComponentCard
                name="Upstash"
                description="Redis and Kafka database components with edge computing"
                icon={<UpstashIcon className="w-6 h-6" />}
                category="Database"
                brandColor="#00C98D"
                isEnabled={false}
                href="/t/upstash"
                elementsCount={3}
                providerLink="https://upstash.com"
                trackingSource="homepage_gallery"
              />
              <ComponentCard
                name="UploadThing"
                description="Complete file upload solution with drag & drop interface"
                icon={<UploadThingIcon className="w-6 h-6" />}
                category="Files"
                brandColor="#E91515"
                isEnabled={false}
                href="/t/uploadthing"
                elementsCount={2}
                providerLink="https://uploadthing.com"
                trackingSource="homepage_gallery"
              />
              <ComponentCard
                name="Supabase"
                description="Database connection and CRUD operation components"
                icon={<SupabaseIcon className="w-6 h-6" />}
                category="Database"
                brandColor="#3ECF8E"
                elementsCount={5}
                providerLink="https://supabase.com"
                trackingSource="homepage_gallery"
              />
              <ComponentCard
                name="Better Auth"
                description="Route protection and role-based access control"
                icon={<BetterAuthIcon className="w-6 h-6" />}
                category="Auth"
                brandColor="#000000"
                elementsCount={3}
                providerLink="https://better-auth.com"
                trackingSource="homepage_gallery"
              />
              <ComponentCard
                name="Resend"
                description="Responsive email templates with React Email"
                icon={<ResendIcon className="w-6 h-6" />}
                category="Email"
                brandColor="#000000"
                elementsCount={2}
                providerLink="https://resend.com"
                trackingSource="homepage_gallery"
              />
              <ComponentCard
                name="Stripe"
                description="Stripe integration with checkout and subscription flows"
                icon={<StripeIcon className="w-6 h-6" />}
                category="Payments"
                brandColor="#635BFF"
                elementsCount={4}
                providerLink="https://stripe.com"
                trackingSource="homepage_gallery"
              />
            </div>
          </div>
        </div>

        {/* Sponsors & Contact Section */}
        <div className="w-full border-t border-border border-dotted">
          <div className="space-y-0">
            <div className="px-8 py-16 text-center space-y-8">
              <div className="space-y-2">
                <h2>
                  <ScrambleText
                    text="Sponsors"
                    className="font-dotted font-black text-4xl lg:text-6xl"
                  />
                </h2>
                <p className="text-muted-foreground text-lg">
                  Join these companies building with Elements - ready-to-use
                  components that scale
                </p>
              </div>
            </div>

            {/* Three Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              {currentSponsors.map((sponsor, index) => (
                <a
                  key={`${sponsor.name}-${sponsor.tier}`}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track("Sponsor Click", {
                      sponsor_name: sponsor.name,
                      sponsor_tier: sponsor.tier,
                      source: "homepage_sponsors",
                      action: "external_link",
                    })
                  }
                  className={`flex items-center justify-center border-t ${
                    index === 0
                      ? "border-r md:border-r"
                      : index === 1
                        ? "border-l md:border-l-0 border-r md:border-r"
                        : ""
                  } border-border border-dotted bg-card/30 hover:bg-accent/20 transition-all duration-300 group`}
                >
                  <div className="flex flex-col items-center justify-center min-h-[200px] px-6 py-12 space-y-4">
                    <div className="opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      {sponsor.logo}
                    </div>
                    <div className="text-center space-y-1">
                      <h4 className="text-2xl uppercase font-black font-dotted text-foreground group-hover:text-primary transition-colors">
                        {sponsor.name}
                      </h4>
                      <div className="space-y-1">
                        <Badge variant="secondary" className="text-xs">
                          {sponsor.tier}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
              <div className="flex items-center justify-center border-t border-l md:border-l-0 border-border border-dotted bg-card/30 ">
                <div className="flex flex-col items-center justify-center min-h-[200px] px-6 py-12 space-y-4">
                  <PixelatedHeartIcon className="h-12 w-12 text-red-500 opacity-80" />
                  <div className="text-center space-y-2">
                    <h4 className="text-sm font-medium text-foreground">
                      It Can Be You
                    </h4>
                    <div className="space-y-3 text-xs text-muted-foreground">
                      <p>Need custom components for your company?</p>
                      <Link
                        href="/sponsor"
                        onClick={() =>
                          track("Become Sponsor Click", {
                            source: "homepage_sponsors",
                            action: "cta_click",
                          })
                        }
                        className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 text-sm font-medium"
                      >
                        Become a Sponsor
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Element Suggestion Section */}
        <div
          id="suggest"
          className="w-full border-t border-border border-dotted px-8 py-16"
        >
          <div className="max-w-2xl mx-auto">
            <ElementSuggestionForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
