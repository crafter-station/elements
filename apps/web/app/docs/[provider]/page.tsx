import type { Metadata } from "next";
import { notFound } from "next/navigation";

import rehypeShiki from "@shikijs/rehype";
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { ProviderIcon } from "@/lib/providers";
import { providersSource } from "@/lib/providers-source";
import {
  getComponentsByProvider,
  getProviderMetadata,
  getProviders,
} from "@/lib/registry-loader";

import { ComponentPageHero } from "@/components/component-page/hero";

import { getMDXComponents } from "@/mdx-components";
import vesperDark from "@/public/vesper-dark.json";
import vesperLight from "@/public/vesper-light.json";

// Generate static params for all providers
export async function generateStaticParams() {
  const providers = getProviders();

  // Filter out logos since it has its own special page
  return providers
    .filter((p) => p !== "logos")
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

  // Try to get MDX content
  const mdxPage = providersSource.getPage([provider]);

  // Generate install command for the full suite
  const bundleComponent = components.find(
    (c) => c.type === "registry:block" && c.files?.length === 0,
  );

  const installCommand = bundleComponent
    ? `@elements/${bundleComponent.name}`
    : `@elements/${components[0]?.name || provider}`;

  return (
    <div className="flex-1 w-full border-border border-dotted border-x">
      <ul className="hidden ml-4 list-outside list-disc whitespace-normal">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
      <ComponentPageHero
        brandColor={metadata.brandColor}
        darkBrandColor={metadata.darkBrandColor}
        category={metadata.category}
        name={metadata.displayName}
        description={metadata.description}
        icon={<ProviderIcon provider={provider} />}
        installCommand={installCommand}
        provider={provider}
        mdxContent={mdxPage?.data.body}
      />

      {mdxPage ? (
        <article className="prose prose-gray dark:prose-invert max-w-5xl mx-auto px-8 py-12">
          <MDXRemote
            source={mdxPage.data.body}
            components={getMDXComponents()}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  [
                    rehypeShiki,
                    {
                      themes: {
                        light: vesperLight,
                        dark: vesperDark,
                      },
                      defaultColor: false,
                      transformers: [
                        transformerNotationDiff({
                          matchAlgorithm: "v3",
                        }),
                        transformerNotationHighlight({
                          matchAlgorithm: "v3",
                        }),
                        transformerNotationFocus({
                          matchAlgorithm: "v3",
                        }),
                        transformerNotationErrorLevel(),
                      ],
                    },
                  ],
                ],
              },
            }}
          />
        </article>
      ) : (
        <article className="prose prose-gray dark:prose-invert max-w-5xl mx-auto px-8 py-12">
          <h2>Components</h2>
          <p>
            This provider includes {components.length} component
            {components.length !== 1 ? "s" : ""}.
          </p>
          <div className="grid gap-6 not-prose">
            {components.map((component) => (
              <div
                key={component.name}
                className="border border-border rounded-lg p-6 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{component.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {component.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    @elements/{component.name}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </article>
      )}
    </div>
  );
}
