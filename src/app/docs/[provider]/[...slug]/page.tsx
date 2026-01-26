import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import rehypeShiki from "@shikijs/rehype";
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import { ArrowRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import {
  AI_ELEMENTS_SUBCATEGORIES,
  type AIElementsSubcategory,
  getAdjacentComponents,
  getComponentsByProvider,
  getComponentsBySubcategory,
  getProviderMetadata,
  getProviders,
  getSubcategoryMetadata,
} from "@/lib/registry-loader";

import { ComponentInstallDockWrapper } from "@/components/component-page/install-dock-wrapper";
import { PrevNextNav } from "@/components/component-page/prev-next-nav";
import { LLMCopyButton, ViewOptions } from "@/components/docs/llm-actions";
import { ScrambleText } from "@/components/scramble-text";
import { BreadcrumbSchema } from "@/components/structured-data";
import { TableOfContents } from "@/components/table-of-contents";
import { ThemeAwarePattern } from "@/components/theme-aware-brand";

import vesperDark from "@/data/vesper-dark.json";
import vesperLight from "@/data/vesper-light.json";
import { getMDXComponents } from "@/mdx-components";

async function loadComponentMDX(
  provider: string,
  component: string,
  subcategory?: string,
) {
  try {
    const mdxPath = subcategory
      ? join(
          process.cwd(),
          "src/content/components",
          provider,
          subcategory,
          `${component}.mdx`,
        )
      : join(
          process.cwd(),
          "src/content/components",
          provider,
          `${component}.mdx`,
        );
    const content = await readFile(mdxPath, "utf-8");

    const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
    const contentWithoutFrontmatter = content.replace(frontmatterRegex, "");

    return contentWithoutFrontmatter;
  } catch (_error) {
    return null;
  }
}

export async function generateStaticParams() {
  const providers = getProviders();
  const params: { provider: string; slug: string[] }[] = [];

  for (const provider of providers) {
    if (provider === "logos" || provider === "clerk") continue;

    if (provider === "ai-elements") {
      const subcategories = Object.keys(
        AI_ELEMENTS_SUBCATEGORIES,
      ) as AIElementsSubcategory[];

      for (const subcategory of subcategories) {
        params.push({
          provider,
          slug: [subcategory],
        });

        const components = getComponentsBySubcategory(subcategory);
        for (const component of components) {
          params.push({
            provider,
            slug: [subcategory, component.name],
          });
        }
      }
    } else {
      const components = getComponentsByProvider(provider);
      for (const component of components) {
        params.push({
          provider,
          slug: [component.name],
        });
      }
    }
  }

  return params;
}

interface SlugPageProps {
  params: Promise<{ provider: string; slug: string[] }>;
}

function parseSlug(
  provider: string,
  slug: string[],
): {
  type: "subcategory" | "component";
  subcategory?: string;
  component?: string;
} | null {
  if (provider === "ai-elements") {
    if (slug.length === 1) {
      const subcategory = slug[0];
      if (subcategory in AI_ELEMENTS_SUBCATEGORIES) {
        return { type: "subcategory", subcategory };
      }
      return null;
    }
    if (slug.length === 2) {
      const [subcategory, component] = slug;
      if (subcategory in AI_ELEMENTS_SUBCATEGORIES) {
        return { type: "component", subcategory, component };
      }
      return null;
    }
    return null;
  }

  if (slug.length === 1) {
    return { type: "component", component: slug[0] };
  }

  return null;
}

export async function generateMetadata(
  props: SlugPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const { provider, slug } = params;

  const parsed = parseSlug(provider, slug);
  if (!parsed) return {};

  const providerMetadata = getProviderMetadata(provider);

  if (parsed.type === "subcategory" && parsed.subcategory) {
    const subcategoryMeta = getSubcategoryMetadata(parsed.subcategory);
    const canonicalUrl = `https://tryelements.dev/docs/${provider}/${parsed.subcategory}`;
    const title = `${subcategoryMeta.displayName} - ${providerMetadata.displayName} - Elements`;
    return {
      title,
      description: subcategoryMeta.description,
      keywords: [
        subcategoryMeta.displayName,
        providerMetadata.displayName,
        "AI",
        "AI Elements",
        "AI Components",
        "React",
        "Next.js",
        "TypeScript",
        "shadcn/ui",
      ],
      authors: [{ name: "Railly Hugo", url: "https://github.com/Railly" }],
      creator: "Railly Hugo",
      publisher: "Railly Hugo",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description: subcategoryMeta.description,
        type: "website",
        url: canonicalUrl,
        siteName: "Elements",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: subcategoryMeta.description,
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

  if (parsed.type === "component" && parsed.component) {
    const components =
      provider === "ai-elements" && parsed.subcategory
        ? getComponentsBySubcategory(parsed.subcategory)
        : getComponentsByProvider(provider);

    const componentData = components.find((c) => c.name === parsed.component);

    if (!componentData) return {};

    const canonicalUrl =
      provider === "ai-elements" && parsed.subcategory
        ? `https://tryelements.dev/docs/${provider}/${parsed.subcategory}/${parsed.component}`
        : `https://tryelements.dev/docs/${provider}/${parsed.component}`;

    const title = `${componentData.title} - ${providerMetadata.displayName} - Elements`;
    const subcategoryMeta = parsed.subcategory
      ? getSubcategoryMetadata(parsed.subcategory)
      : null;

    return {
      title,
      description: componentData.description,
      keywords: [
        componentData.title,
        providerMetadata.displayName,
        ...(subcategoryMeta ? [subcategoryMeta.displayName] : []),
        "component",
        "React",
        "Next.js",
        "TypeScript",
        "shadcn/ui",
      ],
      authors: [{ name: "Railly Hugo", url: "https://github.com/Railly" }],
      creator: "Railly Hugo",
      publisher: "Railly Hugo",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description: componentData.description,
        type: "article",
        url: canonicalUrl,
        siteName: "Elements",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: componentData.description,
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

  return {};
}

function SubcategoryPage({
  provider,
  subcategory,
}: {
  provider: string;
  subcategory: string;
}) {
  const providerMetadata = getProviderMetadata(provider);
  const subcategoryMeta = getSubcategoryMetadata(subcategory);
  const components = getComponentsBySubcategory(subcategory);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://tryelements.dev" },
          { name: "Docs", url: "https://tryelements.dev/docs" },
          {
            name: providerMetadata.displayName,
            url: `https://tryelements.dev/docs/${provider}`,
          },
          {
            name: subcategoryMeta.displayName,
            url: `https://tryelements.dev/docs/${provider}/${subcategory}`,
          },
        ]}
      />
      <div className="flex-1 w-full">
        <div className="border-b border-border border-dotted">
          <div className="px-4 sm:px-6 md:px-8 py-8 md:py-10">
            <div className="max-w-6xl space-y-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/docs/${provider}`}
                  className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  {providerMetadata.displayName}
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-foreground">
                  {subcategoryMeta.displayName}
                </span>
              </div>

              <h1>
                <ScrambleText
                  text={subcategoryMeta.displayName}
                  className="font-dotted font-black text-3xl md:text-4xl leading-none"
                />
              </h1>

              <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
                {subcategoryMeta.description}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-8">
          <div className="max-w-6xl">
            <div className="mb-6">
              <h2 className="text-base font-medium mb-1">
                Elements ({components.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                Browse all {subcategoryMeta.displayName.toLowerCase()}{" "}
                components
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {components.map((component) => (
                <Link
                  key={component.name}
                  href={`/docs/${provider}/${subcategory}/${component.name}`}
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
    </>
  );
}

async function ComponentPage({
  provider,
  component,
  subcategory,
}: {
  provider: string;
  component: string;
  subcategory?: string;
}) {
  const components =
    provider === "ai-elements" && subcategory
      ? getComponentsBySubcategory(subcategory)
      : getComponentsByProvider(provider);

  const componentData = components.find((c) => c.name === component);

  if (!componentData) {
    notFound();
  }

  const mdxContent = await loadComponentMDX(provider, component, subcategory);
  const providerMetadata = getProviderMetadata(provider);

  const { previous: previousComponent, next: nextComponent } =
    getAdjacentComponents(provider, component);

  const breadcrumbHref =
    provider === "ai-elements" && subcategory
      ? `/docs/${provider}/${subcategory}`
      : `/docs/${provider}`;

  const breadcrumbLabel =
    provider === "ai-elements" && subcategory
      ? `${providerMetadata.displayName} / ${getSubcategoryMetadata(subcategory).displayName}`
      : providerMetadata.displayName;

  const mdxPathSuffix =
    provider === "ai-elements" && subcategory
      ? `${provider}/${subcategory}/${component}.mdx`
      : `${provider}/${component}.mdx`;

  const getPrevNextHref = (
    item: { provider: string; component: string } | null,
  ) => {
    if (!item) return undefined;
    if (item.provider === "ai-elements") {
      const comp = getComponentsByProvider("ai-elements").find(
        (c) => c.name === item.component,
      );
      if (comp?.subcategory) {
        return `/docs/${item.provider}/${comp.subcategory}/${item.component}`;
      }
    }
    return `/docs/${item.provider}/${item.component}`;
  };

  // Build breadcrumb items for structured data
  const breadcrumbItems =
    provider === "ai-elements" && subcategory
      ? [
          { name: "Home", url: "https://tryelements.dev" },
          { name: "Docs", url: "https://tryelements.dev/docs" },
          {
            name: providerMetadata.displayName,
            url: `https://tryelements.dev/docs/${provider}`,
          },
          {
            name: getSubcategoryMetadata(subcategory).displayName,
            url: `https://tryelements.dev/docs/${provider}/${subcategory}`,
          },
          {
            name: componentData.title,
            url: `https://tryelements.dev/docs/${provider}/${subcategory}/${component}`,
          },
        ]
      : [
          { name: "Home", url: "https://tryelements.dev" },
          { name: "Docs", url: "https://tryelements.dev/docs" },
          {
            name: providerMetadata.displayName,
            url: `https://tryelements.dev/docs/${provider}`,
          },
          {
            name: componentData.title,
            url: `https://tryelements.dev/docs/${provider}/${component}`,
          },
        ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <div className="relative overflow-hidden border-b border-border border-dotted">
            <ThemeAwarePattern
              brandColor={providerMetadata.brandColor}
              darkBrandColor={providerMetadata.darkBrandColor}
            />

            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  <a
                    href={breadcrumbHref}
                    className="hover:text-foreground transition-colors"
                  >
                    {breadcrumbLabel}
                  </a>
                  <span className="mx-1.5 sm:mx-2">/</span>
                  <span className="text-foreground">{componentData.title}</span>
                </div>

                {mdxContent && (
                  <div className="flex items-center gap-2">
                    <LLMCopyButton mdxContent={mdxContent} />
                    <ViewOptions
                      markdownUrl={`https://raw.githubusercontent.com/crafter-station/elements/main/src/content/components/${mdxPathSuffix}`}
                      githubUrl={`https://github.com/crafter-station/elements/blob/main/src/content/components/${mdxPathSuffix}`}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h1 className="font-dotted font-black text-2xl sm:text-3xl md:text-4xl leading-tight">
                  {componentData.title}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                  {componentData.description}
                </p>
              </div>
            </div>
          </div>

          <article className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pb-24">
            {mdxContent ? (
              <MDXRemote
                source={mdxContent}
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
                          cssVariablePrefix: "--shiki-",
                          transformers: [
                            transformerNotationHighlight({
                              matchAlgorithm: "v3",
                            }),
                            transformerNotationDiff({
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
            ) : (
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h2>Overview</h2>
                <p>
                  Documentation for {componentData.title} will be available here
                  soon.
                </p>

                <h2>Installation</h2>
                <pre>
                  <code>npx shadcn@latest add @elements/{component}</code>
                </pre>

                <h2>Usage</h2>
                <p>Import and use the element in your application:</p>
                <pre>
                  <code>{`import { ${componentData.title.replace(/\s+/g, "")} } from "@/components/elements/${provider}/${component}";`}</code>
                </pre>
              </div>
            )}

            <PrevNextNav
              previous={
                previousComponent
                  ? {
                      title: previousComponent.title,
                      href: getPrevNextHref(previousComponent) || "#",
                    }
                  : undefined
              }
              next={
                nextComponent
                  ? {
                      title: nextComponent.title,
                      href: getPrevNextHref(nextComponent) || "#",
                    }
                  : undefined
              }
            />
          </article>
        </div>

        <aside className="hidden xl:block w-64 shrink-0 sticky top-[71px] h-[calc(100vh-71px)] overflow-y-auto py-8 pr-4">
          <TableOfContents />
        </aside>

        <ComponentInstallDockWrapper
          componentName={component}
          category={providerMetadata.category}
          providerName={providerMetadata.displayName}
        />
      </div>
    </>
  );
}

export default async function SlugPage(props: SlugPageProps) {
  const params = await props.params;
  const { provider, slug } = params;

  const parsed = parseSlug(provider, slug);
  if (!parsed) {
    notFound();
  }

  if (parsed.type === "subcategory" && parsed.subcategory) {
    return (
      <SubcategoryPage provider={provider} subcategory={parsed.subcategory} />
    );
  }

  if (parsed.type === "component" && parsed.component) {
    return (
      <ComponentPage
        provider={provider}
        component={parsed.component}
        subcategory={parsed.subcategory}
      />
    );
  }

  notFound();
}
