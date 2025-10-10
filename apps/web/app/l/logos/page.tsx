import type { Metadata } from "next";

import { getLogoComponents } from "@/lib/registry-loader";

import { LogosClient } from "./logos-client";

export const metadata: Metadata = {
  title: "Brand Logos",
  description:
    "Tech company logos for popular services and platforms. Easy to install, customize, and integrate into your projects. Includes logos for authentication, payments, AI, and more.",
  openGraph: {
    title: "Brand Logos - Elements",
    description:
      "Tech company logos for popular services and platforms. Easy to install and customize.",
    type: "website",
    url: "https://tryelements.dev/l/logos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Logos - Elements",
    description:
      "Tech company logos for popular services and platforms. Easy to install and customize.",
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
    };
  });

  return <LogosClient logos={logos} />;
}
