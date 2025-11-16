import type { Metadata } from "next";

import { getLogoComponents } from "@/lib/registry-loader";

import { LogosClient } from "./logos-client";

export const metadata: Metadata = {
  title: "Brand Logos - Elements",
  description:
    "Tech company logos for popular services and platforms. Easy to install, customize, and integrate into your projects. Includes logos for authentication, payments, AI, and more.",
  keywords: [
    "brand logos",
    "tech logos",
    "company logos",
    "React icons",
    "SVG logos",
    "authentication logos",
    "payment logos",
    "AI logos",
  ],
  authors: [{ name: "Railly Hugo", url: "https://github.com/Railly" }],
  creator: "Railly Hugo",
  publisher: "Railly Hugo",
  alternates: {
    canonical: "https://tryelements.dev/docs/logos",
  },
  openGraph: {
    title: "Brand Logos - Elements",
    description:
      "Tech company logos for popular services and platforms. Easy to install, customize, and integrate into your projects.",
    type: "website",
    url: "https://tryelements.dev/docs/logos",
    siteName: "Elements",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Logos - Elements",
    description:
      "Tech company logos for popular services and platforms. Easy to install and customize.",
    creator: "@raillyhugo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function TechLogosPage() {
  // Server-side data loading - no useEffect needed!
  const logoItems = getLogoComponents();

  // Transform registry items to logo format
  const logos = logoItems.map((item) => {
    // Get the first category that's not "logo" or "brand"
    const specificCategory = item.categories?.find(
      (cat) => cat !== "logo" && cat !== "brand",
    );

    return {
      id: item.name,
      name: item.name,
      displayName: item.title.replace(" Logo", "").trim(),
      category: specificCategory || item.categories?.[0] || "Other",
      hasVariants: item.meta?.hasVariants || false,
      variants: item.meta?.variants || [],
    };
  });

  return <LogosClient logos={logos} />;
}
