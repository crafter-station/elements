import { getLogoComponents } from "@/lib/registry-loader";

import { LogosClient } from "./logos-client";

export default function TechLogosPage() {
  // Server-side data loading - no useEffect needed!
  const logoItems = getLogoComponents();

  // Transform registry items to logo format
  const logos = logoItems.map((item) => {
    // Get the first category that's not "logo" or "brand"
    const specificCategory = item.categories?.find(
      (cat) => cat !== "logo" && cat !== "brand",
    );

    return {
      id: item.name,
      name: item.name,
      displayName: item.title.replace(" Logo", "").trim(),
      category: specificCategory || item.categories?.[0] || "Other",
    };
  });

  return <LogosClient logos={logos} />;
}
