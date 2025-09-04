import { ClerkLogo } from "@/components/clerk-logo";
import { GroupIcon } from "@/components/icons/group";
import { MoonIcon } from "@/components/icons/moon";
import { TriggerIcon } from "@/components/icons/trigger";
import { UploadThingIcon } from "@/components/icons/upload-thing";
import { BetterAuthIcon } from "@/components/ui/logos/better-auth";
import { PolarIcon } from "@/components/ui/logos/polar";
import { ResendIcon } from "@/components/ui/logos/resend";
import { StripeIcon } from "@/components/ui/logos/stripe";
import { SupabaseIcon } from "@/components/ui/logos/supabase";
import { UpstashIcon } from "@/components/ui/logos/upstash";
import { VercelIcon } from "@/components/ui/logos/vercel";

export interface Provider {
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  brandColor: string;
  isEnabled: boolean;
  href: string;
  elementsCount: number;
  providerLink?: string;
}

export const providers: Provider[] = [
  {
    name: "Clerk Auth",
    description: "Complete authentication flows with Clerk integration",
    icon: <ClerkLogo className="w-6 h-6" />,
    category: "Auth",
    brandColor: "#654BF6",
    isEnabled: true,
    href: "/t/clerk",
    elementsCount: 6,
    providerLink: "https://clerk.com",
  },
  {
    name: "Polar",
    description: "Monetization platform for open source creators",
    icon: <PolarIcon className="w-6 h-6" />,
    category: "Monetization",
    brandColor: "#0062FF",
    isEnabled: true,
    href: "/t/polar",
    elementsCount: 1,
    providerLink: "https://polar.sh",
  },
  {
    name: "Tech Logos",
    description:
      "Collection of popular tech company logos with shopping cart selection",
    icon: <GroupIcon className="w-6 h-6" />,
    category: "Brand",
    isEnabled: true,
    brandColor: "#444444",
    href: "/t/logos",
    elementsCount: 34,
  },
  {
    name: "Theme Switcher",
    description: "Dark/light mode toggle with system preference detection",
    icon: <MoonIcon className="w-6 h-6" />,
    category: "UI",
    isEnabled: true,
    href: "/t/theme-switcher",
    brandColor: "#444444",
    elementsCount: 6,
  },
  {
    name: "Vercel AI SDK",
    description:
      "AI-powered chat and streaming components with model providers",
    icon: <VercelIcon className="w-6 h-6" />,
    category: "AI",
    brandColor: "#000000",
    isEnabled: false,
    href: "/t/vercel",
    elementsCount: 3,
    providerLink: "https://vercel.com/ai",
  },
  {
    name: "Trigger.dev",
    description: "Background job scheduling and monitoring components",
    icon: <TriggerIcon className="w-6 h-6" />,
    category: "Jobs",
    brandColor: "#8DFF53",
    isEnabled: false,
    href: "/t/trigger",
    elementsCount: 4,
    providerLink: "https://trigger.dev",
  },
  {
    name: "Upstash",
    description: "Redis and Kafka database components with edge computing",
    icon: <UpstashIcon className="w-6 h-6" />,
    category: "Database",
    brandColor: "#00C98D",
    isEnabled: false,
    href: "/t/upstash",
    elementsCount: 3,
    providerLink: "https://upstash.com",
  },
  {
    name: "UploadThing",
    description: "Complete file upload solution with drag & drop interface",
    icon: <UploadThingIcon className="w-6 h-6" />,
    category: "Files",
    brandColor: "#E91515",
    isEnabled: true,
    href: "/t/uploadthing",
    elementsCount: 2,
    providerLink: "https://uploadthing.com",
  },
  {
    name: "Supabase",
    description: "Database connection and CRUD operation components",
    icon: <SupabaseIcon className="w-6 h-6" />,
    category: "Database",
    brandColor: "#3ECF8E",
    elementsCount: 5,
    providerLink: "https://supabase.com",
    isEnabled: false,
    href: "/t/supabase",
  },
  {
    name: "Better Auth",
    description: "Route protection and role-based access control",
    icon: <BetterAuthIcon className="w-6 h-6" />,
    category: "Auth",
    brandColor: "#000000",
    elementsCount: 3,
    providerLink: "https://better-auth.com",
    isEnabled: false,
    href: "/t/better-auth",
  },
  {
    name: "Resend",
    description: "Responsive email templates with React Email",
    icon: <ResendIcon className="w-6 h-6" />,
    category: "Email",
    brandColor: "#000000",
    elementsCount: 2,
    providerLink: "https://resend.com",
    isEnabled: false,
    href: "/t/resend",
  },
  {
    name: "Stripe",
    description: "Stripe integration with checkout and subscription flows",
    icon: <StripeIcon className="w-6 h-6" />,
    category: "Payments",
    brandColor: "#635BFF",
    elementsCount: 4,
    providerLink: "https://stripe.com",
    isEnabled: false,
    href: "/t/stripe",
  },
];
