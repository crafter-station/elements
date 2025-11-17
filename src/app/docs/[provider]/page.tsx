import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowRight } from "lucide-react";

import { ProviderIcon } from "@/lib/providers";
import {
  getComponentsByProvider,
  getProviderMetadata,
  getProviders,
} from "@/lib/registry-loader";

import { ScrambleText } from "@/components/scramble-text";

// Generate static params for all providers
export async function generateStaticParams() {
  const providers = getProviders();

  // Filter out special pages (logos and clerk have their own dedicated pages)
  return providers
    .filter((p) => p !== "logos" && p !== "clerk")
    .map((provider) => ({
      provider,
    }));
}

interface ProviderPageProps {
  params: Promise<{ provider: string }>;
}

export async function generateMetadata(
  props: ProviderPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const { provider } = params;

  if (provider === "logos") {
    return {};
  }

  const metadata = getProviderMetadata(provider);
  const components = getComponentsByProvider(provider);

  if (components.length === 0) {
    return {};
  }

  return {
    title: `${metadata.displayName} Components - Elements`,
    description: metadata.description,
    keywords: [
      metadata.displayName,
      "components",
      "React",
      "Next.js",
      "TypeScript",
      "shadcn/ui",
      metadata.category,
    ],
    authors: [{ name: "Railly Hugo", url: "https://github.com/Railly" }],
    creator: "Railly Hugo",
    publisher: "Railly Hugo",
    alternates: {
      canonical: `https://tryelements.dev/docs/${provider}`,
    },
    openGraph: {
      title: `${metadata.displayName} Components - Elements`,
      description: metadata.description,
      type: "website",
      url: `https://tryelements.dev/docs/${provider}`,
      siteName: "Elements",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${metadata.displayName} Components - Elements`,
      description: metadata.description,
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
}

export default async function ProviderPage(props: ProviderPageProps) {
  const params = await props.params;
  const { provider } = params;

  // Redirect logos to its special page
  if (provider === "logos") {
    notFound();
  }

  // Get provider metadata
  const metadata = getProviderMetadata(provider);
  const components = getComponentsByProvider(provider);

  if (components.length === 0) {
    notFound();
  }

  return (
    <div className="flex-1 w-full">
      {/* Compact Hero Section */}
      <div className="border-b border-border border-dotted">
        <div className="px-4 sm:px-6 md:px-8 py-8 md:py-10">
          <div className="max-w-6xl space-y-4">
            {/* Category Label */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {metadata.category}
              </span>
            </div>

            {/* Title with Icon */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 shrink-0 flex items-center justify-center">
                <ProviderIcon provider={provider} />
              </div>
              <h1>
                <ScrambleText
                  text={metadata.displayName}
                  className="font-dotted font-black text-3xl md:text-4xl leading-none"
                />
              </h1>
            </div>

            {/* Description */}
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
              {metadata.description}
            </p>
          </div>
        </div>
      </div>

      {/* Elements Grid */}
      <div className="px-4 sm:px-6 md:px-8 py-8">
        <div className="max-w-6xl">
          <div className="mb-6">
            <h2 className="text-base font-medium mb-1">
              Elements ({components.length})
            </h2>
            <p className="text-sm text-muted-foreground">
              Browse all available elements for {metadata.displayName}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {components.map((component) => (
              <Link
                key={component.name}
                href={`/docs/${provider}/${component.name}`}
                aria-label={`View ${component.title}`}
                className="flex items-center justify-between gap-2 rounded-md border bg-card p-3 outline-none transition-colors hover:bg-accent focus-visible:bg-accent"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">
                    {component.title}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {component.name}
                  </span>
                </div>
                <ArrowRight
                  className="size-5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
