import { providers } from "@/lib/providers";

import { ComponentCard } from "@/components/component-card";

const trackingSource = "homepage_gallery" as const;

export function GallerySection() {
  return (
    <div
      id="gallery"
      className="w-full py-16 border-t border-border border-dotted px-8"
    >
      <div className="space-y-8">
        <div className="grid gap-4 place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <ComponentCard
              key={provider.name}
              name={provider.name}
              description={provider.description}
              icon={provider.icon}
              category={provider.category}
              brandColor={provider.brandColor}
              isEnabled={provider.isEnabled}
              href={provider.href}
              elementsCount={provider.elementsCount}
              providerLink={provider.providerLink}
              trackingSource={trackingSource}
              status={provider.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
