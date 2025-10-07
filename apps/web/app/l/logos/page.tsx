import { getLogoComponents } from "@/lib/registry-loader";

import { LogosClient } from "./logos-client";

export default function TechLogosPage() {
  // Server-side data loading - no useEffect needed!
  const logoItems = getLogoComponents();

  // Transform registry items to logo format
  const logos = logoItems.map((item) => ({
    id: item.name,
    name: item.name,
    displayName: item.title.replace(" Logo", "").trim(),
    category: item.categories?.[0] || "Other",
  }));

  return <LogosClient logos={logos} />;
}
