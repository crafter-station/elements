import { notFound } from "next/navigation";

import { ProviderIcon } from "@/lib/providers";
import {
  getComponentsByProvider,
  getProviderMetadata,
  getProviders,
} from "@/lib/registry-loader";

import { Badge } from "@/components/ui/badge";

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
    <div className="w-full max-w-screen-xl mx-auto">
      {/* Hero Section */}
      <div className="border-b border-border py-12 px-8">
        <div className="flex items-start gap-6">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-lg"
            style={{
              backgroundColor: `${metadata.brandColor}20`,
            }}
          >
            <ProviderIcon provider={provider} />
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">{metadata.displayName}</h1>
                <Badge variant="secondary">{metadata.category}</Badge>
              </div>
              <p className="text-lg text-muted-foreground">
                {metadata.description}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{components.length} components</span>
            </div>
          </div>
        </div>
      </div>

      {/* Markdown Content */}
      <article className="prose prose-gray dark:prose-invert max-w-none px-8 py-12">
        <h2>Components</h2>
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
                <Badge variant="outline" className="shrink-0">
                  {component.type.replace("registry:", "")}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  @elements/{component.name}
                </code>
              </div>

              {component.docs && (
                <div className="text-sm text-muted-foreground border-l-2 border-muted pl-4">
                  {component.docs}
                </div>
              )}
            </div>
          ))}
        </div>

        <h2>Installation</h2>
        <p>Install any component using the Elements CLI:</p>
        <pre>
          <code>bunx shadcn@latest add @elements/[component-name]</code>
        </pre>

        <h2>Usage</h2>
        <p>
          Import and use the components in your React application. Check each
          component's documentation for specific usage examples.
        </p>
      </article>
    </div>
  );
}
