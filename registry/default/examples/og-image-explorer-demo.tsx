"use client";

// Subset of routes from scripts/generate-og-routes.ts for preview

import { OgImageExplorer } from "@/registry/default/blocks/media/og-image-explorer/components/elements/og-image-explorer";

const BASE_URL = "https://tryelements.dev";

const ROUTES = [
  // Root pages - group together
  { path: "/", title: "Home", category: "pages" },
  { path: "/contributors", title: "Contributors", category: "pages" },
  { path: "/sponsor", title: "Sponsor", category: "pages" },
  // Provider pages
  { path: "/docs", title: "Documentation", category: "docs" },
  { path: "/docs/logos", title: "Brand Logos", category: "docs" },
  { path: "/docs/clerk", title: "Clerk", category: "docs" },
  { path: "/docs/polar", title: "Polar", category: "docs" },
  { path: "/docs/theme", title: "Theme", category: "docs" },
  { path: "/docs/uploadthing", title: "UploadThing", category: "docs" },
  { path: "/docs/tinte", title: "Tinte", category: "docs" },
  { path: "/docs/github", title: "GitHub", category: "docs" },
  { path: "/docs/devtools", title: "Dev Tools", category: "docs" },
].map((route) => ({
  ...route,
  ogImageUrl: `${BASE_URL}${route.path}/opengraph-image`,
}));

export default function OgImageExplorerDemo() {
  return (
    <div className="w-full h-full max-h-[580px] overflow-y-auto p-4 !items-start [&]:!justify-start">
      <OgImageExplorer routes={ROUTES} maxPerCategory={4} />
    </div>
  );
}
