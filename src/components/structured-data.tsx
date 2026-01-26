interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe - we control the data object, standard pattern for JSON-LD
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Pre-built schemas for common use cases

export function WebsiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Elements",
    url: "https://tryelements.dev",
    description:
      "Production-ready full stack components for modern web applications. Built with React, TypeScript, and Tailwind CSS.",
    author: {
      "@type": "Person",
      name: "Railly Hugo",
      url: "https://github.com/Railly",
    },
  };

  return <StructuredData data={data} />;
}

export function SoftwareApplicationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Elements",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    description:
      "Production-ready full stack components for modern web applications. Built with React, TypeScript, and Tailwind CSS.",
    url: "https://tryelements.dev",
    author: {
      "@type": "Person",
      name: "Railly Hugo",
      url: "https://github.com/Railly",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return <StructuredData data={data} />;
}

export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Crafter Station",
    url: "https://crafterstation.com",
    logo: "https://tryelements.dev/icon.svg",
    sameAs: [
      "https://github.com/crafter-station",
      "https://twitter.com/raillyhugo",
    ],
  };

  return <StructuredData data={data} />;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <StructuredData data={data} />;
}
