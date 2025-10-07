import { notFound } from "next/navigation";

import { getPreviewComponent } from "@/lib/component-preview-map.generated";
import { ProviderIcon } from "@/lib/providers";
import {
  getComponentsByProvider,
  getProviderMetadata,
  getProviders,
  type RegistryItem,
} from "@/lib/registry-loader";

import { ComponentPageTemplate } from "@/components/component-page-template";

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

  // Extract features from first component's docs or generate generic ones
  const features = generateFeatures(provider, components);

  // Generate install command for the full suite
  const bundleComponent = components.find(
    (c) => c.type === "registry:block" && c.files?.length === 0,
  );

  const installCommand = bundleComponent
    ? `@elements/${bundleComponent.name}`
    : `@elements/${components[0]?.name || provider}`;

  // Build component map for ComponentPageTemplate
  const componentMap: Record<string, React.ReactNode> = {};
  const componentInstallUrls: Record<string, string> = {};

  for (const component of components) {
    // Skip bundle items (meta-packages with no files)
    if (component.type === "registry:block" && component.files?.length === 0) {
      continue;
    }

    // Use component name as key
    const key = component.name;

    // Store install URL
    componentInstallUrls[key] = `@elements/${component.name}`;

    // Automatically get component preview from generated map
    const PreviewComponent = getPreviewComponent(component.name);

    if (PreviewComponent) {
      componentMap[key] = <PreviewComponent />;
    } else {
      // Fallback for components without previews (lib, hooks, etc.)
      componentMap[key] = (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">{component.title}</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {component.description}
            </p>
          </div>
          {component.docs && (
            <div className="bg-muted/50 rounded-lg p-4 max-w-lg">
              <p className="text-xs text-muted-foreground">{component.docs}</p>
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <ComponentPageTemplate
      brandColor={metadata.brandColor}
      darkBrandColor={metadata.darkBrandColor}
      category={metadata.category}
      name={metadata.displayName}
      description={metadata.description}
      icon={<ProviderIcon provider={provider} />}
      features={features}
      technicalDetails={features} // Reuse features for now
      installCommand={installCommand}
      usageExample={generateUsageExample(provider, components[0])}
      components={componentMap}
      componentInstallUrls={componentInstallUrls}
      layout={{ type: "auto", columns: 1, gap: "lg" }}
      showRegistryVisualizer={false}
    />
  );
}

// Helper: Generate features from components
function generateFeatures(_provider: string, components: RegistryItem[]) {
  const icons = {
    zap: (
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <title>Zap Icon</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    server: (
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <title>Server Icon</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
        />
      </svg>
    ),
    shield: (
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <title>Shield Icon</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  };

  return components.slice(0, 3).map((comp, i) => ({
    icon: [icons.zap, icons.server, icons.shield][i] || icons.zap,
    title: comp.title,
    description: comp.description,
  }));
}

// Helper: Generate usage example
function generateUsageExample(
  provider: string,
  firstComponent: RegistryItem | undefined,
): string {
  if (!firstComponent) return "";

  const componentName = firstComponent.name
    .split("-")
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  return `<span class="text-blue-400">import</span>
<span class="text-foreground"> { ${componentName} } </span>
<span class="text-blue-400">from</span>
<span class="text-green-400"> "@/components/${provider}/${firstComponent.name}"</span>`;
}
