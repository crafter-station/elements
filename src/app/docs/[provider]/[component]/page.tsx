import { readFile } from "node:fs/promises";
import { join } from "node:path";

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

import {
  getAdjacentComponents,
  getComponentsByProvider,
  getProviderMetadata,
  getProviders,
} from "@/lib/registry-loader";

import { ComponentInstallDockWrapper } from "@/components/component-page/install-dock-wrapper";
import { PrevNextNav } from "@/components/component-page/prev-next-nav";
import { LLMCopyButton, ViewOptions } from "@/components/docs/llm-actions";
import { TableOfContents } from "@/components/table-of-contents";
import { ThemeAwarePattern } from "@/components/theme-aware-brand";

import vesperDark from "@/data/vesper-dark.json";
import vesperLight from "@/data/vesper-light.json";
import { getMDXComponents } from "@/mdx-components";

// Helper to load component MDX and strip frontmatter
async function loadComponentMDX(provider: string, component: string) {
  try {
    const mdxPath = join(
      process.cwd(),
      "src/content/components",
      provider,
      `${component}.mdx`,
    );
    const content = await readFile(mdxPath, "utf-8");

    // Strip frontmatter (everything between --- markers)
    const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
    const contentWithoutFrontmatter = content.replace(frontmatterRegex, "");

    return contentWithoutFrontmatter;
  } catch (_error) {
    return null;
  }
}

// Generate static params for all provider/component combinations
export async function generateStaticParams() {
  const providers = getProviders();
  const params: { provider: string; component: string }[] = [];

  for (const provider of providers) {
    if (provider === "logos" || provider === "clerk") continue;

    const components = getComponentsByProvider(provider);
    for (const component of components) {
      params.push({
        provider,
        component: component.name,
      });
    }
  }

  return params;
}

interface ComponentPageProps {
  params: Promise<{ provider: string; component: string }>;
}

export async function generateMetadata(
  props: ComponentPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const { provider, component } = params;

  const providerMetadata = getProviderMetadata(provider);
  const components = getComponentsByProvider(provider);
  const componentData = components.find((c) => c.name === component);

  if (!componentData) {
    return {};
  }

  return {
    title: `${componentData.title} - ${providerMetadata.displayName} - Elements`,
    description: componentData.description,
    keywords: [
      componentData.title,
      providerMetadata.displayName,
      "component",
      "React",
      "Next.js",
      "TypeScript",
    ],
    authors: [{ name: "Railly Hugo", url: "https://github.com/Railly" }],
    creator: "Railly Hugo",
    publisher: "Railly Hugo",
    alternates: {
      canonical: `https://tryelements.dev/docs/${provider}/${component}`,
    },
  };
}

export default async function ComponentPage(props: ComponentPageProps) {
  const params = await props.params;
  const { provider, component } = params;

  const components = getComponentsByProvider(provider);
  const componentData = components.find((c) => c.name === component);

  if (!componentData) {
    notFound();
  }

  // Load MDX content for this specific component
  const mdxContent = await loadComponentMDX(provider, component);
  const providerMetadata = getProviderMetadata(provider);

  // Calculate previous and next components (including cross-provider navigation)
  const { previous: previousComponent, next: nextComponent } =
    getAdjacentComponents(provider, component);

  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        {/* Component Hero */}
        <div className="relative overflow-hidden border-b border-border border-dotted">
          <ThemeAwarePattern
            brandColor={providerMetadata.brandColor}
            darkBrandColor={providerMetadata.darkBrandColor}
          />

          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
            {/* Breadcrumb + Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6">
              <div className="text-xs sm:text-sm text-muted-foreground">
                <a
                  href={`/docs/${provider}`}
                  className="hover:text-foreground transition-colors"
                >
                  {providerMetadata.displayName}
                </a>
                <span className="mx-1.5 sm:mx-2">/</span>
                <span className="text-foreground">{componentData.title}</span>
              </div>

              {mdxContent && (
                <div className="flex items-center gap-2">
                  <LLMCopyButton mdxContent={mdxContent} />
                  <ViewOptions
                    markdownUrl={`https://raw.githubusercontent.com/crafter-station/elements/main/src/content/components/${provider}/${component}.mdx`}
                    githubUrl={`https://github.com/crafter-station/elements/blob/main/src/content/components/${provider}/${component}.mdx`}
                  />
                </div>
              )}
            </div>

            {/* Title & Description */}
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

        {/* MDX Content */}
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

          {/* Previous/Next Navigation */}
          <PrevNextNav
            previous={
              previousComponent
                ? {
                    title: previousComponent.title,
                    href: `/docs/${previousComponent.provider}/${previousComponent.component}`,
                  }
                : undefined
            }
            next={
              nextComponent
                ? {
                    title: nextComponent.title,
                    href: `/docs/${nextComponent.provider}/${nextComponent.component}`,
                  }
                : undefined
            }
          />
        </article>
      </div>

      {/* Right TOC - Desktop only */}
      <aside className="hidden xl:block w-64 shrink-0 sticky top-[71px] h-[calc(100vh-71px)] overflow-y-auto py-8 pr-4">
        <TableOfContents />
      </aside>

      {/* Install Dock - Fixed bottom */}
      <ComponentInstallDockWrapper
        componentName={component}
        category={providerMetadata.category}
        providerName={providerMetadata.displayName}
      />
    </div>
  );
}
