import type { MetadataRoute } from "next";

import {
  getAIElementsSubcategories,
  getComponentsByProvider,
  getComponentsBySubcategory,
  getProviders,
} from "@/lib/registry-loader";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tryelements.dev";
  const now = new Date();

  const urls: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    // Docs landing
    {
      url: `${baseUrl}/docs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Logos page (special)
    {
      url: `${baseUrl}/docs/logos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Add all provider pages
  const providers = getProviders();
  for (const provider of providers) {
    // Skip logos (handled separately) and ai-elements (has subcategories)
    if (provider === "logos" || provider === "ai-elements") {
      continue;
    }

    urls.push({
      url: `${baseUrl}/docs/${provider}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // Add all component pages for this provider
    const components = getComponentsByProvider(provider);
    for (const component of components) {
      urls.push({
        url: `${baseUrl}/docs/${provider}/${component.name}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  // Add AI Elements subcategory pages
  const subcategories = getAIElementsSubcategories();
  for (const subcategory of subcategories) {
    urls.push({
      url: `${baseUrl}/docs/ai-elements/${subcategory}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });

    // Add all component pages for this subcategory
    const components = getComponentsBySubcategory(subcategory);
    for (const component of components) {
      urls.push({
        url: `${baseUrl}/docs/ai-elements/${subcategory}/${component.name}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return urls;
}
