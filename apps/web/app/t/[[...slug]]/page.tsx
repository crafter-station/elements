import fs from "node:fs";
import path from "node:path";

import { notFound, redirect } from "next/navigation";

import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { ComponentHero } from "@/components/component-hero";
import { ComponentPageTemplate } from "@/components/component-page-template";
import { ComponentPreview } from "@/components/component-preview";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ServerIcon } from "@/components/icons/server";
// MDX Components that can be used in .mdx files
import { ShieldIcon } from "@/components/icons/shield";
import { ZapIcon } from "@/components/icons/zap";
import { MDXComponentPage } from "@/components/mdx-component-page";
import { TableOfContents } from "@/components/table-of-contents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Import page components for backwards compatibility
// These now use the dynamic [provider] route
import LogosPage from "../../l/logos/page";

interface PageProps {
  params: {
    slug?: string[];
  };
}

interface Frontmatter {
  title: string;
  description: string;
  category?: string;
  brandColor?: string;
  darkBrandColor?: string;
  icon?: string;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  installCommand?: string;
  showRegistryVisualizer?: boolean;
  layout?: {
    type: "auto" | "custom";
    columns?: 1 | 2 | 3 | 4;
    gap?: "sm" | "md" | "lg";
  };
}

const CONTENT_DIR = path.join(process.cwd(), "src/content");

// Legacy routing map for backwards compatibility
const LEGACY_ROUTES = {
  clerk: ClerkPage,
  logos: LogosPage,
  polar: PolarPage,
  "theme-switcher": ThemeSwitcherPage,
  trigger: TriggerPage,
  uploadthing: UploadthingPage,
};

async function getContentData(slug: string[]): Promise<{
  content: string;
  frontmatter: Frontmatter;
} | null> {
  try {
    const filePath = `${path.join(CONTENT_DIR, ...slug)}.mdx`;

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      content,
      frontmatter: data as Frontmatter,
    };
  } catch {
    return null;
  }
}

export default async function DocumentationPage({ params }: PageProps) {
  const { slug = [] } = params;

  // Handle root /t route
  if (slug.length === 0) {
    // TODO: Create a main docs index page
    notFound();
  }

  const _slugPath = slug.join("/");

  // Check for MDX content first
  const contentData = await getContentData(slug);

  if (contentData) {
    const { content } = contentData;

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex-1 w-full border-border border-dotted sm:border-x mx-auto">
          <div className="flex">
            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <div className="">
                <article className="prose prose-slate dark:prose-invert max-w-none">
                  <MDXRemote
                    source={content}
                    options={{
                      mdxOptions: {
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [
                          rehypeSlug,
                          [
                            rehypeAutolinkHeadings,
                            {
                              behavior: "wrap",
                              properties: {
                                className: ["anchor"],
                              },
                            },
                          ],
                        ],
                      },
                    }}
                    components={{
                      // Make these components available in MDX
                      MDXComponentPage,
                      ComponentPageTemplate,
                      ComponentHero,
                      ComponentPreview,
                      ShieldIcon,
                      ServerIcon,
                      ZapIcon,
                      Badge,
                      Button,
                      // HTML elements with better styling
                      h1: ({ children, ...props }) => (
                        <h1
                          className="text-3xl font-bold tracking-tight mb-6"
                          {...props}
                        >
                          {children}
                        </h1>
                      ),
                      h2: ({ children, ...props }) => (
                        <h2
                          className="text-2xl font-semibold mb-4 mt-8"
                          {...props}
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ children, ...props }) => (
                        <h3
                          className="text-xl font-medium mb-3 mt-6"
                          {...props}
                        >
                          {children}
                        </h3>
                      ),
                      p: ({ children, ...props }) => (
                        <p className="mb-4 leading-7" {...props}>
                          {children}
                        </p>
                      ),
                      ul: ({ children, ...props }) => (
                        <ul
                          className="list-disc list-inside mb-4 space-y-2"
                          {...props}
                        >
                          {children}
                        </ul>
                      ),
                      ol: ({ children, ...props }) => (
                        <ol
                          className="list-decimal list-inside mb-4 space-y-2"
                          {...props}
                        >
                          {children}
                        </ol>
                      ),
                      li: ({ children, ...props }) => (
                        <li className="leading-7" {...props}>
                          {children}
                        </li>
                      ),
                      code: ({ children, ...props }) => (
                        <code
                          className="bg-muted px-2 py-1 rounded text-sm font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      ),
                      pre: ({ children, ...props }) => (
                        <pre
                          className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm"
                          {...props}
                        >
                          {children}
                        </pre>
                      ),
                    }}
                  />
                </article>
              </div>
            </main>

            {/* Table of Contents */}
            <aside className="hidden xl:block w-64 flex-shrink-0">
              <div className="sticky top-16 p-6">
                <TableOfContents />
              </div>
            </aside>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Fall back to legacy routing for backwards compatibility
  if (
    slug.length === 1 &&
    LEGACY_ROUTES[slug[0] as keyof typeof LEGACY_ROUTES]
  ) {
    const LegacyComponent =
      LEGACY_ROUTES[slug[0] as keyof typeof LEGACY_ROUTES];
    return <LegacyComponent />;
  }

  // If no content found, return 404
  notFound();
}

export async function generateStaticParams() {
  // TODO: Generate static params for all MDX files
  return [];
}
