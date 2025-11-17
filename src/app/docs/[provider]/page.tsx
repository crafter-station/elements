import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border border-dotted">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        </div>

        <div className="relative z-10 py-4 md:py-5 px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl">
            {/* Category Label */}
            <div className="mb-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                {metadata.category}
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 md:w-9 md:h-9">
                  <ProviderIcon provider={provider} />
                </div>
                <h1>
                  <ScrambleText
                    text={metadata.displayName}
                    className="font-dotted font-black text-2xl md:text-3xl leading-tight"
                  />
                </h1>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                {metadata.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Elements Grid */}
      <div className="px-4 sm:px-6 md:px-8 py-8">
        <div className="max-w-6xl">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              Elements ({components.length})
            </h2>
            <p className="text-sm text-muted-foreground">
              Browse all available elements for {metadata.displayName}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {components.map((component) => (
              <Link
                key={component.name}
                href={`/docs/${provider}/${component.name}`}
                className="group border border-border rounded-lg p-5 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {component.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {component.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <code className="bg-muted px-2 py-1 rounded border border-border">
                      @elements/{component.name}
                    </code>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
